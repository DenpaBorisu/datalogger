
// Contador
volatile int conteo;
int pin_int = 0;

// Timer
#include <TimerOne.h>
volatile double tiempo;

// ADC
volatile int readFlag;
volatile byte ADL,ADH;
volatile int canal=0;
String datos;
char buff[4];
char dest[30];

// Digital
char D3,D4;


void setup() {

  // ADC
    //ADMUX
      // REFS1..0 seteados para operar el ADC con VCC (01)
      // ADLAR (0) -> ADCL 8 bits, ADCH 2 bits mas significativos
      // | REFS1 | REFS0 | ADLAR | – | MUX3 | MUX2 | MUX1 | MUX0 |
  ADMUX = B01000000;
    // ADCSRA
      // ADEN: settear para activar el ADC
      // ADPS2..0 todos seteados para tener el prescaler en 120 => 125khz
      // ADIE: Habilitar las interrupciones por ADC
      // ADSC: Iniciar conversion
      // | ADEN | ADSC | ADATE | ADIF | ADIE | ADPS2 | ADPS1 | ADPS0 |
  ADCSRA = B11001111;

  // Digital
	// Define ambos pines como entradas digitales
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  	
   
  // Serial
  	// Inicializa el puerto serial del arduino
  Serial.begin(57600);
    // Contador
    // pin_int: pin con el cual se contara
    // contador: funcion llamada por la interrupcion
    // rising: solo los cantos de subida activan la interrupcion
  attachInterrupt(pin_int, contador, RISING);
    // Timer
    // Define un tiempo inicial para la interrupcion con timer (µs)
    // Funcion que será llamada mediante esta interrupcion
  Timer1.initialize(100000);
  Timer1.attachInterrupt(timer);
  
    // Habilitar interrupciones globales
  sei();
}

void contador() {
  
  // Aumenta en una unidad el conteo
  conteo++;
}

void timer(){
  // Lee los pines digitales
  D3= bitRead(PIND,3);
  D4= bitRead(PIND,4);
  // Anexa todos los datos 
  sprintf( buff,"%1i%1i", D3,D4);
  strcat(dest,buff);
  sprintf(buff,"%04X",conteo);
  strcat(dest,buff);
  memset(buff,0,sizeof(buff));

  //Envia los datos mediante el puerto serial
  Serial.print(dest);
  Serial.write(0x0A);
 
  // Inicia nuevamente el ciclo de lecturas de las entradas analogas
  ADCSRA |=B01000000;

  // Vacia el arreglo de datos
  memset(dest,0,sizeof(dest));
}

void loop() {
  
  // Revisa si hay datos esperando en el puerto serial
  // De ser asi los convierte a su valor numerico
  // Y cambia el tiempo del Timer
  if(Serial.available()){
    tiempo = Serial.readString().toInt();
    noInterrupts();
    Timer1.initialize(1000*tiempo);
    interrupts();
  }
  // Si un dato ya fue leido
  if (readFlag ==1){
    // Desactiva el flag de lectura
    readFlag = 0;
    // Anexar datos
    unsigned int word = ((unsigned int)ADH << 8) + ADL;
    sprintf( buff,"%4i", word);
    strcat(dest, buff);
    // Vacia el arreglo temporal
    memset(buff,0,sizeof(buff));    
    }
}


ISR(ADC_vect){
  
  // Guarda la lectura ADC
  ADL=ADCL;
  ADH=ADCH;
  // Si el canal es menor a 6
  if (canal <6)
  {
   // Siguiente canal
   canal++;
   ADMUX++;
  }
  // Si el canal a llamar la siguiente vuelta es el 6
  // asignar al canal 0 y pausar el ciclo de conversiones
  if (canal ==6){
    canal = 0;
    ADMUX = B01000000;
  }
  // Si el canal a leer a continuacion no es superior al 5
  // iniciar otra conversion del ADC
  if (canal <5){
  ADCSRA |=B01000000;
  }
  // Activa el Flag de lectura
  readFlag = 1;  
}




