import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  // console.log(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
