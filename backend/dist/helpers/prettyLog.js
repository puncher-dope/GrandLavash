"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = log;
const chalk_1 = __importDefault(require("chalk"));
const theme = {
    success: chalk_1.default.bgGreen,
    warning: chalk_1.default.bgYellow,
    error: chalk_1.default.bgRed,
    info: chalk_1.default.bgBlue,
    highlight: chalk_1.default.bgCyan,
    muted: chalk_1.default.bgGray
};
function log(type, message) {
    console.log(theme[type](`${message}`));
}
