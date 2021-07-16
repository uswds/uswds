// TODO: get this util to work
export const handleVariants = (classArray:Array<any>, baseClass:String) => {
  console.log(classArray, baseClass)
  const VariantList = classArray
  const ClassList = VariantList.indexOf(null) === -1 ? baseClass
  : [baseClass, VariantList.filter((v) => v !== null).join(' ')].join(' ')
  return ClassList
}
