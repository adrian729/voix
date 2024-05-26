import { ref } from 'vue';

interface AudioConfig {
    audioContext: AudioContext;
    gain: GainNode;
    destination: AudioNode;
}

const audio = ref<AudioConfig>();

export function useAudio() {
    function getAndInitAudio() {
        if (!audio.value) {
            const audioContext: AudioContext = new AudioContext({ sampleRate: 48000 });
            const gain = audioContext.createGain();
            gain.connect(audioContext.destination);

            audio.value = {
                audioContext,
                gain,
                destination: gain,
            };
        }

        return audio.value;
    }

    const { audioContext, gain, destination } = getAndInitAudio();

    return { audioContext, gain, destination };
}
