// Inicia con pausa desactivada
var stop =true;

// Preparacion de datos iniciales
var axisx =  new Array(1000).fill(null);
var dataDig1= new Array(1000).fill(0);
var dataDig2= new Array(1000).fill(0);
var dataChan1 =  new Array(1000).fill(0);
var dataChan2 =  new Array(1000).fill(0);
var dataChan3 =  new Array(1000).fill(0);
var dataChan4 =  new Array(1000).fill(0);
var dataChan5 =  new Array(1000).fill(0);
var dataChan6 =  new Array(1000).fill(0);

// Asigna la ubicacion que tendra el grafico
var grafico = echarts.init(document.getElementById('main'));
// Define las opciones del grafico
var option = {
        tooltip: {
            trigger: 'axis',
            transitionDuration: 0,
            showDelay: 0
        },
        legend: {
            data: ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4', 'Canal 5',
            'Canal 6','Digital 1','Digital 2']
        },
        // Sin animacion para mejorar su desempeño
        animation: false,
        addDataAnimation: false,
        // Activar opciones del toolbox de Echarts, guardar imagen, revision de 
        // datos y restauracion
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        grid: [{
        left: 50,
        right: 50,
        height: '60%'
    }, {
        left: 50,
        right: 50,
        top: '80%',
        height: '10%'
    }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            show: true,
            splitLine: {
                show: false
            },
            data: axisx
        },
        {
            gridIndex: 1,
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: axisx,
            position: 'top'
        }],
        yAxis: [{
            type: 'value',
            min: null,
            max: 5
        },
        {
        	gridIndex: 1,
                type: 'value',
                max:1,
                splitNumber:1
            }],
        series: [{
            name: 'Canal 1',
            type: 'line',
            symbol: 'none',
            data: dataChan1
        }, {
            name: 'Canal 2',
            type: 'line',
            symbol: 'none',
            data: dataChan2
        }, {
            name: 'Canal 3',
            type: 'line',
            symbol: 'none',
            data: dataChan3
        }, {
            name: 'Canal 4',
            type: 'line',
            symbol: 'none',
            data: dataChan4
        }, {
            name: 'Canal 5',
            type: 'line',
            symbol: 'none',
            data: dataChan5
        }, {
            name: 'Canal 6',
            type: 'line',
            symbol: 'none',
            data: dataChan6
        },
        {
            name:'Digital 1',
            type:'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            symbol: 'none',
            step: 'start',
            data:dataDig1
        },{
            name:'Digital 2',
            type:'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            symbol: 'none',
            step: 'start',
            data:dataDig2
        }],
        // Activa la capacidad de zoom en el grafico
        dataZoom: {
            show: true,
            realtime : true,
            xAxisIndex: [0, 1]
        }
};

// Generar grafico inicial
grafico.setOption(option);

// Controla la opcion de pausar la actualizacion del grafico
var stopFunction = function() {
    stop = !stop;
}

// Funcion de actualizacion del grafico
setInterval(function() {
    // Si se ha activado la pausa, pausar
    if (stop){
    grafico.setOption(option);
}
}, 100);

