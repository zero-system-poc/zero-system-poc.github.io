'use strict';

/* Define global constants and map */
const keyboard = {};
keyboard.keys = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
  space: 32,
  delete: 46,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  end: 35,
  home: 36,
  shift: 16,
};

const breakpoints = {
  sm_min: 375,
  md_min: 768,
  lg_min: 1024,
  xl_min: 1280,
};

const breakpoint_name = ['sm','md','lg','xl'];

//turns everything to tabindex=0
const focus_trap_selector = [
  `a[href]:not([disabled])`,
  `button:not([disabled])`,
  `textarea:not([disabled])`,
  `input[type="text"]:not([disabled])`,
  `input[type="radio"]:not([disabled])`,
  `input[type="checkbox"]:not([disabled])`,
  `select:not([disabled])`,
  `li[role="tab"]:not([disabled])`,
  `div[role="tabpanel"]:not([disabled])`,
  `label`,
]
//except these
const remove_focus_selector = [
  `.form\\:theme\\:gl0b3x input[type="radio"]+label`,
  `.form\\:theme\\:gl0b3x input[type="text"]+label`,
  `.form\\:theme\\:gl0b3x input[type="email"]+label`,
]

/**
 * chill_penguin Object
 * chill_penguin.module()
 * chill_penguin.throw_exception()
 * chill_penguin.cookie.get()
 * chill_penguin.cookie.set()
 * chill_penguin.cookie.unset()
 * chill_penguin.validation.is_number()
 * chill_penguin.validation.is_string()
 * chill_penguin.format.number()
 * chill_penguin.format.currency()
 * chill_penguin.format.percentage()
 * chill_penguin.reverse_format.get_numeric_value()
 * chill_penguin.button.is_checked()
 * chill_penguin.button.set_checked()
 * chill_penguin.checkbox.is_checked()
 * chill_penguin.checkbox.set_checked()
 * chill_penguin.checkbox.get_values()
 * chill_penguin.radiobutton.is_checked()
 * chill_penguin.radiobutton.set_checked()
 * chill_penguin.radiobutton.set_checked_from_value()
 * chill_penguin.radiobutton.get_value()
 * chill_penguin.client.viewport.get_width()
 * chill_penguin.client.viewport.get_breakpoint()
 * chill_penguin.client.viewport.get_height()
 * chill_penguin.client.viewport.is_sm_only()
 * chill_penguin.client.viewport.is_sm_up()
 * chill_penguin.client.viewport.is_md_down()
 * chill_penguin.client.viewport.is_md_only()
 * chill_penguin.client.viewport.is_md_up()
 * chill_penguin.client.viewport.is_lg_down()
 * chill_penguin.client.viewport.is_lg_only()
 * chill_penguin.client.viewport.is_lg_up()
 * chill_penguin.client.viewport.is_xl_up()
 * chill_penguin.client.get_user_agent()
 * chill_penguin.client.is_android()
 * chill_penguin.client.is_blackberry()
 * chill_penguin.client.is_ios()
 * chill_penguin.client.is_opera()
 * chill_penguin.client.is_windows()
 * chill_penguin.client.is_any()
 * chill_penguin.page.get_query_value()
 * chill_penguin.page.get_hash()
 * chill_penguin.page.set_hash()
 * chill_penguin.page.get_language_code()
 * chill_penguin.page.get_scrollbar_width
 * chill_penguin.util.escape_string()
 * chill_penguin.util.escape_quotes()
 * chill_penguin.util.unescape_quotes()
 * chill_penguin.util.minify_html()
 * chill_penguin.util.encode_html_entities()
 * chill_penguin.util.decode_html_entities()
 * chill_penguin.util.get_random_id()
 * chill_penguin.util.index_in_parent()
 * chill_penguin.util.closest_parent()
 * chill_penguin.util.run_str_func()
 * chill_penguin.util.fetch()
 * chill_penguin.util.load_css()
 * chill_penguin.util.load_javascript()
 * chill_penguin.open_window()
 * chill_penguin.scroll_to()
 * chill_penguin.debounce()
 * chill_penguin.resize_observer()
 * chill_penguin.breakpoint_observer()
 **/

