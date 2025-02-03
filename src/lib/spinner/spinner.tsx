import { Component } from 'react';
import './spinner.css';

export class Spinner extends Component {
  render() {
    return (
      <div className="spinner-wrapper">
        <div className="spinner-border"></div>
      </div>
    );
  }
}
