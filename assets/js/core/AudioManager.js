class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.bgmNode = null;
        this.unlocked = false;
    }

    async init() {
        const audioFiles = {
            bgm_solar: 'assets/audio/bgm_solar.mp3',
            bgm_lunar: 'assets/audio/bgm_lunar.mp3',
            launch: 'assets/audio/launch.mp3',
            explosion_small: 'assets/audio/explosion_small.mp3',
            explosion_large: 'assets/audio/explosion_large.mp3',
            countdown_heartbeat: 'assets/audio/countdown_heartbeat.mp3',
            finale_boom: 'assets/audio/finale_boom.mp3'
        };

        for (let [key, path] of Object.entries(audioFiles)) {
            await this.loadSound(key, path);
        }
    }

    async loadSound(key, path) {
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            this.sounds[key] = arrayBuffer;
        } catch (error) {
            console.warn(`Failed to load sound: ${key}`, error);
        }
    }

    unlock(userInteraction = true) {
        if (this.unlocked) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.unlocked = true;

        console.log('Audio unlocked');
    }

    play(soundKey, volume = 1.0, loop = false) {
        if (!this.unlocked || !this.audioContext) return;
        if (!this.sounds[soundKey]) return;

        this.audioContext.decodeAudioData(
            this.sounds[soundKey].slice(0),
            (buffer) => {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();

                source.buffer = buffer;
                source.loop = loop;
                gainNode.gain.value = volume;

                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                source.start(0);

                if (soundKey.includes('bgm')) {
                    this.bgmNode = source;
                }
            }
        );
    }

    playBGM(themeMode) {
        const bgmKey = themeMode === 'SOLAR' ? 'bgm_solar' : 'bgm_lunar';
        this.play(bgmKey, 0.3, true);
    }

    stopBGM() {
        if (this.bgmNode) {
            this.bgmNode.stop();
            this.bgmNode = null;
        }
    }

    playRandomLaunch() {
        this.play('launch', 0.5);
    }
}

export { AudioManager };
