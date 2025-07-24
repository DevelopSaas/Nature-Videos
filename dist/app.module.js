"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_entity_1 = require("./auth/entities/auth.entity");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: process.env.DB_PASSWORD,
                database: 'nature_videoes',
                entities: [auth_entity_1.Auth],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60 * 60 * 1000,
                    limit: 50,
                    name: 'hourly_limit',
                },
            ]),
            cache_manager_1.CacheModule.register({
                store: redisStore,
                host: 'localhost',
                port: 6379,
                ttl: 60,
            }),
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map