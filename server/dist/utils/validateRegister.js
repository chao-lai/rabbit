"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    const { email, username, password } = options;
    if (!email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (username.length < 6) {
        return [
            {
                field: "username",
                message: "Username must be at least 6 characters",
            },
        ];
    }
    if (username.includes("@")) {
        return [
            {
                field: "username",
                message: "Username cannot contain @ characters",
            },
        ];
    }
    const error = exports.validatePassword(password);
    if (error) {
        return error;
    }
    return null;
};
exports.validatePassword = (password) => {
    if (password.length < 6) {
        return [
            {
                field: "newPassword",
                message: "Password must be at least 6 characters",
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map