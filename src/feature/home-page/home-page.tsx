import { Component, Context } from 'react';
import Search from '../../lib/search/search';
import { LOADING_STATE } from '../../utils/loading-state.enum';
import Spinner from '../../lib/spinner/spinner';
import { ErrorContext, ErrorContextState } from '../../utils/error-context';
import { SearchResult } from '../../utils/search-result.interface';
import { People } from '../../utils/people.interface';

interface HomePageState {
  searchValue: string;
  items: People[];
  loadingState: LOADING_STATE;
}

class HomePage extends Component<object, HomePageState> {
  static contextType: Context<ErrorContextState> = ErrorContext;

  private searchItemKey = 'searchItem';

  state: HomePageState = {
    searchValue: this.getSeachValueFromStore(),
    items: [],
    loadingState: LOADING_STATE.PRESTINE,
  };

  url = 'https://swapi.dev/api/people?search=';

  componentDidMount() {
    this.startSearch();
  }

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
    this.getItems(value || this.state.searchValue);
  };

  getItems = (value: string) => {
    fetch(`${this.url}${value}`)
      .then((response) => response.json())
      .then((data: SearchResult<People>) => this.updateItems(data))
      .catch(() => this.showDataError());
  };

  updateItems(data: SearchResult<People>) {
    this.setState({ loadingState: LOADING_STATE.LOADED, items: data.results });
  }

  showDataError() {
    this.setState({ loadingState: LOADING_STATE.FAILURE, items: [] });
  }

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
            placeholder="Input Name from Star Wars"
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
