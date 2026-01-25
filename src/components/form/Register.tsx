import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { registerWithSupabase } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import type { RegisterForm } from "../../../types/userTypes";
import "../../App.css";
import "../../styles/Components.css";
import FormWrapper from "../common/FormWrapper";

const Register: React.FC = () => {
  const { colors } = useTheme();
  const [message, setMessage] = React.useState<string | null>(null);

  const {
    register,      // react-hook-form register
    handleSubmit,  // react-hook-form handleSubmit
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (form) => {
    setMessage(null);

    const result = await registerWithSupabase(
        form.email,
        form.password,
        form.username
        );

        if (result.errorMessage) {
            setMessage(result.errorMessage);
            return;
        }

        if (!result.sessionExists) {
            setMessage("Check your email to confirm your account.");
        } else {
            setMessage(`Account created for ${form.username}! You can now log in.`);
        }
  };

  return (
    <FormWrapper>
      <h2>Register</h2>

      <form
        className="form auth-form"
        style={{ width: "300px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          {...register("username", { required: true })}
          placeholder="Username"
        />
        {errors.username && (
          <span style={{ color: colors.warning }}>*Username* is mandatory</span>
        )}

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
        />
        {errors.email && (
          <span style={{ color: colors.warning }}>*Email* is mandatory</span>
        )}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        {errors.password && (
          <span style={{ color: colors.warning }}>*Password* is mandatory</span>
        )}

        <input
          type="submit"
          value={isSubmitting ? "Registering..." : "Register"}
          disabled={isSubmitting}
          style={{ backgroundColor: colors.button, color: colors.buttonText }}
        />
      </form>

      {message && (
        <p style={{ color: colors.warning, marginTop: "1rem" }}>{message}</p>
      )}
    </FormWrapper>
  );
};

export default Register;