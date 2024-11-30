'use strict';
chill_penguin.module('form.theme.gl0b3x', () => {
  let self;

  return {
    initialize: () => {
      self = chill_penguin.form.theme.gl0b3x;
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x input, .form\\:theme\\:gl0b3x select, .form\\:theme\\:gl0b3x textarea').forEach((element) => {
        if (element.type !== 'radio' && element.type !== 'range') {
          self.event_listeners.input.add(element);
          self.ui.force_set_active_label(element);
        }
      });
      document.querySelectorAll('.form\\:theme\\:gl0b3x textarea').forEach((element) => {
        self.event_listeners.textarea.add(element);
        self.ui.force_textarea_autoexpand(element);
      });
    },
    ui: {
      force_textarea_autoexpand: (element) => {
        element.style.height = 'inherit';
        element.style.height = `${element.scrollHeight + 6}px`;
        chill_penguin.equalize_heights.force_resize();
      },
      force_set_active_label: (element) => {
        element.nextElementSibling.classList[element.value.length ? 'add' : 'remove']('active-label');
      },
    },
    event_listeners: {
      input: {
        on_change: (event) => {
          self.ui.force_set_active_label(event.currentTarget);
        },
        add: (element) => {
          element.removeEventListener('change', self.event_listeners.input.on_change);
          element.addEventListener('change', self.event_listeners.input.on_change);
        },
      },
      textarea: {
        on_input: (event) => {
          self.ui.force_textarea_autoexpand(event.currentTarget);
        },
        add: (element) => {
          element.removeEventListener('input', self.event_listeners.textarea.on_input);
          element.addEventListener('input', self.event_listeners.textarea.on_input);
        },
      },
    },
  };
});