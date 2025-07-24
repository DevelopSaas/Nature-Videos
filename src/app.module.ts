
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: process.env.DB_PASSWORD,
            database: 'nature_videoes',
            entities: [Auth],
            synchronize: true,
        }),
        AuthModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 60 * 1000,
                limit: 50,
                name: 'hourly_limit',
            },
        ]),
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 60,
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}