import { createStore } from "redux";
import rootReducer from '../reducers';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);

  // uncomment following line, save (auto recompile), 
  // comment it again to clear cache
  // persistStore(store).purge();
  return { store, persistor };
};
