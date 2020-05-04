
var canal = '/queue/Calcular/' + uuidv4();

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



function MensajeChat(montoPrestamo, tasaAnual, añosCredito) {
    this.montoPrestamo = montoPrestamo;
    this.tasaAnual = tasaAnual;
    this.añosCredito = añosCredito;
    this.DireccionHtml = canal;
}

$(document).ready(function () {
    $("#btnCalcular").click(EnviarDatosCalculo);
    suscribirse();

});

function suscribirse() {
    var url = "ws://localhost:61614/stomp";
    var client = Stomp.client(url);
    client.connect({}, function () {
        client.subscribe(canal, ResultadoCalculo);
    });
}

function ResultadoCalculo(mensaje) {
    if (mensaje.body) {
        var mensajeChat = JSON.parse(mensaje.body)
        var Resultado = document.getElementById("Resultado");
        Resultado.innerHTML = "El Resultado De La Cuota Mensual A Pagar Es De: $"+mensajeChat.Resultado;
    }
}

function EnviarDatosCalculo() {


    var errorMontoPrestamo = document.getElementById("ErrorMonto");
    var errorInteresAnual = document.getElementById("ErrorInteres");
    var errorAñosCredito = document.getElementById("ErrorCredito");
    var montoPrestamo = $("#MontoPrestamo").val();
    var interesAnual = $("#InteresAnual").val();
    var añosCredito = $("#AñosCredito").val();

    if (montoPrestamo != "" && interesAnual != "" && añosCredito != "") {
        errorMontoPrestamo.innerHTML = "";
        errorInteresAnual.innerHTML = "";
        errorAñosCredito.innerHTML = "";
        var url = "ws://localhost:61614/stomp";
        var client = Stomp.client(url);
        var montoPrestamo = $("#MontoPrestamo").val();
        var interesAnual = $("#InteresAnual").val();
        var añosCredito = $("#AñosCredito").val();
        var mensajeChat = new MensajeChat(montoPrestamo, interesAnual, añosCredito);
        client.connect({}, function () {
            client.send('/queue/SolicitudCalculo',
                { "priority": 9, "amq-msg-type": "text" },
                JSON.stringify(mensajeChat));
            client.disconnect();
        });
        var montoPrestamo = $("#MontoPrestamo").val("");
        var interesAnual = $("#InteresAnual").val("");
        var añosCredito = $("#AñosCredito").val("");
    }
    else {
        if (montoPrestamo == "") {
            errorMontoPrestamo.innerHTML = "Ingrese Monto Del Prestamo";
        } else {
            errorMontoPrestamo.innerHTML = "";
        }
        if (interesAnual == "") {
            errorInteresAnual.innerHTML = "Ingrese Interes Anual";
        } else {
            errorInteresAnual.innerHTML = "";
        }
        if (añosCredito == "") {
            errorAñosCredito.innerHTML = "Ingrese Años Del Credito";
        } else {
            errorAñosCredito.innerHTML = "";
        }

    }
}






