import PropTypes from "prop-types";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getDiscountPrice, getProductCartComment, getProductCartQuantity, getProductCartQuantityCart } from "../../helpers/product";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  cartItemStock,
  deleteAllFromCart,
  addToCartExample,
  addComment
} from "../../redux/actions/cartActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { ApiRaiz } from "../../constant";
import { formatNumber } from '../../utilities';
import { setTerceroInfo } from "../../redux/actions/terceroActions";
import { isLogin } from "../../security/utilSecurity";
import { validate } from "uuid";

const Cart = ({
  location,
  cartItems,
  currency,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
  terceroData,
  products,
  addToCartExample,
  addComment
}) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  let cartTotalPrice = 0;

  const [quantityCount, setQuantityCount] = useState(cartItems);
  const [observacionItem, setObservacionItem] = useState('');

  const [inputManual, setInputManual] = useState(false);

  const Validate = (e, id) => {
    e.preventDefault();
    let result = [...cartItems];
    result = result.map((x) => {
      if (x.cartItemId === id)
        x.quantity = e.target.value;

      return x;
    });

    setQuantityCount(result);
    setInputManual(true);
  }

  const urlImagen = () => {
    /*if (process.env.NODE_ENV === 'development') 
      return  ApiRaiz + '/Files/Images/';
    else */
    return process.env.PUBLIC_URL + '/assets/productos/';
  }

  const handleObservacion = (e) => {
    setObservacionItem(e.target.value);
  }

  return (
    <Fragment>
      <MetaTags>
        <title>LuisfArboleda | Cart</title>
        <meta
          name="description"
          content="Cart page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Cart
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Acción</th>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Precio Unit</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => {
                            const commentItem = getProductCartComment(cartItems, cartItem);

                            const discountedPrice = getDiscountPrice(
                              isLogin() === true ? cartItem[terceroData.precioNivel] : cartItem.Precio1,
                              cartItem.discount
                            );
                            const finalProductPrice = (
                              isLogin() === true ? cartItem[terceroData.precioNivel] : cartItem.Precio1 * currency.currencyRate
                            );
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            );

                            discountedPrice != null
                              ? (cartTotalPrice +=
                                finalDiscountedPrice * cartItem.quantity)
                              : (cartTotalPrice +=
                                finalProductPrice * cartItem.quantity);
                            return (
                              <tr key={key}>
                                <td className="product-remove text-center">
                                  <button className="btn btn-info btn-save-observ mt-2"
                                    onClick={() => {
                                      addComment(
                                        cartItem,
                                        addToast,
                                        observacionItem
                                      );
                                    }}
                                  >
                                    <i className="fa fa-check"></i>
                                  </button>

                                  <br />

                                  <button className="btn btn-info btn-save-observ mt-2"
                                    onClick={() =>
                                      deleteFromCart(cartItem, addToast)
                                    }
                                    style={{ background: 'red' }}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.Productoid
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={cartItem.Imagenes[0] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                                        urlImagen() + cartItem.Imagenes[0]
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.Productoid
                                    }
                                  >
                                    {cartItem.Producto}
                                  </Link>

                                  <br />

                                  <div className="pro-details-list">
                                    <textarea placeholder="Observación Detalle" onChange={e => handleObservacion(e)} defaultValue={commentItem} />
                                  </div>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {formatNumber(currency.currencySymbol +
                                          finalProductPrice, true)}
                                      </span>
                                      <span className="amount">
                                        {formatNumber(currency.currencySymbol +
                                          finalDiscountedPrice, true)}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {formatNumber(currency.currencySymbol +
                                        finalProductPrice, true)}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() =>
                                        decreaseQuantity(cartItem, addToast)
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="number"
                                      value={cartItem.quantity}
                                      onChange={(e) => { Validate(e, cartItem.cartItemId) }}
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() => {
                                        addToCartExample(cartItem, addToast, inputManual, inputManual === true ? quantityCount[key].quantity - 1 : quantityCount[key].quantity);
                                        
                                        setInputManual(false);
                                      }}
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity &&
                                        cartItem.quantity >=
                                        cartItemStock(
                                          cartItem,
                                          cartItem.selectedProductColor,
                                          cartItem.selectedProductSize
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {formatNumber(discountedPrice !== null
                                    ? currency.currencySymbol +
                                    (
                                      finalDiscountedPrice * cartItem.quantity
                                    )
                                    : currency.currencySymbol +
                                    (
                                      finalProductPrice * cartItem.quantity
                                    ), true)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-filter/:categoriaid"}
                        >
                          Continuar Comprando
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllFromCart(addToast)}>
                          Limpiar Carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Total Carrito
                        </h4>
                      </div>
                      <h5>
                        Total productos{" "}
                        <span>
                          {formatNumber(currency.currencySymbol + cartTotalPrice, true)}
                        </span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Total Pedido{" "}
                        <span>
                          {formatNumber(currency.currencySymbol + cartTotalPrice, true)}
                        </span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        Terminar Pedido
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No se encontraron items <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-filter/:categoriaid"}>
                        Comprar Ahora
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Cart.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  location: PropTypes.object,
  deleteAllFromCart: PropTypes.func,
  deleteFromCart: PropTypes.func,
  terceroData: PropTypes.object,
  products: PropTypes.array,
  addToCartExample: PropTypes.func,
  addComment: PropTypes.func
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
    terceroData: state.terceroData,
    products: state.cartData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    decreaseQuantity: (item, addToast) => {
      dispatch(decreaseQuantity(item, addToast));
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    deleteAllFromCart: addToast => {
      dispatch(deleteAllFromCart(addToast));
    },
    setTerceroInfo: (terceroID) => {
      dispatch(setTerceroInfo(terceroID))
    },
    addToCartExample: (item, addToast, quantityCount) => {
      dispatch(addToCartExample(item, addToast, quantityCount));
    },
    addComment: (item, addToast, comment) => {
      dispatch(addComment(item, addToast, comment))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
