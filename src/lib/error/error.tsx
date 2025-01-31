import { Component } from 'react';
import './error.css';

interface ErrorComponentProps {
  errorMessage: string;
  errorMessageInfo?: string;
  showButton: boolean;
  buttonMessage: string;
  buttonClick?: () => void;
}

class ErrorComponent extends Component<ErrorComponentProps> {
  static defaultProps: Partial<ErrorComponentProps> = {
    showButton: false,
    errorMessage: 'Ooops! Something went wrong...',
    buttonMessage: 'Home Page',
  };

  render() {
    return (
      <div className="error-wrapper">
        <p className="error-message">{this.props.errorMessage}</p>
        {this.props.errorMessageInfo && (
          <p className="error-message-info">{this.props.errorMessageInfo}</p>
        )}
        {this.props.showButton && (
          <button className="error-button" onClick={this.props.buttonClick}>
            {this.props.buttonMessage}
          </button>
        )}
      </div>
    );
  }
}

export default ErrorComponent;
