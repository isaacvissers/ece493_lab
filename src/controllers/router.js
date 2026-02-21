const routes = new Map();
let root = null;

function render(view) {
  if (!root) {
    return;
  }
  root.innerHTML = '';
  if (view) {
    root.appendChild(view);
  }
}

export const router = {
  setRoot(element) {
    root = element;
  },
  registerDecisionRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('decisions', () => {
      controller.init();
      return controller.listView ? controller.listView.element : null;
    });
    routes.set('decision-detail', (payload) => {
      controller.showDecision(payload && payload.paperId ? payload.paperId : null);
      return controller.detailView ? controller.detailView.element : null;
    });
  },
  registerScheduleRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('schedule', () => {
      controller.init();
      return controller.view ? controller.view.element : null;
    });
  },
  registerScheduleHtmlRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('schedule-html', (payload) => {
      if (controller.show) {
        controller.show(payload && payload.conferenceId ? payload.conferenceId : null);
      }
      return controller.view ? controller.view.element : null;
    });
  },
  registerScheduleEditRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('schedule-edit', (payload) => {
      if (controller.init) {
        controller.init();
      }
      if (controller.show) {
        controller.show(payload && payload.conferenceId ? payload.conferenceId : null);
      }
      return controller.view ? controller.view.element : null;
    });
  },
  registerAuthorScheduleRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('author-schedule', (payload) => {
      if (controller.show) {
        controller.show(payload && payload.conferenceId ? payload.conferenceId : null);
      }
      return controller.view ? controller.view.element : null;
    });
  },
  registerPublicScheduleRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('public-schedule', (payload) => {
      if (controller.show) {
        controller.show(payload && payload.conferenceId ? payload.conferenceId : null);
      }
      return controller.view ? controller.view.element : null;
    });
  },
  registerRegistrationRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('registration', () => {
      if (controller.init) {
        controller.init();
      }
      if (controller.show) {
        controller.show();
      }
      return controller.view ? controller.view.element : null;
    });
  },
  registerPriceListRoutes({ controller } = {}) {
    if (!controller) {
      return;
    }
    routes.set('price-list', (payload) => {
      if (controller.show) {
        controller.show(payload && payload.conferenceId ? payload.conferenceId : null);
      }
      return controller.view ? controller.view.element : null;
    });
  },
  register(path, handler) {
    routes.set(path, handler);
  },
  navigate(path, payload) {
    const handler = routes.get(path);
    if (!handler) {
      return false;
    }
    const view = handler(payload);
    render(view && view.element ? view.element : view);
    return true;
  },
  reset() {
    routes.clear();
    root = null;
  },
};
