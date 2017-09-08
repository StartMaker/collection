import post from '../post';




export default function modifyPW(body, token) {
    const url = '/event/user/updatePwd';
    const result = post(url, body, token);
    return result;
}



