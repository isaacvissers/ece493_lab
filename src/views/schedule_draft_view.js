function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function createInputRow({ id, label, type = 'text', placeholder }) {
  const row = createElement('div', 'form-row');
  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', id);
  labelEl.textContent = label;
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.name = id;
  if (placeholder) {
    input.placeholder = placeholder;
  }
  const error = createElement('div', 'error');
  error.id = `${id}-error`;
  input.setAttribute('aria-describedby', `${id}-error`);
  row.append(labelEl, input, error);
  return { row, input, error };
}

export function createScheduleDraftView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Generate schedule';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Provide conference details, then generate a draft schedule.';

  const form = document.createElement('form');
  form.noValidate = true;

  const conferenceRow = createInputRow({
    id: 'conferenceId',
    label: 'Conference ID',
    placeholder: 'conf_2026',
  });

  const startRow = createInputRow({
    id: 'startDate',
    label: 'Start date/time',
    type: 'datetime-local',
  });

  const endRow = createInputRow({
    id: 'endDate',
    label: 'End date/time',
    type: 'datetime-local',
  });

  const durationRow = createInputRow({
    id: 'slotDurationMinutes',
    label: 'Slot duration (minutes)',
    type: 'number',
    placeholder: '30',
  });
  durationRow.input.min = '1';

  const roomsRow = createElement('div', 'form-row');
  const roomsLabel = document.createElement('label');
  roomsLabel.setAttribute('for', 'rooms');
  roomsLabel.textContent = 'Rooms (one per line: name | capacity)';
  const roomsInput = document.createElement('textarea');
  roomsInput.id = 'rooms';
  roomsInput.name = 'rooms';
  roomsInput.rows = 4;
  roomsInput.placeholder = 'Room A | 120\nRoom B | 80';
  const roomsError = createElement('div', 'error');
  roomsError.id = 'rooms-error';
  roomsInput.setAttribute('aria-describedby', 'rooms-error');
  roomsRow.append(roomsLabel, roomsInput, roomsError);

  const generateButton = document.createElement('button');
  generateButton.type = 'submit';
  generateButton.className = 'button';
  generateButton.textContent = 'Generate schedule';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.className = 'button secondary';
  saveButton.id = 'schedule-save';
  saveButton.textContent = 'Save draft';

  const publishButton = document.createElement('button');
  publishButton.type = 'button';
  publishButton.className = 'button secondary';
  publishButton.id = 'schedule-publish';
  publishButton.textContent = 'Publish schedule';

  const status = createElement('div', 'status');
  status.id = 'schedule-status';
  status.setAttribute('aria-live', 'polite');

  const draftSection = createElement('div', 'schedule-draft');
  const draftTitle = createElement('h2');
  draftTitle.textContent = 'Draft schedule';
  const draftSummary = createElement('p', 'helper');
  draftSummary.id = 'schedule-summary';
  draftSummary.setAttribute('aria-live', 'polite');
  const scheduledList = createElement('ul', 'list');
  scheduledList.id = 'schedule-list';
  scheduledList.setAttribute('aria-live', 'polite');
  const unscheduledTitle = createElement('h3');
  unscheduledTitle.textContent = 'Unscheduled papers';
  const unscheduledList = createElement('ul', 'list');
  unscheduledList.id = 'schedule-unscheduled';
  unscheduledList.setAttribute('aria-live', 'polite');
  draftSection.append(draftTitle, draftSummary, scheduledList, unscheduledTitle, unscheduledList);

  form.append(
    conferenceRow.row,
    startRow.row,
    endRow.row,
    durationRow.row,
    roomsRow,
    generateButton,
    saveButton,
    publishButton,
    status,
  );
  container.append(title, helper, form, draftSection);

  const fieldMap = {
    conferenceId: conferenceRow,
    startDate: startRow,
    endDate: endRow,
    slotDurationMinutes: durationRow,
    rooms: { input: roomsInput, error: roomsError },
  };

  function clearErrors() {
    Object.values(fieldMap).forEach((field) => {
      field.error.textContent = '';
    });
    status.textContent = '';
    status.className = 'status';
  }

  function setFieldError(field, message) {
    const target = fieldMap[field];
    if (!target) {
      return;
    }
    target.error.textContent = message;
  }

  function setStatus(message, isError) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setDraft({ scheduled = [], unscheduled = [], summary = '' } = {}) {
    scheduledList.textContent = '';
    unscheduledList.textContent = '';
    draftSummary.textContent = summary;

    if (!scheduled.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No scheduled papers yet.';
      scheduledList.appendChild(empty);
    } else {
      scheduled.forEach((item) => {
        const entry = document.createElement('li');
        entry.textContent = `${item.paperId} → ${item.roomId || 'TBD'} (${item.slotId || 'slot'})`;
        scheduledList.appendChild(entry);
      });
    }

    if (!unscheduled.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No unscheduled papers.';
      unscheduledList.appendChild(empty);
    } else {
      unscheduled.forEach((item) => {
        const entry = document.createElement('li');
        const reason = item.reason ? ` (${item.reason})` : '';
        entry.textContent = `${item.paperId}${reason}`;
        unscheduledList.appendChild(entry);
      });
    }
  }

  function setEditable(enabled) {
    const isDisabled = !enabled;
    Object.values(fieldMap).forEach((field) => {
      field.input.disabled = isDisabled;
    });
    generateButton.disabled = isDisabled;
    saveButton.disabled = isDisabled;
    publishButton.disabled = isDisabled;
  }

  return {
    element: container,
    getValues() {
      return {
        conferenceId: conferenceRow.input.value,
        startDate: startRow.input.value,
        endDate: endRow.input.value,
        slotDurationMinutes: durationRow.input.value,
        rooms: roomsInput.value,
      };
    },
    clearErrors,
    setFieldError,
    setStatus,
    setDraft,
    setEditable,
    onGenerate(handler) {
      form.addEventListener('submit', handler);
    },
    onSave(handler) {
      saveButton.addEventListener('click', handler);
    },
    onPublish(handler) {
      publishButton.addEventListener('click', handler);
    },
  };
}
