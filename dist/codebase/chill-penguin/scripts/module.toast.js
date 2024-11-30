'use strict';
chill_penguin.module('toast', () => {
  return {
    add: (message,text_color="color:white",background="bgc:onyx",duration="2500") => {

      const create_toast_container = () => {
        const toast_container = document.createElement('div');
        toast_container.classList.add('toast-container');
        toast_container.setAttribute("data-module", "module.toast");
        document.body.appendChild(toast_container);
        return toast_container;
      }

      let toast_container = document.querySelector('[data-module="module.toast"]');
      toast_container ||= create_toast_container();

      const toast = document.createElement('span');
      toast.className = `toast bxs:5 heebo:bold ${text_color} ${background}`;
      toast.innerHTML = message; // Use textContent to set the content of the div
      toast_container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '1';
      }, 10);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          toast_container.removeChild(toast);

          // Remove the toast container if there are no messages
          if (toast_container.childElementCount === 0) {
            document.body.removeChild(toast_container);
          }
        }, 500);
      }, duration);
    },
  };
});
