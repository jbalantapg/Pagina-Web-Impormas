import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { isLogin } from "../../../security/utilSecurity";

const MobileNavMenu = ({ strings }) => {
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{"Inicio"}</Link>
        </li>

        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/shop-grid-filter/:categoriaid"}>
            {"Productos"}
          </Link>
        </li>

        {isLogin() === true ? (
          <li className="menu-item-has-children">
            <Link to={process.env.PUBLIC_URL + "/Home"}>
              {"Mi Cuenta"}
            </Link>
          </li>
        ) : ("")}

        {isLogin() === true ?
          (
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/logout"}>
                {"Cerrar Sesión"}
              </Link>
            </li>
          ) : (
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/login-register"}>
                {"Iniciar Sesión"}
              </Link>
            </li>
          )}

      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object
};

export default multilanguage(MobileNavMenu);
