import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import { asyncActionStart, asyncActionFinish } from "../async/asyncActions";

export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER
  };
};

export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER
  };
};

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const incrementAsync = () => {
  return async dispatch => {
    dispatch(asyncActionStart());
    await delay(1000);
    dispatch(incrementCounter());
    dispatch(asyncActionFinish());
  };
};

export const decrementAsync = () => {
  return async dispatch => {
    dispatch(asyncActionStart());
    await delay(1000);
    dispatch({ type: DECREMENT_COUNTER });
    dispatch(asyncActionFinish());
  };
};
