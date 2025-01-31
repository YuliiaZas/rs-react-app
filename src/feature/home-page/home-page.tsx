import { Component, Context } from 'react';
import Search from '../../lib/search/search';
import { LOADING_STATE } from '../../utils/loading-state.enum';
import Spinner from '../../lib/spinner/spinner';
import { ErrorContext, ErrorContextState } from '../../utils/error-context';
import { SearchResult } from '../../utils/search-result.interface';
import { People } from '../../utils/people.interface';
import HomePageItems from './home-page-items/home-page-items';
import ErrorComponent from '../../lib/error/error';
import './home-page.css';

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

  pageTitle = 'People of Star Wars';
  resultTitleFull = 'Full list (1 page)';
  resultTitleSearch = 'Search result for';
  errorMessageInfo = 'Please, try one more time';
  searchPlaceholder = 'Input Name from Star Wars';
  throwErrorButtonText = 'Trow Error';
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
    const trimmedSeachValue = searchValue.trim();
    if (trimmedSeachValue === this.state.searchValue) {
      this.startSearch();
      return;
    }

    this.updateSeachValueInStore(trimmedSeachValue);
    this.setState({ searchValue: trimmedSeachValue }, this.startSearch);
  };

  startSearch = () => {
    this.setState({ loadingState: LOADING_STATE.LOADING });
    this.fetchItems(this.state.searchValue);
  };

  fetchItems = (value: string) => {
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

  getResultTitle(): string {
    return this.state.searchValue
      ? `${this.resultTitleSearch} "${this.state.searchValue}"`
      : this.resultTitleFull;
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
      <>
        <main className="home-main">
          <section className="home-seach">
            <Search
              initialSearchValue={this.state.searchValue}
              updateSearchValue={this.updateSearchValue}
              placeholder={this.searchPlaceholder}
            />
          </section>
          <section className="home-content">
            <h1 className="home-content-title">{this.pageTitle}</h1>
            <section className="home-content-card">
              {this.state.loadingState === LOADING_STATE.FAILURE ? (
                <ErrorComponent errorMessageInfo={this.errorMessageInfo} />
              ) : this.state.loadingState === LOADING_STATE.LOADING ? (
                <div className="home-content-card-empty"></div>
              ) : (
                <HomePageItems
                  title={this.getResultTitle()}
                  items={this.state.items}
                />
              )}
            </section>
          </section>
          <section className="home-error">
            <button className="home-error-button" onClick={this.showPageError}>
              {this.throwErrorButtonText}
            </button>
          </section>
        </main>
        {this.state.loadingState === LOADING_STATE.LOADING && <Spinner />}
      </>
    );
  }
}

export default HomePage;
