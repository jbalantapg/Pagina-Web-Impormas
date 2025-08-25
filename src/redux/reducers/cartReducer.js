import uuid from "uuid/v4";
import {
  ADD_TO_CART,
  DECREASE_QUANTITY,
  DELETE_FROM_CART,
  DELETE_ALL_FROM_CART,
  ADD_TO_CART_EXAMPLE,
  ADD_COMMENT,
  ADD_TO_CART_EXAMPLE_V2
} from "../actions/cartActions";

const initState = [];

///Accion para obtener el precio de un articulo dependiendo de si es escala o normal
const getPrecio = (product, qty) => {
  if (qty > 0) {
    if (product.Escala_aplica === true && product.Escala != null) {
      const Escalas = JSON.parse(product.Escala);
      const Escalas_Cantidad = Escalas.length;

      for (let i = 0; i < Escalas.length; i++) {
        const item = Escalas[i];

        //se mira si la cantidad esta entre el rango
        if (qty >= item.Desde && qty <= item.Hasta){
          return product['Precio' + item.PrecioNivel];
        }
        else if (i === Escalas_Cantidad - 1)
          return product['Precio' + item.PrecioNivel];

      }

    } else {
      return product.Precio;
    }
  } else {
    return product.Precio;
  }
}

const cartReducer = (state = initState, action) => {
  const cartItems = state,
    product = action.payload;

  if (action.type === ADD_TO_CART) {
    // for non variant products
    if (product) {
      const cartItem = cartItems.filter(item => item.Productoid === product.Productoid)[0];
      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: item.quantity + 1,
              // quantity: product.quantity
              //   ? item.quantity + product.quantity
              //   : item.quantity + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1),
              itemObservacion: item.itemObservacion
            }
            : item
        );
      }
      // for variant products
    } else {
      const cartItem = cartItems.filter(
        item =>
          item.Productoid === product.Productoid &&
          (product.cartItemId ? product.cartItemId === item.cartItemId : true)
      )[0];

      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor !== product.selectedProductColor)
      ) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: item.quantity + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1)
            }
            : item
        );
      }
    }
  }

  if (action.type === DECREASE_QUANTITY) {
    if (product.quantity === 1) {
      const remainingItems = (cartItems, product) =>
        cartItems.filter(
          cartItem => cartItem.cartItemId !== product.cartItemId
        );
      return remainingItems(cartItems, product);
    } else {
      return cartItems.map(item =>
        item.Productoid === product.Productoid
          ? {
            ...item,
            quantity: item.quantity - 1,
            priceF: getPrecio(product, item.quantity - 1)
          }
          : item
      );
    }
  }

  if (action.type === DELETE_FROM_CART) {
    const remainingItems = (cartItems, product) =>
      cartItems.filter(cartItem => cartItem.Productoid !== product.Productoid);
    return remainingItems(cartItems, product);
  }

  if (action.type === DELETE_ALL_FROM_CART) {
    return cartItems.filter(item => {
      // console.log(item);
      return false;
    });
  }

  if (action.type === ADD_TO_CART_EXAMPLE) {
    // for non variant products
    if (product) {
      const cartItem = cartItems.filter(item => item.Productoid === product.Productoid)[0];
      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: product.inputManual === true ? parseInt(item.quantity) : parseInt(item.quantity) + 1,
              // quantity: product.quantity
              //  ? product.quantity
              //  : parseInt(item.quantity) + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1)
            }
            : item
        );
      }
      // for variant products
    } else {
      const cartItem = cartItems.filter(
        item =>
          item.Productoid === product.Productoid &&
          (product.cartItemId ? product.cartItemId === item.cartItemId : true)
      )[0];

      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor !== product.selectedProductColor)
      ) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: item.quantity + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1)
            }
            : item
        );
      }
    }
  }

  if (action.type === ADD_COMMENT) {

    const cartItem = cartItems.filter(item => item.Productoid === product.Productoid)[0];
    if (cartItem === undefined) {
      return [
        ...cartItems,
        {
          ...product,
          comment: product.comment,
          cartItemId: uuid(),         
        }
      ];
    } else {
      // console.log(product);

      return cartItems.map(item => item.cartItemId === cartItem.cartItemId
          ? {
            ...item,
            comment: product.comment              
          }
          : item
      );
    }
  }

  if (action.type === ADD_TO_CART_EXAMPLE_V2) {
    // for non variant products
    if (product) {
      const cartItem = cartItems.filter(item => item.Productoid === product.Productoid)[0];
      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        console.log(product);
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: product.quantity
                ? product.quantity
                : parseInt(item.quantity) + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1)
            }
            : item
        );
      }
      // for variant products
    } else {
      const cartItem = cartItems.filter(
        item =>
          item.Productoid === product.Productoid &&
          (product.cartItemId ? product.cartItemId === item.cartItemId : true)
      )[0];

      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor !== product.selectedProductColor)
      ) {
        return [
          ...cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: uuid(),
            priceF: getPrecio(product, product.quantity ? product.quantity : 1)
          }
        ];
      } else {
        return cartItems.map(item =>
          item.cartItemId === cartItem.cartItemId
            ? {
              ...item,
              quantity: item.quantity + 1,
              priceF: getPrecio(product, product.quantity ? product.quantity : 1)
            }
            : item
        );
      }
    }
  }

  return state;
};

export default cartReducer;
