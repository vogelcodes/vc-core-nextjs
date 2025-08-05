# App Core Package

Core package compartrilhado para aplicações NextJS.

## Instalação

```bash
npm install git+https://github.com/seu-usuario/app-core.git
```

## Uso

```javascript
import { authService, withAuth, database } from 'app-core';
```

## Funcionalidades

- 🔐 Sistema de autenticação
- 👥 Gerenciamento de usuários  
- 🗄️ Conexão com PostgreSQL
- 💳 Integração com Stripe
- 📁 Gerenciamento de mídia
- 🛡️ Middlewares de proteção

## Desenvolvimento

```bash
# Atualizar versão patch
npm run publish:patch

# Atualizar versão minor  
npm run publish:minor

# Atualizar versão major
npm run publish:major
```