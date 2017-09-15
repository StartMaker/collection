import get from '../get';


export default function downLoadReport(token) {
    let url = '/event/report/permission';
    const result = get(url, "", token);
    return result;
}



