"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.use("/login", auth_1.login);
exports.authRouter.use("/signup", auth_1.signup);
