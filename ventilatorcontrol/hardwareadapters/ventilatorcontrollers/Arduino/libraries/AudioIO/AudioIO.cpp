/*
  AudioIO.h - AudioIO library for Wiring - implementation
*/


// include this library's description file
#include "AudioIO.h"

// include description files for other libraries used (if any)
#include "HardwareSerial.h"


AudioIO *AudioIO::activeObject = 0; 


// Constructor /////////////////////////////////////////////////////////////////
// Function that handles the creation and setup of instances

AudioIO::AudioIO(){}

AudioIO::~AudioIO()
{
    AudioIO::activeObject = 0; 
}

void AudioIO::begin()
{
  // initialize this instance's variables
  //zero all readout registers
  fillControlKnobBuffers();
  //TODO set sensible defaults for control registers
  
#ifndef ARDUINO_SAM_DUE
  //Replaced by ARTe loops _mThread = Thread();  //initialize thread for callbacks.


  // do whatever is required to initialize the library
  modem = SoftModem();	//Will be used to communicate with bus master.
  
  delay(100);
  Serial.println("AudioIO startup");
  modem.begin();
  delay(100);
  modem.write('M');modem.write('B');modem.write(' ');modem.write('v');modem.write('1');modem.write('.');modem.write('1');modem.write('\n');modem.write('\0');
#else
  //TODO: add support for softmodem
#endif
  
  //init bus state
  _mPolicyState.comMode = PCM;
  _mPolicyState.watchDogCtr = 0;


//SPI architecture 
#ifdef ARDUINO_SAM_DUE
  PMC->PMC_PCER0 |= PMC_PCER0_PID24;    // SPI0 power ON
  PIOA->PIO_PDR = PIO_PDR_P25 | PIO_PDR_P26 | PIO_PDR_P27 | PIO_PDR_P28;
  PIOA->PIO_ABSR &= ~(PIO_PA25A_SPI0_MISO | PIO_PA26A_SPI0_MOSI | PIO_PA27A_SPI0_SPCK | PIO_PA28A_SPI0_NPCS0);

  // SPI Disable
  SPI0->SPI_CR = SPI_CR_SPIDIS;// SPI is in slave mode after software reset !!
  // Perform a SPI software reset twice, like SAM does.
  SPI0->SPI_CR = SPI_CR_SWRST;
  SPI0->SPI_CR = SPI_CR_SWRST;
  delay(10);

  REG_SPI0_MR = 0;   // Slave mode
  // Receive Data Register Full Interrupt
  SPI0->SPI_IER = SPI_IER_RDRF;
  NVIC_EnableIRQ(SPI0_IRQn);

  //Joke transfer SPI0->SPI_TDR = SPI0->SPI_TDR | (uint16_t) 0xcafe;
  SPI0->SPI_CSR[0] = SPI_CSR_NCPHA|SPI_CSR_BITS_16_BIT; //16bit xfer mode

  REG_SPI0_CR = 1;   // Enable SPI

#else
  //Set active object for ISR routing (SPI)
  //Initialize the SPI
  pinMode(MISO, OUTPUT);    //Make SPI MISO an output
  SPCR |= _BV(SPE);         //Enable SPI
  SPCR |= _BV(SPIE);        //Enable interrupts
#endif
  
  AudioIO::activeObject = this;
  
}

//Route SPI Slave ISR to this class
//when a byte comes over on SPI, deal with it in ISR.

//DUE ISR routing logic.
#ifdef ARDUINO_SAM_DUE
void SPI0_Handler()
{
    AudioIO::activeObject->SPIBusMaintainence();    
}
#else
//UNO ISR routing logic.
ISR (SPI_STC_vect)
{
    AudioIO::activeObject->SPIBusMaintainence();
}
#endif

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


//Function to parse a command that lives in the _mMODEMData member
//TODO make this private and make it only exist in a library instantiated loop.
void AudioIO::parseCommand()
{
    char cmd = *(_mMODEMData.buffer_cmd+3);
    //Serial.println("Parsing");

    if(_mMODEMData.available)
    {
        //Clear command regardless.
        _mMODEMData.available = false;
        
        //Process command. Very basic. Only consider the 4th character in the buffer.
        switch(_mMODEMData.buffer_cmd[3])
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
                Serial.println(_mMODEMData.buffer_cmd);
                break;
        }
    }

}

