import post from '../post';


export default function downLoadSpecialReport(token, body) {
    let url = `/event/report/postReport`;
    const result = post(url, body, token);
    return result;
}



