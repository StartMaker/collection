import get from '../../get';



export default function getDailyDataSumPage(params, token='', type) {
    let url = '/event/dailyEvent/pageCount';
    const result = get(url, params, token);
    return result;
}


