'use strict';
chill_penguin.module('show_more', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.show_more;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='show-more']").forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          transition_duration: el.getAttribute('data-show-more-transition-duration'),
          offset: el.getAttribute('data-show-more-offset'),
          container: el.querySelector("[data-module='show-more.container']"),
          container_height: '',
          more_button: el.nextElementSibling.querySelector("[data-module='show-more.more']"),
          less_button: el.nextElementSibling.querySelector("[data-module='show-more.less']"),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { el } = state[id];
        el.style.transitionProperty = 'height';
        el.style.transitionTimingFunction = 'ease';
      },
      update_container_height: (id) => {
        const { el, transition_duration, offset, container_height } = state[id];
        setTimeout(() => {
          el.style.transitionDuration = '0s';
        }, transition_duration * 1000);

        el.style.height = `${container_height - offset}px`;
      },
      force_resize: (id) => {
        const { el, container } = state[id];
        state[id]['container_height'] = (el.classList.contains('active')) ? container.getBoundingClientRect().height : container.querySelector('[data-show-more-bottom]').offsetTop - container.querySelector('[data-show-more-top]').offsetTop;
        self.ui.update_container_height(id);
      },
    },
    event_listeners: {
      initialize: (id) => {
        self.event_listeners.resize(id);
        self.event_listeners.button_toggle(id);
      },
      resize: (id) => {
        const force_resize = () => {
          return self.ui.force_resize(id);
        }
        chill_penguin.resize_observer(document.querySelector('body'), force_resize);
      },
      button_toggle: (id) => {
        const { more_button, less_button } = state[id];
        more_button.addEventListener('click', (event) => {
          event.preventDefault();
          self.action.toggle(id, true);
        });

        less_button.addEventListener('click', (event) => {
          event.preventDefault();
          self.action.toggle(id, false);
        });
      },
    },
    action: {
      toggle: (id, is_active) => {
        const { el, transition_duration, more_button, less_button } = state[id];
        el.style.transitionDuration = `${transition_duration}s`;

        if (is_active) {
          more_button.classList.replace('display:inline', 'display:none');
          less_button.classList.replace('display:none', 'display:inline');
          el.classList.add('active');
        } else {
          more_button.classList.replace('display:none', 'display:inline');
          less_button.classList.replace('display:inline', 'display:none');
          el.classList.remove('active');
        }
        self.ui.force_resize(id);
      },
    },
  };
});
