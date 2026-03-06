import { Component } from "react";

/**
 * Error boundary that catches WebGL / Three.js rendering failures
 * and shows a helpful fallback message instead of a blank crash.
 */
export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unknown error" };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">
            3D rendering is not available
          </h3>
          <p className="text-sm mb-2">
            WebGL could not be initialized on this device. This is usually caused
            by missing or blocklisted GPU drivers.
          </p>
          <p className="text-xs text-yellow-600">
            Try switching to the <strong>2D</strong> view, or launch Electron
            with <code>--ignore-gpu-blocklist</code>.
          </p>
          <p className="text-xs text-yellow-500 mt-2">
            {this.state.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
