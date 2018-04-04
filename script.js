'use strict';

/*
MIT License

Copyright (c) 2018 Alex Hinds

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

let MAX_HEIGHT = 260
const NUM_ELEMENTS = 16

const config = {

	_sort : null,
	_values: [],
	_visual: null,
	_generator: null,
	_generators: {
		'Insertion': algos.insertionSort,
		'Bubble'   : algos.bubbleSort,
		'Selection': algos.selectionSort,
		'Merge'    : algos.mergeSort,
		'Quick'    : algos.quickSort
	},

	_informaton : algos.info,

	init: function() {
		this._values = []
		this._visual = document.getElementById('visual')
		this.setAlgo()
	},

	setAlgo: function() {
		this._generator = this._generators[this._sort]()
	},

	step: function() {
		this._generator.next()
	},

	get canvas() {
		return this._visual
	},

	get active() {
		return this._sort
	},

	get Text() {
		return this._informaton[this._sort].description
	}
}

function resetColor(...args) {
	for (let el of args) {
		el.style.color = '#fff'
	}
}

function updateElementState(item, newValue) {
	item.val = newValue
	item.el.innerHTML = newValue
	item.el.style.height = (MAX_HEIGHT - (MAX_HEIGHT/NUM_ELEMENTS)*(NUM_ELEMENTS-newValue)) + 5+"px"
}

function swap(itemA, itemB) {
	removeActiveClass(config.canvas, 'selected')

	let temp = itemA.val
	toggleSelected(itemA.el)
	toggleSelected(itemB.el)

	delay(800)
	.then(() => {
		updateElementState(itemA, itemB.val)
		updateElementState(itemB, temp)
		return delay(500)
	})
	.then(() => resetColor(itemA.el, itemB.el))
}

function updateElement(itemA) {
	delay(200)
	.then(() => {
		updateElementState(itemA, itemA.val)
	})
}

function setupSort(name) {
	return function() {
		let current = dekebab(name)
		if (current == config.active)
			return

		// else
		config._sort = current
		setPageTitle(config.active)
		setPageDescription(config.active)

		config.setAlgo()
	}
}

/*
 *	@params {stuff}
 */
function setPageTitle(name) {
	let el = document.getElementById('title')
	el.innerHTML = name + " Sort"
}

function setPageDescription(name) {
	let el = document.getElementById('description')
	el.innerHTML = config.Text
}

function runAlgo() {
	if (config._generator)
		config.step()
}

function animateAlgo() {
	if (!config._generator.next().done) {
		setTimeout(animateAlgo, 800)
	} else {
		removeActiveClass(config.canvas, 'selected')
	}

}

function resetCanvas() {
	let count = 1

	removeActiveClass(config.canvas, 'sorted')
	config.setAlgo()
	for (let item of config._values) {
		let value = randInt(NUM_ELEMENTS) + 1
		item.el.style['background-color'] = getRandomColor((count++)-1)
		updateElementState(item, value)
	}
}

function setupColumns() {
	setupSort('Insertion')()
	config.init()
	const visual = config.canvas
	for (let i = 1; i <= NUM_ELEMENTS; i++) {
		let element = document.createElement('div')

		let value = randInt(NUM_ELEMENTS) + 1

		visual.appendChild(element)
		element.style['background-color'] = getRandomColor(i-1)
		let item = { val: value, el: element }
		updateElementState(item, value)
		config._values.push(item)

		delay(i*100)
		.then(() => element.classList.toggle('loaded'))
	}
}

function setupDOM() {
	console.log("Beginning setup...")
	let ids = ['selection-link',
				  'merge-link',
				  'insertion-link',
				  'bubble-link',
				  'quick-link'
			  ]

	for (let type of ids) {
		let element = document.getElementById(type)
		element.addEventListener('click', setupSort(type))
	}

	let run = document.getElementById('run')
	run.addEventListener('click', runAlgo)
	let reset = document.getElementById('reset')
	reset.addEventListener('click', resetCanvas)
	let animate = document.getElementById('animate')
	animate.addEventListener('click', animateAlgo)

	setupColumns()
	console.log("All Done.")
}


window.addEventListener('load', setupDOM)
