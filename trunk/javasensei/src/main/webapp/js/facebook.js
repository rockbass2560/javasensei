var logout = function logout() {
    FB.logout(function (response) {
        console.warn("Se hizo logout en facebook %O", response);
        mostrarBackground();
    });
};

var processLogin = function processLogin(response) {
    //Construccion del usuario
    switch (response.status) {
        case 'connected' :
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            usuario.idFacebook = uid;
            usuario.token = accessToken;

            FB.api("/me", {fields: "name,picture"}, function (response) {
                console.log("Datos del facebook: %O", response);

                usuario.nombre = response.name;
                usuario.foto = response.picture.data.url;

                eliminarBackground();

                //Se manda un json para crear u obtener el usuario
                checarUsuario(usuario);

                $("#imagen_usuario").attr("src", usuario.foto);
                $("#nombre_usuario").text(usuario.nombre);
            });
            break;
        case "not_authorized":
            alert("Por favor autorize a la aplicacion para usar facebook");
        default:
            //En caso de que no haga login
            $("#fullscreenlogin").show();
    }
};

function checarUsuario(datos) {
    var urlChecar = url + "estudiantes/getorcreatestudent";
    $.ajax(urlChecar, {
        data: {
            idFacebook: datos.idFacebook,
            token: datos.token
        },
        dataType: "json"
    }).done(function (data) {
        console.log("%cLogin de facebook realizado: %O", "color: red", data);
        usuario = data;
        menu.actualizarMenu();
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '603592966417068',
        xfbml: true,
        version: 'v2.1',
        status: true
    });

    checkLoginState();
};

function checkLoginState() {
    //Obtenemos el token para el trabajo
    FB.getLoginStatus(processLogin);
}

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/es_MX/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
;