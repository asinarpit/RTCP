"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
        success: false,
        message
    });
};
exports.errorHandler = errorHandler;
