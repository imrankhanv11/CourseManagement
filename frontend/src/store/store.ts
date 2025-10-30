import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from '../features/authSlice';
import courseReducer from '../features/courseSlice';
import userReducer from '../features/userSlice';
import { interceptor } from "../api/api";
import enrollSlice from '../features/enrollSlice';

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["isAuthenticated", "LoginDetails"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const appStore = configureStore({
    reducer: {
        AuthStore: persistedAuthReducer,
        CouseStore: courseReducer,
        UserStore: userReducer,
        Enrolltore: enrollSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootStateStore = ReturnType<typeof appStore.getState>;
export type AppDispathStore = typeof appStore.dispatch;

export const persistor = persistStore(appStore);
interceptor.setup(appStore);