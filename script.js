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

        // Dark semi-transparent background gradient to allow video to show through
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, 'rgba(10, 0, 0, 0.15)');
        bg.addColorStop(0.6, 'rgba(18, 4, 0, 0.25)');
        bg.addColorStop(1, 'rgba(26, 8, 0, 0.4)');
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

    const techs = 15;
    const linkedin = 684;
    const ig = 108;
    const startup = 150;

    try {
        const username = 'Nandan0402';
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();

        animateValue("project-count", data.public_repos);
        animateValue("tech-count", techs);
        animateValue("linkedin-count", linkedin);
        animateValue("ig-count", ig);
        animateValue("startup-count", startup);
    } catch (error) {
        console.warn("GitHub API rate limited or failed, using local stats fallback:", error);
        animateValue("project-count", 55);
        animateValue("tech-count", techs);
        animateValue("linkedin-count", linkedin);
        animateValue("ig-count", ig);
        animateValue("startup-count", startup);
    }
}

function animateValue(id, endValue) {
    const element = document.getElementById(id);
    if (!element) return;
    
    if (window.gsap) {
        const obj = { val: 0 };
        window.gsap.to(obj, {
            val: endValue,
            duration: 2.2,
            ease: 'power3.out',
            onUpdate: () => {
                element.innerText = `${Math.floor(obj.val)}+`;
            }
        });
    } else {
        // Fallback standard counter
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
        console.warn("GitHub API rate limited or failed. Falling back to local repos.json...", error);
        try {
            const fallbackResponse = await fetch('repos.json');
            if (!fallbackResponse.ok) throw new Error('Failed to load local repos.json');
            const repos = await fallbackResponse.json();
            renderProjects(repos);
        } catch (fallbackError) {
            console.error("Error loading fallback projects:", fallbackError);
            container.innerHTML = `<p style="color:#ff6b2b;">Failed to load projects from GitHub.</p>`;
        }
    }
}

// Live GitHub Pages deployments — add more repo names here as you deploy them
const livePages = {
    'College-Details_website': 'https://nandan0402.github.io/College-Details_website/',
};

