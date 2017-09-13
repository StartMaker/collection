import 'whatwg-fetch' 
import 'es6-promise'



export default function post( ...args ) {
    const [ url, body, token  ] = [ args[0], args[1], args[2] ];
    // console.log('args',args);
    const params = JSON.stringify(body);
    // console.log(params);
    let proToken = 'Bearer ' + token;
    var result = null ;
    let optionsJSON = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': proToken
        };

    let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': proToken
        };

    if (!!body.isJSON) {
        result = fetch(url, optionsJSON ,
            body: params
        });
    } else {
        result = fetch(url, options ,
            body: params
        });
    }

    return result
}