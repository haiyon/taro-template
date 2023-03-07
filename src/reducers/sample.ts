import { ADD, MINUS } from '@/constants/sample';
import { AnyAction } from 'redux';

export interface SampleState {
  [key: string]: any;
}

const INITIAL_STATE: SampleState = {};

export default function sample(state: SampleState = INITIAL_STATE, action: AnyAction): SampleState {
  switch (action.type) {
    case ADD:
      return {
        ...state
      };
    case MINUS:
      return {
        ...state
      };
    default:
      return state;
  }
}
