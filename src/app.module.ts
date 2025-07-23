import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
        type: "postgres",
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'nature_videoes',
        entities: [Auth],
        synchronize: true,
    }), AuthModule]
})
export class AppModule { }
