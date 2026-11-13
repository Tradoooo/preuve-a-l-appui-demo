# preuve-a-l-appui-demo

Le dépôt des **tests réels** cités par les preuves de la démonstration
[Fait, preuve à l'appui](https://github.com/Tradoooo/preuve-a-l-appui)
(app Atlassian Forge pour Jira).

## Pourquoi ce dépôt existe

Dans la démonstration, une preuve de type `test` n'est validée par l'app que si
elle est portée par un **résumé de CI signé**, et cette preuve porte le **nom du
test** (par exemple `refusal email is sent only once`). Un nom de test inventé
pour la démonstration ne se vérifie pas : un jury ne peut ni ouvrir le dépôt, ni
trouver le test, ni le voir passer.

Ce dépôt ferme ce trou. Chaque nom de test cité par un ticket de démonstration
existe ici, dans un fichier, sur une branche nommée comme dans le catalogue, à
un commit dont l'app enregistre l'empreinte. `npm test` tourne sans
installation : le runner est `node:test` (Node ≥ 18), zéro dépendance.

```
git clone https://github.com/Tradoooo/preuve-a-l-appui-demo.git
cd preuve-a-l-appui-demo

git checkout ab843b19f2edbac2f01a4bd2736052fd28f362eb   # « tous les tests présents »
npm test                                                # 15 tests, tous verts

git checkout main                                       # l'état rejoué par la démo
npm test                                                # 14 tests verts : celui de PRF-7 a disparu
```

## La table : chaque test et le ticket qui le cite

Le catalogue des tickets vit dans
`tools/demo-scenarios/prf-*.mjs` du dépôt de l'app ; son champ `tests` donne les
noms cités par les preuves. La table ci-dessous est l'inverse : du nom du test
vers le ticket.

| Nom du test (exact) | Ticket | Branche | Fichier |
| --- | --- | --- | --- |
| `checkout refuses an expired card` | PRF-1 (vedette du site) | `feature/PRF-1-refusal-email` | `tests/prf-1-refusal-email.test.mjs` |
| `checkout logs the refusal reason` | PRF-1 (vedette du site) | `feature/PRF-1-refusal-email` | `tests/prf-1-refusal-email.test.mjs` |
| `refusal email reaches the customer` | PRF-2 | `feature/PRF-2-refusal-email` | `tests/prf-2-refusal-email.test.mjs` |
| `refusal email is sent only once` | PRF-2 | `feature/PRF-2-refusal-email` | `tests/prf-2-refusal-email.test.mjs` |
| `administrator sets the refusal threshold` | PRF-3 | `feature/PRF-3-configurable-threshold` | `tests/prf-3-threshold.test.mjs` |
| `every refusal writes an audit line` | PRF-4 | `feature/PRF-4-audit-log` | `tests/prf-4-audit-log.test.mjs` |
| `audit line holds no card number` | PRF-4 | `feature/PRF-4-audit-log` | `tests/prf-4-audit-log.test.mjs` |
| `help page lists the refusal reasons` | PRF-5 | `feature/PRF-5-help-page` | `tests/prf-5-help-page.test.mjs` |
| `help page is published in english` | PRF-5 | `feature/PRF-5-help-page` | `tests/prf-5-help-page.test.mjs` |
| `card number is never persisted` | PRF-6 | `feature/PRF-6-no-card-storage` | `tests/prf-6-no-card-storage.test.mjs` |
| `stored payment holds only the last four digits` | PRF-6 | `feature/PRF-6-no-card-storage` | `tests/prf-6-no-card-storage.test.mjs` |
| `refusal answers in under 200 ms at p95` | PRF-7 | `feature/PRF-7-refusal-latency` | `tests/prf-7-refusal-latency.test.mjs` |
| `refusal form exposes accessible labels` | PRF-8 | `feature/PRF-8-accessible-refusal-form` | `tests/prf-8-accessible-form.test.mjs` |
| `refusal form renders on small screens` | PRF-8 | `feature/PRF-8-accessible-refusal-form` | `tests/prf-8-accessible-form.test.mjs` |
| `request body is never logged on refusal` | PRF-9 | `feature/PRF-9-no-request-body-logs` | `tests/prf-9-no-request-body-logs.test.mjs` |

Deux remarques :

- PRF-5 est un ticket de **documentation** : ses preuves sont une page et un
  lien, pas un test. Ses deux tests vérifient le contenu de la page publiée
  (`docs/aide-refus.md`, `docs/help-page.en.md`) ; ils ne sont pas cités par le
  catalogue comme preuves de type `test`.
- Chaque branche de ticket a un alias court `feature/PRF-<n>` qui pointe sur le
  **même commit** que la branche longue (`feature/PRF-2` = `feature/PRF-2-refusal-email`).

## Les deux états de `main`

`main` porte les deux états que la démonstration rejoue, dans cet ordre :

1. **tous les tests présents** — les quinze tests sont là et `npm test` passe ;
   c'est l'état qui installe la *preuve vivante* des critères livrés ;
2. **un test a disparu** — `tests/prf-7-refusal-latency.test.mjs` est retiré de
   la branche principale. Le test de latence de **PRF-7** n'est plus cité par le
   pipeline sur `main` : la preuve vivante du critère livré tombe, l'app le
   signale sur le ticket et l'opérateur le rouvre.

Les deux empreintes réelles de ces commits sont la seule source de la
démonstration : `tools/demo-scenarios/repo.mjs`, dans le dépôt de l'app
(`DEMO_MAIN_COMMITS.complete`, `DEMO_MAIN_COMMITS.regressed`).

- `complete` = `ab843b19f2edbac2f01a4bd2736052fd28f362eb` : `npm test` → 15 / 15 ;
- `regressed` = `cb1add2f3045f3abe50a783a13f187f845d02311` : `npm test` → 14 / 14,
  et `tests/prf-7-refusal-latency.test.mjs` n'existe plus.

`main` a depuis des commits de **documentation** (celui-ci compris) : ils ne
touchent à aucune suite de tests, donc les deux empreintes ci-dessus restent
valables quel que soit le sommet de `main`. Pour les retrouver :

```bash
git log --oneline main
git show --stat cb1add2f3045f3abe50a783a13f187f845d02311   # le test retire
```

## Vérifier une preuve, en cinq commandes

Une preuve de type `test` affichée par l'app porte : le dépôt, la branche, le
commit et le nom du test. Pour la vérifier :

```bash
# 1. le dépôt et le commit de la preuve existent-ils ?
git clone https://github.com/Tradoooo/preuve-a-l-appui-demo.git
cd preuve-a-l-appui-demo
git cat-file -t <commit-de-la-preuve>          # répond : commit

# 2. sur quelle branche vit ce commit ?
git branch -r --contains <commit-de-la-preuve>
#   origin/feature/PRF-2
#   origin/feature/PRF-2-refusal-email

# 3. le nom cité par la preuve est-il écrit dans ce commit ?
git show <commit-de-la-preuve>:tests/prf-2-refusal-email.test.mjs \
  | grep -F 'refusal email is sent only once'

# 4. le test passe-t-il réellement à ce commit ?
git checkout <commit-de-la-preuve>
npm test

# 5. la preuve vivante tient-elle encore sur main ?
git ls-tree -r main --name-only tests/ | grep -c 'prf-7'
#   0 → le test de latence de PRF-7 a disparu de la branche principale
```

Exemple complet avec PRF-2 (remplacez `<sha>` par l'empreinte affichée par
l'app, celle de `DEMO_COMMITS['PRF-2']`) :

```bash
git checkout <sha>
npm test 2>&1 | grep -F 'refusal email is sent only once'
# ✔ refusal email is sent only once (0.276276ms)
```

## Ce que contiennent les tests

Le domaine testé est un mini-tunnel de paiement volontairement petit
(`src/checkout.mjs`, `src/form.mjs`, `src/help-page.mjs`) : décision de refus
(carte expirée, limite), e-mail de refus et son unique envoi, limite réglable,
journal de refus sans numéro de carte, stockage de moyen de paiement réduit aux
quatre derniers chiffres, latence du refus au p95, formulaire de refus
accessible, page d'aide bilingue et traces techniques sans corps de requête.

Chaque règle vérifiée correspond à un critère d'acceptation du ticket qui cite
le test : c'est ce qui rend la preuve significative, et pas seulement existante.
