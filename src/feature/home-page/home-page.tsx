import { Component } from 'react';
import { ErrorComponent, Search, Spinner } from '@lib';
import { peopleService } from '@services';
import { LOADING_STATE, People, SearchResult } from '@utils';
import { HomePageItems } from './home-page-items/home-page-items';
import './home-page.css';

interface HomePageState {
  searchValue: string;
  items: People[];
  loadingState: LOADING_STATE;
  showError: boolean;
}

export class HomePage extends Component<object, HomePageState> {
  private searchItemKey = 'searchItem';
  private isPageAvailable = false;

  getSeachValueFromStore = (): string => {
    return window.localStorage.getItem(this.searchItemKey) ?? '';
  };

  state: HomePageState = {
    searchValue: this.getSeachValueFromStore(),
    items: [],
    loadingState: LOADING_STATE.PRESTINE,
    showError: false,
  };

  pageTitle = 'People of Star Wars';
  resultTitleFull = 'Full list (1 page)';
  resultTitleSearch = 'Search result for';
  errorMessageInfo = 'Please, try one more time';
  searchPlaceholder = 'Input Name from Star Wars';
  throwErrorButtonText = 'Trow Error';

  componentDidMount = () => {
    this.isPageAvailable = true;
    this.startSearch();
  };

  componentWillUnmount = () => {
    this.isPageAvailable = false;
  };

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
    if (!this.isPageAvailable) return;
    this.setState({ loadingState: LOADING_STATE.LOADING }, () =>
      this.getItems(this.state.searchValue)
    );
  };

  getItems = (value: string) => {
    peopleService
      .getItems(value)
      .then((data: SearchResult<People>) => this.updateItems(data))
      .catch(() => this.showDataError());
  };

  updateItems = (data: SearchResult<People>) => {
    if (!this.isPageAvailable) return;
    this.setState({ loadingState: LOADING_STATE.LOADED, items: data.results });
  };

  showDataError = () => {
    if (!this.isPageAvailable) return;
    this.setState({ loadingState: LOADING_STATE.FAILURE, items: [] });
  };

  getResultTitle = (): string => {
    return this.state.searchValue
      ? `${this.resultTitleSearch} "${this.state.searchValue}"`
      : this.resultTitleFull;
  };

  showPageError = () => {
    this.setState({ showError: true });
  };

  throwError = () => {
    throw new Error('Error, thrown by clicking the "Throw Error" button');
  };

  render() {
    if (this.state.showError) {
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
