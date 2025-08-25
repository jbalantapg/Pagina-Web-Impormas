import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import Paginator from 'react-hooks-paginator';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
import { getSortedProducts } from '../../helpers/product';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopTopbarFilter from '../../wrappers/product/ShopTopbarFilter';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { getData } from "../../api";
import { useParams } from "react-router-dom";
import ShopCategories from "../../components/product/ShopCategories";
import ShopTopFilter from "../../components/product/ShopTopFilter";
import { isLogin, loginData } from "../../security/utilSecurity";
import { serializeStringToSql } from "../../utilities";
import { useRef } from "react";

const ShopGridFilter = ({ location, products }) => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);

    const [filtroData, setFiltroData] = useState({ Categorias: [] });
    const { Categorias } = filtroData;

    const [productosData, setproductosData] = useState({ Loading: false, Productos_All: [] });
    const { Loading, Productos_All } = productosData;

    const [Filtros, setFiltros] = useState({ Categoriaid: 'null', Grupoid: 'null', SubGrupoid: 'null', ordenar: 'null' });
    const { Categoriaid, Grupoid, SubGrupoid, ordenar } = Filtros;

    const [TextBuscar, setTextBuscar] = useState('');
    console.log('State: ' + TextBuscar);

    let searchText = useRef('');

    const pageLimit = 24;
    const { pathname } = location;
    const { categoriaid } = useParams();

    let categoriaid2 = categoriaid === ':categoriaid' ? null : categoriaid;
    let api = true;
    let api2 = null;
    let terceroid = '';

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }

    try {
        terceroid = JSON.parse(loginData()).Terceroid;
    } catch {
        terceroid = '';
    }

    //let productFilter = products.filter(item => String(item.Categoriaid) === categoriaid);

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
        cargarProductos(true, categoriaid2, null, null, null);
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

    const cargarProductos = async (limpia = false, CategoriaFiltro = '', GrupoFiltro = '', ordenar = '', SubGrupoFiltro = '') => {

        if (limpia === true)
            setproductosData({ ...productosData, Productos_All: [], Loading: true });
        else
            setproductosData({ ...productosData, Loading: true });

        const Datos = await getData('ProductoApi/GetProductos_V2', {
            codigo: '',//serializeStringToSql(Referencia),
            descripcion: '',// serializeStringToSql(Descripcion),
            categoriaid: CategoriaFiltro, //Categoriaid,
            grupoid: GrupoFiltro,//Grupoid,
            subgrupoid: SubGrupoFiltro,
            precio_min: null,
            precio_max: null,
            length: limpia === true ? 0 : Productos_All.length,
            bodegaid: 1,
            orden: ordenar,
            webpedidoid: null,
            api: api,
            api2: api2,
            terceroid: terceroid,
            nombreFull: serializeStringToSql(searchText.current)
        }, false);

        if (Datos.status === true && Datos.data.Status === true) {
            const CantidadItems = Datos.data.Datos.length;

            let productos_ = [];
            if (limpia === true)
                productos_ = Datos.data.Datos;
            else
                productos_ = Productos_All.concat(Datos.data.Datos);

            let PageLimiteProductos = productos_.slice(offset, offset + pageLimit);
            setproductosData({ ...productosData, Loading: false, Productos_All: PageLimiteProductos });
        } else
            setproductosData({ ...productosData, Loading: false });

    }

    const LoadingComponent = Loading === true ? <div className="text-center">
        <div className="spinner-border">
            <span className="sr-only">Loading...</span>
        </div>
    </div> : null;

    return (
        <Fragment>
            <MetaTags>
                <title>LuisfArboleda | Productos</title>
                <meta name="description" content="Shop page of flone react minimalist eCommerce template." />
            </MetaTags>

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>Productos</BreadcrumbsItem>

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* shop top filter */}
                                <h4>Categorias</h4>
                                <ShopTopFilter
                                    products={products}
                                    getSortParams={getSortParams}
                                    setFiltroData={setFiltroData}
                                    setFiltros={setFiltros}
                                    cargarProductos={cargarProductos}
                                    Categorias={Categorias}
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                <ShopCategories
                                    products={products}
                                    getSortParams={getSortParams}
                                    setFiltroData={setFiltroData}
                                    setFiltros={setFiltros}
                                    cargarProductos={cargarProductos}
                                    Categorias={Categorias}
                                />
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                <ShopTopbarFilter
                                    getLayout={getLayout}
                                    getFilterSortParams={getFilterSortParams}
                                    // productCount={products.length}
                                    sortedProductCount={currentData.length}
                                    products={products}
                                    getSortParams={getSortParams}
                                    setFiltroData={setFiltroData}
                                    setFiltros={setFiltros}
                                    cargarProductos={cargarProductos}
                                    Categorias={Categorias}
                                    TextBuscar={TextBuscar}
                                    setTextBuscar={setTextBuscar}
                                    searchText={searchText}
                                />

                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>

                                {/* shop page content default */}
                                <ShopProducts layout={layout} products={Productos_All} />
                                {LoadingComponent}
                                {/* shop product pagination */}

                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}

ShopGridFilter.propTypes = {
    location: PropTypes.object,
    products: PropTypes.array
}

const mapStateToProps = state => {
    return {
        products: state.productData.products
    }
}

export default connect(mapStateToProps)(ShopGridFilter);