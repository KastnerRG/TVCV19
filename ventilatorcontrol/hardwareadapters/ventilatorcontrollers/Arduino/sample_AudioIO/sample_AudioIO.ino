#include <AudioIO.h>


//#include <SoftModem.h>
char const s[] PROGMEM  = "{\"wr\":[{\"RrRt\":1},{\"TlVm\":12},{\"MmIP\":123},{\"PkEP\":1234},{\"ITET\":12345},{\"FiO2\":0}]}"; //write knobs
control c;
readout r;
AudioIO io = AudioIO();

void setup() {
  Serial.begin(115200);
  Serial.println("Booting");
  //delay(100);
  
  io.begin();
  
  strcpy_P(io._mMasterData.buffer_cmd,s);
}

//Control for 
void loop_ProcessCMD(2000)
{
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
}

void loop() 
{ 
  //TODO: Main Program?
}