# 🚀 Guia de Deploy para Produção (Firebase Hosting)

Este guia descreve o processo para compilar e subir a aplicação **Projeto Peripatos** para o Firebase Hosting.

---

## 📋 Pré-requisitos

1.  **Node.js** instalado.
2.  **Conta Google** com acesso ao projeto no Firebase Console.
3.  **Código atualizado** (certifique-se de que está na branch `main` e com tudo commitado).

---

## 🛠️ Passo 1: Preparar o Build

Antes de enviar para o servidor, precisamos gerar a versão otimizada da aplicação. O Vite cria a pasta `dist` com os arquivos estáticos.

```powershell
# Instalar dependências (caso não tenha feito)
npm install

# Gerar o build de produção
npm run build
```

> **Verificação:** Após esse comando, verifique se a pasta `dist` foi criada na raiz do projeto.

---

## ☁️ Passo 2: Configurar Firebase (Apenas na primeira vez)

Se você nunca fez deploy desta máquina ou se o arquivo `.firebaserc` não existir:

1.  **Login no Firebase:**
    ```powershell
    npx firebase login
    ```
    *Isso abrirá o navegador para você autenticar com sua conta Google.*

2.  **Vincular ao Projeto:**
    ```powershell
    npx firebase use --add
    ```
    *   Selecione o projeto do Firebase correspondente (ex: `projeto-peripatos-xyz`).
    *   Defina um alias (apelido), geralmente usamos `default`.

---

## 🚀 Passo 3: Fazer o Deploy

Com o build pronto e o Firebase conectado, envie os arquivos para a nuvem.

```powershell
npm run deploy
```

> **Nota:** Este comando executa `firebase deploy --only hosting` por baixo dos panos.

Se você também alterou regras de segurança (Firestore/Storage) ou índices, pode rodar o deploy completo:

```powershell
npm run firebase -- deploy
```

---

## ✅ Passo 4: Verificar

Após o comando terminar, o terminal mostrará a **Hosting URL**.
Exemplo: `https://projeto-peripatos.web.app`

Acesse o link e verifique se a aplicação está rodando corretamente em produção.

---

## 🔄 Fluxo de Atualização (Resumo)

Sempre que quiser atualizar a versão em produção:

1.  `npm run build`
2.  `npm run deploy`

---
**Projeto Peripatos** • *Docs de Deploy*
