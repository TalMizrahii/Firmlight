import { config } from 'dotenv';
config({ path: './conf.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS setup
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
      .setTitle('Firmlight API')
      .setDescription('The API documentation for Firmlight.')
      .setVersion('1.2')
      .addTag('tasks')
      .addTag('groups')
      .addTag('auth')
      .addTag('users')
      .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Serve static files from the public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Serve React app for any undefined routes, but exclude API routes
  app.use((req, res, next) => {
    // If the request is for a static file or an API route, let it pass through
    if (req.path.startsWith('/static/') ||
        req.path.includes('.') ||
        req.path.startsWith('/auth/') ||
        req.path.startsWith('/api/') ||
        req.path.startsWith('/tasks/') ||
        req.path.startsWith('/groups/') ||
        req.path.startsWith('/users') ||
        req.path.startsWith('/users/')) {


      return next();
    }
    // Serve React's index.html for all other routes
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });

  await app.listen(process.env.PORT);
}

process.on('warning', (warning) => {
  console.warn(warning.stack);
});

bootstrap().then(() => {
  console.log('Server is running!');
  console.log(process.env.PORT);
});