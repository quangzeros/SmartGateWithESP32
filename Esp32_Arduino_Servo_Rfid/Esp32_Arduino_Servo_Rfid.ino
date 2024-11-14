#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h> // Thư viện ArduinoJson
#include <WiFi.h>
#include <HTTPClient.h>





#define WIFI_SSID "Quangdepzaivodichvutru"
#define WIFI_PASSWORD "30112004"



// Set web server port number to 80
WiFiServer server(80);

// Variable to store the HTTP request
String header;

Servo myServo;  // Tạo đối tượng servo
int servoPin = 33;  // Chân kết nối Servo (ở đây là GPIO 18)

#define SS_PIN1 21  // Chip select pin for first RFID reader
#define RST_PIN1 22 // Reset pin for first RFID reader
#define SS_PIN2 25  // Chip select pin for second RFID reader
#define RST_PIN2 26 // Reset pin for second RFID reader

#define TRIG_PIN 32
#define ECHO_PIN 35
#define TIME_OUT 5000

#define Buzzer 27 

MFRC522 rfid1(SS_PIN1, RST_PIN1); // Create instance for first RFID reader
MFRC522 rfid2(SS_PIN2, RST_PIN2); // Create instance for second RFID reader

#define serverApi "https://esp32server-587a.onrender.com"
bool isAllowedById(String UID, String endPoint){
    HTTPClient http;
    String Api = String(serverApi) + endPoint   + UID;
    Serial.println(Api);
   http.begin(Api);
    
    // Thực hiện GET request
    int httpResponseCode = http.GET();

      // Nếu nhận được phản hồi từ server
    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + payload);

      // Tạo đối tượng DynamicJsonDocument để phân tích JSON
      DynamicJsonDocument doc(2048);
      DeserializationError error = deserializeJson(doc, payload);
        // Lặp qua từng phần tử của mảng JSON
          const char*  message =  doc["message"].as<const char*>();  
           
          if(String(message) == "User not found"){
              Serial.println(message);  
            return false;
          }
          const char* allow =  doc["allow"].as<const char*>(); 
          Serial.println(allow);
          if(String(allow) == "true"){
            return true;
          }else{
            return false;
          }


    } 
    
    http.end(); // Kết thúc kết nối

}


float GetDistance()
{
  long duration, distanceCm;
   
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  duration = pulseIn(ECHO_PIN, HIGH, TIME_OUT);
  // convert to distance
  distanceCm = duration / 29.1 / 2;
  
  
  return distanceCm;
}

unsigned long startTime = 0;  // Biến lưu thời gian bắt đầu

bool lastExist;
bool isExist;

String userId = "";
bool isControlByAdmin = false;
bool isDoorOpen = false;
bool isValidate = false;
bool isAllow = false;
bool isGoIn = false;
bool isGoOut = false;
String UID = "";
bool isBlock = false;

bool isHumanExist(){
  long distance = GetDistance();
  Serial.print("distance:");  
  Serial.println(distance);
  delay(200);
  if(distance < 5 && distance != 0){
     return 1;
  }



  return 0;

}


void openDoor(){
  myServo.write(30);
  isDoorOpen = true; 
  Serial.println("Open Door!");
}

void closeDoor(){
  myServo.write(120);
  isDoorOpen = false; 
  Serial.println("Close Door!");
}

String getUID(MFRC522 reader) {
  if (!reader.PICC_IsNewCardPresent()) {
    return "";  // Không có thẻ mới, trả về chuỗi rỗng
  }
  if (!reader.PICC_ReadCardSerial()) {
    return "";  // Không thể đọc thẻ, trả về chuỗi rỗng
  }
    digitalWrite(Buzzer,HIGH);
    delay(200);
    digitalWrite(Buzzer,LOW);

  String uidString = "";
  for (byte i = 0; i < reader.uid.size; i++) {
    uidString += String(reader.uid.uidByte[i], HEX);  // Lấy từng byte của UID và chuyển sang dạng hex
  }
  uidString.toUpperCase();  // Chuyển đổi thành chữ in hoa
    delay(400);
  return uidString;
}

