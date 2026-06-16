import { Modal } from "bootstrap";

export function useModal(elementId) {
  let modalInstance = null;

  const getOrCreateInstance = () => {
    if (modalInstance) return modalInstance;
    const el = document.getElementById(elementId);
    if (el) {
      modalInstance = new Modal(el);
      el.addEventListener("hidden.bs.modal", () => {
        if (document.activeElement && el.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      });
    }
    return modalInstance;
  };

  const show = () => {
    getOrCreateInstance()?.show();
  };

  const hide = () => {
    getOrCreateInstance()?.hide();
  };

  return { show, hide };
}
