// --- 3D ROTATING VIBE PORTAL SCRIPT ---

const portal = document.getElementById('portal');
const sectionCount = document.querySelectorAll('.section').length;
const rotationAngle = 360 / sectionCount; // 90 degrees for 4 sections

let currentSection = 0;
let isScrolling = false; // Flag to prevent rapid scrolling/swiping

// --- 1. Navigation Function ---
function navigateToSection(direction) {
    if (isScrolling) return;

    let newSection = currentSection;

    if (direction === 'down' || direction === 'left') {
        newSection = (currentSection + 1) % sectionCount;
    } else if (direction === 'up' || direction === 'right') {
        newSection = (currentSection - 1 + sectionCount) % sectionCount;
    }

    if (newSection !== currentSection) {
        currentSection = newSection;
        isScrolling = true;

        // Calculate the required rotation based on the new index
        const rotationY = currentSection * -rotationAngle;
        portal.style.transform = `rotateY(${rotationY}deg)`;
        
        // Update a data attribute to control the text reveal in CSS
        portal.setAttribute('data-current-index', currentSection);

        // Remove the lock after the CSS transition completes (1.5s from CSS)
        setTimeout(() => {
            isScrolling = false;
        }, 1500); 
    }
}

// --- 2. Desktop (Mouse Wheel) Listener ---
window.addEventListener('wheel', (event) => {
    // Only proceed if not already scrolling
    if (isScrolling) return;
    
    // Determine scroll direction
    const direction = event.deltaY > 0 ? 'down' : 'up';

    navigateToSection(direction);

    // Prevent default scrolling to keep the 3D effect isolated
    event.preventDefault(); 
}, { passive: false });


// --- 3. Mobile (Touch/Swipe) Listeners ---
let touchStartY = 0;
let touchStartX = 0;

window.addEventListener('touchstart', (event) => {
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
}, { passive: true });

window.addEventListener('touchend', (event) => {
    if (isScrolling) return;

    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    // Check for a vertical swipe (Up/Down)
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
        const direction = deltaY > 0 ? 'down' : 'up';
        navigateToSection(direction);
    } 
    // Check for a horizontal swipe (Left/Right - Less common for this layout, but good to include)
    else if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'left' : 'right';
        navigateToSection(direction);
    }
}, { passive: true });


// Initial setup
navigateToSection(0);
