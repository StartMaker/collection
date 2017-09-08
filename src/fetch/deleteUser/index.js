import post from '../post';
import * as fetchType from '../../constants/fetchType';



export default function deleteUser(params, token='', type) {
    let url = '/event/user/deleteUser/';
    if (type == fetchType.FETCH_TYPE_POST_URL) {
        url += params;
        params = "";
    }
    const result = post(url, params, token);
    return result;
}

