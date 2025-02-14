import { Component, ErrorInfo, PropsWithChildren } from 'react';
import { ErrorComponent } from '@lib';
import { text } from '@utils';

interface ErrorBoundaryState {
  error: null | Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  state: ErrorBoundaryState = { error: null };

  componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
    this.logError(error.message, errorInfo.componentStack ?? '-');
  };

  logError = (errorMessage: string, errorInfoStack: string) => {
    console.log(`
      \n ===========
      \n ErrorBoundary component catch the next error:
      \n ${errorMessage},
      \n with errorinfo:
      \n ${errorInfoStack}
      \n
      \n User can return to the previous view using the button "Home Page"
      \n ===========`);
  };

  handleButtonClick = () => {
    this.resetErrorBoundary();
    this.redirectToHomePage();
  };

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  redirectToHomePage = () => {
    console.log(text.errorBoundary.redirectMessage);
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorComponent
          showButton={true}
          buttonClick={this.handleButtonClick}
        />
      );
    }
    return this.props.children;
  }
}
