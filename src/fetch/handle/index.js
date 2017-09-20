import post from '../post';
import * as fetchType from '../../constants/fetchType';
// import { obj2params } from '../get';


export default function Handle(params, token='', type) {
    console.log(params);
    let url = '/event/handledEvent';
    if (type == fetchType.FETCH_TYPE_POST_URL2BODY) {
        url = `${url}/${params.url}/handle`;
    }
    const result = post(url, params.body, token);
    return result;
}

