// https://youmightnotneed.com/lodash/#without
// eslint-disable-next-line
const without = (arr, ...args) => arr.filter(item => !args.includes(item))

function replaceElement(array, element, replacement) {
  const index = array.indexOf(element);
  return array.toSpliced(index, 1, replacement);
}

export { without, replaceElement };
