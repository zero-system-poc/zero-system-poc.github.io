'use strict';
chill_penguin.module('range_slider', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.range_slider;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="range-slider.input-container"]').forEach((container) => {
        const el1 = container.querySelector('[data-module="range-slider.input-1"]');
        const id1 = el1.getAttribute('id');
        const el2 = container.querySelector('[data-module="range-slider.input-2"]');
        const id2 = el2.getAttribute('id');
        state[id1] = {
          id1,
          el1,
          id2,
          el2,
          slider_container: container,
          label_container: container.querySelector(':scope > [data-module="slider.labels"]'),
          labels: container.querySelectorAll(':scope > [data-module="slider.labels"] > * '),
          slider_fill: container.querySelector(':scope > [data-module="slider.background"] > [data-module="slider.fill"]'),
          input_bind1: el1.getAttribute("data-slider-bind-input"),
          input_bind2: el2.getAttribute("data-slider-bind-input"),
        };
        self.ui.initialize(id1);
        self.event_listeners.initialize(id1);
      });
    },
    ui: {
      initialize: (id1) => {
        self.ui.label_resize(id1);
        self.ui.update_slider_track(id1);
      },
      label_resize: (id1) => {
        const { slider_container, labels, label_container } = state[id1];
        const num_labels = labels.length;
        const container_width = slider_container.offsetWidth;
        const full_label_width = (container_width * num_labels) / (num_labels - 1);
        label_container.style.width = `${full_label_width}px`;
        const transform_left = (50 / num_labels) * -1;
        label_container.style.transform = `translateX(${transform_left}%)`;
      },
      update_slider_track: (id1) => {
        const { slider_fill } = state[id1];
        let { el1, el2 } = state[id1];
        if (parseInt(el1.value) > parseInt(el2.value)) {
          const temp = el1;
          el1 = el2;
          el2 = temp;
        }
        const left = ((el1.value - el1.getAttribute('min')) / (el1.getAttribute('max') - el1.getAttribute('min'))) * 100;
        slider_fill.style.left = `${left}%`;
        const percentage = ((el2.value - el2.getAttribute('min')) / (el2.getAttribute('max') - el2.getAttribute('min'))) * 100;
        slider_fill.style.width = `${percentage - left}%`;
      },
    },
    event_listeners: {
      initialize: (id1) => {
        const { el1, el2, input_bind1, input_bind2 } = state[id1];
        el1.removeEventListener('input', self.event_listeners.handle_slider_change_1);
        el1.addEventListener('input', self.event_listeners.handle_slider_change_1);
        el2.removeEventListener('input', self.event_listeners.handle_slider_change_2);
        el2.addEventListener('input', self.event_listeners.handle_slider_change_2);
        if (input_bind1) {
          el1.removeEventListener('input', self.event_listeners.handle_input_bind);
          el1.addEventListener('input', self.event_listeners.handle_input_bind);
        }
        if (input_bind2) {
          el2.removeEventListener('input', self.event_listeners.handle_input_bind);
          el2.addEventListener('input', self.event_listeners.handle_input_bind);
        }
        self.event_listeners.resize_listener(id1);
      },
      handle_slider_change_1: (event) => {
        self.ui.update_slider_track(event.currentTarget.getAttribute('id'));
      },
      handle_slider_change_2: (event) => {
        self.ui.update_slider_track(event.currentTarget.previousElementSibling.getAttribute('id'));
      },
      handle_input_bind: (event) => {
        self.action.set_input_bind_value(event.currentTarget.getAttribute('id'),event.currentTarget.getAttribute('data-slider-bind-input'),event.currentTarget.value);
      },
      resize_listener: (id1) => {
        const { el1 } = state[id1];
        const label_resize = () => {
          self.ui.label_resize(id1);
        };
        chill_penguin.resize_observer(el1, label_resize);
      },
    },
    action: {
      set_value: (id, new_value) => {
        const el = document.getElementById(id);
        const id1 = (el.getAttribute('data-module') === "range-slider.input-1") ? el.getAttribute('id') : el.previousElementSibling.getAttribute('id');
        const input_bind = el.getAttribute("data-slider-bind-input");
        el.value = new_value;
        self.ui.update_slider_track(id1);
        if (input_bind) {
          self.action.set_input_bind_value(id, input_bind, new_value);
        }
      },
      set_input_bind_value: (id, input_bind, new_value) => {
        const el = document.getElementById(id);
        const min = parseInt(el.getAttribute('min'), 10);
        const max = parseInt(el.getAttribute('max'), 10);
        document.getElementById(input_bind).value = Math.min(Math.max(new_value, min), max);
      },
    }
  };
});
