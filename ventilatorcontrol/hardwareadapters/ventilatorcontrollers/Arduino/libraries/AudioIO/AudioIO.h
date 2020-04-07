/*
  AudioIO.h - AudioIO library for Wiring - description
*/

// ensure this library description is only included once
#ifndef AudioIO_h
#define AudioIO_h

// include types & constants of Wiring core API
#include <Arduino.h>
#include <SoftModem.h>

/*===========================================================================*\
|	CONTROL STRINGS FOR COMPLIANCE WITH VENTILATOR API SPECIFICATION Ver 1	  |		
\*===========================================================================*/

//Constant control strings. Meet specification but do not require complex logic.

//Ventilator Sensor Names
//Control Knobs
#define RespiratoryRate                 "RrRt"
#define TidalVolume                     "TlVm"
#define MaximumInspiratoryPressure      "MmIP"
#define PeakEndExpiratoryPressure       "PkEP"
#define InspiratoryTimeExpiratoryTime   "ITET"
#define FiO2                            "FiO2"

//Measured Variables for decision making
#define MinuteVentilation               "MtVn"
#define PeakInspiratoryPressure         "PkIP"
#define PCO2                            "PCO2"


//Command String Constants
const char 		  Ack 		 = 'p';			 	//Ack character to send (should really replace with 'ACK')
const char* const OpenChlAck = "{\"1\":{}}";	//Send bus capabilities during handshake (version 1, no vendor extensions).
const char* const FullRead   =                  //Read All Sensors at once.
"{\"rd\":[\
	{\"" MinuteVentilation "\":%i}\
    {\"" PeakInspiratoryPressure "\":%i}\
    {\"" PCO2 "\":%i}\	        
]}";



enum{PCM,IO}busMode;

//Use to keep track of policy FSM
typedef struct POLICY
{
	int comMode;
	bool watchDogOn;
	int watchDogCtr;
	
	//Initial control policy state
	POLICY(){comMode=PCM;watchDogOn=false;watchDogCtr=0;}
	
}policy;

/*===========================================================================*\
|				VENTILATOR CONTROL API FUNCTION SIGNATURES	  				  |		
\*===========================================================================*/


// library interface description
class AudioIO
{
  // user-accessible "public" interface
  public:
    AudioIO();
    void begin();           //initialize comm channel
    void sendVentilatorData(word pco2);
    void doSomething(void);

  // library-accessible "private" interface
  private:

    policy _mPolicyState;
	//void doSomethingSecret(void);
};

#endif

