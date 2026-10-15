/** Thin wrapper around the Web Speech API speech synthesis, with feature detection. */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!ttsSupported()) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) {
    cachedVoices = now;
    return Promise.resolve(now);
  }
  return new Promise((resolve) => {
    const done = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

export function englishVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const rank = (v: SpeechSynthesisVoice) => (v.lang === 'en-GB' ? 0 : v.lang === 'en-US' ? 1 : 2) + (v.localService ? 0 : 0.5);
  return en.sort((a, b) => rank(a) - rank(b));
}

export function pickVoice(voiceURI: string): SpeechSynthesisVoice | undefined {
  const en = englishVoices(cachedVoices.length ? cachedVoices : ttsSupported() ? window.speechSynthesis.getVoices() : []);
  return en.find((v) => v.voiceURI === voiceURI) ?? en[0];
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string;
  onEnd?: () => void;
}

export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!ttsSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(opts.voiceURI ?? '');
  if (v) u.voice = v;
  u.lang = v?.lang ?? 'en-GB';
  u.rate = opts.rate ?? 0.95;
  if (opts.onEnd) {
    u.onend = opts.onEnd;
    u.onerror = opts.onEnd;
  }
  synth.speak(u);
  return true;
}

/** Speaks a list of texts one after another. Returns a cancel function. */
export function speakSequence(
  texts: string[],
  opts: SpeakOptions & { onIndex?: (i: number) => void; voiceFor?: (i: number) => string | undefined } = {},
): () => void {
  if (!ttsSupported()) return () => {};
  let cancelled = false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const all = englishVoices(cachedVoices.length ? cachedVoices : synth.getVoices());
  const playAt = (i: number) => {
    if (cancelled || i >= texts.length) {
      if (!cancelled) opts.onEnd?.();
      return;
    }
    opts.onIndex?.(i);
    const u = new SpeechSynthesisUtterance(texts[i]);
    const wanted = opts.voiceFor?.(i);
    const v = (wanted && all.find((x) => x.voiceURI === wanted)) || pickVoice(opts.voiceURI ?? '');
    if (v) u.voice = v;
    u.lang = v?.lang ?? 'en-GB';
    u.rate = opts.rate ?? 0.95;
    u.onend = () => playAt(i + 1);
    u.onerror = () => playAt(i + 1);
    synth.speak(u);
  };
  playAt(0);
  return () => {
    cancelled = true;
    synth.cancel();
  };
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

/** Speech recognition (optional capability). */
type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
};

export function getRecognition(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function recorderSupported(): boolean {
  return typeof window !== 'undefined' && 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia;
}
