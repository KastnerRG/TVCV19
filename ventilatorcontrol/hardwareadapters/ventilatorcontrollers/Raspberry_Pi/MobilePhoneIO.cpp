/**********************************************************
THIS SOURCE FILE IS INTENDED TO BE COMPILED ON THE RASPBERRY PI BOARD
 SPI_Raspi_Arduino interface for mobile phone based ventilator control

   Configures an Raspberry Pi as an SPI master and
   demonstrates sending and recieving JSON data.  The Raspberry Pi transmits
   commands to perform addition and subtraction on a pair
   of integers and the Ardunio returns the result

Compile String:
g++ -o MobilePhoneIO SPI_Raspi_Arduino.cpp
***********************************************************/

#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/spi/spidev.h>
#include <fcntl.h>
#include <iostream>
#include <cstring>

//============================ variables for ventilator messaging ===================

#define PROGMEM

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

//============================ end variables for ventilator messaging  ==============


using namespace std;


/**********************************************************
Housekeeping variables
***********************************************************/

/* names of the ventilator readout keys (for writing ventilator readout values)
 * "MtVn"
#define PeakInspiratoryPressure         "PkIP"
#define PCO2                            "PCO2"
 */

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




int results;
int fd;

/**********************************************************
Declare Functions
***********************************************************/

int spiTxRx(unsigned char txDat);
int sendCommand(char i, int j, int k);
//int spiTxCmd(unsigned char* txDat, int n);
int spiTxRxCmd(unsigned char* txDat, unsigned char* rxDat, int n);

/**********************************************************
Main
***********************************************************/

int main (void)
{

int i = 0;

//Example to read ventilator knobs. Specify knobs to read. padding is required because of how SPI works.
unsigned char din[100]="{\"rk\":[{\"RrRt\",\"TlVm\",\"MmIP\",\"PkEP\",\"ITET\",\"FiO2\"]}"
unsigned char dout[100]="{hkkko some junk input }{hkkko some junk input }{hkkko some junk input }{hkkko some junk input }";//{'{','h','e','k','s','o','}','\n','\0'};


/**********************************************************
Setup SPI
Open file spidev0.0 (chip enable 0) for read/write access
with the file descriptor "fd"
Configure transfer speed (1MkHz)
***********************************************************/

   fd = open("/dev/spidev0.0", O_RDWR);

   unsigned int speed = 10000;//100000;//1000000; /*1MHz is too fast for Arduino*/
   ioctl (fd, SPI_IOC_WR_MAX_SPEED_HZ, &speed);

   for(int i=5; i<100; i++)
	din[i] = 0;
   for(int i=0; i<100; i++)
	dout[i] = 0;

   printf("Sending: %s",din);
   spiTxRxCmd(din,dout,100);

   printf("Sent: %s\n",din);
   printf("got: %s\n",dout);
//char by char
   printf("\n or: ");
   for(int i =0; i<100; i++)
	printf("%c,",dout[i]);
    printf("\n");

}

/**********************************************************
**********************************************************/
void spiTxRxCmd(unsigned char* txDat, unsigned char* rxDat, int n)
{
 
//  unsigned char rxDat[9];

  struct spi_ioc_transfer spi;

  memset (&spi, 0, sizeof (spi));

  spi.tx_buf        = (unsigned long)txDat;
  spi.rx_buf        = (unsigned long)rxDat;
  spi.len           = n;

  ioctl (fd, SPI_IOC_MESSAGE(1), &spi);
}


