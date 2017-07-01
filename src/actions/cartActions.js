'use strict';
import axios from 'axios';

// ADD TO CART
export function addToCart(cart) {
  return function(dispatch) {
    axios.post('/api/cart', cart)
      .then(function(response) {
        dispatch({type: 'ADD_TO_CART', payload: response.data})
      })
      .catch(function(err) {
        dispatch({type: 'ADD_TO_CART_REJECTED', msg: 'error when adding to the cart'})
      })
  }
}

// UPDATE CART
// Pass cart array from Cart component as 3rd argument
export function updateCart(_id, unit, cart) {
  // Create a copy of the current cart array
  const currentBookToUpdate = cart;
  // Determine at which index in cart array book quantity needs to be updated
  const indexToUpdate = currentBookToUpdate.findIndex(
    function(book) {
      return book._id === _id;
    }
  );
  // id property was passed directly from action above so payload keyword won't be needed below
  // Update quantity of the current selected book plus the units to increase the quantity
  const newBookToUpdate = {
    ...currentBookToUpdate[indexToUpdate],
    quantity: currentBookToUpdate[indexToUpdate].quantity + unit
  };
  // Pass the updated cart to variable cartUpdate
  let cartUpdate = [...currentBookToUpdate.slice(0, indexToUpdate), newBookToUpdate, ...currentBookToUpdate.slice(indexToUpdate + 1)];
  // Then append it to the state
  return {
    type: 'UPDATE_CART',
    payload: cartUpdate // Return updated cart to the reducer
  }
}

// DELETE FROM CART
export function deleteCartItem(cart) {
  return {
    type: 'DELETE_CART_ITEM',
    payload: cart
  }
}
