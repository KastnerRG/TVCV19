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
            //Frequency range is [0-100] corresponding to frequencies 0-9.5KHz
            float increment = (float) (2 * Math.PI) * this.freq_level * 100 / 44100;
            for (int i = 0; i < samples.length; i++) {
                samples[i] = (float) (Math.sin(angle));
                angle += increment;
            }
            device.writeSamples(samples);
        }
    }
}