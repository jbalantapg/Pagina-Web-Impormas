import { ApiUrl } from './constant'


///Funcion para hacer un get
async function getData(action, params = {}, PrintUrl = false) {

    let url = ApiUrl + action + "?";

    Object.keys(params).forEach(key => {
        let valor = encodeURIComponent(String(params[key]));

        url = url + key + "=" + valor + "&"
    });


    ///Se concatena de forma automatica la empresa y el usuario id
    url += "usuarioid=" + 1 + "&empresaid=" + 1;

    ///Se agrega parametro para saber si quiere imprimir la url
    if (PrintUrl === true) {
        console.log(url);
    }

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUaXBvIjoiTm9Vc2VyIiwiVXN1YXJpb2lkIjoiLTk5IiwiRW1wcmVzYWlkIjoiMSIsImV4cCI6MjA3MTY4NTk3Nn0.vszxPYtUAswzubn1Aj4wiHaclHLP7mR7XmFJqGq1Bu4";
    return await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token, // + JSON.parse(token).access_token,
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            return { status: true, data: data };
        })
        .catch(error => {
            console.warn(error);
            return {
                status: false,
                data: error,
                msj: "Algo salio mal, por favor verifica o contacta a tu administrador"
            };
        });
}

// ///Funcion para serializar un objecto a JSON
// function simpleStringify(object) {
//     var simpleObject = {};
//     for (var prop in object) {
//         if (!object.hasOwnProperty(prop)) {
//             continue;
//         }
//         if (typeof object[prop] == "object") {
//             continue;
//         }
//         if (typeof object[prop] == "function") {
//             continue;
//         }
//         simpleObject[prop] = object[prop];
//     }
//     return JSON.stringify(simpleObject); // returns cleaned up JSON
// }

// ///Funcion para hacer post de datos
// async function postData(action, paramsGet = {}, dataPost = {}, printUrl = false) {

//     let url = ApiUrl + action + "?";

//     Object.keys(paramsGet).forEach(
//         key => (url = url + key + "=" + paramsGet[key] + "&")
//     );

//     ///Se concatena de forma automatica la empresa y el usuario id
//     url += "usuarioid=" + 1 + "&empresaid=" + 1;

//     if (printUrl == true)
//         console.log(url);
//     //console.log(JSON.stringify(dataPost));

//     return await fetch(url, {
//         method: "POST",
//         headers: {
//             Authorization: "Bearer ", // + JSON.parse(token).access_token,
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(dataPost)
//     })
//         .then(response => response.json())
//         .then(data => data)
//         .catch(error => {
//             console.log(error);
//             alert("Por favor verifique la red");
//             return error;
//         });
// }

async function postData(action, paramsGet = {}, dataPost = {}, printUrl = false) {

    let url = ApiUrl + action + "?";

    Object.keys(paramsGet).forEach(
        key => (url = url + key + "=" + paramsGet[key] + "&")
    );

    ///Se concatena de forma automatica la empresa y el usuario id
    url += "usuarioid=" + 1 + "&empresaid=" + 1;

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUaXBvIjoiTm9Vc2VyIiwiVXN1YXJpb2lkIjoiLTk5IiwiRW1wcmVzYWlkIjoiMSIsImV4cCI6MjA3MTY4NTk3Nn0.vszxPYtUAswzubn1Aj4wiHaclHLP7mR7XmFJqGq1Bu4";

    if (printUrl === true)
        console.log(url);
    //console.log(JSON.stringify(dataPost));

    return await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Bearer " +  token, // + JSON.parse(token).access_token,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataPost)
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.log(error);
            alert("Por favor verifique la red");
            return error;
        });
}


export { getData, postData }
