import post from '../post';




export default function login(body) {
    const url = '/event/login';
    const result = post(url, body);
    return result;
}



