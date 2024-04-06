class SimpleModal {
  constructor(options) {
    const defaultOptions = {
      onInit: () => {},
      beforeOpen: () => {},
      onOpen: () => {},
      beforeClose: () => {},
      onClose: () => {},
      onStartOpen: () => {},
      disableScroll: true,
      transitionDelay: 300,
      nested: true,
      overlayCloseAll: true,
      fixPageOffset: true,
      fixedBlocks: [],
    };
    this.options = { ...defaultOptions, ...options };
    this.html = document.querySelector('html');
    this.body = document.querySelector('body');
    this.modalNodes = document.querySelectorAll('.modal');
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.isAnimated = false;
  }
  init() {
    if (this.modalNodes.length > 0) {
      this.modalNodes.forEach((modalNode) => {
        modalNode.style.transitionDuration =
          this.options.transitionDelay / 1000 + 's';
      });
      this._events();
      this.options.onInit();
    }
  }
  async open(id) {
    if (this.isAnimated) return;

    if (this.activeModalNodes.length > 0) {
      await this.closeAll();
      await waitFor(this.options.transitionDelay + 100);
    }

    const modalNode = document.querySelector('#' + id);

    this.options.beforeOpen(modalNode);


    if (this.options.disableScroll) {
      this._disableScroll(modalNode);
    }

    modalNode.setAttribute('aria-hidden', false);
    this.isAnimated = true;

    await waitFor(1);

    this.options.onStartOpen(modalNode);

    modalNode.classList.add('is-open');
    modalNode.focus();

    await waitFor(this.options.transitionDelay);

    this.isAnimated = false;
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.options.onOpen(modalNode);
  }
  async close(id) {
    if (this.isAnimated) return;

    const modalNode = document.querySelector('#' + id);

    this.options.beforeClose(modalNode);

    this.isAnimated = true;
    modalNode.classList.remove('is-open');
    if (this.options.disableScroll && this.activeModalNodes.length === 1) {
      this._enableScroll(modalNode);
    }

    await waitFor(this.options.transitionDelay);


    modalNode.setAttribute('aria-hidden', true);
    this.isAnimated = false;
    this.activeModalNodes = document.querySelectorAll('.modal.is-open');
    this.options.onClose(modalNode);
  }
  async closeAll() {
    this.activeModalNodes.forEach(async (modalNode) => {
      this.isAnimated = false;
      await this.close(modalNode.id);
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
          waitFor(this.options.transitionDelay);
          this.open(modalId);
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      } else if (e.key === 'Tab') {
      }
    });
  }

  _enableScroll(modalNode) {
    if (this.options.fixPageOffset) {
      this.options.fixedBlocks.forEach((el) => (el.style.paddingRight = ''));

      modalNode.style.paddingRight = '';
      this.body.style.paddingRight = '';
    }

    this.html.style.overflow = '';
    this.body.style.overflow = '';
  }

  _disableScroll(modalNode) {
    if (this.options.fixPageOffset) {
      const scrollWidth = window.innerWidth - this.body.offsetWidth + 'px';
      this.options.fixedBlocks.forEach(
        (el) => (el.style.paddingRight = scrollWidth)
      );

      modalNode.style.paddingRight = scrollWidth;
      this.body.style.paddingRight = scrollWidth;
    }

    this.html.style.overflow = 'hidden';
    this.body.style.overflow = 'hidden';
  }
}

const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));