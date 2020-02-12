const fs = require("fs");
const componentDir = "./src/components";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s)\S/g, firstLetter => firstLetter.toUpperCase());
}

readline.question("What's the name of your component? ", name => {
  const newComponentDir = `${componentDir}/${name}`;

  if (!fs.existsSync(newComponentDir)) {
    fs.mkdirSync(newComponentDir);
    fs.writeFile(
      `${newComponentDir}/${name}.njk`, '', err => {
        if (err) throw err;
      }
    );
    fs.writeFile(
      `${newComponentDir}/${name}.config.yml`,
      `label: ${titleCase(name)}
status: wip
preview: "@uswds-content"`,
      err => {
        if (err) throw err;
      }
    );
    readline.write('Component has been created, have fun!');
  } else {
    readline.write('This component already exists!');
  }
  readline.close();
});
