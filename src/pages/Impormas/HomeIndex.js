import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import { getData } from '../../api';
import { loginData } from '../../security/utilSecurity'
import { Link } from "react-router-dom";

const HomeIndex = () => {
    const [dataTercero, setdataTercero] = useState({ Facturas_Count: 0, Pedidos_Count: 0, Devoluciones_Count: 0, Recibos_Count: 0, Saldo_Cartera: 0, PedidosWeb_Count: 0, Loading: true });
    const { Facturas_Count, Pedidos_Count, Devoluciones_Count, Recibos_Count, Saldo_Cartera, PedidosWeb_Count, Loading } = dataTercero;

    const [terceroInfo, setTerceroInfo] = useState('');

    useEffect(() => {
        async function fetchData() {
            return await getData('TerceroApi/TerceroDatosDocumentos', {
                terceroid: JSON.parse(loginData()).Terceroid,
                tercerosucid: null
            }, false).then(response => {
                return response.data;
            }, error => {
                console.log(error);
            })
        }

        fetchData().then(datos => {
            setdataTercero(c => c = {
                Loading: false,
                Facturas_Count: datos.Facturas,
                Pedidos_Count: datos.Pedidos,
                Recibos_Count: datos.Recibos,
                Devoluciones_Count: datos.Devoluciones,
                PedidosWeb_Count: datos.PedidosWeb
            })
        });

        async function DatosTercero() {
            return await getData('TerceroApi/InfoTercero', {
                terceroid: JSON.parse(loginData()).Terceroid
            }, false).then(response => {
                return response.data;
            }, error => {
                console.log(error);
            })
        }

        DatosTercero().then( datos => {
            setTerceroInfo(datos.Resultado.Tercero);
        });

    }, [Loading, Facturas_Count, PedidosWeb_Count, Pedidos_Count, Recibos_Count, Devoluciones_Count, Saldo_Cartera]);

    const LoadingComponent = Loading === true ?
        <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
        : null;

    return (
        <Fragment>
            <MetaTags>
                <title>Walex | Home</title>
                <meta
                    name="Home"
                    content="Transacciones del cliente"
                />
            </MetaTags>
            <LayoutOne headerTop="visible">
                <div className="container">
                    <h2 style={{ fontWeight: 'bold', color: '#1E386F', textAlign: 'center' }}>Bienvenido a tu portal transaccional {terceroInfo}</h2>
                    {LoadingComponent}
                    <div className="row">

                        <div className="col-md-6">
                            <div className="card" style={{ margin: 10 }}>
                                <div className="card-header" style={{ backgroundColor: 'black' }}>
                                    <h4 style={{ color: 'white' }}>Facturas</h4>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        Consulta todas tus facturas, saldos, formatos e items.
                                    </p>
                                    <Link to={process.env.PUBLIC_URL + '/facturas'} className="btn btn-primary" style={{ backgroundColor: '#1E386F' }}>
                                        Ir a facturas ({Facturas_Count})
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card" style={{ margin: 10 }}>
                                <div className="card-header" style={{ backgroundColor: 'black' }}>
                                    <h4 style={{ color: 'white' }}>Pedidos</h4>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        Consulta todos tus pedidos.
                                    </p>
                                    <Link to={process.env.PUBLIC_URL + '/pedidos'} className="btn btn-primary" style={{ backgroundColor: '#1E386F' }}>
                                        Ir a Pedidos ({Pedidos_Count})
                                    </Link>
                                </div>
                            </div>
                        </div>     

                        <div className="col-md-6">
                            <div className="card" style={{ margin: 10 }}>
                                <div className="card-header" style={{ backgroundColor: 'black' }}>
                                    <h4 style={{ color: 'white' }}>Recibos</h4>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        Consulta tus recibos de caja.
                                    </p>
                                    <Link to={process.env.PUBLIC_URL + '/recibos'} className="btn btn-primary" style={{ backgroundColor: '#1E386F' }}>
                                        Ir a Recibos ({Recibos_Count})
                                    </Link>
                                </div>
                            </div>
                        </div>                   
                    </div>

                    <br />
                    <br />
                </div>
            </LayoutOne>
        </Fragment>
    )

}

export default HomeIndex;