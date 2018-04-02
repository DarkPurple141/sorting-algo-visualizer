'use strict';

const MAX_HEIGHT = 300
const NUM_ELEMENTS = 16

const config = {

	_sort : false,
	_values: [],
	_visual: null,

	init: function() {
		this._values = []
		this._sort   = "Bucket"
		this._visual = document.getElementById('visual')
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
	item.el.style.height = (MAX_HEIGHT - (MAX_HEIGHT/NUM_ELEMENTS)*(NUM_ELEMENTS-newValue))+"px"
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
		config._sort = dekebab(current)
		setPageTitle(config.active)
		setPageDescription(config.active)
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
	const visual = config.canvas

	let index = randInt(NUM_ELEMENTS)
	let index2 = randInt(NUM_ELEMENTS)

	let el1 = config._values[index]
	let el2 = config._values[index2]

	swap(el1, el2)

}

function resetCanvas() {
	for (let item of config._values) {
		let value = randInt(NUM_ELEMENTS) + 1
		updateElementState(item, value)
	}
}

function setupColumns() {
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
	let ids = ['bucket-link', 'merge-link', 'insertion-link']

	for (let type of ids) {
		let element = document.getElementById(type)
		element.addEventListener('click', setupSort(type))
	}

	let run = document.getElementById('run')
	run.addEventListener('click', runAlgo)
	let reset = document.getElementById('reset')
	reset.addEventListener('click', resetCanvas)

	setupColumns()
	console.log("All Done.")
}


window.addEventListener('load', setupDOM)
