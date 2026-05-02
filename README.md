# Planejamento Viagens API

Estrutura inicial de uma API REST em JavaScript com Express, autenticação JWT e MongoDB.

## Tecnologias

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Swagger (`swagger-ui-express` + `yamljs`)

## Arquitetura inicial

```
src/
  config/
  controllers/
  docs/
  middleware/
  models/
  routes/
  services/
```

Arquivo de configuração de ambiente:

- `src/config/env.js`

## Pré-requisitos

- Node.js 20+
- MongoDB local ou remoto

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` com base no `.env.example`:

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Atualize as variáveis conforme o ambiente:

- `PORT`
- `BASE_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Scripts

- `npm start`: inicia o servidor em modo estático
- `npm run start:dev`: inicia com reinício automático ao alterar arquivos
- `npm test`: executa os testes unitários

## Endpoints iniciais

- `GET /api/health` - status público da API
- `GET /api/protected/health` - status protegido (exige Bearer token)
- `POST /api/usuarios` - registra usuário (retorna apenas `id`)
- `POST /api/auth/register` - cria usuário e retorna JWT
- `POST /api/auth/login` - autentica usuário e retorna JWT

### Regras de registro em `POST /api/usuarios`

- `name` e `email` são obrigatórios
- senha deve ter no mínimo 8 caracteres e ao menos 1 número
- e-mail deve ser único
- senha é persistida com hash seguro (`bcrypt`)
- em duplicidade de e-mail, API retorna `409`

## Swagger

Com a API rodando, acesse:

- `http://localhost:3000/api-docs`

Especificação OpenAPI:

- `src/docs/swagger.yaml`

## Deploy (Vercel)

O projeto já inclui o arquivo `vercel.json` para facilitar o deploy inicial.
