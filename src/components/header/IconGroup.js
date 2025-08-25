import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MenuCart from "./sub-components/MenuCart";
import { isLogin, loginData } from './../../security/utilSecurity';
import { setTerceroInfo } from './../../redux/actions/terceroActions';
import { deleteFromCart } from "../../redux/actions/cartActions";

const IconGroup = ({
  currency,
  cartData,
  wishlistData,
  compareData,
  deleteFromCart,
  iconWhiteClass,
  terceroData
}) => {
  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  // useEffect(() => {
  //   if (isLogin() === true) {
  //     setTerceroInfo(JSON.parse(loginData()).Terceroid);
  //   }
  // }, [setTerceroInfo]);

  useEffect(() => {
    const interval = setInterval(async () => {

      if (isLogin() === true) {
        setTerceroInfo(JSON.parse(loginData()).Terceroid);
      }
    }, 30000);/// cada minuto va el intervalo (60.000)
    return () => clearInterval(interval);
  }, [setTerceroInfo]);

  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button> 
        <div className="account-dropdown">
        <ul>
                <li>
                  {isLogin() === true ? <Link to={process.env.PUBLIC_URL + "/home"}>
                    Mi Cuenta
                  </Link> : <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Ingresar
                  </Link>}

                  {isLogin() === true ?
                    <Link to={process.env.PUBLIC_URL + "/logout"}>
                      Cerrar Sesion
                    </Link> : null}
                </li>
              </ul>
        </div>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart
          cartData={cartData}
          currency={currency}
          deleteFromCart={deleteFromCart}
          terceroData={terceroData}
        />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array,
  setTerceroInfo: PropTypes.func,
  terceroData: PropTypes.object
};

const mapStateToProps = state => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData,
    terceroData: state.terceroData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    setTerceroInfo: (terceroID) => {
      dispatch(setTerceroInfo(terceroID))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
