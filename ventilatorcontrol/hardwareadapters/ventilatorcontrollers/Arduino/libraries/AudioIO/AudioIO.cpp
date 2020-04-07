/*
  AudioIO.h - AudioIO library for Wiring - implementation
*/

// include core Wiring API
//#include "WProgram.h"

// include this library's description file
#include "AudioIO.h"

// include description files for other libraries used (if any)
#include "HardwareSerial.h"

// Constructor /////////////////////////////////////////////////////////////////
// Function that handles the creation and setup of instances

AudioIO::AudioIO(){}	//Don't do anything. follow the pattern of SoftModem();

void AudioIO::begin()
{

  // initialize this instance's variables

  // do whatever is required to initialize the library
  modem = SoftModem();	//Will be used to communicate with bus master.

  Serial.println("AudioIO startup");
  delay(100);
  modem.begin();
}

// Public Methods //////////////////////////////////////////////////////////////
// Functions available in Wiring sketches, this library, and other libraries



void AudioIO::doSomething(void)
{
  /*
  // eventhough this function is public, it can access
  // and modify this library's private variables
  Serial.print("value is ");
  Serial.println(value);
  */

  // it can also call private functions of this library
  //doSomethingSecret();
}

// Private Methods /////////////////////////////////////////////////////////////
// Functions only available to other functions in this library

/*
void AudioIO::doSomethingSecret(void)
{
  digitalWrite(13, HIGH);
  delay(200);
  digitalWrite(13, LOW);
  delay(200);
}
*/
