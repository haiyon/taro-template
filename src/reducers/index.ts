import { combineReducers } from 'redux';
import sample, { SampleState } from './sample';

export interface RootState {
  sample: SampleState;
}

export default combineReducers({
  sample
});
