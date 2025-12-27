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
                const response = await fetch(this.apiEndpoints[i], {
                    signal: AbortSignal.timeout(3000)
                });

                if (response.ok) {
                    const data = await response.json();
                    this.location = this.normalizeLocationData(data, i);
                    return this.location;
                }
            } catch (error) {
                console.warn(`API ${i} failed, trying next...`);
                continue;
            }
        }

        return this.fallbackLocation();
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
            'Asia/Shanghai': { country: '中国', city: '未知城市' },
            'America/New_York': { country: '美国', city: '未知城市' },
            'Europe/London': { country: '英国', city: '未知城市' }
        };

        return zoneToLocation[timezone] || { country: 'Unknown', city: 'Unknown' };
    }

    getGreetingText() {
        if (!this.location) return '';

        const { city, country } = this.location;

        if (city !== 'Unknown City' && city !== '未知城市') {
            return `Happy New Year from ${city}!`;
        } else {
            return `Happy New Year from ${country}!`;
        }
    }
}
