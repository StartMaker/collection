import get from '../get';
import * as fetchType from '../../constants/fetchType';


export default function getHandleDataList(params, token='', type) {
    let url = '/event/handledEvent/';
    if (type == fetchType.FETCH_TYPE_GET_URL2PARAMS) {
        url += params.url;
    }
    const result = get(url, params.body, token);
    return result;
}



