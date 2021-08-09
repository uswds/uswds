/**
 * We allow for an array of values to be returned for class selector
 * string managaement. The array can include;
 * [ null, undefind, emptry string, string]
 *
 * @param {Array} variantClassArray
 * @param {String} baseClassList
 * @returns {String}
 */
export const handleClasses = (variantClassArray:Array<any>, baseClassList:String) => {
  const ClassList = variantClassArray.some(
    c => c !== null && c !== undefined && c !== ''
  )
    ? [
        baseClassList,
        variantClassArray
          .filter(c => c !== null && c !== undefined && c !== '')
          .join(' '),
      ].join(' ')
    : baseClassList || null

  return ClassList
}