void setup() {
  Serial.begin(115200); // Initialize serial communications




  SPI.begin();          // Init SPI bus
  rfid1.PCD_Init();    // Init first MFRC522
  rfid2.PCD_Init();    // Init second MFRC522
  pinMode(Buzzer,OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  myServo.attach(servoPin);  // Gán servo vào chân GPIO


    myServo.write(120);



  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);

  while(WiFi.status()!=WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to ");
  Serial.print(WIFI_SSID);

    // In địa chỉ IP tĩnh của ESP32
  Serial.println("Connected to WiFi");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());




  server.begin();

  Serial.println("RFID Readers Ready");
  


}

void loop() {
  //Nhận dữ liệu Realtime từ Server
  WiFiClient client = server.available();
    if (client) {                             // If a new client connects,
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
                  // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            // turns the GPIOs on and off
            if (header.indexOf("GET /state") >= 0) {
                if(isDoorOpen == false){
                  client.println("close");
                }else{
                  client.println("open");
                }
            } 
            // turns the GPIOs on and off
            if (header.indexOf("GET /open") >= 0) {
              isControlByAdmin = true;
              openDoor();
            } 

             if (header.indexOf("GET /close") >= 0) {
              isControlByAdmin = false;
              closeDoor();
            } 
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  //Chế độ người dùng điều khiển bằng điện thoại
  if(isControlByAdmin){

  }// Chế độ người dùng quẹt thẻ
  else{
    // Người dùng chưa quẹt thẻ hoặc thẻ không hợp lệ
    if(!isValidate){

      //Đóng cửa khi người dùng qua cửa
      if(isDoorOpen){
        unsigned long currentTime = millis();
        if (currentTime - startTime >= 3000) {  // 3000 ms = 3 giây
                Serial.println("Đã qua !");
                closeDoor();
              }
      }

      //Phát hiện người dùng quẹt thẻ vào
      userId = getUID(rfid1);
      if(userId != ""){
        Serial.println(userId);
        //Gọi lên server rồi sửa biến isAllow
        isAllow = isAllowedById(userId,"/usersPerIn/");
        
        if(isAllow){
          isValidate = true;
          isGoIn = true;
          UID = userId;
        }
      }

      //Phát hiện người dùng quẹt thẻ ra
       userId = getUID(rfid2);
      if(userId != ""){
        Serial.println(userId);

        //Gọi lên server rồi sửa biến isAllow
        isAllow = isAllowedById(userId,"/usersPerOut/");
        if(isAllow){
          isValidate = true;
          isGoOut = true;
          UID = userId;
        }
      }


    }//Người dùng sau khi đã quẹt thẻ và được xác nhận
    else{
      // Cửa mở
      if(isAllow){
        openDoor();
        startTime = millis();  
        isAllow = false;
      }// Xử lý sự kiện cửa đóng
      else{
          //Người dùng đi qua
              isExist = isHumanExist();
              unsigned long currentTime = millis();  // Lấy thời gian hiện tại
              if (currentTime - startTime >= 4000) {  // 4000 ms = 4 giây
                Serial.println("Đã qua 4 giây!");
                closeDoor();
                isValidate = false;
              }

              if(isExist){
                startTime = millis();
                isBlock = true;  
                  //Gửi request lên server người dùng đã vào
                  if(isGoIn){
                    isGoIn = false;
                    isAllowedById(UID,"/handleUsersPerIn/");
                    UID = "";
                  }

                  //Gửi request lên server người dùng đã ra
                  if(isGoOut){
                    isGoOut = false;
                    isAllowedById(UID,"/handleUsersPerOut/");
                    UID = "";
                  }
              }else{
                if(isBlock){
                  isValidate = false;
                }
                isBlock = false;
              }

            
   
      }



    }
  }





}
