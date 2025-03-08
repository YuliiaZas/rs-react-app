import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { PeopleFormatted } from '@utils';

interface HomePageState {
  isItemLoading: boolean;
  isItemsLoading: boolean;
  selectedItems: Record<string, PeopleFormatted>;
}

const initialState: HomePageState = {
  isItemLoading: false,
  isItemsLoading: true,
  selectedItems: {},
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setIsItemLoading(state, { payload }: PayloadAction<boolean>) {
      state.isItemLoading = payload;
    },
    setIsItemsLoading(state, { payload }: PayloadAction<boolean>) {
      state.isItemsLoading = payload;
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
});

export const {
  setIsItemLoading,
  setIsItemsLoading,
  selectItem,
  unselectItem,
  unselectAll,
} = homePageSlice.actions;

export const homePageReducer = homePageSlice.reducer;

export const getIsItemLoading = (state: RootState) => {
  return state.homePage.isItemLoading;
};
export const getIsItemsLoading = (state: RootState) => {
  return state.homePage.isItemsLoading;
};
export const getSelectedItems = (state: RootState) =>
  state.homePage.selectedItems;
export const getSelectedItemsNumber = (state: RootState) =>
  Object.keys(state.homePage.selectedItems).length;
