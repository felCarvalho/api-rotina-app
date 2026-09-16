import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.ORIGIN_URL_LOCAL);
  app.enableCors({
    origin: [process.env.ORIGIN_URL_LOCAL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });

  app.use(cookieParser(process.env.SECRET_COOKIES));

  const config = new DocumentBuilder()
    .setTitle('API Rotina App')
    .setDescription('API REST para gerenciamento de rotinas e tarefas')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e sessões')
    .addTag('task', 'Gerenciamento de tarefas')
    .addTag('category', 'Gerenciamento de categorias')
    .addTag('user', 'Dados do usuário')
    .addTag('verify', 'Verificação de dados existentes')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  console.log(process.env.PORT);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

/*
api:
  build: .
  container_name: 'api-rotina-app'
  ports:
    - '${API_PORT}:3333'
  env_file:
    - .env.database
  environment:
    - DB_HOST=db
  depends_on:
    - db
  networks:
    - rede_interna*/
