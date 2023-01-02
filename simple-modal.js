// TODO: add nested to special modal, not all modals
class SimpleModal {
  constructor(options) {
    const defaultOptions = {
      onInit: () => {},
      beforeOpen: () => {},
      onOpen: () => {},
      beforeClose: () => {},
      onClose: () => {},
      disableScroll: true,
      transition: 250,
      nested: true,
      overlayCloseAll: true,
    };
    this.options = { ...defaultOptions, ...options };
    this.htmlNode = document.querySelector('html');
    this.modalNodes = document.querySelectorAll('.modal');
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.isAnimated = false;
  }
  init() {
    if (this.modalNodes.length > 0) {
      this.modalNodes.forEach((modalNode) => {
        modalNode.style.transitionDuration =
          this.options.transition / 1000 + 's';
      });
      this._events();
      this.options.onInit();
    }
  }
  open(id) {
    if (!this.isAnimated) {
      const modalNode = document.querySelector('#' + id);

      this.options.beforeOpen(modalNode);

      modalNode.setAttribute('aria-hidden', false);
      this.isAnimated = true;

      setTimeout(() => {
        modalNode.classList.add('is-open');
        if (this.options.disableScroll) {
          this.htmlNode.classList.add('overflow-hidden');
        }
      }, 10);

      setTimeout(() => {
        this.isAnimated = false;
        this.activeModalNodes = document.querySelectorAll('.modal.is-open');
        this.options.onOpen(modalNode);
      }, this.options.transition);
    }
  }
  close(id) {
    if (!this.isAnimated) {
      const modalNode = document.querySelector('#' + id);

      this.options.beforeClose(modalNode);

      this.isAnimated = true;
      modalNode.classList.remove('is-open');

      if (this.options.disableScroll && this.activeModalNodes.length === 1) {
        this.htmlNode.classList.remove('overflow-hidden');
      }

      setTimeout(() => {
        modalNode.setAttribute('aria-hidden', true);
        this.isAnimated = false;
        this.activeModalNodes = document.querySelectorAll('.modal.is-open');
        this.options.onClose(modalNode);
      }, this.options.transition);
    }
  }
  closeAll() {
    this.activeModalNodes.forEach((modalNode) => {
      this.isAnimated = false;
      this.close(modalNode.id);
      this.htmlNode.classList.remove('overflow-hidden');
    });
  }
  _events() {
    const initEvents = (e) => {
      const openTrigger = e.target.closest('[data-modal-open]');
      const closeTrigger = e.target.closest('[data-modal-close]');
      const modalNode = e.target.closest('.modal');
      const isOverlay = modalNode && !e.target.closest('.modal__inner');

      if (openTrigger) {
        e.preventDefault();
        const modalId = openTrigger.dataset.modalOpen;

        if (!this.options.nested && this.activeModalNodes.length > 0) {
          this.closeAll();
          setTimeout(() => {
            this.open(modalId);
          }, this.options.transition);
        } else {
          this.open(modalId);
        }
      } else if (closeTrigger) {
        e.preventDefault();
        const modalId = closeTrigger.dataset.modalClose || modalNode.id;
        this.close(modalId);
      } else if (isOverlay) {
        if (this.options.overlayCloseAll && this.activeModalNodes.length > 0) {
          this.closeAll();
        } else {
          this.close(modalNode.id);
        }
      }
    };

    document.body.addEventListener('click', initEvents);
  }
}