function renderProjects(repos) {
    const container = document.getElementById('github-projects');
    container.innerHTML = '';

    const fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'><rect width='100%' height='100%' fill='%231a0a03'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ff6b2b' font-family='Outfit, sans-serif' font-size='18' font-weight='bold'>GitHub Project</text></svg>";

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
        const projectUrl = livePages[repo.name] || repo.html_url;
        const btnLabel = livePages[repo.name] ? 'Live Demo 🔥' : 'View Project 🔥';

        card.innerHTML = `
      <img src="${imageUrl}" alt="${repo.name} Preview" loading="lazy" onerror="this.onerror=null; this.src=\`${fallbackImage}\`;">
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
    setupVanillaTilt();
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupMobileNavSocialIcons();
    setupVideoBackground();
    setupVanillaTilt();

    // Dynamically load GSAP, then play advanced animations
    loadGSAPAndPlay(() => {
        fetchGitHubStats();
        fetchGitHubProjects();
        setupHeroTextReveal();
        setupScrollReveals();
        setupMagneticButtons();
        setupMouseParallax();
    });

    // Attach click sound to interactive elements globally
    const interactiveElements = document.querySelectorAll('a, button, .cert-card, .logo, .mobile-menu-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mousedown', playClickSound);
    });
});

// ═══════════════════════════════════════════════════════
//  🎥 Dynamic Page Background Video Setup (Lazy Loaded)
// ═══════════════════════════════════════════════════════
function setupVideoBackground() {
    // 1. Check if viewport is mobile size
    const isMobile = window.innerWidth < 768;

    // 2. Define page-to-video mapping dictionary
    const pageVideoMap = {
        'index.html': 'google_flow_home.mp4',
        'about.html': 'google_flow_about.mp4',
        'skills.html': 'google_flow_skills.mp4',
        'projects.html': 'google_flow_projects.mp4',
        'freelance.html': 'google_flow_services.mp4',
        'robotics and sensors projects.html': 'google_flow_robotics.mp4',
        'feedback.html': 'google_flow_ugc.mp4',
        'contact.html': 'google_flow_contact.mp4',
        'startups.html': 'google_flow_startups.mp4',
        'consultation.html': 'google_flow_consultation.mp4',
        'certificates.html': 'google_flow_certificates.mp4',
        'resume.html': 'google_flow_home.mp4',
        'notes.html': 'google_flow_about.mp4'
    };

    // 3. Extract and match current page filename
    const currentFile = decodeURIComponent(window.location.pathname.split('/').pop()) || 'index.html';
    const videoFile = pageVideoMap[currentFile];

    if (!videoFile) {
        console.log(`No background video configured for: ${currentFile}`);
        return;
    }

    // 4. Performance optimization: lazy load the video after initial page render is idle
    const loadVideo = () => {
        const container = document.createElement('div');
        container.className = 'page-bg-video-container';

        const video = document.createElement('video');
        video.className = 'page-bg-video';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;       // Always start muted — browser autoplay requires it
        video.playsInline = true;

        // Mobile data optimization: only preload metadata on mobile screens
        video.setAttribute('preload', isMobile ? 'metadata' : 'auto');
        video.style.opacity = '0'; // start hidden for smooth fade-in

        const source = document.createElement('source');
        source.src = videoFile;
        source.type = 'video/mp4';

        video.appendChild(source);

        const overlay = document.createElement('div');
        overlay.className = 'page-bg-overlay';

        container.appendChild(video);
        container.appendChild(overlay);
        document.body.prepend(container);

        // Fade in after video starts playing to avoid jarring pop
        video.addEventListener('playing', () => {
            video.style.opacity = isMobile ? '0.45' : '0.65';

            // Attempt to unmute immediately (browsers allow this if navigating via menu clicks)
            if (!audioPlayedOnPage) {
                video.muted = false;
                video.volume = 0.35;

                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Autoplay unmuted audio succeeded!
                        audioPlayedOnPage = true;
                        let lastTime = 0;
                        const muteAfterFirstLoop = () => {
                            if (lastTime > 1 && video.currentTime < 1) {
                                video.muted = true;
                                video.removeEventListener('timeupdate', muteAfterFirstLoop);
                            }
                            lastTime = video.currentTime;
                        };
                        video.addEventListener('timeupdate', muteAfterFirstLoop);

                        // Clean up gesture triggers
                        document.removeEventListener('click', tryUnmuteOnce);
                        document.removeEventListener('touchstart', tryUnmuteOnce);
                        document.removeEventListener('keydown', tryUnmuteOnce);
                    }).catch(err => {
                        // Autoplay blocked — fall back to muted play, resume play, and wait for user gesture
                        video.muted = true;
                        video.play().catch(playErr => {
                            console.log("Muted autoplay fallback failed:", playErr);
                        });
                        console.log("Autoplay unmuted blocked, waiting for gesture:", err);
                    });
                }
            }
        }, { once: true });

        // ── Audio: play ONCE per page visit on first user interaction ──────
        let audioPlayedOnPage = false;

        const tryUnmuteOnce = () => {
            // Only play audio once per page load
            if (audioPlayedOnPage) return;
            audioPlayedOnPage = true;

            // Unmute — browser allows audio after user gesture
            video.muted = false;
            video.volume = 0.35; // comfortable background level

            // Track when video loops (currentTime jumps back to near 0)
            let lastTime = 0;
            const muteAfterFirstLoop = () => {
                if (lastTime > 1 && video.currentTime < 1) {
                    // Video just looped — mute it for all subsequent loops
                    video.muted = true;
                    video.removeEventListener('timeupdate', muteAfterFirstLoop);
                }
                lastTime = video.currentTime;
            };
            video.addEventListener('timeupdate', muteAfterFirstLoop);

            // Remove listener after first unmute
            document.removeEventListener('click', tryUnmuteOnce);
            document.removeEventListener('touchstart', tryUnmuteOnce);
            document.removeEventListener('keydown', tryUnmuteOnce);
        };

        // Attach to first user gesture (click, touch or key press)
        document.addEventListener('click',      tryUnmuteOnce, { once: false });
        document.addEventListener('touchstart', tryUnmuteOnce, { once: false });
        document.addEventListener('keydown',    tryUnmuteOnce, { once: false });
        // ────────────────────────────────────────────────────────────────────

        // Error handling fallback (fallback cleanly if file is missing)
        video.addEventListener('error', () => {
            console.warn(`Could not load background video: ${videoFile}. Falling back to default layout.`);
            container.remove();
        });
    };

    // Wait until browser is idle or fully loaded before fetching video
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadVideo);
    } else {

        window.addEventListener('load', loadVideo);
    }
}

// ═══════════════════════════════════════════════════════
//  📱 Mobile Menu Setup
// ═══════════════════════════════════════════════════════
function setupMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        // Create menu button with 3 CSS lines for morphing
        const menuBtn = document.createElement('div');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<span></span><span></span><span></span>';
        
        // Insert it into header after logo
        const logo = header.querySelector('.logo');
        if (logo) {
            logo.after(menuBtn);
        } else {
            header.insertBefore(menuBtn, nav);
        }

        // Toggle logic
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            menuBtn.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if(!header.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });

        // Highlight active link with space decoding support
        const currentPath = decodeURIComponent(window.location.pathname.split('/').pop()) || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll Shrink Header Trigger
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });

        // Dynamic Scroll Progress Bar Injection
        const progressContainer = document.createElement('div');
        progressContainer.id = 'scroll-progress-container';
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }
}

// ═══════════════════════════════════════════════════════
//  🔊 UI Interaction Sounds — plays ONCE per session only
// ═══════════════════════════════════════════════════════
let audioCtx = null;
const CLICK_SOUND_KEY = 'nandan_click_played';

function playClickSound() {
    // Only play on the very first interaction in this browser session
    if (sessionStorage.getItem(CLICK_SOUND_KEY)) return;
    sessionStorage.setItem(CLICK_SOUND_KEY, '1');

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
        console.warn('Audio play failed:', e);
    }
}

// ═══════════════════════════════════════════════════════
//  💬 Testimonials & Feedback System
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    loadFeedbacks();

    // Dev tool: Double click "Client Feedback" title to clear test reviews
    const feedbackTitle = document.querySelector('.testimonials-section .section-title');
    if (feedbackTitle) {
        feedbackTitle.addEventListener('dblclick', () => {
            if(confirm("Clear all test feedbacks?")) {
                localStorage.removeItem('clientReviews');
                const container = document.getElementById('testimonials-container');
                if (container) container.innerHTML = '';
            }
        });
    }

    const form = document.getElementById('feedback-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fb-name').value;
            const business = document.getElementById('fb-business').value;
            const rating = parseInt(document.getElementById('fb-rating').value);
            const message = document.getElementById('fb-message').value;

            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

            const newFeedback = { name, business, rating, message, date };

            // Save to localStorage
            let feedbacks = JSON.parse(localStorage.getItem('clientReviews')) || [];
            feedbacks.unshift(newFeedback); // Add to the top
            localStorage.setItem('clientReviews', JSON.stringify(feedbacks));

            // Render it instantly
            renderFeedbackCard(newFeedback, true);

            // Show success message
            const statusMsg = document.getElementById('fb-status');
            statusMsg.textContent = "Feedback submitted successfully!";
            statusMsg.className = "feedback-msg success";

            // Reset form
            form.reset();

            // Hide success message after 3 seconds
            setTimeout(() => {
                statusMsg.style.display = 'none';
                statusMsg.className = "feedback-msg";
            }, 3000);
            statusMsg.style.display = 'block';
        });
    }
});

function loadFeedbacks() {
    let feedbacks = JSON.parse(localStorage.getItem('clientReviews')) || [];
    // Only render the local storage ones, hardcoded ones are already in HTML
    feedbacks.reverse().forEach(fb => {
        renderFeedbackCard(fb, true); // Add local storage reviews to the top
    });
}

function renderFeedbackCard(fb, prepend = false) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'testimonial-card';

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < fb.rating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>'; // empty star
        }
    }

    card.innerHTML = `
        <div class="t-header">
          <div class="t-info">
            <h4>${escapeHTML(fb.name)}</h4>
            <span>${escapeHTML(fb.business)}</span>
          </div>
          <div class="t-rating">
            ${starsHtml}
          </div>
        </div>
        <div class="t-message">“${escapeHTML(fb.message)}”</div>
        <div class="t-date">${escapeHTML(fb.date)}</div>
    `;

    if (prepend) {
        container.prepend(card);
    } else {
        container.appendChild(card);
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

// ═══════════════════════════════════════════════════════
//  🔥 Floating Fire Toast Notifications
// ═══════════════════════════════════════════════════════
function initFireToasts() {
    // 1. Create Toast Container
    const container = document.createElement('div');
    container.id = 'fire-toast-container';
    document.body.appendChild(container);

    // 2. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #fire-toast-container {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
            pointer-events: none;
        }
        .fire-toast {
            background: rgba(10, 2, 0, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 100, 0, 0.3);
            border-left: 4px solid var(--fire-orange, #ff6400);
            border-radius: 12px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 0 25px rgba(255, 80, 0, 0.25);
            transform: translateX(-120%);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 350px;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
        }
        .fire-toast::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, rgba(255,100,0,0.1), transparent);
            z-index: -1;
        }
        @keyframes avatarFlameGlow {
            0% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.4); background-position: 0% 50%; }
            50% { box-shadow: 0 0 25px rgba(255, 60, 0, 0.9); background-position: 100% 50%; }
            100% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.4); background-position: 0% 50%; }
        }
        @keyframes toastBorderFlicker {
            0% { border-left-color: var(--fire-orange, #ff6400); box-shadow: 0 0 25px rgba(255, 80, 0, 0.25); }
            50% { border-left-color: var(--fire-gold, #ffc800); box-shadow: 0 0 35px rgba(255, 80, 0, 0.5); }
            100% { border-left-color: var(--fire-orange, #ff6400); box-shadow: 0 0 25px rgba(255, 80, 0, 0.25); }
        }
        .fire-toast.show {
            transform: translateX(0);
            opacity: 1;
            animation: toastBorderFlicker 3s infinite alternate ease-in-out;
        }
        .fire-toast-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--fire-gold, #ffc800), var(--fire-orange, #ff6400), var(--fire-red, #ff2a00), var(--fire-gold, #ffc800));
            background-size: 300% 300%;
            animation: avatarFlameGlow 2.5s ease-in-out infinite alternate;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #fff;
            font-size: 16px;
            flex-shrink: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .fire-toast-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .fire-toast-text {
            color: #eee;
            font-size: 14px;
            line-height: 1.4;
            font-family: 'Outfit', sans-serif;
        }
        .fire-toast-text b {
            color: var(--fire-gold, #ffc800);
            font-weight: 700;
        }
        .fire-toast-time {
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            #fire-toast-container {
                left: 10px;
                right: 10px;
                bottom: 80px; /* Raised to avoid overlapping common bottom elements */
                align-items: center;
                gap: 10px;
            }
            .fire-toast {
                width: 100%;
                max-width: 340px;
                padding: 12px 15px;
                transform: translateY(150%);
            }
            .fire-toast.show {
                transform: translateY(0);
            }
            .fire-toast-avatar {
                width: 36px;
                height: 36px;
                font-size: 14px;
            }
            .fire-toast-text {
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. Random Notification Data
    const names = [
        "Aarav M.", "Sunita Mehra", "John D.", "Priya K.", "Michael S.", "Rahul V.", "Emma W.", "David C.",
        "Vikram S.", "Amit R.", "Neha K.", "Sophie L.", "James T.", "Karan B.", "Ayesha M.", "Rohan D.",
        "Daniel H.", "Meera J.", "Oliver P.", "Pooja N.", "Lucas W.", "Sneha Y.", "Arjun T."
    ];
    const actions = [
        "just booked a <b>Gym Website</b>",
        "inquired about a <b>Clothing E-commerce Store</b>",
        "hired for a <b>Salon Booking Platform</b>",
        "requested a quote for a <b>Real Estate Website</b>",
        "just viewed <b>Restaurant & Cafe Websites</b>",
        "is looking at <b>Car Wash Portals</b>",
        "checked out <b>Business Portfolio Websites</b>",
        "is checking out <b>Healthcare Clinic Portals</b>",
        "inquired about a <b>Travel Agency Website</b>",
        "just booked a <b>Logistics & Transport App</b>",
        "requested a quote for a <b>Custom CRM System</b>",
        "hired for an <b>Event Management Platform</b>",
        "just viewed <b>Law Firm Websites</b>",
        "is looking at <b>Interior Design Portals</b>",
        "inquired about a <b>Photography Portfolio</b>",
        "checked out <b>Grocery Delivery Apps</b>",
        "just booked an <b>Educational LMS Platform</b>",
        "hired for a <b>Jewelry E-commerce Store</b>",
        "requested a quote for a <b>Hotel Booking Website</b>",
        "is looking at <b>Fintech Web Applications</b>",
        "just viewed <b>SaaS Dashboard Development</b>",
        "inquired about an <b>Auto Dealership Website</b>",
        "hired for a <b>Consultancy Firm Website</b>",
        "just submitted <b>Client Feedback</b>",
        "downloaded your <b>Resume</b>"
    ];
    const times = ["Just now", "2 mins ago", "5 mins ago", "12 mins ago", "20 mins ago"];

    function spawnToast() {
        const name = names[Math.floor(Math.random() * names.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        
        // Get initials (e.g. Sunita Mehra -> SM)
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const toast = document.createElement('div');
        toast.className = 'fire-toast';
        toast.innerHTML = `
            <div class="fire-toast-avatar">${initials}</div>
            <div class="fire-toast-content">
                <div class="fire-toast-text"><b>${name}</b> ${action}</div>
                <div class="fire-toast-time">${time}</div>
            </div>
        `;

        container.appendChild(toast);

        // Sound effect (optional, might be too intrusive, so we skip sound for toasts)
        
        // Trigger animation
        requestAnimationFrame(() => {
            setTimeout(() => toast.classList.add('show'), 50);
        });

        // Remove after 4.5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 600); // Wait for transition
        }, 4500);
    }

    // Spawn first toast after 2.5 seconds
    setTimeout(spawnToast, 2500);

    // Spawn periodically every 15-30 seconds
    setInterval(() => {
        if(Math.random() > 0.3) { // 70% chance to spawn to make it feel organic
            spawnToast();
        }
    }, 20000);
}

document.addEventListener('DOMContentLoaded', initFireToasts);

// ═══════════════════════════════════════════════════════
//  🎬 Advanced GSAP Animations Upgrade System (Dynamic CDN)
// ═══════════════════════════════════════════════════════
function loadGSAPAndPlay(callback) {
    const coreScript = document.createElement('script');
    coreScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    coreScript.async = true;

    coreScript.onload = () => {
        const triggerScript = document.createElement('script');
        triggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
        triggerScript.async = true;

        triggerScript.onload = () => {
            if (window.gsap && window.ScrollTrigger) {
                window.gsap.registerPlugin(window.ScrollTrigger);
                console.log("GSAP and ScrollTrigger plugins loaded successfully!");
                callback();
            }
        };
        document.head.appendChild(triggerScript);
    };

    coreScript.onerror = () => {
        console.warn("GSAP CDN failed to load. Falling back to default animations.");
        callback();
    };

    document.head.appendChild(coreScript);
}

// ── entrance text/timeline reveal ──
function setupHeroTextReveal() {
    if (!window.gsap) return;
    const gsap = window.gsap;

    const tl = gsap.timeline();
    if (document.querySelector('.hero-text h1')) {
        tl.from('.hero-text h1', { opacity: 0, y: 40, duration: 0.85, ease: 'power3.out' });
        tl.from('.hero-text .subtitle', { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.55');
        tl.from('.hero-text .description', { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.35');
        tl.from('.cta-buttons a', { opacity: 0, y: 10, stagger: 0.1, duration: 0.45, ease: 'back.out(1.5)' }, '-=0.3');
        tl.from('.social-chip', { opacity: 0, scale: 0.8, stagger: 0.05, duration: 0.4, ease: 'back.out(1.8)' }, '-=0.25');
        tl.from('.hero-image', { opacity: 0, scale: 0.9, duration: 0.8, ease: 'power3.out' }, '-=0.75');
    }
}

// ── scroll reveals ──
function setupScrollReveals() {
    if (!window.gsap) return;
    const gsap = window.gsap;

    // Headings scroll reveals
    gsap.utils.toArray('section h2, .section-title, .section-subtitle, .coming-soon-box h3').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.65,
            ease: 'power2.out'
        });
    });

    // Cards scroll reveals
    gsap.utils.toArray('.project-card, .skill-card, .service-card, .stat-item, .cert-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 35,
            scale: 0.97,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
}

// ── magnetic cursor pulls ──
function setupMagneticButtons() {
    if (!window.gsap) return;
    const gsap = window.gsap;

    const pullElements = document.querySelectorAll('.btn-primary, .btn-secondary, .social-chip, .logo, .mobile-menu-btn');
    pullElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.35,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.65,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
}

// ── mouse ambient lighting parallax ──
function setupMouseParallax() {
    if (!window.gsap) return;
    const gsap = window.gsap;

    window.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth) - 0.5;
        const yPercent = (e.clientY / window.innerHeight) - 0.5;

        gsap.to('body', {
            '--mouse-x': `${xPercent * 35}px`,
            '--mouse-y': `${yPercent * 35}px`,
            duration: 0.75,
            ease: 'power2.out'
        });
    });
}

// ── vanilla-tilt 3d glare cards ──
function setupVanillaTilt() {
    if (window.VanillaTilt) {
        window.VanillaTilt.init(document.querySelectorAll('.premium-card, .skill-card, .project-card, .service-card, .cert-card, .testimonial-card, .contact-card'), {
            max: 8,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            gyroscope: true
        });
    }
}

// ── Dynamic Social Icons Wrapper for Mobile Drawer ──
function setupMobileNavSocialIcons() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const icons = nav.querySelectorAll('.nav-icon');
    if (icons.length === 0) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'nav-social-icons-wrapper';
    
    // Insert wrapper before the first icon
    const firstIcon = icons[0];
    nav.insertBefore(wrapper, firstIcon);
    
    // Move all icons into the wrapper
    icons.forEach(icon => {
        wrapper.appendChild(icon);
    });
}


