import React, { Fragment, useEffect, useState } from 'react'
import Layout from './../../layouts/LayoutOne';
import { CircularProgress, Button } from '@material-ui/core'
import { formatNumber, formatString, formatDate } from './../../utilities'
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

import { Slide } from "@material-ui/core";
import {
    Modal, ModalHeader, ModalBody
} from 'reactstrap'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

export default function ReciboIndex() {
    useEffect(() => {
        buscarRecibos();
    }, []);

    const buscarRecibos = async () => {
        setreciboData({ ...reciboData, Loading: true });

        const Recibos = await getData('TerceroApi/TerceroGetRecibos', {
            terceroid: JSON.parse(loginData()).Terceroid,
            rows: Recibos_Registros.length
        }, false);

        let Datos_act = Recibos_Registros;
        Datos_act = Datos_act.concat(Recibos.data.Recibos);

        setreciboData({ ...reciboData, Loading: false, Recibos_Registros: Datos_act });
    }

    const [reciboVer, setreciboVer] = useState({ ModalRecibo: false, Reciboid: '', Prefijo: '', NumeroRecibo: '' });
    const { ModalRecibo, Reciboid, Prefijo, NumeroRecibo } = reciboVer;

    const [reciboData, setreciboData] = useState({ Recibos_Registros: [], Loading: false });
    const { Recibos_Registros, Loading } = reciboData;

    const modalVerRecibo = (item) => {
        setreciboVer({ ...reciboVer, ModalRecibo: true, Reciboid: item.id, Prefijo: item.Documento, NumeroRecibo: '' });
    }

    ///Funcion para cerrar modal de pedido
    const cerrarModalRecibo = () => {
        setreciboVer({ ...reciboVer, ModalRecibo: false, Reciboid: '', Prefijo: '', NumeroRecibo: '' });
    }

    const Loading_comp = Loading ? <div style={{ textAlign: 'center' }}><CircularProgress /></div> : null

    return <Fragment>
        <Layout headerTop="visible">
            <h2 className="text-center">RECIBOS</h2>
            {Loading_comp}
            <br />

            <TableContainer component={Paper}>
                <Table stickyHeader style={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Documento</TableCell>
                            <TableCell align="center">Fecha</TableCell>
                            <TableCell align="center">Registros</TableCell>
                            <TableCell align="center">Valor</TableCell>
                            <TableCell align="center">Neto</TableCell>
                            <TableCell align="center">Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Recibos_Registros.map((row, index) => (
                            <TableRow hover key={row.id}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{formatString(row.Documento)}</TableCell>
                                <TableCell align="center">{formatDate(row.Fecha)}</TableCell>
                                <TableCell align="center">{formatNumber(row.Registros)}</TableCell>
                                <TableCell align="right">{formatNumber(row.Valor, true)}</TableCell>
                                <TableCell align="right">{formatNumber(row.Neto, true)}</TableCell>
                                <TableCell algin="center">
                                    <Button color="primary" size="small" title="Ver formato en PDF" onClick={() => modalVerRecibo(row)}>
                                        <VisibilityIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button color="primary" variant="contained" size="small" onClick={buscarRecibos} fullWidth={true}>
                Cargar mas
            </Button>

            <br />

            <Modal isOpen={ModalRecibo} toggle={cerrarModalRecibo} size="lg">
                <ModalHeader toggle={cerrarModalRecibo}>Visualizacion de Recibo: {Prefijo + ' - ' + NumeroRecibo}</ModalHeader>
                <ModalBody>
                    <iframe 
                        style={{ width: '100%', height: 800 }}
                        title="Frame"
                        src={ApiRaiz + '/ReporteApp/Recibo/ImprimirRecibo?id=' + Reciboid}
                    ></iframe>
                </ModalBody>
            </Modal>

        </Layout>
    </Fragment>
}