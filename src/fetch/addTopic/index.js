import post from '../post';




export default function addTopic(param, token) {
    const url = '/event/topic/add';
    const result = post(url, body, token);
    return result;
}



