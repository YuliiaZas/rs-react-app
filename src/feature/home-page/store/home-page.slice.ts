import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { PeopleFormatted } from '@utils';
import { apiSlice } from './home-page-api.slice';

interface HomePageState {
  isSearchSyncronized: boolean;
  isItemsLoading: boolean;
  pagesNumber: number | null;
  selectedItems: Record<string, PeopleFormatted>;
}

const initialState: HomePageState = {
  isSearchSyncronized: false,
  isItemsLoading: true,
  pagesNumber: null,
  selectedItems: {},
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setSearchIsSyncronized(state) {
      state.isSearchSyncronized = true;
    },
    setPagesNumber(state, { payload }: PayloadAction<number | null>) {
      state.pagesNumber = payload;
    },
    selectItem(
      state,
      { payload }: PayloadAction<{ id: string; item: PeopleFormatted }>
    ) {
      state.selectedItems[payload.id] = payload.item;
    },
    unselectItem(state, { payload }: PayloadAction<{ id: string }>) {
      delete state.selectedItems[payload.id];
    },
    unselectAll(state) {
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
        (action) =>
          apiSlice.endpoints.fetchItems.matchFulfilled(action) ||
          apiSlice.endpoints.fetchItems.matchRejected(action),
        (state) => {
          state.isItemsLoading = false;
        }
      );
  },
});

export const {
  setSearchIsSyncronized,
  setPagesNumber,
  selectItem,
  unselectItem,
  unselectAll,
} = homePageSlice.actions;

export const homePageReducer = homePageSlice.reducer;

export const getIsSearchSyncronized = (state: RootState) =>
  state.homePage.isSearchSyncronized;
export const getIsItemsLoading = (state: RootState) =>
  state.homePage.isItemsLoading;
export const getPagesNumber = (state: RootState) => state.homePage.pagesNumber;

export const getSelectedItems = (state: RootState) =>
  state.homePage.selectedItems;
export const getSelectedItemsNumber = (state: RootState) =>
  Object.keys(state.homePage.selectedItems).length;
