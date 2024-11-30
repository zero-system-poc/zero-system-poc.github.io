'use strict';
chill_penguin.module('form.autocomplete', () => {
  let self;
  let state = {};
  return {
    i18n: {
      notify: {
        "en": 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
        "en-CA": 'As you start typing the application might suggest similar search terms. Use tab, up, or down arrow keys to select a suggested search string. Use Enter key to confirm that value. Use ESC key to exit the results and return focus to the input.',
        "fr": "",
      }
    },
    initialize: () => {
      self = chill_penguin.form.autocomplete;
      state = {};
      self.setup();
    },
    ready: () => {
      document.querySelectorAll("[data-module='autocomplete']").forEach(async (el) => {
        let id = el.getAttribute('id');
        let data_source_type = el.getAttribute("data-autocomplete-source-type");
        if (data_source_type === "function") {
          await self.data.initialize(id);
        }
      });
    },
    setup: () => {
      document.querySelectorAll("[data-module='autocomplete']").forEach(async (el) => {
        let id = el.getAttribute('id');
        let data_source_type = el.getAttribute("data-autocomplete-source-type");
        state[id] = {
          el,
          input: el.querySelector("[data-module='autocomplete.input']"),
          input_format: JSON.parse(el.getAttribute('data-autocomplete-input-format')),
          input_values: el.getAttribute("data-autocomplete-values") ? JSON.parse(el.getAttribute("data-autocomplete-values")) : null,
          value_format: JSON.parse(el.getAttribute("data-autocomplete-value-format")) ? JSON.parse(el.getAttribute("data-autocomplete-value-format")) : JSON.parse(`["${el.getAttribute("data-autocomplete-filter")}"]`),
          filter: el.getAttribute("data-autocomplete-filter"),
          type: el.getAttribute("data-autocomplete-type"),
          data_source_type: data_source_type,
          data_source: el.getAttribute("data-autocomplete-source"),
          data_raw: "",
          data_working: "",
          results: el.querySelector("[data-module='autocomplete.results']"),
          max_num_results: parseInt(el.querySelector("[data-module='autocomplete.results']").getAttribute('data-autocomplete-max-results')),
          sr_description: el.querySelector("[data-module='autocomplete.sr-description']"),
          error_message: el.querySelector("[data-module='autocomplete.error']") || false,
          multiselect: el.querySelector("[data-module='autocomplete.multiselect']") || false,
          multiselect_tags_container: el.querySelector("[data-module='autocomplete.multiselect-tags']") || false,
          multiselect_tags_limit: parseInt(el.getAttribute("data-autocomplete-multiselect-tags-limit"),10) || Infinity,
          onupdate: el.getAttribute('data-autocomplete-onupdate-func') || false,
          onpreview: el.getAttribute('data-autocomplete-preview-func') || false,
          preview_value: el.getAttribute("data-autocomplete-preview-value") ? JSON.parse(el.getAttribute("data-autocomplete-preview-value")) : null,
        };
        if (data_source_type === "fetch" || data_source_type === "file") {
          await self.data.initialize(id);
        }
        self.ui.create_default_tags(id);
        self.event_listeners.initialize(id);
      });
    },
    data: {
      initialize: async (id) => {
        try {
          const { input_values, value_format, data_source_type, data_source } = state[id];
          let data;
          if (data_source_type === "fetch") {
            data = await chill_penguin.util.fetch(data_source);
          } else if (data_source_type === "function") {
            data = await chill_penguin.util.run_str_func(data_source);
          } else if (data_source_type === "file") {
            data = data_source;
          }
          if (data) {
            state[id]["data_raw"] = data;
            // Initialize data_working with data, assuming no entry is selected initially
            state[id]["data_working"] = data.map(item => ({ ...item, status: '' }));
            // If there are input_values, mark the corresponding entries in data_working as "selected"
            if (input_values && input_values.length > 0) {
              // Iterate over data_working to find and mark input_values
              state[id]["data_working"].forEach(item => {
                if (input_values.includes(item[value_format])) {
                  // Mark this item as selected
                  item.status = 'selected';
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to initialize data:', error);
        }
      },
      update_input_value: (id, selected_values) => {
        const { el, type, onupdate } = state[id];
        state[id].input_values = selected_values;
        el.setAttribute('data-autocomplete-values', JSON.stringify(selected_values));
        if (onupdate) {
          chill_penguin.util.run_str_func( onupdate, { id } );
        }
      }
    },
    a11y: {
      update_sr_description: (id, value) => {
        const { sr_description } = state[id];
        sr_description.innerHTML = (value === '') ? self.i18n.notify[LANG] : value;
      },
    },
    event_listeners: {
      keys_to_ignore: [keyboard.keys.tab, keyboard.keys.esc, keyboard.keys.down, keyboard.keys.up, keyboard.keys.enter, keyboard.keys.shift],
      initialize: (id) => {
        const { results, input, max_num_results, error_message } = state[id];

        input.removeEventListener('keydown', self.event_listeners.input.keydown_navigate_dropdown);
        input.addEventListener('keydown', self.event_listeners.input.keydown_navigate_dropdown);
        input.removeEventListener('keydown', self.event_listeners.input.keydown_search_string);
        input.addEventListener('keydown', self.event_listeners.input.keydown_search_string);
        input.removeEventListener('keyup', self.event_listeners.input.clear_input);
        input.addEventListener('keyup', self.event_listeners.input.clear_input);
        input.removeEventListener('focus', self.event_listeners.input.focus);
        input.addEventListener('focus', self.event_listeners.input.focus);
      },
      input: {
        keydown_navigate_dropdown: (event) => {
          const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="autocomplete"]').getAttribute('id');
          const { el, results, input, onpreview } = state[id];
          let selected_dropdown = results.querySelector('.selected');
          const previous_selection = selected_dropdown && selected_dropdown.getAttribute('data-sr-description');
          el.setAttribute("data-autocomplete-last-removed",previous_selection);
          switch (event.keyCode) {
            case keyboard.keys.down:
              // select next suggestion from list
              if (selected_dropdown) {
                selected_dropdown.classList.remove('selected');

                if (selected_dropdown === results.querySelector('li:last-child')) {
                  results.querySelector('li:nth-child(1)').classList.add('selected');
                } else {
                  selected_dropdown.nextElementSibling.classList.add('selected');
                }
              } else {
                results.querySelector('li:nth-child(1)') && results.querySelector('li:nth-child(1)').classList.add('selected');
              }

              if (results.querySelector('.selected')) {
                const current_selection = results.querySelector('.selected').getAttribute('data-sr-description');
                el.setAttribute("data-autocomplete-last-added",current_selection);
                self.a11y.update_sr_description(id, current_selection);
                el.setAttribute('data-autocomplete-preview-value', `["${current_selection}"]`);
                input.setAttribute('aria-activedescendant', results.querySelector('.selected').getAttribute('id'));
                if (onpreview) {
                  chill_penguin.util.run_str_func( onpreview, { id } );
                }
              }
              break;

            case keyboard.keys.up:
              // select previous suggestion from list
              if (selected_dropdown) {
                selected_dropdown.classList.remove('selected');

                if (selected_dropdown === results.querySelector('li:nth-child(1)')) {
                  results.querySelector('li:last-child').classList.add('selected');
                } else {
                  selected_dropdown.previousElementSibling.classList.add('selected');
                }

                const current_selection = results.querySelector('.selected').getAttribute('data-sr-description');
                el.setAttribute("data-autocomplete-last-added",current_selection);
                self.a11y.update_sr_description(id, current_selection);
                el.setAttribute('data-autocomplete-preview-value', `["${current_selection}"]`);
                input.setAttribute('aria-activedescendant', results.querySelector('.selected').getAttribute('id'));
                if (onpreview) {
                  chill_penguin.util.run_str_func( onpreview, { id } );
                }
              }
              break;

            case keyboard.keys.esc:
            case keyboard.keys.tab:
              // empty list and hide suggestion box
              self.action.close(id, true);
              break;

            case keyboard.keys.enter:
              event.preventDefault();

              if (selected_dropdown) {
                selected_dropdown.click();
              }
              break;
          }
        },
        keydown_search_string: (event) => {
          const keydown_search_string_handler = chill_penguin.debounce(self.event_listeners.input.keydown_search_string_debounced, 250);
          keydown_search_string_handler(event);
        },
        keydown_search_string_debounced: (event) => {
          const id = chill_penguin.util.closest_parent(event.target, '[data-module="autocomplete"]').getAttribute('id');
          if (!self.event_listeners.keys_to_ignore.includes(event.keyCode)) {
            self.action.execute_search(id);
          }
        },
        clear_input: (event) => {
          const id = chill_penguin.util.closest_parent(event.currentTarget, '[data-module="autocomplete"]').getAttribute('id');
          const { type } = state[id];
          switch (event.keyCode) {
            case keyboard.keys.backspace:
            case keyboard.keys.delete:
              if (event.currentTarget.value === "") {
                if (type === "single-select") {
                  self.data.update_input_value(id,[]);
                }
                self.action.close(id, true);
              }
              break;
          }
        },
        focus: (event) => {
          const id = chill_penguin.util.closest_parent(event.target, '[data-module="autocomplete"]').getAttribute('id');
          const { error_message } = state[id];
          self.a11y.update_sr_description(id, event.target.value);
          document.getElementById(id).classList.add('active');
          document.getElementById(id).setAttribute('aria-expanded', 'true');
          error_message.classList.remove('has-error');
        },
      },
      outside_dropdown: {
        click: {
          close: () => {
            if (event.target.getAttribute('data-module') !== 'autocomplete.results-item' && event.target.getAttribute('data-module') !== 'autocomplete.tag.button') {
              setTimeout(() => {
                self.action.close();
              }, 250);
            }
          }
        }
      },
    },
    action: {
      execute_search: (id) => {
        const { input } = state[id];
        const query = input.value.trim();
        if (query.length > 0) {
          self.ui.show_autocomplete_list(id);
        }
      },
      close: () => {
        document.removeEventListener('click', self.event_listeners.outside_dropdown.click.close);
        document.querySelectorAll("[data-module='autocomplete']").forEach((el) => {
          el.classList.remove('active');
          el.setAttribute('aria-expanded', 'false');
          el.querySelector("[data-module='autocomplete.results']").classList.add('display:none');
          el.querySelector("[data-module='autocomplete.results']").innerHTML = '';
        });
      },
    },
    ui: {
      create_default_tags: (id) => {
        const { data_working, input_format, multiselect_tags_container } = state[id];
        if (data_working && multiselect_tags_container) {
          data_working.forEach((item, index) => {
            if (item.status === 'selected') {

              const result_string = self.util.modify_format(input_format,item);
              let tag = self.util.create_tag_html(id, index, result_string);
              multiselect_tags_container.innerHTML += tag;
            }
          });
        }
      },
      show_autocomplete_list: (id) => {
        const { type, input, filter, data_working, results, max_num_results, multiselect_tags_limit } = state[id];
        const query = input.value.trim();
        let database_temp_keyword;

        if (data_working.length > 0) {
          results.innerHTML = "";
          let count = 0;

          if (data_working.filter(item => item.status === 'selected').length < multiselect_tags_limit) {
            for (let i = 0; i < data_working.length; i++) {
              database_temp_keyword = data_working[i][filter].toLowerCase();
              if (data_working[i]["status"] === "" && data_working[i][filter] !== "" && (query === "*" || database_temp_keyword.includes(query.toLowerCase()))) {
                count++;
                document.removeEventListener('click', self.event_listeners.outside_dropdown.click.close);
                document.addEventListener('click', self.event_listeners.outside_dropdown.click.close);
                results.insertAdjacentHTML('beforeend', self.ui.render_autocomplete_result(id, i, data_working[i]));
                results.classList.remove("display:none");
                document.getElementById(id).classList.add("active");
                document.getElementById(id).setAttribute("aria-expanded", "true");
                if (count === max_num_results) {
                  break;
                }
              }
            }
          } else {
            results.classList.add("display:none");
          }
        }
      },
      render_autocomplete_result: (id, index, entry) => {
        const { type, input, input_format, max_num_results } = state[id];
        const result_string = self.util.modify_format(input_format,entry);
        const input_id = input.getAttribute("id");
        if (type === "single-select") {
          return `\n        <li role="option" data-module="autocomplete.results-item" id="autocomplete-suggestion-${index}" class="unstyle w:100% display:flex align:middle" data-sr-description="${result_string}" onclick="chill_penguin.form.autocomplete.ui.autocomplete_fill('${id}', ${index}, '${result_string}');chill_penguin.form.autocomplete.action.close();">${chill_penguin.util.encode_html_entities(result_string)}</li>`;
        } else if (type === "multiselect") {
          return `\n        <li role='option' data-module="autocomplete.results-item" id='autocomplete-suggestion-${index}' class='unstyle w:100% display:flex align:middle' data-sr-description='${result_string}' onclick='chill_penguin.form.autocomplete.ui.autocomplete_fill("${id}", ${index}, "${result_string}");document.getElementById("${input_id}").focus();'>${chill_penguin.util.encode_html_entities(result_string)}</li>`;
        }
      },
      autocomplete_fill: (id, index, result_string) => {
        const { el, value_format, type, input, max_num_results, results, data_working, onupdate } = state[id];
        const input_id = input.getAttribute("id");
        const query = input.value.trim();
        if (type === "single-select") {
          results.innerHTML = "";
          input.value = result_string;
          self.data.update_input_value(id,[self.util.modify_format(value_format,data_working[index])]);
        } else if (type === "multiselect") {
          const { multiselect_tags_container } = state[id];
          data_working[index]["status"] = "selected";
          input.value = "";
          self.ui.show_autocomplete_list(id);
          multiselect_tags_container.innerHTML += self.util.create_tag_html(id, index, result_string);

          const selected_values = state[id].input_values || [];
          const value_to_add = self.util.modify_format(value_format,data_working[index]);
          if (!selected_values.includes(value_to_add)) {
            selected_values.push(value_to_add);
          }
          el.removeAttribute("data-autocomplete-last-removed");
          el.setAttribute("data-autocomplete-last-added",value_to_add);

          self.data.update_input_value(id, selected_values);
        }
      },
      remove_selected: (id, index) => {
        const { el, value_format, input, max_num_results, results, data_working } = state[id];
        document.getElementById(id).querySelector(`[data-autocomplete-tag="${index}"]`).remove();
        data_working[index]["status"] = "";
        const selected_values = state[id].input_values || [];
        const value_to_remove = self.util.modify_format(value_format,data_working[index]);
        const updated_values = selected_values.filter(value => value !== value_to_remove);
        el.removeAttribute("data-autocomplete-last-added");
        el.setAttribute("data-autocomplete-last-removed",value_to_remove);
        self.data.update_input_value(id, updated_values);
      }
    },
    util: {
      modify_format: (format,entry) => {
        const result_string = format.reduce((acc, key) => {
          if (key in entry) {
            // If the key exists in entry and entry[key] is truthy, use entry[key]
            return acc + (entry[key] ? entry[key] : key);
          }
          // If the key is not present in entry, use the key itself
          return acc + key;
        }, '').trim();
        return result_string;
      },
      create_tag_html: (id, index, result_string) => {
        return `<div class='heebo:bold py:2px px:8px brr:4px mr:4px my:2px b-silver:1px display:flex align:middle' data-autocomplete-tag='${index}'>${chill_penguin.util.encode_html_entities(result_string)} <button data-module='autocomplete.tag.button' class='heebo:bold fs:20px color:white pl:4px lh:0' onclick='chill_penguin.form.autocomplete.ui.remove_selected("${id}", ${index});'>&times;</button></div>`;
      }
    }
  };
});
