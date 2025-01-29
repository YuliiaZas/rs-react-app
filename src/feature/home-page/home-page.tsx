import { Component } from 'react';
import Search from '../../lib/search/search';
import { LOADING_STATE } from '../../utils/loading-state.enum';
import Spinner from '../../lib/spinner/spinner';

interface HomePageState {
  searchValue: string;
  loadingState: LOADING_STATE;
}

class HomePage extends Component<HomePageState> {
  private searchItemKey = 'searchItem';

  state = {
    searchValue: this.getSeachValueFromStore(),
    loadingState: LOADING_STATE.PRESTINE,
  };

  getSeachValueFromStore(): string {
    return window.localStorage.getItem(this.searchItemKey) ?? '';
  }

  updateSeachValueInStore = (value: string) => {
    window.localStorage.setItem(this.searchItemKey, value);
  };

  updateSearchValue = (searchValue: string) => {
    this.setState({ searchValue });
    this.updateSeachValueInStore(searchValue);

    this.startSearch(searchValue);
  };

  startSearch(value: string) {
    this.setState({ loadingState: LOADING_STATE.LOADING });
    console.log(this.state, value);
  }

  render() {
    return (
      <div>
        <Search
          initialSearchValue={this.state.searchValue}
          updateSearchValue={this.updateSearchValue}
          placeholder="Input Pokemon Name"
        />
        {this.state.loadingState === LOADING_STATE.LOADING && <Spinner />}
      </div>
    );
  }
}

export default HomePage;
