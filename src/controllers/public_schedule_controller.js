import { publicScheduleService as defaultPublicScheduleService } from '../services/public_schedule_service.js';
import { publicationLogService as defaultPublicationLogService } from '../services/publication_log_service.js';
import { performanceService as defaultPerformanceService } from '../services/performance_service.js';

const RENDER_ERROR_MESSAGE = 'Schedule could not be displayed. Please try again later.';
const TIMEOUT_MESSAGE = 'Schedule loading timed out. Please try again later.';

export function createPublicScheduleController({
  view,
  publicScheduleService = defaultPublicScheduleService,
  publicationLogService = defaultPublicationLogService,
  performanceService = defaultPerformanceService,
  timeoutMs = 3000,
}) {
  function show(conferenceId) {
    view.setStatus('', false);
    view.setLoading(false);
    const result = publicScheduleService.getPublicSchedule({ conferenceId });
    if (!result.ok) {
      view.setPending('Schedule not available yet.');
      return;
    }
    view.setLoading(true);
    const startTime = performanceService.now();
    try {
      view.renderSchedule({
        entries: result.entries,
        unscheduled: result.unscheduled,
        lastUpdatedAt: result.lastUpdatedAt,
      });
    } catch (error) {
      view.setLoading(false);
      view.setStatus(RENDER_ERROR_MESSAGE, true);
      publicationLogService.logFailure({
        context: 'render',
        errorMessage: error && error.message ? error.message : 'render_failed',
        relatedId: conferenceId || (result.schedule && result.schedule.id) || 'public_schedule',
      });
      return;
    }
    const duration = performanceService.now() - startTime;
    if (duration > timeoutMs) {
      view.setLoading(false);
      view.setStatus(TIMEOUT_MESSAGE, true);
      publicationLogService.logFailure({
        context: 'render_timeout',
        errorMessage: 'render_timeout',
        relatedId: conferenceId || (result.schedule && result.schedule.id) || 'public_schedule',
      });
      return;
    }
    view.setLoading(false);
  }

  return {
    view,
    show,
  };
}
