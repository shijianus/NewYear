class TimeZoneDetector {
    constructor() {
        this.timezone = null;
        this.offsetMinutes = null;
        this.init();
    }

    init() {
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.offsetMinutes = new Date().getTimezoneOffset();
    }

    getLocalNewYearTime(year) {
        return new Date(year, 0, 1, 0, 0, 0, 0);
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

    getOffsetLabel() {
        const totalMinutes = -this.offsetMinutes;
        const sign = totalMinutes >= 0 ? '+' : '-';
        const absMinutes = Math.abs(totalMinutes);
        const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
        const minutes = String(absMinutes % 60).padStart(2, '0');
        return `GMT${sign}${hours}:${minutes}`;
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
        return cityMap[this.timezone] || (this.timezone ? this.timezone.split('/')[1] : '未知地区');
    }

    getLocalMidnightString() {
        const target = this.getLocalNewYearTime(2026);
        return target.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

export { TimeZoneDetector };
