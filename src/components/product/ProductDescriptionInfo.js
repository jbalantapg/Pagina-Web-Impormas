import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductCartPrice, getProductCartQuantity, getProductCartComment } from "../../helpers/product";
import { addToCart, decreaseQuantity, deleteFromCart, addComment, addToCartExample_v2 } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import { formatNumber } from "../../utilities";
import { isLogin, loginData } from "../../security/utilSecurity";
import { setTerceroInfo } from "../../redux/actions/terceroActions";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  addToCompare,
  htmlCode,
  deleteFromCart,
  decreaseQuantity,
  terceroData,
  addComment,
  addToCartExample_v2
}) => {
  useEffect(() => {
    if (isLogin() === true) {
      setTerceroInfo(JSON.parse(loginData()).Terceroid);
    }
  }, []);

  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(product.Disponible);
  const [quantityCount, setQuantityCount] = useState(getProductCartQuantity(cartItems, product));

  const [ingManual, setIngManual] = useState(false);
  const [changeValue, setChangeValue] = useState(false);

  const [valueInput, setvalueInput] = useState(quantityCount);
  const [observacionItem, setObservacionItem] = useState('');

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const handleObservacion = (e) => {
    setObservacionItem(e.target.value);
  }

  const backGroundColor_PrecioEscala = (PrecioEscala, PrecioActual) => {
    if (PrecioEscala === PrecioActual) {
      return { backgroundColor: '#B3F6E1' };
    }
  }

  const renderPrecio = (product) => {
    if (product.Escala_aplica === true && product.Escala != null) {
      const PrecioActual = getProductCartPrice(cartItems, product);
      const Escalas = JSON.parse(product.Escala);
      const cantidad_escalas = Escalas.length;


      return <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
        {Escalas.map((item, index) => (
          <div className="col-md-6 col-sm-6 col-6" key={index} style={backGroundColor_PrecioEscala(product['Precio' + item.PrecioNivel], PrecioActual)}>
            <div className="text-muted" style={{ fontSize: 15, marginTop: -2, marginBottom: -2 }}>
              {item.Desde}- {index === cantidad_escalas - 1 ? <span className="fa fa-plus-square"></span> : item.Hasta}
            </div>
            <div style={{ fontWeight: 200, fontSize: 12, marginTop: 0, marginBottom: -2 }}>
              {formatNumber(product['Precio' + item.PrecioNivel], true)}
            </div>
          </div>
        ))}
      </div>;
    } else {
      return <div className="product-price">
        <span>{formatNumber(isLogin() === true ? product[terceroData.precioNivel] : product.Precio1, true)}</span>
      </div>
    }
  }

  const Validate = (e) => {

    setvalueInput(e.target.value);
    setIngManual(true);
    setQuantityCount(e.target.value);
    setChangeValue(true);
  }

  useEffect(() => {
    const valor = getProductCartQuantity(
      cartItems,
      product
    );

    console.log(product);

    setQuantityCount(valor);
    setProductStock(product.Disponible);

    const commentItem = getProductCartComment(cartItems, product);
    setObservacionItem(commentItem);

  }, [cartItems, product]);

  return (
    <div className="product-details-content ml-70">
      <h2>{product.Referencia}</h2>
      <h2>{product.Producto}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{renderPrecio(product)}</span>{" "}
            <span className="old">
              {renderPrecio(product)}
            </span>
          </Fragment>
        ) : (
          <span>{renderPrecio(product)}</span>
        )}
      </div>
      <div className="pro-details-list">
        {htmlCode ?
          <div dangerouslySetInnerHTML={{ __html: htmlCode }}></div> : <h2>Sin Información Adicional</h2>
        }
      </div>

      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
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
                  console.log(product);
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

          //onBlur={ev => setIngManual(false)}
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


                  setvalueInput(cantidad)
                  setQuantityCount(cantidad);

                  addToCartExample_v2(
                    product,
                    addToast,
                    cantidad
                  );

                }

                setChangeValue(false);
              }}
              //disabled={quantityCount >= product.Disponible + 1}
            >+</button>
          </div>

        </div>

      )}

      <div className="pro-details-list">
        <textarea placeholder="Observación Detalle" onChange={e => handleObservacion(e)} defaultValue={observacionItem} />
        <button className="btn btn-info btn-save-observ mt-2"
          onClick={() => {
            addComment(
              product,
              addToast,
              observacionItem
            );
          }}
        >
          Guardar
        </button>

        <button style={{
          background: 'none',
          border: 0,
          fontSize: 30,
          marginTop: 10,
          marginLeft: 100
        }}
          className="pe-7s-trash"
          onClick={() => {
            deleteFromCart(product, addToast);
          }}></button>
      </div>

      {product.category ? (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItems: PropTypes.array,
  compareItem: PropTypes.array,
  currency: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.object,
  wishlistItem: PropTypes.object,
  htmlCode: PropTypes.string,
  deleteFromCart: PropTypes.func,
  decreaseQuantity: PropTypes.func,
  terceroData: PropTypes.object,
  addComment: PropTypes.func,
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
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    decreaseQuantity: (item, addToast, quantityCount, priceItem) => {
      dispatch(decreaseQuantity(item, addToast, quantityCount, priceItem))
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast))
    },
    setTerceroInfo: (terceroID) => {
      dispatch(setTerceroInfo(terceroID))
    },
    addComment: (item, addToast, comment) => {
      dispatch(addComment(item, addToast, comment))
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDescriptionInfo);
