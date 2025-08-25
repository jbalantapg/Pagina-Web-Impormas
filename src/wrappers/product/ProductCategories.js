/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApiRaiz } from "../../constant";

const ProductCategories = ({
    // eslint-disable-next-line react/prop-types
    Categorias,
}) => {
    // console.log(Categorias);
    return (
        <Fragment>
            <Container>
                <Row>
                    {Categorias.map((categoria, key) => {
                        return (
                            <Col xs="8" sm="8" md="4" key={key}>
                                <div className="col-xl-12 col-md-8 col-lg-8 col-sm-8" key={key}>
                                    <div className="product-wrap-2-1">
                                        <Link to={process.env.PUBLIC_URL + "/shop-grid-filter/" + categoria.Categoriaid}>
                                            <div className="single-img">
                                                <img
                                                    className="img-fluid"
                                                    src={ApiRaiz + '/Files/Images/' + categoria.Image}
                                                    alt=""
                                                />
                                            </div>
                                            <h4 style={{ textAlign: 'center' }}>{categoria.Descripcion}</h4>
                                        </Link>
                                    </div>
                                </div>
                            </Col>

                        );
                    })}
                </Row>
            </Container>

        </Fragment>
    );
};

ProductCategories.prototype = {
    Categorias: PropTypes.array
}

export default ProductCategories;