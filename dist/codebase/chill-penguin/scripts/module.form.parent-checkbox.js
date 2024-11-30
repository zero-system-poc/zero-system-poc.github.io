'use strict';
chill_penguin.module('form.parent_checkbox', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.form.parent_checkbox;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='parent-checkbox']").forEach((el) => {
        const id = el.getAttribute('id');
        const checkbox_ids = el.getAttribute('aria-controls').split(' ');

        state[id] = {};
        state[id][id] = chill_penguin.checkbox.is_checked(document.getElementById(id));

        self.event_listeners.parent.initialize(id);
        for (let i = 0; i < checkbox_ids.length; i++) {
          state[id][checkbox_ids[i]] = chill_penguin.checkbox.is_checked(document.getElementById(checkbox_ids[i]));
          self.event_listeners.child.initialize(id, document.getElementById(checkbox_ids[i]));
        }
      });
    },
    event_listeners: {
      parent: {
        initialize: (id) => {
          const parent_checkbox = document.getElementById(id);
          parent_checkbox.removeEventListener('keydown', self.event_listeners.parent.update);
          parent_checkbox.addEventListener('keydown', self.event_listeners.parent.update);
          parent_checkbox.removeEventListener('click', self.event_listeners.parent.update);
          parent_checkbox.addEventListener('click', self.event_listeners.parent.update);
        },
        update: (event) => {
          const id = event.currentTarget.getAttribute("id");
          self.state.update(id, id);
        },
      },
      child: {
        initialize: (id, el) => {
          el.removeEventListener('change', self.event_listeners.child.update);
          el.addEventListener('change', self.event_listeners.child.update);
          el.removeEventListener('keydown', self.event_listeners.child.update);
          el.addEventListener('keydown', self.event_listeners.child.update);
          el.removeEventListener('click', self.event_listeners.child.update);
          el.addEventListener('click', self.event_listeners.child.update);
        },
        update: (event) => {
          const el = event.currentTarget
          const parent_id = chill_penguin.util.closest_parent(el,`[data-module="parent-checkbox.container"]`).querySelector(`[data-module="parent-checkbox"]`).getAttribute("id");
          const id = el.getAttribute("id");
          self.state.update(parent_id, id);
        },
      }
    },
    state: {
      update: (id, id_clicked) => {
        const parent_checkbox = document.getElementById(id);
        const checkbox_clicked = document.getElementById(id_clicked);
        if (id === id_clicked) {
          if (chill_penguin.checkbox.is_checked(parent_checkbox) === false) {
            for (const [key, value] of Object.entries(state[id])) {
              state[id][key] = false;
              chill_penguin.checkbox.set_checked(document.getElementById(key), false);
            }
          } else if (chill_penguin.checkbox.is_checked(parent_checkbox) === true) {
            for (const [key, value] of Object.entries(state[id])) {
              state[id][key] = true;
              chill_penguin.checkbox.set_checked(document.getElementById(key), true);
            }
          }
        } else {
          if (chill_penguin.checkbox.is_checked(checkbox_clicked) === true) {
            state[id][id_clicked] = false;
            chill_penguin.checkbox.set_checked(checkbox_clicked, false);
          } else if (chill_penguin.checkbox.is_checked(checkbox_clicked) === false) {
            state[id][id_clicked] = true;
            chill_penguin.checkbox.set_checked(checkbox_clicked, true);
          }
        }
        self.state.parent(id);
      },
      parent: (id) => {
        const parent_checkbox = document.getElementById(id);
        let num_child_checkboxes_checked = 0;
        let num_checkboxes = 0;
        for (const [key, value] of Object.entries(state[id])) {
          if (num_checkboxes > 0) {
            if (chill_penguin.checkbox.is_checked(document.getElementById(key))) {
              num_child_checkboxes_checked += 1;
            }
          }
          num_checkboxes += 1;
        }
        if (num_child_checkboxes_checked === 0) {
          parent_checkbox.setAttribute('aria-checked', 'false');
          parent_checkbox.checked = false;
        } else {
          if (num_child_checkboxes_checked === num_checkboxes - 1) {
            parent_checkbox.setAttribute('aria-checked', 'true');
            parent_checkbox.checked = true;
          } else {
            parent_checkbox.setAttribute('aria-checked', 'mixed');
            parent_checkbox.checked = true;
          }
        }
      }
    },
  };
});
