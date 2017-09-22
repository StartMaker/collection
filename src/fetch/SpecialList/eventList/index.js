import post from '../../post';
import * as fetchType from '../../../constants/fetchType';



export default function getSpecialEventList(params, token='', type) {
    let url = '/event/specialEvent/';
    if (type == fetchType.FETCH_TYPE_GET_URL2PARAMS) {
        url += params.url;
    }
    const result = post(url, params.body, token);
    return result;
}



