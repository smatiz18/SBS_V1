import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import userInfoReducer from "./slices/user-info-slice";

const persistConfig = {
    key: 'root',
    storage
};

const rootReducer: Reducer<any> = combineReducers({
    userInfo: userInfoReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
});

export const persistor = persistStore(store);

// Define TypeScript types for better auto-completion
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

