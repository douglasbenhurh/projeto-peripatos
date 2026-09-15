# Especificações Técnicas - Projeto Peripatos

## 1. Contexto e Objetivo
O **Peripatos** é um sistema digital para a Nova Acrópole Brasil Sul, projetado para vincular artefatos físicos (bustos, quadros, livros) a experiências de aprofundamento filosófico.
**Objetivo Principal**: Oferecer uma tecnologia discreta e elegante que sirva de suporte à transmissão de conhecimento, respeitando a identidade visual clássica da instituição.

## 2. Diretrizes de Design e Identidade Visual

### 2.1 Tipografia
Utilizar **Google Fonts**:
- **Títulos e Destaques**: `Montserrat` (Bold / 700)
- **Texto Descritivo**: `Montserrat` (Medium / 500)
- **Sinalização Clássica**: `Cinzel Decorative` (Para títulos de obras e cabeçalhos especiais)
- **Artístico/Frases**: `Playlist Script` (Opcional)

### 2.2 Paleta de Cores
| Nome | Hex | Uso |
| :--- | :--- | :--- |
| **Verde Institucional** | `#00453d` | Fundos de destaque, botões primários, texto alto contraste |
| **Branco Institucional** | `#fafafa` | Fundo principal (evitar #FFFFFF) |
| **Amarelo Cultura** | `#faaa31` | Ícones, destaques sutis, CTAs |
| **Azul Filosofia** | `#3e4095` | Uso pontual |
| **Vermelho Voluntariado** | `#ed3238` | Uso pontual |

### 2.3 Estilo Visual
- **Atmosfera**: Limpa, clássica, com amplo "respiro" (whitespace).
- **Imagens**: Destaque com bordas sutis ou sombras suaves.

## 3. Requisitos Funcionais

### 3.1 Módulo 1: A Experiência Contemplativa (Frontend Público)
**Acesso**: Via QR-Code (`[DOMINIO]/obra?id={ID}`)

**Interface da Obra**:
1.  **Cabeçalho**: Título da Obra (Cinzel Decorative ou Montserrat Bold).
2.  **Imagem**: Foto de alta resolução do artefato.
3.  **Player de Áudio**:
    - Customizado com cores institucionais (#00453d e #faaa31).
    - Controles de Play/Pause/Seek.
4.  **Leitura (Transcrição)**:
    - Texto em Montserrat Medium.
    - **Diferencial**: Sincronização tipo "Karaokê" (Texto lido em destaque #00453d, futuro em cinza suave).

### 3.2 Módulo 2: O Escriba (Painel Administrativo)
**Acesso**: Restrito (Login).

**Funcionalidades**:
1.  **Gestão do Acervo (CRUD)**:
    - Campos: Título, Descrição, Localização, Imagem (Upload), Áudio (Upload).
    - Geração automática de transcrição (Integração futura ou upload manual no MVP).
2.  **Gerador de Etiquetas**:
    - Layout pronto para impressão.
    - Conteúdo: Título, Logo Nova Acrópole, QR-Code.
    - Estilos: Fundo Branco (#fafafa) ou Verde (#00453d).

## 4. Diretrizes Técnicas

### 4.1 Stack Tecnológica
- **Frontend**: React 19 + Vite
- **CSS**: Tailwind CSS 3.4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Email/Password)
- **Storage**: Cloudinary (25 GB grátis)

### 4.2 Configuração
- **Tailwind**: `tailwind.config.js` com cores exatas (`brand-green`, `brand-white`, etc)
- **CSS Global**: Importar fontes no `index.css`
- **Variáveis de Ambiente**: Arquivo `.env` com credenciais Firebase e Cloudinary

### 4.3 Autenticação
- Firebase Authentication com Email/Password
- Usuários criados no Firebase Console
- Login real (JWT tokens automáticos)
- ProtectedRoute para rotas administrativas

### 4.4 Upload de Mídia
- Cloudinary API REST (unsigned upload)
- Upload direto do navegador
- Organização: `peripatos/obras/` (imagens) e `peripatos/audios/` (áudios)
- Formatos: JPEG/PNG (imagens), MP3/WAV (áudios)
