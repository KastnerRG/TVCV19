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
    //
  // initialize this instance's variables

  // do whatever is required to initialize the library
  modem = SoftModem();	//Will be used to communicate with bus master.
  
  Serial.println("AudioIO startup");
  delay(100);
  modem.begin();
}

// Public Methods //////////////////////////////////////////////////////////////
/*===========================================================================*\
|                       USER API METHOD IMPLEMENTATION                        |
\*===========================================================================*/

/**
 * get the latest requested control knob value sent from a remote control.
 *
 * specify knob using a 'knobKey' defined in AudioIO.h. e.g. RrRtkey will return the requested 
 * RespiratoryRate as a short integer value
 *
 * @param knobKey requested control knob value.
 * @return integer value of requested knob.
 */
short AudioIO::getVentilatorKnob(const long knobKey)
{
    switch(knobKey)
    {
        case RrRtkey : return _mControlRegs.rrrt;   //Respiratory Rate
        case TlVmkey : return _mControlRegs.tlvm;   //Tidal Volume
        case MmIPkey : return _mControlRegs.mmip;   //
        case PkEPkey : return _mControlRegs.pkep;   //
        case ITETkey : return _mControlRegs.itet;   //
        case FiO2key : return _mControlRegs.fio2;   //
    }
    return 0;
}

/**
 * get the latest requested control knob values sent from a remote control.
 *
 *
 * @param knobs: a structure who's members are all of the control knob values returned as short data type.
 */
void AudioIO::getVentilatorKnobs(control* knobs)
{
   *knobs=_mControlRegs; //copy all control knobs
}

/**
 * set the latest ventilator reading value so the remote control can retrieve it.
 *
 * specify knob using a 'readingKey' defined in AudioIO.h. e.g. PkIPkey will set the
 * read Inpiratory Pressure
 *
 * @param knobKey: requested ventilator reading to update value of.
 * @param reading: integer value of reading.
 */
void AudioIO::setVentilatorReading(const long readoutKey, short readout)
{
    switch(readoutKey)
    {
        case MtVnkey : _mreadoutRegs.mtvn = readout; return;   //
        case PkIPkey : _mreadoutRegs.pkip = readout; return;   //Peak Inspiratory Pressure
        case PCO2key : _mreadoutRegs.pco2 = readout; return;   //
    }    
}

/**
 * set the latest ventilator readout values so the remote control can retrieve them.
 *
 *
 * @param values: a structure who's members are all of the ventilator values specified as short data type.
 */
void AudioIO::setVentilatorReadings(readout* readouts)
{
    _mreadoutRegs = *readouts;
}


//Function to parse a command that lives in the _mMasterData member
//TODO make this private and make it only exist in a library instantiated loop.
void AudioIO::parseCommand()
{
    Serial.println("Booting");
    
    /*//check we have data
    if(_mMasterData.available)
    {
        //Clear command regardless.
        _mMasterData.available = false;
        
        //Process command. Very basic. Only consider the 4th character in the buffer.
        switch(_mMasterData.buffer_cmd[3])
        {
            case 'd':   //Assume master wants to read ventilator data (rd) string
                reportVentilatorData();
                break;
                
            case 'r':   //Assume master wants to write control knobs
                setVentilatorKnobs();              
                break;
            case 'k':   //Assume master wants to read control knobs
                reportVentilatorKnobs();
                break;
                
            default: 
                Serial.println("Warning! Unrecognized Master command:");//We don't handle this command (maybe we should)
                //Serial.println(_mMasterData.buffer_cmd);
                break;
        }
    }
    else
        return;*/
}

// Private Methods /////////////////////////////////////////////////////////////
// Functions only available to other functions in this library

void AudioIO::reportVentilatorData()
{
    char val[8];    //will be the ascii string of ventilator control variables
        
    //DEBUG ONLY, WRITE A GENERIC STRING TO THE UART
    //Return the internal copies of class struct
    unsigned char j,i = 0;
    
    while(i<FULLREADLEN-(3*2))  //we skip 2 string format bytes 3 times for the 3 control registers
    {
        modem.write(*(FullRead+i));
#ifdef SERIALDEBUG
        Serial.print(*(FullRead+i));
#endif
        i++;
        //logic to report ventilator control registers
        if(i==MTVNOFF)
        {
            itoa(_mreadoutRegs.mtvn,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
#ifdef SERIALDEBUG
                Serial.print(val[j]);
#endif
                modem.write(val[j++]);
            }
            i+=2;
        }
        if(i==PKIPOFF)
        {
            itoa(_mreadoutRegs.pkip,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
#ifdef SERIALDEBUG
                Serial.print(val[j]);
#endif
                modem.write(val[j++]);
            }
            i+=2;
        }
        if(i==PCO2OFF)
        {
            itoa(_mreadoutRegs.pco2,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
#ifdef SERIALDEBUG
                Serial.print(val[j]);
#endif
                modem.write(val[j++]);
            }
            i+=2;
        }
    }
#ifdef SERIALDEBUG    
    Serial.print('\n');
#endif
}

