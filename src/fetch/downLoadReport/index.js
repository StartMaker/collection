import get from '../get';


export default function downLoadReport(token, body) {
    let url = `/event/report/${body.year}/${body.month}`;
    const result = get(url, "", token);
    return result;
}



