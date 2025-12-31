const REGION_PRESETS = {
    CN: {
        banner: '来自中国的跨年夜 · 长街烟火与家书同路',
        wish: '愿你在龙蛇交汇的时刻里，有灯可点，有梦可追。',
        message: '中国观礼信号：当秒针抵达零点，先放一束纯红敬祖，再用金色流苏拖尾收官，寓意“开门见喜”。',
        palette: ['hsl(0, 100%, 55%)', 'hsl(35, 95%, 60%)', 'hsl(45, 100%, 50%)'],
        preferredShapes: ['circle', 'heart']
    },
    US: {
        banner: 'North America Midnight · Times Square vibes on standby',
        wish: 'Count the final seconds with courage, toast the new year with curiosity.',
        message: '北美定制信号：蓝紫色的脉冲代表“Ball Drop”，金色流星拖尾致敬海岸线的跨越。',
        palette: ['hsl(220, 95%, 65%)', 'hsl(300, 90%, 70%)', 'hsl(42, 100%, 55%)'],
        preferredShapes: ['circle', 'star']
    },
    GB: {
        banner: '伦敦午夜倒计时 · 泰晤士河畔的钟声同行',
        wish: '愿议会钟声敲定的每个愿望都坚定地落地。',
        message: '伦敦信号：选择蓝白红渐变，配合环形烟火，模拟摩天轮的缓慢旋转。',
        palette: ['hsl(220, 100%, 60%)', 'hsl(0, 100%, 55%)', 'hsl(0, 0%, 100%)'],
        preferredShapes: ['circle']
    },
    JP: {
        banner: '东京倒计时 · 凌晨前的初诣心愿',
        wish: '愿新年的一番风带来温柔与勇气。',
        message: '日本信号：采用樱花粉与靛蓝双层绽放，最后用心形表示“感謝”。',
        palette: ['hsl(330, 80%, 70%)', 'hsl(210, 80%, 60%)', 'hsl(50, 80%, 60%)'],
        preferredShapes: ['heart']
    },
    SG: {
        banner: '狮城跨年 · 海风与烟火交错的赤道夜',
        wish: '愿未来的每一步都如滨海湾灯光一样明亮。',
        message: '新加坡信号：青绿与金黄交替出现，象征雨林与金融之城的双重活力。',
        palette: ['hsl(165, 80%, 55%)', 'hsl(45, 90%, 55%)', 'hsl(200, 90%, 60%)'],
        preferredShapes: ['circle', 'star']
    },
    AU: {
        banner: '悉尼跨年进行时 · 帆影之间的第一声烟花',
        wish: '愿新年浪潮带来更高的勇气与更远的航线。',
        message: '澳洲信号：深蓝背景上抛出炙热橙黄，并追加星芒，向南十字星致意。',
        palette: ['hsl(210, 85%, 55%)', 'hsl(20, 90%, 60%)', 'hsl(55, 95%, 60%)'],
        preferredShapes: ['star']
    },
    BR: {
        banner: '里约热内卢跨年 · 白衣祈愿与海浪共鸣',
        wish: '愿热情永不停歇，愿梦想持续跃动。',
        message: '巴西信号：绿色与黄色交叠，再以白色波浪散开，象征科帕卡巴纳海滩的祝福。',
        palette: ['hsl(120, 70%, 55%)', 'hsl(45, 100%, 55%)', 'hsl(0, 0%, 95%)'],
        preferredShapes: ['circle', 'star']
    },
    FR: {
        banner: '巴黎的跨年夜 · 塞纳河静静映照灯火',
        wish: '愿你在新年的每个瞬间都活得优雅而真诚。',
        message: '法国信号：用香槟金和午夜蓝分层，在顶部加入心形虚线表达“Bisous”。',
        palette: ['hsl(45, 80%, 65%)', 'hsl(225, 60%, 45%)', 'hsl(0, 75%, 55%)'],
        preferredShapes: ['heart', 'circle']
    },
    AE: {
        banner: '迪拜跨年 · 沙漠和摩天塔共谱烟火歌',
        wish: '愿你在新一年稳稳站在自己的高塔之巅。',
        message: '中东信号：主打金色与孔雀蓝，配合自下而上的“喷泉式”爆炸方式。',
        palette: ['hsl(45, 90%, 55%)', 'hsl(185, 80%, 50%)', 'hsl(0, 0%, 95%)'],
        preferredShapes: ['circle', 'star']
    },
    DEFAULT: {
        banner: 'Welcome aboard the Project Epoch skyway',
        wish: 'Wherever you watch from, may the next chapter glow a little brighter.',
        message: '标准信号：以蓝紫色霓虹为基调，点缀随机的心形，象征共享的情绪。',
        palette: ['hsl(210, 90%, 60%)', 'hsl(280, 80%, 65%)', 'hsl(330, 85%, 60%)'],
        preferredShapes: ['circle', 'heart', 'star']
    }
};

class LocationService {
    constructor() {
        this.location = null;
        this.apiEndpoints = [
            'https://ipapi.co/json/',
            'https://ip-api.com/json/'
        ];
    }

    async detectLocation() {
        for (let i = 0; i < this.apiEndpoints.length; i++) {
            try {
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                let timeoutId = null;
                if (controller) {
                    timeoutId = setTimeout(() => controller.abort(), 3000);
                }

                const response = await fetch(this.apiEndpoints[i], {
                    signal: controller ? controller.signal : undefined
                });
                if (timeoutId) clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    this.location = this.normalizeLocationData(data, i);
                    return this.location;
                }
            } catch (error) {
                console.warn(`IP API ${i} failed`, error);
                continue;
            }
        }

        this.location = this.fallbackLocation();
        return this.location;
    }

    normalizeLocationData(data, apiIndex) {
        switch(apiIndex) {
            case 0:
                return {
                    country: data.country_name,
                    city: data.city,
                    countryCode: data.country_code
                };
            case 1:
                return {
                    country: data.country,
                    city: data.city,
                    countryCode: data.countryCode
                };
            default:
                return data;
        }
    }

    fallbackLocation() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const zoneToLocation = {
            'Asia/Shanghai': { country: '中国', city: '未知城市', countryCode: 'CN' },
            'America/New_York': { country: '美国', city: '未知城市', countryCode: 'US' },
            'Europe/London': { country: '英国', city: '未知城市', countryCode: 'GB' }
        };

        return zoneToLocation[timezone] || { country: 'Unknown', city: 'Unknown', countryCode: 'DEFAULT' };
    }

    getGreetingText() {
        if (!this.location) return REGION_PRESETS.DEFAULT.banner;
        return this.getRegionalPreset().banner;
    }

    getRegionalPreset() {
        if (!this.location) return REGION_PRESETS.DEFAULT;
        const code = (this.location.countryCode || 'DEFAULT').toUpperCase();
        return REGION_PRESETS[code] || REGION_PRESETS.DEFAULT;
    }

    getLocationLabel() {
        if (!this.location) return '未知星点';
        const parts = [this.location.city, this.location.country].filter(Boolean);
        return parts.length ? parts.join(' · ') : this.location.country || '未知星点';
    }
}

export { LocationService };
