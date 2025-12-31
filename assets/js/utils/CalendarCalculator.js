class CalendarCalculator {
    constructor() {
        this.solarStartDate = new Date(2025, 11, 24);
        this.solarEndDate = new Date(2026, 0, 15);
        this.lunarNewYear2026 = new Date(2026, 1, 17, 0, 0, 0);
        this.lunarEndDate = new Date(2026, 2, 5);
    }

    getCurrentMode() {
        const now = new Date();

        if (now >= this.solarStartDate && now <= this.solarEndDate) {
            return 'SOLAR';
        }

        if (now > this.solarEndDate && now <= this.lunarEndDate) {
            return 'LUNAR';
        }

        return 'SOLAR';
    }

    getTargetNewYearDate() {
        const mode = this.getCurrentMode();
        return mode === 'SOLAR'
            ? new Date(2026, 0, 1, 0, 0, 0, 0)
            : this.lunarNewYear2026;
    }

    shouldShowCountdown() {
        const now = new Date();
        return now < this.getTargetNewYearDate();
    }

    getSeasonDescription() {
        const mode = this.getCurrentMode();
        if (mode === 'SOLAR') {
            return '全球元旦 · 科技蓝调';
        }
        return '金蛇春节 · 烟火团圆';
    }
}

export { CalendarCalculator };
