import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().port().default(4000),
        HOST: Joi.string().hostname().default('0.0.0.0'),
        API_BASE_URL: Joi.string().uri().default('http://localhost:4000'),
        SHELL_BASE_URL: Joi.string().uri().default('http://localhost:3000'),
        SESSION_COOKIE_NAME: Joi.string().default('session'),
        JWT_SECRET: Joi.string().min(16).required(),
        // Optional WorkOS settings; when both set we enable real SSO flow
        WORKOS_API_KEY: Joi.string().optional(),
        WORKOS_CLIENT_ID: Joi.string().optional(),
        // Optional DB settings for future drizzle integration
        DATABASE_URL: Joi.string().uri().optional(),
      }).unknown(true),
    }),
  ],
})
export class AppConfigModule {}
