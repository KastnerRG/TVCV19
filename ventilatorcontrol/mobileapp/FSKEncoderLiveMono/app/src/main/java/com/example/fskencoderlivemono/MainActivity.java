package com.example.fskencoderlivemono;

import java.io.IOException;
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
    public Boolean setFSKChar = false;
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
        //Ventilator readout text boxes
        MtVndisp = (TextView)findViewById(R.id.MtVndisp);
        PkIPdisp = (TextView)findViewById(R.id.PkIPdisp);
        PCO2disp = (TextView)findViewById(R.id.PCO2disp);

        getReadouts = (Button)findViewById(R.id.getReadouts);
        getControlKnobs = (Button)findViewById(R.id.getControlKnobs);
        //Removed pcmButton = (Button)findViewById(R.id.pcm);
        //Removed fskButton = (Button)findViewById((R.id.fsk));
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

        mDecoder = new FSKDecoder(mConfig, new FSKDecoderCallback() {

            @Override
            public void decoded(byte[] newData) {

                final String text = new String(newData);
                runOnUiThread(new Runnable() {
                    public void run() {
                        //Reset the watchdog timer (otherwise bus will go back to PCM mode)
                        watchdogTimer = watchdogPeriod;

                        DECODER_DATA_BUF = text;
/*
                        //Decode JSON
                        try {
                            JSONObject jsonObj = new JSONObject(jsonStr);
                        } catch (final JSONException)

*/
                        //Show the value of what came on the bus for debugging.


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

                //TODO: Get real data
                MtVndisp.setText("0");
                PkIPdisp.setText("0");
                PCO2disp.setText("0");
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
