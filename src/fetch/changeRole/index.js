import post from '../post';




export default function changeRole(body, token) {
    const url = '/event/user/changeRole';
    const result = post(url, body, token);
    return result;
}



