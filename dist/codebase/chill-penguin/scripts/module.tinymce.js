'use strict';

chill_penguin.module('tinymce', () => {
  let self;
  let state = {};

  const tinymce_string = {
    height: 125,
    forced_root_block: 'faketag', //prevents a wrapping <p> tag as these should have no wrapper
    plugins: 'anchor charmap code codesample emoticons fullscreen help image insertdatetime link lists media nonbreaking pagebreak preview save searchreplace table visualblocks visualchars wordcount',
    toolbar: "undo redo | italic superscript | charmap",
    paste_as_text: true,
  };

  const tinymce_basic = {
    height: 250,
    forced_root_block: 'faketag', //prevents a wrapping <p> tag as these should have no wrapper
    plugins: 'anchor charmap code codesample emoticons fullscreen help image insertdatetime link lists media nonbreaking pagebreak preview save searchreplace table visualblocks visualchars wordcount',
    toolbar: "undo redo | italic superscript | link openlink unlink | charmap | visualblocks | advanced",
  };

  const tinymce_advanced = {
    height: 350,
    plugins: 'anchor charmap code codesample emoticons fullscreen help image insertdatetime link lists media nonbreaking pagebreak preview save searchreplace table visualblocks visualchars wordcount',
    toolbar: "undo redo | blocks styles | bold italic superscript | bullist numlist custom_list | link openlink unlink | alignleft aligncenter alignright alignjustify alignnone  | charmap | visualblocks | advanced",
    style_formats: [
      { title: 'Heading Font' },
      { title: 'Heebo', format: 'heebo', classes: 'heebo' },
      { title: 'Play', format: 'play', classes: 'play' },
      { title: 'Text Font' },
      { title: 'Heebo Bold', format: 'heebo:bold', inline: 'span', classes: 'heebo:bold' },
      { title: 'Heebo Medium', format: 'heebo:medium', inline: 'span', classes: 'heebo:medium' },
      { title: 'Heebo Light', format: 'heebo:light', inline: 'span', classes: 'heebo:light' },
      { title: 'Color' },
      { title: 'blue', format: 'color:blue', inline: 'span', classes: 'color:blue' },
      { title: 'white', format: 'color:white', inline: 'span', classes: 'color:white' },
      { title: 'eerie-black', format: 'color:eerie-black', inline: 'span', classes: 'color:eerie-black' },
      { title: 'yale-blue', format: 'color:yale-blue', inline: 'span', classes: 'color:yale-blue' },
      { title: 'positive', format: 'color:positive', inline: 'span', classes: 'color:positive' },
      { title: 'negative', format: 'color:negative', inline: 'span', classes: 'color:negative' },
      { title: 'Font Size' },
      { title: '16px', format: 'fs:16px', classes: 'fs:16px' },
      { title: '14px', format: 'fs:14px', classes: 'fs:14px' },
      { title: 'More ...' },
      { title: 'Containers', items: [
        { title: 'Div', block: 'div' },
        { title: 'Pre', block: 'pre' },
        { title: 'Section', block: 'section', wrapper: true, merge_siblings: false },
        { title: 'Aside', block: 'aside', wrapper: true },
        { title: 'Article', block: 'article', wrapper: true, merge_siblings: false },
        { title: 'Blockquote', block: 'blockquote', wrapper: true },
      ]},
    ],
    block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4;',
  };

  const tinymce_common = {
    placeholder: "Placeholder copy...",
    entity_encoding : "named",

    menubar: false,
    autosave_restore_when_empty: true,

    visualblocks_default_state: true,
    end_container_on_empty_block: true,

    inline_styles : false,

    style_formats_merge: false,
    style_formats_autohide: true,
    content_style: `
      .heebo {
        font-family: "heebo-bold", Arial, Sans-Serif;
        font-size: 16px;
      }
      .play {
        font-family: "play-bold", Arial, Sans-Serif;
        font-size: 16px;
      }
      .heebo\\:bold {
        font-family: "heebo-bold", Arial, Sans-Serif;
        font-size: 16px;
      }
      .heebo\\:medium {
        font-family: "heebo-medium", Arial, Sans-Serif;
        font-size: 16px;
      }
      .heebo\\:light {
        font-family: "heebo-light", Arial, Sans-Serif;
        font-size: 16px;
      }
      .color\\:blue {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: #3169b2;
      }
      .color\\:white {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: white;
        text-shadow: 0 0 3px #202020;
      }
      .color\\:eerie-black {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: #202020;
      }
      .color\\:yale-blue {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: #1c3b65;
      }
      .color\\:positive {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: #09681d;
      }
      .color\\:negative {
        font-family: "heebo-bold", Arial, Sans-Serif;
        color: #a01010;
      }
      .fs\\:16px {
        font-size: 1rem;
      }
      .fs\\:14px {
        font-size: 0.875rem;
      }
      .text-align\\:left {
        text-align:left;
      }
      .text-align\\:center {
        text-align:center;
      }
      .text-align\\:right {
        text-align:right;
      }
      .display\\:inline {
        display:inline;
      }`
    ,
    formats : {
      'alignleft' : {selector : 'p,h1,h2,h3,h4,td,th,div,ul,ol,li', 'classes' : 'text-align:left'},
      'aligncenter' : {selector : 'p,h1,h2,h3,h4,td,th,div,ul,ol,li', 'classes' : 'text-align:center'},
      'alignright' : {selector : 'p,h1,h2,h3,h4,td,th,div,ul,ol,li', 'classes' : 'text-align:right'},
      'heebo' : {selector: 'h1,h2,h3,h4', 'classes' : 'heebo'},
      'play' : {selector: 'h1,h2,h3,h4', 'classes' : 'play'},
      'heebo:bold' : {selector: 'p,td,th,div,ul,ol,li,span', 'classes' : 'heebo:bold'},
      'heebo:medium' : {selector: 'p,td,th,div,ul,ol,li,span', 'classes' : 'heebo:medium'},
      'heebo:light' : {selector: 'p,td,th,div,ul,ol,li,span', 'classes' : 'heebo:light'},
      'color:blue': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:blue' },
      'color:white': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:white' },
      'color:eerie-black': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:eerie-black' },
      'color:yale-blue': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:yale-blue' },
      'color:positive': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:positive' },
      'color:negative': { selector: 'p,h1,h2,h3,h4,td,th,div,ul,ol,li,span', classes: 'color:negative' },
      'lh:24': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'lh:24' },
      'lh:32': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'lh:32' },
      'lh:40': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'lh:40' },
      'lh:48': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'lh:48' },
      'fs:12px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:12px' },
      'fs:14px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:14px' },
      'fs:16px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:16px' },
      'fs:20px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:20px' },
      'fs:24px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:24px' },
      'fs:28px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:28px' },
      'fs:32px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:32px' },
      'fs:40px': { selector: 'p,td,th,div,ul,ol,li,span', classes: 'fs:40px' },
    },

    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'CSS', value: 'css' },
    ],
    charmap_append: [
      [192, 'À'],
      [224, 'à'],
      [194, 'Â'],
      [226, 'â'],
      [196, 'Ä'],
      [228, 'ä'],
      [202, 'É'],
      [233, 'é'],
      [200, 'È'],
      [232, 'è'],
      [202, 'Ê'],
      [234, 'ê'],
      [203, 'Ë'],
      [235, 'ë'],
      [206, 'Î'],
      [238, 'î'],
      [207, 'Ï'],
      [239, 'ï'],
      [212, 'Ô'],
      [244, 'ô'],
      [217, 'Ù'],
      [249, 'ù'],
      [219, 'Û'],
      [251, 'û'],
      [220, 'Ü'],
      [252, 'ü'],
      [171, '«'],
      [187, '»'],
      [199, 'Ç'],
      [231, 'ç'],
      [140, 'Œ'],
      [156, 'œ'],
      [169, '©'],
      [174, '®'],
      [153, '™'],
      [134, '†'],
      [135, '‡'],
      [167, '§'],
      [916, 'Δ'],
    ],
  }

  return {
    initialize: () => {
      self = chill_penguin.tinymce;
      state = {};
      self.setup();
    },
    setup: () => {
      document.querySelectorAll('[data-module="tinymce"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          type: el.getAttribute('data-tinymce-type'),
          preview_ids: JSON.parse(el.getAttribute('data-tinymce-preview')) || [],
          onload_id: el.getAttribute('data-tinymce-onload-element') || false,
          onupdate: el.getAttribute('data-tinymce-onupdate-func') || false,
        };
        self.tinymce.initialize(id);
      });
    },
    tinymce: {
      initialize: (id) => {
        const { type, preview_ids, onload_id, onupdate } = state[id];

        const update_preview = (editor) => {
          if (onupdate) {
            if (preview_ids) {
              preview_ids.forEach((preview_id) => {
                chill_penguin.util.run_str_func( onupdate, { editor, preview_id } );
              });

            } else {
              chill_penguin.util.run_str_func( onupdate, { editor, id } );
            }
          }
        };

        let config = {
          selector: `#${id}`,
          valid_elements: '*[*]', // Allows all elements and attributes
          valid_children: '*[*]',
          extended_valid_elements: '*[*]',
          noneditable_class: 'tiny-mce-not-editable',
          setup: (editor) => {
            editor.on('init', (event) => {
              onload_id && tinymce.get(id).setContent(document.getElementById(onload_id).innerHTML);

              preview_ids.forEach((preview_id) => {
                self.force_update_preview(editor, preview_id);
              });
            });
            editor.on('input ExecCommand', (event) => {
              if ((event.type === 'execcommand' || event.type === 'input') && event.command !== 'mceFocus') {
                update_preview(editor);
              }
            });
            editor.on('keydown change', (event) => {
                update_preview(editor);
            });
            editor.on('keydown', (event) => {
              if (event.keyCode === keyboard.keys.tab) {
                const node = editor.selection.getNode();
                if (node.nodeName === 'LI' || node.closest('ul, ol')) {
                  update_preview(editor);
                }
              }
            });
            editor.ui.registry.addToggleButton('custom_list', {
              icon: 'checklist',
              text: '',
              onAction: (api) => {
                let node = editor.selection.getNode();
                if (node.nodeName === 'LI') {
                  node = node.parentNode;
                }

                if (node.nodeName === 'UL' && editor.dom.hasClass(node, 'checkmark-list')) {
                  editor.dom.removeClass(node, 'checkmark-list');
                  api.setActive(false);
                } else {
                  editor.dom.addClass(node, 'checkmark-list');
                  api.setActive(true);
                }

                update_preview(editor);
              },
              onSetup: (api) => {
                const editor_event_callback = (event) => {
                  let node = editor.selection.getNode();
                  if (node.nodeName === 'LI') {
                    node = node.parentNode;
                  }
                  api.setActive(node.nodeName === 'UL' && editor.dom.hasClass(node, 'checkmark-list'));
                };

                editor.on('NodeChange', editor_event_callback);
                return () => {
                  editor.off('NodeChange', editor_event_callback);
                };
              }
            });
            editor.ui.registry.addMenuButton('advanced', {
              icon: 'image-options',
              text: '',
              fetch: (callback) => {
                const tinymce_advanced_menuitems = [
                  {
                    type: 'menuitem',
                    text:  'Cut',
                    icon: 'cut',
                    onAction: () => {
                      editor.execCommand('cut');
                    },
                  },
                  {
                    type: 'menuitem',
                    text:  'Copy',
                    icon: 'copy',
                    onAction: () => {
                      editor.execCommand('copy');
                    },
                  },
                  {
                    type: 'menuitem',
                    text:  'Paste',
                    icon: 'paste',
                    onAction: () => {
                      editor.execCommand('paste');
                    },
                  },
                  {
                    type: 'menuitem',
                    text:  'Paste as Text',
                    icon: 'paste-text',
                    onAction: () => {
                      editor.execCommand('pastetext');
                    },
                  },
                  {
                    type: 'separator',
                  },
                  {
                    type: 'menuitem',
                    text:  'Underline',
                    icon: 'underline',
                    onAction: () => {
                      editor.execCommand('underline');
                    },
                  },
                  {
                    type: 'menuitem',
                    text:  'Strikethrough',
                    icon: 'strike-through',
                    onAction: () => {
                      editor.execCommand('strikethrough');
                    },
                  },
                  {
                    type: 'menuitem',
                    text:  'Subscript',
                    icon: 'subscript',
                    onAction: () => {
                      editor.execCommand('subscript');
                    },
                  },
                  {
                    type: 'separator',
                  },
                  {
                    type: 'menuitem',
                    text: 'Search and Replace',
                    icon: 'search',
                    onAction: () => {
                      editor.execCommand('searchreplace');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'Select All',
                    icon: 'select-all',
                    onAction: () => {
                      editor.execCommand('selectall');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'Fullscreen',
                    icon: 'fullscreen',
                    onAction: () => {
                      editor.execCommand('fullscreen');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'View as code',
                    icon: 'sourcecode',
                    onAction: () => {
                      editor.execCommand('code');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'Code Sample',
                    icon: 'code-sample',
                    onAction: () => {
                      editor.execCommand('codesample');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'Wordcount',
                    icon: 'character-count',
                    onAction: () => {
                      editor.execCommand('wordcount');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'See Visual Blocks',
                    icon: 'visualblocks',
                    onAction: () => {
                      editor.execCommand('visualblocks');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'See Visual Characters',
                    icon: 'visualchars',
                    onAction: () => {
                      editor.execCommand('visualchars');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: 'Add nonbreaking space',
                    icon: 'non-breaking',
                    onAction: () => {
                      editor.execCommand('nonbreaking');
                    },
                  },
                ];
                callback(tinymce_advanced_menuitems);
              },
            });
          },
        };
        switch (type) {
          case 'string':
            config = { ...config, ...tinymce_common, ...tinymce_string };
            break;
          case 'basic':
            config = { ...config, ...tinymce_common, ...tinymce_basic };
            break;
          case 'advanced':
            config = { ...config, ...tinymce_common, ...tinymce_advanced };
            break;
          default:
            break;
        }
        tinymce.init(config);
      }
    },
    force_update_preview: (editor, preview_ids) => {
      const ids = preview_ids.includes(',') ? preview_ids.split(',').map(id => id.trim()) : [preview_ids];

      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = editor.getContent();
        }
      });
    }
  };
});