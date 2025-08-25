import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";

import { logout } from './../../security/utilSecurity'

const Logout = (props) => {

    useEffect(() => {
        localStorage.clear();
        alert('Se ha cerrado sesión con exito');
        logout();
        // eslint-disable-next-line react/prop-types
        props.history.push('/');
    })

    

  return (
    <Fragment>
      <MetaTags>
        <title>LuisF | Salir</title>
        <meta
          name="Cerrar sesion"
          content="Cierre de sesion de portal walex"
        />
      </MetaTags>

      <LayoutOne headerTop="visible">

      </LayoutOne>
    </Fragment>
  );
}


Logout.propTypes = {
    location: PropTypes.object
};

export default Logout;