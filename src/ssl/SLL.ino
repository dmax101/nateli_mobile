//Versão teste - quarentena

//DECLARACAO DAS BIBLIOTECAS
#include <ESP8266WiFi.h>   // biblioteca do Node MCU
//#include <AccelStepper.h>  // biblioteca motor de passo
#include <WiFiClientSecure.h>
#include <MQTT.h>  // biblioteca comunicação mqtt
//#include "DHT.h" // biblioteca do sensor DHT de temperatura
//DECLARACAO E ATRIBUICAO DE VARIAVEIS
//int vel_mt = 400, acel_mt = 400; //velocidade e aceleração do motor



/*
  #define REED1 13 //ReedSwitch 1
  #define REED2 16 //ReedSwitch 2
  #define REED3 12 //ReedSwitch 3
  #define p_en 5 //ENABLE
  #define DEBUG
  #define lamp 15 //lãmpada


  //defines - mapeamento de pinos do NodeMCU
  #define D0    16
  #define D1    5
  #define D2    4
  #define D3    0
  #define D4    2
  #define D5    14
  #define D6    12
  #define D7    13
  #define D8    15
  #define D9    3
  #define D10   1

*/
//SSL
#define CHECK_FINGERPRINT
#include "secrets.h" // ARQUIVO PARA O SSL
#ifndef SECRET
  //informações da rede WIFI
  const char* ssid[] = "RITCHELADEIRA"; //SSID da rede WIFI
  const char* pass[] =  "uy5w8iir"; //senha da rede wifi

  #define HOSTNAME "esp8266_mqtt_client1"   //MQTT
  //informações do broker MQTT
  const char MQTT_HOST[] = "csilab-broker.inatel.br";
  const int MQTT_PORT = 8883;
  const char MQTT_USER[] = "csilab"; // leave blank if no credentials used
  const char MQTT_PASS[] = "WhoAmI#2020"; // leave blank if no credentials used
  const char MQTT_SUB_TOPIC[] = "home/" HOSTNAME "/in";
  const char MQTT_PUB_TOPIC[] = "charger";
  
    // INICIO - PARAMETROS SSL -
    #ifdef CHECK_CA_ROOT
    static const char digicert[] PROGMEM = R"EOF(52a4291c1868e820425a296f87f6bed391173916)EOF";
    #endif

    #ifdef CHECK_PUB_KEY
    // Extracted by: openssl x509 -pubkey -noout -in ca.crt
    static const char pubkey[] PROGMEM = R"KEY(30 82 01 0a 02 82 01 01 00 a2 d0 50 81 24 21 b6 c9 b4 60 41 eb 73 ae c7 91 71 79 a6 08 a7 16 9c 31 71 32 45 52 ae d1 e1 4d 26 61 fc b5 93 89 3b 7c 37 03 42 77 e7 a6 84 14 47 e0 a3 75 69 fc 6f ed 04 d5 6c 28 ce 34 a0 c6 b0 e9 11 0f 80 d8 e9 1f 5c 04 a7 a8 d1 42 d4 b9 28 e0 9e a8 9d 98 bd 9d 1d 5f 24 17 88 2c d4 0a c6 15 12 36 c3 64 ed 79 b7 73 b1 50 d2 6c 88 8d 70 00 c1 7f 7c a9 04 77 45 22 65 84 55 e0 c4 f8 de 50 bb 85 54 1b c6 3e e3 d4 8e 5b 8a 0d 9e 70 f9 37 98 42 d6 ab d1 c8 07 4a c0 20 c7 84 d0 87 21 ff 73 f7 ee 3f e4 ee 30 07 c2 20 e5 6f 4b ef dc 32 04 f8 10 89 b4 d6 06 05 69 5b bf 9a 43 e9 9e e1 79 19 0e 5b e5 d9 37 69 26 e8 4e 4e 02 dc 4b ec 69 01 7a c2 21 e1 7f ad 3f 65 60 bd 4a de 49 ef 7c a0 3f a3 b8 4b a8 c3 24 97 d9 21 8f 7b 92 fa bf 3b ee 82 7e 79 b5 d5 7f c5 32 aa a4 0b 02 03 01 00 01)KEY";
    #endif

    #ifdef CHECK_FINGERPRINT
  // Extracted by: openssl x509 -fingerprint -in ca.crt
    static const char fp[] PROGMEM = "f8416d733853db950c57cf612a563be5070430c8";
    #endif
