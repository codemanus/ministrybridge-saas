import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import detect from 'detect-port';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const requested = Number(process.env.PORT || 4000);
  const host = process.env.HOST || '0.0.0.0';

  const port = await detect(requested);
  if (port !== requested) {
    // eslint-disable-next-line no-console
    console.warn(
      `[api] Port ${requested} in use, switching to ${port} (set PORT to override)`,
    );
  }

  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  
  // Register cookie plugin on the underlying Fastify instance
  await app.getHttpAdapter().getInstance().register(fastifyCookie);
  
  await app.enableCors({ origin: true, credentials: true });
  await app.listen(port, host);

  // eslint-disable-next-line no-console
  console.log(`API listening on http://${host}:${port}`);
}
bootstrap();
