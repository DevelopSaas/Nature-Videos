"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAuthDto {
    gmail;
    password;
}
exports.CreateAuthDto = CreateAuthDto;
__decorate([
    (0, class_validator_1.IsString)({ message: "Gmail stringda kiritilishi shart!" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MinLength)(3, { message: "Kiritilgan gmail 3 ta belgidan kam bo'lmasligi shart!" }),
    (0, class_validator_1.MaxLength)(70, { message: "Kiritlgan gmail 70 ta belgidan ko'p bo'lmasligi shart!" }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "gmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: "Kiritilgan password 6 ta belgidan kam bo'lmasligi shart!" }),
    (0, class_validator_1.MaxLength)(100, { message: "Kiritlgan password 100 ta belgidan ko'p bo'lmasligi shart!" }),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "password", void 0);
//# sourceMappingURL=create-auth.dto.js.map