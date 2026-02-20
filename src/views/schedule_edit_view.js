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

export function createScheduleEditView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Edit schedule';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Update draft schedule entries by room and time.';

  const form = document.createElement('form');
  form.noValidate = true;

  const conferenceRow = createInputRow({
    id: 'editConferenceId',
    label: 'Conference ID',
    placeholder: 'conf_2026',
  });

  const entryRow = createInputRow({
    id: 'editEntryId',
    label: 'Entry ID',
    placeholder: 'entry_123',
  });

  const roomRow = createInputRow({
    id: 'editRoomId',
    label: 'Room ID',
    placeholder: 'room_a',
  });

  const startRow = createInputRow({
    id: 'editStartTime',
    label: 'Start time',
    type: 'datetime-local',
  });

  const endRow = createInputRow({
    id: 'editEndTime',
    label: 'End time',
    type: 'datetime-local',
  });

  const versionRow = createInputRow({
    id: 'editScheduleVersion',
    label: 'Schedule version',
    type: 'number',
    placeholder: '1',
  });
  versionRow.input.min = '1';

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.className = 'button';
  saveButton.textContent = 'Save update';

  const status = createElement('div', 'status');
  status.id = 'schedule-edit-status';
  status.setAttribute('aria-live', 'polite');

  const draftSection = createElement('div', 'schedule-edit-draft');
  const draftTitle = createElement('h2');
  draftTitle.textContent = 'Draft entries';
  const draftSummary = createElement('p', 'helper');
  draftSummary.id = 'schedule-edit-summary';
  draftSummary.setAttribute('aria-live', 'polite');
  const draftList = createElement('ul', 'list');
  draftList.id = 'schedule-edit-list';
  draftList.setAttribute('aria-live', 'polite');
  draftSection.append(draftTitle, draftSummary, draftList);

  form.append(
    conferenceRow.row,
    entryRow.row,
    roomRow.row,
    startRow.row,
    endRow.row,
    versionRow.row,
    saveButton,
    status,
  );
  container.append(title, helper, form, draftSection);

  const fieldMap = {
    conferenceId: conferenceRow,
    entryId: entryRow,
    roomId: roomRow,
    startTime: startRow,
    endTime: endRow,
    scheduleVersion: versionRow,
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

  function setEditable(enabled) {
    const isDisabled = !enabled;
    Object.values(fieldMap).forEach((field) => {
      field.input.disabled = isDisabled;
    });
    saveButton.disabled = isDisabled;
  }

  function setDraft({ entries = [], summary = '' } = {}) {
    draftList.textContent = '';
    draftSummary.textContent = summary;
    if (!entries.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No draft entries available.';
      draftList.appendChild(empty);
      return;
    }
    entries.forEach((entry) => {
      const row = document.createElement('li');
      row.textContent = `${entry.entryId || entry.itemId}: ${entry.paperId} → ${entry.roomId} (${entry.startTime} - ${entry.endTime})`;
      draftList.appendChild(row);
    });
  }

  return {
    element: container,
    getValues() {
      return {
        conferenceId: conferenceRow.input.value,
        entryId: entryRow.input.value,
        roomId: roomRow.input.value,
        startTime: startRow.input.value,
        endTime: endRow.input.value,
        scheduleVersion: versionRow.input.value,
      };
    },
    clearErrors,
    setFieldError,
    setStatus,
    setEditable,
    setDraft,
    setVersion(version) {
      versionRow.input.value = version ? String(version) : '';
    },
    onSave(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
