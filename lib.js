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

function *_partition() {

}

function *_quickSort() {
   /*
   algorithm quicksort(A, lo, hi) is
    if lo < hi then
        p := partition(A, lo, hi)
        quicksort(A, lo, p - 1 )
        quicksort(A, p + 1, hi)

algorithm partition(A, lo, hi) is
    pivot := A[hi]
    i := lo - 1
    for j := lo to hi - 1 do
        if A[j] < pivot then
            i := i + 1
            swap A[i] with A[j]
    swap A[i + 1] with A[hi]
    return i + 1
    */
}

const algos = {

   info: {
      "Insertion": {
         description: "Insertion sort iterates, consuming one input element each repetition,\
         and growing a sorted output list. At each iteration, insertion sort removes one element from the input data,\
         finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain."
      },
      "Merge": {
         description: "Merge sort works by first dividing the unsorted list into n sublists, each containing one element. Then, repeatedly merge sublists to produce new sorted sublists until there is only 1 sublist remaining. This will be the sorted list."
      },
      "Bubble": {
         description: "Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list to be sorted, compares each pair of adjacent items and swaps them if they are in the wrong order."
      },
      "Selection": {
         description: "The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right."
      },
      "Quick": {
         description: "Quicksort is a divide and conquer algorithm. Quicksort first divides a large array into two smaller sub-arrays: the low elements and the high elements. Quicksort then recursively sorts the sub-arrays."}
   },

   bubbleSort: function *() {
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
   },

   /*
      nonrecursive cos generators are not fun in this way
   */
   mergeSort: function *() {
      const manager = _mergeSort(0, config._values.length - 1)
      for (let step of manager) {
         yield step
      }

      for (let i = 0; i < config._values.length; i++) {
         toggleSorted(config._values[i].el)
      }
      yield 1
   },

   quickSort: function *() {
      // TODO
   },

   selectionSort: function *() {

   },

   insertionSort: function *() {
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
}
