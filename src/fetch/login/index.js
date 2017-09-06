import post from '../post';




export default function login(body, flag, token='') {
    const url = '/event/login';
    const result = post(url, body, flag, token);
    return result;
}



