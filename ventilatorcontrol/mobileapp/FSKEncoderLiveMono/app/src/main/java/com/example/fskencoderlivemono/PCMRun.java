package com.example.fskencoderlivemono;
import android.widget.SeekBar;

class PCMRun implements Runnable {
    private int freq_level;

    public PCMRun() {
        this.freq_level = 0;
    }

    public void setFreq_level(int freq_level) {
        this.freq_level = freq_level;
    }

    public void run() {

        //final float frequency = 2500;
        // angular increment for each sample
        float angle = 0;
        AndroidAudioDevice device = new AndroidAudioDevice();
        float samples[] = new float[1024];
        while (true) {
            //Frequency range is [0-100] corresponding to frequencies 0 - ~4KHz
            /*float increment = (float) (2 * Math.PI) * this.freq_level * 215 / 44100;
            for (int i = 0; i < samples.length; i++) {
                samples[i] = (float) (Math.sin(angle));
                angle += increment;
            }*/
            //float increment = (float) (2 * Math.PI) * this.freq_level * 215 / 44100;
            int j = (int)this.freq_level/2;
            //int k = 50;
            int max = 100;
            int n = 0;
            for (int i = 0; i < samples.length; i++) {
                if(n++ < max/2)
                {
                    samples[i] = 1;
                }
                else
                {
                    samples[i] = 0;
                }
                if(n == max)
                {
                    n = 0;
                }

                //for(int j = 0; j<100; j++)
                /*
                if(j-- > 0)
                    samples[i] = 1;//(float) (Math.sin(angle));
                 else if(k-- > 0)
                 {
                     samples[i]= 0;

                 }
                 else if(k++ < (50-(int)this.freq_level/2))
                 {
                     samples[i]=0;
                     k = 50;
                     j= (int)this.freq_level/2;
                 }*/

                //angle += increment;
            }
            device.writeSamples(samples);
        }
    }
}