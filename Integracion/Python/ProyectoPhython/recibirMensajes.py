import stomp
import json

import sys
import time

# necesito implementar una clase que herede de  ConnectionListener
# Estos metodos existen por ConnectionListener, yo solo los 
# sobreescribo
class CalculadoraCuotaCredito(stomp.ConnectionListener):
    def on_error(self, headers, message) :
        print('Mensaje de error:"%s"' % message)
    def on_message(self, headers, message) :
        print('El Mensaje del Html Es "%s"' % message)
        mensajeChat = json.loads(message)
        canal = mensajeChat['DireccionHtml']
        conexion = stomp.Connection([('127.0.0.1' , 61613)])
        conexion.connect('' , '' , wait= True) # no tengo contraseñas puestas
        resultado = CalculadoraCuotaCredito.calculo(mensajeChat)
        mensajeChat = {"Resultado" : resultado}
        mensajeChatJson = json.dumps(mensajeChat)
        conexion.send(body=mensajeChatJson, destination=canal)
        conexion.disconnect()

    def calculo(mensajeJsON) :
        creditoHipotecario = float(mensajeJsON['montoPrestamo'])
        tasaAnual = (float(mensajeJsON['tasaAnual'])/12)/100 
        anosCredito = float(mensajeJsON['añosCredito'])*12

        calculo= float(creditoHipotecario * ( (tasaAnual * ((1 + tasaAnual)**anosCredito)) / (((1 + tasaAnual)**anosCredito) - 1) ))
        return (str(round(calculo, 2)))



conexion = stomp.Connection([('127.0.0.1' , 61613)])
conexion.set_listener('', CalculadoraCuotaCredito())
conexion.connect('' , '' , wait= True) 
conexion.subscribe(destination='/queue/SolicitudCalculo', id=1, ack='auto')
time.sleep(500000) 
conexion.disconnect()