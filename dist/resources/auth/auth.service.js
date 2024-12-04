"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOmit = void 0;
const jwtToken_1 = __importDefault(require("../../utils/jwtToken"));
const lodash_1 = require("lodash");
const prismaClient_1 = require("../../utils/prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.adminOmit = ['password'];
class AuthService {
    getAdminAccount(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.admin.findUnique({ where: { username } });
        });
    }
    getAdminAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.admin.findUnique({ where: { id } });
        });
    }
    createAdminAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const password = yield bcrypt_1.default.hash(input.password, salt);
            return prismaClient_1.prisma.admin.create({ data: Object.assign(Object.assign({}, input), { password }) });
        });
    }
    isValidPassword(password, DBpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt_1.default.compare(password, DBpassword);
            }
            catch (err) {
                throw new Error("Invalid password");
            }
        });
    }
    /**
     * Attempt to login a user
     */
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.getAdminAccount(input.username);
                if (!admin) {
                    throw new Error('Wrong username or password');
                }
                if (yield this.isValidPassword(input.password, admin.password)) {
                    //Checks if the account is verified
                    if (admin.status === 'INACTIVE') {
                        throw new Error('Account is not active');
                    }
                    return {
                        token: jwtToken_1.default.createJwtToken(admin),
                        admin: (0, lodash_1.omit)(admin, exports.adminOmit),
                    };
                }
                else {
                    throw new Error('Wrong username or password');
                }
            }
            catch (error) {
                throw new Error(error.message + `- ${input.username}`);
            }
        });
    }
}
exports.default = AuthService;
