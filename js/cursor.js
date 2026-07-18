/* ==========================================================================
   CURSOR.JS - Coordinates Custom Cursor Pointer and text overlays
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    const cursorTrail = document.getElementById('custom-cursor-trail');
    
    if (!cursor || !cursorTrail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    // Smooth trail speed multiplier (0.1 = slow/smooth, 0.3 = fast)
    const lerpSpeed = 0.18;
    let isHovering = false;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor if hidden (first movement)
        if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
            cursor.style.opacity = '1';
            cursorTrail.style.opacity = '1';
        }
        
        // Instant position updates for the inner pointer
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
    });

    // Animate the cursor trail ring with slight lag
    function animateCursorTrail() {
        // Linear interpolation equation
        trailX += (mouseX - trailX) * lerpSpeed;
        trailY += (mouseY - trailY) * lerpSpeed;
        
        cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate3d(-50%, -50%, 0)`;
        
        requestAnimationFrame(animateCursorTrail);
    }
    requestAnimationFrame(animateCursorTrail);

    // Hide custom cursor when mouse leaves window viewport
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
        cursorTrail.classList.add('hidden');
    });

    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('hidden');
        cursorTrail.classList.remove('hidden');
    });

    // Context-aware text/scaling overrides via Event Delegation
    document.addEventListener('mouseover', (e) => {

    const skill = e.target.closest('.skill-name');

    if(skill){

        const icon = skill.dataset.icon;

        cursorTrail.classList.add('expanded');

        cursor.classList.add('active');

        cursorTrail.innerHTML = `<i class="${icon}" style="font-size:3rem;color:white;"></i>`;

        return;

    }

    const hoverTarget = e.target.closest('[data-cursor-text]');
    const isClickable = e.target.closest('a, button, input, textarea, select, .btn-project, .close-modal');

    if (hoverTarget) {

        const labelText = hoverTarget.getAttribute('data-cursor-text');

        cursorTrail.classList.add('expanded');

        cursorTrail.innerHTML = `<span class="cursor-inner-text">${labelText}</span>`;

        cursor.classList.add('active');

    }

    else if (isClickable) {

        cursorTrail.classList.add('clickable');

        cursor.classList.add('active');

    }

});

    document.addEventListener('mouseout', (e) => {

    const skill = e.target.closest('.skill-name');

    if(skill && !e.relatedTarget?.closest('.skill-name')){

        cursorTrail.classList.remove('expanded');

        cursorTrail.innerHTML = "";

        cursor.classList.remove('active');

        return;

    }

    const hoverTarget = e.target.closest('[data-cursor-text]');
const isClickable = e.target.closest(
    'a, button, input, textarea, select, .btn-project, .close-modal'
);

if (hoverTarget && !e.relatedTarget?.closest('[data-cursor-text]')) {

    cursorTrail.classList.remove('expanded');

    cursorTrail.innerHTML = '';

    cursor.classList.remove('active');

}

else if (
    isClickable &&
    !e.relatedTarget?.closest(
        'a, button, input, textarea, select, .btn-project, .close-modal'
    )
) {

    cursorTrail.classList.remove('clickable');

    cursor.classList.remove('active');

}

});
});
