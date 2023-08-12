import { ADD, MINUS } from '@/constants/sample';
import { ActionCreator, AnyAction, Dispatch } from 'redux';

export const add: ActionCreator<AnyAction> = () => {
  return {
    type: ADD
  };
};

export const minus: ActionCreator<AnyAction> = () => {
  return {
    type: MINUS
  };
};

// 异步的 action
// eslint-disable-next-line no-unused-vars
export function asyncAdd(): (dispatch: Dispatch<AnyAction>) => void {
  return dispatch => {
    setTimeout(() => {
      dispatch(add());
    }, 2000);
  };
}
