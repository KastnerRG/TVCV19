#include <AudioIO.h>
#include <Thread.h>

//if you don't want Thread.h you can also do:

char const wj[] PROGMEM  = "{\"wr\":[{\"RrRt\":1986},{\"TlVm\":12},{\"MmIP\":1623},{\"PkEP\":14},{\"ITET\":12345},{\"FiO2\":0}]}"; //write knobs
char const rj[] PROGMEM  = "{\"wk\":[{\"RrRt\":1},{\"TlVm\":12},{\"MmIP\":123},{\"PkEP\":1234},{\"ITET\":12345},{\"FiO2\":0}]}"; //read knobs.
//control c;
//readout r;
AudioIO io = AudioIO();

//My simple Thread
Thread myThread = Thread();

//Bus management
void niceCallback()
{
  io.pollBusStatus();//Does bus maintainance and command parsing if needed
  //Below is stuff before handshake was added
  /*io._mMasterData.available =true;
  io.pollBusStatus();
  
  //DEBUG to check the command parser

  //OK io.sendVentilatorData();
  //OK  io.reportVentilatorKnobs();
  //OK 
  io.setVentilatorKnobs();    //as in, parse the data buffer filled by master.
  io.getVentilatorKnobs(&c);

  //print every controll knob. They should have been set above using io.parseCommand();
  Serial.print("rrrt: ");  Serial.print(c.rrrt);Serial.print('\n');
  Serial.print("tlvm: ");  Serial.print(c.tlvm);Serial.print('\n');
  Serial.print("mmip: ");  Serial.print(c.mmip);Serial.print('\n');
  Serial.print("pkep: ");  Serial.print(c.pkep);Serial.print('\n');
  Serial.print("itet: ");  Serial.print(c.itet);Serial.print('\n');
  Serial.print("fio2: ");  Serial.print(c.fio2);Serial.print('\n');

  r.mtvn += 4;
  r.pkip += 1;
  r.pco2 +=3;
  io.setVentilatorReadings(&r);
  io.reportVentilatorData();
  */
}

void setup() {
  Serial.begin(115200);
  Serial.println("Booting with SPI support... modified for Due\n");
  //delay(100);
  
  io.begin();
  /*Commented stuff was there before handshake.
  strcpy_P(io._mMasterData.buffer_cmd,rj);
  //Debug write the strings to control knobs
  io.setVentilatorKnobs();
  */

  myThread.onRun(niceCallback);
  myThread.setInterval(POLLBUSMS);//works every 100ms POLLBUSMS);     //call more frequently to poll the serial data

  //DEBUG TO CHECK SPI IO
/*  *(io._mrrrt.front)=0x33;
  *(io._mrrrt.front+1)=0x30;//0x39;
    *(io._mrrrt.front+2)=0x33;//0x39;
      *(io._mrrrt.front+3)=0x31;//0x39;
  *(io._mrrrt.front+4)='\0';

  *(io._mtlvm.front)=0x34;
  *(io._mtlvm.front+1)='\0';

  *(io._mmmip.front)=0x35;
  *(io._mmmip.front+1)='\0';

  *(io._mpkep.front)=0x36;
  *(io._mpkep.front+1)='\0';

  *(io._mitet.front)=0x37;
  *(io._mitet.front+1)='\0';

  *(io._mfio2.front)=0x38;
  *(io._mfio2.front+1)='\0';*/
                  /*
                //see all buffers to verify their content.
                
                Serial.print("_mrrrt.front");Serial.println(_mrrrt.front);Serial.print('\n');
                
                Serial.print("_mtlvm.front");Serial.println(_mtlvm.front);Serial.print('\n');
                Serial.print("_mmmip.front");Serial.println(_mmmip.front);Serial.print('\n');
                Serial.print("_mpkep.front");Serial.println(_mpkep.front);Serial.print('\n');
                Serial.print("_mitet.front");Serial.println(_mitet.front);Serial.print('\n');
                
                Serial.print("_mmtvn.front");Serial.println(_mmtvn.front);Serial.print('\n');
                Serial.print("_mpkip.front");Serial.println(_mpkip.front);Serial.print('\n');
                Serial.print("_mpco2.front");Serial.println(_mpco2.front);Serial.print('\n');
                */
}



void loop() 
{ 
  //TODO: Main Program?
    if(myThread.shouldRun())
      myThread.run();
}
