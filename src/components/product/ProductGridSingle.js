import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { ApiRaiz } from "../../constant";
import { formatNumber } from "../../utilities";
import { isLogin } from "../../security/utilSecurity";

const ProductGridSingle = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass,
  terceroData
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  const discountedPrice = getDiscountPrice(isLogin() === true ? product[terceroData.precioNivel] : product.Precio1, product.discount);
  const finalProductPrice = +(isLogin() === true ? product[terceroData.precioNivel] : product.Precio1 * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);


  const urlImagen = () => {
    /*if (process.env.NODE_ENV === 'development') 
      return  ApiRaiz + '/Files/Images/';
    else */
    return process.env.PUBLIC_URL + '/assets/productos/';
  }


  return (
    <Fragment>
      <div
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${sliderClassName ? sliderClassName : ""
          }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.Productoid}>
              <img
                className="default-img"
                src={product.Imagenes[0] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                  urlImagen() + product.Imagenes[0]
                }
                alt=""
              />
              {product.Imagenes.length > 1 ? (
                <img
                  className="hover-img"
                  src={product.Imagenes[0] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                    urlImagen() + product.Imagenes[1]
                  }
                  alt=""
                />
              ) : (
                ""
              )}
            </Link>

            <div className="product-action">

              {/* <div className="pro-same-action pro-cart">
                {product.affiliateLink ? (
                  <a
                    href={product.affiliateLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {" "}
                    Buy now{" "}
                  </a>
                ) : product.variation && product.variation.length >= 1 ? (
                  <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                    Select Option
                  </Link>
                ) : product.Disponible && product.Disponible > 0 ? (
                  <button
                    onClick={() => addToCart(product, addToast)}
                    className={
                      cartItem !== undefined && cartItem.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={cartItem !== undefined && cartItem.quantity > 0}
                    title={
                      cartItem !== undefined ? "Agregado al carrito" : "Agregar al carrito"
                    }
                  >
                    {" "}
                    <i className="pe-7s-cart"></i>{" "}
                    {cartItem !== undefined && cartItem.quantity > 0
                      ? "Agregado"
                      : "Agregar al carro"}
                  </button>
                ) : (
                  ""
                )}
              </div> */}
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
          <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.Productoid}>
                {product.Referencia}
              </Link>
            </h3>
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.Productoid}>
                {product.Producto}
              </Link>
            </h3>
            <div className="product-price">
              {discountedPrice !== null ? (
                <Fragment>
                  <span>{formatNumber(currency.currencySymbol + finalDiscountedPrice, true)}</span>{" "}
                  <span className="old">
                    {formatNumber(currency.currencySymbol + finalProductPrice, true)}
                  </span>
                </Fragment>
              ) : (
                <span>{formatNumber(currency.currencySymbol + finalProductPrice, true)} </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

ProductGridSingle.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object,
  terceroData: PropTypes.object
};

export default ProductGridSingle;
