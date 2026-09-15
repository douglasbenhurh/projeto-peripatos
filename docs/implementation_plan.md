# Plano de Implementação - Projeto Peripatos

## Visão Geral
O Peripatos é uma aplicação web para enriquecer a experiência de visitantes em uma Escola de Filosofia, vinculando obras de arte a áudios e textos explicativos via QR Code.

## Stack Tecnológica
- **Frontend**: React 19 (Vite)
- **Estilização**: Tailwind CSS 3.4 (Paleta Nova Acrópole)
- **Backend/BaaS**: Firebase (Firestore + Authentication)
- **Storage**: Cloudinary (Imagens/Áudios - 25 GB grátis)
- **Fontes**: Google Fonts (Montserrat, Cinzel Decorative, Playlist Script)

## Revisão e Decisões Técnicas

### 1. Estrutura de Dados (Firestore)
Coleção `obras`:
- `id`: string (auto-generated)
- `titulo`: string
- `descricao`: string
- `localizacao`: string
- `imagemUrl`: string (Cloudinary URL)
- `audioUrl`: string (Cloudinary URL)
- `transcricao`: string ou array (sincronização opcional)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### 2. Design System (Tailwind Config)
Mapeamento da paleta institucional para o `tailwind.config.js`:
- `brand-green`: `#00453d`
- `brand-white`: `#fafafa`
- `brand-yellow`: `#faaa31`
- `brand-blue`: `#3e4095`
- `brand-red`: `#ed3238`

Fontes:
- `sans`: ['Montserrat', 'sans-serif']
- `serif`: ['Cinzel Decorative', 'serif']
- `script`: ['Playlist Script', 'cursive'] (Verificar disponibilidade no Google Fonts ou importar localmente se não houver)

### 3. Autenticação
- **Firebase Authentication** com Email/Password
- Login real (não mock)
- Usuários criados no Firebase Console
- Token JWT automático para requisições autenticadas

### 4. Upload de Mídia
- **Cloudinary** para armazenamento de imagens e áudios
- Unsigned upload (sem backend)
- Upload direto do navegador via API REST
- Organização em pastas: `peripatos/obras/` e `peripatos/audios/`

### 5. Funcionalidades Críticas

#### Player e Sincronização
- Utilizar a API de Áudio HTML5 ou biblioteca leve.
- Para o "Karaokê", o texto precisará de marcações de tempo.
    - *Estratégia MVP*: O admin insere o texto completo. A sincronização fina pode ser complexa de automatizar sem uma API de STT (Speech-to-Text) robusta.
    - *Proposta*: Inicialmente, apenas exibir o texto. Se houver transcrição com timestamps (JSON), implementar o highlight.

#### Geração de Etiquetas
- Utilizar `react-qr-code` para gerar o QR.
- Criar um layout CSS específico para impressão (`@media print`) ou gerar um PDF usando `jspdf`.

## Passos de Implementação

### Fase 1: Setup e Fundações
- Criar projeto Vite + React.
- Configurar Tailwind com as cores e fontes.
- Configurar Firebase SDK.

### Fase 2: Frontend Público (A Experiência)
- Criar rota `/obra`.
- Implementar componente de Player.
- Implementar visualização de texto e imagem com design "Clean e Clássico".

### Fase 3: Backend Admin (O Escriba)
- Criar rota `/admin` com autenticação Firebase
- Implementar upload de arquivos para Cloudinary
- CRUD de obras no Firestore
- Gerador de etiquetas QR

## Configuração Necessária

### Firebase
1. Criar projeto no Firebase Console
2. Ativar Authentication (Email/Password)
3. Criar usuário admin
4. Ativar Firestore Database
5. Configurar regras de segurança (allow write: if request.auth != null)

### Cloudinary
1. Criar conta gratuita
2. Configurar upload preset unsigned
3. Adicionar credenciais no `.env`


