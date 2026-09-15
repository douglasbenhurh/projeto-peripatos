# Guia de Testes End-to-End (E2E) com Cypress

Este guia descreve como executar e criar testes end-to-end para o Projeto Peripatos utilizando o Cypress.

## Pré-requisitos

Certifique-se de ter as dependências instaladas:

```bash
npm install
```

## Executando os Testes

### Modo Interativo (Interface Gráfica)

Para abrir o Cypress e ver os testes rodando no navegador:

```bash
npm run test:e2e
```

Isso abrirá a janela do Cypress. Selecione "E2E Testing" e escolha um navegador (Chrome, Edge, etc.) para iniciar.

### Modo Headless (Linha de Comando)

Para rodar os testes no terminal (útil para CI/CD):

```bash
npm run test:e2e:run
```

## Estrutura dos Testes

Os testes ficam localizados na pasta `cypress/e2e` e estão organizados por funcionalidade:

### Testes Públicos (Fluxo do Visitante)

#### `home.cy.js`
Testa a página inicial da aplicação:
- Exibição da mensagem de boas-vindas
- Instruções para escanear QR code
- Navegação para a página de scanner

#### `scan.cy.js`
Testa a página de scanner de QR code:
- Exibição do título e instruções
- Presença do componente de scanner
- Navegação de volta para home

#### `obra.cy.js`
Testa a página de visualização de obra:
- Exibição do título e imagem da obra
- Presença do player de áudio
- Exibição do texto sincronizado
- Tratamento de erro quando ID não é fornecido

### Testes Administrativos

#### `admin-login.cy.js`
Testa o sistema de autenticação:
- Exibição do formulário de login
- Login com credenciais válidas
- Mensagens de erro para credenciais inválidas
- Validação de campos obrigatórios
- Armazenamento de sessão no localStorage

#### `admin-dashboard.cy.js`
Testa o painel administrativo:
- Exibição da lista de obras
- Botão para criar nova obra
- Links de ação (Editar, Etiqueta, Ver)
- Navegação entre páginas
- Proteção de rota (redirecionamento se não autenticado)

#### `admin-obra-crud.cy.js`
Testa as operações CRUD de obras:
- Criação de nova obra
- Edição de obra existente
- Validação de campos obrigatórios
- Pré-preenchimento de dados ao editar
- Upload de arquivos (imagem e áudio)

#### `admin-label.cy.js`
Testa o gerador de etiquetas:
- Exibição do QR code
- Informações da obra na etiqueta
- Botões de impressão e voltar
- Tratamento de erro quando ID não é fornecido

### Testes de Integração

#### `full-flow.cy.js`
Testa o fluxo completo da aplicação:
- Fluxo admin: login → criar obra → gerar etiqueta → visualizar
- Fluxo visitante: home → scanner
- Proteção de rotas administrativas
- Navegação entre todas as páginas públicas

## Fixtures (Dados de Teste)

Os dados de teste estão em `cypress/fixtures/`:

- **`users.json`**: Credenciais de usuários de teste
  - Admin: `admin@nova-acropole.org.br` / `admin`
  - Tutor: `tutor@nova-acropole.org.br` / `tutor`

- **`obras.json`**: Dados de obras mockadas para testes

## Comandos Customizados

Comandos reutilizáveis definidos em `cypress/support/commands.js`:

### `cy.login(email, password)`
Realiza login automaticamente:
```javascript
cy.login('admin@nova-acropole.org.br', 'admin');
```

### `cy.logout()`
Limpa a sessão e retorna para home:
```javascript
cy.logout();
```

### `cy.isAuthenticated()`
Verifica se o usuário está autenticado:
```javascript
cy.isAuthenticated();
```

## Escrevendo Novos Testes

### Estrutura Básica

1. Crie um arquivo com a extensão `.cy.js` dentro de `cypress/e2e`
2. Use `describe` para agrupar os testes e `it` para definir um caso de teste
3. Use `beforeEach` para configuração que deve rodar antes de cada teste

Exemplo:

```javascript
describe('Minha Funcionalidade', () => {
  beforeEach(() => {
    cy.visit('/minha-rota');
  });

  it('should do something', () => {
    cy.contains('Texto Esperado').should('be.visible');
  });
});
```

### Comandos Comuns do Cypress

- **Navegação**
  - `cy.visit('/url')`: Navega para uma URL
  - `cy.go('back')`: Volta para página anterior

- **Seleção de Elementos**
  - `cy.get('seletor')`: Seleciona elemento por CSS selector
  - `cy.contains('texto')`: Seleciona elemento que contém o texto
  - `cy.get('#id')`: Seleciona por ID
  - `cy.get('.class')`: Seleciona por classe

- **Interações**
  - `.click()`: Clica em um elemento
  - `.type('texto')`: Digita em um campo de input
  - `.clear()`: Limpa um campo de input
  - `.check()`: Marca checkbox/radio
  - `.select('option')`: Seleciona opção em dropdown

- **Asserções**
  - `.should('be.visible')`: Verifica se está visível
  - `.should('have.value', 'valor')`: Verifica valor de input
  - `.should('contain', 'texto')`: Verifica se contém texto
  - `.should('have.attr', 'atributo', 'valor')`: Verifica atributo
  - `.should('exist')`: Verifica se elemento existe no DOM

- **Fixtures**
  - `cy.fixture('arquivo')`: Carrega dados de teste

### Boas Práticas

1. **Use seletores estáveis**: Prefira IDs ou atributos `data-testid` ao invés de classes CSS
2. **Isole os testes**: Cada teste deve ser independente
3. **Limpe o estado**: Use `beforeEach` para garantir estado limpo
4. **Seja específico**: Use seletores específicos para evitar falsos positivos
5. **Teste comportamento, não implementação**: Foque no que o usuário vê e faz

## Debugging

### Modo Interativo
Execute `npm run test:e2e` e use a interface do Cypress para:
- Ver cada passo do teste
- Inspecionar o DOM em cada etapa
- Ver screenshots automáticos de falhas

### Comandos de Debug
```javascript
cy.pause(); // Pausa a execução
cy.debug(); // Abre o debugger
cy.screenshot(); // Tira screenshot
```

## CI/CD

Para integração contínua, use:

```bash
npm run test:e2e:run
```

Este comando executa todos os testes em modo headless e gera relatórios.

## Recursos Adicionais

- [Documentação Oficial do Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

