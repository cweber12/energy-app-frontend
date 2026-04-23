import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";
import type { RegisterForm } from "../../../types/userTypes";
import { supabase } from "../../lib/supabaseClient";
import "../../App.css";
import "../../styles/Components.css";
import AuthFormWrapper from "../common/AuthFormWrapper";

const Register: React.FC = () => {
  const { colors } = useTheme();
  const [message, setMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (form) => {
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username }
        }
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage("Check your email to confirm your account.");
      } else {
        setMessage(`Account created for ${form.username}! You can now log in.`);
      }
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <AuthFormWrapper>
      <h2 style={{
        marginBottom: "var(--space-4)",
        fontSize: "var(--font-xl)",
        color: colors.primaryText,
      }}>Create Account</h2>
      <form
        className="form auth-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          {...register("username", { required: true })}
          placeholder="Username"
        />
        {errors.username && (
          <span style={{ color: colors.warning, fontSize: "var(--font-xs)" }}>Username is required</span>
        )}

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email address"
        />
        {errors.email && (
          <span style={{ color: colors.warning, fontSize: "var(--font-xs)" }}>Email is required</span>
        )}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        {errors.password && (
          <span style={{ color: colors.warning, fontSize: "var(--font-xs)" }}>Password is required</span>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "var(--space-3)",
            width: "100%",
            height: "44px",
            fontSize: "var(--font-base)",
            backgroundColor: isSubmitting ? colors.buttonDisabled : colors.button,
            color: colors.buttonText,
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: 500,
            opacity: isSubmitting ? 0.55 : 1,
          }}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <p style={{ color: colors.warning, marginTop: "var(--space-3)", fontSize: "var(--font-sm)" }}>{message}</p>
      )}
    </AuthFormWrapper>
  );
};

export default Register;