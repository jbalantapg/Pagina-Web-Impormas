import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { ApiRaiz } from "../../../constant";
import { getDiscountPrice } from "../../../helpers/product";
import { isLogin } from "../../../security/utilSecurity";
import { formatNumber } from "../../../utilities";


const MenuCart = ({ cartData, currency, deleteFromCart, terceroData }) => {
  let cartTotalPrice = 0;
  const { addToast } = useToasts();

  return (
    <div className="shopping-cart-content">
      {cartData && cartData.length > 0 ? (
        <Fragment>
          <ul>
            {cartData.map((single, key) => {
              const discountedPrice = getDiscountPrice(
                isLogin() === true ? single[terceroData.precioNivel] : single.Precio1,
                single.discount
              );
              const finalProductPrice = (
                isLogin() === true ? single[terceroData.precioNivel] : single.Precio1 * currency.currencyRate
              );
              const finalDiscountedPrice = (
                discountedPrice * currency.currencyRate
              );

              discountedPrice != null
                ? (cartTotalPrice += finalDiscountedPrice * single.quantity)
                : (cartTotalPrice += finalProductPrice * single.quantity);

              return (
                <li className="single-shopping-cart" key={key}>
                  <div className="shopping-cart-img">
                    <Link to={process.env.PUBLIC_URL + "/product/" + single.Productoid}>
                      <img
                        alt=""
                        src={ApiRaiz + '/Files/Images/' + single.Imagenes[0]}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link
                        to={process.env.PUBLIC_URL + "/product/" + single.Productoid}
                      >
                        {" "}
                        {single.Producto}{" "}
                      </Link>
                    </h4>
                    <h6>Cantidad: {single.quantity}</h6>
                    <span>
                      {formatNumber(discountedPrice !== null
                        ? currency.currencySymbol + finalDiscountedPrice
                        : currency.currencySymbol + finalProductPrice, true)}
                    </span>
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => deleteFromCart(single, addToast)}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total :{" "}
              <span className="shop-total">
                {formatNumber(currency.currencySymbol + cartTotalPrice, true)}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
              Ver Carrito
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No hay items agregados</p>
      )}
    </div>
  );
};

MenuCart.propTypes = {
  cartData: PropTypes.array,
  currency: PropTypes.object,
  deleteFromCart: PropTypes.func,
  terceroData: PropTypes.object
};

export default MenuCart;
