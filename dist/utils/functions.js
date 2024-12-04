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
exports.HashrateConverter = exports.pingServer = void 0;
const ping_1 = __importDefault(require("ping"));
const pingServer = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield ping_1.default.promise.probe(ip);
    return res.alive;
});
exports.pingServer = pingServer;
class HashrateConverter {
    // Converts petahashes per second (PH/s) to hashes per second (H/s)
    static petahashesToHashes(ph) {
        return ph * 1e15;
    }
    // Converts terahashes per second (TH/s) to hashes per second (H/s)
    static terahashesToHashes(th) {
        return th * 1e12;
    }
    // Converts gigahashes per second (GH/s) to hashes per second (H/s)
    static gigahashesToHashes(gh) {
        return gh * 1e9;
    }
    // Converts megahashes per second (MH/s) to hashes per second (H/s)
    static megahashesToHashes(mh) {
        return mh * 1e6;
    }
    // Converts kilohashes per second (kH/s) to hashes per second (H/s)
    static kilohashesToHashes(kh) {
        return kh * 1e3;
    }
    // Converts hashes per second (H/s) to petahashes per second (PH/s)
    static hashesToPetahashes(h) {
        return h / 1e15;
    }
    // Converts hashes per second (H/s) to terahashes per second (TH/s)
    static hashesToTerahashes(h) {
        return h / 1e12;
    }
    // Converts hashes per second (H/s) to gigahashes per second (GH/s)
    static hashesToGigahashes(h) {
        return h / 1e9;
    }
    // Converts hashes per second (H/s) to megahashes per second (MH/s)
    static hashesToMegahashes(h) {
        return h / 1e6;
    }
    // Converts hashes per second (H/s) to kilohashes per second (kH/s)
    static hashesToKilohashes(h) {
        return h / 1e3;
    }
}
exports.HashrateConverter = HashrateConverter;
