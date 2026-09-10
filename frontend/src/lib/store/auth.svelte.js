export const authStore = $state({ user: null, token: null });

// @ts-ignore
export function setAuth(user, token) {
    authStore.user = user;
    authStore.token = token;

    // TODO ne pas utiliser de localStorage en prod !
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // user est un objet JSON, on enregistre QUE des string dans un localStorage
};

export const clearAuth = () => {
    authStore.user = null;
    authStore.token = null;

    localStorage.removeItem('token')
    localStorage.removeItem('user')
};

export const getAuth = () => {

    const token = localStorage.getItem("token");
    // @ts-ignore
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
        authStore.user = user;
        // @ts-ignore
        authStore.token = token;
    } else {
        authStore.user = null;
        authStore.token = null;
    }
};

export const logout = () => {

}

export const isAuthenticated = () => {
    // return true if authStore.token AND authStore.user are not null
    return Boolean(authStore.token && authStore.user);
};