# Instruções para Agentes - Projeto Peripatos

evite firulas, respostas rápidas e concisas

## 🎯 Missão
Sistema web para Nova Acrópole: vincular obras de arte físicas a experiências digitais contemplativas via QR Code.

**Princípio**: Tecnologia discreta e elegante. Design limpo, clássico, respeitando identidade institucional.

---

## 🎨 Design System (CRÍTICO)

### Cores (NUNCA use outras)
```javascript
'brand-green'  → #00453d  // Primário: botões, destaques
'brand-white'  → #fafafa  // Fundo (NUNCA #FFFFFF)
'brand-yellow' → #faaa31  // CTAs, ícones
'brand-blue'   → #3e4095  // Pontual
'brand-red'    → #ed3238  // Pontual
```

### Tipografia
- `font-sans` (Montserrat): Textos e títulos gerais
- `font-serif` (Cinzel Decorative): Títulos de obras
- `font-script` (Playlist Script): Opcional/artístico

### Estilo
- Espaçamento generoso (`p-6`, `p-8`, `gap-6`)
- Sombras suaves (`shadow-md`)
- Transições discretas (`transition-all duration-300`)

---

## 📁 Estrutura (Onde Buscar)

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AudioPlayer.jsx      # Player customizado
│   ├── SynchronizedText.jsx # Texto sincronizado
│   ├── QRScanner.jsx        # Scanner mobile
│   ├── Layout.jsx           # Layout base
│   └── ProtectedRoute.jsx   # Proteção admin
│
├── pages/               # Páginas completas
│   ├── Obra.jsx             # Experiência pública
│   ├── ScanPage.jsx         # Scan mobile
│   ├── AdminDashboard.jsx   # Dashboard admin
│   ├── AdminObraForm.jsx    # CRUD obras
│   ├── LabelGenerator.jsx   # Gerador etiquetas
│   └── Login.jsx            # Firebase Auth
│
├── firebase.js          # Config Firebase (Firestore + Auth)
├── cloudinary.js        # Upload Service (Cloudinary)
└── App.jsx              # Rotas
```

**Documentação Detalhada**:
- `technical_specifications.md` → Requisitos e design
- `implementation_plan.md` → Arquitetura e decisões técnicas
- `README.md` → Setup e comandos
- `docs/code-patterns.md` → Padrões de código (se existir)

---

## 🗄️ Dados (Firestore)

### Coleção `obras`
```javascript
{
  id: string,
  titulo: string,          // Obrigatório
  descricao: string,
  localizacao: string,
  imagemUrl: string,       // Cloudinary URL
  audioUrl: string,        // Cloudinary URL
  transcricao: string,     // Texto completo
  timestamps: [{tempo: number, texto: string}], // Opcional
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔧 Stack

- **React 19** + Vite
- **Tailwind CSS 3.4** (config em `tailwind.config.js`)
- **Firebase**: Firestore (dados) + Auth (autenticação)
- **Cloudinary**: Storage (imagens/áudios - 25 GB grátis)
- **Libs**: react-router-dom, react-qr-code, html5-qrcode
- **Testes**: Cypress (`cypress/e2e/`)

---

## 📝 Padrões de Código

### Nomenclatura
```javascript
// Componentes: PascalCase
AudioPlayer.jsx

// Funções: camelCase
const handlePlayPause = () => {}

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024;
```

### Componente Padrão
```jsx
import { useState, useEffect } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Efeitos
  }, []);
  
  const handleAction = () => {
    // Lógica
  };
  
  return (
    <div className="container mx-auto p-6 bg-brand-white">
      {/* Conteúdo */}
    </div>
  );
};

export default ComponentName;
```

### Firebase Operations
```javascript
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';
import { uploadToCloudinary } from './cloudinary';

// Autenticação
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Upload de mídia
const uploadImage = async (file) => {
  return await uploadToCloudinary(file, 'image');
};

// Buscar obra
const getObra = async (id) => {
  const docSnap = await getDoc(doc(db, 'obras', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Criar obra
const addObra = async (data) => {
  return await addDoc(collection(db, 'obras'), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};
```

### Tratamento de Erros
```javascript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Erro:', error);
  setError('Mensagem amigável ao usuário');
}
```

---

## 🚨 Regras Críticas

### ❌ NUNCA
- Usar cores fora da paleta institucional
- Usar `#FFFFFF` (sempre `#fafafa`)
- Usar fontes não configuradas
- Commitar credenciais Firebase
- Colocar lógica de negócio em componentes UI

### ✅ SEMPRE
- Usar variáveis de ambiente para Firebase (`import.meta.env.VITE_*`)
- Adicionar `createdAt` e `updatedAt` em documentos
- Validar props e inputs
- Tratar erros com try-catch
- Usar lazy loading para imagens grandes
- Manter responsividade mobile-first

---

## 🔄 Workflow

### Nova Feature
1. Consultar `technical_specifications.md`
2. Identificar componentes em `src/components/` ou `src/pages/`
3. Seguir padrões de código acima
4. Testar: `npm run dev`
5. Adicionar teste E2E se necessário

### Bug Fix
1. Reproduzir problema
2. Identificar causa (componente específico)
3. Corrigir minimamente
4. Testar que não quebrou outras funcionalidades

### Refatoração
1. Justificar melhoria
2. Manter funcionalidade
3. Refatorar incrementalmente

---

## 📚 Comandos Úteis

```bash
npm run dev              # Dev server (localhost:5173)
npm run build            # Build produção
npm run lint             # ESLint
npm run test:e2e         # Cypress interativo
npm run test:e2e:run     # Cypress headless
```

---

## ✅ Checklist Antes de Finalizar

- [ ] Usa apenas cores da paleta (`brand-*`)
- [ ] Usa apenas fontes configuradas (`font-sans/serif/script`)
- [ ] Código segue padrões de nomenclatura
- [ ] Tratamento de erros implementado
- [ ] Responsivo (mobile + desktop)
- [ ] Sem `console.log` ou credenciais hardcoded
- [ ] Funciona localmente (`npm run dev`)

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Firebase não conecta | Verificar `.env` e variáveis `VITE_FIREBASE_*` |
| Cloudinary upload falha | Verificar `VITE_CLOUDINARY_*` e upload preset unsigned |
| Login não funciona | Criar usuário no Firebase Authentication Console |
| Tailwind não aplica | Reiniciar `npm run dev`, limpar cache `.vite` |
| Áudio não carrega | Verificar URL Cloudinary, formato MP3/WAV |
| QR Code não funciona | Verificar URL `/obra?id={ID}` e existência no Firestore |

---

**Docs Completas**: Consulte `technical_specifications.md` e `implementation_plan.md`  
**Versão**: 1.1 (Otimizada) | **Atualização**: 2025-11-21
