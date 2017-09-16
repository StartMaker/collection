import get from '../get';
import * as fetchType from '../../constants/fetchType';



export default function getDailyDataList(params, token='', type) {
    let url = '/event/dailyEvent/';
    if (type == fetchType.FETCH_TYPE_GET_URL2PARAMS) {
        url += params.url;
    }
    const result = get(url, params.body, token);
    return result;
}



