import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { toggleShopTopFilter } from "../../helpers/product";
import ShopCategories from "./ShopCategories";
import ShopSearch from "./ShopSearch";

const ShopTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams,
  setFiltroData,
  setFiltros,
  cargarProductos,
  Categorias,
  TextBuscar,
  setTextBuscar,
  searchText
}) => {
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
              onChange={e => {
                cargarProductos(true, null, null, e.target.value, null);
                setFiltros({
                  Categoriaid: null,
                  Grupoid: null,
                  Subgrupoid: null,
                  ordenar: e.target.value
                });
                getFilterSortParams("filterSort", e.target.value)}}
            >
              <option value="0">Codigo</option>
              <option value="1">Precio de mayor a menor</option>
              <option value="2">Precio de menor a mayor</option>
            </select>
          </div>
          {/* <p>
            Showing {sortedProductCount} of {productCount} result
          </p> */}
        </div>

        {/* <div className="filter-active">
          <button onClick={e => toggleShopTopFilter(e)}>
            <i className="fa fa-plus"></i> Filtrar
          </button>
        </div> */}
        <ShopSearch cargarProductos={cargarProductos} TextBuscar={TextBuscar} setTextBuscar={setTextBuscar} searchText={searchText} /> 
      </div>


    </Fragment>
  );
};

ShopTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number,
  setFiltros: PropTypes.func,
  setFiltroData: PropTypes.func,
  cargarProductos: PropTypes.func,
  Categorias: PropTypes.array,
  TextBuscar: PropTypes.string,
  setTextBuscar: PropTypes.func,
  searchText: PropTypes.object
};

export default ShopTopActionFilter;
