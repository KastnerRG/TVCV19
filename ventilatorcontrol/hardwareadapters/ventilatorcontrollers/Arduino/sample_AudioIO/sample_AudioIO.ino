#include <AudioIO.h>


//#include <SoftModem.h>

AudioIO io = AudioIO();

void setup() {
  Serial.begin(115200);
  Serial.println("Booting");
  //delay(100);
  io.begin();
  //modem.begin();
}

void loop() 
{ 
  //TODO: A demo of the Audio IO functions

   
  //Only write out.
  /*Serial.println("Testing output");
  while(1)
  {
    modem.write('b');
    modem.write('a');
    modem.write('d');
    modem.write(' ');
    //modem.write('\0');
  }*/

  /*
  //loop back
  while(modem.available()){
    int c = modem.read();
    if(isprint(c)){
      Serial.print((char)c);
    }
    else{
      Serial.print("(");
      Serial.print(c,HEX);
      Serial.println(")");      
    }
  }
  if(Serial.available()){
    modem.write(0xff);
    while(Serial.available()){
      char c = Serial.read();
      modem.write(c);
    }
  }
  */
}
