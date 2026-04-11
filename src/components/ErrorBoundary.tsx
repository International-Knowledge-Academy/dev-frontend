import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", fontFamily: "monospace", maxWidth: "700px", margin: "0 auto" }}>
          <h1 style={{ color: "#c00", fontSize: "1.5rem", marginBottom: "16px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", marginBottom: "12px" }}>
            The application encountered an error. Please check the browser console for details.
          </p>
          <pre style={{ background: "#f5f5f5", padding: "16px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem", color: "#333" }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "16px", padding: "10px 20px", background: "#1a3c6e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
