#define SECRET

const char* ssid = "RITCHELADEIRA"; //SSID da rede WIFI
const char* pass =  "uy5w8iir"; //senha da rede wifi

#define HOSTNAME "esp8266_mqtt_client1"

const char MQTT_HOST[] = "csilab-broker.inatel.br";
const int MQTT_PORT = 8883;
const char MQTT_USER[] = "csilab"; // leave blank if no credentials used
const char MQTT_PASS[] = "WhoAmI#2020"; // leave blank if no credentials used

const char MQTT_SUB_TOPIC[] = "home/" HOSTNAME "/in";
const char MQTT_PUB_TOPIC[] = "charger";

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
