import post from '../post';




export default function addUser(body, token) {
    const url = '/event/user/addUser';
    const result = post(url, body, token);
    return result;
}



