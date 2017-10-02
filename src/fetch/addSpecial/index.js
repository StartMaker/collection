import post from '../post';




export default function addSpecial(param, token) {
    const url = '/event/topic/add';
    const result = post(url, param, token);
    return result;
}



