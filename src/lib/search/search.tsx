import { ChangeEvent, Component, KeyboardEvent } from 'react';

interface SearchProps {
  initialSearchValue: string;
  placeholder: string;
  updateSearchValue: (value: string) => void;
}

interface SearchState {
  currentValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  static defaultProps = { placeholder: 'Input Value' };

  state = {
    currentValue: this.props.initialSearchValue,
  };

  updateSearchValue = () => {
    this.props.updateSearchValue(this.state.currentValue);
  };

  updateCurrentValue = (e: ChangeEvent) => {
    if (e.target) {
      this.setState({
        currentValue: (e.target as HTMLInputElement).value,
      });
    }
  };

  handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.updateSearchValue();
    }
  };

  render() {
    return (
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={this.props.placeholder}
          value={this.state.currentValue}
          onChange={this.updateCurrentValue}
          onKeyDown={this.handleInputKeyDown}
        />
        <button
          type="submit"
          className="search-button"
          onClick={this.updateSearchValue}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
