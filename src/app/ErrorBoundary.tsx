import React, { Component, ErrorInfo } from "react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="flex justify-center items-center text-2xl flex-col gap-4">
          Oops! Something went wrong. Refresh the page and try again later.
          <Image src="/error.svg" width={64} height={64} alt="Error icon" />
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