var chill_penguin = (() => {
  return {
    /**
     * Add module and module name_space to the chill_penguin object
     *
     * @param string name_space
     * @param object module_object
     * @return mixed
     * @scope public
     */
    module: (name_space, module_object) => {
      const parts = name_space.split('.');
      const module_name = parts.pop(); // Remove and store the last part

      const parent = parts.reduce((acc, part) => {
        return acc[part] = acc[part] || {}; // Create nested namespaces
      }, chill_penguin);

      if (!parent[module_name]) {
        parent[module_name] = module_object(); // Assign the module
        const target_module = parent[module_name];

        if (typeof target_module.initialize === 'function') {
          target_module.initialize();
        }
        if (typeof target_module.ready === 'function') {
          chill_penguin.document_ready(() => target_module.ready());
        }
      } else {
        console.warn(`Cannot create module. The module: '${name_space}' already exists`);
      }
    },

    destroy_module: (name_space) => {
      chill_penguin[name_space] = undefined;
    },

    /**
     * Throws an exception
     *
     * @param string message
     * @return void
     * @scope public
     */
    throw_exception: (message) => {
      if (message !== undefined) {
        throw message;
        console.log(message);
      } else {
        throw true;
      }
      console.trace();
    },

    document_ready: (fn) => {
      /* see if DOM is already available */
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1); /* call on next available tick */
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    },

    cookie: {
      /**
       * Gets a cookie value
       *
       * @param string name
       * @return string
       * @scope public
       */
      get: (name) => {
        let start = document.cookie.indexOf(`${name}=`);
        if (start == -1) {
          return null;
        } else {
          start = start + name.length + 1;
          let end = document.cookie.indexOf(';', start);
          if (end == -1) {
            end = document.cookie.length;
          }
          return unescape(document.cookie.substring(start, end));
        }
      },

      /**
       * Sets a cookie value
       *
       * @param string name
       * @param string value
       * @param integer expires
       * @return void
       * @scope public
       */
      set: (name, value, expires) => {
        let milliseconds = expires === undefined ? 0 : parseInt(expires) * 1000 * 60 * 60 * 24;
        let greenwichMeanTime = new Date(new Date().getTime() + milliseconds).toGMTString();
        document.cookie = `${name}=${escape(value)}${expires > 0 ? `;expires=${greenwichMeanTime}` : ''}; path=/`;
      },
      /**
       * Unsets a cookie
       *
       * @param string name
       * @return void
       * @scope public
       */
      unset: (name) => {
        let value = chill_penguin.cookie.get(name);
        if (value !== null) {
          document.cookie = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        }
      },
    },

    validation: {
      /**
       * Checks if a value is of type Number
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_number: (value) => {
        switch (typeof value) {
          case 'number':
            return true;
            break;
          case 'object':
            return value instanceof Number;
            break;
          default:
            return false;
        }
      },

      /**
       * Checks if a value is of type String
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_string: (value) => {
        switch (typeof value) {
          case 'string':
            return true;
            break;
          case 'object':
            return value instanceof String;
            break;
          default:
            return false;
        }
      },


      /**
       * Checks if a value is an Array and is empty
       *
       * @param mixed value
       * @return boolean
       * @scope public
       */
      is_array: (value) => {
        return Array.isArray(value) && value.length > 0;
      },
    },

    format: {
      /**
       * Formats a number
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      number: (number, factor) => {
        let decimal_symbol;
        let thousands_symbol;
        let sign;
        let i;
        let j;
        let n;

        if (chill_penguin.validation.is_number(number)) {
          number = number.toString();
        }
        factor = isNaN((factor = Math.abs(factor))) ? 0 : factor;
        switch (LANG) {
          case 'fr':
            decimal_symbol = ',';
            thousands_symbol = ' ';
            break;
          default:
            decimal_symbol = '.';
            thousands_symbol = ',';
            break;
        }
        (number = Number(number.replace(RegExp('[^0-9\\.]', 'g'), ''))),
          (sign = number < 0 ? '-' : ''),
          (i = parseInt((number = Math.abs(+number || 0).toFixed(factor))) + ''),
          (j = (j = i.length) > 3 ? j % 3 : 0),
          (n =
            sign +
            (j ? i.substr(0, j) + thousands_symbol : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_symbol) +
            (factor
              ? decimal_symbol +
                Math.abs(number - i)
                  .toFixed(factor)
                  .slice(2)
              : ''));
        return n;
      },

      /**
       * Formats a number to currency
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      currency: (number, factor) => {
        factor = isNaN((factor = Math.abs(factor))) ? 2 : factor;
        number = chill_penguin.format.number(number, factor);
        switch (LANG) {
          case 'fr':
            return `${number} $`;
          default:
            return `$${number}`;
        }
      },

      /**
       * Formats a number to percentage
       *
       * @param mixed number
       * @param integer factor
       * @return string
       * @scope public
       */
      percentage: (number, factor) => {
        factor = isNaN((factor = Math.abs(factor))) ? 3 : factor;
        number = chill_penguin.format.number(number, factor);
        switch (LANG) {
          case 'fr':
            return `${number} %`;
          default:
            return `${number}%`;
        }
      },
    },

    reverse_format: {
      /**
       * Gets a formatted number as a number
       *
       * @param mixed number
       * @return float
       * @scope public
       */
      get_numeric_value: (number) => {
        switch (LANG) {
          case 'fr':
            number = number.replace(',', '.');
            break;
        }
        number = Number(
          number
            .replace(/[^0-9.]/gi, '')
            .replace('.', ' ')
            .replace(/\./g, '')
            .replace(' ', '.'),
        );
        if (isNaN(number)) {
          number = 0;
        }
        return number;
      },
    },

    button: {
      is_checked: (element) => {
        return element.getAttribute('aria-checked') === 'true';
      },

      set_checked: (element, value) => {
        element.setAttribute('aria-checked',value.toString());
      },

      get_values: (selector, attribute = null) => {
        let button_values = [];
        let elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (chill_penguin.button.is_checked(el)) {
            button_values.push(attribute ? el.getAttribute(attribute) : el.value);
          }
        });
        return button_values;
      },
    },

    checkbox: {
      is_checked: (element) => {
        if (typeof element.checked === 'boolean') {
          return element.checked;
        }
        // If ARIA checkbox widget
        return element.getAttribute('aria-checked') === 'true';
      },

      set_checked: (element, value) => {
        if (typeof element.checked === 'boolean') {
          switch (value.toString()) {
            case 'true':
              element.checked = true;
              break;
            case 'false':
              element.checked = false;
              break;
            default:
              break;
          }
        }
      },

      /* this is specifically helpful for 'parent' checkboxes where the aria-checked could be 'mixed' */
      set_aria_checked: (element, value) => {
        element.setAttribute('aria-checked', value);
      },

      // Gets the values of the checkboxes as an array
      get_values: (selector, attribute = null) => {
        let checkbox_values = [];
        let elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (chill_penguin.checkbox.is_checked(el)) {
            checkbox_values.push(attribute ? el.getAttribute(attribute) : el.value);
          }
        });
        return checkbox_values;
      },
    },

    radiobutton: {
      is_checked: (element) => {
        if (typeof element.checked === 'boolean') {
          return element.checked;
        }
      },

      //sets a selector or element as checked based on a true or false value
      set_checked: (selector_or_element, value) => {
        if (typeof selector_or_element === 'string') {
          document.querySelector(selector_or_element).checked = value;
        } else {
          selector_or_element.checked = value;
        }
      },

      //sets a selector or element as checked based the value passed (if it matches, checked is set to true)
      set_checked_from_value: (selector, value) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (el.value === value) {
            el.checked = true;
            return;
          }
        });
      },

      // Gets the value of a radio button or any attribute
      get_value: (selector, attribute = null) => {
        const element = document.querySelector(`${selector}:checked`);
        if (element) {
          return attribute ? element.getAttribute(attribute) : element.value;
        }
        return null;
      },
    },

    client: {
      viewport: {
        /**
         * Gets the viewport width
         *
         * @return float
         * @scope public
         */
        get_width: () => {
          return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        },

        /**
         * Gets the breakpoint
         *
         * @return string
         * @scope public
         */
        get_breakpoint: () => {
          const viewport_width = chill_penguin.client.viewport.get_width();

          if (viewport_width >= breakpoints['xl_min']) return 'xl';
          else if (viewport_width >= breakpoints['lg_min']) return 'lg';
          else if (viewport_width >= breakpoints['md_min']) return 'md';
          else if (viewport_width >= breakpoints['sm_min']) return 'sm';
          else {
            chill_penguin.throw_exception('smaller than sm');
            return;
          }
        },

        /**
         * Gets the viewport height
         *
         * @return float
         * @scope public
         */
        get_height: () => {
          return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        },

        /**
         * Checks if the viewport is a retina display
         *
         * @return boolean
         * @scope public
         */
        is_retina: () => {
          if (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio:1.5),(-moz-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5)').matches)) {
            return true;
          } else {
            return false;
          }
        },

        /**
         * Checks if the viewport is within "is_sm_only" threshhold
         * Checks if the viewport is within "is_sm_up" threshhold
         * Checks if the viewport is within "is_md_down" threshhold
         * Checks if the viewport is within "is_md_only" threshhold
         * Checks if the viewport is within "is_md_up" threshhold
         * Checks if the viewport is within "is_lg_down" threshhold
         * Checks if the viewport is within "is_lg_only" threshhold
         * Checks if the viewport is within "is_lg_up" threshhold
         * Checks if the viewport is within "is_xl_up" threshhold
         *
         * @return boolean
         * @scope public
         */
        is_sm_only: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['sm_min'] && el < breakpoints['md_min'];
        },
        is_sm_up: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['sm_min'];
        },
        is_md_down: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['sm_min'] && el < breakpoints['lg_min'];
        },
        is_md_only: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['md_min'] && el < breakpoints['lg_min'];
        },
        is_md_up: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['md_min'];
        },
        is_lg_down: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['sm_min'] && el < breakpoints['xl_min'];
        },
        is_lg_only: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['lg_min'] && el < breakpoints['xl_min'];
        },
        is_lg_up: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['lg_min'];
        },
        is_xl_up: (el = chill_penguin.client.viewport.get_width()) => {
          return el >= breakpoints['xl_min'];
        },
      },

      /**
       * get the navigator.userAgent
       * @return string
       * @scope public
       */
      get_user_agent: () => {
        return navigator.userAgent;
      },

      /**
       * Check if device type is Mobile
       * Verify mobile OS
       * @return boolean
       * @scope public
       **/
      is_android: () => {
        return chill_penguin.client.get_user_agent().match(/Android/i);
      },
      is_blackberry: () => {
        return chill_penguin.client.get_user_agent().match(/BlackBerry|BB10/i);
      },
      is_ios: () => {
        return chill_penguin.client.get_user_agent().match(/iPhone|iPad|iPod/i);
      },
      is_opera: () => {
        return chill_penguin.client.get_user_agent().match(/Opera Mini/i);
      },
      is_windows: () => {
        return chill_penguin.client.get_user_agent().match(/IEMobile/i);
      },
      is_any: () => {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            chill_penguin.client.get_user_agent().substr(0, 4),
          )
          ? true
          : false;
      },
    },

    page: {
      /**
       * Gets a query parameter value from the query string
       *
       * @param string key
       * @return string
       * @scope public
       */
      get_query_value: (key) => {
        key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + key + '=([^&#]*)'),
          results = regex.exec(location.search);
        if (results !== null) {
          return decodeURIComponent(results[1].replace(/\+/g, ' '));
        } else {
          return null;
        }
      },

      /**
       * Gets the hash value of the URL (without the "#" character)
       *
       * @return string
       * @scope public
       */
      get_hash: () => {
        if (window.location.hash) {
          return window.location.hash.substr(1);
        } else {
          return '';
        }
      },

      /**
       * sets the hash value of the URL
       *
       * @param string hash
       * @return void
       * @scope public
       */
      set_hash: (hash) => {
        if (hash.length > 1) {
          window.location.replace(`${(window.location + '').split('#')[0]}#${hash}`);
        }
      },

      get_language_code: () => {
        return document.getElementsByTagName('html')[0].getAttribute('lang');
      },

      get_scrollbar_width: () => {
        const container = document.createElement('div');
        container.style.cssText = 'visibility: hidden; overflow: scroll; position: absolute; width: 100px;';
        document.body.appendChild(container);
        const inner = document.createElement('div');
        container.appendChild(inner);
        const scrollbarWidth = container.offsetWidth - inner.offsetWidth;
        document.body.removeChild(container);
        return scrollbarWidth;
      },

    },

    util: {
      escape_string: (original_str) => {
        const char_to_escape_map = {
          '%': '\\%',
          '/': '\\/',
          ':': '\\:',
          '+': '\\+',
          '=': '\\=',
          '(': '\\(',
          ')': '\\)',
        };

        let new_str = original_str;
        for (const char_to_escape in char_to_escape_map) {
          new_str = new_str.replaceAll(char_to_escape, char_to_escape_map[char_to_escape]);
        }

        return new_str;
      },

      escape_double_quotes: (original_str) => {
        return original_str.replaceAll('"', '\\"');
      },

      unescape_double_quotes: (escaped_str) => {
        return escaped_str.replaceAll('\\"', '"');
      },

      minify_html: (html_string) => {
        return html_string.replace(/[\n\r\t]/g, '').replace(/ {2,}/g, ' ').replace(/> </g, '><');
      },

      encode_html_entities: (html_string) => {
        const entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          'À': '&Agrave;',
          'à': '&agrave;',
          'Â': '&Acirc;',
          'â': '&acirc;',
          'Ä': '&Auml;',
          'ä': '&auml;',
          'É': '&Eacute;',
          'é': '&eacute;',
          'È': '&Egrave;',
          'è': '&egrave;',
          'Ê': '&Ecirc;',
          'ê': '&ecirc;',
          'Ë': '&Euml;',
          'ë': '&euml;',
          'Î': '&Icirc;',
          'î': '&icirc;',
          'Ï': '&Iuml;',
          'ï': '&iuml;',
          'Ô': '&Ocirc;',
          'ô': '&ocirc;',
          'Ù': '&Ugrave;',
          'ù': '&ugrave;',
          'Û': '&Ucirc;',
          'û': '&ucirc;',
          'Ü': '&Uuml;',
          'ü': '&uuml;',
          '«': '&laquo;',
          '»': '&raquo;',
          'Ç': '&Ccedil;',
          'ç': '&ccedil;',
          'Œ': '&OElig;',
          'œ': '&oelig;',
          '©': '&copy;',
          '®': '&reg;',
          '™': '&trade;',
          '†': '&dagger;',
          '‡': '&Dagger;',
          '§': '&sect;',
          'Δ': '&Delta;'
          // Add more mappings as needed
        };
        return html_string.replace(/[&<>"']/g, char => entityMap[char] || `&#${char.charCodeAt(0)};`);
      },

      decode_html_entities: (html_string) => {
        return (new DOMParser().parseFromString(html_string, 'text/html').body.textContent || '').trim();
      },

      get_random_id: () => {
        return '_' + Math.random().toString(36).substr(2, 9);
      },

      event_disable: (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      },

      index_in_parent: (node) => {
        let children = node.parentNode.childNodes;
        let num = 0;
        for (let i = 0; i < children.length; i++) {
          if (children[i] == node) return num;
          if (children[i].nodeType == 1) num++;
        }
        return -1;
      },

      closest_parent: (element, selector) => {
        let current_element = element.parentElement;
        while (current_element) {
          if (current_element.matches(selector)) {
            return current_element;
          }
          current_element = current_element.parentElement;
        }
        return null; // If no matching parent is found
      },

      /**
       * Execute a function specified by its string representation with provided parameters.
       *
       * @param {string} func_str - The string representation of the function to execute (e.g., "someNamespace.someFunction").
       * @param {object} params_obj - An object containing parameters to pass to the function.
       */
      run_str_func: async (func_str, params_obj = {}) => {
        // console.log("run_str_func:", func_str);

        // Check if func_str contains a comma and split it if so.
        if (func_str.includes(',')) {
          // Split the string by commas and trim any whitespace.
          const parts = func_str.split(',').map(part => part.trim());
          // Recursively call run_str_func for each part.
          const results = await Promise.all(parts.map(part => this.run_str_func(part, params_obj)));
          // Return an array of results from the recursive calls.
          return results;
        }

        const func_parts = func_str.split('.');
        const func_temp = func_parts.reduce((obj, path) => obj?.[path], window);
        // // Split the function string into its parts (namespace and function name).


        // // Initialize a temporary variable to navigate through the object hierarchy.
        // let func_temp = window;

        // // Traverse the object hierarchy to find the target function.
        // for (const path of func_parts) {
        //   func_temp = func_temp[path];

        //   // If the current part is not an object, break the loop.
        //   if (typeof func_temp !== 'object') {
        //     break;
        //   }
        // }

        // Check if the function was found. If not, throw an error and exit function
        if (typeof func_temp !== 'function') {
          console.error(`Function not found: ${func_temp}`);
          return;
        }

        // If the function is nested within an object, extract the object path and method name.
        if (func_parts.length > 1) {
          const [obj_path, method_name] = func_parts.slice(0, -1).join('.').split('.');
          const obj = window[obj_path];

          // Check if the object exists and contains the specified method.
          if (obj && typeof obj[method_name] === 'function') {
            func_temp = obj[method_name];
          }
        }

        // Extract parameter values from the provided object and execute the function.
        const param_values = Object.values(params_obj);
        // func_temp(...param_values);

        if (typeof func_temp === 'function') {
          if (func_temp.constructor.name === 'AsyncFunction') {
            //console.log('is async function? yes');
            //synchronous function won't wait for async function to finish, so event.preventDefault(); will prevent default return true
            event?.preventDefault();
            return new Promise(async (resolve, reject) => {
              try {
                let result = await func_temp(...param_values);
                resolve(result);
              } catch (error) {
                console.error('func_temp await failed', error);
                reject(error);
              }
            });
          } else {
            //console.log('is async function? no');
            return func_temp(...param_values);
          }
        } else {
          console.error('last func_temp is not a function');
          return false;
        }
      },
      fetch: (url) => {
        if (!url) {
          console.error('Fetch called without a URL');
          return Promise.reject('No URL provided');
        }
        return fetch(url)
          .then(response => {
            // Check if the response was successful
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .catch(err => {
            // Handle errors more specifically
            console.error('Fetch error:', err);
            // Depending on your application's needs, you might want to handle this differently,
            // e.g., re-throw the error, return a default value, or return a specific error object.
            return Promise.reject(err);
          });
      },
      load_javascript: (path) => {
        return new Promise((resolve, reject) => {
          const script_element = document.createElement('script');
          script_element.src = path;
          script_element.defer = true;
          script_element.onload = resolve;
          script_element.onerror = reject;
          document.head.appendChild(script_element);
        });
      },
      load_css: (path) => {
        return new Promise((resolve, reject) => {
          const link_element = document.createElement('link');
          link_element.rel = 'stylesheet';
          link_element.href = path;
          link_element.onload = resolve;
          link_element.onerror = reject;
          document.head.appendChild(link_element);
        });
      },
    },

    /**
     * Opens a new browser window with the specified URL and dimensions.
     *
     * @param {string} url - The URL to open in the new window.
     * @param {string} [name='_blank'] - The name of the new window (optional).
     * @param {number} [width=800] - The width of the new window in pixels (optional).
     * @param {number} [height=600] - The height of the new window in pixels (optional).
     * @returns {void}
     */
    open_window: (url, name, width, height) => {
      // If 'name' is undefined, use the default name '_blank'.
      name = name === undefined ? '_blank' : name;

      // If 'width' is undefined, use the default width of 800 pixels.
      // Parse 'width' as a number and convert it to a string.
      width = width === undefined ? '800' : String(parseInt(width));

      // If 'height' is undefined, use the default height of 600 pixels.
      // Parse 'height' as a number and convert it to a string.
      height = height === undefined ? '600' : String(parseInt(height));

      // Open a new window with the specified URL, name, and dimensions.
      window.open(url, name, 'scrollbars=1,resizable=1,width=' + width + ',height=' + height);
    },

    /**
     * Scrolls the browser to an element
     *
     * @param string selector
     * @param integer index
     * @return void
     * @scope public
     */
    scroll_to: (selector) => {
      window.scrollTo({
        behavior: 'auto',
        left: 0,
        top: document.querySelector(selector).offsetTop,
      });
    },

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param  { function } func      callback function
     * @param  { number } wait        time in ms
     * @param  { boolean } immediate  flag to trigger function on the leading edge or trailing
     * @return { function }           debounce function
     */
    debounce: (func, wait, immediate) => {
      let timeout;
      return function () {
        let context = this,
          args = arguments;
        let later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    /**
     * Observes an element and runs a function when the element is resized
     * Replaces window.addEventListener("resize", event = { function(); }) as it performs better
     *
     * @param  { array } elements     elements we want to observe
     * @param  { function } func      callback function
     */
    resize_observer: (elements, func, params_obj) => {
      let param_values = (params_obj) ? Object.values(params_obj) : [];
      const has_resize_observer = (element) => {
        return element.__resize_observer__ instanceof ResizeObserver;
      };

      const resize_observer = new ResizeObserver((el) => {
        func(...param_values);
      });

      // Utility function to observe an element if not already observed
      const observe_element = (el) => {
        // const resize_observers = []; //place in global scope to track resize observers
        // resize_observers.push(el);
        !has_resize_observer(el) && resize_observer.observe(el);
      };

      // Use the utility function for iteration
      if (elements instanceof HTMLElement) {
        observe_element(elements);
      } else if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach(observe_element);
      }
    },

    /**
     * Observes an element and runs a function when the element is resized
     * Replaces window.addEventListener("resize", event = { function(); }) as it performs better
     *
     * @param  { array } elements     elements we want to observe
     * @param  { function } func      callback function
     */
    breakpoint_observer: (elements, func, params_obj) => {
      const get_breakpoint = () => {
        const viewport_width = window.innerWidth;

        if (viewport_width < breakpoints.md_min) {
          return 'sm';
        } else if (viewport_width < breakpoints.lg_min) {
          return 'md';
        } else if (viewport_width < breakpoints.xl_min) {
          return 'lg';
        } else {
          return 'xl';
        }
      };

      let current_breakpoint = get_breakpoint();
      let param_values = (params_obj) ? Object.values(params_obj) : [];
      const has_resize_observer = (element) => {
        return element.__resize_observer__ instanceof ResizeObserver;
      };

      const resize_observer_instance = new ResizeObserver(() => {
        const new_breakpoint = get_breakpoint();
        console.log(new_breakpoint);
        if (new_breakpoint !== current_breakpoint) {
          current_breakpoint = new_breakpoint;
          func(...param_values, current_breakpoint);
        }
      });

      const observe_element = (el) => {
        !has_resize_observer(el) && resize_observer_instance.observe(el);
      };

      if (elements instanceof HTMLElement) {
        observe_element(elements);
      } else if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach(observe_element);
      }
    },
  };
})();

