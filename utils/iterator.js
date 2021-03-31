// function createIterator(array) {
//     let nextIndex = 0;
//     return {
//         next: () => {
//             return nextIndex < array.length ?
//                 { value: array[nextIndex++], done: false }
//                 : { done: true };
//         }
//     };
// }

function* createIteratorWithFilter(array, predicate) {
    for (const elem of array) {
        if (predicate(elem)) {
            yield elem;
        }
    }
}

module.exports = createIteratorWithFilter;