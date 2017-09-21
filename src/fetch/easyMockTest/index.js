import get from '../get';




export default function getMockData(body='', token='') {
    const url = 'https://easy-mock.com/mock/59b4ab53e0dc663341a3c35b/example/testDemo';
    // console.log('token in fetch',token)
    const result = get(url, body, token);
    return result;
}