// Private Methods /////////////////////////////////////////////////////////////
// Functions only available to other functions in this library

void AudioIO::reportVentilatorData()
{
    char val[8];    //will be the ascii string of ventilator control variables
        
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
    //int key;

    while(i<BUFFERSIZE)                         //Go through entire JSON string to try and pull out the data
    {
        switch(*((long*)(_mMODEMData.buffer_cmd+i)))
        {
            case RrRtkey: //"reverse(RrRt)";
                i+=6;
                _mControlRegs.rrrt = atoi(_mMODEMData.buffer_cmd+i);   //will work. Need to keep incrementing i until you get '}'
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}     //Just need to increment i until you get }
                i+=3;
                break;
                
            case TlVmkey: //"TlVm"
                i+=6;
                _mControlRegs.tlvm = atoi(_mMODEMData.buffer_cmd+i);
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case MmIPkey: //"MmIP"
                i+=6;
                _mControlRegs.mmip = atoi(_mMODEMData.buffer_cmd+i);
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case PkEPkey: //"PkEP"
                i+=6;
                _mControlRegs.pkep = atoi(_mMODEMData.buffer_cmd+i);
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case ITETkey: //"ITET"
                i+=6;
                _mControlRegs.itet = atoi(_mMODEMData.buffer_cmd+i);
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
                
            case FiO2key: //"FiO2"
                i+=6;
                _mControlRegs.fio2 = atoi(_mMODEMData.buffer_cmd+i);
                while(_mMODEMData.buffer_cmd[i++]!='}' && i<BUFFERSIZE){}
                i+=3;
                break;
            
            default :
                i++;    //look at next value in buffer, maybe something will make sense at some point?
                /*this is nice but too noisy. Add back if you want to debug.
                Serial.println("Warning! Unrecognized key!");
                Serial.print(RrRtkey,HEX);
                Serial.print('\n');
                long a = *((long*)(_mMODEMData.buffer_cmd+i));
                Serial.print(a,HEX);
                Serial.print('\n');*/
                break;
        }
    }
    
    //Send back an ACK (this just ack's the command, its not enough for verification).
    modem.write(ACK);
    
    //Load up SPI buffers so that the SPI bus master can interrogate latest ventilator control knobs.
    fillControlKnobBuffers();

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
        i++;
        //Send out the struct data
        if(i==RRRT)
        {
            j=0;
            while(rrrtstr[j])   //print out the ascii string for the register
            {
                modem.write(rrrtstr[j++]);
            }
            i+=2;
        }
        if(i==TLVM)
        {
            j=0;
            while(tlvmstr[j])   //print out the ascii string for the register
            {
                modem.write(tlvmstr[j++]);
            }
            i+=2;
        }
        if(i==MMIP)
        {
            j=0;
            while(mmipstr[j])   //print out the ascii string for the register
            {
                modem.write(mmipstr[j++]);
            }
            i+=2;
        }
        if(i==PKEP)
        {
            j=0;
            while(pkepstr[j])   //print out the ascii string for the register
            {
                modem.write(pkepstr[j++]);
            }
            i+=2;
        }
        if(i==ITET)
        {
            j=0;
            while(itetstr[j])   //print out the ascii string for the register
            {
                modem.write(itetstr[j++]);
            }
            i+=2;
        }
        if(i==FIO2)
        {
            j=0;
            while(fio2str[j])   //print out the ascii string for the register
            {
                modem.write(fio2str[j++]);
            }
            i+=2;
        }

    }
    modem.write('\0');
}

