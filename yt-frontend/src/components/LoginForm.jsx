import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/auth.hook";
import { Input, SpButton } from "./index.js";

function LoginForm({ onLogin }) {
  const schema = z.object({
    usernameOrEmail: z
      .string()
      .min(3, "Username or email must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync: login, isPending, isError, error } = useLogin();

  const loginUser = async (data) => {
    try {
      const session = await login(data);
      if (session) {
        onLogin(session);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(loginUser)} className="flex flex-col">
      <Input
        label={"Username/Email*"}
        type="text"
        placeholder="johnwick7"
        id={"username"}
        {...register("usernameOrEmail", { required: true })}
      />
      {errors.usernameOrEmail && (
        <span className="text-red-500 text-sm dark:text-red-400">
          {errors.usernameOrEmail.message}
        </span>
      )}

      <Input
        label={"Password*"}
        type="password"
        placeholder="*******"
        id={"password"}
        {...register("password", { required: true })}
        className="mb-4"
      />
      {errors.password && (
        <span className="text-red-500 text-sm dark:text-red-400">
          {errors.password.message}
        </span>
      )}

      {/* Handling the login failure */}
      {isError && (
        <span className="text-red-500">
          {error?.message || "Failed to login. Please try again."}
        </span>
      )}

      <SpButton
        type="submit"
        className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
      >
        {isPending ? "Logging In" : "Login"}
      </SpButton>
    </form>
  );
}

export default LoginForm;
