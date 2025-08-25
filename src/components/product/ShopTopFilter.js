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
  let categoriaid = useParams();

  const [campos, setCampos] = useState({ Categorias_All: [], Grupos_All: [] });
  const { Categorias_All, Grupos_All } = campos;

  useEffect(() => {
    async function getParamsFiltro() {
      const FiltrosParam = await getData('CategoriaApi/GetCategoriasGrupos', {}, false);

      setCampos(c => c = { Categorias_All: FiltrosParam.data, Grupos_All: [] });
    }

    getParamsFiltro();
  }, []);

  return (
    <div className="row three-column">
      {Categorias_All.map((category, key) => {
        return (
          <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={key}>
            <div className="product-wrpa-3">
              <button className="circulo" onClick={e => {
                setActiveSort(e);

                let actual = Categorias;
                Categorias.push(category.Categoriaid);

                const GruposDep = Categorias_All.filter(item => item.Categoriaid === category.Categoriaid)[0].Grupos;
                const GruposAplica = GruposDep.filter(item => item.aplica_api === true);

                setFiltroData({ Categorias: actual });
                setCampos({ ...campos, Grupos_All: GruposAplica });

                setFiltros({
                  Categoriaid: category.Categoriaid.toString(),
                  Grupoid: null
                });
                history.push('/shop-grid-filter/' + category.Categoriaid.toString());

                cargarProductos(true, category.Categoriaid.toString(), null, '4');

                window.location.reload();
              }}>
                <h5>{category.Descripcion}</h5>
              </button>

            </div>
          </div>
        );
      })}
      <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6">
        <div className="product-wrpa-3">
          <button className="circulo"
            onClick={e => {
              getSortParams("category", "");
              setActiveSort(e);

              history.push('/shop-grid-filter/:categoriaid');

              setFiltros({
                Categoriaid: null,
                Grupoid: null,
                SubGrupoid: null,
                ordenar: '4'
              });

              cargarProductos(true, null, null, '4');
              window.location.reload();
            }}
          >
            <h5>TODOS</h5>
          </button>
        </div>
      </div>
    </div>
    // <div className="sidebar-widget">
    //   <h4 className="pro-sidebar-title" style={{ color: '#1E386F' }}>Categorias </h4>
    //   <div className="">
    //     {Categorias_All ? (
    //       <div>
    //         {Categorias_All.map((category, key) => {
    //           return (
    //             <div className="col-lg-12" key={key}>
    //               <button
    //                 className={String(category.Categoriaid) == String(categoriaid) ? 'active' : null}
    //                 id={'Category' + category.Categoriaid}
    //                 onClick={e => {
    //                   window.location.reload();
    //                   setActiveSort(e);

    //                   let actual = Categorias;
    //                   Categorias.push(category.Categoriaid);

    //                   const GruposDep = Categorias_All.filter(item => item.Categoriaid === category.Categoriaid)[0].Grupos;
    //                   const GruposAplica = GruposDep.filter(item => item.aplica_api === true);

    //                   setFiltroData({ Categorias: actual });
    //                   setCampos({ ...campos, Grupos_All: GruposAplica });

    //                   setFiltros({
    //                     Categoriaid: category.Categoriaid.toString(),
    //                     Grupoid: null
    //                   });

    //                   history.push('/Productos/' + category.Categoriaid.toString());

    //                   cargarProductos(true, category.Categoriaid.toString(), null, null);

    //                   ReactPixel.fbq('trackCustom', 'FiltraCategoria', {
    //                     Categoria: category.Descripcion
    //                   });

    //                 }}
    //               >
    //                 {" "}
    //                 <span className="checkmark" /> {category.Descripcion}{" "}
    //               </button>
    //             </div>
    //           );
    //         })}
    //       </div>
    //       // <ul>
    //       //   <li>
    //       //     <div className="sidebar-widget-list-left">
    //       //       <button
    //       //         onClick={e => {
    //       //           getSortParams("category", "");
    //       //           setActiveSort(e);

    //       //           history.push('/Productos/:categoriaid');

    //       //           cargarProductos(true, null, null, null);
    //       //         }}
    //       //       >
    //       //         <span className="checkmark" /> Todas
    //       //       </button>
    //       //     </div>
    //       //   </li>

    //       // </ul>
    //     ) : (
    //       "No categories found"
    //     )}
    //   </div>
    //   <br />
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func,
  Categorias: PropTypes.array,
  cargarProductos: PropTypes.func,
  setFiltroData: PropTypes.func,
  setFiltros: PropTypes.func
};

export default ShopCategories;
