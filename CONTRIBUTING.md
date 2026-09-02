# Contribuer

## Convention de commit

Ce projet suit [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>[scope optionnel]: <description>

[corps optionnel]

[footer(s) optionnel(s)]
```

### Types

- `feat` — nouvelle fonctionnalité
- `fix` — correction de bug
- `docs` — documentation uniquement
- `style` — formatage, sans changement de logique
- `refactor` — changement de code sans ajout de fonctionnalité ni correction de bug
- `perf` — amélioration de performance
- `test` — ajout ou correction de tests
- `chore` — maintenance (dépendances, configuration, outillage)
- `ci` — intégration continue

### Exemples

```
feat(frontend): ajouter le client API pour le backend
fix(backend): corriger la validation du mot de passe à l'inscription
docs: mettre à jour le README avec les instructions d'installation
chore: mettre à jour les dépendances
```

Un `BREAKING CHANGE:` dans le footer, ou un `!` après le type/scope (`feat!:`), signale un changement incompatible.
