import get from '../get';




export default function getChartData(params, flag, token='') {
    const url = '/event/chart';
    const result = get(url, params, token);
    return result;
}



