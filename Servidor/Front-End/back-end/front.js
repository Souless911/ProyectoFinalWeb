"use strict"

const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}

const urlpage = ''
let modalLogin = document.getElementById("loginid");
let btnLogin = document.getElementById("btnLogin");
let galleta = "";

btnLogin.onclick = function (event) {
    let d = {};
    d.email = document.getElementById("correo").value;
    d.password = document.getElementById("password").value;
    log(JSON.stringify(d));
    event.preventDefault();
}

function log(f) {
    sendHTTPRequest('/api/login', f, HTTTPMethods.post, (res) => {
    
        document.cookie = "token: res.token "+ res.send;
    
        window.location.replace("atributos.html");
    }, (err, res) => {
        console.log(err, res);
    });
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    //console.log(TOKEN);
    //xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.responseText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.responseText);
        } else {
           // console.log(xhr.responseText); // Significa que fue exitoso
           document.cookie = xhr.responseText;
            var x = document.cookie;
            galleta = xhr.responseText;
            console.log(x);
            cbOK({status: xhr.status, data: xhr.responseText});
        }
    };
}
function nombre(galleta){
    let correo = galleta.email;
    let ficha = galleta.token;
    sendHTTPRequest('/api/players/players/'+correo, ficha, HTTTPMethods.get, (res) => {
        console.log("cookie funciona");
    }, (err, res) => {
        console.log("cookie no funciona");
    });
}
