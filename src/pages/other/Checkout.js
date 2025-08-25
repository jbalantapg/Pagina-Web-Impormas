import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import { getData, postData } from "../../api";
import { formatNumber } from '../../utilities';
import { deleteAllFromCart } from "../../redux/actions/cartActions";
import { loginData, isLogin } from './../../security/utilSecurity';
import LayoutOne from "../../layouts/LayoutOne";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Checkout = ({
  location,
  cartItems,
  terceroData,
  currency,
  setActive,
  deleteAllFromCart }) => {
  let cartTotalPrice = 0;
  let cartCantidad = 0;
  const IsLogin = isLogin();

  const { pathname } = location;
  const [filtros, setFiltros] = useState({
    DocumentoNumero: "", Nombres: "", Apellidos: "", Ciudad: "", Departamentoid: "", Ciudadid: "",
    Direccion: "", Direccion2: "", Telefono: "", Email: "", Extra1: "", Departamentos: [],
    Ciudades: [], Dpto: "", Tercerosucid: "", Observacion: ""
  });

  const { DocumentoNumero, Nombres, Apellidos,
    Departamentoid, Ciudadid, Direccion, Direccion2, Telefono, Ciudad,
    Email, Ciudades, Tercerosucid, Observacion } = filtros;

  const [campos, setCampos] = useState({ Departamento_all: [] });
  const { Departamento_all } = campos;

  const [Sucursales, setSucursales] = useState([]);
  const [Loading, setLoading] = useState(true);

  const [Tercerosuc, setTercerosuc] = useState({ Direccionsuc: '', Ciudadsuc: '', Departamentosuc: '', Emailsuc: '' });
  const { Direccionsuc, Ciudadsuc, Departamentosuc, Emailsuc } = Tercerosuc;

  const [pedidoPrefijo, setPedidoPrefijo] = useState("");
  const [SinDisponible, setSinDisponible] = useState([]);
  const [Disponible, setDisponible] = useState(true);

  const urlImagen = () => {
    return process.env.PUBLIC_URL + '/assets/productos/';
  }

  useEffect(() => {
    async function getDatos() {
      if (IsLogin === true) {
        const TerceroData = await getData('TerceroApi/TerceroGetData', {
          terceroid: JSON.parse(loginData()).Terceroid
        });

        setFiltros(c => c = {
          DocumentoNumero: TerceroData.data.Tercero.nit + '-' + TerceroData.data.Tercero.dv,
          Nombres: TerceroData.data.Tercero.descripcion,
          Telefono: TerceroData.data.Tercero.telefono
        });

        const Sucursales = await getData('TerceroApi/TerceroSucursalDetalleget', {
          terceroid: JSON.parse(loginData()).Terceroid
        }, false);

        setSucursales(Sucursales.data.Sucursales);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getDatos();
  }, [IsLogin]);

  useEffect(() => {

    //Se cargan los departamentos que haya en el sistema cuando se recarga la pagina
    async function getParamsFiltro() {
      const FiltrosParam = await getData('DepartamentoApi/DepartamentoGet', {}, false);
      setCampos(c => c = { Departamento_all: FiltrosParam.data.Departamentos });
    }
    //Se llama la accion para que la cargue el navegador
    getParamsFiltro();

  }, [cartItems]);

  const asignaSucursal = (tercerosucid) => {
    const Seleccion = Sucursales.filter(item => String(item.tercerosucid) === tercerosucid);
    if (Seleccion.length === 1) {
      setTercerosuc({
        ...Tercerosuc,
        Direccionsuc: Seleccion[0].direccion,
        Ciudadsuc: Seleccion[0].ciudad_descrip,
        Departamentosuc: Seleccion[0].departamento_descrip,
        Emailsuc: Seleccion[0].correo_electronico
      })
    }
  }

  //Se crea una accion para traer las ciudades de acuerdo al dpto
  const CargarCiudad = async (Dptoid = '') => {
    //Llamamos el APi de ciudades por medio del parametro
    const Ciudad = await getData('CiudadApi/CiudadesDeptoGet', {
      Departamentoid: Dptoid
    }, false);

    setFiltros({ ...filtros, Ciudades: Ciudad.data.Ciudades, Departamentoid: Dptoid });
  }

  const confirmarPedido = async () => {
    setLoading(true);

    if (Ciudadid === '' || Ciudadid === null || Ciudadid === 'null') {
      alert('Por favor seleccione la ciudad');
      return;
    }

    if (Departamentoid === '' || Departamentoid === null || Departamentoid === 'null') {
      alert('Por favor seleccione el departamento');
      return;
    }

    if (IsLogin === true) {
      if (Tercerosucid === '') {
        alert('Primero debes de seleccionar una sucursal');
        setLoading(false);
        return;
      }

      let ObjetoPedido = {
        Terceroid: JSON.parse(loginData()).Terceroid,
        Tercerosucid: Tercerosucid,
        Observacion: Observacion,
        Detalles: []
      };

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        if (item.productoColor === undefined) {
          ObjetoPedido.Detalles.push({
            Productoid: item.Productoid,
            Cantidad: item.quantity,
            Precio: item[terceroData.precioNivel],
            Impuesto_porc: 0,
            Observacion: item.comment
          });
        } else {
          ObjetoPedido.Detalles.push({
            Productoid: item.productoColor,
            Cantidad: item.quantity,
            Precio: item[terceroData.precioNivel],
            Impuesto_porc: 0,
            Observacion: item.comment
          });
        }


      }

      const GuardarPedido = await postData('PedidoApi/PedidoWebCreate', {}, ObjetoPedido, true);

      if (GuardarPedido.Status === true) {
        alert(GuardarPedido.Msj);

        if (GuardarPedido.ErrorDisp === true) {
          let obj = [];
          let NoDisponibles = [];

          for (let x = 0; x < cartItems.length; x++) {

            for (let y = 0; y < GuardarPedido.ErrorDips.length; y++) {
              if (cartItems[x].Productoid === GuardarPedido.ErrorDips[y].Productoid) {
                NoDisponibles.push(cartItems[x]);
              }
            }
          }

          setDisponible(false);
          setSinDisponible(NoDisponibles);
        } else {
          deleteAllFromCart();
        }

        setLoading(false);
        setPedidoPrefijo(GuardarPedido.Msj);
      } else {
        alert('Algo salio mal al crear el pedido, por favor contacta a la empresa');
        setLoading(false);
      }

    } else {
      const NombreDpto = Departamento_all.filter(item => String(item.Value) === Departamentoid)[0].Text;

      let ObjetoPedido = {
        Nit: DocumentoNumero,
        Tercero: Nombres + ' ' + Apellidos,
        Telefono1: Telefono,
        Direccion: Direccion + '/' + Direccion2,
        Email: Email,
        Ciudad: Ciudad,
        Departamento: NombreDpto,
        Detalles: []
      };

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        ObjetoPedido.Detalles.push({
          Productoid: item.Productoid,
          Cantidad: item.quantity,
          Precio: item.Precio1,
          Impuesto_porc: 0,
          Observacion: item.comment
        });
      }

      const GuardarPedido = await postData('PedidoApi/PedidoWebCreateAnonimo', {}, ObjetoPedido, true);
      if (GuardarPedido.Status === true) {
        alert(GuardarPedido.Msj);

        if (GuardarPedido.ErrorDisp === true) {
          let obj = [];
          let NoDisponibles = [];

          for (let x = 0; x < cartItems.length; x++) {

            for (let y = 0; y < GuardarPedido.ErrorDips.length; y++) {
              if (cartItems[x].Productoid === GuardarPedido.ErrorDips[y].Productoid) {
                NoDisponibles.push(cartItems[x]);
              }
            }
          }

          setDisponible(false);
          setSinDisponible(NoDisponibles);
        } else {
          deleteAllFromCart();
        }

        setLoading(false);
        setPedidoPrefijo(GuardarPedido.Msj);
      } else {
        alert('Algo salio mal al crear al pedido, por favor contacta a la empresa');
        setLoading(false);
      }
    }

  }

  const LoadingComponent = Loading === true ?
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div> : null;

  return (
    <Fragment>
      <MetaTags>
        <title>LuisfArboleda | Checkout</title>
        <meta
          name="description"
          content="Termina tu pedido para que obtengas tus productos de forma facil y segura"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Terminar Pedido
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 && Disponible === true ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Detalles del Cliente</h3>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Número de Identificación</label>
                          <input type="text"
                            readOnly={IsLogin}
                            name="DocumentoNumero"
                            value={DocumentoNumero}
                            onChange={(e) => setFiltros({ ...filtros, DocumentoNumero: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Nombres</label>
                          <input type="text"
                            readOnly={IsLogin}
                            name="Nombres"
                            value={Nombres}
                            onChange={(e) => setFiltros({ ...filtros, Nombres: e.target.value })} />
                        </div>
                      </div>
                      {IsLogin === true ?
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Sucursal</label>
                            <select
                              value={Tercerosucid}
                              onChange={(e) => {
                                setFiltros({ ...filtros, Tercerosucid: e.target.value });
                                asignaSucursal(e.target.value);
                              }}
                            >
                              <option value={'null'}>Seleccione</option>
                              {Sucursales.map((item, index) => (
                                <option value={String(item.tercerosucid)} key={index}>{item.direccion + '-' + item.ciudad_descrip}</option>
                              ))}
                            </select>
                          </div>
                        </div> : null
                      }
                      {IsLogin === true ?
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Departamento</label>
                            <input type="text"
                              readOnly={IsLogin}
                              value={Departamentosuc}
                              onChange={(e) => {
                                setTercerosuc({ ...Tercerosuc, Departamentosuc: e.target.value });
                              }}
                            />
                          </div>
                        </div> :
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Departamento</label>
                            <select
                              id="Departamentoid"
                              name="Departamentoid"
                              value={Departamentoid}
                              onChange={(e) => {
                                CargarCiudad(String(e.target.value));
                              }}
                            >
                              <option value={'null'}>SELECCIONE</option>
                              {Departamento_all.map((item, key) => (
                                <option
                                  value={String(item.Value)}
                                  key={key}
                                >
                                  {item.Text}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      }

                      {IsLogin === true ?
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Ciudad</label>
                            <input type="text"
                              readOnly={IsLogin}
                              value={Ciudadsuc}
                              onChange={(e) => {
                                setTercerosuc({ ...Tercerosuc, Ciudadsuc: e.target.value });
                              }}
                            />
                          </div>
                        </div> :
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Ciudad</label>
                            <select name="Ciudadid"
                              value={Ciudadid}
                              onChange={(e) => {
                                const CiudadNombres = Ciudades.filter(item => String(item.Value) === e.target.value)[0];
                                setFiltros({ ...filtros, Ciudadid: e.target.Value, Ciudad: CiudadNombres.Text });
                              }}>
                              <option value={'null'}>SELECCIONE</option>
                              {Ciudades.map((item, key) => (
                                <option value={String(item.Value)} key={key}>
                                  {item.Text}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      }

                      {IsLogin === true ?
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Direccion</label>
                            <input
                              placeholder="Dirección principal"
                              readOnly={IsLogin}
                              type="text"
                              name="Direccion"
                              value={Direccionsuc}
                              onChange={(e) => setTercerosuc({ ...Tercerosuc, Direccion: e.target.value })}
                            />
                          </div>
                        </div> :
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Direccion</label>
                            <input
                              className="billing-address"
                              placeholder="Dirección principal"
                              type="text"
                              name="Direccion"
                              value={Direccion}
                              onChange={(e) => setFiltros({ ...filtros, Direccion: e.target.value })}
                            />
                            <input
                              placeholder="Dirección de despachos"
                              type="text"
                              name="Direccion2"
                              value={Direccion2}
                              onChange={(e) => setFiltros({ ...filtros, Direccion2: e.target.value })}
                            />
                          </div>
                        </div>
                      }

                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Telefono</label>
                          <input type="text"
                            readOnly={IsLogin}
                            name="Telefono"
                            value={Telefono}
                            onChange={(e) => setFiltros({ ...filtros, Telefono: e.target.value })} />
                        </div>
                      </div>
                      {IsLogin === true ?
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Correo Electronico</label>
                            <input type="text"
                              readOnly={IsLogin}
                              name="Email"
                              value={Emailsuc}
                              onChange={(e) => setTercerosuc({ ...Tercerosuc, Direccion: e.target.value })} />
                          </div>
                        </div> :
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Correo Electronico</label>
                            <input type="text"
                              name="Email"
                              value={Email}
                              onChange={(e) => setFiltros({ ...filtros, Email: e.target.value })} />
                          </div>
                        </div>
                      }

                      {IsLogin === true ?
                        <div className="col-lg-12 col-md-12">
                          <div className="billing-info mb-20">
                            <label>Observación</label>
                            <input type="text"
                              name="Observacion"
                              value={Observacion}
                              onChange={(e) => setFiltros({ ...filtros, Observacion: e.target.value })} />
                          </div>
                        </div> : ("")
                      }
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Tu Pedido</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Productos</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              cartCantidad += cartItem.quantity;

                              const discountedPrice = getDiscountPrice(
                                isLogin() === true ? cartItem[terceroData.precioNivel] : cartItem.Precio1,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                isLogin() === true ? cartItem[terceroData.precioNivel] : cartItem.Precio1 * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(2);

                              discountedPrice != null
                                ? (cartTotalPrice +=
                                  finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                  finalProductPrice * cartItem.quantity);

                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.Producto_Alterno} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {formatNumber(finalProductPrice * cartItem.quantity, true)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Cantidad</li>
                            <li>{cartCantidad}</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              {formatNumber(cartTotalPrice, true)}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method">
                        <p style={{ fontSize: '20px', color: 'black' }}>Método de pago por trasferencia: </p>
                        <p> - Bancolombia cuenta corriente: 8300154025-9</p>
                        <p> - Banco de Bogotá cuenta corriente: 254085863</p>
                        <p>Mandar comprobante de pago : </p>
                        <p>- 316 617 51 73</p>
                        <p>- 314 830 48 87</p>

                      </div>
                    </div>
                    <div className="place-order mt-25">
                      <button className="btn-hover" onClick={confirmarPedido}>
                        Terminar Pedido {LoadingComponent}</button>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>

                    {Disponible === false ?

                      <div>
                        <h4>
                          Los siguientes productos no tienen cantidad disponible: </h4>
                        <br></br>
                      </div>
                      : null
                    }

                    {Disponible ? (
                      <div className="item-empty-area__text">
                        Muchas gracias por su compra<br />{" "}
                        {pedidoPrefijo}
                      </div>) :

                      <div className="tabla-errores pl-100 pr-100">
                        <table className="table table-striped table-bordered table-hover">
                          <thead>
                            <tr>
                              <th className="text-center">#</th>
                              <th className="text-center">Imagen</th>
                              <th className="text-center">Producto</th>
                              <th className="text-center">Nombre</th>
                              <th className="text-center">Cantidad solicitada</th>


                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {SinDisponible.map((item, index) =>

                              <tr key={String(index)}>
                                <td className="text-center">
                                  {index + 1}
                                </td>
                                <td className="product-thumbnail">
                                  <img
                                    className="img-fluid"
                                    src={item.Imagenes[0] === "Imagen-no-disponible.jpg" ? urlImagen() + "Imagen-no-disponible.jpg" :
                                      urlImagen() + item.Imagenes[0]
                                    }
                                    alt=""
                                  />
                                </td>
                                <td className="text-center">
                                  {item.Producto_cod + "-" + item.Referencia}
                                </td>
                                <td className="text-center">
                                  {item.Producto}
                                </td>
                                <td className="text-center">
                                  {item.quantity}
                                </td>

                              </tr>
                            )}
                          </tbody>
                        </table>

                      </div>

                    }

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

Checkout.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  setActive: PropTypes.func,
  terceroData: PropTypes.object,
  deleteAllFromCart: PropTypes.func
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
    terceroData: state.terceroData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteAllFromCart: addToast => {
      dispatch(deleteAllFromCart(addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
