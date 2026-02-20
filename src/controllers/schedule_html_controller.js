import { authService as defaultAuthService } from '../services/auth_service.js';
import { scheduleService as defaultScheduleService } from '../services/schedule_service.js';
import { scheduleRenderer as defaultScheduleRenderer } from '../services/schedule_renderer.js';
import { auditLogService as defaultAuditLogService } from '../services/audit_log_service.js';
import { performanceService as defaultPerformanceService } from '../services/performance_service.js';

const ACCESS_DENIED_MESSAGE = 'Access denied.';

export function createScheduleHtmlController({
  view,
  sessionState,
  authService = defaultAuthService,
  scheduleService = defaultScheduleService,
  scheduleRenderer = defaultScheduleRenderer,
  auditLogService = defaultAuditLogService,
  performanceService = defaultPerformanceService,
  timeoutMs = 2000,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function isAuthorized() {
    const auth = requireAuth();
    if (!auth.ok) {
      return { ok: false, reason: 'unauthenticated' };
    }
    if (!authService.isAdminOrEditor(auth.user)) {
      return { ok: false, reason: 'forbidden', user: auth.user };
    }
    return { ok: true, user: auth.user };
  }

  function show(conferenceId) {
    view.setStatus('', false);
    view.setLoading(false);
    const auth = isAuthorized();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      auditLogService.logScheduleViewDenied({
        conferenceId,
        userId: auth.user ? auth.user.id || auth.user.userId : null,
      });
      return;
    }

    const data = scheduleService.getPublishedSchedule(conferenceId);
    if (!data) {
      view.setEmpty('No schedule available.');
      return;
    }

    const startTime = performanceService.now();
    view.setLoading(true);
    let renderResult;
    try {
      renderResult = scheduleRenderer.renderAgenda({ items: data.items });
    } catch (error) {
      view.setLoading(false);
      view.setStatus('Schedule could not be rendered.', true);
      auditLogService.logScheduleRenderFailed({
        conferenceId,
        message: error && error.message ? error.message : 'render_failed',
      });
      return;
    }
    const duration = performanceService.now() - startTime;
    if (duration > timeoutMs) {
      view.setLoading(false);
      view.setStatus('Schedule rendering timed out.', true);
      auditLogService.logScheduleTimeout({ conferenceId, durationMs: duration });
      return;
    }
    view.setLoading(false);
    view.renderSchedule(renderResult);
  }

  return {
    view,
    show,
  };
}
