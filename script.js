
const MAX_HEIGHT = 256
const NUM_ELEMENTS = 16

const config = {

	_sort : false,
	_values: [],

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

function dekebab(name) {
	let final = name.split('-')[0]
	let first = final.charAt(0).toUpperCase()
	return first + final.substring(1)
}

function removeActiveClass(parent) {
	for (let i of parent.children) {
		if (i.classList.contains('active'))
			i.classList.toggle('active')
	}
}

function changeActiveClass(element) {
	removeActiveClass(element.parentElement)
	if (!element.classList.contains('active'))
			element.classList.toggle('active')
	
}

function getRandomColor(index) {
  let letters = '0123456789ABCDEF';
  let color = '#8855';
  for (let i = 0; i < 2; i++) {
    color += letters.charAt(index );
  }
  return color;
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
	const visual = document.getElementById('visual')
	let index = Math.floor(Math.random()*NUM_ELEMENTS)
	let index2 = Math.floor(Math.random()*NUM_ELEMENTS)
	
	let el1 = config._values[index].el
	let el2 = config._values[index2].el

	visual.insertBefore(el1,el2)
	console.log(config._values)
}

function setupColumns() {
	const visual = document.getElementById('visual')
	for (let i = 1; i <= NUM_ELEMENTS; i++) {
		let element = document.createElement('div')
		element.innerHTML = i
		visual.appendChild(element)
		element.style['background-color'] = getRandomColor(i-1)
		element.style.height = (MAX_HEIGHT - (MAX_HEIGHT/NUM_ELEMENTS)*(NUM_ELEMENTS-i))+"px"
		config._values.push({ val: i, el: element })
		setTimeout(() => {
		   element.classList.toggle('loaded')
		}, i*100)
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

	//let reset = document.getElementById('reset')
	//reset.addEventListener('click', 

	setupColumns()
	console.log("All Done.")
}


window.addEventListener('load', setupDOM)