const LANG = chill_penguin.page.get_language_code();

chill_penguin.module('image_default_dimensions', () => {
  return {
    initialize: () => {
      const set_image_attribute = (image) => {
        if (image.offsetParent !== null) { // if the item isn't in a hidden
          (!image.hasAttribute("height")) && image.setAttribute("height", image.offsetHeight);
          (!image.hasAttribute("width")) && image.setAttribute("width", image.offsetWidth);
          (image.getAttribute("loading") !== "eager") && image.setAttribute("loading","lazy");
        }
      }
      document.querySelectorAll(`img`).forEach((image) => {
        if (image.complete) {
          set_image_attribute(image);
        } else {
          image.onload = () => {
            set_image_attribute(image);
          };
        }
      })
    },
  };
});

chill_penguin.module('autopopulate_empty_ids', () => {
  let self;

  return {
    initialize: () => {
      self = chill_penguin['autopopulate_empty_ids'];
      self.fill_empty_ids();
    },
    fill_empty_ids: () => {
      document.querySelectorAll('*[id]').forEach((el) => {
        if (el.id === '') {
          el.id = chill_penguin.util.get_random_id();
        }
      });
    },
  };
});

/**
 * Allows console.log() to work in non-production environments and
 * Disable console.log() on production environments (unless a querystring on the page exists)
 */
