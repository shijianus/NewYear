import { THEMES } from '../config/themes.js';

class ThemeManager {
    constructor(calendarCalculator) {
        this.calculator = calendarCalculator;
        this.currentTheme = null;
        this.themes = THEMES;
    }

    applyTheme() {
        const mode = this.calculator.getCurrentMode();
        this.currentTheme = this.themes[mode];

        document.documentElement.style.setProperty('--primary-color', this.currentTheme.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', this.currentTheme.colors.secondary);
        document.documentElement.style.setProperty('--bg-color', this.currentTheme.colors.background);
        document.documentElement.style.setProperty('--text-color', this.currentTheme.colors.text);

        document.body.style.backgroundImage = `url('${this.currentTheme.background}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        this.updateCopywriting();

        return this.currentTheme;
    }

    updateCopywriting() {
        const copy = this.currentTheme.copywriting;

        const headerEl = document.getElementById('header-title');
        const footerEl = document.getElementById('footer-message');

        if (headerEl) headerEl.textContent = copy.header;
        if (footerEl) footerEl.textContent = copy.footer;
    }

    getRandomFireworkColor() {
        const colors = this.currentTheme.fireworkColors;
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getBGMPath() {
        return this.currentTheme.bgm;
    }

    hasSpecialEffect(effectName) {
        return this.currentTheme.specialEffects &&
               this.currentTheme.specialEffects.includes(effectName);
    }
}

export { ThemeManager };
