import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-6 text-center bg-red-50 border border-red-300 rounded-lg">
            <h1 className="text-2xl font-bold text-red-700">
              ⚠️ Something went wrong
            </h1>
            {this.state.error && (
              <p className="mt-2 text-sm text-red-600">
                {this.state.error.toString()}
              </p>
            )}
            {this.state.errorInfo && (
              <details className="mt-2 text-gray-600 text-xs">
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
