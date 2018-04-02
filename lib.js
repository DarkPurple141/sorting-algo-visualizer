
function delay(ms) {
   return new Promise(res => setTimeout(res, ms))
}

function randInt(max) {
   return Math.floor(Math.random()*max)
}

function dekebab(name) {
	let final = name.split('-')[0]
	let first = final.charAt(0).toUpperCase()
	return first + final.substring(1)
}

function removeActiveClass(parent, className) {
	for (let i of parent.children) {
		if (i.classList.contains(className))
			i.classList.toggle(className)
	}
}

function changeActiveClass(element) {
	removeActiveClass(element.parentElement, 'active')
	if (!element.classList.contains('active'))
			element.classList.toggle('active')
}

function toggleSorted(el) {
   el.style.removeProperty('background-color')
   el.classList.toggle('sorted')
}

function toggleSelected(el) {
   el.style.color = 'yellow'
	el.classList.toggle('selected')
}

function getRandomColor(index) {
  let letters = '0123456789ABCDEF';
  let color = '#8855';
  for (let i = 0; i < 2; i++) {
    color += letters.charAt(index );
  }
  return color;
}

function *insertionSort() {
   let array = config._values
   let count = 0
   for (let i = 1; i < array.length; i++) {
      for (let j = i; j > 0; j--) {
          if (array[j-1].val <= array[j].val) {
             break
          }
          swap(array[j], array[j-1])
          yield count++
      }
   }
}
