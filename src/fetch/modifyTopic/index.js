import post from '../post';




export default function modifyTopic(body, token) {
    const url = '/event/specialPost/update';
    const result = post(url, body, token);
    return result;
}



