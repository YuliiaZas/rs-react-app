import { Component } from 'react';
import './App.css';
import HomePage from './feature/home-page/home-page';
import ErrorBoundary from './feature/error-boundary/error-boundary';

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
