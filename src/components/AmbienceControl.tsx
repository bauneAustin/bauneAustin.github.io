import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

const BPM = 90; // bumped up for more upbeat energy
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// C major pentatonic — brighter, happier than minor
const MELODY_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

// Bass notes in C major — lighter, higher octave (C3, G3, A3, E3)
const BASS_NOTES = [130.81, 164.81, 174.61, 196.00];

// ── Audio helpers ─────────────────────────────────────────────────────────────

function createReverb(ctx: AudioContext, duration = 1.4): ConvolverNode {
    const convolver = ctx.createConvolver();
    const len = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
    convolver.buffer = buf;
    return convolver;
}

function createLowpass(ctx: AudioContext, freq: number): BiquadFilterNode {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = freq;
    f.Q.value = 0.7;
    return f;
}

// Kick: punchier but not too heavy
function scheduleKick(ctx: AudioContext, dest: AudioNode, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.connect(gain); gain.connect(dest);
    osc.start(t); osc.stop(t + 0.3);
}

// Snare: snappier and brighter
function scheduleSnare(ctx: AudioContext, dest: AudioNode, t: number) {
    const bufLen = ctx.sampleRate * 0.14;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000; // brighter than before
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    src.connect(filter); filter.connect(gain); gain.connect(dest);
    src.start(t); src.stop(t + 0.15);
}

// Hi-hat: slightly more present for upbeat feel
function scheduleHat(ctx: AudioContext, dest: AudioNode, t: number, open = false) {
    const bufLen = ctx.sampleRate * (open ? 0.1 : 0.035);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 9000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.16 : 0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + bufLen / ctx.sampleRate);

    src.connect(filter); filter.connect(gain); gain.connect(dest);
    src.start(t); src.stop(t + bufLen / ctx.sampleRate + 0.01);
}

// Light plucky bass: triangle wave (warmer/softer than sawtooth), higher octave, quieter
function scheduleBass(ctx: AudioContext, dest: AudioNode, t: number, freq: number, dur: number) {
    const osc = ctx.createOscillator();
    const filter = createLowpass(ctx, 500); // more open filter = less muddy
    const gain = ctx.createGain();
    osc.type = 'triangle'; // much softer than sawtooth
    osc.frequency.setValueAtTime(freq, t);
    // Plucky envelope: fast attack, medium decay — bouncy not sustained
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02); // lighter peak gain
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.6); // shorter sustain = pluckier
    osc.connect(filter); filter.connect(gain); gain.connect(dest);
    osc.start(t); osc.stop(t + dur + 0.01);
}

// Bright jazzy chime: major intervals (root + maj3rd + 5th) for happy colour
function scheduleChime(ctx: AudioContext, dest: AudioNode, t: number, freq: number) {
    [1, 1.25, 1.5].forEach((ratio, i) => { // major triad intervals
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * ratio, t);
        const pk = i === 0 ? 0.04 : 0.016;
        const attack = 0.04 + Math.random() * 0.05;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(pk, t + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8); // shorter decay = perkier
        osc.connect(gain); gain.connect(dest);
        osc.start(t); osc.stop(t + 2.9);
    });
}

// Occasional fun "boing" accent: a pitch-swept sine for playfulness
function scheduleBoing(ctx: AudioContext, dest: AudioNode, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.3);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain); gain.connect(dest);
    osc.start(t); osc.stop(t + 0.36);
}

// Light vinyl crackle
function scheduleVinyl(ctx: AudioContext, dest: AudioNode, t: number) {
    const bufLen = Math.floor(ctx.sampleRate * BAR);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        data[i] = Math.random() < 0.001 ? (Math.random() * 2 - 1) * 0.12 : 0;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = createLowpass(ctx, 6000);
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    src.connect(filter); filter.connect(gain); gain.connect(dest);
    src.start(t); src.stop(t + BAR + 0.05);
}

// ── Bar scheduler ─────────────────────────────────────────────────────────────

