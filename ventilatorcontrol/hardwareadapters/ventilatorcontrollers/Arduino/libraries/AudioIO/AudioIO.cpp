/*
  AudioIO.h - AudioIO library for Wiring - implementation
*/


// include this library's description file
#include "AudioIO.h"

// include description files for other libraries used (if any)
#include "HardwareSerial.h"


// Constructor /////////////////////////////////////////////////////////////////
// Function that handles the creation and setup of instances

AudioIO::AudioIO(){}	//Don't do anything. follow the pattern of SoftModem();

void AudioIO::begin()
{
  _mThread = Thread();  //initialize thread for callbacks.
  // initialize this instance's variables

  // do whatever is required to initialize the library
  modem = SoftModem();	//Will be used to communicate with bus master.
  
  delay(100);
  Serial.println("AudioIO startup");
  modem.begin();
  delay(100);
  modem.write('M');modem.write('B');modem.write(' ');modem.write('v');modem.write('1');modem.write('.');modem.write('0');modem.write('\n');

  //init bus state
  _mPolicyState.comMode = PCM;
  _mPolicyState.watchDogCtr = 0;
  
  //_mThread.onRun(maintainAudioBus);  //Maintain the Bus status. 
  //_mThread.setInterval(WATCHDOGPERIOD);//Task should be called as watchdog is about to time out.
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
    char cmd = *(_mMasterData.buffer_cmd+3);
    //Serial.println("Parsing");

    if(_mMasterData.available)
    {
        //Clear command regardless.
        _mMasterData.available = false;
        
        //Process command. Very basic. Only consider the 4th character in the buffer.
        switch(_mMasterData.buffer_cmd[3])
        {
            case 'd':   //Assume master wants to read ventilator data (rd) string
                reportVentilatorData();
                //Serial.write("reportVentilatorData()\n");
                break;
                
            case 'r':   //Assume master wants to write control knobs
                setVentilatorKnobs();  
                //Serial.write("setVentilatorKnobs()\n");
                break;
            case 'k':   //Assume master wants to read control knobs
                reportVentilatorKnobs();
                //Serial.write("reportVentilatorKnobs()\n");
                break;
                
            default: 
                Serial.println("Bad CMD!:");//We don't handle this command (maybe we should)
                Serial.println(_mMasterData.buffer_cmd);
                break;
        }
    }

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
    modem.write(ACK);
    
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
    unsigned char j,i = 0;    //loop counters
    
    //uController is not fast enough to complete itoa before a character should be sent.
    //Only option is to reserve enough memory to pre-compute itoa for every control knob.
    char rrrtstr[8],tlvmstr[8],mmipstr[8],pkepstr[8],itetstr[8],fio2str[8];
    itoa(_mControlRegs.rrrt,rrrtstr,10); 
    itoa(_mControlRegs.tlvm,tlvmstr,10);
    itoa(_mControlRegs.mmip,mmipstr,10);
    itoa(_mControlRegs.pkep,pkepstr,10);
    itoa(_mControlRegs.itet,itetstr,10);
    itoa(_mControlRegs.fio2,fio2str,10);
    
    //Print out the JSON string (ReportKnobs). when we reach a value offset, e.g. RRRT
    //then print out the itoa value of the corresponding control knob. 
    while(i<REPORTKNOBSLEN-(6*2)
            )
    {
        modem.write(*(ReportKnobs+i));
#ifdef SERIALONLYDEBUG        
        Serial.print(*(ReportKnobs+i));
#endif
        i++;
        //Send out the struct data
        if(i==RRRT)
        {
            j=0;
            while(rrrtstr[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(rrrtstr[j]);
#endif
                modem.write(rrrtstr[j++]);
            }
            i+=2;
        }
        if(i==TLVM)
        {
            j=0;
            while(tlvmstr[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(tlvmstr[j]);
#endif
                modem.write(tlvmstr[j++]);
            }
            i+=2;
        }
        if(i==MMIP)
        {
            j=0;
            while(mmipstr[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(mmipstr[j]);
#endif
                modem.write(mmipstr[j++]);
            }
            i+=2;
        }
        if(i==PKEP)
        {
            j=0;
            while(pkepstr[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(pkepstr[j]);
#endif
                modem.write(pkepstr[j++]);
            }
            i+=2;
        }
        if(i==ITET)
        {
            j=0;
            while(itetstr[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(itetstr[j]);
#endif
                modem.write(itetstr[j++]);
            }
            i+=2;
        }
        if(i==FIO2)
        {
            j=0;
            while(fio2str[j])   //print out the ascii string for the register
            {
#ifdef SERIALONLYDEBUG                  
                Serial.print(fio2str[j]);
#endif
                modem.write(fio2str[j++]);
            }
            i+=2;
        }

    }
#ifdef SERIALONLYDEBUG     
    Serial.print('\n');
#endif
    modem.write('\0');
}

//HANDSHAKING AND WATCHDOG
//TODO: needs validation.
//Function should 
//  0: sniff for ENQ and respond with ACK
//  1: perform handshake
//  2: Maintain a buffer of commands (_mMasterData.buffer_cmd[BUFFERSIZE])
//  3: timeout watchdog if nothing comes through from the master by WATCHDOGPERIOD
//It should also be responsive.
//Please DEBUG THIS FIRST!
void AudioIO::busMaintainance()
{
    char c; //Data character.
    
    char hsctr = 0; //used to check handshake string
    
    while(modem.available())  //TODO: handle buffer overflow.
    {  
      c = modem.read();
      //Serial.write(c);
      switch(_mPolicyState.comMode)
      {
      //Serial.write(c);
      
        //S0 bus mode = PCM, check for ping. transition, send ack.
        case PCM :
          if(c== ENQ)
          { 
            
            Serial.write("Handshake\n");
            modem.write(ACK);
            modem.write('\0');
            hsctr = 0;  //reset the handshake character counter.
            _mPolicyState.comMode = Handshake;
            //TODO: decide if the buffer should be re-set by this loop. I don't think so actually.
          }
            
        break;
    
        //S1 bus mode = FSK, check for ver (ping stay in S1, ver go to S2, else goto S0) transition, send ver. stay send ack.
        case Handshake :
            _mPolicyState.watchDogCtr =WATCHDOGPERIOD;
            
            if(c == ENQ)
                {modem.write(ACK);modem.write('\0');break;}  //TODO: technically this should be sent, but breaks android app*///cycle here... TODO: should actually send back more ACK.
            //annoying->Serial.write(c);
            if(hsctr== LENBUSPROTVER)
            {
              hsctr = 0;
              Serial.write("Overflow reading protocol version\n");
              _mPolicyState.comMode = PCM;
              break;
            }
            if(c = *(busProtVer+hsctr))
            {
              //Serial.write(c);
              hsctr++;            
              if(hsctr>7)
              {
                //Serial.write(c);
                //Serial.write('\n');     
                //{
                  //Respond with the same string 
                  modem.write(busProtVer,LENBUSPROTVER);
                  modem.write(busProtVer,LENBUSPROTVER);
                  modem.write('\0');
                  
                  Serial.write("IO\n");
                  _mMasterData.bufptr = 0;              //start reading in commands at buffer position 0
                  _mMasterData.buffer_cmd[0] = '\0';    //trash any old command
                  _mPolicyState.comMode = IO;           //we are in IO mode. cool!
                  hsctr = 0;
                //}
              }
            }
            else
              _mPolicyState.comMode = PCM;  //fail. fall back to looking for a ping.*/
        break;
        //S2 bus mode = IO. transition watchdog timeout. stay, modem available.
        case IO :
            
          if(c == ENQ)
              {hsctr=0;_mPolicyState.watchDogCtr=0;_mPolicyState.comMode = PCM;break;} 
            
          //reset watchdog.
          _mPolicyState.watchDogCtr =WATCHDOGPERIOD;//maintain bus status if a character is read.

          //modem.write(c); //Loop back. Actually this mode will even train up the bus if the ping and ack are symetric and you have no noise.

          //If this was just a ping, send back ACK, do not add to the buffer.
          if(c == PNG)
            {modem.write(PNG); break;}  

          //bufer the data for message decoding.
          _mMasterData.buffer_cmd[_mMasterData.bufptr]=c;
          //Only accept JSON dictionaries (they start with '{'.
          if(_mMasterData.buffer_cmd[0]=='{')
          {
              _mMasterData.bufptr++;
              //check if message is complete.
              if((c == '\r') || (_mMasterData.bufptr >= BUFFERSIZE))  //TODO rather not terminate strings on carriage return, but null is not picked up / sent from phone.
              {
                  //Serial.write(_mMasterData.buffer_cmd,_mMasterData.bufptr);
                  //Serial.write("\n");
                  //Serial.write("\n");
                  _mMasterData.buffer_cmd[_mMasterData.bufptr] = '\0';  //Null terminate.
                  _mMasterData.bufptr = 0;      //Will overwrite next time
                  _mMasterData.available = true;//Give someone a chance to process this data.
    
                  //DEBUG write out the command
                  //Serial.write("Got command\n");    
              }
          }
        break;

        /*default :
          Serial.write("Bus mode error!\n");
          //Serial.print(c);
          Serial.write("Com mode:");
          Serial.print(_mPolicyState.comMode,DEC);
          Serial.write("\n");*/
      }
    }

    //Do a watchdog timeout always called on the timer period even if we have no characters.
    if(_mPolicyState.watchDogCtr > 0)
    {
      _mPolicyState.watchDogCtr-=POLLBUSMS;
      if(_mPolicyState.watchDogCtr <= 0)
      {
          Serial.write("Watchdog Out!\n");
          _mPolicyState.comMode = PCM;  //If you don't get anything, then go back to PCM
      }
    }
}

//BUS MAINTAINENCE UTILITY FUNCTIONS

//pollBusStatus()
//  1: Maintain a data channel between the ventilator and a remote control. 
//  2: Parse data channel for commands and process them.
//  (Should be in a callback called every POLLBUSMS (100ms))
void AudioIO::pollBusStatus()
{
    //TODO: Handshaking and buffer maintainance.
    busMaintainance();
    
    //If the bus is running, try to process commands.
    if(_mPolicyState.comMode = IO)
    {   
        //Serial.println("Poll Bus\n");
        
        //If we are in Bus mode, call the command parser
        parseCommand(); //Check the command buffer to see if any action needs taking.
    }
    
}