//HANDSHAKING AND WATCHDOG FOR AUDIO BUS
//TODO: needs validation.
//Function should 
//  0: sniff for ENQ and respond with ACK
//  1: perform handshake
//  2: Maintain a buffer of commands (_mMODEMData.buffer_cmd[BUFFERSIZE])
//  3: timeout watchdog if nothing comes through from the master by WATCHDOGPERIOD
//It should also be responsive.
//Please DEBUG THIS FIRST!
void AudioIO::audioBusMaintainance()
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
                  modem.write((const uint8_t*)busProtVer,LENBUSPROTVER);
                  modem.write((const uint8_t*)busProtVer,LENBUSPROTVER);
                  modem.write('\0');
                  
                  Serial.write("IO\n");
                  _mMODEMData.bufptr = 0;              //start reading in commands at buffer position 0
                  _mMODEMData.buffer_cmd[0] = '\0';    //trash any old command
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
          _mMODEMData.buffer_cmd[_mMODEMData.bufptr]=c;
          //Only accept JSON dictionaries (they start with '{'.
          if(_mMODEMData.buffer_cmd[0]=='{')
          {
              _mMODEMData.bufptr++;
              //check if message is complete.
              if((c == '\r') || (_mMODEMData.bufptr >= BUFFERSIZE))  //TODO rather not terminate strings on carriage return, but null is not picked up / sent from phone.
              {
                  //Serial.write(_mMODEMData.buffer_cmd,_mMODEMData.bufptr);
                  //Serial.write("\n");
                  //Serial.write("\n");
                  _mMODEMData.buffer_cmd[_mMODEMData.bufptr] = '\0';  //Null terminate.
                  _mMODEMData.bufptr = 0;      //Will overwrite next time
                  _mMODEMData.available = true;//Give someone a chance to process this data.
    
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

//POLLING BUS MAINTAINENCE UTILITY FUNCTIONS

//pollBusStatus()
//  1: Maintain a data channel between the ventilator and a remote control. 
//  2: Parse data channel for commands and process them.
//  (Should be in a callback called every POLLBUSMS (100ms))
void AudioIO::pollBusStatus()
{
    //TODO: Handshaking and buffer maintainance.
    audioBusMaintainance(); //Phone side IO service
    
    //Done in ISR. Required to keep up with bus. SPIBusMaintainence();   //Ventilator side IO service
    
    //If the Audio bus is up, try to process audio commands.
    if(_mPolicyState.comMode = IO)
    {   
        //Serial.println("Poll Bus\n");
        
        //If we are in Bus mode, call the command parser
        parseCommand(); //Check the command buffer to see if any action needs taking.
    }
    
    //If the ventilator has issued a command, service it.
    
    
}

//ISR BUS MAINTAINENCE UTILITY FUNCTIONS

//inline member to convert SPI readout data for use by audio IO bus.
//Done after command to avoid failing to meet ISR timing.
//TODO: the class members are only useful if you do actual ventilator logic. otherwise they could possibly be dropped for AudioIO?
void AudioIO::drainReadoutBuffers()
{
    _mreadoutRegs.mtvn = atoi(_mmtvn.front); 
    _mreadoutRegs.pkip = atoi(_mpkip.front); 
    _mreadoutRegs.pco2 = atoi(_mpco2.front);
        
    Serial.print("SPI sets readout knobs\n");
    Serial.print("mtvn: ");Serial.print(_mreadoutRegs.mtvn);Serial.print("\n");
    Serial.print("pkip: ");Serial.print(_mreadoutRegs.pkip);Serial.print("\n");
    Serial.print("pco2: ");Serial.print(_mreadoutRegs.pco2);Serial.print("\n");
}

//inline member to fill SPI control knob data from member variables
void AudioIO::fillControlKnobBuffers()
{
    itoa(_mControlRegs.rrrt,_mrrrt.back,10); _mrrrt.flip();
    itoa(_mControlRegs.tlvm,_mtlvm.back,10); _mtlvm.flip();
    itoa(_mControlRegs.mmip,_mmmip.back,10); _mmmip.flip();
    itoa(_mControlRegs.pkep,_mpkep.back,10); _mpkep.flip();
    itoa(_mControlRegs.itet,_mitet.back,10); _mitet.flip();
    itoa(_mControlRegs.fio2,_mfio2.back,10); _mfio2.flip();
    
    
/*could use with some extra debug
     Serial.print("Audio sets ctl knobs\n");
    Serial.print("rrrt: ");Serial.println(_mmtvn.front);Serial.print("\n");
    Serial.print("tlvm: ");Serial.println(_mpkip.front);Serial.print("\n");
    Serial.print("mmip: ");Serial.println(_mpco2.front);Serial.print("\n");
    Serial.print("pkep: ");Serial.println(_mmtvn.front);Serial.print("\n");
    Serial.print("itet: ");Serial.println(_mpkip.front);Serial.print("\n");    */
    
}


//inline member to insert a char into a "number" buffer.
//return false when buffer is full (fit no more in)
bool AudioIO::InsertJSONInNumbrBuf(doublebuf& targetbuff, uint8_t& newdata)
{
    if(targetbuff.backhead() > 0)         //if something is in the back buffer, keep going until we get non-numerical char.
    {
        if((targetbuff.backhead() < 7) && (newdata <':'))
        {
            *(targetbuff.back++)=newdata;        //write bytes to back buffers. They should be ATOI'd when necessary.
        }
        else
        {
            *(targetbuff.back)='\0';     
            targetbuff.flip();           //Flip the buffer  
            return false;               //TELL CALLER TO STOP.
        }
    }
    else if((newdata>'/')&&(newdata<':'))       //look for the first numerical byte.
        *(targetbuff.back++)=newdata;           //If you find the first numerical byte, move on in the buffer.    
    
    return true;                        //can still fit more data in this buffer.
}

//SLAVE MODE HANDLER FOR SPI BUS (a state machine)
//1: look for json start character
//2-4: read in command key
//5... process the command. Two processing patterns are defined
//      type A: write to the IO controller
//      type B: read from the IO controller
//      examples for type A and B using double buffers to support a second async audioIO bus are shown


void AudioIO::SPIBusMaintainence()
{  

#ifdef ARDUINO_SAM_DUE  //DUE SPI ISR
    //Deal with fact that this ISR works on 16 bit boundaries.
    int16bytes OSPDR16,ISPDR16;
    ISPDR16.intv = SPI0->SPI_RDR;  //Just for compilation later make this work well.
    uint8_t SPDR;
    
    //do a loop. you can use this to support uno and due
    size_t i = sizeof(int16bytes);
    while(i--)
    {
        SPDR = ISPDR16.bytes[i];
            
#endif
    
    //State machine to modify SPDR (a one byte SPI IO shift register).
    //just start chucking out a generic JSON response. once you get to char 4, pick the correct
    //output string to use and the right string buffers also. We use these as the IO ctrlr has to
    //do at least some basic validation of the numbers both way (don't just tx and rx generic strings).
    switch(_mSPIData.bufptr)
    {
        case 0-SPILATENCY:
            if(SPDR=='{')
            {
                //begin to output a response and reset all front pointers we may access
                _mSPIData.bufptr++;
                //Reset control knob read buffers (need to start looking at the front again.
                _mrrrt.rstfront();_mtlvm.rstfront();_mmmip.rstfront();_mpkep.rstfront();_mitet.rstfront();_mfio2.rstfront();
                //Reset monitor readout buffers.
                _mmtvn.rstback(); _mpkip.rstback(); _mpco2.rstback();
            }
            SPDR=' ';
            break;
        case 1-SPILATENCY:
        case 2-SPILATENCY:
        case 3-SPILATENCY:
            _mSPIData.key.intv>>=8;      //TODO: profile this.
            _mSPIData.key.byte3=SPDR;
            _mSPIData.bufptr++;
            break;
        
        //CHECK BUS MASTER SENT KEY AGAINST SUPPORTED COMMANDS, THEN MOVE TO PROCESS THEM IF WE UNDERSTAND THE KEY
        case 4-SPILATENCY:
            _mSPIData.key.intv>>=8;      //TODO: profile this.
            _mSPIData.key.byte3=SPDR;   //now checking for a 4 char sequence. better than single letter.
            
            if(_mSPIData.key.intv == writeReadoutsKey)
                {SPDR=ACK;_mSPIData.cmd = WRRDTS;_mSPIData.bufptr++;  break;}
            
            if(_mSPIData.key.intv== readKnobsKey)
                {SPDR=ACK;_mSPIData.cmd = RDKNBS;_mSPIData.bufptr++;  break;}
            
       
            {SPDR='\0';_mSPIData = SPIdata();_mSPIData.bufptr=0-SPILATENCY;}   //default, reset the state machine if command was not understood.
            break;
        case BUFFERSIZE-SPILATENCY:
            {SPDR='\0';_mSPIData = SPIdata();_mSPIData.bufptr=0-SPILATENCY;} //-ve number used so as to access strings after reading cmd character 4.
            break;
        
        //PROCESS COMMANDS IF WE UNDERSTAND THE KEY
        default:        
            uint8_t din = SPDR;     //don't read from this register multiple times if you can avoid it.
            
            //bomb out if we read null.
            if(din=='\0')
                {
                    SPDR='\0';_mSPIData = SPIdata();_mSPIData.bufptr=0-SPILATENCY;  //reset state machine
                    drainReadoutBuffers();                                          //parse characters to native representations.
                }
            
            //EXAMPLE OF HOW TO READ INTO THIS IOCONTROLLER'S DOUBLE BUFFER REGISTERS FROM A SENDING SPI MASTER
            //deal with the command read in
            if(_mSPIData.cmd== WRRDTS)
            {   
                Serial.println("Pi will write knobs");
                
                switch(_mSPIData.key.intv)  //choose sensor to write data for based on JSON key.
                {
                    case MtVnkey:
                        if(!InsertJSONInNumbrBuf(_mmtvn, din))  //Try to add to the tlvm buffer.
                            _mSPIData.key.byte0=0;              //quit, its full.
                        break;
                        
                    case PkIPkey:
                        if(!InsertJSONInNumbrBuf(_mpkip, din))  //Try to add to the _mkip buffer.
                            _mSPIData.key.byte0=0;              //quit, its full.
                        break;
                        
                    case PCO2key:
                        if(!InsertJSONInNumbrBuf(_mpco2, din))  //Try to add to the _mkip buffer.
                            _mSPIData.key.byte0=0;              //quit, its full.
                        break;
                        
                    default:                        //keep reading in the command.
                        _mSPIData.key.intv>>=8;      //TODO: profile this.
                        _mSPIData.key.byte3=SPDR;
                                                    
                }

            }
            //EXAMPLE OF HOW TO SEND OUT THIS IOCONTROLLER'S DOUBLE BUFFER REGISTERS TO A READING SPI MASTER
            if(_mSPIData.cmd== RDKNBS)  //Flow to send control knob values to the bus master.
            {                
                //return ventilator knob settings to the bus master.
                switch(_mSPIData.bufptr)    //TODO: don't switch on a loop counter. you can switch on an int. then these don't need to be in order.
                {
                    case RRRT :                      
                        SPDR=*(_mrrrt.front++);     //print the char in front buffer.                            
                        if(*(_mrrrt.front)=='\0')   //if the next char is null, move along in the string.
                            _mSPIData.bufptr+=2;    
                        break;
                    case TLVM :
                        SPDR=*(_mtlvm.front++); //print the first char in front buffer.                                                                    
                        if(*(_mtlvm.front)=='\0')
                            _mSPIData.bufptr+=2;    
                        break;
                    case MMIP :
                        SPDR=*(_mmmip.front++);
                        if(*(_mmmip.front)=='\0')
                            _mSPIData.bufptr+=2;    
                        break;
                    case PKEP :
                        SPDR=*(_mpkep.front++);
                        if(*(_mpkep.front)=='\0')
                            _mSPIData.bufptr+=2;                                            
                        break;
                    case ITET :
                        SPDR=*(_mitet.front++);
                        if(*(_mitet.front)=='\0')
                            _mSPIData.bufptr+=2;                                            
                        break;                    
                    case FIO2 :
                        SPDR=*(_mfio2.front++);
                        if(*(_mfio2.front)=='\0')
                            _mSPIData.bufptr+=2;                                                                
                        break;                    
                    default:
                        
//check the buffer pointer
//Serial.print(_mSPIData.bufptr);Serial.print(" = ");Serial.print(*(ReportKnobs+_mSPIData.bufptr));Serial.print(',');
//end check the buffer pointer
                        
                        SPDR=*(ReportKnobs+_mSPIData.bufptr);
                        if(*(ReportKnobs+_mSPIData.bufptr)=='\0')//end of command
                            {_mSPIData.cmd=NOSPICMD;_mSPIData.bufptr=0-SPILATENCY;}
                        else
                            _mSPIData.bufptr++;
                        
                }
            }
            //Note, the SPIData.bufptr will not auto increment.
                
    }//End switch
#ifdef ARDUINO_SAM_DUE  /*code path for due, which uses two 16bit SPI registers*/

        OSPDR16.bytes[i] = SPDR;    //put SPDR byte into a 16bit shift register
    }//End outer for
    
    SPI0->SPI_TDR = OSPDR16.intv;   //Transmit the SPI data to the bus master.
    //Serial.write((char)OSPDR16.bytes[0]);Serial.write((char)OSPDR16.bytes[1]);Serial.write(',');
    //DUE only end
#else                  /*code path for uno, which uses one 8bit SPI register that has been set*/
    }//End outer for
#endif
 
}


