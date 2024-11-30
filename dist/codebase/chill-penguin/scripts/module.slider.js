'use strict';
chill_penguin.module('slider', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.slider;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="slider.input-container"]').forEach((container) => {
        const el = container.querySelector(":scope > [data-module='slider.input']");
        const id = el.getAttribute('id');
        state[id] = {
          el,
          slider_container: container,
          label_container: container.querySelector(':scope > [data-module="slider.labels"]'),
          labels: container.querySelectorAll(':scope > [data-module="slider.labels"] > * '),
          slider_fill: container.querySelector(':scope > [data-module="slider.background"] > [data-module="slider.fill"]'),
          input_bind: el.getAttribute("data-slider-bind-input"),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        self.ui.label_resize(id);
        self.ui.update_slider_track(id);
      },
      label_resize: (id) => {
        const { slider_container, labels, label_container } = state[id];
        const num_labels = labels.length;
        const container_width = slider_container.offsetWidth;
        const full_label_width = (container_width * num_labels) / (num_labels - 1);
        const transform_left = (50 / num_labels) * -1;
        label_container.style.width = `${full_label_width}px`;
        label_container.style.transform = `translateX(${transform_left}%)`;
      },
      update_slider_track: (id) => {
        const { el, slider_fill } = state[id];
        const percentage = Math.round(((el.value - el.getAttribute('min')) / (el.getAttribute('max') - el.getAttribute('min'))) * 100);
        slider_fill.style.width = `${percentage}%`;
      },
    },
    event_listeners: {
      initialize: (id) => {
        const { el, input_bind } = state[id];
        el.removeEventListener('input', self.event_listeners.handle_slider_change);
        el.addEventListener('input', self.event_listeners.handle_slider_change);
        if (input_bind) {
          el.removeEventListener('input', self.event_listeners.handle_input_bind);
          el.addEventListener('input', self.event_listeners.handle_input_bind);
        }
        self.event_listeners.resize_listener(id);
      },
      handle_slider_change: (event) => {
        self.ui.update_slider_track(event.currentTarget.getAttribute('id'));
      },
      handle_input_bind: (event) => {
        self.action.set_input_bind_value(event.currentTarget.getAttribute('id'),event.currentTarget.getAttribute('data-slider-bind-input'),event.currentTarget.value);
      },
      resize_listener: (id) => {
        const { el } = state[id];
        const label_resize = () => {
          self.ui.label_resize(id);
        };
        chill_penguin.resize_observer(el, label_resize);
      },
    },
    action: {
      set_value: (id, new_value) => {
        const { el, input_bind } = state[id];
        el.value = new_value;
        self.ui.update_slider_track(id);
        if (input_bind) {
          self.action.set_input_bind_value(id, input_bind, new_value);
        }
      },
      set_input_bind_value: (id, input_bind, new_value) => {
        const { el } = state[id];
        const min = parseInt(el.getAttribute('min'), 10);
        const max = parseInt(el.getAttribute('max'), 10);
        document.getElementById(input_bind).value = Math.min(Math.max(new_value, min), max);
      },
    }
  };
});
