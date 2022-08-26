class SimpleModal {
	constructor(options) {
		const defaultOptions = {
			onOpen: () => {},
			onClose: () => {},
			disableScroll: true,
			transition: 300,
		}
		this.options = Object.assign(defaultOptions, options)
		this.$html = document.querySelector('html')
		this.$modals = document.querySelectorAll('.modal')
		this.transition = 300
		this.isAnimated = false
	}
	init() {
		if (this.$modals.length > 0) {
			document.body.addEventListener('click', e => {
				const openTrigger = e.target.closest('[data-modal-open]')
				const closeTrigger = e.target.closest('[data-modal-close]')
				const $modal = e.target.closest('.modal')
				const isOverlay = $modal && !e.target.closest('.modal__inner')

				if (openTrigger) {
					e.preventDefault()

					const modalId = openTrigger.dataset.modalOpen
					this.openModal(modalId)

				} else if (closeTrigger) {
					e.preventDefault()

					const modalId = closeTrigger.dataset.modalClose || $modal.id
					this.closeModal(modalId)

				} else if (isOverlay) {
					this.closeModal($modal.id)
				}
			})
		}
	}
	openModal(id) {
		if (!this.isAnimated) {
			const $modal = document.querySelector('#' + id)

			$modal.setAttribute('aria-hidden', false)
			this.isAnimated = true

			setTimeout(() => {
				$modal.classList.add('is-open')
				if (this.options.disableScroll) {
					this.$html.classList.add('overflow-hidden')
				}
			}, 0)

			setTimeout(() => {
				this.isAnimated = false
			}, this.transition)

			this.options.onOpen(this)
		}
	}
	closeModal(id) {
		if (!this.isAnimated) {
			const $modal = document.querySelector('#' + id)
			this.isAnimated = true

			$modal.classList.remove('is-open')
			if (this.options.disableScroll) {
				this.$html.classList.remove('overflow-hidden')
			}

			setTimeout(() => {
				$modal.setAttribute('aria-hidden', true)
				this.isAnimated = false
			}, this.transition)

			this.options.onClose(this)
		}
	}
}
