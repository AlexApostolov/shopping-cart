'use strict';

export function cartReducers(state={cart: []}, action) {
  switch(action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: action.payload,
        totalAmount: totals(action.payload).amount,
        totalQty: totals(action.payload).qty
      };
      break;
    case 'UPDATE_CART':
      // Create a copy of the current cart array
      const currentBookToUpdate = [...state.cart];
      // Determine at which index in cart array book quantity needs to be updated
      const indexToUpdate = currentBookToUpdate.findIndex(
        function(book) {
          return book._id === action._id;
        }
      );
      // id property was passed directly from action above so payload keyword won't be needed below
      // Update quantity of the current selected book plus the units to increase the quantity
      const newBookToUpdate = {
        ...currentBookToUpdate[indexToUpdate],
        quantity: currentBookToUpdate[indexToUpdate].quantity + action.unit
      };
      // Pass the updated cart to variable cartUpdate
      let cartUpdate = [...currentBookToUpdate.slice(0, indexToUpdate), newBookToUpdate, ...currentBookToUpdate.slice(indexToUpdate + 1)];
      // Then append it to the state
      return {
        ...state,
        cart: cartUpdate,
        totalAmount: totals(cartUpdate).amount,
        totalQty: totals(cartUpdate).qty
      };
      break;
    case 'DELETE_CART_ITEM':
      return {
        ...state,
        cart: action.payload,
        totalAmount: totals(action.payload).amount,
        totalQty: totals(action.payload).qty
      }
      break;
  }
  return state;
}

// CALCULATE TOTALS
export function totals(payloadArr) {
  const totalAmount = payloadArr.map(function(cartArr) {
    return cartArr.price * cartArr.quantity;
  }).reduce(function(a, b) {
    return a + b;
  }, 0); // Start summing from index 0

  const totalQty = payloadArr.map(function(qty) {
    return qty.quantity;
  }).reduce(function(a, b) {
    return a + b;
  }, 0);

  return {amount: totalAmount.toFixed(2), qty: totalQty};
}
