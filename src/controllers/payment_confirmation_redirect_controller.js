import { confirmationService as defaultConfirmationService } from '../services/confirmation_service.js';

function resolveSignature(headers = {}) {
  return headers['X-Signature'] || headers['x-signature'] || null;
}

function mapResponse(result) {
  if (!result || result.reason === 'invalid_signature') {
    return { status: 401, body: { result: 'rejected', message: 'invalid_signature' } };
  }
  if (result.result === 'duplicate') {
    return { status: 200, body: { result: 'duplicate', registration_status: result.registration_status || null } };
  }
  if (!result.ok && (result.reason === 'storage_failed' || result.reason === 'status_update_failed')) {
    return { status: 500, body: { result: result.result, message: result.reason } };
  }
  if (!result.ok) {
    return { status: 400, body: { result: result.result, message: result.reason } };
  }
  return { status: 200, body: { result: result.result, registration_status: result.registration_status || null } };
}

export function createPaymentConfirmationRedirectController({
  confirmationService = defaultConfirmationService,
} = {}) {
  function handle({ payload, rawBody = null, headers } = {}) {
    const signature = resolveSignature(headers);
    const result = confirmationService.processConfirmation({
      payload,
      rawBody,
      signature,
      sourceChannel: 'redirect',
    });
    return mapResponse(result);
  }

  return {
    handle,
  };
}
