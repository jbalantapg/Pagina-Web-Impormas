import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import { getProductCartComment, getProductCartPrice, getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { ApiRaiz } from "../../constant";
import { formatNumber } from "../../utilities";
import { addToCart, decreaseQuantity, deleteFromCart, addComment, addToCartExample_v2 } from "../../redux/actions/cartActions";
import { isLogin } from "../../security/utilSecurity";
import { setTerceroInfo } from "../../redux/actions/terceroActions";

function ProductModal(props) {
  const { terceroData } = props;
  const { product } = props;
  const { currency } = props;
  const { discountedprice } = props;
  const { finalproductprice } = props;
  const { finaldiscountedprice } = props;

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.Disponible
  );
  const [quantityCount, setQuantityCount] = useState(0);
  const [ingManual, setIngManual] = useState(false);

  const [valueInput, setvalueInput] = useState(quantityCount);
  const [observacionItem, setObservacionItem] = useState('');
  const [changeValue, setChangeValue] = useState(false);

  const addToCart = props.addtocart;
  const decreaseQuantity = props.decreaseQuantity;
  // eslint-disable-next-line react/prop-types
  const deleteFromCart = props.deleteFromCart;

  const addToast = props.addtoast;
  const cartItems = props.cartitems;
  const addComment = props.addComment;

  const addToCartExample_v2 = props.addToCartExample_v2;

  const productCartQty = getProductCartQuantity(
    cartItems,
    product
  );

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
              {formatNumber(isLogin() === true ? product[terceroData.precioNivel] : product.Precio1, true)}
            </div>
          </div>
        ))}
      </div>;
    } else {
      return <div className="product-price">
        Precio: <br />
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

  const urlImagen = () => {
    /*if (process.env.NODE_ENV === 'development') 
      return  ApiRaiz + '/Files/Images/';
    else */
    //return process.env.PUBLIC_URL + '/assets/productos/';
    return ApiRaiz + '/Files/Images/';
  }


  useEffect(() => {
    const valor = getProductCartQuantity(
      cartItems,
      product
    );

    setQuantityCount(valor);
    setProductStock(product.Disponible);

    const commentItem = getProductCartComment(cartItems, product);
    setObservacionItem(commentItem);

  }, [cartItems, product]);

  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const gallerySwiperParams = {
    effect: "fade",
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev"
    // },
    // renderPrevButton: () => (
    //   <button className="swiper-button-prev ht-swiper-button-nav">
    //     <i className="pe-7s-angle-left" />
    //   </button>
    // ),
    // renderNextButton: () => (
    //   <button className="swiper-button-next ht-swiper-button-nav">
    //     <i className="pe-7s-angle-right" />
    //   </button>
    // )
  };

  const handleObservacion = (e) => {
    setObservacionItem(e.target.value);
  }

  return (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton><h2>Detalles del Producto</h2></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <Swiper {...gallerySwiperParams}>
                  {product.Imagenes &&
                    product.Imagenes.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                                urlImagen() + single
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
              <div className="product-small-image-wrapper mt-15">
                <Swiper {...thumbnailSwiperParams}>
                  {product.Imagenes.length > 1 &&
                    product.Imagenes.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                                urlImagen() + single
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{product.Referencia}</h2>
                <h2>{product.Producto}</h2>
                <div className="product-details-price">
                  {renderPrecio(product)}
                </div>
                <div className="pro-details-list">
                  <p>{product.Producto_cod}</p>
                  <p>{product.Dimesiones}</p>
                </div>

                <div className="pro-details-list">
                  {product.texto_adicional !== '' ?
                    <div dangerouslySetInnerHTML={{ __html: product.texto_adicional }}></div> :
                    <h2>Sin Información Adicional</h2>}
                </div>

                {product.affiliateLink ? (
                  <div className="pro-details-quality">
                    <div className="pro-details-cart btn-hover">
                      <a
                        href={product.affiliateLink}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Comprar
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
                        //disabled={quantityCount >= product.Disponible + 1}
                      >+</button>
                    </div>

                  </div>
                )}

                <div className="pro-details-list">
                  <textarea placeholder="Observación Detalle"
                    onChange={e => handleObservacion(e)}
                    defaultValue={observacionItem} />
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
                    marginLeft: 50
                  }}
                    className="pe-7s-trash"
                    onClick={() => {
                      deleteFromCart(product, addToast);
                    }}></button>

                </div>

              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

ProductModal.propTypes = {
  addtoast: PropTypes.func,
  addtocart: PropTypes.func,
  addtocompare: PropTypes.func,
  addtowishlist: PropTypes.func,
  cartitems: PropTypes.array,
  compareitem: PropTypes.object,
  currency: PropTypes.object,
  discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.number,
  finalproductprice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool,
  wishlistitem: PropTypes.object,
  terceroData: PropTypes.object,
  addComment: PropTypes.func,
  addToCartExample_v2: PropTypes.func
};

const mapStateToProps = state => {
  return {
    cartitems: state.cartData
  };
};


const mapDispatchToProps = dispatch => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      priceItem,
      Observacion
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          priceItem,
          Observacion
        )
      );
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal);
