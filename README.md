# NestJS Template

### Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [How To Use](#how-to-use)
    - [Installation](#installation)
    - [Setup environment variables](#setup-environment-variables)
    - [Setup modules](#setup-modules)
    - [Run the application](#run-the-application)
    - [Tests](#tests)
- [Author Info](#author-info)

---

### Description

This is a template for NestJS applications. It includes the following features/packages:
Fastify platform, TypeORM with PostgreSQL, JWT authentication with passport, swagger documentation and git.

---

### Technologies

- Typescript
- NestJS
- Fastify
- PostgreSQL
- TypeORM
- JWT
- Nodemailer
- Swagger
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

// Where you want to use environment variables add this to the top of the file
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, `../env/.env.${process.env.ENVIROMENT}`) })
```

#### Setup modules

```ts
// To connect entity to module add it to the imports array in the module
TypeOrmModule.forFeature([Test])
```

```ts
// To connect entity to service add it to the constructor of the service
constructor( @InjectRepository(Test) private readonly testRepository: Repository<Test> ) { }
```

```ts
// To connect service to constroller add it to the constructor of the constroller
constructor(private readonly appService: AppService) { }
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

---

### Author Info

- Github - [@dadolyner](https://github.com/dadolyner)