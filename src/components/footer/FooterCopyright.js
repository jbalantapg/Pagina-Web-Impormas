import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const FooterCopyright = ({ footerLogo, spaceBottomClass }) => {
  return (
    <div className={`copyright ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="footer-logo">
        <Link to={process.env.PUBLIC_URL + "/"}>
          <img alt="" src={process.env.PUBLIC_URL + footerLogo} />
        </Link>
      </div>
      <p>
        © 2022{" "}
        <a href="//hasthemes.com" rel="noopener noreferrer" target="_blank">
          Impormas Cali
        </a>
        .<br /> Todos los Derechos Reservados
      </p>
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default FooterCopyright;
