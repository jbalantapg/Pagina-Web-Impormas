import React, { useEffect } from "react";
import PropTypes from "prop-types";

const ShopSearch = ({
  TextBuscar,
  setTextBuscar,
  cargarProductos,
  searchText
}) => {

  return (
    <div className="sidebar-widget">
      {/* <h4 className="pro-sidebar-title" style={{ color: '#1E386F' }}>Buscar </h4> */}
      <div className="pro-sidebar-search mb-10 mt-15">
        <form className="pro-sidebar-search-form" action="#">
          <input type="text" placeholder="Busca Aquí..."
            value={TextBuscar}
            autoComplete={'off'}
            onChange={(e) => {
              setTextBuscar(e.target.value);
              searchText.current = e.target.value;

              if (e.target.value.length >= 4) {
                cargarProductos(true, null, null, null);
              }else if (e.target.value.length === 0){
                cargarProductos(true, null, null, null);
              }
            }}
          />
          <button disabled>
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div >
  );
};

ShopSearch.propTypes = {
  TextBuscar: PropTypes.string,
  setTextBuscar: PropTypes.func,
  cargarProductos: PropTypes.func,
  searchText: PropTypes.object
};

export default ShopSearch;
