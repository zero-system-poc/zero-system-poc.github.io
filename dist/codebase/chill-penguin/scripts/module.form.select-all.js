'use strict';
chill_penguin.module('form.select_all', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.form.select_all;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="select-all"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          type: el.getAttribute('data-select-all-type'),
          type_elements: (el.getAttribute('data-select-all-type') === "checkbox") ? el.querySelectorAll("input[type='checkbox']") : el.querySelectorAll("button[type='button']") ,
          select_all_radiobuttons_id: el.getAttribute('data-select-all-bind'),
          onupdate: el.getAttribute('data-select-all-onupdate-func') || false,
        };
        self.ui.initialize(id);
        self.event_listeners.elements.initialize(id);
        self.event_listeners.select_all_radiobuttons.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        self.ui.set_select_all_radio(id);
      },
      set_select_all_radio_wrapper: () => {
        const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="select-all"]').getAttribute('id');
        self.ui.set_select_all_radio(id);
      },
      set_select_all_radio: (id) => {
        setTimeout(() => {
          let count = 0;
          const { type, type_elements, select_all_radiobuttons_id, onupdate } = state[id];
          type_elements.forEach((el) => {
            if (type === 'checkbox') {
              if (chill_penguin.checkbox.is_checked(el)) {
                count++;
              }
            } else if (type === 'switch') {
              if (chill_penguin.button.is_checked(el)) {
                count++;
              }
            }
          });
          if (count === 0) {
            /* None */
            document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.none']`).checked = true;
          } else if (count === type_elements.length) {
            /* All */
            document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.all']`).checked = true;
          } else {
            /* Some */
            document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.some']`).checked = true;
          }
          if (onupdate) {
            chill_penguin.util.run_str_func( onupdate, { id } );
          }
        }, 0);
      },
      set_all_elements_true: () => {
        const select_all_options_id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="select-all.options"]').getAttribute('id');
        const id = document.querySelector(`[data-select-all-bind=${select_all_options_id}]`).getAttribute("id");
        self.ui.set_all_elements(id, true);
      },
      set_all_elements_false: () => {
        const select_all_options_id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="select-all.options"]').getAttribute('id');
        const id = document.querySelector(`[data-select-all-bind=${select_all_options_id}]`).getAttribute("id");
        self.ui.set_all_elements(id, false);
      },
      set_all_elements: (id, value) => {
        const { type, type_elements, select_all_radiobuttons_id, onupdate } = state[id];
        type_elements.forEach((el) => {
          if (el.getAttribute("data-module") === "parent-checkbox") {
            chill_penguin.checkbox.set_aria_checked(el, value);
            chill_penguin.checkbox.set_checked(el, value);
          } else {
            if (type === 'checkbox') {
              chill_penguin.checkbox.set_checked(el, value);
            } else if (type === 'switch') {
              chill_penguin.button.set_checked(el, value);
            }
          }
        });
        if (onupdate) {
          chill_penguin.util.run_str_func( onupdate, { id } );
        }
      },
    },
    event_listeners: {
      elements: {
        initialize: (id) => {
          const { type_elements } = state[id];
          type_elements.forEach((el) => {
            el.removeEventListener('click', self.ui.set_select_all_radio_wrapper);
            el.addEventListener('click', self.ui.set_select_all_radio_wrapper);
          });
        }
      },
      select_all_radiobuttons: {
        initialize: (id) => {
          const { select_all_radiobuttons_id } = state[id];
          document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.all']`).removeEventListener('click', self.ui.set_all_elements_true);
          document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.all']`).addEventListener('click', self.ui.set_all_elements_true);
          document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.none']`).removeEventListener('click', self.ui.set_all_elements_false);
          document.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.none']`).addEventListener('click', self.ui.set_all_elements_false);
        }
      },
    },
  };
});
