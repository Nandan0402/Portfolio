const words = ["AI Enthusiast", "Web Developer", "Tech Explorer"];
let i = 0;
let j = 0;
let isDeleting = false;

function typeEffect() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;

    const current = words[i];
    const partial = isDeleting ? current.substring(0, j--) : current.substring(0, j++);

    typingElement.innerHTML = partial + '<span class="cursor">|</span>';

    if (!isDeleting && j === current.length + 1) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // pause before deleting
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
        setTimeout(typeEffect, 500); // pause before next word
    } else {
        setTimeout(typeEffect, isDeleting ? 60 : 120);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
    initThreeJS();
    // Check if we are on the projects page or home page
    if (document.getElementById('github-projects')) {
        fetchGitHubProjects();
    }
    if (document.getElementById('project-count')) {
        fetchGitHubStats();
    }
});

// --- GitHub Stats Integration (for Home Page) ---
async function fetchGitHubStats() {
    const countElement = document.getElementById('project-count');
    if (!countElement) return;

    try {
        const username = 'Nandan0402';
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        const publicRepos = data.public_repos;

        // Animate the number
        let current = 0;
        const increment = Math.ceil(publicRepos / 50); // Speed of animation
        const timer = setInterval(() => {
            current += increment;
            if (current >= publicRepos) {
                current = publicRepos;
                clearInterval(timer);
                countElement.innerHTML = `${current}+`;
            } else {
                countElement.innerText = current;
            }
        }, 40);

    } catch (error) {
        console.error("Error fetching stats:", error);
        countElement.innerText = "10+"; // Fallback
    }
}


// --- GitHub API Integration ---
async function fetchGitHubProjects() {
    const container = document.getElementById('github-projects');
    if (!container) return; // Not on projects page

    try {
        const username = 'Nandan0402';
        // Fetch up to 100 repos to ensure we get all 47
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos = await response.json();

        // Clear loading text
        container.innerHTML = '';

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            // Format date
            const date = new Date(repo.updated_at).toLocaleDateString();

            // Use GitHub OpenGraph for auto-generated repo images
            const imageUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

            card.innerHTML = `
                <img src="${imageUrl}" alt="${repo.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; color: cyan;">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>${repo.language || 'Code'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" style="display: inline-block; margin-top: 15px; color: white; text-decoration: none; border: 1px solid cyan; padding: 8px 15px; border-radius: 5px; transition: 0.3s;">View Code</a>
            `;

            // Add hover effect for the button
            const btn = card.querySelector('a');
            btn.addEventListener('mouseover', () => {
                btn.style.background = 'cyan';
                btn.style.color = 'black';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.background = 'transparent';
                btn.style.color = 'white';
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error loading projects from GitHub.</p>';
    }
}

// --- 3D Background (Three.js) ---
function initThreeJS() {
    const container = document.getElementById('bg-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1000; // High graphics count
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles across a wide space
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material with a "cyber" look
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffff, // Cyan
        transparent: true,
        opacity: 0.8,
    });

    // Create Mesh
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotation
        particlesMesh.rotation.y += 0.002;
        particlesMesh.rotation.x += 0.001;

        // Interactive movement
        particlesMesh.rotation.y += mouseX * 0.05;
        particlesMesh.rotation.x += mouseY * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