function scheduleBar(ctx: AudioContext, reverb: ConvolverNode, t: number) {
    const dry = ctx.destination;

    // Kick: beats 1 and 3
    scheduleKick(ctx, dry, t);
    scheduleKick(ctx, dry, t + BEAT * 2);

    // Snare: beats 2 and 4
    scheduleSnare(ctx, dry, t + BEAT);
    scheduleSnare(ctx, dry, t + BEAT * 3);

    // Hi-hats: sixteenth notes for more upbeat energy, open on upbeats
    for (let i = 0; i < 16; i++) {
        const ht = t + i * BEAT * 0.25;
        const open = i === 4 || i === 12;
        // Skip some 16ths randomly for a human feel
        if (i % 2 === 0 || Math.random() < 0.65) {
            scheduleHat(ctx, dry, ht, open);
        }
    }

    // Plucky bass: 3-4 notes per bar for a bouncy feel
    const bassPattern = [0, 0.75, 2, 2.75].filter(() => Math.random() < 0.8);
    bassPattern.forEach(beat => {
        const freq = BASS_NOTES[Math.floor(Math.random() * BASS_NOTES.length)];
        scheduleBass(ctx, dry, t + BEAT * beat, freq, BEAT * 0.55);
    });

    // Chime melody: more notes, landing on both beats and off-beats
    const chimeBeats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].filter(() => Math.random() < 0.4);
    chimeBeats.forEach(beat => {
        const freq = MELODY_SCALE[Math.floor(Math.random() * MELODY_SCALE.length)];
        scheduleChime(ctx, reverb, t + BEAT * beat, freq);
    });

    // Fun boing accent: ~once every 2 bars, on a random upbeat
    if (Math.random() < 0.45) {
        const boingBeat = [0.5, 1.5, 2.5, 3.5][Math.floor(Math.random() * 4)];
        scheduleBoing(ctx, dry, t + BEAT * boingBeat);
    }

    // Light vinyl crackle
    scheduleVinyl(ctx, dry, t);
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AmbienceControl: FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const reverbRef = useRef<ConvolverNode | null>(null);
    const schedulerRef = useRef<number | null>(null);
    const nextBarRef = useRef<number>(0);

    const tick = (ctx: AudioContext, reverb: ConvolverNode) => {
        const lookahead = BAR * 1.5;
        while (nextBarRef.current < ctx.currentTime + lookahead) {
            scheduleBar(ctx, reverb, nextBarRef.current);
            nextBarRef.current += BAR;
        }
        schedulerRef.current = window.setTimeout(() => tick(ctx, reverb), (BAR * 0.5) * 1000);
    };

    useEffect(() => {
        if (isPlaying) {
            if (!audioCtxRef.current) {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioCtxRef.current = ctx;
                const reverb = createReverb(ctx);
                reverb.connect(ctx.destination);
                reverbRef.current = reverb;
            }
            const ctx = audioCtxRef.current;
            const reverb = reverbRef.current!;
            if (ctx.state === 'suspended') ctx.resume();
            nextBarRef.current = ctx.currentTime + 0.1;
            tick(ctx, reverb);
        } else {
            if (schedulerRef.current) {
                window.clearTimeout(schedulerRef.current);
                schedulerRef.current = null;
            }
        }
        return () => {
            if (schedulerRef.current) window.clearTimeout(schedulerRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="ambiance-control" title="Toggle lofi beats">
            <button
                className={`ambiance-button ${isPlaying ? 'ambiance-button--playing' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                    backgroundColor: isPlaying ? 'var(--sage-accent)' : 'var(--panel-bg)',
                    color: isPlaying ? '#ffffff' : 'var(--text-main)',
                }}
            >
                {isPlaying ? '🎵' : '🔇'}
            </button>

            <style>{`
        .ambiance-button--playing {
          animation: lofi-pulse ${(BEAT * 2).toFixed(2)}s ease-in-out infinite;
        }
        @keyframes lofi-pulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(var(--sage-accent-rgb, 130,160,130), 0.5); }
          50%       { box-shadow: 0 0 0 10px rgba(var(--sage-accent-rgb, 130,160,130), 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambiance-button--playing { animation: none; }
        }
      `}</style>
        </div>
    );
};;;;
