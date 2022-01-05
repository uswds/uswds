import theme from "../../data/theme-vars.json";
import * as data from "../../data/colors"

// create lists for system and theme colors

// pull the color family props from each color json file
const Blue = data.Blue.props[0];
const BlueCool = data.BlueCool.props[0];
const BlueWarm = data.BlueWarm.props[0];
const Cyan = data.Cyan.props[0];
const Gray = data.Gray.props[0];
const GrayCool = data.GrayCool.props[0];
const GrayWarm = data.GrayWarm.props[0];
const Green = data.Green.props[0];
const GreenCool = data.GreenCool.props[0];
const GreenWarm = data.GreenWarm.props[0];
const Indigo= data.Indigo.props[0];
const IndigoCool = data.IndigoCool.props[0];
const IndigoWarm = data.IndigoWarm.props[0];
const Magenta = data.Magenta.props[0];
const Mint = data.Mint.props[0];
const MintCool = data.MintCool.props[0];
const Orange = data.Orange.props[0];
const OrangeWarm = data.OrangeWarm.props[0];
const Red= data.Red.props[0];
const RedCool = data.RedCool.props[0];
const RedWarm = data.RedWarm.props[0];
const Violet = data.Violet.props[0];
const VioletWarm = data.VioletWarm.props[0];
const Yellow = data.Yellow.props[0];

const arrFamily = [
  Blue,
  BlueCool,
  BlueWarm,
  Cyan, 
  Gray,
  GrayCool,
  GrayWarm,
  Green,
  GreenCool,
  GreenWarm,
  Indigo,
  IndigoCool,
  IndigoWarm,
  Magenta,
  Mint,
  MintCool,
  Orange,
  OrangeWarm,
  Red,
  RedCool,
  RedWarm,
  Violet,
  VioletWarm,
  Yellow,
];

// loop through each color's json file to gather each color value and grade
// then push items to the system color list
export const SystemColorList = {};
arrFamily.forEach(family => {
  for (let sc = 0; sc < family.value.length; sc += 1) {
    // collect color family name
    const colorFamily = family.name;

    // collect color grade for each family item
    const colorValues = family.value[sc];
    const colorGrade = colorValues.name;

    // assign color name (example name format: 'blue-5')
    const tokenName = `${colorFamily}-${colorGrade}`;

    // collect the hex value of the entry
    const hex = colorValues.value;

    // if color is 'vivid' type, loop through its nested values and add items to object list
    if (colorGrade === "vivid") {
      for (let v = 0; v < 10; v += 1) {
        // collect color grade for each vivid family item
        const colorValuesVivid = family.value[sc].value[v];
        const colorGradeVivid = colorValuesVivid.name;

        // assign color name (example token name format: 'blue-5v')
        const tokenNameVivid = `${colorFamily}-${colorGradeVivid}v`;

        // collect the hex value
        const hexVivid = colorValuesVivid.value;

        // if vivid color has an assigned value, add it to the object list
        if (hexVivid !== false ) {
          SystemColorList[tokenNameVivid] =  hexVivid;
        }
      }
    } else if (hex !== false) {
      // if color has an assigned value, print item and hex to object list
      SystemColorList[tokenName] =  hex;
    }
  };
});

// loop through the system tokens json file to gather each color value and grade
// then push items to the theme color list
const ThemeColorPalette = theme.themeColorPalette;
export const ThemeColorList = {};

for (let tc = 0; tc < ThemeColorPalette.length; tc += 1) {
  const color = ThemeColorPalette[tc];
  const colorValue = color.value;
  const colorVarName = color.name;

  if (colorVarName.includes("$theme-color-")) {
    const colorName = color.name.replace('$theme-color-','');

    // Exclude all false and family name values
    if (colorValue !== "false" && !colorName.includes("family")) {
      ThemeColorList[colorName] =  colorValue;  
    }
  }
}
