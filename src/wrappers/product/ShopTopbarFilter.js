import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ShopTopActionFilter from "../../components/product/ShopTopActionFilter";

const ShopTopbar = ({
  getLayout,
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
      {/* shop top action */}
      <ShopTopActionFilter
        getLayout={getLayout}
        getFilterSortParams={getFilterSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
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
    </Fragment>
  );
};

ShopTopbar.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number,
  setFiltroData: PropTypes.func,
  setFiltros: PropTypes.func,
  cargarProductos: PropTypes.func,
  Categorias: PropTypes.array,
  TextBuscar: PropTypes.string,
  setTextBuscar: PropTypes.func,
  searchText: PropTypes.object
};

export default ShopTopbar;
