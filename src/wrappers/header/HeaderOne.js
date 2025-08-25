import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import HeaderTop from "../../components/header/HeaderTop";
import { Link } from "react-router-dom";

const HeaderOne = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerBgClass
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  return (
    <header
      className={`header-area clearfix ${headerBgClass ? headerBgClass : ""}`}
    >
      <div
        className={`${headerPaddingClass ? headerPaddingClass : ""} ${top === "visible" ? "d-none d-lg-block" : "d-none"
          } header-top-area ${borderStyle === "fluid-border" ? "border-none" : ""
          }`}
      >
        {/* <div className={layout === "container-fluid" ? layout : "container"}>
          
          <HeaderTop borderStyle={borderStyle} />
        </div> */}
      </div>

      <div
        className={` ${headerPaddingClass ? headerPaddingClass : ""
          } sticky-bar header-res-padding clearfix ${scroll > headerTop ? "stick" : ""
          }`}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo */}
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        {window.innerWidth < 640 ? (<div className="row">
          <div className="col-xl-1 col-lg-1 col-md-1 col-7 text-center">
            <Link to={process.env.PUBLIC_URL + "/"}>{"Inicio"}</Link>
          </div>
          <div className="col-xl-1 col-lg-1 col-md-1 col-1 text-center">
            <Link to={process.env.PUBLIC_URL + "/shop-grid-filter/:categoriaid"}>
              {"Productos"}
            </Link>
          </div>
        </div>) : ('')}


       <MobileMenu />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string
};

export default HeaderOne;
