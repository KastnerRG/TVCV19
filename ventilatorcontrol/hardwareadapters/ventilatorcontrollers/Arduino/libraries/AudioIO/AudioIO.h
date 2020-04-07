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
//Control Knobs (CONTROL REGISTERS)
#define RespiratoryRate                 "RrRt"
#define TidalVolume                     "TlVm"
#define MaximumInspiratoryPressure      "MmIP"
#define PeakEndExpiratoryPressure       "PkEP"
#define InspiratoryTimeExpiratoryTime   "ITET"
#define FiO2                            "FiO2"

//Measured Variables for decision making (STATUS REGISTERS)
#define MinuteVentilation               "MtVn"
#define PeakInspiratoryPressure         "PkIP"
#define PCO2                            "PCO2"

//TODO: Define global variables with appropriate mmio address locations


//Command String Constants
const char 		  Ack 		 = 6;			 	//Ack character to send (should really replace with 'ACK')
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

//See also "CONTROL REGISTERS" for verbose names of contol registers.
typedef struct _CONTROL
{
    short rrrt; //RespiratoryRate
    short tlvm; //TidalVolume
    short mmip; //MaximumInspiratoryPressure
    short pkep; //PeakEndExpiratoryPressure
    short itet; //InspiratoryTimeExpiratoryTime
    short fio2; //FiO2
    //TODO: Initialize to appropriate values
    _CONTROL(){rrrt=0; tlvm=0; mmip=0; pkep=0; itet=0; fio2=0;}
}control;

//See also "STATUS REGISTERS"
typedef struct _STATUS
{
    short mtvn; // MinuteVentilation               "MtVn"
    short pkip; // PeakInspiratoryPressure         "PkIP"
    short pco2; // PCO2                            "PCO2"
    //TODO: Initialize to appropriate values
    _STATUS(){mtvn=0; pkip=0; pco2=0;}
}status;

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
    void sendVentilatorData(short pco2);
    void doSomething(void);

  // library-accessible "private" interface
  private:

		SoftModem modem;
		policy _mPolicyState;   //bus policy state
    control _mControlRegs;  //appropriately mapped control registers
	status _mStatusRegs;    //appropriately mapped status registers. Read to get ventilator info

    //void doSomethingSecret(void);
};

#endif
