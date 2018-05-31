// Se definen variables para almacenar temporalmente los datos
var buffer =[];
var buffrecibido= []; 

var RETRY_CONNECT_MS = 1000;
var cid =0;
var connectionId;
var serialOk= 0;

// Se definen variables necesarias para la conexion del puerto serial
var Connection = Backbone.Model.extend({
    defaults: {
        connectionId: null,
        path: null,
        bitrate: 57600,
        dataBits: 'eight',
        parityBit: 'no',
        stopBits: 'one',
        autoConnect: undefined,
        ports: [],
        buffer: null,
        text: '...',
        error: '',
    },

    initialize: function() {
        chrome.serial.onReceive.addListener(this._onReceive.bind(this));
        chrome.serial.onReceiveError.addListener(this._onReceiveError.bind(this));
    },

    enumeratePorts: function() {
        var self = this;
        chrome.serial.getDevices(function(ports) {
            self.set('ports', ports);
            self._checkPath();
        });
    },

    hasPorts: function() {
        return this.get('ports').length > 0;
    },

    autoConnect: function(enable) {
        this.set('autoConnect', enable);
        if (enable) {
            this._tryConnect();
        } else {
            this._disconnect();
        }
    },

    _tryConnect: function() {
        if (!this.get('autoConnect')) {
            return;
        }
        var path = this.get('path');
        if (path) {
            var self = this;
            var opts = {
                bitrate: this.get('bitrate'),
                dataBits: this.get('dataBits'),
                parityBit: this.get('parityBit'),
                stopBits: this.get('stopBits'),
            }

            chrome.serial.connect(path, opts, function(connectionInfo) {
                self.set('buffer', new Uint8Array(0));
                if (connectionInfo) {
                  self.set('connectionId', connectionInfo.connectionId);
                  window.cid = (connectionInfo.connectionId);
                  serialOk= 1;
                } else {
                  self.set('connectionId', null);
                  self.set('autoConnect', false);
                  self.set('error'+'</div>');
                }
            });
        } else {
            this.enumeratePorts();
            setTimeout(this._tryConnect.bind(this), RETRY_CONNECT_MS);
        }
        var cid = this.get('connectionId');
    },

    _disconnect: function() {
        var msg =  '<br/>'
        
        console.log(arrv);
        var cid = this.get('connectionId');
        if (!cid) {
            return;
        }

        var self = this;
        chrome.serial.disconnect(cid, function() {
            self.set('connectionId', null);
            self.enumeratePorts();
        });
    },

    _checkPath: function() {
        var path = this.get('path');
        var ports = this.get('ports');

        if (ports.length == 0) {
            this.set('path', null);
            return;
        }

        for (var i = 0; i < ports.length; ++i) {
            var port = ports[i];
            if (port.path == path) {
                return;
            }
        }

        // Intentar conectarse al primer puerto listado
        var portIdx = 0;
        for (var i = 0; i < ports.length; ++i) {
            var port = ports[i];
            if (port.path.indexOf('/dev/cu.usbmodem') === 0) {
                portIdx = i;
                break;
            }
        }
        this.set('path', ports[portIdx].path);
    },

    _onReceive: function(receiveInfo) {
        var cid = this.get('connectionId');
        
        var data = receiveInfo.data;
        
        data = new Uint8Array(data);
        // Junta el buffer con los ultimos datos recibidos
        var result = catBuffers(buffer,data)                                    
        buffer = result;
        // Busca un quiebre de linea                                                        
        var lbr = findLineBreak(result);                                        

        if (lbr !== undefined) {
        // Si es que hay un quiebre de linea divide los datos entre una frase
        //  correcta y lo sobrante
            var txt = result.slice(0, lbr);                                     
            buffer = result.slice(lbr +1);
            var correcto = [];
            // Convierte los datos de ASCII decimal a ASCII hex
            for(var i = 0; i < txt.length; ++i){                                
                correcto += txt[i].toString(16);
            }
            // Convierte los datos desde Hex a characters o string
            correcto = hex_to_ascii(correcto);                                   
            // Envia los datos para ser graficados
            graficar(correcto);                                             
        }
    },

    _onReceiveError: function(info) {
        this._disconnect();
        this.set('error', info.error);
        this.enumeratePorts();
    }
});

$(function() {
    var connection = new Connection();
    connection.on('change:text', function(c) {
        var text = c.get('text');
    });
    connection.on('change:error', function(c) {
        var text = c.get('error');
    });
    connection.on('change:ports', function(c) {
        var ports = c.get('ports');
        var $port = $('#port');
        $port.empty();
        for (var i = 0; i < ports.length; ++i) {
            var port = ports[i];
            $('<option value="' + port.path + '">' +
              port.path + ' ' + (port.displayName || '') + '</option>').appendTo($port);
        }
        if (ports.length == 0) {
            $('<option value="">[no device found]</option>').appendTo($port);
            $port.prop('disabled', true);
        } else {
            $port.val(c.get('path'));
        }
    });
    connection.on('change:autoConnect', function(c) {
        var autoConnect = !!c.get('autoConnect');
        $('#stop-connection').toggle(autoConnect);
        $('#connect').toggle(!autoConnect);
        $('#port').prop('disabled', autoConnect || !c.hasPorts());
        $('#bitrate, #dataBits, #parityBit, #stopBits').prop('disabled', autoConnect);
    });
    connection.on('change:path', function(c) {
        var path = c.get('path');
        $('#port').val(path);
    });
    connection.on('change:connectionId', function(c) {
        var connected = !!c.get('connectionId');
        $('.btn-connection').toggleClass('connected', connected);
    });
    $('#connect').click(function(e) {
        e.preventDefault();
        connection.send(true);
    });
    $('#port').change(function(e) {
        connection.set('path', $(this).val());
    });
    $('#bitrate').change(function(e) {
        connection.set('bitrate', parseInt($(this).val()));
    });
    $('#dataBits, #parityBit, #stopBits').change(function(e) {
        connection.set($(this).attr('name'), $(this).val());
    });
    $('#stop-connection').click(function(e) {
        e.preventDefault();
        connection.autoConnect(false);
    });
    connection.autoConnect(true);
});

// Junta el buffer con los ultimos datos recibidos
function catBuffers(a, b) {                                                      
    // Crea una nueva variable del tamaño del buffer y los datos recibidos
    var result = new Uint8Array(a.length + b.length);
    // Deposita el buffer en esta variable
    result.set(a);
    // Deposita los datos en esta variable
    result.set(b, a.length);
    // Devuelve el resultado
    return result;                                                                                            
}

// Busca un quiebre de linea dado por el valor "10" de ASCII decimal (fin de linea)
function findLineBreak(b) {                                                                               
    for (var i = 0; i < b.length; ++i) {
        if (b[i] == 10)
            return i;
    }
}
// Convierte un grupo de datos hexadecimales en caracteres ASCII
function hex_to_ascii(str1)
 {
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
 }

// Enviar datos serial
 var writeSerial=function(str) {
  chrome.serial.send(window.cid, convertStringToArrayBuffer(str),  function(sendInfo) {
    if (sendInfo.error) {
        console.log(sendInfo.error);
    } else if (sendInfo.bytesSent > 0) {
        console.log('Message sent!');
    }
  });
}

// Convertir string a ArrayBuffer
var convertStringToArrayBuffer=function(str) {
    var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}
