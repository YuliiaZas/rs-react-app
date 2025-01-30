import {
  ChangeEvent,
  Component,
  createRef,
  KeyboardEvent,
  RefObject,
} from 'react';

interface SearchProps {
  initialSearchValue: string;
  placeholder: string;
  updateSearchValue: (value: string) => void;
}

interface SearchState {
  currentValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  static defaultProps: Partial<SearchProps> = { placeholder: 'Input Value' };

  state: SearchState = {
    currentValue: this.props.initialSearchValue,
  };

  searchButton: RefObject<HTMLButtonElement> = createRef();

  updateCurrentValue = (e: ChangeEvent) => {
    this.setState({
      currentValue: (e.target as HTMLInputElement).value,
    });
  };

  updateSearchValue = () => {
    this.props.updateSearchValue(this.state.currentValue);
  };

  handleButtonClick = () => {
    this.updateSearchValue();
    this.blurSearchButton();
  };

  handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.updateSearchValue();
    }
  };

  blurSearchButton = () => {
    this.searchButton.current?.blur();
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
          ref={this.searchButton}
          onClick={this.handleButtonClick}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
