import { Component } from 'react';
import { ErrorBoundary } from '@error-boundary';
import { HomePage } from '@home-page';
import './App.css';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>
    );
  }
}

export default App;
