'use strict';
chill_penguin.module('form.validation', () => {
  let self;
  let has_validation_passed = true;
  let error_number = 0;
  let state = {};

  return {
    initialize: () => {
      self = chill_penguin.form.validation;
      state = {};
      self.setup.initialize();
      self.setup.inline_field_validation();
    },
    setup: {
      initialize: () => {
        document.querySelectorAll(`[data-module='form']`).forEach((el, index) => {
          let form_name = el.getAttribute('name');
          state[form_name] = {};
          document.querySelectorAll(`[data-module='form'][name=${form_name}] [data-required], [data-module='form'][name=${form_name}] [data-optional]`).forEach((el, index) => {
            let form_element_name = el.getAttribute('name');
            state[form_name][form_element_name] = {
              type: self.setup.util.get_type(el),
              validation_necessity: self.setup.util.get_validation_necessity(el),
              validation_timing: self.setup.util.get_validation_timing(el),
              validation_criteria: el.getAttribute(`data-${self.setup.util.get_validation_necessity(el)}`).split(','),
            };
          });
        });
      },
      util: {
        get_type: (el) => {
          if (el.tagName.toLowerCase() === 'input' && el.hasAttribute('type')) {
            return el.getAttribute('type').toLowerCase();
          } else if (el.tagName.toLowerCase() === 'select') {
            return 'dropdown';
          } else if (el.tagName.toLowerCase() === 'textarea') {
            return 'text';
          }
        },
        get_validation_necessity: (el) => {
          if (el.hasAttribute('data-required')) {
            return 'required';
          } else if (el.hasAttribute('data-optional')) {
            return 'optional';
          } else {
            return '';
          }
        },
        get_validation_timing: (el) => {
          if (el.hasAttribute('data-validation-type')) {
            if (el.getAttribute('data-validation-type') === 'inline') {
              return 'inline';
            } else {
              return 'onsubmit';
            }
          } else {
            return 'onsubmit';
          }
        }
      },
      inline_field_validation: () => {
        document.querySelectorAll(`[data-module='form']`).forEach((el, index) => {
          const form_name = el.getAttribute('name');

          document.querySelectorAll(`[data-module='form'][name=${form_name}] [data-validation-type=inline][data-required],[data-module='form'][name=${form_name}] [data-validation-type=inline][data-optional]`).forEach((el, index) => {
            const form_element_name = el.getAttribute('name');
            self.type.inline(el, form_name, form_element_name);
            el.removeEventListener('keyup', self.event_listeners.inline.input.keyup);
            el.addEventListener('keyup', self.event_listeners.inline.input.keyup);
          });
        });
      },
    },
    event_listeners: {
      inline: {
        input: {
          keyup: (event) => {
            const el = event.currentTarget;
            const form_name = chill_penguin.util.closest_parent(event.target, `[data-module='form']`).getAttribute('name');
            const form_element_name = el.getAttribute('name');
            self.type.inline(el, form_name, form_element_name);
          },
        },
      },
    },
    type: {
      inline: (el, form_name, form_element_name) => {
        for (let i = 0; i < state[form_name][form_element_name]['validation_criteria'].length; i++) {
          //console.log(state[form_name][form_element_name]["validation_criteria"][i]);

          if (state[form_name][form_element_name]['validation_criteria'][i] === 'equals') {
            el = document.querySelector(`[name='${form_element_name}']`);
            let el_comparison = document.getElementById(el.getAttribute('data-matching'));
            // console.log(el, el_comparison);
            // console.log(el.value, el_comparison.value);
            if (self.validate.string_value(el.value, 'equals', el_comparison.value)) {
              document.getElementById(`${el.name}:equals`).parentNode.closest('li').classList.add('pass');
              document.getElementById(`${el.name}:equals`).parentNode.closest('li').classList.remove('fail');
            } else {
              document.getElementById(`${el.name}:equals`).parentNode.closest('li').classList.add('fail');
              document.getElementById(`${el.name}:equals`).parentNode.closest('li').classList.remove('pass');
            }
          } else {
            if (self.validate.string_value(el.value, state[form_name][form_element_name]['validation_criteria'][i])) {
              document.getElementById(`${form_element_name}:${state[form_name][form_element_name]['validation_criteria'][i]}`).parentNode.closest('li').classList.add('pass');
              document.getElementById(`${form_element_name}:${state[form_name][form_element_name]['validation_criteria'][i]}`).parentNode.closest('li').classList.remove('fail');
            } else {
              document.getElementById(`${form_element_name}:${state[form_name][form_element_name]['validation_criteria'][i]}`).parentNode.closest('li').classList.add('fail');
              document.getElementById(`${form_element_name}:${state[form_name][form_element_name]['validation_criteria'][i]}`).parentNode.closest('li').classList.remove('pass');
            }
          }
        }
      },
      form: (event, form_name, on_success_function, on_success_args=[]) => {
        error_number = 0;
        has_validation_passed = true;

        //console.log(state);
        let form_element_names = Object.keys(state[form_name]);
        for (let i = 0; i < form_element_names.length; i++) {
          //Reset all error messages and highlights
          for (let j = 0; j < state[form_name][form_element_names[i]]['validation_criteria'].length; j++) {
            self.ui.display_error_message(form_element_names[i], 'equals', true);
            self.ui.display_error_message(form_element_names[i], 'is_not_empty', true);
            self.ui.display_error_message(form_element_names[i], state[form_name][form_element_names[i]]['validation_criteria'][j], true);
            self.ui.hightlight_error(form_element_names[i], state[form_name][form_element_names[i]]['type'], true);
          }

          for (let j = 0; j < state[form_name][form_element_names[i]]['validation_criteria'].length; j++) {
            let type = state[form_name][form_element_names[i]]['type'];
            let validation_necessity = state[form_name][form_element_names[i]]['validation_necessity'];
            if (validation_necessity === 'required') {
              if (document.querySelector(`[name='${form_element_names[i]}']`).value === '' || type === 'radio' || type === 'checkbox') {
                has_validation_passed = self.validate.input_type(form_element_names[i], type, 'is_not_empty');
                self.ui.display_error_message(form_element_names[i], 'is_not_empty', has_validation_passed);
                self.ui.hightlight_error(form_element_names[i], type, has_validation_passed);
                error_number += has_validation_passed ? 0 : 1;
              } else {
                if (state[form_name][form_element_names[i]]['validation_criteria'][j] === 'equals') {
                  // console.log('****************');
                  // console.log(state[form_name][form_element_names[i]]);
                  // console.log(state[form_name][form_element_names[i]]['validation_criteria']);
                  // console.log(state[form_name][form_element_names[i]]['validation_criteria'][j]);
                  let el = document.querySelector(`[name='${form_element_names[i]}']`);
                  let el_comparison = document.getElementById(el.getAttribute('data-matching'));
                  has_validation_passed = self.validate.string_value(el.value, 'equals', el_comparison.value);
                  error_number += has_validation_passed ? 0 : 1;
                  self.ui.display_error_message(form_element_names[i], 'equals', has_validation_passed);
                  self.ui.hightlight_error(form_element_names[i], type, has_validation_passed);
                } else {
                  //console.log(state[form_name][form_element_names[i]]['validation_criteria']);
                  has_validation_passed = self.validate.input_type(form_element_names[i], type, state[form_name][form_element_names[i]]['validation_criteria'][j]);
                  error_number += has_validation_passed ? 0 : 1;
                  self.ui.display_error_message(form_element_names[i], state[form_name][form_element_names[i]]['validation_criteria'][j], has_validation_passed);
                  if (has_validation_passed === false) {
                    self.ui.hightlight_error(form_element_names[i], type, false);
                    break;
                  }
                }
              }
            } else if (validation_necessity === 'optional') {
              if (document.querySelector(`[name='${form_element_names[i]}']`).value === '' || type === 'radio' || type === 'checkbox') {
              } else {
                if (state[form_name][form_element_names[i]]['validation_criteria'][j] === 'equals') {
                  let el = document.querySelector(`[name='${form_element_names[i]}']`);
                  let el_comparison = document.getElementById(el.getAttribute('data-matching'));
                  has_validation_passed = self.validate.string_value(el.value, 'equals', el_comparison.value);
                  self.ui.display_error_message(form_element_names[i], 'equals', has_validation_passed);
                  self.ui.hightlight_error(form_element_names[i], type, has_validation_passed);
                } else {
                  has_validation_passed = self.validate.input_type(form_element_names[i], type, state[form_name][form_element_names[i]]['validation_criteria'][j]);
                  self.ui.display_error_message(form_element_names[i], state[form_name][form_element_names[i]]['validation_criteria'][j], has_validation_passed);
                  if (has_validation_passed === false) {
                    self.ui.hightlight_error(form_element_names[i], type, false);
                    break;
                  }
                }
                error_number += has_validation_passed ? 0 : 1;
              }
            }
          }
        }

        //console.log("error numbers:",error_number);
        if (error_number === 0) {
          if (typeof on_success_function === 'function') {
            if (on_success_function.constructor.name === 'AsyncFunction') {
              //console.log('is async function? yes');
              //synchronous function won't wait for async function to finish, so event.preventDefault(); will prevent default return true
              event.preventDefault();
              (async () => {
                try {
                  let result = await on_success_function(...on_success_args);
                  if (typeof result === 'boolean') {
                    if (result === true) {
                      document.getElementById(form_name).submit();
                    } else {
                      return false;
                    }
                  } else {
                    console.error('Result is not boolean');
                    return result;
                  }
                } catch {
                  console.error('on_success_function await failed');
                  return false;
                }
              })();
            } else {
              //console.log('is async function? no');
              return on_success_function();
            }
          } else {
            console.error('last on_success_function_object is not a function');
            return false;
          }
        } else {
          return false;
        }
      },
    },
    ui: {
      //display_error_message(): adds/hides the error message
      display_error_message: (element_name, validation_rules, has_validation_passed) => {
        const element = document.getElementById(`${element_name}:${validation_rules}`);
        if (element) {
          if (has_validation_passed) {
            element.classList.remove('has-error');
          } else {
            element.classList.add('has-error');
          }
        }
      },
      //hightlight_error(): highlights/hides the border of the input that has an issue
      hightlight_error: (element_name, type, has_validation_passed) => {
        //console.log(element_name,type,validation_rules,has_validation_passed);
        if (type === 'text' || type === 'number' || type === 'dropdown') {
          const label = document.querySelector(`label[for='${element_name}']`);
          if (has_validation_passed) {
            label.classList.remove('error-field');
          } else {
            label.classList.add('error-field');
          }
        }
      },
    },
    validate: {
      //input_type(): form validation based on input type
      //@param {string} element_name is the name of the form element being checked
      //@param {string} type is form element type the element belongs to (e.g. text, radio)
      //@param {string} validation_rules is the character set to test (e.g. is_alphanumeric, is_number, is_email, etc.)
      //@returns true value passes
      //@returns false value does not pass the validation rule
      input_type: (element_name, type, validation_rules) => {
        let item_selected = false;
        let el;
        if (type === 'radio' || type === 'checkbox') {
          el = document.querySelectorAll(`[name='${element_name}']`); //returns array, el gets first el
          for (let i = 0; i < el.length; i++) {
            if (el[i].checked) {
              item_selected = true;
            }
          }
          return item_selected;
        } else {
          //input, dropdown, textarea
          el = document.querySelector(`[name='${element_name}']`);
          if (el) {
            return self.validate.string_value(el.value, validation_rules);
          }
        }
      },
      //value(): returns true if value successfully tested again regex
      //@param {string} value is the value being tested
      //@param {string} validation_rules is the character set to test (e.g. is_alphanumeric, is_number, is_email, etc.)
      string_value: (value, validation_rules, comparison_value) => {
        let regex;
        switch (validation_rules) {
          case 'is_not_empty':
            return value !== '';
          case 'is_not_string_master':
            return value !== 'master';
          case 'is_alphanumeric': // alphanumeric + french characters
            regex = /^[A-Za-z\u00E0-\u00FC\d ]+$/;
            return regex.test(value);
          case 'is_lowercase':
            regex = /^[a-z]+$/;
            return regex.test(value);
          case 'is_lowercase_numbers_dash_underscore_comma': //allows lowercase, numbers, '-', '_'
            regex = /^[a-z0-9-_,]+$/;
            return regex.test(value);
          case 'is_url_pathname_friendly': //allows both lowercase, uppercase, numbers, '-', '_', '/' but excludes '\'
            regex = /^[A-Za-z0-9\/\-_]+$/;
            return regex.test(value);
          case 'is_url_folder_friendly_lowercase': //allows lowercase, numbers, - , _  but excludes /,\
            regex = /^[a-z0-9\-_]+$/;
            return regex.test(value);
          case 'is_url_pathname_friendly_lowercase': //allows lowercase, numbers, - , _ , / but excludes \
            regex = /^[a-z0-9\-/_]+$/;
            return regex.test(value);
          case 'is_number': // numbers
            regex = /^-?\d+$/;
            return regex.test(value);
          case 'is_number_or_comma_separated_numbers': //'123' or '234,345' but not '45,' or ',56'
            regex = /^\d+(,\d+)*$/;
            return regex.test(value);
          case 'is_words_or_comma_separated_words': //'example1' or 'example2,example3' but not 'example4,' or ',example5'
            regex = /^[\w\d-]+(,[\w\d-]+)*$/;
            return regex.test(value);
          case 'is_phone': //phone
            regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
            return regex.test(value);
          case 'is_email': //email
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value);
          case 'is_postal-code': //postal code
            regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
            return regex.test(value);
          case 'is_zipcode': //zip code
            regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            return regex.test(value);
          case 'is_css_hexcode': //css hexcode
            regex = /^#([0-9a-fA-F]{6})$/;
            return regex.test(value);
          case 'has_min_8_characters':
            return value.length > 7;
          case 'has_no_forward_slash':
            regex = /^[^/\\]+$/;
            return regex.test(value);
          case 'has_no_double_forward_slash':
            regex = /^(?!.*\/\/).+$/;
            return regex.test(value);
          case 'has_forward_slash_at_end':
            return value[value.length-1] === '/';
          case 'has_no_forward_slash_at_start':
            return value[0] !== '/';
          case 'has_min_1_number':
            regex = /[0-9]/i;
            return regex.test(value);
          case 'has_min_1_special_character':
            regex = /\W/;
            return regex.test(value);
          case 'has_min_1_lowercase_letter':
            regex = /[a-z]/;
            return regex.test(value);
          case 'has_min_1_uppercase_letter':
            regex = /[A-Z]/;
            return regex.test(value);
          case 'equals':
            return value === comparison_value;
          default:
            return false;
        }
      },
    }
  };
});
