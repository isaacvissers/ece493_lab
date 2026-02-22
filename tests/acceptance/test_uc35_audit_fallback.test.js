import { confirmationService } from '../../src/services/confirmation_service.js';
import { auditLogger } from '../../src/services/audit_logger.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset({ auditLogger });
  auditLogger.reset();
});

test('audit logging failure writes fallback entry', () => {
  auditLogger.setFailureMode({ primary: true, fallback: false });
  confirmationService.saveOrder({
    order_id: 'ord_audit',
    attendee_ref: 'att_audit',
    amount: 10,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_audit',
    order_id: 'ord_audit',
    amount: 10,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_audit',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(200);
  expect(auditLogger.getFallbackLogs().length).toBeGreaterThan(0);
});
