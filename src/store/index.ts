import { createStore, applyMiddleware, compose, StoreEnhancer } from 'redux';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import rootReducer, { RootState } from '../reducers';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares: Array<ThunkMiddleware<RootState, any>> = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(require('redux-logger').createLogger());
}

const enhancer: StoreEnhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);

export default function configStore() {
  const store = createStore(rootReducer, enhancer);
  return store;
}
