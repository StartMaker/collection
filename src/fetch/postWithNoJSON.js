import 'whatwg-fetch' 
import 'es6-promise'



export default function post( ...args ) {
    const [ url, body, token  ] = [ args[0], args[1], args[2] ];
    // console.log('args',args);
    // const params = JSON.stringify(body);
    // console.log('params', params);
    let proToken = 'Bearer ' + token;
    var result = null ;
    console.log('body', body);
    result = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': proToken,
            'Content-Type': 'application/x-www-form-urlencoded, charset=UTF-8'
        },
        body: body
    });
    return result
}