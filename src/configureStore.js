import React from 'react';

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const PRODUCTION = (process.env.NODE_ENV == 'production');

function getDevToolsExtension() {
  return !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : noop => noop;
}

export default function configureStore() {
  const reducer = combineReducers({
    ...reducers,
  });

  const middlewares = applyMiddleware(
    thunk,
  );

  const enhancer = compose(
    middlewares,
    getDevToolsExtension(),
  );

  return createStore(reducer, enhancer);
}
