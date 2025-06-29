# ⏱️ PR Merge Timer

**GitHub Action** para calcular o tempo entre a criação e o merge de um Pull Request.  
Se o PR for mergeado antes de um limite de tempo configurável (por padrão 24 horas), a Action verifica se ainda existem reviewers pendentes e adiciona um comentário informando.

---

## ✅ Funcionalidades

- Detecta o tempo total entre a criação e o merge do PR
- Permite definir um limite de tempo via input
- Comenta no PR caso o merge tenha ocorrido antes do tempo limite
- Menciona automaticamente reviewers ainda pendentes (se houver)

---

## 🚀 Exemplo de uso

```yaml
name: PR Merge Feedback

on:
  pull_request:
    types: [closed]

jobs:
  comment-on-fast-merge:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci --prefix .github/actions/comentar-no-pr

      - name: Run PR Merge Timer Action
        uses: Thierrycast/pr-merge-timer@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          tempo_limite_horas: 24
```