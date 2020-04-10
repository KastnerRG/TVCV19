/*
  AudioIO.h - AudioIO library for Wiring - description
*/

// ensure this library description is only included once
#ifndef AudioIO_h
#define AudioIO_h

#define SERIALDEBUG /*use to view output JSON in serial terminal*/

// include types & constants of Wiring core API
#include <Arduino.h>
#include <SoftModem.h>
#include <Thread.h>//TODO replace this? It is also possible to use "secret"  https://forum.arduino.cc/index.php?topic=530280.0

/*===========================================================================*\
|	CONTROL STRINGS FOR COMPLIANCE WITH VENTILATOR API SPECIFICATION Ver 1	  |
\*===========================================================================*/

#define WATCHDOGPERIOD 2000

//Constant control strings. Meet specification but do not require complex logic.

//Ventilator Sensor Names
//Control Knobs (CONTROL REGISTERS)
#define RespiratoryRate                 "RrRt"
#define TidalVolume                     "TlVm"
#define MaximumInspiratoryPressure      "MmIP"
#define PeakEndExpiratoryPressure       "PkEP"
#define InspiratoryTimeExpiratoryTime   "ITET"
#define FiO2                            "FiO2"

//Measured Variables for decision making (readout REGISTERS)
#define MinuteVentilation               "MtVn"
#define PeakInspiratoryPressure         "PkIP"
#define PCO2                            "PCO2"

//control knob keys (note that the string itself is reversed)
#define RrRtkey 0x74527252
#define TlVmkey 0x6d566c54
#define MmIPkey 0x50496d4d
#define PkEPkey 0x50456b50
#define ITETkey 0x54455449
#define FiO2key 0x324f6946

//Measured variable key
#define MtVnkey 0x6e56744d
#define PkIPkey 0x50496b50
#define PCO2key 0x324f4350

//Bus management related
#define BUFFERSIZE 90

//JSON offsets for adjusting knobs
#define FIRSTJSONVAL 15

#define REPORTKNOBSLEN 92
#define RRRT FIRSTJSONVAL
#define TLVM RRRT + 12
#define MMIP TLVM + 12
#define PKEP MMIP + 12
#define ITET PKEP + 12
#define FIO2 ITET + 12

//JSON offsets for reporting readout registers
#define FULLREADLEN 50
#define MTVNOFF FIRSTJSONVAL
#define PKIPOFF MTVNOFF + 12
#define PCO2OFF PKIPOFF + 12


//TODO: Define global variables with appropriate mmio address locations

//TODO: These do not seem to really go to PROGMEM...
//Command String Constants
#define ENQ 5   /*Ping character of master enquiring if we are listening*/
#define ACK 6	/*Ack character to send (should really replace with 'ACK')*/
const char* const busProtVer PROGMEM = "{\"1\":{}}";	//Send bus capabilities during handshake (version 1, no vendor extensions).
const char* const FullRead PROGMEM =                  //Read All Sensors at once.
"{\"rd\":[\
{\"" MinuteVentilation "\":%i},\
{\"" PeakInspiratoryPressure "\":%i},\
{\"" PCO2 "\":%i}\
]}";                                            //52 chars(including null)
const char* const WriteKnobs PROGMEM =   "{\"rk\":[";    //Look for this key part of the command in order to write control knobs.
const char* const ReportKnobs PROGMEM =                 //Report back all control knob values
"{\"rk\":[\
{\"" RespiratoryRate "\":%i},\
{\"" TidalVolume "\":%i},\                   
{\"" MaximumInspiratoryPressure "\":%i},\
{\"" PeakEndExpiratoryPressure "\":%i},\     
{\"" InspiratoryTimeExpiratoryTime "\":%i},\     
{\"" FiO2 "\":%i}\
]}";                                            //94 chars (including null)


enum{PCM,Handshake,IO}busMode;

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

//See also "readout REGISTERS"
typedef struct _STATUS
{
    short mtvn; // MinuteVentilation               "MtVn"
    short pkip; // PeakInspiratoryPressure         "PkIP"
    short pco2; // PCO2                            "PCO2"
    //TODO: Initialize to appropriate values
    _STATUS(){mtvn=0; pkip=0; pco2=0;}
}readout;

//Global data buffer.
typedef struct _INCOMINGDATA
{
    char bufptr;                  //Track position writing to in buffer.
    char buffer_cmd[BUFFERSIZE];
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
    
    //USER API METHODS. USE THESE TO READ AND WRITE REGISTERS VISIBLE TO THE REMOTE CONTROL
    short getVentilatorKnob(const long knobKey);  //get a control knob value
    void getVentilatorKnobs(control* knobs);      //get all control knob values
    void setVentilatorReading(const long readingKey, short reading);    //set one read out value from ventilator
    void setVentilatorReadings(readout* readings);   //set all ventilator readout values

    //ARDUINO LOOP METHOD.
    static void maintainAudioBus();        //Because we have no OS, this has to be scheduled in the main loop somewhere.
    
    //INTERNAL LIBRARY METHODS
    //TODO: Make private and have ARTe loop start up in the     
    void parseCommand();        //check _mMasterData and call the appropriate private control function
    
    //TODO: Make private, accessed by the bus master only.
    void reportVentilatorData();    //Send ventilator data to the bus master
    void reportVentilatorKnobs();   //Set control register values using data from bus master
    void setVentilatorKnobs();      //
    
    incomingdata    _mMasterData;   //Data from the bus master

    void pollBusStatus();          //If handshaking needs doing, do it. If its done, get data.    
  // library-accessible "private" interface
  private:

    void handshake();
    
    Thread _mThread;                //Use for scheduling bus maintainence
    
    //void nonNullShortitoa(short s, char* a);   //very basic itoa that does not null terminate, instead has leading 0's
    
    SoftModem       modem;         //Used for IO
    //incomingdata    _mMasterData;  //Data from the bus master
    policy          _mPolicyState; //bus policy state
    control         _mControlRegs; //appropriately mapped control registers
	readout         _mreadoutRegs;  //appropriately mapped readout registers. Read to get ventilator info
	
//	void reportVentilatorData();      //Send ventilator data to the bus master
//	void reportVentilatorKnobs();    //Set control register values using data from bus master
//    void setVentilatorKnobs();      //
	//void func1( void (AudioIO::*func)() );  //wrapper to allow function pointer?
	void AudioIO::busMaintainance();
};

#endif
