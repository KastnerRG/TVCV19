/* 
Sketch to test ARTe and AUnit
Install AUnit 1.3.0 with Library Manager
Install ARTe 1.6.11-arte-r3 for Arduino Due with Boards Manager
Tested with Arduino Due board and Arduino 1.9.0-beta IDE
*/
  
#include <AUnit.h>

test(correct) {
  int x = 1;
  assertEqual(x, 1);
}

test(incorrect) {
  int x = 1;
  assertNotEqual(x, 1);
}

int led = 13; //built-in led

void setup() 
{
  delay(1000);
  pinMode(led,OUTPUT);
  Serial.begin(115200);
}

void loop() { //background activity, lower priority task
  // Tests run on chip and print to serial monitor
  aunit::TestRunner::run();
}

void loop1(100) //this loop is executed every 100 ms
{
  static int ledstatus = 1;
  if(ledstatus == 0)
  {
    digitalWrite(led,HIGH);
    ledstatus = 1;
  }
  else
  {
    digitalWrite(led,LOW);
    ledstatus = 0;
  }
}

void loop2(1000) // this loop is executed every second
{
  Serial.println("Hello ARTe!");
}
