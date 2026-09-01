<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-v11-blue" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-v5.7-blue" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-latest-blue" alt="PostgreSQL" /></a>
  <a href="https://redis.io/" target="_blank"><img src="https://img.shields.io/badge/Redis-v8-red" alt="Redis" /></a>
  <a href="https://github.com/felCarvalho/api-rotina-app/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-MIT-green" alt="License" /></a>
</p>

<p align="center">
  API REST para gerenciamento de rotinas e tarefas — <b>Projeto criado exclusivamente para fins de aprendizado.</b>
</p>

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o projeto](#executando-o-projeto)
- [Docker](#docker)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Arquitetura](#arquitetura)
- [Entidades](#entidades)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Migrações](#migrações)
- [Licença](#licença)

---

## Sobre

**API Rotina App** é uma API REST construída com NestJS para gerenciamento de rotinas e tarefas pessoais. O projeto foi criado exclusivamente para fins de aprendizado, explorando conceitos como autenticação JWT com refresh tokens, gerenciamento de sessões via Redis, RBAC (Role-Based Access Control), padrões de design como Unit of Work, Repository e Orchestrator, e boas práticas de desenvolvimento com TypeScript.

> ⚠️ **Aviso:** Este projeto é apenas para fins de aprendizado e não deve ser utilizado em produção.

---

## Funcionalidades

- **Autenticação completa** — Login com JWT access tokens (15min) e refresh tokens (24h)
- **Sessões via Redis** — Tokens armazenados no Redis com TTL independente, acessados via cookie httpOnly
- **CRUD de tarefas** — Criação, listagem e verificação de tasks com status (`concluida` / `incompleta`)
- **Categorias** — Organização de tarefas por categorias
- **RBAC** — Controle de acesso baseado em papéis (USER, ADMIN, GUEST) e permissões (CREATE, DELETE, UPDATE, READ)
- **Soft delete** — Entidades não são removidas fisicamente do banco
- **Validação** — DTOs com `class-validator` para validação automática de entradas
- **Swagger** — Documentação interativa da API disponível em `/api`
- **Docker** — Setup containerizado com Redis e PostgreSQL

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js |
| **Framework** | [NestJS](https://nestjs.com/) v11 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) v5.7 |
| **ORM** | [MikroORM](https://mikro-orm.io/) v7 |
| **Banco de dados** | [PostgreSQL](https://www.postgresql.org/) |
| **Cache / Sessões** | [Redis](https://redis.io/) |
| **Autenticação** | [Passport.js](https://www.passportjs.com/) (Local, JWT, Refresh Token strategies) |
| **Hash de senhas** | [Argon2](https://www.npmjs.com/package/argon2) |
| **Validação** | [class-validator](https://www.npmjs.com/package/class-validator) + [class-transformer](https://www.npmjs.com/package/class-transformer) |
| **API Docs** | [Swagger](https://swagger.io/) via `@nestjs/swagger` |
| **Containerização** | [Docker](https://www.docker.com/) + Docker Compose |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional, para subir Redis e PostgreSQL)

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/felCarvalho/api-rotina-app.git
cd api-rotina-app

# Instale as dependências
pnpm install
```

---

## Configuração

O projeto utiliza 3 arquivos de variáveis de ambiente. Crie os arquivos na raiz do projeto:

### `.env` — Configurações da aplicação

```env
API_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
SECRET_COOKIES=seu_secret_aqui
```

### `.env.database` — Conexão com PostgreSQL

```env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=nome_do_banco
POSTGRES_HOST=localhost
```

### `.env.secrets.jwt` — Chaves JWT

```env
JWT_ACCESS_TOKEN_SECRET=seu_secret_access_token
JWT_REFRESH_TOKEN_SECRET=seu_secret_refresh_token
```

> ⚠️ Nunca commite arquivos `.env` no repositório. O `.gitignore` já está configurado para ignorá-los.

---

## Executando o projeto

```bash
# Desenvolvimento (com hot-reload)
pnpm run start:dev

# Debug
pnpm run start:debug

# Produção
pnpm run build
pnpm run start:prod
```

A API estará disponível em `http://localhost:3000`.

---

## Docker

O projeto inclui `docker-compose.yml` para subir os serviços de infraestrutura:

```bash
# Subir Redis e PostgreSQL
docker-compose up -d

# Verificar status
docker-compose ps

# Parar serviços
docker-compose down
```

### Serviços

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| `redis` | `redis:8.10.1-alpine` | `${REDIS_PORT}:6379` | Cache e armazenamento de sessões |
| `db` | `postgres` (latest) | `${POSTGRES_PORT}:5432` | Banco de dados relacional |

---

## Endpoints da API

### Autenticação

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `POST` | `/auth/login` | Não | Login — retorna sessionId via cookie httpOnly |
| `POST` | `/auth/refresh` | Cookie | Renova os tokens de acesso e refresh |

### Verificação

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `GET` | `/verify/credentials/check/:identifier` | Não | Verifica se o email/identifier já existe |
| `GET` | `/verify/task/title/check/:title` | Não | Verifica se o título da task já existe |
| `GET` | `/verify/category/title/check/:title` | Não | Verifica se o título da categoria já existe |

### Task

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `GET` | `/task/all/user` | JWT (cookie) | Lista todas as tasks do usuário autenticado |
| `POST` | `/task/create` | JWT (guard) | Cria uma task + category (orchestrator) |

### Account

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `POST` | `/account/create` | Não | Cria uma nova conta de usuário |

### User

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `GET` | `/user/username/check/:name` | Não | Verifica se o nome de usuário já existe |

### Documentação

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/api` | Swagger UI |
| `GET` | `/swagger` | Swagger UI (alternativo) |

---

## Autenticação

### Fluxo de Login

```
1. Cliente envia POST /auth/login { identifier, password }
2. LocalStrategy valida credenciais via Argon2
3. Gera JWT access token (15min) + refresh token (24h)
4. Armazena tokens no Redis: sessionId:{uuid} → { accessToken, refreshToken }
5. Retorna sessionId como cookie httpOnly (sameSite: lax)
```

### Fluxo de Refresh

```
1. Cliente envia POST /auth/refresh (com cookie sessionId)
2. RefreshTokenMiddleware extrai o refresh token do Redis
3. JwtRefreshAuthGuard valida o refresh token via Passport
4. Gera novos tokens e atualiza o Redis
5. Retorna novo sessionId como cookie httpOnly
```

### Rotas Protegidas

Duas camadas de proteção são utilizadas:

- **`AuthMiddleware`** — Aplicado em `GET /task/all/user` e `POST /task/create`. Lê o cookie `sessionId`, busca o access token no Redis e injeta no header `Authorization`.
- **`JwtAuthGuard`** — Guard do Passport aplicado via `@UseGuards(JwtAuthGuard)` no controller `CreateRotinaController`.

---

## Arquitetura

### Padrões de Design

| Padrão | Descrição |
|--------|-----------|
| **Result Pattern** | Union type `Result<T, E>` com `Ok` e `Er` para tratamento de erros sem exceptions |
| **Unit of Work** | Abstração sobre o `EntityManager` do MikroORM para operações transacionais |
| **Repository** | Abstração de acesso a dados separada da lógica de negócio |
| **Orchestrator** | Serviços que coordenam múltiplos domínios em uma única transação |
| **Middleware** | Intermediários que processam requests antes dos guards (extração de cookies) |

### Estrutura de Módulos

```
AppModule
├── ConfigModule          (global — carrega variáveis de ambiente)
├── MikroOrmModule        (conexão PostgreSQL + todas as entidades)
├── ModuleCore            (provedor de UnitOfWork + Memory/Redis)
├── AuthenticationModule  (login, refresh, guards, strategies)
├── UserModule            (entidade User)
├── TaskModule            (entidade Task + controllers)
├── CategoryModule        (entidade Category + controllers)
├── CreateUserModule      (orchestrator — registro de usuário)
└── CreateRotinaModule    (orchestrator — criação de task + category)
```

### Diretório `src/`

```
src/
├── main.ts                           Bootstrap (CORS, Swagger, cookie-parser)
├── app.module.ts                     Root module + configuração de middleware
├── middleware/
│   ├── auth.middleware.ts             Extrai access token do cookie sessionId
│   └── refresh.middleware.ts          Extrai refresh token do cookie sessionId
├── interceptor/
│   └── cookies.interceptor.ts        Seta cookie sessionId httpOnly na resposta
├── shared/
│   ├── baseEntity/base.entity.ts     Entidade abstrata (id, timestamps, soft delete)
│   ├── custom-decorators/            Decorador @User()
│   ├── interface/                    Tipos de payload JWT
│   ├── result-pattern/result.ts      Result<T, E> (Ok / Err)
│   ├── roles-permissions/rules.ts    Constantes RBAC
│   ├── redis/redis.ts                Serviço Redis (hash operations + TTL)
│   ├── uniOfWork/unitOfWork.ts       Unit of Work abstraction
│   ├── moduleCore/module.core.ts     Provedor de UnitOfWork + Memory
│   └── orchestrators/
│       ├── create-user/              Orchestrator de registro
│       └── create-rotina/            Orchestrator de criação de rotina
├── user/                             Entidade User + service + controller
├── task/                             Entidade Task + service + controllers/
├── category/                         Entidade Category + service + controllers/
├── authentication/
│   ├── entity/                       7 entidades (Credentials, PassHash, Role, etc.)
│   ├── repository/                   5 repositories
│   ├── controllers/                  Authentication + Verify controllers
│   ├── guards/                       JwtAuthGuard, JwtRefreshAuthGuard, LocalAuthGuard
│   ├── strategy/                     LocalStrategy, TokenStrategy, RefreshTokenStrategy
│   └── authencation.service.ts       Lógica de autenticação
├── scripts/
│   ├── seeders/                      Seed de roles, permissions e usuários
│   └── migrations/                   CLI de migrações
└── migrations/                       Arquivos de migração do MikroORM
```

---

## Entidades

### BaseEntity (abstrata — herdada pela maioria das entidades)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `UUID v7` | Chave primária (time-sortable) |
| `created_at` | `datetime` | Data de criação |
| `updated_at` | `datetime` | Data de atualização |
| `deleted_at` | `datetime` | Soft delete (nullable) |

### User

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | `string` | Nome de usuário |

### Task

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `title` | `string` | Título da tarefa (unique) |
| `description` | `string` | Descrição (nullable) |
| `status` | `enum` | `concluida` ou `incompleta` |
| `category` | `ManyToOne` | Referência para Category |
| `user` | `ManyToOne` | Referência para User |

### Category

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `title` | `string` | Título da categoria (unique) |
| `description` | `string` | Descrição (nullable) |
| `user` | `ManyToOne` | Referência para User |

### Credentials

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `ManyToOne` | Referência para User |
| `identifier` | `string` | Email / identifier de login |
| `provider` | `string` | Ex: `local` |

### PassHash

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `OneToOne` | Referência para User (chave primária) |
| `hash` | `string` | Hash Argon2id da senha |

### Role

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `slug` | `string` | Chave primária (ex: `USER`, `ADMIN`, `GUEST`) |
| `name` | `string` | Nome de exibição |

### Permissions

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `slug` | `string` | Chave primária (ex: `CREATE`, `DELETE`, `UPDATE`, `READ`) |
| `name` | `string` | Nome de exibição |

### UserRoles (junction table)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `role` | `ManyToOne` | Referência para Role |
| `user` | `ManyToOne` | Referência para User |

### RolesPermissions (junction table)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `role` | `ManyToOne` | Referência para Role |
| `permission` | `ManyToOne` | Referência para Permissions |

### RefreshToken

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `ManyToOne` | Referência para User |
| `status` | `enum` | `ativo` ou `inativo` |
| `refreshHash` | `string` | Hash Argon2 do refresh token |

---

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run start            # Inicia o servidor
pnpm run start:dev        # Inicia com hot-reload
pnpm run start:debug      # Inicia com debug
pnpm run start:prod       # Roda versão compilada

# Build
pnpm run build            # Compila TypeScript para dist/

# Códigos
pnpm run format           # Formata código com Prettier
pnpm run lint             # Lint + auto-fix com ESLint

# Testes
pnpm run test             # Unit tests
pnpm run test:watch       # Testes em watch mode
pnpm run test:cov         # Testes com cobertura
pnpm run test:e2e         # End-to-end tests

# Seeders
pnpm run create:user                # Cria usuário padrão
pnpm run create:roles-permissions   # Cria roles e permissions

# Migrações
pnpm run migration:create   # Gera nova migração
pnpm run migration:up       # Aplica migrações pendentes
pnpm run migration:down     # Reverte última migração
pnpm run migration:rollup   # Consolida migrações
```

---

## Migrações

O projeto utiliza o sistema de migrações do MikroORM. As migrações são geradas automaticamente com base nas alterações nas entidades.

```bash
# Criar uma nova migração (baseado nas mudanças nas entidades)
pnpm run migration:create

# Aplicar migrações pendentes
pnpm run migration:up

# Reverter última migração
pnpm run migration:down
```

> As migrações são executadas automaticamente ao iniciar o container Docker (`pnpm migration:up && node ./dist/main.js`).

---

## Licença

Este projeto está licenciado sob a licença MIT.

> ⚠️ **Projeto criado exclusivamente para fins de aprendizado.** Não é recomendado para uso em produção.

---

<p align="center">
  Feito com 💜 por <a href="https://github.com/felCarvalho">felCarvalho</a>
</p>
