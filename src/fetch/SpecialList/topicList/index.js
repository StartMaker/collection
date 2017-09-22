import get from '../../get';


export default function getSpecialTopicList(token, params='') {
    let url = '/event/topic/list';
    const result = get(url, params, token);
    return result;
}