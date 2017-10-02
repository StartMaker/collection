import post from '../post';




export default function getTopicList(params='', token) {
    const url = '/event/specialPostEvents';
    const result = post(url, params, token);
    return result;
}



