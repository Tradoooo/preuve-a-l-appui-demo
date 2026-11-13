# Aide : votre paiement a été refusé

Page publique d'aide du tunnel de paiement. Elle est citée par le ticket de
démonstration **PRF-5** (« Publier la page d'aide sur le refus ») comme preuve de
type `documentation` ; le test qui vérifie son contenu est
`tests/prf-5-help-page.test.mjs` (`help page lists the refusal reasons`).

## Les motifs de refus

| Motif (code) | Ce que ça veut dire | Ce qu'il faut faire |
| --- | --- | --- |
| `card_expired` | La carte est arrivée à la fin de sa période de validité. | Mettre à jour la date d'expiration ou utiliser une autre carte. |
| `limit_exceeded` | Le montant dépasse la limite de refus fixée pour le compte. | Baisser le montant ou payer en plusieurs fois. |
| `suspected_fraud` | La banque émettrice a demandé une confirmation supplémentaire. | Confirmer l'identité auprès de la banque émettrice. |

## La marche à suivre

1. Mettez à jour les informations de votre carte.
2. Réessayez avec un autre moyen de paiement.
3. Contactez le support en citant le motif du refus.

## Le délai

Le remboursement, le cas échéant, arrive sous 5 jours ouvrés.

## Ce que la page ne dit jamais

Le numéro de carte, même partiellement, et le corps de la requête refusée : ces
données ne sont ni stockées ni journalisées (voir les tickets **PRF-6** et
**PRF-9**).
