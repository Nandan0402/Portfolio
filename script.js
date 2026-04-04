// ═══════════════════════════════════════════════════════
//  🔥 FIRE LEGEND — Ember Particle Background Engine
// ═══════════════════════════════════════════════════════

(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const EMBER_COUNT = 120;
    const embers = [];

    const fireColors = [
        { r: 255, g: 80, b: 0 },   // deep orange
        { r: 255, g: 140, b: 0 },   // orange
        { r: 255, g: 200, b: 0 },   // gold
        { r: 255, g: 50, b: 0 },   // red-orange
        { r: 255, g: 230, b: 80 },   // bright yellow
    ];

    function randomColor() {
        return fireColors[Math.floor(Math.random() * fireColors.length)];
    }

    function spawnEmber() {
        const c = randomColor();
        return {
            x: Math.random() * W,
            y: H + Math.random() * 60,
            r: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 2 + 1.2),
            alpha: Math.random() * 0.6 + 0.3,
            fade: Math.random() * 0.005 + 0.003,
            color: c,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.04 + 0.01,
        };
    }

    for (let i = 0; i < EMBER_COUNT; i++) {
        const e = spawnEmber();
        e.y = Math.random() * H; // scatter on load
        embers.push(e);
    }

    function drawEmber(e) {
        ctx.save();
        const { r, g, b } = e.color;

        // Outer glow
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${e.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${e.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core bright spark
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${e.alpha * 0.9})`;
        ctx.fill();
        ctx.restore();
    }

    // Smoke/heat shimmer particles
    const smokeParticles = [];
    for (let i = 0; i < 30; i++) {
        smokeParticles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 50 + 20,
            alpha: Math.random() * 0.04 + 0.01,
            vy: -(Math.random() * 0.3 + 0.1),
            vx: (Math.random() - 0.5) * 0.2,
        });
    }

    let frame = 0;
    function loop() {
        ctx.clearRect(0, 0, W, H);

        // Dark background gradient
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0a0000');
        bg.addColorStop(0.6, '#120400');
        bg.addColorStop(1, '#1a0800');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Bottom fire base glow
        const fireBase = ctx.createLinearGradient(0, H * 0.7, 0, H);
        fireBase.addColorStop(0, 'rgba(0,0,0,0)');
        fireBase.addColorStop(0.5, 'rgba(255,60,0,0.06)');
        fireBase.addColorStop(1, 'rgba(255,100,0,0.15)');
        ctx.fillStyle = fireBase;
        ctx.fillRect(0, H * 0.7, W, H * 0.3);

        // Smoke
        smokeParticles.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            if (s.y + s.r < 0) { s.y = H + s.r; s.x = Math.random() * W; }
            const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
            sg.addColorStop(0, `rgba(80,30,10,${s.alpha})`);
            sg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = sg;
            ctx.fill();
        });

        // Embers
        frame++;
        embers.forEach((e, i) => {
            e.wobble += e.wobbleSpeed;
            e.x += e.vx + Math.sin(e.wobble) * 0.6;
            e.y += e.vy;
            e.alpha -= e.fade;

            drawEmber(e);

            // Reset when faded or gone off top
            if (e.alpha <= 0 || e.y < -20) {
                embers[i] = spawnEmber();
            }
        });

        requestAnimationFrame(loop);
    }
    loop();
})();


// ═══════════════════════════════════════════════════════
//  📊 Stats Animation
// ═══════════════════════════════════════════════════════
async function fetchGitHubStats() {
    const countElement = document.getElementById('project-count');
    if (!countElement) return;

    try {
        const username = 'Nandan0402';
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();

        const docustoreInsta = 150;
        const docustoreLinkedIn = 50;
        const nandanLinkedIn = 200;

        animateValue("project-count", data.public_repos);
        animateValue("follower-count", data.followers);
        animateValue("insta-count", docustoreInsta);
        animateValue("linkedin-count", docustoreLinkedIn + nandanLinkedIn);
    } catch (error) {
        console.error("Error fetching stats:", error);
        document.getElementById('project-count').innerText = "10";
    }
}

function animateValue(id, endValue) {
    const element = document.getElementById(id);
    if (!element) return;
    let current = 0;
    const increment = Math.ceil(endValue / 50) || 1;
    const timer = setInterval(() => {
        current += increment;
        if (current >= endValue) {
            current = endValue;
            clearInterval(timer);
        }
        element.innerText = `${current}+`;
    }, 40);
}


// ═══════════════════════════════════════════════════════
//  🗂️ GitHub Projects
// ═══════════════════════════════════════════════════════
async function fetchGitHubProjects() {
    const container = document.getElementById('github-projects');
    if (!container) return;

    const username = 'Nandan0402';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const repos = await response.json();
        renderProjects(repos);
    } catch (error) {
        console.error("Error fetching projects:", error);
        container.innerHTML = `<p style="color:#ff6b2b;">Failed to load projects from GitHub.</p>`;
    }
}

// Live GitHub Pages deployments — add more repo names here as you deploy them
const livePages = {
    'College-Details_website': 'https://nandan0402.github.io/College-Details_website/',
};

function renderProjects(repos) {
    const container = document.getElementById('github-projects');
    container.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
        const projectUrl = livePages[repo.name] || repo.html_url;
        const btnLabel = livePages[repo.name] ? 'Live Demo 🔥' : 'View Project 🔥';

        card.innerHTML = `
      <img src="${imageUrl}" alt="${repo.name} Preview">
      <div class="p-content">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available.'}</p>
        <div class="tags">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>${repo.language || 'Code'}</span>
        </div>
        <a href="${projectUrl}" target="_blank">${btnLabel}</a>
      </div>
    `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
    fetchGitHubProjects();
    setupMobileMenu();

    // Attach click sound to interactive elements globally
    const interactiveElements = document.querySelectorAll('a, button, .cert-card, .logo, .mobile-menu-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mousedown', playClickSound);
    });
});

// ═══════════════════════════════════════════════════════
//  📱 Mobile Menu Setup
// ═══════════════════════════════════════════════════════
function setupMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        // Create menu button
        const menuBtn = document.createElement('div');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert it into header after logo
        // Insert it into header before logo
        const logo = header.querySelector('.logo');
        if (logo) {
            logo.before(menuBtn);
        } else {
            header.insertBefore(menuBtn, nav);
        }

        // Add dynamic CSS
        const style = document.createElement('style');
        style.innerHTML = `
            .mobile-menu-btn {
                display: none;
                color: var(--fire-gold);
                font-size: 24px;
                cursor: pointer;
                z-index: 1000;
                transition: transform 0.3s;
                padding: 5px;
            }
            .mobile-menu-btn:hover {
                transform: scale(1.1);
                color: var(--fire-amber);
            }
            @media (max-width: 768px) {
                header {
                    justify-content: flex-start !important;
                    flex-wrap: nowrap !important;
                    gap: 20px !important;
                }
                .mobile-menu-btn {
                    display: block;
                    z-index: 1001;
                    position: relative;
                }
                nav {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: fixed;
                    top: 0;
                    left: -280px;
                    width: 250px;
                    height: 100vh;
                    background: rgba(6, 2, 0, 0.98);
                    border-right: 2px solid var(--fire-amber);
                    border-bottom: none;
                    padding: 80px 20px 30px;
                    max-height: none;
                    overflow-y: auto;
                    transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    gap: 10px !important;
                    box-shadow: none;
                    z-index: 1000;
                }
                nav.active {
                    left: 0;
                    box-shadow: 20px 0 50px rgba(0,0,0,0.9);
                    padding-top: 80px;
                }
                nav a {
                    width: 100%;
                    padding: 12px 15px;
                    text-align: left;
                    font-size: 16px !important;
                    border-bottom: 1px solid rgba(255,100,0,0.1);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                nav a:last-child {
                    border-bottom: none;
                }
                nav a::after {
                    display: none; /* Hide standard underline */
                }
                nav a:hover, nav a.active {
                    background: rgba(255, 100, 0, 0.15);
                    color: var(--fire-gold);
                    transform: translateX(6px);
                }
            }
        `;
        document.head.appendChild(style);

        // Toggle logic
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if(nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            // Sound is handled by mousedown global
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if(!header.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ═══════════════════════════════════════════════════════
//  🔊 UI Interaction Sounds
// ═══════════════════════════════════════════════════════
let audioCtx = null;

function playClickSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Short, punchy "tick" sound suitable for a modern UI
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.07);

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.07);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.07);
    } catch (e) {
        console.warn("Audio play failed:", e);
    }
}
