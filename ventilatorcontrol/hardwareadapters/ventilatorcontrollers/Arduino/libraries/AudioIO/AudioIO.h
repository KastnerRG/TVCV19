/*
  AudioIO.h - AudioIO library for Wiring - description
*/

// ensure this library description is only included once
#ifndef AudioIO_h
#define AudioIO_h

// include types & constants of Wiring core API
//#include "WConstants.h"
#include <Arduino.h>
#include <SoftModem.h>

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

// library interface description
class AudioIO
{
  // user-accessible "public" interface
  public:
    AudioIO();
    void begin();
    void doSomething(void);

  // library-accessible "private" interface
  private:

    policy _mPolicyState;
	//void doSomethingSecret(void);
};

#endif

