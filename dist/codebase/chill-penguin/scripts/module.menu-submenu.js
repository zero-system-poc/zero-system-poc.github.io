'use strict';
/*
  @TODO: a11y keyboard functionality
  https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/
*/
chill_penguin.module('menu_submenu', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.menu_submenu;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="menu"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          all_triggers: el.querySelectorAll(':scope > li > [data-module="menu.trigger"],:scope > [data-module="menu.trigger"]'),
          all_submenus: el.querySelectorAll(':scope > li > [data-module="menu.submenu"],:scope > [data-module="menu.submenu"]'),
          active_setting: el.getAttribute('data-menu-active'),
          active_classes: el.getAttribute('data-menu-active-classes') ? JSON.parse(el.getAttribute('data-menu-active-classes').split(',')) : [],
          inactive_classes: el.getAttribute('data-menu-inactive-classes') ? JSON.parse(el.getAttribute('data-menu-inactive-classes').split(',')) : [],
          open_on_load: el.querySelectorAll(':scope > li > [data-module="menu.trigger"][data-menu-open],:scope > [data-module="menu.trigger"][data-menu-open]'),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { el, all_triggers, all_submenus, inactive_classes } = state[id];
        all_triggers.forEach((el, index) => {
          el.setAttribute('tabindex', '-1');
          el.setAttribute('aria-expanded', 'false');
          el.setAttribute('aria-controls', el.nextElementSibling.getAttribute('id'));
          el.classList.add(...inactive_classes);
          if (index === 0) {
            el.setAttribute('tabindex', '0');
            el.removeEventListener('focusin', self.event_listeners.menu_focus.add);
            el.addEventListener('focusin', self.event_listeners.menu_focus.add);
            el.removeEventListener('focusout', self.event_listeners.menu_focus.remove);
            el.addEventListener('focusout', self.event_listeners.menu_focus.remove);
          }
        });
        all_submenus.forEach((el) => {
          el.classList.add('display:none');
        });
        self.ui.initialize_initial_active(id);
      },
      initialize_initial_active: (id) => {
        const { open_on_load } = state[id];
        open_on_load.forEach((el) => {
          self.action.toggle_trigger(id, el);
        });
      },
    },
    event_listeners: {
      initialize: (id) => {
        const { el, all_triggers } = state[id];
        all_triggers.forEach((el) => {
          el.removeEventListener('click', self.event_listeners.trigger_click);
          el.addEventListener('click', self.event_listeners.trigger_click);
        });
      },
      menu_focus: {
        add: (event) => {
          event.currentTarget.classList.add('focus');
        },
        remove: (event) => {
          event.currentTarget.classList.remove('focus');
        },
      },
      trigger_click: (event) => {
        const el = event.currentTarget;
        const id = chill_penguin.util.closest_parent(el, `[data-module='menu']`).getAttribute("id");
        self.action.toggle_trigger(id, el);
      }
    },
    action: {
      toggle_trigger: (id, el) => {
        const { all_triggers, active_setting, active_classes, inactive_classes } = state[id];
        if (active_setting === 'single') {
          all_triggers.forEach((el) => {
            el.classList.remove(...active_classes);
            el.classList.add(...inactive_classes);
            el.setAttribute('aria-expanded', 'false');
          });
          el.setAttribute('aria-expanded', 'true');
          el.classList.add(...active_classes);
          el.classList.remove(...inactive_classes);
        } else if (active_setting === 'multiple') {
          if (el.getAttribute('aria-expanded') === 'false') {
            el.setAttribute('aria-expanded', 'true');
            el.classList.add(...active_classes);
            el.classList.remove(...inactive_classes);
          } else {
            el.setAttribute('aria-expanded', 'false');
            el.classList.remove(...active_classes);
            el.classList.add(...inactive_classes);
          }
        }
        self.action.open(id, el.getAttribute('aria-controls'));
      },
      open: (id, menu_panel_id) => {
        const { el, all_submenus, active_setting } = state[id];
        if (active_setting === 'single') {
          all_submenus.forEach((el) => {
            el.classList.add('display:none');
          });
          document.getElementById(menu_panel_id).classList.remove('display:none');
          chill_penguin.equalize_heights.force_resize();
        } else if (active_setting === 'multiple') {
          document.getElementById(menu_panel_id).classList.toggle('display:none');
          chill_penguin.equalize_heights.force_resize();
        }
      },
    },
    a11y: {

    },
  };
});
