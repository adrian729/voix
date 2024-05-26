<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import { ref, watch } from 'vue';
import { useElementSize, useMouse, useMousePressed, useScroll, useWindowSize } from '@vueuse/core';
import { useKeyboard } from '@/composables/useKeyboard';

const { naturalNotes, alteredNotes, getOctave, setOctave, isPlaying } = useKeyboard();

const kbWrapper = ref<HTMLElement>();
const innerWrapper = ref<HTMLElement>();

const { width: innerWrapperWidth } = useElementSize(innerWrapper);
const { width: windowWidth } = useWindowSize();

const { x: scrollX } = useScroll(kbWrapper);
const { pressed, sourceType } = useMousePressed({ target: kbWrapper });
const { x: mouseX } = useMouse();
const lastX = ref<number>(0);

watch(
    () => mouseX.value,
    (newMouseX) => {
        if (pressed.value && sourceType.value === 'mouse')
            scrollX.value -= (newMouseX - lastX.value) * 3;
        lastX.value = newMouseX;
    },
);

function setScroll(octave: number) {
    if (!kbWrapper.value || !innerWrapperWidth.value)
        return;

    const keyWidth = innerWrapperWidth.value / 70;
    const init = windowWidth.value / 2 - 3.5 * keyWidth;

    scrollX.value = 7 * octave * keyWidth - init;
}

function onChangeOctave(octave: number) {
    setOctave(octave);
    setScroll(octave);
}
</script>

<template>
    <div
        ref="kbWrapper"
        class="no-scrollbar cursor-move overflow-hidden pb-4 text-slate-100/60 font-bold"
    >
        <div
            ref="innerWrapper"
            class="relative w-fit mx-auto flex flex-nowrap perspective"
        >
            <div
                v-for="({ note, octave }, idx) in naturalNotes"
                :key="`natural-${idx}`"
                :class="twMerge(
                    'relative select-none min-w-12 h-36 font-semibold bg-slate-50 border border-t-4 border-slate-950 rounded-b-md shadow shadow-slate-950 flex justify-center items-end',
                    isPlaying(note, octave) && 'rotated border-t-8',
                    getOctave() === octave && note === 'C' && 'text-slate-950/80 bg-slate-300',
                )"
            >
                <span>
                    {{ note }}<sup>{{ octave }}</sup>
                </span>
            </div>
            <div class="absolute w-full flex">
                <div
                    v-for="({ note, octave }, idx) in alteredNotes" :key="idx" :class="twMerge(
                        'select-none ml-6 min-w-6 h-24 bg-slate-700 border-4 border-t-4 border-slate-950 rounded-b-md shadow shadow-slate-950 flex justify-center items-end',
                        (note === 'F#' || note === 'C#') && 'ml-18',
                        idx === 0 && 'ml-9',
                        isPlaying(note, octave) && 'rotated border-t-8',
                    )"
                />
            </div>
        </div>
    </div>
    <div
        class="m-4 flex justify-center items-center gap-2"
    >
        <button
            class="border-2 border-slate-950 rounded px-4 py-2"
            type="button"
            @click="onChangeOctave(getOctave() - 1)"
        >
            Decrease Octave
        </button>
        <span>
            Octave: {{ getOctave() }}
        </span>
        <button
            class="border-2 border-slate-950 rounded px-4 py-2"
            type="button"
            @click="onChangeOctave(getOctave() + 1)"
        >
            Increase Octave
        </button>
    </div>
</template>

<style scoped>
.perspective {
    -webkit-perspective: 1000;
    perspective: 1000;
    transform-style: preserve-3d;
}

.rotated {
    transform-origin: top;
    transform: translateZ(-100px) rotate3d(1, 0, 0, 10deg);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
