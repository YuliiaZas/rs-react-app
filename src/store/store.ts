import { configureStore } from '@reduxjs/toolkit';
import { apiSlice, homePageReducer } from '@home-page';

export const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
