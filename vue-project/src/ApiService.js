import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);


const ApiService = {
    get() {
    mock.onGet('/').reply(Math.random() > 0.5 ? 200 : 400);
        return axios.get('/');
    }
};

export default ApiService;
