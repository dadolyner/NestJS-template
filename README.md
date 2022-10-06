# NestJS Template

---

### Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [How To Use](#how-to-use)
    - [Installation](#installation)
    - [Setup environment variables](#setup-environment-variables)
    - [Run the application](#run-the-application)
    - [Tests](#tests)
    - [Access](#access)
- [Premade Modules](#premade-modules)
- [Author Info](#author-info)

---

### Description

This is a template for NestJS applications. It includes the following features/packages:
Fastify platform, TypeORM with PostgreSQL, JWT authentication with passport, swagger documentation and git.
It also includes a premade auth module with register, login, logout and refresh token endpoints.

---

### Technologies

- NestJS
- Fastify
- TypeORM
- Typescript
- PostgreSQL
- JWT
- Nodemailer
- Swagger
- Env
- Git

---

### How To Use

#### Installation

Follow these instructions to install and setup the application

```bash
# Clone repository
$ git clone https://github.com/dadolyner/NestJS-template
```

```bash
# Install NestJS CLI
$ npm install -g @nestjs/cli npm-check-updates

# Update NestJS CLI to the latest version
$ nest update
$ nest update --force
```

```bash
# Install dependencies
$ npm i
```

#### Setup environment variables

```ts
// In the root directory create env folder
// In the env folder create .env file for each enviroment and add your variables

// .env.development
// .env.production
// .env.test

// Required variables
SERVER_IP=
PORT=

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_ACCESSTOKEN_SECRET
JWT_REFRESHTOKEN_SECRET
COOKIE_SECRET
```

#### Run the application

```bash
# Run the application in production mode
$ npm run start
```

```bash
# Run the application in development mode
$ npm run start:dev
```

```bash
# Run the application in test mode
$ npm run tests
```

#### Access

```ts
// To access the application go to http://localhost:3000
// To access the swagger documentation go to http://localhost:3000/documentation
```

---

### Premade Modules

#### Authentication
```ts
// @UseGuards(AuthGuard)   ->   Protects the route with JWT authentication
// @Post('/auth/register') ->   Register User
// @Post('/auth/login')    ->   Login User and store JWT in cookies
// @Post('/auth/refresh')  ->   Refresh users access token (protected route)
// @Post('/auth/logout')   ->   Logout user and clear cookies (protected route)

// @Roles(['roles'])       ->   Protects the route with permission roles
// @UseGuards(RoleGuard)   ->   Protects the route with permission roles
// @Patch('/auth/role')    ->   Change users roles (protected route by admin role)
// @Delete('/auth/role')   ->   Delete users roles and set default roles (protected route by admin role)
```

---

### Author Info

- Github - [@dadolyner](https://github.com/dadolyner)