//Set VentilatorKnobs (from master)
//Not a true JSON parser but can find key value pairs if the value is numeric and pairs are in a dictionary structure.
void AudioIO::setVentilatorKnobs()
{
    //pull data out of the buffer at specific offsets, convert to ascii and be done with it.
    //Start at first known offset.
    short i = FIRSTJSONVAL-6;
    int key;

    while(i<BUFFERSIZE)                         //Go through entire JSON string to try and pull out the data
    {
        switch(*((long*)(_mMasterData.buffer_cmd+i)))
        {
            case RrRtkey: //"reverse(RrRt)";
                i+=6;
                _mControlRegs.rrrt = atoi(_mMasterData.buffer_cmd+i);   //will work. Need to keep incrementing i until you get '}'
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}     //Just need to increment i until you get }
                i+=3;
                break;
                
            case TlVmkey: //"TlVm"
                i+=6;
                _mControlRegs.tlvm = atoi(_mMasterData.buffer_cmd+i);
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case MmIPkey: //"MmIP"
                i+=6;
                _mControlRegs.mmip = atoi(_mMasterData.buffer_cmd+i);
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case PkEPkey: //"PkEP"
                i+=6;
                _mControlRegs.pkep = atoi(_mMasterData.buffer_cmd+i);
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case ITETkey: //"ITET"
                i+=6;
                _mControlRegs.itet = atoi(_mMasterData.buffer_cmd+i);
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case FiO2key: //"FiO2"
                i+=6;
                _mControlRegs.fio2 = atoi(_mMasterData.buffer_cmd+i);
                while(_mMasterData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
            
            default :
                i++;    //look at next value in buffer, maybe something will make sense at some point?
                /*this is nice but too noisy. Add back if you want to debug.
                Serial.println("Warning! Unrecognized key!");
                Serial.print(RrRtkey,HEX);
                Serial.print('\n');
                long a = *((long*)(_mMasterData.buffer_cmd+i));
                Serial.print(a,HEX);
                Serial.print('\n');*/
                break;
        }
    }
    
    //Send back an ACK (this just ack's the command, its not enough for verification).
    modem.write(Ack);
    
    /*
    //DEBUG show new control knob values (seem to all work perfectly
    Serial.print(_mControlRegs.rrrt);Serial.print('\n');
    Serial.print(_mControlRegs.tlvm);Serial.print('\n');
    Serial.print(_mControlRegs.mmip);Serial.print('\n');
    Serial.print(_mControlRegs.pkep);Serial.print('\n');
    Serial.print(_mControlRegs.itet);Serial.print('\n');
    Serial.print(_mControlRegs.fio2);Serial.print('\n');
    */
}

//Report Ventilator Knobs
void AudioIO::reportVentilatorKnobs()
{
    //DEBUG ONLY, WRITE A GENERIC STRING TO THE UART
    //Set the internal control word of class struct
    unsigned char j,i = 0;    //counter
    
    char val[8];//ascii representation of control register
    
    //nonNullShortitoa(56, val);      
    itoa(56,val,10);    //convert ventilator readout to ascii
    //DEBUG! check the offsets are the correct length
    while(i<REPORTKNOBSLEN-(6*2)//DEBUG!!!!!
            )
    {
        Serial.print(*(ReportKnobs+i));
        i++;
        //Send out the struct data
        if(i==RRRT)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }
        if(i==TLVM)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }
        if(i==MMIP)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }
        if(i==PKEP)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }
        if(i==ITET)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }
        if(i==FIO2)
        {
            itoa(56,val,10);    //convert ventilator readout to ascii
            j=0;
            while(val[j])   //print out the ascii string for the register
            {
                Serial.print(val[j++]);
            }
            i+=2;
        }

    }
    Serial.print('\n');
}