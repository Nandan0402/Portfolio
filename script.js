// --- 3D Background Animation ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Cyan Material for Cyber Theme
    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00e5ff, // Cyan
        transparent: true,
        opacity: 0.8
    });

    // Create Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;

        // Interactive movement
        particlesMesh.rotation.y += mouseX * 0.05;
        particlesMesh.rotation.x += mouseY * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GitHub Stats Animation ---
async function fetchGitHubStats() {
    const countElement = document.getElementById('project-count');
    if (!countElement) return;

    try {
        const username = 'Nandan0402';
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        const publicRepos = data.public_repos;
        const followers = data.followers;

        // Animate Projects
        animateValue("project-count", publicRepos);
        // Animate Followers
        animateValue("follower-count", followers);

    } catch (error) {
        console.error("Error fetching stats:", error);
        document.getElementById('project-count').innerText = "10";
        if (document.getElementById('follower-count')) document.getElementById('follower-count').innerText = "5";
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
            element.innerHTML = `${current}`;
        } else {
            element.innerText = current;
        }
    }, 40);
}


// --- GitHub API Integration (Refactored) ---
async function fetchGitHubProjects(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const username = 'Nandan0402';
        // Fetch up to 100 repos
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos = await response.json();

        // Clear loading text
        container.innerHTML = '';

        // Apply limit if specified
        const reposToDisplay = limit ? repos.slice(0, limit) : repos;

        reposToDisplay.forEach(repo => {
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
        container.innerHTML = '<p>Failed to load projects.</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
    // Fetch all for projects page
    fetchGitHubProjects('github-projects');
    // Fetch top 3 for home page
    fetchGitHubProjects('recent-projects', 3);
});
