class CalendarCalculator {
    constructor() {
        this.lunarNewYear2026 = new Date(2026, 1, 17);
        this.solarEndDate = new Date(2026, 0, 15);
        this.lunarEndDate = new Date(2026, 2, 5);
    }

    getCurrentMode() {
        const now = new Date();

        if (now <= this.solarEndDate) {
            return 'SOLAR';
        } else if (now > this.solarEndDate && now <= this.lunarEndDate) {
            return 'LUNAR';
        } else {
            return 'SOLAR';
        }
    }

    getTargetNewYearDate() {
        const mode = this.getCurrentMode();

        if (mode === 'SOLAR') {
            return new Date(2026, 0, 1, 0, 0, 0, 0);
        } else {
            return this.lunarNewYear2026;
        }
    }

    shouldShowCountdown() {
        const target = this.getTargetNewYearDate();
        const now = new Date();
        return now < target;
    }
}
