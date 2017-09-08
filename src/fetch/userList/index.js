import get from '../get';




export default function getUserList(token='', body='', flag='' ) {
    const url = '/event/user/roleList';
    // console.log('token in fetch',token)
    const result = get(url, body, token);
    return result;
}



