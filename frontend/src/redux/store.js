import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import jobsReducer from "./jobSlice"; // Import the jobs reducer
import feedbackReducer from "./feedbackSlice"; // Import the feedback reducer
import communicationReducer from "./communicationSlice";


// Persist config
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["token"], // Only persist the 'token' field from the user state
};

// Persist user reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user reducer
    jobs: jobsReducer, // Non-persisted jobs reducer
    feedback: feedbackReducer,
    communication: communicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to avoid issues with non-serializable actions
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools
});

const persistor = persistStore(store);

export { store, persistor };


