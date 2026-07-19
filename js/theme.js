/* ==========================================================================
   THEME.JS - Handles Light/Dark Theme Switches and Dynamic Backgrounds
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const backdropContainer = document.getElementById('theme-backdrop');
    
    // Default to dark theme if not set
    let activeTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply current theme settings
    applyTheme(activeTheme);

    // Click handler for theme toggle button
    themeToggleBtn.addEventListener('click', () => {
        activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(activeTheme);
        localStorage.setItem('theme', activeTheme);
    });

    /**
     * Set html attributes, toggle button states, and spawn new decorative background elements.
     * @param {string} theme - 'light' | 'dark'
     */
    function updateFavicon(theme) {

    const favicon = document.getElementById("favicon");

    if (!favicon) return;

    favicon.href = theme === "dark"
        ? "images/anandu-light.png"
        : "images/anandu-dark.png";

}

function applyTheme(theme) {

    htmlElement.setAttribute('data-theme', theme);

    updateFavicon(theme);

    const character = document.getElementById("character");

    if(character){

        character.src = theme === "dark"
            ? "images/character-night.png"
            : "images/character-day.png";

    }

    generateBackdropDecorations(theme);

}

    /**
     * Spawns matching ambient graphic shapes into backdrop container.
     * @param {string} theme - 'light' | 'dark'
     */
    function generateBackdropDecorations(theme) {
        // Clear old elements
        backdropContainer.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        
        if (theme === 'light') {
            // --- DAY STATE DECORATIONS ---
            
            // 1. Spawning Day Clouds (Drifting horizontally)
            const cloudCount = 4;
            for (let i = 0; i < cloudCount; i++) {
                const cloud = createSVGElement('svg', 'backdrop-svg-element day-cloud');
                cloud.setAttribute('viewBox', '0 0 120 50');
                cloud.style.width = `${Math.random() * 80 + 80}px`;
                cloud.style.top = `${Math.random() * 30 + 5}vh`;
                cloud.style.animationDelay = `${i * -10}s`;
                cloud.style.animationDuration = `${Math.random() * 20 + 25}s`;
                
                cloud.innerHTML = `
                    <path d="M 20 30 A 15 15 0 0 1 50 15 A 25 25 0 0 1 90 20 A 15 15 0 0 1 110 30 A 10 10 0 0 1 120 40 L 10 40 A 10 10 0 0 1 20 30 Z" />
                `;
                fragment.appendChild(cloud);
            }

            // 2. Spawning Day Birds (Flying horizontally)
            const birdCount = 3;
            for (let i = 0; i < birdCount; i++) {
                const bird = createSVGElement('svg', 'backdrop-svg-element day-bird');
                bird.setAttribute('viewBox', '0 0 30 20');
                bird.style.width = `${Math.random() * 15 + 15}px`;
                bird.style.animationDelay = `${i * -6}s`;
                bird.style.animationDuration = `${Math.random() * 8 + 14}s`;
                
                bird.innerHTML = `
                    <path d="M 2 10 Q 8 2 15 10 Q 22 2 28 10 Q 15 14 2 10 Z" />
                `;
                fragment.appendChild(bird);
            }

            // 3. Spawning Day Floating Leaves (Drifting downward)
            const leafCount = 8;
            for (let i = 0; i < leafCount; i++) {
                const leaf = createSVGElement('svg', 'backdrop-svg-element day-leaf');
                leaf.setAttribute('viewBox', '0 0 20 20');
                leaf.style.width = `${Math.random() * 10 + 12}px`;
                leaf.style.left = `${Math.random() * 85 + 5}vw`;
                leaf.style.animationDelay = `${Math.random() * -15}s`;
                leaf.style.animationDuration = `${Math.random() * 8 + 12}s`;
                
                leaf.innerHTML = `
                    <path d="M 10 0 C 18 5, 18 15, 10 20 C 2 15, 2 5, 10 0 Z" />
                `;
                fragment.appendChild(leaf);
            }

            // 4. Spawning Spin Flowers (Stationary background coordinates)
            const flowerCount = 5;
            for (let i = 0; i < flowerCount; i++) {
                const flower = createSVGElement('svg', 'backdrop-svg-element day-flower');
                flower.setAttribute('viewBox', '0 0 100 100');
                const size = Math.random() * 60 + 50;
                flower.style.width = `${size}px`;
                flower.style.height = `${size}px`;
                flower.style.left = `${Math.random() * 85 + 5}vw`;
                flower.style.top = `${Math.random() * 80 + 10}vh`;
                flower.style.animationDuration = `${Math.random() * 15 + 20}s`;
                
                flower.innerHTML = `
                    <!-- Center Circle -->
                    <circle cx="50" cy="50" r="12" />
                    <!-- Petals -->
                    <circle cx="50" cy="22" r="16" />
                    <circle cx="50" cy="78" r="16" />
                    <circle cx="22" cy="50" r="16" />
                    <circle cx="78" cy="50" r="16" />
                `;
                fragment.appendChild(flower);
            }
            
        } else {
            // --- NIGHT STATE DECORATIONS ---
            
            // 1. Spawning Night Twinkling Stars
            const starCount = 35;
            for (let i = 0; i < starCount; i++) {
                const star = createSVGElement('svg', 'backdrop-svg-element night-star');
                star.setAttribute('viewBox', '0 0 20 20');
                const size = Math.random() * 6 + 4;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${Math.random() * 95}vw`;
                star.style.top = `${Math.random() * 95}vh`;
                star.style.animationDelay = `${Math.random() * -10}s`;
                star.style.animationDuration = `${Math.random() * 3 + 2}s`;
                
                star.innerHTML = `
                    <path d="M 10 0 L 13 7 L 20 10 L 13 13 L 10 20 L 7 13 L 0 10 L 7 7 Z" />
                `;
                fragment.appendChild(star);
            }

            // 2. Spawning Night Fireflies (Drifting in random paths)
            const fireflyCount = 12;
            for (let i = 0; i < fireflyCount; i++) {
                const firefly = createSVGElement('svg', 'backdrop-svg-element night-firefly');
                firefly.setAttribute('viewBox', '0 0 10 10');
                const size = Math.random() * 4 + 4;
                firefly.style.width = `${size}px`;
                firefly.style.height = `${size}px`;
                firefly.style.left = `${Math.random() * 90 + 5}vw`;
                firefly.style.top = `${Math.random() * 85 + 10}vh`;
                firefly.style.animationDelay = `${Math.random() * -8}s`;
                firefly.style.animationDuration = `${Math.random() * 6 + 8}s`;
                
                firefly.innerHTML = `
                    <circle cx="5" cy="5" r="4" />
                `;
                fragment.appendChild(firefly);
            }

            // 3. Spawning Night Bats (Swooping curves)
            const batCount = 3;
            for (let i = 0; i < batCount; i++) {
                const bat = createSVGElement('svg', 'backdrop-svg-element night-bat');
                bat.setAttribute('viewBox', '0 0 50 30');
                bat.style.width = `${Math.random() * 20 + 20}px`;
                bat.style.animationDelay = `${i * -4.5}s`;
                bat.style.animationDuration = `${Math.random() * 6 + 10}s`;
                
                bat.innerHTML = `
                    <path d="M 25 10 C 20 2, 17 6, 12 2 C 7 6, 2 6, 0 10 C 2 18, 12 28, 25 28 C 38 28, 48 18, 50 10 C 48 6, 43 6, 38 2 C 33 6, 30 2, 25 10 Z" />
                `;
                fragment.appendChild(bat);
            }
        }
        
        backdropContainer.appendChild(fragment);
    }

    /**
     * Helper to instantiate correct namespace SVG elements
     */
    function createSVGElement(tag, classList) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        el.setAttribute('class', classList);
        return el;
    }
});
