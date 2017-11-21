import get from '../get';


export default function downLoadSpecialReport(token, body) {
    let url = `/event/report/postReport/${body.year}/${body.month}`;
    const result = get(url, "", token);
    return result;
}



