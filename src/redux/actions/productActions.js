import { getData } from "../../api";

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";

const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products
});

// fetch products
export const fetchProducts = () => {
  return dispatch => {
    getData('ProductoApi/GetProductos_V2', {
      codigo: '',//serializeStringToSql(Referencia),
      descripcion: '',// serializeStringToSql(Descripcion),
      categoriaid: null, //Categoriaid,
      grupoid: null,//Grupoid,
      subgrupoid: null,
      precio_min: null,
      precio_max: null,
      length: 0,
      bodegaid: 1,
      orden: null,
      webpedidoid: null,
      api: true,
      api2: null,
      terceroid: '',
      nombreFull: ''
    }, true).then(response => {
      dispatch(fetchProductsSuccess(response.data.Datos));
    }).catch(err => {
      console.log(err);
    });
  };
};