chill_penguin.module('console_log', () => {
  return {
    initialize: () => {
      if (window.location.hostname.indexOf('localhost') > -1) {
        console.log('console.log() enabled');
      } else {
        if (chill_penguin.page.get_query_value('consolelog') === 'true') {
          console.log('console.log() enabled');
        } else {
          console.log('console.log() disabled');
          console.log = () => {};
        }
      }
    },
  };
});

/**
 * Allows the height of various block level HTML elements to be the same by taking the largest height and applying it to all items.
 * This will occur for any item regardless of viewport. To affect medium size and up, see Options.
 *
 * How to use this:
 * Add the attribute 'data-equalize-height="(key)"' to any block level HTML element where key is a value you use to link the items you want to height equalize. All the items with the same 'key' will have the same height.
 *
 * Options:
 * If you only want height equalizing to occur on medium size up, add 'data-equalize-md-up' to the HTML element as well
 * If you only want height equalizing to occur on small size only, add 'data-equalize-sm-only' to the HTML element as well
 */
chill_penguin.module('equalize_heights', () => {
  let self;
  let _data_equal_height_array = [];

  /*
   * Sorts items in array from smallest to largest
   */
  let sort_number = (a, b) => {
    return a - b;
  };

  /*
   * For each "key", determine the largest height and apply to all items with that key
   */
  let max_height = () => {
    _data_equal_height_array.forEach((key, value) => {
      let _highest = 0;
      let _heights = [];
      document.querySelectorAll(`[data-equalize-height=${key}]`).forEach((el) => {
        el.style.height = 'auto';
      });
      document.querySelectorAll(`[data-equalize-height=${key}]`).forEach((el) => {
        _heights.push(el.getBoundingClientRect().height);
      });
      _heights = _heights.sort(sort_number).reverse();
      _highest = _heights[0];
      document.querySelectorAll(`[data-equalize-height=${key}]`).forEach((el) => {
        el.style.height = `${_highest}px`;
      });
    });
  };

  return {
    initialize: () => {
      self = chill_penguin['equalize_heights'];
      self.get_data_equal_height_items();
      self.resize_listener();
    },
    ready: () => {
      self.force_resize();
    },
    /*
     * Checks all the items that need to equalize height, and add keys to array
     */
    get_data_equal_height_items: () => {
      document.querySelectorAll('[data-equalize-height]:not([data-equalize-height=""])').forEach((el) => {
        let new_item = el.getAttribute("data-equalize-height");
        if (_data_equal_height_array.indexOf(new_item) < 0) {
          _data_equal_height_array.push(new_item);
        }
      });
    },
    /*
     * Re-evaluate the equalizing of the height when the page loads or is resized
     */
    resize_listener: () => {
      const force_resize = () => {
        return self.force_resize();
      }
      chill_penguin.resize_observer(document.querySelector('body'), force_resize);
    },
    /*
     * Check for any new items to equalize, and then equalize them
     * Do not equalize height for small size if the item contains [data-equalize-md-up] data attribute
     */
    force_resize: () => {
      self.get_data_equal_height_items();
      max_height();
      if (chill_penguin.client.viewport.is_sm_only()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-md-up]').forEach((el) => {
          el.style.height = 'auto';
        });
      }
      if (chill_penguin.client.viewport.is_md_up()) {
        document.querySelectorAll('[data-equalize-height][data-equalize-sm-only]').forEach((el) => {
          el.style.height = 'auto';
        });
      }
    },
  };
});

