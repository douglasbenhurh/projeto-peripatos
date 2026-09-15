<div align="center">

# 🏛️ Projeto Peripatos

### Sistema de Experiência Contemplativa Digital

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

**Uma plataforma digital elegante que conecta artefatos físicos (bustos, quadros, livros) a experiências filosóficas profundas através de QR Codes, desenvolvida especialmente para a Nova Acrópole Brasil Sul.**

[✨ Demo](#) • [📚 Documentação](#documentação) • [🚀 Começar](#-como-rodar-localmente)

</div>

---

## 📖 Sobre o Projeto

O **Peripatos** (do grego *περίπατος*, "passeio filosófico") é um sistema web que transforma a experiência cultural em algo contemplativo e imersivo. Desenvolvido com foco na **identidade visual clássica da Nova Acrópole**, o projeto oferece:

### 🎯 Funcionalidades Principais

#### 🌐 **Módulo Público - A Experiência Contemplativa**
- Acesso via **QR Code** vinculado a cada artefato físico
- Visualização de obras com **imagem em alta resolução**
- **Player de áudio** customizado com cores institucionais
- **Leitura sincronizada** estilo "karaokê" que acompanha o áudio
- Interface limpa, elegante e responsiva

#### 🔐 **Módulo Administrativo - O Escriba**
- **Painel de gestão completo (CRUD)** de obras
- Upload de imagens e áudios para **Cloudinary**
- **Gerador de etiquetas QR Code** para impressão
- Autenticação segura via **Firebase Authentication**
- Layout otimizado para gerenciamento eficiente

---

## 🎨 Identidade Visual

O projeto respeita rigorosamente a **identidade visual da Nova Acrópole**:

### Paleta de Cores
```
🟢 Verde Institucional  #00453d  - Fundos, botões primários
⚪ Branco Institucional  #fafafa  - Fundo principal
🟡 Amarelo Cultura      #faaa31  - Destaques e CTAs
🔵 Azul Filosofia       #3e4095  - Uso pontual
🔴 Vermelho Voluntariado #ed3238 - Uso pontual
```

### Tipografia
- **Montserrat** (700/500) - Títulos e textos
- **Cinzel Decorative** - Títulos de obras (clássico)
- **Playlist Script** - Elementos artísticos (opcional)

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 19.2** - Framework JavaScript moderno
- **Vite 7.2** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Framework CSS utilitário
- **React Router DOM 7.9** - Roteamento

### Backend & Serviços
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Authentication** - Autenticação segura (Email/Password)
- **Cloudinary** - Storage de mídia (25 GB gratuitos)

### Desenvolvimento
- **ESLint 9** - Linter JavaScript
- **Cypress 15** - Testes End-to-End
- **PostCSS** - Processamento CSS

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- Conta **Firebase** ([Criar conta](https://console.firebase.google.com/))
- Conta **Cloudinary** ([Criar conta grátis](https://cloudinary.com/users/register/free))

### 🔧 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/douglasbenhurh/projeto-peripatos.git
cd projeto-peripatos
```

### 📦 Passo 2: Instalar Dependências

```bash
npm install
```

### 🔐 Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_preset_unsigned
```

### ☁️ Passo 4: Configurar Firebase

1. **Criar Projeto**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Clique em "Adicionar projeto"
   - Siga o assistente de criação

2. **Configurar Authentication**
   - No menu lateral: **Build** → **Authentication**
   - Clique em "Começar"
   - Ative o provedor **E-mail/senha**
   - Vá na aba **Users** e adicione seu primeiro usuário admin

3. **Configurar Firestore Database**
   - No menu lateral: **Build** → **Firestore Database**
   - Clique em "Criar banco de dados"
   - Escolha o modo **Produção**
   - Selecione a localização (sugestão: `southamerica-east1`)

4. **Configurar Regras de Segurança**
   - Use as regras do arquivo `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /obras/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **Obter Credenciais**
   - No menu lateral: ⚙️ **Configurações do projeto**
   - Role até **Seus aplicativos** → **Web**
   - Copie as credenciais para o arquivo `.env`

### 🖼️ Passo 5: Configurar Cloudinary

1. **Criar Conta**
   - Acesse [Cloudinary](https://cloudinary.com/users/register/free)
   - Cadastre-se gratuitamente (25 GB de armazenamento)

2. **Obter Cloud Name**
   - No Dashboard, copie o **Cloud Name**
   - Cole no `.env` como `VITE_CLOUDINARY_CLOUD_NAME`

3. **Criar Upload Preset**
   - Vá em **Settings** → **Upload** → **Upload presets**
   - Clique em "Add upload preset"
   - Configure:
     - **Preset name**: `peripatos_unsigned` (ou personalizado)
     - **Signing mode**: **Unsigned**
     - **Folder**: `peripatos` (opcional)
   - Clique em **Save**
   - Cole o nome do preset no `.env` como `VITE_CLOUDINARY_UPLOAD_PRESET`

### ▶️ Passo 6: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

✅ **Pronto!** Acesse: **http://localhost:5173**

---

## 📱 Comandos Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção (pasta dist/)
npm run preview      # Preview do build de produção
npm run lint         # Verificar erros de código
npm run test:e2e     # Abrir Cypress (testes E2E)
npm run test:e2e:run # Rodar testes E2E em modo headless
```

---

## 📂 Estrutura do Projeto

```
projeto-peripatos/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── AdminObraForm.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── LabelGenerator.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/             # Páginas principais
│   │   ├── Home.jsx
│   │   ├── ObraDetail.jsx
│   │   ├── Login.jsx
│   │   └── AdminDashboard.jsx
│   ├── firebase.js        # Configuração Firebase
│   ├── cloudinary.js      # Configuração Cloudinary
│   ├── App.jsx            # Componente raiz
│   └── index.css          # Estilos globais + Tailwind
├── public/                # Arquivos estáticos
├── cypress/               # Testes E2E
├── docs/                  # Documentação adicional
├── .env.example           # Exemplo de variáveis de ambiente
├── tailwind.config.js     # Configuração Tailwind (cores customizadas)
└── vite.config.js         # Configuração Vite
```

---

## 🔐 Login Administrativo

- **URL**: `/login`
- **Credenciais**: Use o email/senha criados no Firebase Authentication (Passo 4.2)

---

## 📚 Documentação

- [📋 Especificações Técnicas](./technical_specifications.md)
- [🤖 Instruções para Agentes](./AGENT_INSTRUCTIONS.md)
- [📝 Plano de Implementação](./docs/implementation_plan.md)
- [🧪 Guia de Testes E2E](./docs/e2e_testing_guide.md)
- [🎨 Padrões de Código](./docs/code-patterns.md)

---

## 🤝 Contribuindo

Contribuições são **muito bem-vindas**! Este projeto foi desenvolvido para servir a comunidade da Nova Acrópole.

1. Faça um **Fork** do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### 📝 Convenção de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 💡 Autoria

Desenvolvido com 💚 para a **Nova Acrópole Brasil Sul**

**Contato**: [douglasbenhurh](https://github.com/douglasbenhurh)

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**[⬆ Voltar ao topo](#-projeto-peripatos)**

</div>
