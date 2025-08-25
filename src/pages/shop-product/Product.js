import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import { useParams } from "react-router";
import { getData } from "../../api";

const Product = ({ location, products }) => {
  const { pathname } = location;

  const { id } = useParams();
  const [productData, setProductData] = useState({ Loading: true, product: { Imagenes: [] }, htmlCode: '' });
  const { product, Loading, htmlCode } = productData;

  useEffect(() => {
    async function cargar(){
      const Datos = await getData('ProductoApi/GetProductoDataTercero_v2', {
        productoid: id,
        terceroid: 1,
        bodegaid: 1
      }, false);

      setProductData({
        product: Datos.data.Producto,
        Loading: false,
        htmlCode: Datos.data.Html
      });
    }

    cargar();
  }, [id]);

  return (
    <Fragment>
      <MetaTags>
        <title>LuisfArboleda | {product.Producto_cod}</title>
        <meta
          name="description"
          content="Product page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Producto
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
          htmlCode={htmlCode}
        />

        {/* related product slider */}
        {/* <RelatedProductSlider
          spaceBottomClass="pb-95"
        /> */}
      </LayoutOne>
    </Fragment>
  );
};

Product.propTypes = {
  location: PropTypes.object,
  product: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const itemId = ownProps.match.params.id;
  return {
    product: state.productData.products.filter(
      single => single.id === itemId
    )[0]
  };
};

export default connect(mapStateToProps)(Product);
