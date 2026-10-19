type AudioContextConstructor = typeof AudioContext;

let audioContext: AudioContext | null = null;

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  const scope = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? scope.webkitAudioContext;
}

/**
 * Crea o retoma el AudioContext. Debe llamarse desde un gesto del usuario
 * (clic o pointerdown) para que la política de autoplay no bloquee el tono.
 */
export function unlockAudio(): void {
  try {
    const Context = getAudioContextConstructor();
    if (!Context) {
      return;
    }
    audioContext ??= new Context();
    if (audioContext.state === 'suspended') {
      void audioContext.resume().catch(() => undefined);
    }
  } catch {
    // Sin audio disponible: el aviso queda solo en el badge.
  }
}

export function playAttentionTone(): void {
  try {
    if (!audioContext || audioContext.state !== 'running') {
      return;
    }
    const start = audioContext.currentTime;
    [880, 1175].forEach((frequency, index) => {
      const at = start + index * 0.18;
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.18, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
      oscillator.connect(gain).connect(audioContext!.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.16);
    });
  } catch {
    // El tono es un extra; si falla, no interrumpe nada.
  }
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notifyAttention(input: {
  sessionId: string;
  patientName: string;
  reason?: string | null;
}): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') {
    return;
  }
  try {
    new Notification(`Requiere atención: ${input.patientName}`, {
      body: input.reason || 'Una conversación necesita revisión.',
      tag: `attention-${input.sessionId}`,
    });
  } catch {
    // Algunos navegadores móviles solo permiten notificaciones desde un service worker.
  }
}
