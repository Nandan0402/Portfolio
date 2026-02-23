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

function renderProjects(repos) {
    const container = document.getElementById('github-projects');
    container.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;

        card.innerHTML = `
      <img src="${imageUrl}" alt="${repo.name} Preview">
      <div class="p-content">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available.'}</p>
        <div class="tags">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>${repo.language || 'Code'}</span>
        </div>
        <a href="${repo.html_url}" target="_blank">View Project 🔥</a>
      </div>
    `;
        container.appendChild(card);
    });

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.2
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
    fetchGitHubProjects();
});
