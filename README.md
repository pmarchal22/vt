Ce dépot permet de scrapper le widget de l'URSSAF (ou plus exactement son "API" cachée) donnant les taux de versement transport par commune :
https://www.urssaf.fr/portail/home/taux-et-baremes/versement-transport.html

L'URSSAF met à disposition la table des taux à l'adresse : https://fichierdirect.declaration.urssaf.fr/TablesReference.htm

...MAIS : 
- l'historique n'y est pas
- les taux additionnels y étaient au moins jusqu'à début 2017, tous à 0, ce qui rend les données erronées. 
- au 1er juillet 2018, les taux de cette table ne sont pas à jour (changements du 1er juillet 2018)

L'URSSAF a été auparavant contactée plusieurs fois à ce sujet par plusieurs moyens différents, sans réponse.

Ce travail a été fait suite à plusieurs remarques des utilisateurs du simulateur de coût d'embauche, signalant le caractère osbolète des taux de versement transport d'OpenFisca. 


Utilisation
----------------

Mettre à jour le fichier des communes laposte, disponible en open data sur data.gouv.fr :  `laposte_hexasmal.csv.

`collect.js` se base sur ce fichier pour produire `resultats.json`. **Attention**, choisissez un bridage des requêtes important (dans le code actuel, `rateLimit(1 REQUÊTE, PAR 300 MILLISECONDES)`) pour ne pas surcharger l'API.

`transformToJson` produit le fichier `final.json`.
