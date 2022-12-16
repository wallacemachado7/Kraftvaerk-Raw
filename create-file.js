const args = process.argv.slice(2);
const htmlDefault = `
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Language" content="pt-br">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="icon" type="image/png" href="./favicon.png">
    <link rel="stylesheet" href="./css/main/main.css">
    <link rel="stylesheet" href="./css/pages/${args[0]}.css">

    <title>${args[0]}</title>
</head>

<body>

    <!-- JS da Pagina -->
    <script src="./js/main.js"></script>
    <script src="./js/pages/${args[0]}.js"></script>
</body>

</html>
`;

const fs = require('fs');
fs.writeFile(`./${args[0]}.html`, htmlDefault, function (err) {
  if (err) {
    return console.log(err);
  }
});
fs.writeFile(
  `./scss/pages/${args[0]}.scss`,
  `@import '../main/variables';
  @import '../main/mixins';`,
  function (err) {
    if (err) {
      return console.log(err);
    }
  }
);
fs.writeFile(`./js/pages/${args[0]}.js`, '"use strict";', function (err) {
  if (err) {
    return console.log(err);
  }
});

console.log('Arquivos criados');
