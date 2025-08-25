import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { addToCart,decreaseQuantity, deleteFromCart, addToCartExample, addToCartExample_v2 } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { setTerceroInfo } from "../../redux/actions/terceroActions";
import { isLogin, loginData } from "../../security/utilSecurity";

const ProductGrid = ({
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  terceroData,
  sliderClassName,
  spaceBottomClass,
  decreaseQuantity,
  deleteFromCart,
  addToCartExample,
  addToCartExample_v2
}) => {
  useEffect(() => {
    if (isLogin() === true) {
      setTerceroInfo(JSON.parse(loginData()).Terceroid);
    }
  }, [cartItems]);
  return (
    <Fragment>
      {products.map(product => {
        return (
          <ProductGridListSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            terceroData={terceroData}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            decreaseQuantity={decreaseQuantity}
            deleteFromCart={deleteFromCart}
            cartItem={
              cartItems.filter(cartItem => cartItem.Productoid === product.Productoid)[0]
            }
            cartItems={cartItems}
            key={product.Productoid}
            addToCartExample={addToCartExample}
            addToCartExample_v2={addToCartExample_v2}
          />
        );
      })}
    </Fragment>
  );
};

ProductGrid.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  decreaseQuantity: PropTypes.func,
  deleteFromCart: PropTypes.func,
  currency: PropTypes.object,
  products: PropTypes.array,
  terceroData: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  addToCartExample: PropTypes.func,
  addToCartExample_v2: PropTypes.func
};

const mapStateToProps = state => {
  return {
    currency: state.currencyData,
    cartItems: state.cartData,
    terceroData: state.terceroData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToCartExample: (
      item,
      addToast,
      quantityCount
    ) => {
      dispatch(
        addToCartExample(
          item,
          addToast,
          quantityCount
        )
      );
    },
    addToCartExample_v2: (
      item,
      addToast,
      quantityCount
    ) => {
      dispatch(
        addToCartExample_v2(
          item,
          addToast,
          quantityCount
        )
      );
    },
    setTerceroInfo: (terceroID) => {
      dispatch(setTerceroInfo(terceroID))
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    decreaseQuantity: (item, addToast, quantityCount) => {
      dispatch(decreaseQuantity(item, addToast, quantityCount))
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);
