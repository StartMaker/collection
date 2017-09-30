import post from '../post';




export default function getChartData(params, token='') {
    const url = '/event/specialPostEventChart';
    const result = post(url, params, token);
    return result;
}