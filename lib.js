
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

function toggleClassInRange(parent, className, start, end) {
   for (let i = start; i <= end; i++) {
      parent.children[i].classList.toggle(className)
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

function *bubbleSort() {
   let array = config._values
   let count = 0
   for (let i = 0; i < array.length; i++) {
      for (var j = 1; j < array.length - i; j++) {
          if (array[j-1].val > array[j].val) {
              swap(array[j], array[j-1])
          }
          yield count++
      }
      toggleSorted(array[j-1].el)
   }
}

function *_merge(l, m, r) {
    let i, j, k

    let n1 = m - l + 1;
    let n2 =  r - m;

    removeActiveClass(config.canvas, 'selected')
    yield toggleClassInRange(config.canvas, 'selected', l, r)

    let array = config._values
    const L = []
    const R = []

    // careful with refernces
    for (let i = l; i < m+1; i++) {
      L.push({ val: array[i].val })
    }
    for (let i = m+1; i < r+1; i++) {
      R.push({ val: array[i].val })
    }

    /* Merge the temp arrays back into arr[l..r]*/
    i = 0 // Initial index of first subarray
    j = 0 // Initial index of second subarray
    k = l // Initial index of merged subarray
    while (i < n1 && j < n2)
    {
        if (L[i].val <= R[j].val)
        {
            array[k].val = L[i].val;
            i++;
        }
        else
        {
            array[k].val = R[j].val;
            j++;
        }
        yield updateElement(array[k])
        k++;
    }

    /* Copy the remaining elements of L[], if there
       are any */
    while (i < n1)
    {
        array[k].val = L[i].val;
        yield updateElement(array[k])
        i++;
        k++;
    }

    /* Copy the remaining elements of R[], if there
       are any */
    while (j < n2)
    {
        array[k].val = R[j].val;
        yield updateElement(array[k])
        j++;
        k++;
    }
}

function *_mergeSort(l, r) {

   removeActiveClass(config.canvas, 'selected')
   yield toggleClassInRange(config.canvas, 'selected', l, r)

   if (l < r)
    {
        // Same as (l+r)/2, but avoids overflow for
        // large l and h
        let m = Math.floor((l+r)/2)

        yield* _mergeSort(l, m)
        // Sort first and second halves
        yield* _mergeSort(m+1, r)

        yield* _merge(l, m, r)
    }
}

/*
   nonrecursive cos generators are not fun in this way
*/
function *mergeSort() {
   const manager = _mergeSort(0, config._values.length - 1)
   for (let step of manager) {
      yield step
   }

   for (let i = 0; i < config._values.length; i++) {
      toggleSorted(config._values[i].el)
   }
   yield 1
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

   /* technically redundant but more to show when sorted */
   for (let i = 0; i < array.length; i++) {
      toggleSorted(array[i].el)
   }
   yield count++
}
