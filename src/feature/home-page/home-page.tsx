import { Component, Context } from 'react';
import Search from '../../lib/search/search';
import { LOADING_STATE } from '../../utils/loading-state.enum';
import Spinner from '../../lib/spinner/spinner';
import { ErrorContext, ErrorContextState } from '../../utils/error-context';

interface HomePageState {
  searchValue: string;
  loadingState: LOADING_STATE;
}

class HomePage extends Component<object, HomePageState> {
  static contextType: Context<ErrorContextState> = ErrorContext;

  private searchItemKey = 'searchItem';

  state: HomePageState = {
    searchValue: this.getSeachValueFromStore(),
    loadingState: LOADING_STATE.PRESTINE,
  };

  // componentDidMount() {
  //   this.startSearch();
  // }

  getSeachValueFromStore(): string {
    return window.localStorage.getItem(this.searchItemKey) ?? '';
  }

  updateSeachValueInStore = (value: string) => {
    window.localStorage.setItem(this.searchItemKey, value);
  };

  updateSearchValue = (searchValue: string) => {
    this.updateSeachValueInStore(searchValue);
    this.setState({ searchValue }, this.startSearch);
  };

  startSearch = (value?: string) => {
    this.setState({ loadingState: LOADING_STATE.LOADING });
    console.log('startSearch', this.state.searchValue, value);
  };

  showPageError = () => {
    (this.context as ErrorContextState).updateShowError(true);
  };

  throwError = () => {
    throw new Error('Error, thrown by clicking the "Throw Error" button');
  };

  render() {
    if ((this.context as ErrorContextState).showError) {
      this.throwError();
    }
    return (
      <main>
        <section>
          <Search
            initialSearchValue={this.state.searchValue}
            updateSearchValue={this.updateSearchValue}
            placeholder="Input Pokemon Name"
          />
        </section>
        <section>
          <button onClick={this.showPageError}>Throw Error</button>
        </section>
        {this.state.loadingState === LOADING_STATE.LOADING && <Spinner />}
      </main>
    );
  }
}

export default HomePage;
