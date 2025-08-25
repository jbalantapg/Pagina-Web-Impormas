import PropTypes from "prop-types";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGrid from "./ProductGrid";
import ProductCategories from "./ProductCategories";
import { useEffect } from "react";
import { useState } from "react";
import { getData } from "../../api";

const TabProduct = ({
  spaceTopClass,
  spaceBottomClass,
  bgColorClass,
  category
}) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function getCategoria() {
      const filtro = await getData('CategoriaApi/GetCategoriasGrupos', {}, false);

      setCategorias(filtro.data);
    }

    getCategoria();
  }, []);

  return (
    <div
      className={`product-area ${spaceTopClass ? spaceTopClass : ""} ${spaceBottomClass ? spaceBottomClass : ""
        } ${bgColorClass ? bgColorClass : ""}`}
    >
      <div className="container">
        <SectionTitle titleText="Novedades" positionClass="text-center" />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className="product-tab-list pt-30 pb-55 text-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Lo Nuevo</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="newArrival">
                <h4>Categorias</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>

            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                <ProductGrid
                  category={category}
                  type="bestSeller"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="newArrival">
              <div className="row three-column">
                <ProductCategories Categorias={categorias.slice(1, 9)} />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

TabProduct.propTypes = {
  bgColorClass: PropTypes.string,
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProduct;
