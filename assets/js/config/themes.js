const THEMES = {
    SOLAR: {
        name: 'solar',
        colors: {
            primary: '#00D4FF',
            secondary: '#9D4EDD',
            background: '#0A0E1A',
            text: '#FFFFFF'
        },
        background: 'assets/images/bg_solar.jpg',
        bgm: 'assets/audio/bgm_solar.mp3',
        copywriting: {
            header: '2026，很高兴遇见你',
            footer: '愿去年的遗憾，都是今年惊喜的铺垫。祝你永远热泪盈眶，永远向阳而生。',
            waiting: '正在点亮星空...'
        },
        fireworkColors: [
            'hsl(200, 100%, 60%)',
            'hsl(280, 100%, 70%)',
            'hsl(180, 100%, 50%)',
            'hsl(330, 100%, 60%)'
        ]
    },

    LUNAR: {
        name: 'lunar',
        colors: {
            primary: '#FF3B3B',
            secondary: '#FFD700',
            background: '#1A0B0B',
            text: '#FFF5E6'
        },
        background: 'assets/images/bg_lunar.jpg',
        bgm: 'assets/audio/bgm_lunar.mp3',
        copywriting: {
            header: '金蛇纳福 · 岁岁平安',
            footer: '灯火可亲，家人闲坐。愿新的一年，所求皆如愿，所行皆坦途。',
            waiting: '静候佳节'
        },
        fireworkColors: [
            'hsl(0, 100%, 50%)',
            'hsl(45, 100%, 50%)',
            'hsl(30, 100%, 60%)',
            'hsl(350, 100%, 65%)'
        ],
        specialEffects: ['ironFlower']
    }
};

export { THEMES };
