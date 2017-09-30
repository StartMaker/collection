import get from '../get';




export default function getTopicList(params='', token) {
    const url = '/event/specialPost/list';
    const result = get(url, params, token);
    return result;
}



