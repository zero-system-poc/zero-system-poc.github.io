"use strict";

chill_penguin.module("header", () => {
  let self;
  let isMobileOpen = false;
  let isSignInOpen = false;

  return {
    initialize: () => {
      self = chill_penguin["header"];
    },
    ready: () => {
      self.addEventListeners();
    },
    getIsMobileOpen: () => {
      return isMobileOpen;
    },
    setIsMobileOpen: (value) => {

      isMobileOpen = value;
      (isSignInOpen) && self.setIsSignInOpen(false);
      document.querySelector("[data-header-id=header-mobile-menu-button]").setAttribute('aria-expanded', isMobileOpen);
      if (isMobileOpen) {
        document.querySelector(".mobile-menu-container-wrapper").classList.add("active");
        document.querySelector(".mobile-menu-container-wrapper").style.top = `${document.querySelector(".main-row-container").offsetTop + document.querySelector(".main-row-container").offsetHeight}px`;
        document.querySelector(".mobile-menu-container-wrapper").style.height = `calc(100vh - ${document.querySelector(".main-row-container").offsetTop + document.querySelector(".main-row-container").offsetHeight}px`;
        document.querySelector("body").classList.add("overflow:hidden","h:100vh");
        document.querySelector("html").classList.add("overflow-y:scroll");
        document.querySelector(".mobile-menu-container").classList.add("active");
        document.querySelector(".hamburger-lines-container").classList.add("active")
        document.querySelector(".hamburger-line-1").classList.add("active")
        document.querySelector(".hamburger-line-2").classList.add("active")
        document.querySelector(".hamburger-line-3").classList.add("active")
      } else {
        document.querySelector(".mobile-menu-container-wrapper").classList.remove("active");
        document.querySelector(".mobile-menu-container").classList.remove("active");
        document.querySelector(".hamburger-lines-container").classList.remove("active")
        document.querySelector(".hamburger-line-1").classList.remove("active")
        document.querySelector(".hamburger-line-2").classList.remove("active")
        document.querySelector(".hamburger-line-3").classList.remove("active")
        document.querySelector("body").classList.remove("overflow:hidden","h:100vh");
        document.querySelector("html").classList.remove("overflow-y:scroll");
      }
    },
    getIsSignInOpen: () => {
      return isSignInOpen;
    },
    setIsSignInOpen: (value) => {

      isSignInOpen = value;
      (isMobileOpen) && self.setIsMobileOpen(false);
      document.querySelector("[data-header-id=header-log-in-button]").setAttribute('aria-expanded', isSignInOpen);
      if (isSignInOpen) {
        document.querySelectorAll(".log-in-container").forEach((el) => {
          el.classList.add("active");
        });
        document.querySelector("[data-header-id=header-log-in-button]").classList.add("active");
        document.querySelector("[data-header-id=log-in-menu-container-wrapper]").classList.add("active");
        document.querySelector("[data-header-id=log-in-menu-container-wrapper]").style.top = `${document.querySelector(".main-row-container").offsetTop + document.querySelector(".main-row-container").offsetHeight}px`;
        document.querySelector("[data-header-id=log-in-menu-container-wrapper]").style.height = `calc(100vh - ${document.querySelector(".main-row-container").offsetTop + document.querySelector(".main-row-container").offsetHeight}px`;

        document.querySelector("[data-header-id=log-in-menu-container]").classList.add("active");
        document.querySelector("[data-header-id=header-mobile-menu-button]").setAttribute('tabindex', "-1");
        setTimeout(() => {
          if (chill_penguin.client.viewport.is_lg_down()) {
            document.querySelector("body").classList.add("overflow:hidden","h:100vh");
            document.querySelector("html").classList.add("overflow-y:scroll");
          }
        },125);
      } else {
        document.querySelectorAll(".log-in-container").forEach((el) => {
          el.classList.remove("active");
        });
        document.querySelector("[data-header-id=header-log-in-button]").classList.remove("active");
        document.querySelector("[data-header-id=log-in-menu-container-wrapper]").classList.remove("active");
        document.querySelector("[data-header-id=log-in-menu-container]").classList.remove("active");
        document.querySelector("[data-header-id=header-mobile-menu-button]").setAttribute('tabindex', "");
        setTimeout(() => {
          if (chill_penguin.client.viewport.is_lg_down()) {
            document.querySelector("body").classList.remove("overflow:hidden","h:100vh");
            document.querySelector("html").classList.remove("overflow-y:scroll");
          }
        },125);
      }
    },
    addEventListeners: () => {
      document.addEventListener("keydown", (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          self.setIsSignInOpen(false);
          self.setIsMobileOpen(false);
        }
      });
      document.addEventListener("mousedown", (e) => {
        if (document.querySelector("[data-header-id=log-in-move-container]").contains(e.target)) {
          // console.log('clicked inside')
          return;
        }
        if (self.getIsSignInOpen() && chill_penguin.client.viewport.is_xl_up()) {
          // console.log('clicked outside scope')
          self.setIsSignInOpen(false);
        }
      });
    },
  };
});

