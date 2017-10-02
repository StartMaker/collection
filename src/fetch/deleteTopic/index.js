import post from '../post';
import * as fetchType from '../../constants/fetchType';



export default function deleteTopict(params, token='') {
    let url = '/event/specialPost/delete';
    const result = post(url, params, token);
    return result;
}

