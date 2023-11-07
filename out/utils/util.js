"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.delay = void 0;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.delay = delay;
exports.Util = {
    isScript(file) {
        return file.endsWith('.js');
    }
};
