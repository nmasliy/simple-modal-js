# Simple vanilla JavaScript modal/popup plugin

## Install

Download library files and add them to your project.

Link JS before end of body tag:

<pre><code><script src="path/simple-modal.js"></script></code></pre>

Link CSS in the head tag(optional):

<pre><code><link rel="stylesheet" href="path/simple-modal.css"></code></pre>

### Usage

**Add markup**

Modal must have id

    <div class="modal" id="modal-default" aria-hidden="true">
    	<div class="modal__wrapper">
    		<div class="modal__inner">
    			<div class="modal__content">
    				<h1>Modal window</h1>
    				<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt ipsum beatae laboriosam id natus! Similique dignissimos veritatis ducimu hic! Delectus, mollitia obcaecati dolor dolorum tempora nemo iusto id amet provident.</p>
    				<button data-modal-close>Close</button>
    			</div>
    		</div>
    	</div>
    </div>

**Add data attribute with id to your modal open trigger**

<pre>data-modal-open="modal-default"</pre>

**Add data attribute to your modal close trigger**<pre>data-modal-close</pre>
In this case it close current modal where there close trigger is, we also can pass a modal id value the same way as we do in data-modal-open
For example:

<pre>data-modal-close="modal-default"</pre>

**Init plugin in your JavaScript code**

Base init example:
```js
const modals = new SimpleModal();
modals.init();
```
Init with all options example:
```js
const options = {
	onOpen: modal => { console.log('on open: ', modal) },
	onClose: modal => { console.log('on close', modal) },
	disableScroll: true,
	transition: 250,
	nested: false,
	overlayCloseAll: true,
}
const modals = new SimpleModal(options);
modals.init();
```

Demo:
https://nmasliy.github.io/simple-modal-js/


