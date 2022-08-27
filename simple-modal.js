class SimpleModal {
	constructor(options) {
		const defaultOptions = {
			onOpen: () => {},
			onClose: () => {},
			disableScroll: true,
			transition: 250,
			nested: true,
			overlayCloseAll: true,
		}
		this.options = Object.assign(defaultOptions, options)
		this.$html = document.querySelector('html')
		this.$modals = document.querySelectorAll('.modal')
		this.$activeModals = document.querySelectorAll('.modal.is-open')
		this.isAnimated = false
	}
	init() {
		if (this.$modals.length > 0) {
			this.$modals.forEach($modal => {
				$modal.style.transitionDuration = this.options.transition / 1000 + 's'
			})
			this._events()
		}
	}
	_events() {
		document.body.addEventListener('click', e => {
			const openTrigger = e.target.closest('[data-modal-open]')
			const closeTrigger = e.target.closest('[data-modal-close]')
			const $modal = e.target.closest('.modal')
			const isOverlay = $modal && !e.target.closest('.modal__inner')

			if (openTrigger) {
				e.preventDefault()
				const modalId = openTrigger.dataset.modalOpen

				if (!this.options.nested && this.$activeModals.length > 0) {
					this.closeAll()
					setTimeout(() => {
						this.open(modalId)
					}, this.options.transition)
				} else {
					this.open(modalId)
				}
			} else if (closeTrigger) {
				e.preventDefault()
				const modalId = closeTrigger.dataset.modalClose || $modal.id
				this.close(modalId)
			} else if (isOverlay) {
				if (this.options.overlayCloseAll && this.$activeModals.length > 0) {
					this.closeAll()
				} else {
					this.close($modal.id)
				}
			}
		})
	}
	open(id) {
		if (!this.isAnimated) {
			const $modal = document.querySelector('#' + id)

			$modal.setAttribute('aria-hidden', false)
			this.isAnimated = true

			setTimeout(() => {
				$modal.classList.add('is-open')
				if (this.options.disableScroll) {
					this.$html.classList.add('overflow-hidden')
				}
			}, 10)

			setTimeout(() => {
				this.isAnimated = false
				this.$activeModals = document.querySelectorAll('.modal.is-open')
				this.options.onOpen($modal)
			}, this.options.transition)
		}
	}
	close(id) {
		if (!this.isAnimated) {
			const $modal = document.querySelector('#' + id)

			this.isAnimated = true
			$modal.classList.remove('is-open')

			if (this.options.disableScroll && this.$activeModals.length === 1) {
				this.$html.classList.remove('overflow-hidden')
			}

			setTimeout(() => {
				$modal.setAttribute('aria-hidden', true)
				this.isAnimated = false
				this.$activeModals = document.querySelectorAll('.modal.is-open')
				this.options.onClose($modal)
			}, this.options.transition)
		}
	}
	closeAll() {
		this.$activeModals.forEach($item => {
			this.isAnimated = false
			this.close($item.id)
			this.$html.classList.remove('overflow-hidden')
		})
	}
}
