'use strict';
chill_penguin.module('dialog', () => {
  let self;
  let scroll_top;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.dialog;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='dialog']").forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          container: el.querySelector(':scope > [data-module="dialog.container"]'),
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_focusable_elements(id);
      });
    },
    event_listeners: {
      mousedown_close: (event) => {
        if (event.target.querySelector("[data-module='dialog'], [data-module='dialog'] > *")) {
          self.action.close();
        }
      },
      keyboard_focus_trap: (event) => {
        if (event.keyCode === keyboard.keys.tab) {
          if (event.shiftKey) {
            if (document.activeElement === self.a11y.first_tab_stop) {
              event.preventDefault();
              self.a11y.last_tab_stop.focus();
            }
          } else {
            if (document.activeElement === self.a11y.last_tab_stop) {
              event.preventDefault();
              self.a11y.first_tab_stop.focus();
            }
          }
        }
        if (event.keyCode === keyboard.keys.esc) {
          self.action.close();
        }
      },
    },
    action: {
      open: (id, trigger) => {
        if (state[id]) {
          const { el, container, focusable_elements, remove_focusable_elements } = state[id];
          document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
          document.addEventListener('mousedown', self.event_listeners.mousedown_close);

          /* removes focus from elements except in dialog */
          focusable_elements.forEach((focusable_element) => {
            focusable_element.setAttribute('tabindex', '0');
          });
          remove_focusable_elements.forEach((remove_focusable_element) => {
            remove_focusable_element.setAttribute('tabindex', '-1');
          });

          /* remove focusable elements from nodelist, e.g. popover inside dialog */
          state[id]['focusable_elements'] = [...focusable_elements].filter((focusable_element) => {
            return ![...remove_focusable_elements].includes(focusable_element);
          });

          /* saves item that opened dialog for later */
          self.a11y.focus_placeholder = document.activeElement;
          self.a11y.first_tab_stop = focusable_elements[0];
          self.a11y.last_tab_stop = focusable_elements[focusable_elements.length - 1];

          scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
          document.documentElement.style.top = `-${scroll_top}px`;
          document.documentElement.classList.add('no-scroll');

          el.showModal();

          /* set focus to dialog (but not the first_tab_stop */
          setTimeout(() => {
            (self.a11y.first_tab_stop) && self.a11y.first_tab_stop.focus();
          }, 100);

          /* add keyboard event listener */
          el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
          el.addEventListener('keydown', self.event_listeners.keyboard_focus_trap);
        } else {
          console.error(`Dialog (id="${id}") does not exist`);
        }
      },
      close: () => {
        document.removeEventListener('mousedown', self.event_listeners.mousedown_close);

        document.documentElement.classList.remove('no-scroll');
        document.documentElement.style.removeProperty('top');
        window.scrollTo(0,scroll_top);

        document.querySelectorAll("dialog").forEach((dialog) => {
          dialog.close();
        });

        /* updates dialog visuals */
        document.querySelectorAll("[data-module='dialog']").forEach((el, index) => {
          const id = el.getAttribute('id');
          const { focusable_elements } = state[id];

          /* remove focus from dialog elements */
          focusable_elements.forEach((focusable_element) => {
            focusable_element.setAttribute('tabindex', '-1');
          });

          /* remove keyboard event listener */
          el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
        });
        document.querySelectorAll("[data-module='dialog.trigger']").forEach((trigger) => {
          trigger.setAttribute('aria-expanded', false);
        });

        /* set focus to self.a11y.focus_placeholder */
        self.a11y.focus_placeholder.focus();
      },
    },
    a11y: {
      focus_placeholder: null,
      first_tab_stop: null,
      last_tab_stop: null,
      get_focusable_elements: (id) => {
        const { el } = state[id];
        state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});

chill_penguin.module('dialog_trigger', () => {
  let self;
  return {
    initialize: () => {
      self = chill_penguin.dialog_trigger;
      document.querySelectorAll("[data-module='dialog.trigger']").forEach((el) => {
        self.event_listeners.initialize(el);
      });
    },
    event_listeners: {
      initialize: (el) => {
        el.removeEventListener('click', self.event_listeners.trigger_open);
        el.addEventListener('click', self.event_listeners.trigger_open);
      },
      remove: {
        all: () => {
          document.querySelectorAll("[data-module='dialog.trigger']").forEach((el) => {
            el.removeEventListener('click', self.event_listeners.trigger_open);
          });
        },
        one: (el) => {
          el.removeEventListener('click', self.event_listeners.trigger_open);
        },
      },
      trigger_open: (event) => {
        const el = event.currentTarget;
        chill_penguin.dialog.action.open(el.getAttribute("data-dialog-bind-id"),el);
      },
    },
  };
});
