import { onKeyDown, onKeyUp } from '@vueuse/core';
import { ref } from 'vue';
import { useOscillator } from './useOscillator';

// -- types
interface NoteInfo {
    note: typeof noteNames[number];
    octave: number;
}

type NoteName = `${NoteInfo['note']}${NoteInfo['octave']}`;

// -- consts
const NUM_OCTAVES = 10;
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteFreqs = [16.3515, 17.3239, 18.354, 19.4454, 20.6017, 21.8268, 23.1247, 24.4997, 25.9565, 27.5, 29.1352, 30.8677];

function getNoteFreq(note: string, octave: number): number | undefined {
    const noteIndex = noteNames.indexOf(note);
    if (noteIndex === -1)
        return undefined;

    return noteFreqs[noteIndex] * 2 ** octave;
}

const naturalNoteNames: typeof noteNames[number][] = noteNames.filter(name => name.length === 1);
const alteredNoteNames: typeof noteNames[number][] = noteNames.filter(name => name.length === 2);

const noteInfos: NoteInfo[] = Array.from({ length: NUM_OCTAVES }, (_, idx) => idx).flatMap(octave => getOctaveKeys(octave));
function getOctaveKeys(octave: number): NoteInfo[] {
    return noteNames.map<NoteInfo>(
        note => ({
            note,
            octave,
        }),
    );
}

const naturalNotes: NoteInfo[] = noteInfos.filter(({ note }) => naturalNoteNames.includes(note));
const alteredNotes: NoteInfo[] = noteInfos.filter(({ note }) => alteredNoteNames.includes(note));

export function useKeyboard() {
    const notesPlaying = ref<NoteName[]>([]);

    function addPlaying(noteName: NoteName) {
        if (notesPlaying.value.includes(noteName))
            return;

        notesPlaying.value.push(noteName);
    }

    function removePlaying(noteName: NoteName) {
        const index = notesPlaying.value.indexOf(noteName);
        if (index > -1)
            notesPlaying.value.splice(index, 1);
    }

    function isPlaying(note: string, octave: number): boolean {
        const noteName = getNoteName(note, octave);
        return notesPlaying.value.includes(noteName);
    }

    function getNoteName(note: string, octave: number): NoteName {
        return `${note}${octave}`;
    }

    const currentOctave = ref<number>(3);

    function setOctave(newOctave: number) {
        currentOctave.value = Math.min(Math.max(newOctave, 0), NUM_OCTAVES - 1);
        notesPlaying.value = [];
    }

    const { addOsc, removeOsc } = useOscillator();

    onKeyDown(true, ({ key }) => {
        const keyStrokeValue = key.toLowerCase();
        if (!notesPlaying.value)
            return;

        const noteInfo = getEventNote(keyStrokeValue);
        if (noteInfo === null)
            return;

        const { note, octave } = noteInfo;
        const freq = getNoteFreq(note, octave);
        if (!freq)
            return;

        const noteName = getNoteName(note, octave);
        addPlaying(noteName);
        addOsc(noteName, freq);
    }, { dedupe: true });

    onKeyUp(true, ({ key }) => {
        const keyStrokeValue = key.toLowerCase();
        if (!notesPlaying.value)
            return;

        const noteInfo = getEventNote(keyStrokeValue);
        if (noteInfo === null)
            return;

        const { note, octave } = noteInfo;
        const noteName = getNoteName(note, octave);

        removePlaying(noteName);
        removeOsc(noteName);
    }, { dedupe: true });

    function getEventNote(keyStrokeValue: string): NoteInfo | null {
        return getKeysMapping(keyStrokeValue) ?? getKeysMapping(keyStrokeValue, true);
    }

    const DEFAULT_NATURAL_KEYS_MAPPING = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    const DEFAULT_ALTERED_KEYS_MAPPING = ['w', 'e', 't', 'y', 'u', 'o', 'p'];

    function getKeysMapping(keyStrokeValue: string, isAltered: boolean = false): NoteInfo | null {
        let noteNames = naturalNoteNames;
        let keysMapping = DEFAULT_NATURAL_KEYS_MAPPING;

        if (isAltered) {
            noteNames = alteredNoteNames;
            keysMapping = DEFAULT_ALTERED_KEYS_MAPPING;
        }

        const index = keysMapping.indexOf(keyStrokeValue);
        if (index === -1)
            return null;

        const note = noteNames[index % noteNames.length];
        const octave = Math.floor(index / noteNames.length) + currentOctave.value;

        return { note, octave };
    }

    return {
        noteInfos,
        naturalNotes,
        alteredNotes,
        notesPlaying: () => notesPlaying.value,
        getOctave: () => currentOctave.value,
        setOctave,
        isPlaying,
    };
}