chill_penguin.module('responsive_dom_manipulator', () => {
  let self;
  let array_of_keys = [];

  return {
    initialize: () => {
      self = chill_penguin['responsive_dom_manipulator'];
      self.resize_listener();
    },
    ready: () => {
      self.force_resize();
    },
    /*
     * Re-evaluate moving the dom when the page loads or is resized
     */
    resize_listener: () => {
      const force_resize = () => {
        return self.force_resize();
      }
      chill_penguin.resize_observer(document.querySelector('body'), force_resize);
    },
    /*
     * Check for any new items to equalize, and then equalize them
     * Do not equalize height for small size if the item contains [data-equalize-md-up] data attribute
     */
    force_resize: () => {
      array_of_keys = [];
      document.querySelectorAll('[data-move]').forEach((el) => {
        array_of_keys.push(el.getAttribute('data-move'));
      });
      //console.log(array_of_keys);
      if (chill_penguin.client.viewport.is_sm_only()) {
        document.querySelectorAll('[data-move-container-sm]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.getAttribute('data-move-container')}]`));
        });
      }
      if (chill_penguin.client.viewport.is_md_only()) {
        document.querySelectorAll('[data-move-container-md]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.getAttribute('data-move-container')}]`));
        });
      }
      if (chill_penguin.client.viewport.is_lg_only()) {
        document.querySelectorAll('[data-move-container-lg]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.getAttribute('data-move-container')}]`));
        });
      }
      if (chill_penguin.client.viewport.is_xl_up()) {
        document.querySelectorAll('[data-move-container-xl]').forEach((el) => {
          el.appendChild(document.querySelector(`[data-move=${el.getAttribute('data-move-container')}]`));
        });
      }
    },
  };
});

chill_penguin.module('zs_highlighter', () => {
  return {
    initialize: () => {
      if (chill_penguin.page.get_query_value('zs-highlight-mid')) {
        chill_penguin.page.get_query_value('zs-highlight-mid').split(",").forEach((mid_id) => {
          document.querySelectorAll(`[data-zs*='mid\\:${mid_id},']`).forEach((element) => {
            element.classList.add("zs-hightlight-yellow");
          })
        });
      }
      if (chill_penguin.page.get_query_value('zs-highlight-cid')) {
        chill_penguin.page.get_query_value('zs-highlight-cid').split(",").forEach((cid_id) => {
          document.querySelectorAll(`[data-zs*='cid\\:${cid_id},']`).forEach((element) => {
            element.classList.add("zs-hightlight-red");
          })
        });
      }
      if (chill_penguin.page.get_query_value('zs-highlight-branch')) {
        document.querySelectorAll(`[data-zs-branch=${chill_penguin.page.get_query_value('zs-highlight-branch')}]`).forEach((element) => {
          element.classList.add("zs-hightlight-blue");
        })
      }
    },
  };
});
