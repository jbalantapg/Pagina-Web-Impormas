import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice, getProductCartQuantity } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { ApiRaiz } from "./../../constant";
import { Paper } from "@material-ui/core";
import { formatNumber } from '../../utilities';
import { isLogin } from "../../security/utilSecurity";
import { connect } from "react-redux";

const ProductGridListSingle = ({
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
  terceroData,
  decreaseQuantity,
  deleteFromCart,
  cartItems,
  addToCartExample,
  addToCartExample_v2
}) => {
  const [quantityCount, setQuantityCount] = useState(getProductCartQuantity(cartItems, product));
  const [valueInput, setvalueInput] = useState(quantityCount);
  const [productStock, setProductStock] = useState(product.Disponible);
  const [changeValue, setChangeValue] = useState(false);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product
  );

  const Validate = (e) => {
    setvalueInput(e.target.value);
    setQuantityCount(e.target.value);
    setChangeValue(true);
  }


  useEffect(() => {
    const valor = getProductCartQuantity(
      cartItems,
      product
    );

    setQuantityCount(valor);
    setProductStock(product.Disponible);
  }, [cartItems, product]);

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
        className={`col-xl-4 col-sm-6 ${sliderClassName ? sliderClassName : ""
          }`}
      >

        <div
          className={`product-wrap-2 ${spaceBottomClass ? spaceBottomClass : ""}`}
        >

          <Paper variant="outlined" style={{ height: 570, width: 250, margin: 10 }}>
            <div
              className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
            >
              <div className="product-img">
                <Link to={process.env.PUBLIC_URL + "/product/" + product.Productoid}>
                  <img
                    className="single-image"
                    src={product.Imagenes[0] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                      urlImagen() + product.Imagenes[0]
                    }
                    alt=""
                  />
                  {product.Imagenes.length > 1 ? (
                    <img
                      className="hover-img"
                      src={product.Imagenes[1] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                        urlImagen() + product.Imagenes[1]
                      }
                      alt=""
                    />
                  ) : (
                    ""
                  )}
                </Link>
                <div className="product-action">
                  <div className="pro-same-action pro-quickview">
                    <button onClick={() => setModalShow(true)} title="Ver Producto">
                      Ver Producto
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
                <br />

                <div className="input-group mt-10">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-info"
                      type="button"
                      id="button-addon1"
                      onClick={() => {
                        let multiplo = 1;
                        let cantidad = parseInt(quantityCount) - multiplo;

                        if (cantidad <= 0)
                          cantidad = 0;

                        setvalueInput(cantidad);
                        setQuantityCount(cantidad);

                        if (cantidad <= 0) {
                          deleteFromCart(product, addToast);
                        } else {
                          decreaseQuantity(
                            product,
                            addToast,
                            cantidad
                          );
                        }

                      }}
                      disabled={productCartQty === 0}
                    >-</button>
                  </div>
                  <input type="number" className="cantidad-ingresar text-center"
                    placeholder=""
                    aria-label="Cantidad en el pedido"
                    value={quantityCount}
                    onChange={ev => Validate(ev)}
                  />

                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-info"
                      type="button"
                      id="button-addon1"
                      onClick={() => {
                        let cantidad = parseInt(valueInput);

                        if (cantidad > product.Disponible) {
                          alert("Cantidad no disponible");
                          setQuantityCount(getProductCartQuantity(cartItems, product));
                        } else {

                          if (changeValue !== true)
                            cantidad = parseInt(valueInput) + 1;

                          setvalueInput(cantidad);
                          setQuantityCount(cantidad);

                          addToCartExample_v2(
                            product,
                            addToast,
                            cantidad
                          );

                          setChangeValue(false);
                        }
                      }}
                      // disabled={quantityCount >= product.Disponible + 1}
                    >+</button>
                  </div>
                </div>
                <br />
                <h5 style={{ color: 'green', textAlign: 'right', marginRight: '10px' }}>{product.Disponible > 0 ? "Hay Disponible" : ""}</h5>

                <div className="col-12 col-md-12 cold-lg-12 text-rigth">
                  <button style={{
                    background: 'none',
                    border: 0,
                    fontSize: 30,
                    marginTop: 10
                  }}
                    className="pe-7s-trash"
                    onClick={() => {
                      deleteFromCart(product, addToast);
                    }}></button>
                </div>
              </div>
            </div>
            <div className="shop-list-wrap mb-30">
              <div className="row">

                <div className="col-xl-8 col-md-7 col-sm-6">
                  <div className="shop-list-content">
                    <h3>
                      <Link to={process.env.PUBLIC_URL + "/product/" + product.Productoid}>
                        {product.Producto}
                      </Link>
                    </h3>
                    <div className="product-list-price">
                      {discountedPrice !== null ? (
                        <Fragment>
                          <span>
                            {formatNumber(currency.currencySymbol + finalDiscountedPrice, true)}
                          </span>{" "}
                          <span className="old">
                            {formatNumber(currency.currencySymbol + finalProductPrice, true)}
                          </span>
                        </Fragment>
                      ) : (
                        <span>{formatNumber(currency.currencySymbol + finalProductPrice, true)} </span>
                      )}
                    </div>
                    {product.Producto ? (
                      <p>{product.Producto}</p>
                    ) : (
                      ""
                    )}

                    <div className="shop-list-actions d-flex align-items-center">
                      <div className="shop-list-btn btn-hover">
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
                          <Link
                            to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                          >
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
                            disabled={
                              cartItem !== undefined && cartItem.quantity > 0
                            }
                            title={
                              cartItem !== undefined
                                ? "Agregado al Carrito"
                                : "Agregar al Carrito"
                            }
                          >
                            {" "}
                            <i className="pe-7s-cart"></i>{" "}
                            {cartItem !== undefined && cartItem.quantity > 0
                              ? "Agregado"
                              : "Agregar al Carrito"}
                          </button>
                        ) : (
                          <button disabled className="active">
                            Sin Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Paper>

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
        terceroData={terceroData}
      />
    </Fragment >
  );
};

ProductGridListSingle.propTypes = {
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
  terceroData: PropTypes.object,
  cartItems: PropTypes.array,
  decreaseQuantity: PropTypes.func,
  deleteFromCart: PropTypes.func,
  addToCartExample: PropTypes.func,
  addToCartExample_v2: PropTypes.func
};

export default ProductGridListSingle;
