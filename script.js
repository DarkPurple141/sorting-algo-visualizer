'use strict';

const MAX_HEIGHT = 280
const NUM_ELEMENTS = 16

const config = {

	_sort : null,
	_values: [],
	_visual: null,
	_generator: null,
	_generators: {
		'Insertion': insertionSort,
		'Bubble'   : bubbleSort,
		'Bucket'   : insertionSort,
		'Merge'    : mergeSort
	},

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
		let text

		switch(this.active) {
			case "Insertion":
				text = "Insertion sort iterates, consuming one input element each repetition,\
		 and growing a sorted output list. At each iteration, insertion sort removes one element from the input data,\
		 finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain."
			break;
			case "Merge":
				text = "Merge sort works by first dividing the unsorted list into n sublists, each containing 1 element.\ Then, repeatedly merge sublists to produce new sorted sublists until there is only 1 sublist remaining. This will be the sorted list."
			break;
			case "Bubble":
				text = "Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list to be sorted, compares each pair of adjacent items and swaps them if they are in the wrong order."
			break;
			case "Bucket":
				text = "Bucket sort, or bin sort, is a sorting algorithm that works by distributing the elements of an array into\
		 a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm, or by \
		 recursively applying the bucket sorting algorithm."
			break;
		}
		return text
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
	let ids = ['bucket-link', 'merge-link', 'insertion-link', 'bubble-link']

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
