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

//Function to parse a command that lives in the _mMasterData member
//TODO make this private and make it only exist in a library instantiated loop.
void AudioIO::parseCommand()
{
    //check we have data
    if(_mMasterData.available)
    {
        //Clear command regardless.
        _mMasterData.available = false;
        
        //Process command. Very basic. Only consider the 4th character in the buffer.
        switch(_mMasterData.buffer_cmd[3])
        {
            case 'd':   //Assume master wants to read ventilator data (rd) string
                sendVentilatorData();
                break;
                
            case 'k':   //Assume master wants to write control knobs
                setVentilatorControl();
                break;
                
            default: 
                Serial.println("Warning! Unrecognized Master command:");//We don't handle this command (maybe we should)
                Serial.println(_mMasterData.buffer_cmd);
                break;
        }
    }
}

// Private Methods /////////////////////////////////////////////////////////////
// Functions only available to other functions in this library

void AudioIO::sendVentilatorData()
{
    //DEBUG ONLY, WRITE A GENERIC STRING TO THE UART
    //Return the internal copies of class struct
    unsigned char i = 0;
    
    while(i<FULLREADLEN-(3*2)//DEBUG!!!!!
            )
    {
        Serial.print(*(FullRead+i));
        i++;
    }
    Serial.print('\n');
}

void AudioIO::setVentilatorControl()
{
    //DEBUG ONLY, WRITE A GENERIC STRING TO THE UART
    //Set the internal control word of class struct
    unsigned char i = 0;    //counter
    
    char val[4];
    
    nonNullShortitoa(56, val);      //convert ventilator readout to ascii
    
    //DEBUG! check the offsets are the correct length
    while(i<REPORTKNOBSLEN-(6*2)//DEBUG!!!!!
            )
    {
        Serial.print(*(ReportKnobs+i));
        i++;
    }
    Serial.print('\n');
}

//utility members
void AudioIO::nonNullShortitoa(short s, char* a)
{
    short rem;
    a[0]='0';a[1]='0';a[2]='0';a[3]='0';
    while (s != 0) 
    { 
        rem = s % 10; 
    }
}