/*
  AudioIO.h - AudioIO library for Wiring - description
*/

// ensure this library description is only included once
#ifndef AudioIO_h
#define AudioIO_h

//#define SERIALDEBUG /*use to view output JSON in serial terminal*/

// include types & constants of Wiring core API
#include <Arduino.h>
#include <SoftModem.h>
#include <Thread.h>//TODO replace this? It is also possible to use "secret"  https://forum.arduino.cc/index.php?topic=530280.0

/*===========================================================================*\
|	CONTROL STRINGS FOR COMPLIANCE WITH VENTILATOR API SPECIFICATION Ver 1	  |
\*===========================================================================*/

#define WATCHDOGPERIOD 4000 /*watchdog timeout period of bus*/
#define POLLBUSMS 100 /*how often to poll serial data*/

//Constant control strings. Meet specification but do not require complex logic.

//JSON command keys. You could define one for whatever command you wish.
#define readKnobsKey                    0x226b7222
#define writeReadoutsKey                0x22737722
#define writeSensorsKey                 0x22737722

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

//control knob keys (note that the string from the defines above has been reversed in hex)
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
//#define ENQ 5   /*Ping character of master enquiring if we are listening*/
#define ENQ (char)'$'   /*Ping character of master enquiring if we are listening*/
//#define ACK 6  /*Ack character to send (should really replace with 'ACK')*/
#define ACK (char) '$'  /*Ack character to send (should really replace with 'ACK')*/
#define PNG (char) '#'  /*the IO mode ping. to make sure everyone is on the same page*/

#define LENBUSPROTVER 10
const char* const busProtVer PROGMEM = " {\"1\":{}} ";  //Send bus capabilities during handshake (version 1, no vendor extensions).
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
]}\0";                                            //(74??) 94 chars (including null)

//SPI IO Policy related
#define NOSPICMD 0
#define RDKNBS  NOSPICMD + 1
#define WRRDTS  RDKNBS   + 1
#define WRSNSRS WRRDTS   + 1

/*use as an offest in any logic looking at commands from the master and responding with data*/
#define SPILATENCY 6 

//Audio IO Policy related
//enum busMode{PCM=0,Handshake,IO};
#define PCM 0
#define Handshake PCM +1
#define IO Handshake + 1

//Use to keep track of policy FSM
typedef struct POLICY
{
  char comMode;
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

//itoa short double buffer type. READ ONLY in an ISR.
typedef struct _DOUBLEBUF
{
    char intbuf[16];    //store two copies of an itoa buffer TODO: better to just use two buffers and swap pointers?
    char* front;
    char* back;   //read from front, write to back.
    void flip()         //flip buffer once you finish writing to the back.
    {   
        if(front<back) {back=intbuf;  front=intbuf+8; back[0]='\0';} 
        else           {front=intbuf; back=intbuf+8;  back[0]='\0';}
    }
    //reset pointers when you have finished reading/writing the buffer.
    void rstfront(){front<back ? front=intbuf : front=intbuf+8;}
    void rstback(){front<back ? back=intbuf+8 : back=intbuf;}
    //get the head character offset in the back buffer.
    uint8_t backhead(){return( ((uint8_t)(back-intbuf)) &0x07  );}
    _DOUBLEBUF(){front=intbuf;back=intbuf+8;memset(intbuf,0,16);}//front[0]='\0';back[0]='\0';}
}doublebuf;             //TODO: Don't try to overfill this

//AudioIO bus data structure.
//keep incoming command buffered for processing at the end
typedef struct _audioIOdata
{
    char buffer_cmd[BUFFERSIZE];
    char bufptr;
    bool available;               //Set when new data is found.
    _audioIOdata(){bufptr=0;available=false;}
}audioIOdata;

//SPI bus data structure
union intbytes{
    uint32_t intv;
    struct{uint8_t byte0,byte1,byte2,byte3;};
};

//Just keep pace with input
typedef struct _SPIdata
{
    char bufptr;
    char cmd;
    intbytes key;   //union lets arbitrary bytes be set.
    _SPIdata(){bufptr=0-SPILATENCY;cmd=NOSPICMD;key.intv=0;}
}SPIdata;

/*===========================================================================*\
|				VENTILATOR CONTROL API FUNCTION SIGNATURES	  				  |
\*===========================================================================*/


// library interface description
class AudioIO
{
  // user-accessible "public" interface
  public:
    AudioIO();
    ~AudioIO();
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
    void parseCommand();        //check _mMODEMData and call the appropriate private control function
    
    //TODO: Make private, accessed by the Audio bus master only.
    //void reportVentilatorData();    //Send ventilator data to the bus master
    //void reportVentilatorKnobs();   //Set control register values using data from bus master
    //void setVentilatorKnobs();      //
    
    audioIOdata    _mMODEMData;    //Data buffer from the audio MODEM bus master
    //Not useful I think outgoingdata    _mSPIData;      //Data buffer from the 

    void pollBusStatus();          //If handshaking needs doing, do it. If its done, get data.    
    
    //For ISR routing (Arduino specific work around?)
    static AudioIO *activeObject;
    void SPIBusMaintainence();     //monitor and respond to SPI bus commands
    
    
  // library-accessible "private" interface
  private:

    void handshake();
    
    Thread _mThread;                //Use for scheduling bus maintainence
    
    //AUDIO IO MEMBERS
    SoftModem       modem;         //Used for IO
    policy          _mPolicyState; //bus policy state
    control         _mControlRegs; //appropriately mapped control registers
	readout         _mreadoutRegs;  //appropriately mapped readout registers. Read to get ventilator info

	void reportVentilatorData();      //Send ventilator data to the bus master
	void reportVentilatorKnobs();    //Report control register values to bus master
    void setVentilatorKnobs();      //Set control register values using data from bus master
	void audioBusMaintainance();   //Monitor and respond to audio MODEM commands
	
	//SPI IO MEMBERS
	//unsigned char SPIcmd;
	SPIdata _mSPIData;
	//CONTROL
	//Data buffers
    //Double buffers are needed for asynchronous transfer. The IO controller is a slave to display and ventilator which use two asynchronous busses.
    doublebuf _mrrrt, _mtlvm, _mmmip, _mpkep, _mitet, _mfio2; //character double buffers for JSON values of ventilator knobs.
    doublebuf _mmtvn, _mpkip, _mpco2;  //character double buffers for JSON values of ventilator readouts.
	
	//Utility
	inline bool InsertJSONInNumbrBuf(doublebuf& targetbuff, uint8_t& newdata);    //stuff JSON number into a buffer.
	inline void drainReadoutBuffers();      //run itoa and populate class members used in audio bus.
	inline void fillControlKnobBuffers();   //TODO: refresh SPI command buffers if they have been set by the audioIO bus.
};

#endif
