const arrThemeColor = [
    'base',
    'primary',
    'secondary',
    'accent-cool',
    'accent-warm',
  ];
  
  const arrThemeVariants = [
    '-lightest',
    '-lighter',
    '-light',
    '',
    '-dark',
    '-darker',
    '-darkest',
  ];
  
  const ThemeColorList = [];
  
  arrThemeColor.forEach(family => {
    arrThemeVariants.forEach(item => {
      const paletteItem = family + item;
      ThemeColorList.push(paletteItem);
    });
  });
  
  export default ThemeColorList;