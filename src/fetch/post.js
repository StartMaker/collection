import 'whatwg-fetch' 
import 'es6-promise'



export default function post( ...args ) {
    const [ url, body, flag, token  ] = [ args[0], args[1], args[2], args[3] ];
    // console.log('args',args);
    const params = JSON.stringify(body);
    // console.log(params);
    let proToken = 'Bearer ' + token;
    var result = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': proToken
        },
        body: params
    });

    return result
}