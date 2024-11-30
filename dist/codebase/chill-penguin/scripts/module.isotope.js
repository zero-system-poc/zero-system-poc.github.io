'use strict';

// // filter .property1 items
// $grid.isotope({ filter: '.property1' });

// // filter .property2 OR .property3 items
// $grid.isotope({ filter: '.property2, .property3' });

// // filter .property4 AND .property5 items
// $grid.isotope({ filter: '.property4.property5' });

// // show all items
// $grid.isotope({ filter: '*' });

chill_penguin.module('isotope', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.isotope;
      state = {};
      self.dependency.load_all().then(() => {
        self.setup();
      }).catch(error => {
        console.error('Error loading dependencies:', error);
      });
    },
    dependency: {
      load_all: async () => {
        await Promise.all([
          self.dependency.load.isotope_lib(),
          self.dependency.load.select_all(),
          self.dependency.load.autocomplete()
        ]);
      },
      load: {
        select_all: async () => {
          if (chill_penguin.form?.select_all) {
            return Promise.resolve();
          } else {
            return await chill_penguin.util.load_javascript("/dist/codebase/chill-penguin/scripts/module.form.select-all.js");
          }
        },
        autocomplete: async () => {
          if (chill_penguin.form?.autocomplete) {
            return Promise.resolve();
          } else {
            return await chill_penguin.util.load_javascript("/dist/codebase/chill-penguin/scripts/module.form.autocomplete.js");
          }
        },
        isotope_lib: async () => {
          return await chill_penguin.util.load_javascript("/wms/codebase/chill-penguin/scripts/libs/isotope-v3.0.6.min.js");
        },
      },
    },
    setup: () => {
      document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
        const id = el.getAttribute('id');
        const filter_groups_ids = JSON.parse(el.getAttribute('data-isotope-filters-bind-ids')) || [];
        state[id] = {
          el,
          isotope_object: null,
          elements_container: el.querySelector("[data-module='isotope.elements-container']"),
          layout_mode: el.getAttribute('data-isotope-layout-mode'),
          sort_data_config: el.getAttribute('data-isotope-sort-data'),
          sort_by_id: el.getAttribute('data-isotope-sortBy-bind-id') || null,
          sort_by_value: null,
          sort_ascending_id: el.getAttribute('data-isotope-sortAscending-bind-id') || null,
          sort_ascending_value: true,
          filter_values: [el.getAttribute('data-isotope-filter-initial')],
          filter_initial: el.getAttribute('data-isotope-filter-initial'), //* or .isotope-no-results
          filter_no_results: el.getAttribute('data-isotope-filter-no-results'), //* or .isotope-no-results
          filters: {},
          filter_groups_ids: JSON.parse(el.getAttribute('data-isotope-filters-bind-ids')) || [],
          filter_groups_key: filter_groups_ids.map(id => document.querySelector(`[data-isotope-filter-group][id="${id}"]`)?.getAttribute('data-isotope-filter-group') || null),
          filter_groups_types: filter_groups_ids.map(id => document.querySelector(`[data-isotope-filter-group][id="${id}"]`)?.getAttribute('data-isotope-filter-group-type') || null),
          filtered_elements_id: el.getAttribute('data-isotope-number-filtered-elements-bind-id') || null,
          custom_styles: JSON.parse(el.getAttribute('data-isotope-zebra-stripes')) || [],
          onupdate: el.getAttribute('data-isotope-onupdate-func') || false,
        };
        self.event_listeners.initialize(id);
        self.ui.initialize(id);
      });
    },
    config: {
      state: {
        get: {
          sort_by: (id) => {
            return state[id].sort_by_value;
          },
          sort_ascending: (id) => {
            return state[id].sort_ascending_value;
          },
          filter: (id) => {
            return state[id].filter_values;
          },
          number_filtered_elements: (id) => {
            if (state[id].filtered_elements_id && document.querySelector(`#${state[id].filtered_elements_id}`)) {
              document.querySelector(`#${state[id].filtered_elements_id}`).innerHTML = state[id].isotope_object.getFilteredItemElements().length;
            }
          },
        },
        set: {
          sort_by: (id) => {
            const { sort_by_id } = state[id];
            if (sort_by_id) {
              state[id].sort_by_value = chill_penguin.radiobutton.get_value(`#${sort_by_id} > input`, 'data-isotope-sort-value');
            }
          },
          sort_ascending: (id) => {
            const { sort_ascending_id } = state[id];
            if (sort_ascending_id) {
              state[id].sort_ascending_value = JSON.parse(chill_penguin.radiobutton.get_value(`#${sort_ascending_id} > input`, 'data-isotope-sort-value'));
            }
          },
          filter: (id) => {
            //this setTimeout ensures the select_all event listener is run first, regardless of when the event listener is initialized
            //the select_all has to run first or the checkboxes will not be accurately retrieved
            setTimeout(() => {
              const { filter_initial, filter_no_results, filter_groups_ids, filter_groups_key, filter_groups_types } = state[id];
              let filter_group_elem;
              if (filter_groups_ids.length > 0) {

                filter_groups_ids.forEach((filter_group_id, index) => {
                  state[id].filters[filter_groups_key[index]] = [];
                });
                filter_groups_ids.forEach((filter_group_id, index) => {
                  //console.log(filter_groups_key[index]);
                  switch (filter_groups_types[index]) {
                    case "checkbox":
                      const all_checkboxes = document.querySelectorAll(`#${filter_group_id} input`);
                      //console.log(all_checkboxes);
                      const all_checkboxes_checked = Array.from(all_checkboxes).every(checkbox => checkbox.checked);
                      filter_group_elem = document.querySelector(`#${filter_group_id}`);

                      if (all_checkboxes_checked) {
                        state[id].filters[filter_groups_key[index]] = '*';
                      } else {
                        let filter_group_checkbox_values = chill_penguin.checkbox.get_values(`#${filter_group_id} input`, 'data-isotope-filter-value');

                        if (filter_group_elem.hasAttribute('data-isotope-or-and-bind')) {
                          const or_and_bind_id = filter_group_elem.getAttribute('data-isotope-or-and-bind');
                          const or_and_value = chill_penguin.radiobutton.get_value(`#${or_and_bind_id}  input`);
                          filter_group_checkbox_values = (or_and_value === 'and') ? [filter_group_checkbox_values.join('') || filter_no_results] : filter_group_checkbox_values;
                        }
                        //console.log(filter_group_checkbox_values);
                        state[id].filters[filter_groups_key[index]] = [...new Set([...(state[id].filters[filter_groups_key[index]] || []), ...filter_group_checkbox_values])];
                      }
                      break;
                    case "radiobutton":
                      state[id].filters[filter_groups_key[index]] = chill_penguin.radiobutton.get_value(`#${filter_group_id} input`,'data-isotope-filter-value');
                      break;
                    case "input_autocomplete":
                      const autocomplete_el = document.querySelector(`#${filter_group_id}`);
                      if (autocomplete_el.hasAttribute('data-autocomplete-values')) {
                        if (autocomplete_el.getAttribute('data-autocomplete-values') === '[]') {
                          state[id].filters[filter_groups_key[index]] = autocomplete_el.getAttribute('data-isotope-filter-initial') || '*';
                        } else {
                          state[id].filters[filter_groups_key[index]] = (JSON.parse(autocomplete_el.getAttribute('data-autocomplete-values'))
                            .map(str => str.toLowerCase().replace(/ /g, '-')));
                        }
                      } else {
                        state[id].filters[filter_groups_key[index]] = autocomplete_el.getAttribute('data-isotope-filter-initial') || '*';
                      }
                      break;
                    case "switch":
                      const all_switches = document.querySelectorAll(`#${filter_group_id} button`);
                      const all_switches_checked = Array.from(document.querySelectorAll('button[aria-checked]')).every(button => button.getAttribute('aria-checked') === 'true');

                      filter_group_elem = document.querySelector(`#${filter_group_id}`);

                      if (all_switches_checked) {
                        state[id].filters[filter_groups_key[index]] = '*';
                      } else {
                        let filter_group_checkbox_values = chill_penguin.button.get_values(`#${filter_group_id} button`, 'data-isotope-filter-value');

                        if (filter_group_elem.hasAttribute('data-isotope-or-and-bind')) {
                          const or_and_bind_id = filter_group_elem.getAttribute('data-isotope-or-and-bind');
                          const or_and_value = chill_penguin.button.get_value(`#${or_and_bind_id} button`);
                          filter_group_checkbox_values = (or_and_value === 'and') ? [filter_group_checkbox_values.join('') || filter_no_results] : filter_group_checkbox_values;
                        }
                        //console.log(filter_group_checkbox_values);
                        state[id].filters[filter_groups_key[index]] = [...new Set([...(state[id].filters[filter_groups_key[index]] || []), ...filter_group_checkbox_values])];
                      }
                      break;
                    default:
                      break;
                  }
                });
                //console.log(state[id].filters);
                state[id].filter_values = chill_penguin.isotope.util.combine_obj_value(state[id].filters);
              }
            }, 0);
          }
        },
      },
    },
    ui : {
      initialize: (id) => {
        const { layout_mode, filter_initial, sort_data_config, elements_container, onupdate } = state[id];
        self.config.state.set.sort_by(id);
        self.config.state.set.sort_ascending(id);
        self.config.state.set.filter(id);
        const config = {
          itemSelector: '[data-module="isotope.element"]',
          layoutMode: layout_mode,
          getSortData: JSON.parse(sort_data_config),
          sortBy: self.config.state.get.sort_by(id),
          filter: filter_initial,
          sortAscending: self.config.state.get.sort_ascending(id),
        }
        //console.log(config);
        state[id].isotope_object = new Isotope(elements_container, config);
        self.config.state.get.number_filtered_elements(id);
        self.ui.custom_styles(id);
        if (onupdate) {
          chill_penguin.util.run_str_func( onupdate, { id } );
        }
        //console.log(state[id].isotope_object);
      },
      refresh: (id) => {
        const { filter_no_results, onupdate } = state[id];
        setTimeout(() => {
          //console.log(self.config.state.get.filter(id));
          const new_config = {
            sortBy: self.config.state.get.sort_by(id),
            filter: (self.config.state.get.filter(id).length > 0) ? self.config.state.get.filter(id) : filter_no_results,
            sortAscending: self.config.state.get.sort_ascending(id),
          };
          //console.log(new_config);
          state[id].isotope_object.arrange(new_config);
          self.config.state.get.number_filtered_elements(id);
          self.ui.custom_styles(id);
          if (onupdate) {
            chill_penguin.util.run_str_func( onupdate, { id } );
          }
          setTimeout(() => {
            chill_penguin.equalize_heights.force_resize();
          },500);
        },100);
      },
      refresh_all: () => {
        document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
          if (el.offsetParent !== null) {
            const id = el.getAttribute('id');
            if (state[id]) {
              //console.log("refresh_all");
              self.config.state.set.sort_by(id);
              self.config.state.set.sort_ascending(id);
              self.config.state.set.filter(id);
              self.ui.refresh(id);
            }
          }
        });
      },
      rearrange_heights: () => {
        document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
          if (el.offsetParent !== null) {
            //console.log("rearrange_heights");
            const id = el.getAttribute('id');
            if (state[id]) {
              self.ui.refresh(id);
            }
          }
        });
      },
      custom_styles: (id) => {
        const { isotope_object, custom_styles } = state[id];
        const frequency = custom_styles[0];
        const css_classes_array = custom_styles[1];
        isotope_object.getItemElements().forEach((el) => {
          el.classList.remove(css_classes_array);
        });
        isotope_object.getFilteredItemElements().forEach((element,index) => {
          (index % frequency === 0) && element.classList.add(css_classes_array);
        });
      },
    },
    event_listeners : {
      initialize: (id) => {
        self.event_listeners.sort_by(id);
        self.event_listeners.sort_ascending(id);
        self.event_listeners.filters(id);
        self.event_listeners.select_all(id);
        self.event_listeners.or_and(id);
      },
      set: {
        sort_by: () => {
          const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="isotope"]').getAttribute('id');
          self.config.state.set.sort_by(id);
          self.ui.refresh(id);
        },
        sort_ascending: () => {
          const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="isotope"]').getAttribute('id');
          self.config.state.set.sort_ascending(id);
          self.ui.refresh(id);
        },
        filter: () => {
          const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="isotope"]').getAttribute('id');
          self.config.state.set.filter(id);
          self.ui.refresh(id);
        },
      },
      sort_by: (id) => {
        const { sort_by_id } = state[id];
        if (sort_by_id) {
          document.querySelectorAll(`#${sort_by_id} > input`).forEach((el) => {
            el.removeEventListener('click', self.event_listeners.set.sort_by);
            el.addEventListener('click', self.event_listeners.set.sort_by);
          });
        }
      },
      sort_ascending: (id) => {
        const { sort_ascending_id } = state[id];
        if (sort_ascending_id) {
          document.querySelectorAll(`#${sort_ascending_id} > input`).forEach((el) => {
            el.removeEventListener('click', self.event_listeners.set.sort_ascending);
            el.addEventListener('click', self.event_listeners.set.sort_ascending);
          });
        }
      },
      filters: (id) => {
        const { filter_groups_ids } = state[id];
        filter_groups_ids.forEach((filter_group_id) => {
          document.querySelectorAll(`#${filter_group_id} input, #${filter_group_id} button`).forEach((el) => {
            el.removeEventListener('click', self.event_listeners.set.filter);
            el.addEventListener('click', self.event_listeners.set.filter);
          });
        });
      },
      select_all: (id) => {
        const { el } = state[id];
        el.querySelectorAll(`[data-module="select-all"]`).forEach((select_all_el) => {
          const select_all_radiobuttons_id = select_all_el.getAttribute('data-select-all-bind');
          el.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.all']`).removeEventListener('click', self.event_listeners.set.filter);
          el.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.all']`).addEventListener('click', self.event_listeners.set.filter);
          el.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.none']`).removeEventListener('click', self.event_listeners.set.filter);
          el.querySelector(`#${select_all_radiobuttons_id} > input[data-module='select-all.none']`).addEventListener('click', self.event_listeners.set.filter);
        });
      },
      or_and: (id) => {
        const { el } = state[id];
        el.querySelectorAll(`[data-module="select-all"]`).forEach((select_all_el) => {
          if (select_all_el.getAttribute('data-isotope-or-and-bind')) {
            const isotope_or_and_radiobuttons_id = select_all_el.getAttribute('data-isotope-or-and-bind');
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > input[data-module='isotope.or']`).removeEventListener('click', self.event_listeners.set.filter);
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > input[data-module='isotope.or']`).addEventListener('click', self.event_listeners.set.filter);
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > input[data-module='isotope.and']`).removeEventListener('click', self.event_listeners.set.filter);
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > input[data-module='isotope.and']`).addEventListener('click', self.event_listeners.set.filter);
          }
        });
      }

    },
    util: {
      combine_obj_value: (obj) => {
        // Get an array of property values
        const values = Object.values(obj);

        if (values.every(value => value === "*")) {
          return "*";
        }

        // Use reduce to iterate through the arrays and combine values
        const combined_values = values.reduce((acc, current_value) => {
          // Ignore the current value if it is "*"
          if (current_value === "*") {
            return acc;
          }
          // Ensure that the current value is an array
          if (Array.isArray(current_value)) {
            // Combine each element of the current array with existing elements in acc
            return acc.flatMap((existing_value) =>
              current_value.map((current_element) => `${existing_value}${current_element}`)
            );
          }

          // If the current value is not an array, just concatenate it with existing elements in acc
          return acc.map((existing_value) => `${existing_value}${current_value}`);
        }, ['']); // Initialize with an array containing an empty string

        // Join the combined values with a comma and return
        return combined_values.join(",");
      },
    }
  };
});