import { createStore } from "redux";
import rootReducer from "../../app/reducers/rootReducer";

export const configureStore = () => {
  const store = createStore(rootReducer);

  return store;
};
