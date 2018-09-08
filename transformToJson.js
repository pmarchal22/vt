let fs = require("fs");

let list = JSON.parse(fs.readFileSync("resultats.json", "utf8"));

let codes = fs.readFileSync("laposte_hexasmal.csv", "utf8").split("\n");
codes.pop();

let fromFrenchNumber = string => string.replace(",", ".");
let replaceCommas = string => string && string.replace(/,/g, " - ");
let transformDate = string =>
  string
    .split("/")
    .reverse()
    .join("-");
let acc = {};
codes.map((string, index) => {
  console.log((index / codes.length) * 100);
  let split = string.split(";"),
    codeCommuneLaposte = split[0],
    nomLaposte = split[1],
    codePostal = split[2],
    found = list.find(({ codeCommune }) => codeCommuneLaposte === codeCommune);

  if (!found) {
    // Include some info anyway
    // acc[codeCommuneLaposte] = {
    // 		nomLaposte,
    // 		codePostal
    // }
    return;
  }

  let {
    codeCommune,
    libelleCommune,
    tauxEnCours,
    tauxAdditionnelEnCours,
    beneficiaireCourant,
    beneficiaireTauxAdditionnelCourant,
    historique,
    tauxAdditionnelHistorique
  } = found;

  let tauxAdditionnel = {};
  if (
    tauxAdditionnelHistorique &&
    tauxAdditionnelHistorique.find(etat => etat.taux != 0)
  ) {
    tauxAdditionnelHistorique.forEach(
      etat =>
        (tauxAdditionnel[transformDate(etat.debut)] = fromFrenchNumber(
          etat.taux
        ))
    );
  }
  if (typeof tauxAdditionnelEnCours === "object") {
    tauxAdditionnel[
      transformDate(tauxAdditionnelEnCours.debut)
    ] = fromFrenchNumber(tauxAdditionnelEnCours.taux);
  }

  let taux = {};
  if (historique && historique.find(etat => etat.taux != 0)) {
    historique.forEach(
      etat => (taux[transformDate(etat.debut)] = fromFrenchNumber(etat.taux))
    );
  }
  if (typeof tauxEnCours === "object") {
    taux[transformDate(tauxEnCours.debut)] = fromFrenchNumber(tauxEnCours.taux);
  }

  acc[codeCommune] = {
    codePostal,
    nomLaposte,
    nomAcoss: libelleCommune
  };
  if (Object.keys(taux).length)
    acc[codeCommune].aot = {
      nom: beneficiaireCourant,
      taux
    };
  if (Object.keys(tauxAdditionnel).length)
    acc[codeCommune].smt = {
      nom: beneficiaireTauxAdditionnelCourant,
      taux: tauxAdditionnel
    };
});

fs.writeFileSync("./final.json", JSON.stringify(acc));
