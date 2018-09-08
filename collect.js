var fs = require("fs");
require("isomorphic-fetch");
yaml = require("js-yaml");
const rateLimit = require("promise-rate-limit");

let lines = fs.readFileSync("laposte_hexasmal.csv", "utf8").split("\n");
lines.shift();
lines.pop();

let codesPostaux = lines.map(l => l.split(";")[2]);

var url =
  "https://www.urssaf.fr/portail/cms/render/live/fr/sites/urssaf/home/taux-et-baremes/versement-transport/middleColumn/versementtransport.calculVTAction.do?typeCode=isCodePostal&code=";

const getget = codePostal => {
  console.log("fetching " + codePostal);
  return fetch(url + codePostal, {
    method: "POST",
    body: {
      typeCode: "isCodePostal",
      code: codePostal
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36"
    }
  }).then(response => response.json());
};

let run = () =>
  Promise.all(codesPostaux.map(rateLimit(1, 300, getget))).then(results => {
    var valid = results
      .filter(r => r.resultat.length > 2)
      .map(r => JSON.parse(r.resultat))
      .reduce((acc, next) => acc.concat(next));

    fs.writeFileSync("./resultats.json", JSON.stringify(valid));
    console.log("c'est fait !");
  });

run();
