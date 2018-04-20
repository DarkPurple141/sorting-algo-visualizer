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

// HELPERS

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

function toggleMin(el) {
   el.classList.toggle('min')
}

function toggleSelected(el) {
   //el.style.color = 'yellow'
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

/// SORTING BELOW THIS LINE
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
        config.iterate()
        yield updateElement(array[k])
        k++;
    }

    /* Copy the remaining elements of L[], if there
       are any */
    while (i < n1)
    {
        array[k].val = L[i].val;
        updateElement(array[k])

        config.iterate()
        i++;
        k++;
    }

    /* Copy the remaining elements of R[], if there
       are any */
    while (j < n2)
    {
        array[k].val = R[j].val;
        updateElement(array[k])
        config.iterate()
        j++;
        k++;
    }

    yield
}

function *_mergeSort(l, r) {

   yield removeActiveClass(config.canvas, 'selected')
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

function *_partition(lo, hi) {

   const array = config._values
   const pivot = array[hi].val

   toggleMin(array[hi].el)

   let i = lo - 1
   for (let j = lo; j < hi; j++) {
      if (array[j].val <= pivot) {
         i++
         if (i == j) continue
         yield swap(array[i], array[j])
      }
      config.iterate()
   }
   swap(array[i+1], array[hi])
   .then(() => toggleMin(array[hi].el))
   yield i + 1
}

function *_quickSort(lo, hi) {

   if (lo < hi) {
      let part = _partition(lo, hi)
      let mid
      for (let item of part) {
         mid = item
         yield item
      }
      yield* _quickSort(lo, mid - 1)
      yield* _quickSort(mid + 1, hi)
   }
}

const algos = {

   info: {
      "Insertion": {
         description: "Insertion sort is an adaptive algorithm that works with two sublists. The lower sublist is always sorted; the algorithm then inserts elements from the upper sublist where they fit in the lower sublist.",
         complexity: "n²"
      },
      "Merge": {
         description: "Merge sort works by first dividing the list into n sublists, each containing one element. Then, by repeatedly merging these sublists in order the algorithm will produce a final sorted list.",
         complexity: "nlog(n)"
      },
      "Bubble": {
         description: "Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list to be sorted, compares each pair of adjacent items and swaps them if they are in the wrong order.",
         complexity: "n²"
      },
      "Selection": {
         description: "The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that occupy the rest of the list.",
         complexity: "n²"
      },
      "Quick": {
         description: "Quicksort uses a pivot (arbitrary, but often the top element of the list) to divide the list into two smaller sub-arrays: elements that are smaller and larger than the pivot. This continues recursively until the list is sorted.",
         complexity: "nlog(n)"
      }
   },

   bubbleSort: function *() {
      const array = config._values

      for (let i = 0; i < array.length; i++) {
         for (let j = 1; j < array.length - i; j++) {
             if (array[j-1].val > array[j].val) {
                 yield swap(array[j], array[j-1])
             }
             yield config.iterate()
         }
         yield toggleSorted(array[array.length - i - 1].el)
      }
   },

   /*
      nonrecursive cos generators are not fun in this way
   */
   mergeSort: function *() {
      const manager = _mergeSort(0, config._values.length -1)
      for (let step of manager) {
         yield step
      }

      for (let i = 0; i < config._values.length; i++) {
         toggleSorted(config._values[i].el)
      }
      yield
   },

   quickSort: function *() {
      const manager = _quickSort(0, config._values.length -1)
      for (let step of manager) {
         yield step
      }

      for (let i = 0; i < config._values.length; i++) {
         toggleSorted(config._values[i].el)
      }
      yield
   },

   selectionSort: function *() {
      const array = config._values

      for (let i = 0; i < array.length; i++) {
         let min = i
         yield toggleMin(array[min].el)
         for (let j = i + 1; j < array.length; j++) {
             toggleSelected(array[j].el)
             if (array[j].val < array[min].val) {
                yield toggleMin(array[min].el)
                min = j
                // toggle old min
                toggleMin(array[j].el)
             }
             yield config.iterate()
             toggleSelected(array[j].el)
         }

         toggleMin(array[min].el)
         yield swap(array[i], array[min])
         .then(() => removeActiveClass(config.canvas, 'selected'))
         .then(() => toggleSorted(array[i].el))

      }
      yield
   },

   insertionSort: function *() {
      let array = config._values
      for (let i = 1; i < array.length; i++) {
         for (let j = i; j > 0; j--) {
             if (array[j-1].val <= array[j].val) {
                break
             }
             yield config.iterate()
             yield swap(array[j], array[j-1])
         }
      }

      /* technically redundant but more to show when sorted */
      for (let i = 0; i < array.length; i++) {
         toggleSorted(array[i].el)
      }
      // one final pause.
      yield
   }
}
