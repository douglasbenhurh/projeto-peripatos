# Padrões de Código - Projeto Peripatos

## Componentes React Completos

### Componente com Estado e Efeitos
```jsx
import { useState, useEffect } from 'react';

const ObraViewer = ({ obraId }) => {
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadObra = async () => {
      try {
        const data = await getObra(obraId);
        if (!data) throw new Error('Obra não encontrada');
        setObra(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (obraId) loadObra();
  }, [obraId]);

  if (loading) return <div className="text-center p-8">Carregando...</div>;
  if (error) return <div className="text-brand-red p-8">{error}</div>;
  if (!obra) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-serif text-brand-green">{obra.titulo}</h1>
      {/* Conteúdo */}
    </div>
  );
};

export default ObraViewer;
```

### Componente com Formulário
```jsx
import { useState } from 'react';

const ObraForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    descricao: initialData.descricao || '',
    localizacao: initialData.localizacao || ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'Título obrigatório';
    if (formData.titulo.length < 3) newErrors.titulo = 'Mínimo 3 caracteres';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: 'Erro ao salvar. Tente novamente.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
        />
        {errors.titulo && <p className="text-brand-red text-sm mt-1">{errors.titulo}</p>}
      </div>

      <button
        type="submit"
        className="bg-brand-green text-brand-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
      >
        Salvar
      </button>
      
      {errors.submit && <p className="text-brand-red">{errors.submit}</p>}
    </form>
  );
};

export default ObraForm;
```

## Firebase Patterns

### Upload de Arquivo com Progresso
```javascript
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const uploadFileWithProgress = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

// Uso
const handleUpload = async (file) => {
  try {
    const url = await uploadFileWithProgress(
      file,
      `obras/imagens/${Date.now()}_${file.name}`,
      (progress) => setUploadProgress(progress)
    );
    console.log('Upload completo:', url);
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### Listagem com Paginação
```javascript
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const getObras = async (pageSize = 10, lastDoc = null) => {
  let q = query(
    collection(db, 'obras'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const obras = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { obras, lastVisible, hasMore: obras.length === pageSize };
};
```

## Tailwind Patterns

### Layout Container Padrão
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-brand-white min-h-screen">
  {/* Conteúdo */}
</div>
```

### Card de Obra
```jsx
<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <img 
    src={obra.imagemUrl} 
    alt={obra.titulo}
    className="w-full h-48 object-cover"
  />
  <div className="p-6">
    <h3 className="text-xl font-serif text-brand-green mb-2">{obra.titulo}</h3>
    <p className="text-gray-600 font-sans">{obra.descricao}</p>
  </div>
</div>
```

### Botões
```jsx
// Primário
<button className="bg-brand-green text-brand-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium">
  Ação Primária
</button>

// Secundário
<button className="border-2 border-brand-green text-brand-green px-6 py-3 rounded-lg hover:bg-brand-green hover:text-white transition-all font-medium">
  Ação Secundária
</button>

// Perigo
<button className="bg-brand-red text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium">
  Deletar
</button>
```

### Grid Responsivo
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id}>{/* Card */}</div>
  ))}
</div>
```

## Hooks Customizados

### useObra
```javascript
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const useObra = (obraId) => {
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!obraId) {
      setLoading(false);
      return;
    }

    const fetchObra = async () => {
      try {
        const docRef = doc(db, 'obras', obraId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setObra({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Obra não encontrada');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObra();
  }, [obraId]);

  return { obra, loading, error };
};
```

### useAuth
```javascript
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
```

## Testes Cypress

### Teste de Fluxo Completo
```javascript
describe('Fluxo de Visualização de Obra', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar obra via QR Code e reproduzir áudio', () => {
    const testObraId = 'test-obra-123';
    
    // Navegar para obra
    cy.visit(`/obra?id=${testObraId}`);
    
    // Verificar elementos carregados
    cy.get('[data-testid="obra-titulo"]').should('be.visible');
    cy.get('[data-testid="obra-imagem"]').should('be.visible');
    cy.get('[data-testid="audio-player"]').should('exist');
    
    // Testar player
    cy.get('[data-testid="play-button"]').click();
    cy.get('[data-testid="audio-player"]').should('have.class', 'playing');
    
    // Verificar texto sincronizado
    cy.get('[data-testid="synchronized-text"]').should('be.visible');
  });

  it('deve mostrar erro para obra inexistente', () => {
    cy.visit('/obra?id=nao-existe');
    cy.contains('Obra não encontrada').should('be.visible');
  });
});
```

### Teste de Formulário Admin
```javascript
describe('Admin - CRUD de Obras', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('admin@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/admin');
  });

  it('deve criar nova obra', () => {
    cy.get('[data-testid="nova-obra-button"]').click();
    
    cy.get('[name="titulo"]').type('Busto de Platão');
    cy.get('[name="descricao"]').type('Descrição da obra');
    cy.get('[name="localizacao"]').type('Sala Principal');
    
    // Upload de imagem (mock)
    cy.get('[data-testid="upload-imagem"]').attachFile('test-image.jpg');
    
    cy.get('[data-testid="submit-button"]').click();
    
    cy.contains('Obra criada com sucesso').should('be.visible');
  });
});
```

## Validações e Utilitários

### Validação de Formulários
```javascript
export const validateObraForm = (data) => {
  const errors = {};

  if (!data.titulo?.trim()) {
    errors.titulo = 'Título é obrigatório';
  } else if (data.titulo.length < 3) {
    errors.titulo = 'Título deve ter no mínimo 3 caracteres';
  }

  if (!data.imagemUrl) {
    errors.imagemUrl = 'Imagem é obrigatória';
  }

  if (!data.audioUrl) {
    errors.audioUrl = 'Áudio é obrigatório';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Formatação de Tempo
```javascript
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

### Validação de Arquivo
```javascript
export const validateFile = (file, type = 'image') => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/jpg'],
    audio: ['audio/mpeg', 'audio/mp3', 'audio/wav']
  };

  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande (máx 10MB)' };
  }

  if (!allowedTypes[type].includes(file.type)) {
    return { valid: false, error: `Formato não suportado. Use: ${allowedTypes[type].join(', ')}` };
  }

  return { valid: true };
};
```
