let fs = require('fs');

let csvHeader =
["code postal","code INSEE","nom commune (Poste)","nom commune (ACOSS)", "AOT","taux","SMT","taux additionnel"]

let suffixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
let list = suffixes.map(s => fs.readFileSync('resultats/splita' + s + '.json', 'utf8')).map(s => JSON.parse(s)).reduce((acc, n) => acc.concat(n), [])

let codes = fs.readFileSync('laposte_hexasmal.csv', 'utf8').split('\n')

let fromFrenchNumber = string => string.replace(',', '.')
let removeCommas = string => string && string.replace(/,/g, " - ")

let res = [csvHeader, ...codes.map(string => {
	let split = string.split(';'),
		codeCommuneLaposte = split[0],
		nomLaposte = split[1],
		codePostal = split[2],
		found = list.find(({codeCommune}) => codeCommuneLaposte === codeCommune)
		if (!found)
			return [codePostal, codeCommuneLaposte, removeCommas(nomLaposte), '', '', '', '', ''].join(',')

		let {
			codeCommune, libelleCommune,
			tauxEnCours, tauxAdditionnelEnCours,
			beneficiaireCourant, beneficiaireTauxAdditionnelCourant
		} = found
		let
			taux = tauxEnCours ? fromFrenchNumber(tauxEnCours.taux) : '',
			tauxAdditionnel = tauxAdditionnelEnCours ? fromFrenchNumber(tauxAdditionnelEnCours.taux) : ''

		return [codePostal, codeCommune, removeCommas(nomLaposte), removeCommas(libelleCommune), removeCommas(beneficiaireCourant), taux, removeCommas(beneficiaireTauxAdditionnelCourant), tauxAdditionnel].join(',')
})].join('\n')
console.log(res)
