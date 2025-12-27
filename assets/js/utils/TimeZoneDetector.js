class TimeZoneDetector {
    constructor() {
        this.timezone = null;
        this.offset = null;
        this.init();
    }

    init() {
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.offset = new Date().getTimezoneOffset();
    }

    getLocalNewYearTime(year) {
        const targetDate = new Date(year, 0, 1, 0, 0, 0, 0);
        return targetDate;
    }

    getCountdownToNewYear(year) {
        const now = new Date();
        const newYear = this.getLocalNewYearTime(year);
        const diff = newYear - now;

        if (diff < 0) {
            return { passed: true, milliseconds: 0 };
        }

        return {
            passed: false,
            milliseconds: diff,
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    }

    formatTimeZoneName() {
        const cityMap = {
            'Asia/Shanghai': '上海',
            'America/New_York': '纽约',
            'Europe/London': '伦敦',
            'Asia/Tokyo': '东京',
            'Asia/Seoul': '首尔',
            'Asia/Singapore': '新加坡',
            'Australia/Sydney': '悉尼',
            'America/Los_Angeles': '洛杉矶',
            'Europe/Paris': '巴黎',
            'Europe/Berlin': '柏林'
        };
        return cityMap[this.timezone] || this.timezone.split('/')[1] || this.timezone;
    }
}
