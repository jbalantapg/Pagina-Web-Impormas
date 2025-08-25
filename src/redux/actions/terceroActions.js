import { getData } from "../../api";


export const SET_TERCEROINFO = "SET_TERCEROINFO";
export const SET_TERCERO_PRECIONIVEL = "SET_TERCERO_PRECIONIVEL";

export const setTerceroInfo = (terceroID) => {
    return dispatch => {
        getData('TerceroApi/InfoTercero', {
            terceroid: terceroID 
        }, false).then(response => {    
            dispatch({
                type: SET_TERCEROINFO,
                payload: {
                    terceroID: terceroID,
                    ultimaFactura: response.data.Resultado.Ultima_Venta,
                    diasUltimaFactura: response.data.Resultado.Dias_UltimaVenta,
                    terceroNombre: response.data.Resultado.Tercero,
                    precioNivel: 'Precio4'
                }
            });
        }).catch(err => {
            console.log("Error: ", err);
        });
    }
}

export const setTerceroPrecioNivel = (terceroID, cartData = []) => {
    return dispatch => {
        dispatch({
            type: SET_TERCERO_PRECIONIVEL,
            payload: {
                terceroID: terceroID,
                cartData
            }
        })
    }
}