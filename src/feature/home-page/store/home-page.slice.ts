import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { CurrentSearchParams, People } from '@utils';
import { apiSlice } from './home-page-api.slice';

interface HomePageState {
  search: CurrentSearchParams;
  isSearchSyncronizedWithLS: boolean;
  isItemsLoading: boolean;
  pagesNumber: number;
  selectedItems: Record<string, People>;
}

const initialState: HomePageState = {
  search: {},
  isSearchSyncronizedWithLS: false,
  isItemsLoading: true,
  pagesNumber: 1,
  selectedItems: {},
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setSearch(state, { payload }: PayloadAction<CurrentSearchParams>) {
      state.search = payload;
      if (!state.isSearchSyncronizedWithLS) {
        state.isSearchSyncronizedWithLS = true;
      }
    },
    setPagesNumber(state, { payload }: PayloadAction<number>) {
      state.pagesNumber = payload;
    },
    selectItem(
      state,
      { payload }: PayloadAction<{ id: string; item: People }>
    ) {
      state.selectedItems[payload.id] = payload.item;
    },
    unselectItem(state, { payload }: PayloadAction<{ id: string }>) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.selectedItems[payload.id];
    },
    resetSelection(state) {
      state.selectedItems = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => apiSlice.endpoints.fetchItems.matchPending(action),
        (state) => {
          state.isItemsLoading = true;
        }
      )
      .addMatcher(
        (action) => apiSlice.endpoints.fetchItems.matchFulfilled(action),
        (state, { payload }) => {
          state.pagesNumber = payload.next
            ? Math.ceil(payload.count / payload.results.length)
            : Number(state.search.page) || 1;
          state.isItemsLoading = false;
        }
      )
      .addMatcher(
        (action) => apiSlice.endpoints.fetchItems.matchRejected(action),
        (state) => {
          state.isItemsLoading = false;
        }
      );
  },
});

export const {
  setSearch,
  setPagesNumber,
  selectItem,
  unselectItem,
  resetSelection,
} = homePageSlice.actions;

export const homePageReducer = homePageSlice.reducer;

export const getSearch = (state: RootState) => state.homePage.search;
export const getIsSearchSyncronizedWithLS = (state: RootState) =>
  state.homePage.isSearchSyncronizedWithLS;
export const getIsItemsLoading = (state: RootState) =>
  state.homePage.isItemsLoading;
export const getPagesNumber = (state: RootState) => state.homePage.pagesNumber;

export const getSelectedItems = (state: RootState) =>
  state.homePage.selectedItems;
export const getSelectedItemsArray = (state: RootState) =>
  Object.values(state.homePage.selectedItems);
export const getSelectedItemsNumber = (state: RootState) =>
  Object.keys(state.homePage.selectedItems).length;
