const TOKEN_KEY = 'LoginTercero';
const TOKEN_DATETIME = 'LoginFecha';

export const login = (datos = {}) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(datos));
    localStorage.setItem(TOKEN_DATETIME, new Date().toString())
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_DATETIME);
    localStorage.clear();
}


export const loginData = () => {
    return localStorage.getItem(TOKEN_KEY);
}


export const isLogin = () => {
    const FechaLogin = localStorage.getItem(TOKEN_DATETIME)
    const FechaMax = addDays(new Date(FechaLogin), 1);

    if (localStorage.getItem(TOKEN_KEY)) {

        if (new Date() > FechaMax) {
            alert('Su sesion ha expirado');
            logout();
            return false;
        }

        return true;
    }

    return false;
}


///Funcion para agregar dias a una fecha
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}