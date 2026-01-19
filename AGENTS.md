# AGENTS.md

This file contains guidelines for agents working on this project.

## Project Overview
Static HTML/CSS/JavaScript fireworks celebration platform with dual-calendar support, timezone detection, and particle effects.

## Build & Run Commands

### Local Development
```bash
# Start development server
bash start.sh

# Or manually with Python
python -m http.server 8000

# Or with Node.js
npx http-server
```

Access:
- Main: http://localhost:8000/index.html
- Firecracker: http://localhost:8000/firecracker.html
- Wallpaper: http://localhost:8000/wallpaper.html

### Testing & Validation
```bash
# Check project structure
bash check-project.sh

# Preview deployment
bash preview.sh

# Test deployment
bash test-deployment.sh

# Final pre-deployment check
bash final-check.sh
```

### Deployment
```bash
# Deploy to Cloudflare Pages
bash deploy-github.sh
```

**No unit tests** - This is a static project with no test framework. Manual testing in browser is expected.

## Code Style Guidelines

### JavaScript

#### File Structure
- `js/script.js` - Main monolithic file for fireworks (~2200+ lines)
- `assets/js/` - Modular ES6 code for new features
  - `core/` - Core modules (FireworkEngine, ParticleSystem, AudioManager, ThemeManager)
  - `utils/` - Utilities (TimeZoneDetector, CalendarCalculator, LocationService)
  - `config/` - Constants and themes

#### Imports & Modules
```javascript
// ES6 modules in assets/js/ directory
import { ModuleName } from './path/to/Module.js';
export default ClassName;
export { namedFunction };

// Traditional patterns in js/script.js
const ModuleName = { ... };
function functionName() { ... }
```

#### Formatting
- Use `'use strict'` at the top of main JS files
- Tab indentation (4 spaces/tabs)
- Spaces around operators: `a = b + c`
- No trailing whitespace
- Max line length: ~120 characters

#### Naming Conventions
- Constants: `UPPER_SNAKE_CASE` - `const IS_MOBILE = true;`
- Classes: `PascalCase` - `class FireworkEngine { ... }`
- Functions/Methods: `camelCase` - `function launchShell() { ... }`
- Variables: `camelCase` - `const starCount = 100;`
- Private methods: `_camelCase` - `_updateInternal()`
- Event handlers: `handle[Event]` - `handlePointerStart()`

#### Types & Data Structures
```javascript
// Classes for complex entities
class Shell {
  constructor(options) {
    Object.assign(this, options);
  }
}

// Objects for configuration
const config = {
  quality: 'normal',
  shell: 'Random'
};

// Arrays for particle systems
const stars = Array.from({ length: 250 }, () => new Star());
```

#### Error Handling
```javascript
// Use try-catch for async operations
try {
  await this.audioManager.init();
} catch (error) {
  console.warn('Initialization warning', error);
}

// Graceful degradation
if (!featureAvailable) {
  fallbackMethod();
}
```

#### Canvas & Rendering
```javascript
// Canvas context setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Animation loop using requestAnimationFrame
function animate() {
  ctx.clearRect(0, 0, width, height);
  // Draw here
  requestAnimationFrame(animate);
}
animate();
```

#### Event Handling
```javascript
// Pointer events for touch/mouse
canvas.addEventListener('pointerstart', handleStart);
canvas.addEventListener('pointermove', handleMove);
canvas.addEventListener('pointerend', handleEnd);

// Once-only listeners
button.addEventListener('click', handler, { once: true });

// Passive event listeners for performance
canvas.addEventListener('touchstart', handler, { passive: true });
```

#### State Management
```javascript
// Simple store pattern (from js/script.js)
const store = {
  state: { paused: true, config: { ... } },
  setState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this._dispatch(this.state);
  },
  subscribe(listener) { ... }
};
```

### HTML & CSS

#### HTML Structure
- Use semantic tags: `<canvas>`, `<div class="container">`
- Inline scripts for small files: `<script>...</script>`
- Module scripts for large files: `<script type="module" src="..."></script>`
- Meta tags for mobile: `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">`

#### CSS Patterns
- Reset styles: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- Absolute positioning for layered effects: `position: absolute; top: 0; left: 0;`
- Z-index layering: background < particles < controls < UI
- CSS animations: `@keyframes ripple { ... }`
- Responsive design: `@media (max-width: 640px) { ... }`

#### Color Constants
```javascript
const COLOR = {
  Red: '#ff0043',
  Green: '#14fc56',
  Blue: '#1e7fff',
  Purple: '#e60aff',
  Gold: '#ffbf36',
  White: '#ffffff'
};
```

## Performance Guidelines

### Canvas Optimization
- Use multiple canvases for layers (trails, main, particles)
- Batch similar draw operations by color
- Limit particle counts based on quality settings
- Use `requestAnimationFrame` for animations
- Clear only necessary areas when possible

### Memory Management
- Object pooling for particles (Star.add(), Star.returnInstance())
- Remove off-screen or dead particles
- Use arrays instead of objects where possible

### Mobile Considerations
- Check device type: `const IS_MOBILE = window.innerWidth <= 640;`
- Adjust quality based on device capability
- Support touch events with `pointer` events API
- Passive listeners for scroll blocking prevention

## Localization

This project supports Chinese (zh-CN) as the primary language. All UI text and comments should be in Chinese where appropriate.

## Assets Management

### Audio (assets/audio/)
- 7 MP3 files: BGM, launch, explosions, countdown
- Preload before use
- Use Web Audio API for playback

### Images (assets/images/)
- Background images for solar/lunar themes
- Favicon
- Maximize compression while maintaining quality

### Fonts (assets/fonts/)
- Custom WOFF2 fonts
- Load via CSS @font-face

## Deployment Notes

- Static site hosted on Cloudflare Pages
- No build step required
- Configure caching in `_headers` file
- Configure redirects in `_redirects` file
- Ensure proper MIME types for audio/video files

## Git Workflow

- No automatic linting or testing in CI
- Manual testing required before commits
- Deploy via shell scripts
- Check file structure before deploying

## Browser Compatibility

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Use standard Canvas API (avoid experimental features)
- Provide graceful fallbacks for unsupported features
- Test on both desktop and mobile devices
