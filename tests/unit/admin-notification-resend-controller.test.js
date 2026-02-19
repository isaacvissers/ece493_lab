import { jest } from '@jest/globals';
import { createAdminNotificationResendController } from '../../src/controllers/adminNotificationResendController.js';
import { notificationService } from '../../src/services/notification-service.js';
import { adminFlagService } from '../../src/services/admin-flag-service.js';

test('resend resolves flag on success and forwards editorId', () => {
  const notificationService = {
    sendReviewNotifications: jest.fn(() => ({ ok: true, queued: 1 })),
  };
  const adminFlagService = {
    resolveFlag: jest.fn(),
  };
  const controller = createAdminNotificationResendController({ notificationService, adminFlagService });
  const flag = { flagId: 'flag_1', reviewId: 'rev_1', editorId: 'ed_1' };

  const result = controller.resend(flag);

  expect(notificationService.sendReviewNotifications).toHaveBeenCalledWith({
    reviewId: 'rev_1',
    editorId: 'ed_1',
    channels: ['email', 'in_app'],
  });
  expect(adminFlagService.resolveFlag).toHaveBeenCalledWith('flag_1');
  expect(result).toEqual({ ok: true, queued: 1 });
});

test('resend does not resolve flag on failure and defaults editorId to null', () => {
  const notificationService = {
    sendReviewNotifications: jest.fn(() => ({ ok: false, reason: 'network' })),
  };
  const adminFlagService = {
    resolveFlag: jest.fn(),
  };
  const controller = createAdminNotificationResendController({ notificationService, adminFlagService });
  const flag = { flagId: 'flag_2', reviewId: 'rev_2' };

  const result = controller.resend(flag);

  expect(notificationService.sendReviewNotifications).toHaveBeenCalledWith({
    reviewId: 'rev_2',
    editorId: null,
    channels: ['email', 'in_app'],
  });
  expect(adminFlagService.resolveFlag).not.toHaveBeenCalled();
  expect(result).toEqual({ ok: false, reason: 'network' });
});

test('resend uses default services when no overrides are provided', () => {
  notificationService.clear();
  adminFlagService.reset();

  const notifySpy = jest.spyOn(notificationService, 'sendReviewNotifications')
    .mockReturnValue({ ok: true, notification: { reviewId: 'rev_3' } });
  const resolveSpy = jest.spyOn(adminFlagService, 'resolveFlag');
  const controller = createAdminNotificationResendController();

  controller.resend({ flagId: 'flag_3', reviewId: 'rev_3', editorId: 'ed_3' });

  expect(notifySpy).toHaveBeenCalledWith({
    reviewId: 'rev_3',
    editorId: 'ed_3',
    channels: ['email', 'in_app'],
  });
  expect(resolveSpy).toHaveBeenCalledWith('flag_3');

  notifySpy.mockRestore();
  resolveSpy.mockRestore();
});
