import { createTimeSlot } from '../models/time_slot.js';
import { createScheduleItem } from '../models/schedule_item.js';

function buildTimeSlots({ dateRange, rooms, slotDurationMinutes } = {}) {
  if (!dateRange || !rooms || !slotDurationMinutes) {
    return [];
  }
  const start = Date.parse(dateRange.start);
  const end = Date.parse(dateRange.end);
  if (Number.isNaN(start) || Number.isNaN(end) || start >= end) {
    return [];
  }
  const durationMs = slotDurationMinutes * 60 * 1000;
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return [];
  }
  const slots = [];
  rooms.forEach((room) => {
    let cursor = start;
    while (cursor + durationMs <= end) {
      slots.push(createTimeSlot({
        startTime: new Date(cursor).toISOString(),
        endTime: new Date(cursor + durationMs).toISOString(),
        roomId: room.roomId || room.id || room.name,
      }));
      cursor += durationMs;
    }
  });
  return slots;
}

function hasSlotConflicts(slots = []) {
  const seen = new Set();
  return slots.some((slot) => {
    const key = `${slot.roomId}::${slot.startTime}`;
    if (seen.has(key)) {
      return true;
    }
    seen.add(key);
    return false;
  });
}

export const scheduleGenerator = {
  generate({ conference, papers = [], clock = () => Date.now(), maxDurationMs = 120000 } = {}) {
    if (!conference) {
      return { ok: false, reason: 'invalid_conference' };
    }
    const startTime = clock();
    const slots = buildTimeSlots(conference);
    if (!slots.length) {
      return { ok: false, reason: 'invalid_inputs' };
    }
    if (hasSlotConflicts(slots)) {
      return { ok: false, reason: 'conflict' };
    }

    const accepted = Array.isArray(papers)
      ? papers.filter((paper) => paper && paper.status === 'accepted')
      : [];
    const missingMetadata = accepted.filter((paper) => !paper.requiredMetadataComplete);
    const eligible = accepted.filter((paper) => paper.requiredMetadataComplete);

    const items = [];
    const unscheduled = [];
    let slotIndex = 0;

    eligible.forEach((paper) => {
      if (slotIndex >= slots.length) {
        unscheduled.push(createScheduleItem({
          paperId: paper.paperId || paper.id,
          status: 'unscheduled',
          reason: 'capacity_shortfall',
        }));
        return;
      }
      const slot = slots[slotIndex];
      slotIndex += 1;
      items.push(createScheduleItem({
        paperId: paper.paperId || paper.id,
        roomId: slot.roomId,
        slotId: slot.slotId,
        status: 'scheduled',
      }));
    });

    missingMetadata.forEach((paper) => {
      unscheduled.push(createScheduleItem({
        paperId: paper.paperId || paper.id,
        status: 'unscheduled',
        reason: 'missing_metadata',
      }));
    });

    const durationMs = clock() - startTime;
    if (durationMs > maxDurationMs) {
      return { ok: false, reason: 'generation_timeout', durationMs };
    }

    return {
      ok: true,
      items,
      unscheduled,
      totalSlots: slots.length,
      totalAccepted: accepted.length,
    };
  },
};

export const __test__ = {
  buildTimeSlots,
  hasSlotConflicts,
};
