import post from '../post';
import * as fetchType from '../../constants/fetchType';
import { obj2params } from '../get';


export default function collect(params, token='', type) {
    console.log(params);
    let url = '/event/dailyEvent';
    if (type == fetchType.FETCH_TYPE_POST_URL2PARAMS) {
        url = `${url}/${params.url}/collect?${obj2params(params.body)}`;
        params.body = '';
    }
    const result = post(url, params.body, token);
    return result;
}

