'use strict';
import {createStore} from 'redux';

// STEP 3 define reducers
// You create a reducer by passing 2 arguments: state and action.
const reducer = function(state={books: []}, action) {
  // The use of the reducer is to evaluate what to do with the recieved action
  switch(action.type) {
    case 'POST_BOOK':
      // let books = state.books.concat(action.payload);
      // return {books};
      return {books: [...state.books, ...action.payload]}
      break;
    case 'DELETE_BOOK':
      // Create a copy of the current array of books
      const currentBookToDelete = [...state.books];
      // Determine at which index in books array is the book to be deleted
      const indexToDelete = currentBookToDelete.findIndex(
        function(book) {
          return book.id === action.payload.id;
        }
      )
      // Use slice to remove the book at the specified index
      return {books: [...currentBookToDelete.slice(0, indexToDelete),
        ...currentBookToDelete.slice(indexToDelete + 1)]};
      break;
    case 'UPDATE_BOOK':
    // Create a copy of the current array of books
    const currentBookToUpdate = [...state.books]
    // Determine at which index in books array is the book to be delated
    const indexToUpdate = currentBookToUpdate.findIndex(
      function(book) {
        return book.id === action.payload.id;
      }
    )
    // Create a new book object with the new values and with the same array index of the item we want to replace. To achieve this we will use ...spread but we could use concat method too
    const newBookToUpdate = {
      ...currentBookToUpdate[indexToUpdate],
      title: action.payload.title
    }
    // This Log shows you how newBookToUpdate looks
    console.log("what is it newBookToUpdate", newBookToUpdate);
    // Use slice to remove the book at the specified index, replace with the new object and concatenate with the rest of items in the array
    return {books: [...currentBookToUpdate.slice(0, indexToUpdate), newBookToUpdate, ...currentBookToUpdate.slice(indexToUpdate + 1)]}
    break;
  }
  return state;
}

// STEP 1 create the store
const store = createStore(reducer);

// To see what the current state is in the store create a listener with "subscribe",
// then log it with "getState"
store.subscribe(function() {
  console.log('current state: ', store.getState());
  // console.log('current price: ', store.getState()[1].price);
});

// STEP 2 create and dispatch actions
// An action is made by an object that has 2 properties: type and payload
store.dispatch({
  type: 'POST_BOOK',
  payload: [
    {
    id: 1,
    title: 'this is the book title',
    description: 'this is the book description',
    price: 33.33
  },
  {
    id: 2,
    title: 'this is the second book title',
    description: 'this is the second book description',
    price: 50
  }
]
});

// DELETE a BOOK
store.dispatch({
  type: 'DELETE_BOOK',
  payload: {id: 1}
});

// UPDATE a book
store.dispatch({
  type: 'UPDATE_BOOK',
  payload: {
    id: 2,
    title: 'Learn React in 24h'
  }
});
