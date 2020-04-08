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

//Bus management related
#define BUFFERSIZE 100
#define FULLREADLEN 50
#define REPORTKNOBSLEN 92

//TODO: Define global variables with appropriate mmio address locations


//Command String Constants
const char 		  Ack 		 = 6;			 	//Ack character to send (should really replace with 'ACK')
const char* const OpenChlAck = "{\"1\":{}}";	//Send bus capabilities during handshake (version 1, no vendor extensions).
const char* const FullRead   =                  //Read All Sensors at once.
"{\"rd\":[\
{\"" MinuteVentilation "\":%i},\
{\"" PeakInspiratoryPressure "\":%i},\
{\"" PCO2 "\":%i}\
]}";                                            //52 chars(including null)
const char* const WriteKnobs =   "{\"rk\":[";    //Look for this key part of the command in order to write control knobs.
const char* const ReportKnobs =                 //Report back all control knob values
"{\"rk\":[\
{\"" RespiratoryRate "\":%i},\
{\"" TidalVolume "\":%i},\                   
{\"" MaximumInspiratoryPressure "\":%i},\
{\"" PeakEndExpiratoryPressure "\":%i},\     
{\"" InspiratoryTimeExpiratoryTime "\":%i},\     
{\"" FiO2 "\":%i}\
]}";                                            //94 chars (including null)


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

typedef struct _INCOMINGDATA
{
    char buffer_cmd[BUFFERSIZE];  //Data found by the slave bus controller
    bool available;               //Set when new data is found.
}incomingdata;

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
        
    //TODO: Make private and have ARTe loop start up in the 
    void parseCommand();        //check _mMasterData and process it as makes sense

    
    void sendVentilatorData();      //Send ventilator data to the bus master
    void setVentilatorControl();    //Set control register values using data from bus master
    
  // library-accessible "private" interface
  private:

    void nonNullShortitoa(short s, char* a);   //very basic itoa that does not null terminate, instead has leading 0's
    
    SoftModem       modem;         //Used for IO
    incomingdata    _mMasterData;  //Data from the bus master
    policy          _mPolicyState; //bus policy state
    control         _mControlRegs; //appropriately mapped control registers
	status          _mStatusRegs;  //appropriately mapped status registers. Read to get ventilator info
	
//	void sendVentilatorData();      //Send ventilator data to the bus master
//	void setVentilatorControl();    //Set control register values using data from bus master
};

#endif
