import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const PORT = process.env.PORT
    await app.listen(PORT ?? 3000, () => {
        console.log(`Server is running at: ${PORT}`)
    });
}
bootstrap();
