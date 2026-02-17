document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Three.js Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Create a Cyber Grid / Globe
    const geometry = new THREE.IcosahedronGeometry(10, 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add some orbiting particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 20;

    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.x += 0.001;
        globe.rotation.y += 0.002;
        particlesMesh.rotation.y -= 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Initialize Particles.js ---
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#00ffcc" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#00ffcc", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } },
            "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
        },
        "retina_detect": true
    });

    // --- Application Logic ---
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const homeSection = document.getElementById('home');
    const dashboardSection = document.getElementById('dashboard');
    const consoleLog = document.getElementById('console-log');

    // Analysis Mock Data & Real Logic
    const analyzeSystem = async () => {
        logToConsole("Initializing core modules...");
        await wait(800);
        logToConsole("Accessing hardware abstraction layer...");

        // GPU Info
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        let gpuRenderer = 'Unknown GPU';
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }

        // Generate Analysis Object
        const analysis = {
            os: navigator.platform,
            userAgent: navigator.userAgent,
            cores: navigator.hardwareConcurrency || 'N/A',
            ram: navigator.deviceMemory ? `>=${navigator.deviceMemory} GB` : 'Unknown',
            gpu: gpuRenderer,
            network: navigator.connection ? navigator.connection.effectiveType : 'Unknown',
            screen: `${window.screen.width}x${window.screen.height}`,
            depth: `${window.screen.colorDepth}-bit`,
            language: navigator.language
        };

        logToConsole("Hardware signatures acquired.");
        updateDashboard(analysis);
    };

    const updateDashboard = (data) => {
        // Hardware Card
        const hwContainer = document.getElementById('hardware-data');
        hwContainer.innerHTML = `
            <ul class="data-list">
                <li><span class="label">CPU Cores:</span> <span class="value">${data.cores}</span></li>
                <li><span class="label">Memory (RAM):</span> <span class="value">${data.ram}</span></li>
                <li><span class="label">GPU:</span> <span class="value">${data.gpu}</span></li>
                <li><span class="label">Screen Res:</span> <span class="value">${data.screen}</span></li>
            </ul>
        `;

        // Environment Card
        const envContainer = document.getElementById('env-data');
        envContainer.innerHTML = `
            <ul class="data-list">
                <li><span class="label">OS Platform:</span> <span class="value">${data.os}</span></li>
                <li><span class="label">Browser Engine:</span> <span class="value">${getBrowserName(data.userAgent)}</span></li>
                <li><span class="label">Language:</span> <span class="value">${data.language}</span></li>
                <li><span class="label">Color Depth:</span> <span class="value">${data.depth}</span></li>
            </ul>
        `;

        // Connectivity Card
        const netContainer = document.getElementById('net-data');
        netContainer.innerHTML = `
            <ul class="data-list">
                <li><span class="label">Connection Type:</span> <span class="value">${data.network.toUpperCase()}</span></li>
                <li><span class="label">Online Status:</span> <span class="value">${navigator.onLine ? 'ONLINE' : 'OFFLINE'}</span></li>
                <li><span class="label">Round Trip Time:</span> <span class="value">${navigator.connection ? navigator.connection.rtt + 'ms' : 'N/A'}</span></li>
            </ul>
        `;

        // Security / Mock "File Scan"
        const secContainer = document.getElementById('sec-data');
        secContainer.innerHTML = `
            <div class="security-scan">
                <div class="scan-item">
                    <span>File System Access</span>
                    <span class="status secure">RESTRICTED (SECURE)</span>
                </div>
                <div class="scan-item">
                    <span>Malicious Scripts</span>
                    <span class="status secure">NONE DETECTED</span>
                </div>
                 <div class="scan-item">
                    <span>Browser Sandbox</span>
                    <span class="status secure">ACTIVE</span>
                </div>
            </div>
            <div class="recommendation">
                <h4>System Integrity: 98%</h4>
                <p>No critical vulnerabilities detected in the browser environment.</p>
            </div>
        `;

        // Initialize Charts if needed
        const ctx = document.getElementById('hardware-chart').getContext('2d');
        if (window.myChart) window.myChart.destroy(); // Destroy previous instance if any

        window.myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['CPU Load', 'Memory', 'Disk I/O', 'Network'],
                datasets: [{
                    label: 'System Load',
                    data: [
                        Math.floor(Math.random() * 30) + 10,
                        Math.floor(Math.random() * 40) + 20,
                        Math.floor(Math.random() * 20) + 5,
                        Math.floor(Math.random() * 50) + 10
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { display: false, backdropColor: 'transparent' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#fff', font: { family: "'JetBrains Mono'" } }
                    }
                }
            }
        });

        updateSolutions(data);
        updateApps();
        updateFiles();
        updateThreats();

        // Show Contact Section
        document.getElementById('contact').style.display = 'block';
    };

    // Contact Form Handler
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = "ENCRYPTING & TRANSMITTING...";
        btn.style.opacity = "0.7";

        setTimeout(() => {
            btn.innerText = "TRANSMISSION SECURE ✅";
            btn.style.borderColor = "#00ff00";
            btn.style.color = "#00ff00";
            e.target.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.borderColor = "";
                btn.style.color = "";
                btn.style.opacity = "1";
            }, 3000);
        }, 1500);
    });

    const updateSolutions = (data) => {
        const solutionsSection = document.getElementById('solutions');
        solutionsSection.innerHTML = `
            <div class="cyber-card wide">
                <div class="card-header">
                     <i class="fas fa-tools"></i>
                     <h3>System Optimizations</h3>
                </div>
                <div class="recommendation-grid">
                    <div class="rec-item">
                        <i class="fas fa-sync-alt"></i>
                        <h5>Update Browser</h5>
                        <p>Ensure ${getBrowserName(data.userAgent)} is on the latest version for security patches.</p>
                    </div>
                    <div class="rec-item">
                        <i class="fas fa-shield-virus"></i>
                        <h5>Extension Audit</h5>
                        <p>Review installed extensions. Unused plugins can be security vectors.</p>
                    </div>
                     <div class="rec-item">
                        <i class="fas fa-eye-slash"></i>
                        <h5>Privacy Check</h5>
                        <p>Connection is ${data.network === 'Unknown' ? 'Standard' : data.network.toUpperCase()}. Consider using a VPN for public networks.</p>
                    </div>
                </div>
            </div>
        `;
        solutionsSection.style.display = 'block';
    };

    const updateThreats = () => {
        const threats = [
            {
                name: "Trojans",
                lang: "C++, C, C# (.NET)",
                desc: "Stealthy malware disguising as legitimate software."
            },
            {
                name: "RAT – Remote Access Trojans",
                lang: "C#, C++, Java",
                desc: "Gain full administrative control remotely."
            },
            {
                name: "Ransomware",
                lang: "C/C++, C#, Go, and Rust",
                desc: "Encrypts files for crypto-payment extortion."
            },
            {
                name: "Keyloggers",
                lang: "C++, C, C#",
                desc: "Records keystrokes to steal credentials."
            },
            {
                name: "Exploit Scripts",
                lang: "C, Python, Ruby",
                desc: "C for low-level (memory access). Python for automation. Ruby for Metasploit."
            },
            {
                name: "Injection Attacks (SQLi/XSS)",
                lang: "JavaScript, SQL",
                desc: "JavaScript used in XSS. SQL used in SQL Injection."
            }
        ];

        const solutionsSection = document.getElementById('solutions');
        // Append Threat Intel to solutions or a new section
        const threatHTML = `
            <div class="cyber-card wide" style="margin-top: 1.5rem;">
                <div class="card-header">
                     <i class="fas fa-database"></i>
                     <h3>Threat Intelligence Database</h3>
                </div>
                <div class="threat-grid">
                    ${threats.map(t => `
                        <div class="threat-item">
                            <h5 style="color: #ff0055">${t.name}</h5>
                            <span class="lang-tag">${t.lang}</span>
                            <p>${t.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        solutionsSection.insertAdjacentHTML('beforeend', threatHTML);
    };

    const updateApps = () => {
        const apps = [
            { name: "Google Chrome", ver: "119.0.6045.124", risk: "Low" },
            { name: "Visual Studio Code", ver: "1.84.2", risk: "Low" },
            { name: "Node.js", ver: "20.9.0", risk: "Medium" },
            { name: "Microsoft Office 365", ver: "16.0.16924", risk: "Low" },
            { name: "Spotify", ver: "1.2.24", risk: "Low" },
            { name: "Adobe Acrobat", ver: "23.006.20380", risk: "Medium" }
        ];

        const appContainer = document.getElementById('app-data');
        appContainer.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${apps.map(app => `
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; flex: 1 1 200px; border-left: 2px solid ${app.risk === 'Low' ? '#00ffcc' : '#ffcc00'};">
                        <div style="color: #fff; font-weight: bold;">${app.name}</div>
                        <div style="font-size: 0.8em; color: #aaa;">v${app.ver}</div>
                        <div style="font-size: 0.7em; color: ${app.risk === 'Low' ? '#00ffcc' : '#ffcc00'}; text-transform: uppercase;">Risk: ${app.risk}</div>
                    </div>
                `).join('')}
            </div>
            <p style="margin-top: 10px; font-size: 0.8rem; color: #666;">Total Applications Scanned: ${apps.length}</p>
        `;
    };

    const updateFiles = () => {
        const largeFiles = [
            { name: "backup_2025.iso", size: "4.2 GB", path: "~/Downloads" },
            { name: "project_renders.zip", size: "2.8 GB", path: "~/Documents/Work" }
        ];

        const fileContainer = document.getElementById('file-data');
        fileContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h5 style="color: #00ffcc; margin-bottom: 10px;">Large Files Detected</h5>
                    ${largeFiles.map(f => `
                        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 5px 0;">
                            <div style="color: #fff;">${f.name}</div>
                            <div style="font-size: 0.8em; color: #aaa;">${f.size} • ${f.path}</div>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h5 style="color: #ff0055; margin-bottom: 10px;">Duplicate Analysis</h5>
                    <div style="background: rgba(255,0,85,0.1); padding: 10px; border-radius: 4px; text-align: center;">
                        <span style="font-size: 2em; color: #fff; display: block;">0</span>
                        <span style="font-size: 0.8em; color: #ff0055;">Duplicates Found</span>
                    </div>
                    <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">File system integrity is optimal.</p>
                </div>
            </div>
        `;
    };

    const getBrowserName = (ua) => {
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("SamsungBrowser")) return "Samsung Internet";
        if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
        if (ua.includes("Trident")) return "Internet Explorer";
        if (ua.includes("Edge")) return "Edge";
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Safari")) return "Safari";
        return "Unknown";
    };

    const logToConsole = (text) => {
        const p = document.createElement('p');
        p.innerText = `> ${text}`;
        consoleLog.appendChild(p);
        consoleLog.scrollTop = consoleLog.scrollHeight;
    };

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Interaction
    startBtn.addEventListener('click', async () => {
        // Simple Audio Context check/beep could go here if user interaction allows

        // Hide Intro
        gsap.to(homeSection, { duration: 0.5, opacity: 0, display: 'none' });

        // Show Dashboard
        dashboardSection.style.display = 'block';
        gsap.from(dashboardSection, { duration: 0.5, opacity: 0, delay: 0.5 });

        await analyzeSystem();
    });

    resetBtn.addEventListener('click', () => {
        location.reload();
    });
});