chill_penguin.module("header_navigation_ui", () => {
  "use strict";

  let self;

  const links = [
    {
      label: 'Design System',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Atoms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Molecules',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Organisms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Templates',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Pages',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Tokens',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Pattern Library',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Style Guide',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Component Library',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Accessibility (A11y)',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'User Interface (UI)',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'User Experience (UX)',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Front-end Framework',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Design Ops',
          url: 'javascript:;',
          opensInNewTab: false,
        },
      ],
    },
    {
      label: 'Components',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Visual Design',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Interactivity',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Prototyping',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Code Components',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Design Principles',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Design Tokens',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Modular Design',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Responsive Design',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'UI Kit',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Design System Management',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
    {
      label: '<span role="text"><span class="sr-only">Content Managment System</span><span aria-hidden class="uppercase">cms</span></span>',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Content Repository',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Content Editor',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Media Library',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Content Modeling',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Templates',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Workflow Management',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Publishing Tools',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'User Roles and Permissions',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'SEO Management',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'APIs',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Analytics and Reporting',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Version Control',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Multilingual Support',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Content Distribution',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Plugin Ecosystem',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
    {
      label: 'UI Styleguide',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Color Palette',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Typography',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Iconography',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Spacing',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Grid Systems',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Button Styles',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Form Elements',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Navigation Systems',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Interaction Rules',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Motion and Animation',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Accessibility Guidelines',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Device Adaptability',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Component Library',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Best Practices',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Visual Hierarchy',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
    {
      label: 'Development Styleguide',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Coding Standards',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Naming Conventions',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Code Formatting',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Commenting Code',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Version Control Guidelines',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Branch Strategy',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Code Review Practices',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Build and Deployment',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Error Handling',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Testing Guidelines',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Security Practices',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Performance Optimization',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Accessibility Standards',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'API Design Guidelines',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Documentation Standards',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
    {
      label: 'Icon Library',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Icon Categories',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'SVG Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Pixel-perfect Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Responsive Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Glyph Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Outline Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Filled Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Animated Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Icon Fonts',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Accessibility Features',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Color Variants',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Size Variants',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Custom Icons',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Licensing Information',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Usage Guidelines',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
    {
      label: 'Glossary',
      url: 'javascript:;',
      opensInNewTab: false,
      subMenu: [
        {
          label: 'Terminology',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Definitions',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Acronyms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Abbreviations',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Industry Terms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Technical Jargon',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Concept Explanations',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Keyword Index',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Cross-referencing',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Usage Examples',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Synonyms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Antonyms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Related Terms',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Translations',
          url: 'javascript:;',
          opensInNewTab: false,
        },
        {
          label: 'Bibliography',
          url: 'javascript:;',
          opensInNewTab: false,
        }
      ],
    },
  ];

  return {
    initialize: () => {
      self = chill_penguin["header_navigation_ui"];
      document.querySelector("[data-header-id=navigation]").innerHTML = self.populateNav(links,links.label,links.overview,links.resourceMenu,0,0,"menu",0,links.length);
    },
    ready: () => {
      self.setPageCurrent();
      self.addEventListeners();
    },
    setPageCurrent: () => {
      let currentContent = "";
      document.querySelectorAll(".mobile-menu-nav-links a").forEach((el) => {
        if (el.hasAttribute("href")) {
          if (self.isPageCurrent(el.getAttribute("href"))) {
            el.setAttribute('aria-current', "page");
            currentContent = el.innerHTML;
            el.innerHTML = currentContent;
          }
        }
      });
    },
    isPageCurrent: (url) => {
      const parser = document.createElement('a');
      parser.href = url || '';
      return window.location.pathname === parser.pathname;
    },
    turnMainDark: (turnDark) => {
      if (turnDark) {
      } else {
      }
    },
    handleClick: (e,el,level,id) => {
      e.preventDefault();
      e.stopPropagation();
      if (level === 0) {
        if (chill_penguin.client.viewport.is_xl_up()) {
          //is the menu active? hide the menu
          if (document.getElementById(id).classList.contains("active")) {
            self.turnMainDark(false);
            document.getElementById(id).classList.toggle("active");
            el.parentNode.classList.toggle("active");
            el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true'));
          } else {
            //the menu is not active so set everything inactive and set the menu to active
            document.querySelectorAll("li.menu_listitems[data-level='0'] > button[data-level='0']").forEach((el2) => {
              el2.setAttribute('aria-expanded', false); //button
              el2.classList.remove("active"); //button
              el2.parentNode.classList.remove("active"); //li
            });
            document.querySelectorAll("li.menu_listitems[data-level='0'] > div.menu_wrapper[data-level='1']").forEach((el2) => {
              el2.classList.remove("active"); //menu
            });
            el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true')); //button
            el.classList.toggle("active"); //button
            el.parentNode.classList.toggle("active"); //li
            document.getElementById(id).classList.toggle("active"); //menu


            document.querySelectorAll("li.menu_listitems[data-level='1'] > button[data-level='1']").forEach((el2) => {
              el2.setAttribute('aria-expanded', false); //button
              el2.classList.remove("active"); //button
              el2.parentNode.classList.remove("active"); //li
            });
            //also set the first submenu as active
            if (document.querySelector(".menu_wrapper.active li.menu_listitems[data-level='1'] > button")) {
              let temp = document.querySelector(".menu_wrapper.active li.menu_listitems[data-level='1'] > button");
              if (temp.classList.contains("active")) { } else { temp.click() };
            }

            self.turnMainDark(true);
          }
        } else {
          //show the sub menu in mobile
          document.getElementById(id).classList.toggle("active");
          el.parentNode.classList.toggle("active");
          el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true'));
        }
      } else if (level === 1) {
        if (chill_penguin.client.viewport.is_xl_up()) {
          if (document.getElementById(id).classList.contains("active")) { //is the menu active? hide the menu
            el.classList.remove("active");
            document.getElementById(id).classList.toggle("active");
            el.parentNode.classList.toggle("active");
            el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true'));
          } else { //the menu is not active so set everything inactive and set the menu to active
            document.querySelectorAll("li.menu_listitems[data-level='1'] > button[data-level='1']").forEach((el2) => {
              el2.setAttribute('aria-expanded', false);
            });
            document.querySelectorAll("li.menu_listitems[data-level='1'] > div.menu_wrapper[data-level='1']").forEach((el2) => {
              el2.classList.remove("active");
            });
            document.querySelectorAll("li.menu_listitems[data-level='1'] > ul.menu_list[data-level='2']").forEach((el2) => {
              el2.classList.remove("active");
            });
            document.querySelectorAll("li.menu_listitems[data-level='1']").forEach((el2) => {
              el2.classList.remove("active");
            });

            el.classList.add("active");
            document.getElementById(id).classList.toggle("active");
            el.parentNode.classList.toggle("active");
            el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true'));
          }
        } else {
          //show the sub menu in mobile
          document.getElementById(id).classList.toggle("active");
          el.parentNode.classList.toggle("active");
          el.setAttribute('aria-expanded', !(el.getAttribute('aria-expanded') === 'true'));
        }
      }
    },
    populateNav: (menu,heading,overview,resourceMenu,level,index,newid,columnLength,submenuLength) => {
      level = level || 0;
      index = index || 0;
      let opensInNewTab = "";
      let temp = "";

      let columnLengthCopy;
      let submenuCopy;

      if (level === 1) {
        columnLengthCopy = `data-column-threshold="small" }`;
      } else {
        columnLengthCopy = `data-column-threshold="mall"  }`;
        submenuCopy = `data-submenu-threshold="small" }`;
      }

      if (menu) {
        if (level === 1) {
        temp += `<div data-level="${level}" id="${newid}" class="menu_wrapper" ${columnLengthCopy} ${submenuCopy}>`
        temp += `  <div class="megamenu-ul-container" data-level="${level}">`
        temp += `  <ul class="menu_list" role="list" data-level="${level}" ${columnLengthCopy} ${submenuCopy}>`
        } else {
        temp += `  <ul class="menu_list" id="${newid}" role="list" data-level="${level}" ${columnLengthCopy} ${submenuCopy}>`
        }
        menu.forEach((el,index2) => {
          let tempnewid = `${newid}_${index2.toString()}`;
          temp += `  <li class="menu_listitems" role="listitem" data-level="${level}" data-index="${index2}">`;
          if (el.subMenu) {
            temp += `  <button id="${tempnewid}_button" aria-expanded="false" aria-controls="${newid}" data-level="${level}" onclick="chill_penguin.header_navigation_ui.handleClick(event,this,${level},'${tempnewid}');">`;
            temp += `    <span>${el.label}</span>`;
            temp += `  </button>`;
            temp += `  ${chill_penguin.header_navigation_ui.populateNav(el.subMenu,el.label,el.overview,el.resourceMenu,level+1,index2,tempnewid,menu.length,el.subMenu.length)}`;
          } else {
            opensInNewTab = (el.opensInNewTab) ? ' target="_blank"' : ' target="_self"';
            if (level === 0 || level === 1) {
              temp += `  <a href="${el.url}" data-level="${level}" aria-label="${el.ariaLabel}" ${opensInNewTab}>${el.label}</a>`;
            } else {
              temp += `  <a href="${el.url}" data-level="${level}" aria-label="${el.ariaLabel}" ${opensInNewTab}>`;
              temp += `    <div class="description">`;
              temp += `      <span class="anchor">${el.label}</span>`;
              temp += `      <span class="content">${el.description}</span>`;
              temp += `    </div>`;
              temp += `  </a>`;
            }
          }
          temp += `  </li>`;
        });
        temp += `  </ul>`;
        if (level === 1) {
          temp += `</div>`
        }
        if (level === 1) {
          temp += `</div>`
        }
      }

      return temp;
    },
    addEventListeners: () => {
      document.addEventListener("mousedown", (e) => {
        if (document.querySelector("[data-header-id=navigation]").contains(e.target)) {
          // console.log('clicked inside')
          return;
        }
        if (chill_penguin.client.viewport.is_xl_up()) {
          // console.log('clicked outside scope')
          document.querySelectorAll("li.menu_listitems[data-level='0'] > button[data-level='0']").forEach((el2) => {
            el2.setAttribute('aria-expanded', false);
          });
          document.querySelectorAll("li.menu_listitems[data-level='0'] > div.menu_wrapper[data-level='1']").forEach((el2) => {
            el2.classList.remove("active");
          });
        }
      });
    }
  };
});

chill_penguin.module("custom_dropdown", () => {
  "use strict";

  let self;
  let custom_dropdown_state = [];

  return {
    initialize: () => {
      self = chill_penguin["custom_dropdown"];
      document.querySelectorAll("[data-module='custom_dropdown']").forEach(el => {
        let custom_dropdown_id = el.getAttribute("id");
        custom_dropdown_state[custom_dropdown_id] = {
          "active": false,
          "input": el.querySelector("[data-module='custom_dropdown_input']"),
          "options_container": el.querySelector("[data-module='custom_dropdown_options']"),
          "options": {}, //not ready yet,
          "totalItems": 0, //not ready yet,
          "focus": 0,
        };
      });
    },
    ready: () => {
      document.querySelectorAll("[data-module='custom_dropdown']").forEach(el => {
        let custom_dropdown_id = el.getAttribute("id");
        custom_dropdown_state[custom_dropdown_id]["totalItems"] = el.querySelectorAll("[data-module='custom_dropdown_options'] > div.option").length;
        custom_dropdown_state[custom_dropdown_id]["options"] = el.querySelectorAll("[data-module='custom_dropdown_options'] > div.option");
        self.addEventListeners(custom_dropdown_id);
      });
    },
    setIsOpen: (id,value) => {
      //console.log(id,value)
      custom_dropdown_state[id]["active"] = value;
      custom_dropdown_state[id]["input"].setAttribute('aria-expanded', custom_dropdown_state[id]["active"]);
      if (custom_dropdown_state[id]["active"]) {
        document.getElementById(id).classList.add("active");
        custom_dropdown_state[id]["input"].setAttribute('aria-activedescendant', `${id}_${custom_dropdown_state[id]["focus"]}`);
        custom_dropdown_state[id]["input"].classList.add('active');
        custom_dropdown_state[id]["options_container"].classList.add('active');
      } else {
        document.getElementById(id).classList.remove("active");
        custom_dropdown_state[id]["input"].setAttribute('aria-activedescendant', ``);
        custom_dropdown_state[id]["input"].classList.remove('active');
        custom_dropdown_state[id]["options_container"].classList.remove('active');

      }
    },
    getIsOpen: (id) => {
      return custom_dropdown_state[id]["active"];
    },
    addEventListeners: (id) => {
      //console.log(custom_dropdown_state[id]["input"]);
      custom_dropdown_state[id]["input"].addEventListener("keydown", (e) => {
        //console.log(e.key);
        // Cannot use Switch Statement due to event modifiers
        if (e.key === 'ArrowDown' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (!self.getIsOpen(id)) {
            // closed combobox
            if (e.altKey) {
              // down + alt
              self.setIsOpen(id,true); // Opens the listbox without moving focus or changing selection.
            } else {
              // down
              self.setIsOpen(id,true); // Opens the listbox if it is not already displayed without moving focus or changing selection. DOM focus remains on the combobox.
            }
          } else if (custom_dropdown_state[id]["focus"] < custom_dropdown_state[id]["totalItems"] - 1 && self.getIsOpen(id)) {
            custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["focus"] + 1; // Moves visual focus to the next option. If visual focus is on the last option, visual focus does not move.
          }
        } else if (e.key === 'ArrowUp' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (!self.getIsOpen(id)) {
            // closed combobox
            self.setIsOpen(id,true); // First opens the listbox if it is not already displayed and..
            custom_dropdown_state[id]["focus"] = 0; // ..then moves visual focus to the first option. DOM focus remains on the combobox.
          } else if (custom_dropdown_state[id]["focus"] > 0 && self.getIsOpen(id)) {
            if (e.altKey) {
              // up + alt
              // TODO //Sets the value to the content of the focused option in the listbox.
              self.setIsOpen(id,false); // Closes the listbox.
              custom_dropdown_state[id]["focus"] = -1; // Closes the listbox.
              // @TODO //Sets visual focus on the combobox.
            } else {
              // up
              custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["focus"] - 1; // Moves visual focus to the previous option. If visual focus is on the first option, visual focus does not move.
            }
          }
        } else if (
          (e.key === 'Enter' || e.key === ' ') &&
          (e.getModifierState('Control') || e.getModifierState('Alt') || true)
        ) {
          e.preventDefault();
          if (!self.getIsOpen(id)) {
            self.setIsOpen(id,true); // Opens the listbox without moving focus or changing selection.
          } else if (custom_dropdown_state[id]["focus"] === -1 && self.getIsOpen(id)) {
            self.setIsOpen(id,false); // Closes the listbox.
          } else if (custom_dropdown_state[id]["focus"] >= 0 && self.getIsOpen(id)) {
            custom_dropdown_state[id]["options"][custom_dropdown_state[id]["focus"]].click(); // Sets the value to the content of the focused option in the listbox.
            custom_dropdown_state[id]["focus"] = -1; // Closes the listbox.
            self.setIsOpen(id,false); // Closes the listbox.
            // @TODO //Sets visual focus on the combobox.
          }
        } else if (e.key === 'Home' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (!self.getIsOpen(id)) {
            self.setIsOpen(id,true); // Opens the listbox and..
            custom_dropdown_state[id]["focus"] = 0; // ..moves visual focus to the first option.
          } else if (custom_dropdown_state[id]["focus"] >= 0 && self.getIsOpen(id)) {
            custom_dropdown_state[id]["focus"] = 0; // Moves visual focus to the first option.
          }
        } else if (e.key === 'End' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (!self.getIsOpen(id)) {
            self.setIsOpen(id,true); // Opens the listbox and,,,
            custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["totalItems"] - 1; // ..moves visual focus to the last option.
          } else if (custom_dropdown_state[id]["focus"] >= 0 && self.getIsOpen(id)) {
            custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["totalItems"] - 1; //  Moves visual focus to the last option.
          }
        } else if (e.key === 'PageUp' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (self.getIsOpen(id)) {
            if (custom_dropdown_state[id]["focus"] - 10 >= 0) {
              custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["focus"] - 10; // Jumps visual focus up 10 options..
            } else {
              custom_dropdown_state[id]["focus"] = 0; // ..(or to first option).
            }
          }
        } else if (e.key === 'PageDown' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          if (self.getIsOpen(id)) {
            if (custom_dropdown_state[id]["focus"] + 10 <= custom_dropdown_state[id]["totalItems"] - 1) {
              custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["focus"] + 10; // Jumps visual focus down 10 options..
            } else {
              custom_dropdown_state[id]["focus"] = custom_dropdown_state[id]["totalItems"] - 1; // ..(or to last option).
            }
          }
        } else if (e.key === 'Tab' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          // TODO //Sets the value to the content of the focused option in the listbox.
          self.setIsOpen(id,false); // Closes the listbox.
          custom_dropdown_state[id]["focus"] = -1; // Closes the listbox.
          // e.preventDefault(); //Performs the default action, moving focus to the next focusable element
        } else if (e.key === 'Escape' && (e.getModifierState('Control') || e.getModifierState('Alt') || true)) {
          e.preventDefault();
          self.setIsOpen(id,false); // Closes the listbox.
          custom_dropdown_state[id]["focus"] = -1; // Closes the listbox.
          // @TODO //Sets visual focus on the combobox.
        }

        custom_dropdown_state[id]["options"].forEach((element) => {
          //console.log(element);
          element.setAttribute('data-focus', false);
        });

        if (custom_dropdown_state[id]["focus"] >= 0) {
          custom_dropdown_state[id]["options"][custom_dropdown_state[id]["focus"]].setAttribute('data-focus', true);
          custom_dropdown_state[id]["input"].setAttribute("aria-activedescendant", `${id}_${custom_dropdown_state[id]["focus"]}`);
        }
      });
      document.addEventListener("mousedown", (e) => {
        if (document.getElementById(id).contains(e.target)) {
          // console.log('clicked inside')
          return;
        }
        // console.log('clicked outside scope')
        if (chill_penguin.client.viewport.is_lg_up()) {
          self.setIsOpen(id,false);
        }
      });
    }
  };
});

chill_penguin.module("dropdown_site_selector", () => {
  "use strict";

  let self;
  const site_selector = [
    {
      content: 'Chill Penguin',
      value: 'javascript:;',
      ariaLabel: "chill penguin",
      isSelected: false,
      isDisabled: false,
    },
    {
      content: 'Storm Eagle',
      value: 'javascript:;',
      ariaLabel: "storm eagle",
      isSelected: false,
      isDisabled: false,
    },
    {
      content: 'Tailwind CSS 3.4.3',
      value: 'javascript:;',
      ariaLabel: "tailwind css",
      isSelected: false,
      isDisabled: false,
    },
    {
      content: 'Bootstrap 5.3.3',
      value: 'javascript:;',
      ariaLabel: "bootstrap 5.3.3",
      isSelected: false,
      isDisabled: false,
    },
  ];

  return {
    initialize: () => {
      self = chill_penguin["dropdown_site_selector"];
      self.populateSelected();
      self.populateOptions();
    },
    optionClick: (value,index) => {
      // optionClick handles standard click behaviour for a dropdown
      // set all selected/disabled to false
      site_selector.forEach((element) => {
        element.isSelected = false;
        element.isDisabled = false;
      });
      // set selected item's selected/disabled to true
      site_selector[index].isSelected = true;
      site_selector[index].isDisabled = true;
      self.populateOptions();
      self.populateSelected();
    },
    populateSelected: () => {
      let temp = "";
      site_selector.forEach((dropdown,index) => {
        if (dropdown.isSelected === true) {
          temp += `${dropdown.content}`;
        }
      });
      document.querySelector("[data-header-id=dropdown-site-selector-selected]").innerHTML = temp;
    },
    populateOptions: () => {
      let temp = "";
      site_selector.forEach((dropdown,index) => {
        let onclick = (dropdown.isDisabled === false) ? ` onclick="chill_penguin.dropdown_site_selector.optionClick('${escape(dropdown.value)}', ${index});chill_penguin.custom_dropdown.setIsOpen('dropdown-site-selector',false);"` : ``;
        temp += `<div class="option" role="option" id="dropdown-site-selector_${index}" aria-selected="${dropdown.isSelected}" aria-disabled="${dropdown.isDisabled}" ${onclick}>`;
        temp += `  ${dropdown.content}`;
        temp += `</div>`;
      });
      document.querySelector("[data-header-id=dropdown-listboxid-site-selector]").innerHTML = temp;

      temp = "";
      site_selector.forEach((dropdown,index) => {
        let active = (dropdown.isSelected === true) ? " active" : "";
        temp += `<li role="listitem" class="${active}">`;
        temp += `  <a href="${dropdown.value}">${dropdown.content}</a>`;
        temp += `</li>`;
      });
      document.querySelector("[data-header-id=dropdown-list-site-selector]").innerHTML = temp;
    },
  };
});