#endif
//////////////////////////////////////////////////////

#if (defined(CHECK_PUB_KEY) and defined(CHECK_CA_ROOT)) or (defined(CHECK_PUB_KEY) and defined(CHECK_FINGERPRINT)) or (defined(CHECK_FINGERPRINT) and defined(CHECK_CA_ROOT)) or (defined(CHECK_PUB_KEY) and defined(CHECK_CA_ROOT) and defined(CHECK_FINGERPRINT))
#error "cant have both CHECK_CA_ROOT and CHECK_PUB_KEY enabled"
#endif

//FIM - PARAMETROS SSL -



#define DHTPIN 4 //Sensor de Temperatura
#define DHTTYPE DHT11
#define col 0 //ventoinha
#define lamp 2 //lãmpada

//DHT dht(DHTPIN, DHTTYPE); //Iniciando o sensor DHT de temperatura
//AccelStepper motor1(1, 2, 14); // Definicao pinos do driver
BearSSL::WiFiClientSecure net;
MQTTClient client;

int mx = 0, maximo = 0, minimo = 0, mn = 50; //max e min temperatura p/ ligar/desligar ventoinha;
void mqtt_connect()
{
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nMQTT connecting ");
  while (!client.connect(HOSTNAME, MQTT_USER, MQTT_PASS))
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("connected!");

  client.subscribe(MQTT_SUB_TOPIC);
}


//FUNCAO DE RECEBIMENTO E PROCESSAMENTO DE MENSAGENS VINDAS DO BROKER
void messageReceived(String &topic, String &payload)
{
  Serial.println("Recieved [" + topic + "]: " + payload);


  //armazena mensagem recebida em uma variavel inteira
 
  int MSG = payload.toInt();

  //MOSTRANDO RECEBIMENTO DA MENSAGEM NA SERIAL

  Serial.println("**********************************************************************");
  Serial.println();
  Serial.print("Mensagem no topico: ");
  Serial.println(MQTT_PUB_TOPIC);
  Serial.print("Mensagem:");
  Serial.print(MSG);
  Serial.println();
  Serial.print("->");



  //DEFINICOES/REDEFINICOES INICIAIS DO MOTOR
  //motor1.setCurrentPosition(0); //definindo a posicao do motor como a inicial
  //digitalWrite(p_en, LOW);//pino enable em LOW



  //PROCESSAMENTO DAS MENSAGENS

  //MOTOR
  if (MSG == 1) {
    Serial.println(" Gira motor sentido anti horario, subindo a cortina");
    /*
      while (digitalRead(REED1) == 0)
      {
      motor1.moveTo(500);
      motor1.run();   //Comando para subir a cortina
      delay(10);
      }*/
  }

  else if (MSG == 2) {
    Serial.println(" Gira motor sentido horario, descendo a cortina");
    /*
      while (digitalRead(REED2) == 0)
      {
      motor1.moveTo(-500);
      motor1.run();   //Comando para descer a cortina
      delay(10);
      }*/
  }

  else if (MSG == 3) {
    Serial.println(" Parando cortina no meio");
    /*
      if (digitalRead(REED2) != 0)
      {
        Serial.println("Gira motor sentido anti horario, parando a cortina no meio");
        while (digitalRead(REED3) == 0)
        {
          motor1.moveTo(500);
          motor1.run();   //Comando para subir a cortina
          delay(10);
        }
      }
      else
      {
        Serial.println("Gira motor sentido horario, parando a cortina no meio");
        while (digitalRead(REED3) == 0)
        {
          motor1.moveTo(-500);
          motor1.run();   //Comando para descer a cortina
          delay(10);
        }
      } */
  }

  //LAMPADA
  else if (MSG == 4) {
    Serial.print(" Ligando a lampada");
    digitalWrite(lamp, 0);
  }
  else if (MSG == 5) {
    Serial.println(" Desligando a lampada");
    digitalWrite(lamp, 1);
  }
  else { //Regra de max e min para limitar a temperatura
    if (MSG > mn) {
      mx = MSG;
      Serial.print(" Temperatura variando entre ");
      Serial.print(mn);
      Serial.print(" e ");
      Serial.print(mx);
      Serial.println(" °C");


      maximo = mx; mx = 0;
      minimo = mn; mn = 50;
    }
    else
      mn = MSG;
  }
  Serial.println();
  Serial.println("**********************************************************************");
}



