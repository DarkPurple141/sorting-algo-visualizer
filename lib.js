
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
