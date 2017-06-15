'use strict';
// REACT
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import {applyMiddleware, createStore} from 'redux';
// Have middleware that logs all actions showing previous state & next one
// providing visibility on how the store is behaving
import logger from 'redux-logger';

// IMPORT COMBINED REDUCERS
import reducers from './reducers/index';
// IMPORT ACTIONS
import {addToCart} from './actions/cartActions';
import {postBooks, deleteBooks, updateBooks} from './actions/booksActions';

// STEP 1 create the store
const middleware = applyMiddleware(logger); // "logger" is exported by default so no parens needed
const store = createStore(reducers, middleware);

import BooksList from './components/pages/booksList';

render (
  <Provider store={store}>
    <BooksList />
  </Provider>, document.getElementById('app')
);
// STEP 2 create and dispatch actions
// An action is made by an object that has 2 properties: type and payload
// store.dispatch(postBooks(
//
// ));
