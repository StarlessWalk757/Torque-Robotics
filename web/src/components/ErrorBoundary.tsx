import { Component, type ReactNode } from "react";

// has to be a class. hooks can't catch render errors, this is the one place React still needs one
// without it a single bad lesson blanks the entire site instead of just that page
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  // React calls this when a child throws, and whatever it returns becomes the new state
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="wrap page narrow">
          <h1>Something went wrong on this page</h1>
          <p className="muted">{this.state.error.message}</p>
          <p><button className="btn" onClick={() => location.reload()}>Reload</button> <a href="#/">Go home</a></p>
        </div>
      );
    }
    return this.props.children;
  }
}
