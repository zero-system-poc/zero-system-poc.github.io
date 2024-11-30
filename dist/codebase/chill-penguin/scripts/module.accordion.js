'use strict';
/*
  accordion.initialize();
  accordion.setup
  accordion.ui.initialize
  accordion.ui.animate_panel_open
  accordion.ui.animate_panel_close
  accordion.event_listeners.initialize
  accordion.event_listeners.header.click.update_accordion_item
  accordion.event_listeners.header.focus.focus_class.add
  accordion.event_listeners.header.focus.focus_class.remove
  accordion.action.toggle_accordion_item
  accordion.action.open
*/
chill_penguin.module('accordion', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = chill_penguin.accordion;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="accordion"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          all_headers: el.querySelectorAll(':scope > div > * > [data-module="accordion.header"],:scope > [data-module="accordion.header"]'),
          all_panels: el.querySelectorAll(':scope > div > [data-module="accordion.panel"],:scope > [data-module="accordion.panel"]'),
          active_setting: el.getAttribute('data-accordion-active'),
          initial_active: JSON.parse(el.getAttribute('data-accordion-initial')),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { el, all_headers, all_panels, initial_active } = state[id];
        all_headers.forEach((header, index) => {
          const panel = header.parentNode.nextElementSibling;
          header.setAttribute('aria-expanded', 'false');
          header.setAttribute('aria-controls', panel.getAttribute('id'));
          panel.setAttribute('aria-labelledby', header.getAttribute('id'));
          if (index === 0) {
            header.removeEventListener('focusin', self.event_listeners.header.focus.focus_class.add);
            header.addEventListener('focusin', self.event_listeners.header.focus.focus_class.add);
            header.removeEventListener('focusout', self.event_listeners.header.focus.focus_class.remove);
            header.addEventListener('focusout', self.event_listeners.header.focus.focus_class.remove);
          }
          if(initial_active[index]) {
            header.setAttribute('aria-expanded', 'true');
          }
        });
        all_panels.forEach((panel, index) => {
          panel.style.height = '0px'; // Start all panels closed
          panel.setAttribute("data-accordion-panel","hide");

          if(initial_active[index]) {
            self.ui.animate_panel_open(panel,true); // Pass `true` if immediate animation is not required
          }
        });
      },
      animate_panel_open: (panel,on_initialize) => {
        panel.style.height = 'auto';
        //refactor when calc-size(auto) is supported
        if (!on_initialize) {
          let panel_height = panel.scrollHeight + 'px';
          panel.style.height = '0px';
          requestAnimationFrame(() => {
            panel.style.height = panel_height;
            setTimeout(() => {
              panel.style.height = 'auto';
            },250);
          });
        }
        panel.setAttribute("data-accordion-panel", "");
      },
      animate_panel_close: (panel) => {
        //refactor when calc-size(auto) is supported
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.height = '0px';
        });
        panel.setAttribute("data-accordion-panel", "hide");
      },
    },
    event_listeners: {
      initialize: (id) => {
        const { all_headers } = state[id];
        all_headers.forEach((header) => {
          header.removeEventListener('click', self.event_listeners.header.click.update_accordion_item);
          header.addEventListener('click', self.event_listeners.header.click.update_accordion_item);
        });
      },
      header: {
        click: {
          update_accordion_item: (event) => {
            const header = event.currentTarget;
            const id = chill_penguin.util.closest_parent(header,`[data-module='accordion']`).getAttribute("id");
            self.action.toggle_accordion_item(id, header);
          }
        },
        focus: {
          focus_class: {
            add: (event) => {
              event.currentTarget.classList.add('focus');
            },
            remove: (event) => {
              event.currentTarget.classList.remove('focus');
            },
          }
        }
      },
    },
    action: {
      toggle_accordion_item: (id, header) => {
        const { all_headers, all_panels, active_setting } = state[id];
        const is_expanded = header.getAttribute('aria-expanded') === 'true';
        const panelId = header.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        // Adjusting all panels and headers if 'single' mode is active
        if (active_setting === 'single') {
          all_headers.forEach(h => h.setAttribute('aria-expanded', 'false'));
          all_panels.forEach(p => self.ui.animate_panel_close(p));
        }

        // Setting the current panel state
        header.setAttribute('aria-expanded', !is_expanded);
        if (!is_expanded) {
          self.ui.animate_panel_open(panel);
        } else {
          self.ui.animate_panel_close(panel);
        }

        chill_penguin.equalize_heights.force_resize(); // Assuming this is a function you wish to call for layout purposes
      },
      open: (id, panel_id) => {
        if (state[id]) {
          const { active_setting, all_panels } = state[id];
          if (active_setting === 'single') {
            all_panels.forEach((panel) => {
              panel.setAttribute("data-accordion-panel","hide");
            });
            document.getElementById(panel_id).setAttribute("data-accordion-panel","");
            chill_penguin.equalize_heights.force_resize();
          } else if (active_setting === 'multiple') {
            const panel = document.getElementById(panel_id);
            panel.setAttribute("data-accordion-panel", panel.getAttribute("data-accordion-panel") === "hide" ? "" : "hide");
            chill_penguin.equalize_heights.force_resize();
          }
        } else {
          console.error(`Accordion (id="${id}") does not exist`);
        }
      },
    }
  };
});
