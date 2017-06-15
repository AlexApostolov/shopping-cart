'use strict';

import {combineReducers} from 'redux';

// Import reducers to combine here
import {booksReducers} from './booksReducers';
import {cartReducers} from './cartReducers';

// Combine the reducers here
export default combineReducers({
  books: booksReducers,
  cart: cartReducers
});
