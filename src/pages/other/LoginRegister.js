import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { getData } from "../../api";
import { setTerceroInfo } from "../../redux/actions/terceroActions";
import { login } from './../../security/utilSecurity';

const LoginRegister = (props) => {

  const [loginData, setLoginData] = useState({ Loading: false, User: '', Password: '' });
  const { Loading, User, Password } = loginData;

  const LoadingComponent = Loading ? <div className="spinner-border text-light" role="status">
    <span className="sr-only">Loading...</span>
  </div> : null;

  const validateLogin = async (event) => {
    event.preventDefault();

    if (User === '' || Password === '') {
      alert('El campo usuario y contraseña son obligatorios');
      return;
    }

    setLoginData({ ...loginData, Loading: true });

    const datosLogin = await getData('TerceroApi/LoginTercero', {
      usuario: User,
      contrasena: Password
    });

    if (datosLogin.data.Status === true) {
      login(datosLogin.data.Datos);
      setTerceroInfo(datosLogin.data.Datos.Terceroid);
      // eslint-disable-next-line react/prop-types
      props.history.push('/Home');
    } else {
      alert('Usuario y/o contraseña incorrectos');
      setLoginData({ ...login, Loading: false, User: '', Password: '' });
    }
  }

  return (
    <Fragment>
      <MetaTags>
        <title>LuisF | Login</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Iniciar Sesión</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            
                            <form onSubmit={validateLogin}>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Usuario"
                                value={User}
                                onChange={(e) => setLoginData({ ...loginData, User: e.target.value })}
                                required
                                autoComplete="off"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Contraseña"
                                value={Password}
                                onChange={(e) => setLoginData({ ...loginData, Password: e.target.value  })}
                                required
                              />
                              <div className="button-box">
                                {/* <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div> */}
                                <button type="submit">
                                  <span>Ingresar</span>{LoadingComponent}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
