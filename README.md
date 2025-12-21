# TaskFlow

TaskFlow é um SaaS simples de gerenciamento de projetos e tarefas, criado com foco em estudo prático de autenticação, APIs REST e integração frontend/backend.

O projeto simula um sistema real, com autenticação segura, proteção de rotas e um CRUD completo de projetos e tarefas.

---

## ✨ Funcionalidades

### Autenticação
- Registro de usuário
- Login com JWT
- Autenticação em dois fatores (2FA)
- Logout
- Tokens armazenados em cookies httpOnly
- Proteção de rotas no frontend com middleware

### Projetos
- Criar projetos
- Listar projetos do usuário
- Excluir projetos

### Tarefas
- Criar tarefas dentro de projetos
- Listar tarefas por projeto
- Marcar tarefas como concluídas
- Excluir tarefas
- Definir prazo (deadline)

---

## 🧱 Stack utilizada

### Frontend
- Next.js (App Router)
- JavaScript
- TailwindCSS
- Middleware para proteção de rotas
- Fetch API

### Backend
- FastAPI
- SQLAlchemy
- JWT
- bcrypt
- SQLite (pode ser trocado por PostgreSQL)
- CORS

---

## 📁 Estrutura do projeto

### Frontend
```

/app
/login
/register
/dashboard
/projects
/[id]
/profile
middleware.js

```

### Backend
```

/auth

* login
* register
* 2fa
  /projects
  /tasks

````

---

## 🚀 Como rodar o projeto localmente

### Backend
```bash
# criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# instalar dependências
pip install -r requirements.txt

# rodar a API
uvicorn app.main:app --reload
````

A API ficará disponível em:

```
http://localhost:8000
```

Swagger:

```
http://localhost:8000/docs
```

---

### Frontend

```bash
npm install
npm run dev
```

O frontend ficará disponível em:

```
http://localhost:3000
```

---

## 🔐 Observações sobre autenticação

* O sistema utiliza JWT armazenado em cookies httpOnly
* Rotas privadas são protegidas via middleware no Next.js
* A autenticação em dois fatores (2FA) é obrigatória após o login

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido com fins educacionais, com foco em:

* Autenticação realista
* Boas práticas de API
* Organização de código
* Integração entre frontend e backend

---

## 📌 Próximos passos (opcional)

* Compartilhamento de projetos
* Sistema de permissões (roles)
* Planos free/premium (mockado)

---

## 📄 Licença

Este projeto é apenas para fins de estudo e portfólio.

```

---
