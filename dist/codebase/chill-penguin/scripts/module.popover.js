'use strict';
/**
 * data-module=popover         the popover
 * data-module=popover.trigger the button that opens the popover
 */
chill_penguin.module('popover', () => {
  let self;
  let state = {};

  return {
    initialize: () => {
      self = chill_penguin.popover;
      state = {};
      self.setup();
      self.event_listeners.initialize();
    },
    setup: () => {
      document.querySelectorAll("[data-module='popover']").forEach((el, index) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_focusable_elements(id);
      });
    },
    ui: {
      set_location: (id) => {
        const { el  } = state[id];
        const trigger = document.querySelector("[data-module='popover.trigger'][data-popover-trigger='active']");

        if (chill_penguin.client.viewport.is_md_down()) {
          el.style.top = 'initial';
          el.style.left = '0px';
          el.style.transform = `none`;
        } else if (chill_penguin.client.viewport.is_lg_up()) {
          const scroll_top = window.pageYOffset || trigger.scrollTop;
          const trigger_location = trigger.getBoundingClientRect();
          switch (el.getAttribute("data-popover-direction")) {
            case "top":
              el.style.left = `${trigger_location.left + trigger_location.width/2}px`;
              el.style.transform = `translate(-50%,-100%)`;
              el.style.top = `${trigger_location.top + scroll_top - 16}px`;
              break;
            case "bottom":
              el.style.left = `${trigger_location.left + trigger_location.width/2}px`;
              el.style.transform = `translateX(-50%)`;
              el.style.top = `${trigger_location.top + scroll_top + trigger_location.height + 16}px`; //16 is the box arrow width
              break;
            case "right":
            default:
              el.style.top = `${trigger_location.top + trigger_location.height/2 + scroll_top}px`;
              el.style.transform = `translateY(-50%)`;
              el.style.left = `${trigger_location.left + trigger_location.width + 16}px`; //16 is the box arrow width
              break;
          }
        }
      },
    },
    event_listeners: {
      initialize: (event) => {
        self.event_listeners.resize();
      },
      resize: () => {
        const force_resize = () => {
          if (document.querySelector("[data-module='popover'][data-popover='active']")) {
            self.ui.set_location(document.querySelector("[data-module='popover'][data-popover='active']").getAttribute('id'));
          }
        }
        chill_penguin.resize_observer(document.querySelector('body'), force_resize);
      },
      mousedown_close: (event) => {
        if (event.target.querySelector("[data-module='popover'], [data-module='popover'] > *")) {
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
        const { el, focusable_elements, remove_focusable_elements } = state[id];
        document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
        document.addEventListener('mousedown', self.event_listeners.mousedown_close);
        document.querySelectorAll("[data-popover='active']").forEach((el) => {
          el.removeAttribute("data-popover");
          el.hidePopover();
        });
        document.querySelectorAll("[data-popover-trigger='active']").forEach((el) => {
          el.removeAttribute("data-popover-trigger");
        });

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

        /* saves item that opened popover for later */
        self.a11y.focus_placeholder = document.activeElement;
        self.a11y.first_tab_stop = state[id]['focusable_elements'][0];
        self.a11y.last_tab_stop = state[id]['focusable_elements'][state[id]['focusable_elements'].length - 1];

        /* updates popover visuals */
        el.setAttribute("data-popover","active");
        trigger.setAttribute("data-popover-trigger","active");
        self.ui.set_location(id);

        /* set focus to popover (but not the self.a11y.first_tab_stop */
        setTimeout(() => {
          (self.a11y.first_tab_stop) && self.a11y.first_tab_stop.focus();
        }, 100);

        /* add keyboard event listener */
        el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
        el.addEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      },
      close: () => {
        /* updates popover visuals */
        document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
        document.querySelector("[data-module='popover'][data-popover='active']")?.setAttribute('tabIndex', '-1');
        document.querySelectorAll("[data-popover='active']").forEach((el) => {
          el.removeAttribute("data-popover");
          el.hidePopover();
        });
        document.querySelectorAll("[data-popover-trigger='active']").forEach((el) => {
          el.removeAttribute("data-popover-trigger");
        });
        document.querySelectorAll("[data-target='popover']").forEach((popover, index) => {
          const id = popover.getAttribute('id');
          const { focusable_elements } = state[id];

          /* remove focus from popover elements */
          focusable_elements.forEach((focusable_element) => {
            focusable_element.setAttribute('tabindex', '-1');
          });

          /* remove keyboard event listener */
          popover.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
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
