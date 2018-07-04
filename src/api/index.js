import axios from 'axios';
import qs from 'qs';
import store from '../store';

axios.defaults.timeout = 5000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'http://localhost:3001';

// axios.defaults.withCredentials = true

export const get = (params) => {
    const { url, payload, auth } = params;
    let config = {};
    // 负载不为空
    if (payload !== null || payload !== undefined) {
        config = Object.assign({}, config, { params: payload });
    }
    // 需要验证
    if (auth) {
        config = Object.assign({}, config, {
            headers: {
                authorization: store.state.user.auth
            }
        });
    }
    return axios.get(url, config).then(x => x.data);
};

export const post = (params) => {
    const { url, payload, auth } = params;
    let authHeader = {};
    // 需要验证
    if (auth) {
        authHeader = {
            headers: {
                authorization: store.state.user.user.auth
            }
        };
    }
    return axios.post(url, qs.stringify(payload), authHeader).then(x => x.data);
};