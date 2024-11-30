'use strict';
chill_penguin.module('autoloader', () => {
  const chill_penguin_module = {
    accordion: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.accordion.js',
      module_name: 'accordion',
    },
    carousel: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.carousel.js',
      module_name: 'carousel',
    },
    dialog: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.dialog.js',
      module_name: 'dialog',
    },
    form_autocomplete: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.autocomplete.js',
      module_name: 'form_autocomplete',
    },
    form_parent_checkbox: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.parent-checkbox.js',
      module_name: 'form_parent_checkbox',
    },
    form_select_all: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.select-all.js',
      module_name: 'form_select_all',
    },
    form_switch_button: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.switch.button.js',
      module_name: 'form_switch_button',
    },
    form_theme_gl0b3x: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.theme.gl0b3x.js',
      module_name: 'form_theme_gl0b3x',
    },
    form_validation: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.form.validation.js',
      module_name: 'form_validation',
    },
    header: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.header.js',
      module_name: 'header',
    },
    isotope: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.isotope.js',
      module_name: 'isotope',
    },
    menu_submenu: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.menu-submenu.js',
      module_name: 'menu_submenu',
    },
    popover: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.popover.js',
      module_name: 'popover',
    },
    range_slider: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.range-slider.js',
      module_name: 'range_slider',
    },
    show_more: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.show-more.js',
      module_name: 'show_more',
    },
    slider: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.slider.js',
      module_name: 'slider',
    },
    tabs: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.tabs.js',
      module_name: 'tabs',
    },
    waypoint: {
      script_src: '/dist/codebase/chill-penguin/scripts/module.waypoint.js',
      module_name: 'waypoint',
    },
  };

  return {
    initialize: async () => {
      const modules = {
        accordion: '[data-module="accordion"]',
        carousel: "[data-module='carousel']",
        dialog: "[data-module='dialog']",
        form_autocomplete: "[data-module='autocomplete']",
        form_parent_checkbox: '[data-module="parent-checkbox"]',
        form_select_all: '[data-module="select-all"]',
        form_switch_button: '[data-module="switch.button"]',
        form_theme_gl0b3x: '.form\\:theme\\:gl0b3x',
        form_validation: `[data-module='form']`,
        header: "[data-module='header']",
        isotope: "[data-module='isotope']",
        menu_submenu: '[data-module="menu"]',
        popover: "[data-module='popover']",
        range_slider: "[data-module='range-slider.input-container']",
        show_more: "[data-module='show-more']",
        slider: "[data-module='slider.input-container']",
        tabs: "[data-module='tabs']",
        waypoint: "[data-module='waypoint']"
      };

      for (const [script, query] of Object.entries(modules)) {
        if (document.querySelectorAll(query).length > 0) {
          try {
            await chill_penguin.util.load_javascript(chill_penguin_module[script]['script_src']);
          } catch (error) {
            console.error(`autoloader -> ${error}`);
          }
        }
      }

    },
  };
});
