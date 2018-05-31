// Asigna un valor por defecto a las funciones
var f1 = "x";
var f2 = "x";
var f3 = "x";
var f4 = "x";
var f5 = "x";
var f6 = "x";

// Convierte el valor entregado por las salidas digitales de arduino a volts
function toVolt(data){
    data = (data*0.00488).toFixed(2);
    return data;
}

function graficar(n){
  var datatemp = toVolt(n.slice(0, 4));
  if (stop){
    document.getElementsByName('valorCanal1')[0].value=nerdamer(f1,{x:datatemp}).toTeX('decimal');
  }
  dataChan1.push(datatemp);
  dataChan1.shift();
  var datatemp = toVolt(n.slice(5, 8));
  if (stop){
    document.getElementsByName('valorCanal2')[0].value=nerdamer(f2,{x:datatemp}).toTeX('decimal');
  }
  dataChan2.push(datatemp);
  dataChan2.shift();
  var datatemp = toVolt(n.slice(9, 12));
  if (stop){
    document.getElementsByName('valorCanal3')[0].value=nerdamer(f3,{x:datatemp}).toTeX('decimal');
  }
  dataChan3.push(datatemp);
  dataChan3.shift();
  var datatemp = toVolt(n.slice(13, 16));
  if (stop){
    document.getElementsByName('valorCanal4')[0].value=nerdamer(f4,{x:datatemp}).toTeX('decimal');
  }
  dataChan4.push(datatemp);
  dataChan4.shift();
  var datatemp = toVolt(n.slice(16, 20));
  if (stop){
    document.getElementsByName('valorCanal5')[0].value=nerdamer(f5,{x:datatemp}).toTeX('decimal');
  }
  dataChan5.push(datatemp);
  dataChan5.shift();
  var datatemp = toVolt(n.slice(20, 24));
  if (stop){
    document.getElementsByName('valorCanal6')[0].value=nerdamer(f6,{x:datatemp}).toTeX('decimal');
  }
  dataChan6.push(datatemp);
  dataChan6.shift();
  var datatemp = n.slice(24, 25);
  dataDig1.push(datatemp);
  dataDig1.shift();
  var datatemp = n.slice(25,26);
  dataDig2.push(datatemp);
  dataDig2.shift();
  // Convierte el valor del contador a decimal y lo muestra en su cuadro
  document.getElementsByName('contador')[0].value=parseInt(n.slice(26,30), 16);
}

// Define el slider
var sliderFormat = document.getElementById('slider-format');                    
// Establece propiedades del slider
noUiSlider.create(sliderFormat, {                                               
    start: [ 100],
    range: {
        'min': [     1,1 ],
        '30%': [   10,  10 ],
        '70%': [   100,  100 ],
        'max': [ 1000 ]
    },
    format: wNumb({
        decimals: 0,
        thousand: '',
    }),
});

var inputFormat = document.getElementById('input-format');               
sliderFormat.noUiSlider.on('update', function( values, handle ) {               
    inputFormat.value = values[handle];

});
// Detecta si el valor del slider ha cambiado si lo ha hecho envia ese nuevo
// valor mediante el puerto serial
inputFormat.addEventListener('change', function(){                             
    sliderFormat.noUiSlider.set(this.value);
    writeSerial(this.value);
});

// Carga la funcion insertada por el usuario
function fx1(){                                                                 
    f1 = document.getElementsByName('fCanal1')[0].value;
// Si no hay nada ingresado, no hay funcion y pasa el valor directamente    
    if (f1.length <1){                                              
      f1 = "x";
    }
// Se guarda la funcion, la cual será evaluada en cada llegada de datos
    f1 = nerdamer(f1);                                                          
}

function fx2(){                                                                
    f2 = document.getElementsByName('fCanal2')[0].value;                        
    if (f2.length <1){                                                         
      f2 = "x";
    }
    f2 = nerdamer(f1);                                                          
}
function fx3(){                                                                
    f3 = document.getElementsByName('fCanal3')[0].value;                        
    if (f3.length <1){                                                         
      f3 = "x";
    }
    f3 = nerdamer(f3);                                                          
}
function fx4(){                                                                
    f4 = document.getElementsByName('fCanal4')[0].value;                        
    if (f4.length <1){                                                         
      f4 = "x";
    }
    f4 = nerdamer(f4);                                                          
}
function fx5(){                                                                
    f5 = document.getElementsByName('fCanal5')[0].value;                        
    if (f5.length <1){                                                         
      f5 = "x";
    }
    f5 = nerdamer(f5);                                                          
}
function fx5(){                                                                
    f5 = document.getElementsByName('fCanal6')[0].value;                        
    if (f5.length <1){                                                         
      f5 = "x";
    }
    f5 = nerdamer(f5);                                                          
}