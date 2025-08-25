import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";

const ProductGrid = ({
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  sliderClassName,
  spaceBottomClass,
  terceroData
}) => {

  const [array, setArray] = useState([]);
  let productArray = [];

  useEffect(() => {
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        let randomProduct = Math.floor(Math.random() * (1 + products.length - 1));

        let producto = products[randomProduct];
        productArray.push(producto);
      }

      setArray(productArray);
    }, 30000)

  }, []);

  return (
    <Fragment>
      {array.map(product => {
        return (
          <ProductGridSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            terceroData={terceroData}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter(cartItem => cartItem.id === product.Productoid)[0]
            }
            key={product.Productoid}
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
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItems: PropTypes.array,
  terceroData: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    // products: getProducts(
    //   state.productData.products,
    //   ownProps.category,
    //   ownProps.type,
    //   ownProps.limit
    // ),
    products: state.productData.products,
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
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
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);
