import React from "react";
import NumberFormat from 'react-number-format';


function formatNumber(valor = 0, currrency = false) {

    if (currrency === true)
        return <NumberFormat value={valor} displayType={'text'} thousandSeparator={true} prefix={'$'} />;//'$' + parseFloat(valor).toLocaleString();
    else
        return <NumberFormat value={valor} displayType={'text'} thousandSeparator={true} />;//parseFloat(valor).toLocaleString();
}

///Funcion para agregar dias a una fecha
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


///Retorna fecha en formato dd-MMM-yyyy
function formatDate(fecha) {

    try {
        let date = new Date(fecha)
        //date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

        const month_names = ["Ene", "Feb", "Mar",
            "Abr", "May", "Jun",
            "Jul", "Ago", "Sep",
            "Oct", "Nov", "Dic"];

        const day = date.getDate();
        const month_index = date.getMonth();
        const year = date.getFullYear();

        return day + '-' + month_names[month_index] + '-' + year;
    }
    catch (ex) {
        return '';
    }
}


///Funcion para serializar
function formatString(texto, texto_null = '') {
    let resultado = String(texto);

    if (resultado === 'null' || resultado === undefined || resultado === 'undefined')
        return '' + texto_null;

    return resultado;
}



///Retorna fecha en formato yyyy-MM-dd
function formatDateyyyyMMdd(fecha) {

    let date = new Date(fecha)
    //date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const month_names = ["01", "02", "03",
        "04", "05", "06",
        "07", "08", "09",
        "10", "11", "12"];

    const day = date.getDate();
    const month_index = date.getMonth();
    const year = date.getFullYear();

    return year + '-' + month_names[month_index] + '-' + day;
}

///Funcion para acomodar un texto con % para busquedas SQL
function serializeStringToSql(cadena = '') {

    if (cadena === '' || cadena === null)
        return '';
    else {
        cadena = cadena.replace('%', ' ');
        cadena = cadena.replace(' ', '%');
        cadena = '%' + cadena + '%';
        return cadena;

    }

}


export { formatNumber, addDays, formatDate, formatString, formatDateyyyyMMdd, serializeStringToSql }