import { ref } from 'vue';
import { useAudio } from './useAudio';

interface OscillatorModule {
    oscillator: OscillatorNode;
    gain: GainNode;
}
const oscillators = ref<Record<string, OscillatorModule>>({});

const easing = 0.05;

export function useOscillator() {
    const { audioContext, destination } = useAudio();

    function addOsc(id: string, frequency: number) {
        if (frequency < 20 || frequency > 20000)
            return;

        const { currentTime } = audioContext;

        const oscGain = audioContext.createGain();
        oscGain.gain.setValueAtTime(
            0.1,
            currentTime,
        );
        oscGain.connect(destination);

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, currentTime);
        oscillator.connect(oscGain);

        oscillator.start(currentTime);

        if (oscillators.value[id])
            removeOsc(id);

        oscillators.value[id] = {
            oscillator,
            gain: oscGain,
        };
    }

    function removeOsc(id: string) {
        if (!oscillators.value[id])
            return;

        const { currentTime } = audioContext;
        const { oscillator, gain: oscGain } = oscillators.value[id];

        oscGain.gain.setValueAtTime(
            oscGain.gain.value,
            currentTime,
        );
        oscGain.gain.exponentialRampToValueAtTime(
            0.0001,
            currentTime + easing,
        );

        setTimeout(() => {
            oscillator.stop();
            oscillator.disconnect();
            oscGain.disconnect();
        }, 500 + easing * 1000);

        delete oscillators.value[id];
    }

    return { addOsc, removeOsc };
}
