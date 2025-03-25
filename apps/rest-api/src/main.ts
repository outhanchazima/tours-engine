// Import this first to ensure that the instrument module is loaded first for proper lgging in sentry
import './sentry-config';

// Now import other modules
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './features/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // secure app by setting various HTTP headers.
  app.use(helmet());

  // enable gzip compression.
  app.use(compression());

  // Cors
  app.enableCors({ origin: '*' });

  // Show Swagger API Docs if ALLOW_SWAGGER is set to true
  if (process.env.ALLOW_SWAGGER) {
    const config = new DocumentBuilder()
      .setTitle('Tour Booking API')
      .setDescription('The tour booking API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Start the app on the specified port default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  Logger.log(`Swagger API Docs running at: ${await app.getUrl()}` + '/api');
}

bootstrap();
