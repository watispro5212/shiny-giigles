const CATEGORIES = {
    utility: [
        { name: 'ping', desc: 'Checks the module connection and data latency' },
        { name: 'info', desc: 'Access global terminal and bot classification data' },
        { name: 'serverinfo', desc: 'Scan parameters and data regarding the current node' },
        { name: 'userinfo', desc: 'Pull system file and data on a specific user' },
        { name: 'avatar', desc: 'Extract a high-resolution user image file' },
        { name: 'servericon', desc: 'Extract the high-resolution icon of the current Nexus node' },
        { name: 'math', desc: 'Process a central intelligence operation' },
        { name: 'timer', desc: 'Initiate a synchronized countdown pulse' },
        { name: 'poll', desc: 'Fire up a quick community consensus vote' },
        { name: 'remind', desc: 'Have the system keep tabs on something for you' },
        { name: 'translate', desc: 'Translate text across language protocols' },
        { name: 'weather', desc: 'Pull atmospheric data for a location' },
        { name: 'profile', desc: 'View a comprehensive operative dossier' }
    ],
    economy: [
        { name: 'balance', desc: 'Scan current credit reserves and net worth' },
        { name: 'daily', desc: 'Receive your daily Nexus Credit allocation (streak bonus!)' },
        { name: 'work', desc: 'Execute a gig to earn Nexus Credits (scales with level)' },
        { name: 'rob', desc: 'Execute a cyber-heist on another user\'s local wallet' },
        { name: 'transfer', desc: 'Initiate an encrypted credit transfer' },
        { name: 'leaderboard', desc: 'Displays the top operatives by net worth' },
        { name: 'shop', desc: 'Access the underground hardware catalog (8 items!)' },
        { name: 'buy', desc: 'Acquire hardware from the shop' },
        { name: 'inventory', desc: 'View your locally stored items' }
    ],
    casino: [
        { name: 'blackjack', desc: 'Engage in a high-stakes protocol against the dealer' },
        { name: 'slots', desc: 'Wager credits on the random number generator' },
        { name: 'coinflip', desc: 'Execute a boolean 50/50 algorithm' }
    ],
    leveling: [
        { name: 'rank', desc: 'Analyze your current security clearance and XP progress' }
    ],
    moderation: [
        { name: 'ban', desc: 'Permanently sever a user from the node' },
        { name: 'kick', desc: 'Temporarily sever a user from the node' },
        { name: 'warn', desc: 'Issue a formal protocol strike to an entity' },
        { name: 'purge', desc: 'Initiate a mass data deletion in the current channel' },
        { name: 'lock', desc: 'Engage firewall on the current channel' },
        { name: 'unlock', desc: 'Disengage firewall on the current channel' },
        { name: 'slowmode', desc: 'Throttle output bandwidth in the current channel' },
        { name: 'say', desc: 'Transmit a cleartext message through the Nexus' },
        { name: 'verify-setup', desc: 'Drop a secure verification portal (Admin Only)' },
        { name: 'ticket-setup', desc: 'Deploy a support ticket interface' }
    ],
    fun: [
        { name: '8ball', desc: 'Query the Oracle array for a yes/no outcome' },
        { name: 'joke', desc: 'Process a humorous data packet' },
        { name: 'fact', desc: 'Extract an interesting file from the database' },
        { name: 'quote', desc: 'Extract an inspirational transmission' },
        { name: 'roll', desc: 'Execute a randomized integer sequence' },
        { name: 'rps', desc: 'Simulate Rock, Paper, Scissors against the CPU' },
        { name: 'trivia', desc: 'Process a trivia data packet' },
        { name: 'hack', desc: 'Initiate a harmless penetration test on a target' },
        { name: 'emojify', desc: 'Convert text data into an encrypted emoji string' }
    ],
    advanced: [
        { name: 'cyber-heist', desc: 'Execute a high-stakes multi-phase heist operation' },
        { name: 'giveaway', desc: 'Airdrop resources to the community' },
        { name: 'network-stats', desc: 'Display real-time shard and gateway diagnostics' },
        { name: 'shards', desc: 'View active shard processes and their health' }
    ],
    media: [
        { name: 'cat', desc: 'Fetches biological data on Felines' },
        { name: 'dog', desc: 'Fetches biological data on Canines' },
        { name: 'meme', desc: 'Intercepts top-tier humorous media' },
        { name: 'urban', desc: 'Query the Urban data archives for slang definitions' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const nav = document.querySelector('nav');
    const tabContainer = document.getElementById('category-tabs');
    const commandList = document.getElementById('command-list');
    const searchInput = document.getElementById('command-search');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    let activeCategory = 'utility';

    // --- Hamburger Menu ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Navbar scroll effect ---
    window.addEventListener('scroll', () => {
        if (nav && window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else if (nav) {
            nav.classList.remove('scrolled');
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Command Rendering ---
    function renderCommands(filter = '') {
        if (!commandList) return;
        
        commandList.innerHTML = '';
        let commandsToDisplay = [];
        
        if (filter.trim()) {
            Object.values(CATEGORIES).forEach(list => {
                const matches = list.filter(cmd => 
                    cmd.name.toLowerCase().includes(filter.toLowerCase()) || 
                    cmd.desc.toLowerCase().includes(filter.toLowerCase())
                );
                commandsToDisplay.push(...matches);
            });
            if (tabContainer) tabContainer.style.display = 'none';
        } else {
            commandsToDisplay = CATEGORIES[activeCategory] || [];
            if (tabContainer) tabContainer.style.display = 'flex';
        }

        if (commandsToDisplay.length === 0) {
            commandList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-dim);">No command signals found.</div>';
            return;
        }

        commandsToDisplay.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.style.animationDelay = `${index * 0.05}s`;
            div.innerHTML = `
                <div class="cmd-name">
                    <span>/${cmd.name}</span>
                    <span class="cmd-copy">Copy</span>
                </div>
                <p class="cmd-desc">${cmd.desc}</p>
            `;

            div.onclick = () => {
                navigator.clipboard.writeText(`/${cmd.name}`).then(() => {
                    const copySpan = div.querySelector('.cmd-copy');
                    if (copySpan) {
                        copySpan.innerText = 'COPIED';
                        copySpan.style.color = 'var(--primary)';
                        setTimeout(() => {
                            copySpan.innerText = 'COPY';
                            copySpan.style.color = 'inherit';
                        }, 2000);
                    }
                });
            };

            commandList.appendChild(div);
        });
    }

    // Tabs
    if (tabContainer) {
        tabContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('tab-btn')) {
                activeCategory = e.target.dataset.category;
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderCommands();
            }
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderCommands(e.target.value);
        });
    }

    // --- Animated Stats Counter ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            if (!target || counter.dataset.done) return;

            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + suffix;
                    counter.dataset.done = 'true';
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(updateCounter);
                }
            };

            // Start animation when in viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !counter.dataset.done) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    animateCounters();

    // --- Operations Feed Typing Effect ---
    const opsFeed = document.getElementById('ops-feed');
    if (opsFeed) {
        const opsMessages = [
            { time: '21:52:10', module: 'SHARD_0', msg: 'Initializing neural level sync for guild_8829...', status: 'SUCCESS', statusClass: 'ops-success' },
            { time: '21:52:12', module: 'FIREWALL', msg: 'Unauthorized breach attempt detected in sector_G4. Blocking vector...', status: 'BLOCKED', statusClass: 'ops-error' },
            { time: '21:52:15', module: 'CORE', msg: 'Global heartbeat pulse emitted. Latency: 18ms.', status: '', statusClass: '' },
            { time: '21:52:20', module: 'UPLINK', msg: 'Gateway handshake confirmed with Discord API nodes.', status: '', statusClass: '' },
            { time: '21:52:25', module: 'ECONOMY', msg: 'Batching 4,821 credit transactions to global ledger...', status: '', statusClass: '' },
            { time: '21:52:28', module: 'XP_SYS', msg: 'Distributed 27 XP to operative_0092. Level check: PASS.', status: '', statusClass: '' },
            { time: '21:52:30', module: 'CASINO', msg: 'Slot terminal spin registered. Result: 💎💎🍋 — MINOR GAIN.', status: '', statusClass: '' },
            { time: '21:52:33', module: 'SECURITY', msg: 'Anti-spam module throttled entity_4412 in sector_B2.', status: 'THROTTLED', statusClass: 'ops-error' },
            { time: '21:52:35', module: 'SHARD_0', msg: 'Processing /PROFILE request from entity_0055...', status: 'OK', statusClass: 'ops-success' },
        ];

        let lineIndex = 0;

        function addOpsLine() {
            if (lineIndex >= opsMessages.length) {
                // Loop back
                lineIndex = 0;
                opsFeed.innerHTML = '';
            }

            const entry = opsMessages[lineIndex];
            const line = document.createElement('div');
            line.className = 'ops-line';
            line.innerHTML = `<span class="ops-timestamp">[${entry.time}]</span> <span class="ops-module">${entry.module}</span>: ${entry.msg}${entry.status ? ` <span class="${entry.statusClass}">${entry.status}</span>` : ''}`;
            
            // Remove cursor if exists
            const cursor = opsFeed.querySelector('.ops-cursor');
            if (cursor) cursor.remove();

            opsFeed.appendChild(line);

            // Re-add cursor
            const cursorEl = document.createElement('div');
            cursorEl.className = 'ops-cursor';
            cursorEl.textContent = '_ LISTENING_FOR_TRAFFIC...';
            opsFeed.appendChild(cursorEl);

            // Auto-scroll
            opsFeed.scrollTop = opsFeed.scrollHeight;

            lineIndex++;
        }

        // Start the feed
        addOpsLine();
        setInterval(addOpsLine, 3000);
    }

    // --- Reveal on Scroll ---
    const reveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal();

    // --- Parallax Effect ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const grid = document.querySelector('.grid-overlay');
        if (grid) {
            grid.style.transform = `perspective(1000px) rotateX(60deg) translate(${x}px, ${y}px)`;
        }

        const hero = document.querySelector('.hero-title');
        if (hero) {
            hero.style.transform = `translate(${x * -0.2}px, ${y * -0.2}px)`;
        }
    });

    // Initial render
    if (commandList) {
        renderCommands();
    }
});
