export const authStore = $state({ user: null, token: null });

export const setAuth = (user, token) => {
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
    // 1. search user and token from localStorage
    // 2. if they exist, save them into authStore
    // 3. else clear authStore
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
        authStore.user = user;
        authStore.token = token;
    } else {
        authStore.user = null;
        authStore.token = null;
    }
};

export const isAuthenticated = () => {
    // return true if authStore.token AND authStore.user are not null
    return Boolean(authStore.token && authStore.user);
};