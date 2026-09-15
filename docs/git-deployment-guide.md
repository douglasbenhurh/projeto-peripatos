# 🚀 Git Deploy - Comandos Rápidos

---

## 🎯 Primeiro Deploy

```powershell
cd C:\Users\dougl\Documents\WorkspaceDev\projeto-peripatos

git config --global user.email "douglasbenhurh@gmail.com"
git config --global user.name "Douglas Benhur"

git add .
git commit -m "feat: MVP Inicial do Projeto Peripatos"
git branch -M main
git remote add origin https://github.com/douglasbenhurh/projeto-peripatos.git
git push -u origin main
```

---

## 🔄 Atualizações

```powershell
cd C:\Users\dougl\Documents\WorkspaceDev\projeto-peripatos

git add .
git commit -m "feat: descrição da mudança"
git push
```

### Exemplos de Mensagens de Commit

```powershell
git commit -m "feat: Nova funcionalidade"
git commit -m "fix: Correção de bug"
git commit -m "docs: Atualização de documentação"
git commit -m "chore: Manutenção geral"
git commit -m "refactor: Refatoração de código"
git commit -m "style: Ajustes de formatação"
git commit -m "test: Adição de testes"
```

---

## 🌿 Trabalhar com Feature Branches

```powershell
# Criar nova branch
git checkout -b feature/nome-da-feature

# Fazer alterações...
git add .
git commit -m "feat: descrição"
git push -u origin feature/nome-da-feature

# Merge na main (após aprovação)
git checkout main
git pull origin main
git merge feature/nome-da-feature
git push

# Deletar branch
git branch -d feature/nome-da-feature
git push origin --delete feature/nome-da-feature
```

---

## 🛠️ Comandos Úteis

```powershell
# Ver status
git status

# Ver histórico
git log --oneline

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Remover arquivo do stage
git reset HEAD arquivo.js
```

---

## 🔧 Troubleshooting

### Erro: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/douglasbenhurh/projeto-peripatos.git
```

### Erro: "Updates were rejected"
```powershell
git pull origin main
git push
```

### Commitou .env por engano
```powershell
git rm --cached .env
git commit -m "chore: Remove .env do controle de versão"
git push
# IMPORTANTE: Trocar TODAS as senhas/keys!
```

---

**Projeto Peripatos** • *Nov 2025*

