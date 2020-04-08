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
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {


    private static SeekBar respRate;
    private static SeekBar tidVol;
    private static SeekBar maxPres;
    private static SeekBar o2Con;
    private static TextView respText;
    private static TextView tidText;
    private static TextView presText;
    private static TextView o2Text;
    private static Button setControl;
    private static Button pcmButton;
    private static Button fskButton;
    private static TextView view1;

    public String ENCODER_DATA_BUF = "\0";
    public String DECODER_DATA_BUF = "\0";
    public Boolean setFSKChar = false;
    public Boolean FSKinProg = false;
    public String MODE = "0";

    protected FSKConfig mConfig;
    protected FSKEncoder mEncoder;
    protected FSKDecoder mDecoder;
    protected AudioTrack mAudioTrack;
    protected AudioRecord mRecorder;
    protected int mBufferSize = 0;

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
                                Thread.sleep(100); //wait for encoder to do its job, to avoid buffer overflow and data rejection
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

    public void RespRate() {
        //final PWMRun pmwRun = new PWMRun();
        //final Thread soundThread = new Thread(pmwRun);
        //soundThread.start();
        respText.setText("Respiratory Rate : " + respRate.getProgress() + " / " + respRate.getMax());
        respRate.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        progress_value = progress;
                        //ENCODER_DATA_BUF = "Respiratory Rate : " + progress + " / " + respRate.getMax();
                        //respText.setText("Respiratory Rate : " + progress + " / " + respRate.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in progress", Toast.LENGTH_LONG).show();

                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {
                        //Toast.makeText(MainActivity.this,"SeekBar in StartTracking", Toast.LENGTH_LONG).show();


                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        //ENCODER_DATA_BUF = "Respiratory Rate : " + progress_value + " / " + respRate.getMax();
                        //respText.setText("Respiratory Rate : " + progress_value + " / " + respRate.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in StopTracking", Toast.LENGTH_LONG).show();


                    }
                }
        );
    }

    public void TidVol() {
        //final PWMRun pmwRun = new PWMRun();
        //final Thread soundThread = new Thread(pmwRun);
        //soundThread.start();
        tidText.setText("Tidal Volume : " + tidVol.getProgress() + " / " + tidVol.getMax());
        tidVol.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        progress_value = progress;
                        //ENCODER_DATA_BUF = "Tidal Volume : " + progress + " / " + tidVol.getMax();
                        //tidText.setText("Tidal Volume : " + progress + " / " + tidVol.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in progress", Toast.LENGTH_LONG).show();

                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {
                        //Toast.makeText(MainActivity.this,"SeekBar in StartTracking", Toast.LENGTH_LONG).show();


                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        //ENCODER_DATA_BUF = "Tidal Volume : " + progress_value + " / " + tidVol.getMax();
                        //tidText.setText("Tidal Volume : " + progress_value + " / " + tidVol.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in StopTracking", Toast.LENGTH_LONG).show();


                    }
                }
        );
    }

    public void MaxPres() {
        //final PWMRun pmwRun = new PWMRun();
        //final Thread soundThread = new Thread(pmwRun);
        //soundThread.start();
        presText.setText("Peak Pressure : " + maxPres.getProgress() + " / " + maxPres.getMax());
        maxPres.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        progress_value = progress;
                        // ENCODER_DATA_BUF = "Peak Pressure : " + progress + " / " + maxPres.getMax();
                        // presText.setText("Peak Pressure : " + progress + " / " + maxPres.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in progress", Toast.LENGTH_LONG).show();

                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {
                        //Toast.makeText(MainActivity.this,"SeekBar in StartTracking", Toast.LENGTH_LONG).show();


                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        //ENCODER_DATA_BUF = "Peak Pressure : " + progress_value + " / " + maxPres.getMax();
                        //presText.setText("Peak Pressure : " + progress_value + " / " + maxPres.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in StopTracking", Toast.LENGTH_LONG).show();


                    }
                }
        );
    }

    public void O2Con() {
        //final PWMRun pmwRun = new PWMRun();
        //final Thread soundThread = new Thread(pmwRun);
        //soundThread.start();
        o2Text.setText("O2 Concentration : " + o2Con.getProgress() + " / " + o2Con.getMax());
        o2Con.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int progress_value;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        progress_value = progress;
                        //ENCODER_DATA_BUF = "O2 Concentration : " + progress + " / " + o2Con.getMax();
                        //o2Text.setText("O2 Concentration : " + progress + " / " + o2Con.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in progress", Toast.LENGTH_LONG).show();

                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {
                        //Toast.makeText(MainActivity.this,"SeekBar in StartTracking", Toast.LENGTH_LONG).show();


                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        //ENCODER_DATA_BUF = "O2 Concentration : " + progress_value + " / " + maxPres.getMax();
                        //o2Text.setText("O2 Concentration : " + progress_value + " / " + maxPres.getMax());
                        //Toast.makeText(MainActivity.this,"SeekBar in StopTracking", Toast.LENGTH_LONG).show();
                    }
                }
        );
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        respRate = (SeekBar)findViewById(R.id.respRate);
        tidVol = (SeekBar)findViewById(R.id.tidVol);
        maxPres = (SeekBar)findViewById(R.id.maxPres);
        o2Con = (SeekBar)findViewById(R.id.o2Con);
        respText = (TextView)findViewById(R.id.respText);
        tidText = (TextView)findViewById(R.id.tidText);
        presText = (TextView)findViewById(R.id.presText);
        o2Text = (TextView)findViewById(R.id.o2Text);
        setControl = (Button)findViewById(R.id.setControl);
        pcmButton = (Button)findViewById(R.id.pcm);
        fskButton = (Button)findViewById((R.id.fsk));
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
                DECODER_DATA_BUF = "\0";
                runOnUiThread(new Runnable() {
                    public void run() {
                        DECODER_DATA_BUF = text;
                        //view1.setText(view1.getText()+text);

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


        final Object lock = new Object();

        // Handshake Thread
        final Thread handshake = new Thread() {
            public void run() {
                Looper.prepare();
                //synchronized (lock) {
                    while (true) {
                        FSKinProg = false;
                        try {
                            if (!MODE.equals("FSK")) {
                                tidVol.setEnabled(false);
                                maxPres.setEnabled(false);
                                o2Con.setEnabled(false);
                            } else {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                    tidVol.setEnabled(true);
                                    maxPres.setEnabled(true);
                                    o2Con.setEnabled(true);

                                    }
                                });
                            }

                            Log.d("Delay", "1");
                            char enq = 05;
                            char ack = 06;
                            String ackStr = Character.toString(ack);
                            if (setFSKChar) {
                                /*ENCODER_DATA_BUF = Character.toString(enq)+Character.toString(enq)+Character.toString(enq)+Character.toString(enq)
                                        +Character.toString(enq)+Character.toString(enq)+Character.toString(enq)
                                        +Character.toString(enq)+Character.toString(enq)+Character.toString(enq);*/
                                ENCODER_DATA_BUF = "$$$$$$$$$$";
                            } else {
                                ENCODER_DATA_BUF = "pppppppppp";
                            }
                            Thread.sleep(1000);
                            Log.d("Delay", "2");
                            if (!FSKinProg) {

                                if (DECODER_DATA_BUF.contains("$") && !MODE.equals("FSK")) {
                                    MODE = "FSK";
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            Toast.makeText(MainActivity.this, "FSK Mode!", Toast.LENGTH_LONG).show();
                                        }
                                    });
                                } else if (!DECODER_DATA_BUF.contains("$") && !MODE.equals("PCM")) {
                                    MODE = "PCM";
                                    runOnUiThread(new Runnable() {
                                        public void run() {
                                            Toast.makeText(MainActivity.this, "PCM Mode! Only Respiratory Rate Control Enabled!", Toast.LENGTH_LONG).show();
                                        }
                                    });
                                }
                            }
                            Thread.sleep(1000);


                        } catch (InterruptedException e) {
                            Log.i("Handshake Thread", "local Thread error", e);
                        }
                    }
                }
            //}
        };

        handshake.setPriority(Thread.MAX_PRIORITY);
        handshake.start();



        RespRate();
        TidVol();
        MaxPres();
        O2Con();


        // PCM Thread
        final PCMRun pcmRun = new PCMRun();
        Thread soundThread = new Thread(pcmRun);
        soundThread.start();

        setControl.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (MODE.equals("FSK")) {
                    //synchronized (lock) {
                        FSKinProg = true;
                        ENCODER_DATA_BUF = "{\n\t\"ventilator control\": [\n\t\t\"Respiration Rate\": \"" + respRate.getProgress()
                                + "\"\n\t\t\"Tidal Volume\": \"" + tidVol.getProgress()
                                + "\"\n\t\t\"Peak Pressure\": \"" + maxPres.getProgress()
                                + "\"\n\t\t\"O2 Concentration\": \"" + o2Con.getProgress()
                                + "\"\n\t]\n}\0";
                        respText.setText("Respiratory Rate : " + respRate.getProgress() + " / " + respRate.getMax());
                        tidText.setText("Tidal Volume : " + tidVol.getProgress() + " / " + tidVol.getMax());
                        presText.setText("Peak Pressure : " + maxPres.getProgress() + " / " + maxPres.getMax());
                        o2Text.setText("O2 Concentration : " + o2Con.getProgress() + " / " + o2Con.getMax());
                        //FSKinProg = false;
                        //lock.notifyAll();
                    //}
                }
                else {
                    Log.d("PCM", "PCM MODE");
                    pcmRun.setFreq_level(respRate.getProgress());
                }
            }
        });

        pcmButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                setFSKChar = false;
                //view1.setText("");
                //ENCODER_DATA_BUF = "Data Decode Test!";

            }
        });
        fskButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                setFSKChar = true;
                //view1.setText("");
                //ENCODER_DATA_BUF = "Data Decode Test!";

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

