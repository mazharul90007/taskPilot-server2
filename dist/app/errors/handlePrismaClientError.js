"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaClientError = (err) => {
    var _a, _b, _c, _d;
    let message = "Database error occurred";
    const errorSources = [];
    switch (err.code) {
        case "P2002": {
            // Unique constraint failed
            const target = Array.isArray((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) &&
                ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target.every((t) => typeof t === "string"))
                ? err.meta.target.join(", ")
                : "";
            message = `${target} must be unique`;
            errorSources.push({
                path: target || "unknown_field",
                message,
            });
            break;
        }
        case "P2003": {
            // Foreign key constraint failed
            const field = typeof ((_c = err.meta) === null || _c === void 0 ? void 0 : _c.field_name) === "string"
                ? err.meta.field_name
                : "unknown_field";
            message = `Foreign key constraint failed on field: ${field}`;
            errorSources.push({
                path: field,
                message,
            });
            break;
        }
        case "P2025": {
            // Record to update/delete does not exist
            message =
                typeof ((_d = err.meta) === null || _d === void 0 ? void 0 : _d.cause) === "string"
                    ? err.meta.cause
                    : "Record not found";
            errorSources.push({
                path: "",
                message,
            });
            break;
        }
        default: {
            errorSources.push({
                path: "",
                message: err.message,
            });
        }
    }
    return {
        statusCode: 400,
        message,
        errorSources,
    };
};
exports.default = handlePrismaClientError;
