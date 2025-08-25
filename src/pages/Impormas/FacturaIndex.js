import React, { Fragment, useState, useEffect } from 'react'
import Layout from './../../layouts/LayoutOne';
import { Dialog, DialogTitle, DialogContent, Slide } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { loginData } from './../../security/utilSecurity'
import { getData } from './../../api'
import { CircularProgress, Button } from '@material-ui/core'
import { formatNumber, formatDate } from './../../utilities'

import VisibilityIcon from '@material-ui/icons/Visibility';
import { ApiRaiz } from './../../constant'

import {
    Modal, ModalHeader, ModalBody
} from 'reactstrap'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

export default function FacturaIndex() {
    const LoginData = JSON.parse(loginData());

    const [facturaData, setfacturaData] = useState({ Facturas_Registros: [], Loading: true });
    const { Facturas_Registros, Loading } = facturaData;

    ///Datos de envio
    const [envioData, setenvioData] = useState({ DataEnvio: {}, EnvioModal: false, LoadingEnvio: false })
    const { EnvioModal, LoadingEnvio } = envioData

    ///Datos de visual de factura
    const [verFactura, setverFactura] = useState({ ModalFactura: false, ModalSoporte: false, Facturaid: '', Prefijo: '', Numero: '' });
    const { ModalFactura, ModalSoporte, Facturaid, Prefijo, Numero } = verFactura;


    ///Componente de cargando
    const Loading_comp = Loading ? <div style={{ textAlign: 'center' }}> < CircularProgress /> </div> : null;

    console.log(LoginData);

    useEffect(() => {

        async function cargar() {

            const Datos = await getData('TerceroApi/TerceroSucGetFactura', {
                terceroid: LoginData.Terceroid,
                tercerosucid: LoginData.Tercerosucid,
                rows: 0
            }, false);


            setfacturaData({ Facturas_Registros: Datos.data.Facturas, Loading: false });
        }

        cargar();

    }, [LoginData.Terceroid, LoginData.Tercerosucid])

    ///Accion para cargar los registros
    const cargarRegistros = async () => {
        setfacturaData({ ...facturaData, Loading: true });



        const Datos = await getData('TerceroApi/TerceroSucGetFactura', {
            terceroid: LoginData.Terceroid,
            tercerosucid: LoginData.Tercerosucid,
            rows: Facturas_Registros.length
        }, false);


        let Datos_act = Facturas_Registros;
        Datos_act = Datos_act.concat(Datos.data.Facturas);

        setfacturaData({ ...facturaData, Facturas_Registros: Datos_act, Loading: false })
    }

    ///Funcion para abrir el modal de envio
    // const modalEnvioOpen = async (item) => {
    //     setenvioData({ ...envioData, EnvioModal: true, LoadingEnvio: true, DataEnvio: {} })

    //     const DatosEnvio = await getData('FacturaApi/GetFacturaInfoEnvio', {
    //         facturaid: item.facturaid
    //     });

    //     setenvioData({ ...envioData, LoadingEnvio: false, EnvioModal: true, DataEnvio: DatosEnvio.data.FacturaEnvio })
    // }

    ///Funcion para abrir modal de factura
    const modalVerFactura = (item) => {
        setverFactura({ ...verFactura, ModalFactura: true, Facturaid: item.facturaid, Prefijo: item.prefijo, Numero: item.numero })
    }

    ///Funcion para cerrar modal de pedido
    const cerrarModalFactura = () => {
        setverFactura({ ...verFactura, ModalFactura: false, Facturaid: '', Prefijo: '', Numero: '' });
    }

    ///Funcion para abrir modal de factura
    const modalVerSoporte = (item) => {
        setverFactura({ ...verFactura, ModalSoporte: true, Facturaid: item.facturaid, Prefijo: item.prefijo, Numero: item.numero })
    }

    ///Funcion para cerrar modal de pedido
    const cerrarModalSoporte = () => {
        setverFactura({ ...verFactura, ModalSoporte: false, Facturaid: '', Prefijo: '', Numero: '' });
    }

    ///Componente de cargando
    const Loading_comp_envio = LoadingEnvio ? <div style={{ textAlign: 'center' }}> < CircularProgress /> </div> : null;


    return <Fragment>
        <Layout headerTop="visible">
            <h2 className="text-center">FACTURACIÓN</h2>
            {Loading_comp}
            <br />

            <TableContainer component={Paper}>
                <Table stickyHeader style={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Documento</TableCell>
                            <TableCell align="center">Fecha</TableCell>
                            <TableCell align="center">Items</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center">Subtotal</TableCell>
                            <TableCell align="center">Impuesto</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Saldo</TableCell>
                            <TableCell align="center">Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Facturas_Registros.map((row, index) => (
                            <TableRow hover key={row.facturaid}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{row.prefijo + ' - ' + row.numero}</TableCell>
                                <TableCell align="center">{formatDate(row.fecha)}</TableCell>
                                <TableCell align="center">{formatNumber(row.items)}</TableCell>
                                <TableCell align="center">{formatNumber(row.cantidad)}</TableCell>
                                <TableCell align="right">{formatNumber(row.subtotal, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.impuesto, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.total, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.saldo, true)}</TableCell>
                                <TableCell align="center">

                                    <Button variant="contained" size="small" color="primary" title="Ver Remision" onClick={() => modalVerFactura(row)} >
                                        <VisibilityIcon />
                                    </Button>

                                    <Button variant="contained" size="small" color="secondary" title="Ver Factura" onClick={() => modalVerSoporte(row)} >
                                        <VisibilityIcon />
                                    </Button>

                                    {/* <Button variant="contained" size="small" title="Ver información de envio" onClick={() => modalEnvioOpen(row)}>
                                        <LocalShippingIcon />
                                    </Button> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button color="primary" variant="contained" size="small" onClick={cargarRegistros} fullWidth={true}>
                Cargar mas
            </Button>

            <br />

            <Dialog
                open={EnvioModal}
                maxWidth="lg"
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setenvioData({ ...envioData, EnvioModal: false })}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"

            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >

                    <h4 className="text-center">Información de Envío</h4>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                >

                    {Loading_comp_envio}

                </DialogContent>

            </Dialog>


            <Modal isOpen={ModalFactura} toggle={cerrarModalFactura} size="lg">
                <ModalHeader toggle={cerrarModalFactura}>Visualizacion de Factura: {Prefijo + ' - ' + Numero}</ModalHeader>
                <ModalBody>
                    <iframe
                        style={{ width: '100%', height: 800 }}
                        title="Frame"
                        src={ApiRaiz + '/ReporteApp/Factura/ImprimirFactura?empresaid=1&id=' + Facturaid}
                    ></iframe>
                </ModalBody>
            </Modal>



            <Modal isOpen={ModalSoporte} toggle={cerrarModalSoporte} size="lg">
                <ModalHeader toggle={cerrarModalSoporte}>Visualizacion de Factura: {Prefijo + ' - ' + Numero}</ModalHeader>
                <ModalBody>
                    <iframe
                        style={{ width: '100%', height: 800 }}
                        title="Frame"

                        src={ApiRaiz + '/ReporteApp/Factura/FormatoAlternoVer?empresaid=1&page=1&facturaid=' + Facturaid}>

                    </iframe>
                </ModalBody>
            </Modal>

            <br />
            <br />

        </Layout>
    </Fragment>
}