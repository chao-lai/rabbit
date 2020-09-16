import { AuthInput } from "../resolvers/AuthInput";

export const validateRegister = (options: AuthInput) => {
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

  const error = validatePassword(password);
  if (error) {
    return error;
  }

  return null;
};

export const validatePassword = (password: string) => {
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
