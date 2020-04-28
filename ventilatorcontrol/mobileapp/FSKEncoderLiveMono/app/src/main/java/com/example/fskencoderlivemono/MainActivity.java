package com.example.fskencoderlivemono;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;

import com.example.fskencoderlivemono.bg.cytec.android.fskmodem.FSKConfig;
import com.example.fskencoderlivemono.bg.cytec.android.fskmodem.FSKDecoder;
import com.example.fskencoderlivemono.bg.cytec.android.fskmodem.FSKDecoder.FSKDecoderCallback;
import com.example.fskencoderlivemono.bg.cytec.android.fskmodem.FSKEncoder;
import com.example.fskencoderlivemono.bg.cytec.android.fskmodem.FSKEncoder.FSKEncoderCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Looper;
import android.util.JsonReader;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Bundle;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {


    private static SeekBar respRate;
    private static SeekBar tidVol;
    private static SeekBar maxPres;
    private static SeekBar o2Con;
    private static SeekBar MmIPs;
    private static SeekBar ITETs;
    //Control knob text that read slider views (requested value)
    private static TextView respText;
    private static TextView tidText;
    private static TextView presText;
    private static TextView o2Text;
    private static TextView MmIPsText;
    private static TextView ITETsText;
    //Actual values from Arduino (read back in)
    private static TextView readRespText;
    private static TextView readTidText;
    private static TextView readPresText;
    private static TextView readO2Text;
    private static TextView readMmIPsText;
    private static TextView readITETsText;

    //Ventilator readout text (read value)
    private static TextView MtVndisp;
    private static TextView PkIPdisp;
    private static TextView PCO2disp;

    //buttons etc.
    private static Button getReadouts;
    private static Button getControlKnobs;
    private PCMRun pcmRun;
    //private static Button pcmButton;
    //private static Button fskButton;
    private static TextView view1;

    public String ENCODER_DATA_BUF = "\0";
    public String DECODER_DATA_BUF = "\0";
    //public Boolean setFSKChar = false;
    public Boolean FSKinProg = false;
    public String MODE = "PCM";

    protected FSKConfig mConfig;
    protected FSKEncoder mEncoder;
    protected FSKDecoder mDecoder;
    protected AudioTrack mAudioTrack;
    protected AudioRecord mRecorder;
    protected int mBufferSize = 0;

    //Watchdog stuff
    protected final int modemPollPeriod = 10;
    protected final int watchdogPeriod = 4000;
    protected int watchdogTimer = 0;

    final int REQUEST_MICROPHONE = 1;



    protected Runnable mDataFeeder = new Runnable() {

        @Override
        public void run() {

            while (true) {

                if (ENCODER_DATA_BUF == null) {
                    continue;
                } else {

                    byte[] data = ENCODER_DATA_BUF.getBytes();

                    if (data.length > FSKConfig.ENCODER_DATA_BUFFER_SIZE) {
                        //chunk data

                        byte[] buffer = new byte[FSKConfig.ENCODER_DATA_BUFFER_SIZE];

                        ByteBuffer dataFeed = ByteBuffer.wrap(data);

                        while (dataFeed.remaining() > 0) {

                            if (dataFeed.remaining() < buffer.length) {
                                buffer = new byte[dataFeed.remaining()];
                            }

                            dataFeed.get(buffer);

                            mEncoder.appendData(buffer);

                            try {
                                Thread.sleep(10);//100); //wait for encoder to do its job, to avoid buffer overflow and data rejection
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    } else {
                        mEncoder.appendData(data);
                    }
                    ENCODER_DATA_BUF = null;
                }
            }
        }
    };

    protected Runnable mRecordFeed = new Runnable() {

        @Override
        public void run() {

            while (mRecorder.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING) {

                short[] data = new short[mBufferSize/2]; //the buffer size is in bytes

                // gets the audio output from microphone to short array samples
                mRecorder.read(data, 0, mBufferSize/2);

                mDecoder.appendSignal(data);
            }
        }
    };

    //---------------------------------------SLIDER CONTROL. RAW INTERACTION WITH BUFFER--------------------
    public void RespRate() {
        respText.setText("Respiratory Rate Set : " + respRate.getProgress() + " / " + respRate.getMax());
        respRate.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {}

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        short RrRt = (short)respRate.getProgress();//*This* slider.
                        short TlVm = (short)tidVol.getProgress();
                        short MmIP = (short)MmIPs.getProgress();
                        short PkEP = (short)maxPres.getProgress();
                        short ITET = (short)ITETs.getProgress();
                        short FiO2 = (short)o2Con.getProgress();

                        if (MODE == "FSK") {
                            //Write out all sensors at once. This is just expected in our first basic implementation of a ventilator controller.
                            ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":" + TlVm + "},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":" + FiO2 + "}]}\r\n";
                        }
                        else {
                            pcmRun.setFreq_level(respRate.getProgress());
                        }
                        respText.setText("Respiratory Rate : " + RrRt + " / " + respRate.getMax());

                    }
                }
        );
    }

    public void TidVol() {
        tidText.setText("Tidal Volume : " + tidVol.getProgress() + " / " + tidVol.getMax());
        tidVol.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {}

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        short RrRt = (short)respRate.getProgress();
                        short TlVm = (short)tidVol.getProgress();//*This* slider.
                        short MmIP = (short)MmIPs.getProgress();
                        short PkEP = (short)maxPres.getProgress();
                        short ITET = (short)ITETs.getProgress();
                        short FiO2 = (short)o2Con.getProgress();

                        //Write out all sensors at once. This is just expected in our first basic implementation of a ventilator controller.
                        ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":"+ TlVm +"},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":"+ FiO2 +"}]}\r\n";
                        tidText.setText("Tidal Volume Set : "  + TlVm + " / " + tidVol.getMax());
                    }
                }
        );
    }

    public void MaxPres() {
        presText.setText("Peak End Exp Pressure Set : " + maxPres.getProgress() + " / " + maxPres.getMax());
        maxPres.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {}

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        short RrRt = (short)respRate.getProgress();
                        short TlVm = (short)tidVol.getProgress();
                        short MmIP = (short)MmIPs.getProgress();
                        short PkEP = (short)maxPres.getProgress();//*This* slider.
                        short ITET = (short)ITETs.getProgress();
                        short FiO2 = (short)o2Con.getProgress();

                        //Write out all sensors at once. This is just expected in our first basic implementation of a ventilator controller.
                        ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":"+ TlVm +"},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":"+ FiO2 +"}]}\r\n";
                        presText.setText("Peak End Exp Pressure Set : " + PkEP + " / " + maxPres.getMax());
                    }
                }
        );
    }

    public void O2Con() {
        o2Text.setText("O2 Concentration Set : " + o2Con.getProgress() + " / " + o2Con.getMax());
        o2Con.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {}

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        short RrRt = (short)respRate.getProgress();
                        short TlVm = (short)tidVol.getProgress();
                        short MmIP = (short)MmIPs.getProgress();
                        short PkEP = (short)maxPres.getProgress();
                        short ITET = (short)ITETs.getProgress();
                        short FiO2 = (short)o2Con.getProgress();//*This* slider.

                        //Write out all sensors at once. This is just expected in our first basic implementation of a ventilator controller.
                        ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":"+ TlVm +"},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":"+ FiO2 +"}]}\r\n";
                        o2Text.setText("O2 Concentration Set : " + FiO2 + " / " + o2Con.getMax());
                    }
                }
        );
    }

    //Class overrides for MmIPs
    public void MmIPs(){
        MmIPsText.setText("Max Insp Pressure Set : " + MmIPs.getProgress() + " / " + MmIPs.getMax());
        MmIPs.setOnSeekBarChangeListener(
            new SeekBar.OnSeekBarChangeListener() {
                int progress_value;
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {}

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    short RrRt = (short)respRate.getProgress();
                    short TlVm = (short)tidVol.getProgress();
                    short MmIP = (short)MmIPs.getProgress();
                    short PkEP = (short)maxPres.getProgress();
                    short ITET = (short)ITETs.getProgress();
                    short FiO2 = (short)o2Con.getProgress();

                    //Write out all sensors at once. This is just expected in our first basic basic implementation of a ventilator controller.
                    ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":"+ TlVm +"},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":"+ FiO2 +"}]}\r\n";
                    MmIPsText.setText("Max Insp Pressure Set : " + MmIP + " / " + MmIPs.getMax());
                }
            }
        );
    }

    public void ITETs(){
        ITETsText.setText(" Inspire t / Expire t Set : " + ITETs.getProgress() + " / " + ITETs.getMax());
        ITETs.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {}

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {}

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        short RrRt = (short)respRate.getProgress();
                        short TlVm = (short)tidVol.getProgress();
                        short MmIP = (short)MmIPs.getProgress();
                        short PkEP = (short)maxPres.getProgress();
                        short ITET = (short)ITETs.getProgress();
                        short FiO2 = (short)o2Con.getProgress();

                        //Write out all sensors at once. This is just expected in our first basic basic implementation of a ventilator controller.
                        ENCODER_DATA_BUF = "{\"wr\":[{\"RrRt\":" + RrRt + "},{\"TlVm\":"+ TlVm +"},{\"MmIP\":" + MmIP + "},{\"PkEP\":" + PkEP + "},{\"ITET\":" + ITET + "},{\"FiO2\":"+ FiO2 +"}]}\r\n";
                        ITETsText.setText(" Inspire t / Expire t Set : " + ITET + " / " + MmIPs.getMax());
                    }
                }
        );
    }

    //Function to update ventilator readout display if ventialtor readout data can be found in rawJSON (which can be dirty)
    public void parseVentReadout(String dirtyJSON){

        //TODO read in old value from text box to avoid wierd 0 on missed read from device.
        int mtvn = 0; int pkip = 0; int pc02 = 0;

        JsonReader dirtyReader;   //We cannot simply parse JSON from arduino, it is dirty usually.
        int JSONstart = dirtyJSON.indexOf("{");
        if(JSONstart >= 0){
            String clnJSON = dirtyJSON.substring(JSONstart);  //Discard first junk.
            dirtyReader = new JsonReader(new StringReader(clnJSON));
            //try to parse dirtyJSON with a streaming parser.

            //Structure is like so: { k :[ {k:v},...,{k:v}]}
            try {
                dirtyReader.beginObject();//Deal with the first object in the dictionary.
                while (dirtyReader.hasNext()) {

                    String name = dirtyReader.nextName();

                    if (name.equals("rd")) {

                        dirtyReader.beginArray();   //Go through the value array
                        while(dirtyReader.hasNext()) {
                            dirtyReader.beginObject();  //each element is a dictionary

                            name = dirtyReader.nextName();

                            while(dirtyReader.hasNext()) {
                                if (name.equals("MtVn")) {     //should only be one key per innermost dictionary
                                    mtvn = dirtyReader.nextInt();
                                } else if (name.equals("PkIP")) {
                                    pkip = dirtyReader.nextInt();
                                } else if (name.equals("PCO2")) {
                                    pc02 = dirtyReader.nextInt();
                                } else {
                                    dirtyReader.skipValue();
                                }
                            }

                            dirtyReader.endObject();    //End element dictionary
                        }
                        dirtyReader.endArray();

                    }
                    else{
                        dirtyReader.skipValue();    //We don't handle this object.
                    }
                }
                dirtyReader.endObject();
                dirtyReader.close();

            }catch (Exception e){/*No action*/}
        }
        //Update text views. This is a bit neater here rrrt,tlvm,mmip,pkep,itet,fio2
        final int _mtvn = mtvn;
        final int _pkip = pkip;
        final int _pc02 = pc02;

        runOnUiThread(new Runnable() {
            public void run() {
                MtVndisp.setText(_mtvn);
                PkIPdisp.setText(_pkip);
                PCO2disp.setText(_pc02);
            }
        });

    }


    //Function to update control knob display if control knobs data can be found in rawJSON (which can be dirty)
    public void parseControlKnobs(String dirtyJSON){
        //String poo = (char)0x05 + (char)0x08 + "{\"rd\":[{\"Valid\":10},{\"Jay\":45},{\"dict\":67}]}" + (char)0x35;

        //TODO read in old value from text box to avoid wierd 0 on missed read from device.
        int rrrt = 0; int tlvm = 0; int mmip = 0; int pkep = 0; int itet = 0; int fio2 = 0;

        JsonReader dirtyReader;   //We cannot simply parse JSON from arduino, it is dirty usually.
        int JSONstart = dirtyJSON.indexOf("{");
        if(JSONstart >= 0){
            String clnJSON = dirtyJSON.substring(JSONstart);  //Discard first junk.
            dirtyReader = new JsonReader(new StringReader(clnJSON));
            //try to parse dirtyJSON with a streaming parser.

            //Structure is like so: { k :[ {k:v},...,{k:v}]}
            try {
                dirtyReader.beginObject();//Deal with the first object in the dictionary.
                while (dirtyReader.hasNext()) {

                    String name = dirtyReader.nextName();

                    if (name.equals("rk")) {

                        dirtyReader.beginArray();   //Go through the value array
                        while(dirtyReader.hasNext()) {
                            dirtyReader.beginObject();  //each element is a dictionary

                            name = dirtyReader.nextName();

                            while(dirtyReader.hasNext()) {
                                if (name.equals("RrRt")) {     //should only be one key per innermost dictionary
                                    rrrt = dirtyReader.nextInt();
                                } else if (name.equals("TlVm")) {
                                    tlvm = dirtyReader.nextInt();
                                } else if (name.equals("MmIP")) {
                                    mmip = dirtyReader.nextInt();
                                } else if (name.equals("PkEP")) {
                                    pkep = dirtyReader.nextInt();
                                } else if (name.equals("ITET")) {
                                    itet = dirtyReader.nextInt();
                                } else if (name.equals("FiO2")) {
                                    fio2 = dirtyReader.nextInt();
                                } else {
                                    dirtyReader.skipValue();
                                }
                            }

                            dirtyReader.endObject();    //End element dictionary
                        }
                        dirtyReader.endArray();

                    }
                    else{
                        dirtyReader.skipValue();    //We don't handle this object.
                    }
                }
                dirtyReader.endObject();
                dirtyReader.close();

            }catch (Exception e){/*No action*/}
        }
        //Update text views. This is a bit neater here rrrt,tlvm,mmip,pkep,itet,fio2
        final int _rrrt = rrrt;
        final int _tlvm = tlvm;
        final int _mmip = mmip;
        final int _pkep = pkep;
        final int _itet = itet;
        final int _fio2 = fio2;
        runOnUiThread(new Runnable() {
            public void run() {
                readRespText.setText("Set: " + _rrrt);
                readTidText.setText("Set: " + _tlvm);
                readPresText.setText("Set: " + _mmip);
                readMmIPsText.setText("Set: " + _pkep);
                readITETsText.setText("Set: " + _itet);
                readO2Text.setText("Set: " + _fio2);
            }
        });

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);



        //Wire up some generic controls
        respRate = (SeekBar)findViewById(R.id.respRate);
        tidVol = (SeekBar)findViewById(R.id.tidVol);
        maxPres = (SeekBar)findViewById(R.id.maxPres);
        o2Con = (SeekBar)findViewById(R.id.o2Con);
        MmIPs = (SeekBar)findViewById(R.id.MmIPs);
        ITETs = (SeekBar)findViewById(R.id.ITETs);
        //Desired control knob value text boxes
        respText = (TextView)findViewById(R.id.respText);
        tidText = (TextView)findViewById(R.id.tidText);
        presText = (TextView)findViewById(R.id.presText);
        o2Text = (TextView)findViewById(R.id.o2Text);
        MmIPsText = (TextView)findViewById(R.id.MmIpsText);
        ITETsText = (TextView)findViewById(R.id.ITETsText);
        //Read Control knob text value boxes
        readRespText = (TextView)findViewById(R.id.readRespText);
        readTidText = (TextView)findViewById(R.id.readTidText);
        readPresText = (TextView)findViewById(R.id.readPresText);
        readO2Text = (TextView)findViewById(R.id.readO2Text);
        readMmIPsText = (TextView)findViewById(R.id.readMmIpsText);
        readITETsText = (TextView)findViewById(R.id.readITETsText);
        //Ventilator readout text boxes
        MtVndisp = (TextView)findViewById(R.id.MtVndisp);
        PkIPdisp = (TextView)findViewById(R.id.PkIPdisp);
        PCO2disp = (TextView)findViewById(R.id.PCO2disp);

        getReadouts = (Button)findViewById(R.id.getReadouts);
        getControlKnobs = (Button)findViewById(R.id.getControlKnobs);

        view1 = (TextView)findViewById(R.id.decoded);
        // Request Mic permission
        while (ContextCompat.checkSelfPermission(this,
                Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    REQUEST_MICROPHONE);
        }

        /// INIT FSK CONFIG

        try {
            mConfig = new FSKConfig(FSKConfig.SAMPLE_RATE_44100, FSKConfig.PCM_16BIT, FSKConfig.CHANNELS_MONO, FSKConfig.SOFT_MODEM_MODE_4, FSKConfig.THRESHOLD_20P);
        } catch (IOException e1) {
            e1.printStackTrace();
        }

        /// INIT FSK DECODER

        //TODO: bug bug, this does not assemble smaller packets into larger ones. fragmented JSON in several buffers wont be parsed!
        mDecoder = new FSKDecoder(mConfig, new FSKDecoderCallback() {

            @Override
            public void decoded(byte[] newData) {

                final String text = new String(newData);
                DECODER_DATA_BUF = text;
                watchdogTimer = watchdogPeriod;

                //Update control knobs if we should
                if(DECODER_DATA_BUF.contains("rk"))
                    parseControlKnobs(DECODER_DATA_BUF);
                //Update readouts if we should
                if(DECODER_DATA_BUF.contains("rd"))
                    parseVentReadout(DECODER_DATA_BUF);

                //DEBUG display
                runOnUiThread(new Runnable() {
                    public void run() {

                        //Always do this
                        view1.setText(text);

                        //Decode.


                    }
                });
            }
        });

        //make sure that the settings of the recorder match the settings of the decoder
        //most devices cant record anything but 44100 samples in 16bit PCM format...
        mBufferSize = AudioRecord.getMinBufferSize(FSKConfig.SAMPLE_RATE_44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);

        //scale up the buffer... reading larger amounts of data
        //minimizes the chance of missing data because of thread priority
        mBufferSize *= 10;

        //again, make sure the recorder settings match the decoder settings
        mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, FSKConfig.SAMPLE_RATE_44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, mBufferSize);

        if (mRecorder.getState() == AudioRecord.STATE_INITIALIZED) {
            mRecorder.startRecording();

            //start a thread to read the audio data
            Thread thread = new Thread(mRecordFeed);
            thread.setPriority(Thread.MAX_PRIORITY);
            thread.start();
        }
        else {
            Log.i("FSKDecoder", "Please check the recorder settings, something is wrong!");
        }

        /// INIT FSK ENCODER

        mEncoder = new FSKEncoder(mConfig, new FSKEncoderCallback() {

            @Override
            public void encoded(byte[] pcm8, short[] pcm16) {
                if (mConfig.pcmFormat == FSKConfig.PCM_8BIT) {
                    //8bit buffer is populated, 16bit buffer is null

                    mAudioTrack.write(pcm8, 0, pcm8.length);

                    //mDecoder.appendSignal(pcm8);
                }
                else if (mConfig.pcmFormat == FSKConfig.PCM_16BIT) {
                    //16bit buffer is populated, 8bit buffer is null

                    mAudioTrack.write(pcm16, 0, pcm16.length);

                    //mDecoder.appendSignal(pcm16);
                }
            }
        });

        ///

        mAudioTrack = new AudioTrack(AudioManager.STREAM_MUSIC,
                mConfig.sampleRate, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT, 1024,
                AudioTrack.MODE_STREAM);

        mAudioTrack.play();

        ///

        new Thread(mDataFeeder).start();


        //final Object lock = new Object();

        // Handshake Thread
        final Thread handshake = new Thread() {
            public void run() {
                Looper.prepare();
                //synchronized (lock) {
                while (true) {

                    FSKinProg = false;
                    try {
                        runOnUiThread(new Runnable() {
                                          @Override
                                          public void run() {

                                              if (!MODE.equals("FSK")) {

                                                  tidVol.setEnabled(false);
                                                  maxPres.setEnabled(false);
                                                  o2Con.setEnabled(false);
                                                  MmIPs.setEnabled(false);
                                                  ITETs.setEnabled(false);
                                                  getReadouts.setEnabled(false);    //can't query ventilator
                                                  getControlKnobs.setEnabled(false);
                                              } else {
                                                  tidVol.setEnabled(true);
                                                  maxPres.setEnabled(true);
                                                  o2Con.setEnabled(true);
                                                  MmIPs.setEnabled(true);
                                                  ITETs.setEnabled(true);
                                                  getReadouts.setEnabled(true);     //can query ventilator
                                                  getControlKnobs.setEnabled(true);
                                              }
                                          }
                                      });

                        //Log.d("Delay", "1");
                        //Does nothing char enq = 05;
                        //Does nothing char ack = 06;
                        //Not used String ackStr = Character.toString(ack);
                        if(watchdogTimer <=1000 && MODE.equals("FSK"))   //try to keep bus up
                        {
                            ENCODER_DATA_BUF = "##########";    //use a different ping in IO mode.
                            //Wwith this you inject crap into the command potentially ENCODER_DATA_BUF = "#         ";    //Don't send so many ping characters. its annoying.
                        }

                        if (watchdogTimer <= 0){
                            MODE = "PCM";   //possible to time out!
                            ENCODER_DATA_BUF = "$$aaaaaaaa"; //TODO can add this to the PCM buffer.
                            //TODO: else do PCM Mode. Really modulate this.

                            //Log.i("Handshake Thread", "Bus time out.");

                            Thread.sleep(10);//modemPollPeriod);


                            //Send out the version string.
                            if (DECODER_DATA_BUF.contains("$")) {
                                ENCODER_DATA_BUF = "{\"1\":{}}{\"1\":{}}   \n";
                            }
                            else
                            {
                                Thread.sleep(3000);
                            }


                            Thread.sleep(10);//modemPollPeriod);


                            if (DECODER_DATA_BUF.contains("{\"1\":{}}")) {

                                //RESET Watchdog
                                watchdogTimer = watchdogPeriod;

                                MODE = "FSK";
                                Log.i("Handshake Thread", "FSK Mode on.");
                            }

                        } else  //watchdog timer is not 0
                        {
                            //we should maintain the bus. Right now this is a dummy, it simply decrements the timer down.
                            watchdogTimer -= modemPollPeriod;
                        }

                        Thread.sleep(10);//modemPollPeriod);

                    } catch (InterruptedException e) {
                        Log.i("Handshake Thread", "local Thread error", e);
                    }
                }
            }
            //}
        };

        handshake.setPriority(Thread.MAX_PRIORITY);
        handshake.start();


        //Instantiate Ventilator Control Knob Sliders
        RespRate();
        TidVol();
        MaxPres();
        O2Con();
        MmIPs();
        ITETs();


        // PCM Thread
        pcmRun = new PCMRun();
        Thread soundThread = new Thread(pcmRun);
        soundThread.start();

        //Button press to get readouts. This JSON will get sent over the modem and if all is well, set the data. An ACK will confirm.
        getReadouts.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //TODO: should pause the watchdog thread?
                ENCODER_DATA_BUF = "{\"rd\":[{\"MtVn\",\"PkIP\",\"PCO2\"]}\r\n"; //read knobs.

                //The data reader for DECODER_DATA_BUF will set any display elements after ventilator returns data
            }
        });

        //Button press to get control knobs
        getControlKnobs.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //TODO: should pause the watchdog thread?
                ENCODER_DATA_BUF = "{\"rk\":[{\"RrRt\",\"TlVm\",\"MmIP\",\"PkEP\",\"ITET\",\"FiO2\"]}\r\n"; //read knobs.
            }

        });

    }


    @Override
    protected void onDestroy() {
        mDecoder.stop();

        mEncoder.stop();

        mAudioTrack.stop();
        mAudioTrack.release();

        super.onDestroy();
    }

}
