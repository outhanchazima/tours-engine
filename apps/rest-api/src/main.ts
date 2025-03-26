// Import this first to ensure that the instrument module is loaded first for proper lgging in sentry
import './sentry-config';

// Now import other modules
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './features/app.module';
import { AllExceptionsFilter } from './shared/filters/all-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // secure app by setting various HTTP headers.
  app.use(helmet());

  // enable gzip compression.
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe());

  // Set Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Set Global filter (exception filter)
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Use the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Cors
  app.enableCors({ origin: '*' });

  // Show Swagger API Docs if ALLOW_SWAGGER is set to true
  if (process.env.ALLOW_SWAGGER) {
    const config = new DocumentBuilder()
      .setTitle('Tour Booking API')
      .setDescription('The tour booking API description')
      .setVersion('1.0')
      .addBearerAuth()
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
