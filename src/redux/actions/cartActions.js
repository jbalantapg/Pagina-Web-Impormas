export const ADD_TO_CART = "ADD_TO_CART";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";
export const ADD_TO_CART_EXAMPLE = "ADD_TO_CART_EXAMPLE";
export const ADD_COMMENT = "ADD_COMMENT";
export const ADD_TO_CART_EXAMPLE_V2 = "ADD_TO_CART_EXAMPLE_V2";

//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
  priceItem = 0,
  observacionItem
) => {
  console.log(item);
  return dispatch => {
    if (addToast) {
      addToast("Agregado al carrito", { appearance: "success", autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...item,
        quantity: quantityCount,
        price: priceItem,
        itemObservacion: observacionItem
      }
    });
  };
};
//decrease from cart
//decrease from cart
export const decreaseQuantity = (item, addToast, quantityCount = 1) => {
  console.log(quantityCount);
  return dispatch => {
    if (addToast) {
      addToast("Item modificado en el carrito", {
        appearance: "warning",
        autoDismiss: true
      });
    }
    dispatch({
      type: DECREASE_QUANTITY,
      payload: {
        ...item,
        quantityDecrease: quantityCount
      }
    });
  };
};
//delete from cart
export const deleteFromCart = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      addToast("Item eliminado", { appearance: "error", autoDismiss: true });
    }
    dispatch({ type: DELETE_FROM_CART, payload: item });
  };
};
//delete all from cart
export const deleteAllFromCart = addToast => {
  return dispatch => {
    if (addToast) {
      addToast("Items eliminados", {
        appearance: "error",
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_CART });
  };
};

// get stock of cart item
export const cartItemStock = (item) => {
  if (item.Disponible) {
    return item.Disponible;
  } else {
    return 0;
  }
};

export const addToCartExample = (
  item,
  addToast,
  inputManual,
  quantityCount) => {
    return dispatch => {
    if (addToast) {
      addToast("Agregado al carrito", { appearance: "success", autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART_EXAMPLE,
      payload: {
        ...item,
        quantity: quantityCount,
        inputManual: inputManual,
        price: 0
      }
    });
  };
}

export const addToCartExample_v2 = (
  item,
  addToast,
  quantityCount) => {
    console.log('Entro al segundo');
    return dispatch => {
    if (addToast) {
      addToast("Agregado al carrito", { appearance: "success", autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART_EXAMPLE_V2,
      payload: {
        ...item,
        quantity: quantityCount,
        price: 0
      }
    });
  };
}

//add to comment product
export const addComment = (
  item,
  addToast,
  comment
) => {
  return dispatch => {
    alert("Comentario guardado exitosamente");
    dispatch({
      type: ADD_COMMENT,
      payload: {
        ...item,
        comment: comment       
      }
    });
  };
};
