import { invitationLog } from '../../src/services/invitation-log.js';

test('logs and clears invitation failures', () => {
  invitationLog.clear();
  invitationLog.logFailure({ errorType: 'send_failed', message: 'failed', context: 'inv_1' });
  expect(invitationLog.getFailures()).toHaveLength(1);
  invitationLog.clear();
  expect(invitationLog.getFailures()).toHaveLength(0);
});
