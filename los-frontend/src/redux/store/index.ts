import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '@/redux/slices';
import rootSaga from '@/redux/saga';
import { createLogger } from 'redux-logger';
import { isDev } from '@/lib/utils';
const logger = createLogger({
  collapsed: true,
  diff: true,
});
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(sagaMiddleware, ...(isDev ? [logger] : [])),
  devTools: isDev,
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
