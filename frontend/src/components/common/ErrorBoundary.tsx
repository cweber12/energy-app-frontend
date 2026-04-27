// frontend/src/components/common/ErrorBoundary.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: "var(--space-4)", color: "var(--color-text-secondary)" }}>
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
