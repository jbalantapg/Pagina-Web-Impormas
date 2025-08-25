import { SET_TERCEROINFO } from "../actions/terceroActions";

const initState = {
    terceroId: null,
    ultimaFactura: null,
    diasUltimaFactura: null,
    terceroNombre: null,
    precioNivel: 'Precio4'
};

const terceroReducer = (state = initState, action) => {
    
    if (action.type === SET_TERCEROINFO) {
        const terceroId = action.payload.terceroID;
        const ultimaFactura = action.payload.ultimaFactura;
        const diasUltimaFactura = action.payload.diasUltimaFactura;
        const terceroNombre = action.payload.terceroNombre;
        const precioNivel = action.payload.precioNivel;

        return {
            ...state,
            terceroId: terceroId,
            ultimaFactura: ultimaFactura,
            diasUltimaFactura: diasUltimaFactura,
            terceroNombre: terceroNombre,
            precioNivel: precioNivel
        };
    }

    return state;
}

export default terceroReducer;