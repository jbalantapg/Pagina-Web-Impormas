import React, { Fragment, useEffect, useState } from 'react'
import Layout from './../../layouts/LayoutOne';
import { CircularProgress, Button } from '@material-ui/core'
import { addDays, formatDateyyyyMMdd, formatNumber, formatString, formatDate } from './../../utilities'
import { getData } from './../../api'
import { loginData } from './../../security/utilSecurity'
import { ApiRaiz } from './../../constant'
import VisibilityIcon from '@material-ui/icons/Visibility';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

///Modal
import { Slide } from "@material-ui/core";
import {
    Modal, ModalHeader, ModalBody
} from 'reactstrap'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";


export default function PedidoIndex() {

    useEffect(() => {
        buscarPedidos();
    }, []);

    ///Funcion para buscar pedidos
    const buscarPedidos = async () => {
        setpedidoData({ ...pedidoData, Loading: true });

        const Pedidos = await getData('TerceroApi/TerceroGetPedido', {
            fechaini: formatDateyyyyMMdd(addDays(new Date(), -360)),
            fechafin: formatDateyyyyMMdd(new Date()),
            terceroid: JSON.parse(loginData()).Terceroid,
            numero: null,
            estado: null,
            rows: Pedidos_Registros.length
        });

        let Datos_act = Pedidos_Registros;
        Datos_act = Datos_act.concat(Pedidos.data.Registros);

        setpedidoData({ ...pedidoData, Loading: false, Pedidos_Registros: Datos_act });
    }

    ///Datos para el modal de ver pedido
    const [pedidoVer, setpedidoVer] = useState({ ModalPedido: false, Pedidoid: '', Prefijo: '', NumeroPedido: '' })
    const { ModalPedido, Pedidoid, Prefijo, NumeroPedido } = pedidoVer;

    ///Datos de registros
    const [pedidoData, setpedidoData] = useState({ Pedidos_Registros: [], Loading: false });
    const { Pedidos_Registros, Loading } = pedidoData;


    ///Funcion para abrir modal de factura
    const modalVerPedido = (item) => {
        setpedidoVer({ ...pedidoVer, ModalPedido: true, Pedidoid: item.pedidoid, Prefijo: item.prefijo, NumeroPedido: item.numero })
    }

    ///Funcion para cerrar modal de pedido
    const cerrarModalPedido = () => {
        setpedidoVer({ ...pedidoVer, ModalPedido: false, Pedidoid: '', Prefijo: '', NumeroPedido: '' });
    }

    ///Componente de cargando
    const Loading_comp = Loading ? <div style={{ textAlign: 'center' }}> < CircularProgress /> </div> : null;


    return <Fragment>
        <Layout headerTop="visible">
            <h2 className="text-center">PEDIDOS</h2>
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
                            <TableCell align="center">Subtotal</TableCell>
                            <TableCell align="center">Impuesto</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Pedidos_Registros.map((row, index) => (
                            <TableRow hover key={row.pedidoid}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{formatString(row.prefijo) + ' - ' + formatString(row.numero)}</TableCell>
                                <TableCell align="center">{formatDate(row.fecha)}</TableCell>
                                <TableCell align="center">{formatNumber(row.conteo)}</TableCell>
                                {/* <TableCell align="center">{formatNumber(row.cantidad)}</TableCell> */}
                                <TableCell align="right">{formatNumber(row.vlrbruto, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.impuesto, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.total, true)}</TableCell>
                                <TableCell align="right">{formatString(row.estado_descripcion)}</TableCell>
                                <TableCell align="center">
                                    {/* <Link to={'/factura-ver/' + row.facturaid + '/' + row.prefijo + '/' + row.numero} target="_blank"> */}
                                    <Button color="primary" size="small" title="Ver formato en PDF" onClick={() => modalVerPedido(row)}  >
                                        <VisibilityIcon />
                                    </Button>
                                    {/* </Link> */}


                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button color="primary" variant="contained" size="small" onClick={buscarPedidos} fullWidth={true}>
                Cargar mas
            </Button>

            <br />

            <Modal isOpen={ModalPedido} toggle={cerrarModalPedido} size="lg">
                <ModalHeader toggle={cerrarModalPedido}>Visualizacion de Pedido: {Prefijo + ' - ' + NumeroPedido}</ModalHeader>
                <ModalBody>
                    <iframe 
                        style={{ width: '100%', height: 800 }}
                        title="Frame"
                        src={ApiRaiz + '/ReporteApp/Pedido/ImprimirPedido?empresaid=1&id=' + Pedidoid}
                    ></iframe>
                </ModalBody>
            </Modal>


            <br />




        </Layout>
    </Fragment>

}