import { Component, Context, createContext, PropsWithChildren } from 'react';

interface ErrorContextProviderState {
  showError: boolean;
}

interface ErrorContextState extends ErrorContextProviderState {
  updateShowError: (showError: boolean) => void;
}

const ErrorContext: Context<ErrorContextState> =
  createContext<ErrorContextState>({
    showError: false,
    updateShowError: () => {},
  });

class ErrorContextProvider extends Component<
  PropsWithChildren,
  ErrorContextProviderState
> {
  state: ErrorContextProviderState = { showError: false };

  updateShowError = (showError: boolean) => {
    this.setState({ showError });
  };

  render() {
    return (
      <ErrorContext.Provider
        value={{
          showError: this.state.showError,
          updateShowError: this.updateShowError,
        }}
      >
        {this.props.children}
      </ErrorContext.Provider>
    );
  }
}

export { ErrorContext, ErrorContextProvider };
export type { ErrorContextState };