void temperatura()//FUNCAO DO AR-CONDICIONADO
{
  float t; //variavel da temperatura
  char MsgTemperaturaMQTT[5];//variavel da temperatura MQTT
  //t = dht.readTemperature();//leitura da temperatura
  t = 23;
  sprintf(MsgTemperaturaMQTT, "%d °C", (int)t); //conversao da temperatura
  client.publish("temp", MsgTemperaturaMQTT);//publicacao no broker MQTT
  Serial.print("Temperature = ");
  Serial.print(t);
  Serial.println("°C");



  float h; //variavel da umidade
  char MsgUmidadeMQTT[5];//variavel da umidade MQTT
  //h = dht.readHumidity();//leitura da umidade
  h = 24;
  sprintf(MsgUmidadeMQTT, "%d" , (int)h); //conversao da umidade
  client.publish("umidade", MsgUmidadeMQTT);//publicacao no broker MQTT
  Serial.print("Humidity: ");
  Serial.println(h);



  float hic; //variavel do indice de calor
  char MsgHeatIndexMQTT[5];//variavel do índice de calor MQTT
  //hic = dht.computeHeatIndex(t, h, false);
  hic = 22;
  sprintf(MsgHeatIndexMQTT, "%d °C", (int)hic); //conversao do índice de calor
  client.publish("indcalor", MsgHeatIndexMQTT);//publicacao no broker MQTT
  Serial.print("Heat index = ");
  Serial.print(hic);
  Serial.println("°C");
  Serial.println();
  Serial.print("->");

  //if (isnan(h)) {
  //Serial.println("Failed to read from DHT sensor!");
  //return;
  //}
  //else {

  //CONDICAO DE ACIONAMENTO/DESACIONAMENTO DA VENTOINHA
  if (hic <= maximo && hic >= minimo)
  {
    Serial.println(" Desligando a Ventoinha...");
    digitalWrite(col, 0);
  }
  else
  {
    Serial.println(" Ligando a Ventoinha...");
    digitalWrite(col, 1);
  }
  Serial.println();
  Serial.println("------------------------");
}


void setup()
{
  //CONEXAO WIFI
  Serial.begin(115200);
  Serial.println();
  Serial.println();
  Serial.print("Attempting to connect to SSID: ");
  Serial.print(ssid);
  WiFi.hostname(HOSTNAME);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("connected!");
  /*
    //DECLARACAO DOS PINOS
    pinMode(p_en, OUTPUT); // pino enable como saída
    pinMode(REED1, INPUT);
    pinMode(REED2, INPUT);
    pinMode(REED3, INPUT); //pinos dos reedswitchs como entradas



    // Configuracoes iniciais motor de passo
    motor1.setMaxSpeed(vel_mt); //400
    motor1.setSpeed(vel_mt); //400
    motor1.setAcceleration(acel_mt); //400
  */
  pinMode(lamp, OUTPUT); //pino da lâmpada como saída
  pinMode(col, OUTPUT); //pino da ventoinha/relé como saída
  //INICIANDO COM A LAMPADA E A VENTOINHA DESLIGADAS
  digitalWrite(lamp, 1);
  digitalWrite(col, 0);

  // INICIO - CONEXÃO SSL -
  #ifdef CHECK_CA_ROOT
    BearSSL::X509List cert(digicert);
    net.setTrustAnchors(&cert);
  #endif
  #ifdef CHECK_PUB_KEY
    BearSSL::PublicKey key(pubkey);
    net.setKnownKey(&key);
  #endif
  #ifdef CHECK_FINGERPRINT
    net.setFingerprint(fp);
  #endif
  #if (!defined(CHECK_PUB_KEY) and !defined(CHECK_CA_ROOT) and !defined(CHECK_FINGERPRINT))
    net.setInsecure();
  #endif
  // FIM - CONEXÃO SSL -
  client.begin(MQTT_HOST, MQTT_PORT, net);
  client.onMessage(messageReceived);

  mqtt_connect();
}



void loop()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.print("Checking wifi");
    while (WiFi.waitForConnectResult() != WL_CONNECTED)
    {
      WiFi.begin(ssid, pass);
      Serial.print(".");
      delay(10);
    }
    Serial.println("connected");
  }
  else
  {
    if (!client.connected())
    {
      mqtt_connect();
    }
    else
    {
      client.loop();
    }
  }
}
