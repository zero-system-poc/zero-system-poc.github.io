'use strict';
chill_penguin.module('waypoint', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.waypoint;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll("[data-module='waypoint']").forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          element: el.getAttribute('data-waypoint-element'),
          add_class: el.getAttribute('data-waypoint-add-classes') ? JSON.parse(el.getAttribute('data-waypoint-add-classes')) : [],
          remove_class: el.getAttribute('data-waypoint-remove-classes') ? JSON.parse(el.getAttribute('data-waypoint-remove-classes')) : [],
          toggle_class: el.getAttribute('data-waypoint-toggle-classes') ? JSON.parse(el.getAttribute('data-waypoint-toggle-classes')) : [],
          delay: el.getAttribute('data-waypoint-delay'),
          activate: el.getAttribute('data-waypoint-activate'),
          new_waypoint_obj: {},
        };
        self.event_listeners.initialize(id);
      });
    },
    event_listeners: {
      initialize: (id) => {
        const { element, add_class, remove_class, toggle_class, delay=0, activate } = state[id];
        state[id]['new_waypoint_obj'] = new Waypoint({
          element: 'this' ? document.getElementById(id) : document.querySelector(element),
          handler: () => {
            setTimeout(() => {
              (chill_penguin.validation.is_array(remove_class)) && document.getElementById(id).classList.remove(...remove_class);
              (chill_penguin.validation.is_array(add_class)) && document.getElementById(id).classList.add(...add_class);
              (chill_penguin.validation.is_array(toggle_class)) && document.getElementById(id).classList.toggle(...toggle_class);
            }, delay);
          },
          offset: activate,
        });
      }
    },
  };
});
