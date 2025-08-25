import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getData } from "../../api";
import { setActiveSort } from "../../helpers/product";

const ShopCategories = ({
  Categorias,
  getSortParams,
  cargarProductos,
  setFiltroData,
  setFiltros }) => {

  let history = useHistory();
  const { categoriaid } = useParams();

  let grupoid = '';

  const [campos, setCampos] = useState({ Grupos_All: [], SubGruposAll: [] });
  const { Grupos_All, SubGruposAll } = campos;

  useEffect(() => {
    async function getParamsFiltro() {
      const FiltrosParam = await getData('GrupoApi/GetSubGrupo', {
        categoriaid: categoriaid
      }, false);

      setCampos(c => c = { Grupos_All: FiltrosParam.data, SubGruposAll: [] });
    }

    getParamsFiltro();
  }, []);

  return (
    <div>
      <div className="sidebar-widget">
        {Grupos_All.length > 0 ? (
          <div>
            <h4 className="pro-sidebar-title" style={{ color: '#1E386F' }}>Grupos </h4>
            <div className="sidebar-widget-list mt-30">
              <ul>
                <li>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={e => {
                        setActiveSort(e);

                        history.push('/shop-grid-filter/' + categoriaid);

                        setFiltros({
                          Categoriaid: categoriaid,
                          Grupoid: null,
                          SubGrupoid: null,
                          ordenar: null
                        });

                        cargarProductos(true, null, null, null);
                        window.location.reload();
                      }}
                    >
                      <span className="checkmark"></span>TODOS
                    </button>
                  </div>
                </li>
              </ul>

              <ul>
                {Grupos_All.map((grupo, key) => {
                  return (
                    <li key={key}>
                      <div className="sidebar-widget-list-left">
                        <button
                          onClick={e => {
                            setActiveSort(e);
                            setFiltros({
                              Categoriaid: categoriaid,
                              Grupoid: grupo.grupoid.toString()
                            });

                            grupoid = grupo.grupoid.toString();
                            const SubGruposDep = Grupos_All.filter(item => item.grupoid === grupo.grupoid)[0].SubGrupos;
                            setCampos({ ...campos, SubGruposAll: SubGruposDep });

                            cargarProductos(true, categoriaid, grupo.grupoid.toString(), null);
                          }}>
                          <span className="checkmark"></span>{grupo.descripcion}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : ("")}

      </div>
      <br />
      <div className="sidebar-widget">
        {SubGruposAll.length > 0 ? (
          <div>
            <h4 className="pro-sidebar-title" style={{ color: '#1E386F' }}>SubGrupos </h4>
            <div className="sidebar-widget-list mt-30">
              <ul>
                {SubGruposAll.map((subgrupo, key) => {
                  return (
                    <li key={key}>
                      <div className="sidebar-widget-list-left">
                        <button
                          onClick={e => {
                            setActiveSort(e);
                            setFiltros({
                              Categoriaid: categoriaid,
                              Grupoid: grupoid,
                              SubGrupoid: subgrupo.subgrupoid.toString()
                            });


                            cargarProductos(true, categoriaid, grupoid, null, subgrupo.subgrupoid.toString());
                          }}>
                          <span className="checkmark"></span>{subgrupo.descripcion}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : ("")}

      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
