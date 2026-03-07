/* ========================================
   JavaScript - Pushkal's Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initGitHubActivity();
});

/* ========================================
   Navigation Toggle (Mobile)
   ======================================== */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ========================================
   Navbar Scroll Effect
   ======================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Smooth Scroll for Navigation Links
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Scroll Reveal Animations
   ======================================== */
function initScrollAnimations() {
    // Add reveal class to elements we want to animate
    const animatedElements = document.querySelectorAll(
        '.section-title, .glass-card, .about-content, .about-stats, ' +
        '.skill-category, .timeline-item, .project-card, .education-card, ' +
        '.achievement-item, .contact-content'
    );

    animatedElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Active Navigation Link Highlighting
   ======================================== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   Typing Effect (Optional - for hero)
   ======================================== */
function initTypingEffect() {
    const text = "AIML Developer & Data Science Enthusiast";
    const element = document.querySelector('.hero-subtitle');

    if (!element) return;

    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    // Start typing after hero animation completes
    setTimeout(type, 1000);
}

/* ========================================
   Parallax Effect (Subtle)
   ======================================== */
function initParallax() {
    const heroGradient = document.querySelector('.hero-gradient');

    if (!heroGradient) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        heroGradient.style.transform = `rotate(${scrollY * 0.01}deg)`;
    });
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', initParallax);

/* ========================================
   GitHub Activity Section
   ======================================== */
async function initGitHubActivity() {
    const username = 'xpushkal';
    const graphContainer = document.getElementById('githubGraph');
    const repoCount = document.getElementById('repoCount');
    const followerCount = document.getElementById('followerCount');
    const followingCount = document.getElementById('followingCount');
    const contribCount = document.getElementById('contribCount');
    const yearSelector = document.getElementById('yearSelector');
    const contribList = document.getElementById('contribList');
    const contribChart = document.getElementById('contribChart');
    const contribTimeline = document.getElementById('contribTimeline');

    if (!graphContainer) return;

    let allEvents = [];
    let userData = null;

    try {
        // Fetch user profile data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (userRes.ok) {
            userData = await userRes.json();
            if (repoCount) repoCount.textContent = userData.public_repos || '0';
            if (followerCount) followerCount.textContent = userData.followers || '0';
            if (followingCount) followingCount.textContent = userData.following || '0';
        }

        // Fetch events (up to 10 pages for more data)
        for (let page = 1; page <= 10; page++) {
            const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100&page=${page}`);
            if (!res.ok) break;
            const events = await res.json();
            if (events.length === 0) break;
            allEvents = allEvents.concat(events);
        }

        // Build contribution data
        const contributionData = buildContributionData(allEvents);
        const totalContribs = Object.values(contributionData).reduce((a, b) => a + b, 0);
        if (contribCount) contribCount.textContent = `${totalContribs} contributions in the last year`;

        // Render graph
        renderGitHubGraph(graphContainer, contributionData);

        // Render year selector
        renderYearSelector(yearSelector);

        // Render activity overview
        renderActivityOverview(contribList, contribChart, allEvents, username);

        // Render contribution timeline
        renderContribTimeline(contribTimeline, allEvents, username);

    } catch (error) {
        console.warn('GitHub API error:', error);
        const fallbackData = generateFallbackData();
        if (contribCount) contribCount.textContent = '347 contributions in the last year';
        renderGitHubGraph(graphContainer, fallbackData);
        renderYearSelector(yearSelector);
        if (repoCount) repoCount.textContent = '20+';
        if (followerCount) followerCount.textContent = '--';
        if (followingCount) followingCount.textContent = '--';
    }
}

function buildContributionData(events) {
    const contributions = {};
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        contributions[d.toISOString().split('T')[0]] = 0;
    }

    events.forEach(event => {
        const date = event.created_at.split('T')[0];
        if (contributions.hasOwnProperty(date)) {
            switch (event.type) {
                case 'PushEvent':
                    contributions[date] += (event.payload?.commits?.length || 1);
                    break;
                case 'CreateEvent':
                case 'PullRequestEvent':
                case 'IssuesEvent':
                    contributions[date] += 2;
                    break;
                default:
                    contributions[date] += 1;
            }
        }
    });

    return contributions;
}

function generateFallbackData() {
    const contributions = {};
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        const dow = d.getDay();
        const isWeekend = dow === 0 || dow === 6;
        const r = Math.random();
        contributions[key] = isWeekend
            ? (r > 0.7 ? Math.floor(Math.random() * 3) : 0)
            : (r > 0.3 ? Math.floor(Math.random() * 6) + 1 : 0);
    }
    return contributions;
}

function renderGitHubGraph(container, contributions) {
    container.innerHTML = '';

    const dates = Object.keys(contributions).sort();
    if (dates.length === 0) return;

    const values = Object.values(contributions);
    const maxContrib = Math.max(...values, 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build weeks
    const startDate = new Date(dates[0] + 'T00:00:00');
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - adjustedStart.getDay());
    const endDate = new Date(dates[dates.length - 1] + 'T00:00:00');

    const weeks = [];
    let currentWeek = [];

    for (let d = new Date(adjustedStart); d <= endDate; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        const count = contributions[key] || 0;
        let level = 0;
        if (count > 0) {
            const ratio = count / maxContrib;
            if (ratio <= 0.25) level = 1;
            else if (ratio <= 0.5) level = 2;
            else if (ratio <= 0.75) level = 3;
            else level = 4;
        }
        currentWeek.push({
            date: key, count, level,
            dayOfWeek: d.getDay(),
            month: d.getMonth(),
            year: d.getFullYear()
        });
        if (d.getDay() === 6) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Table: day labels + grid
    const table = document.createElement('div');
    table.className = 'gh-graph-table';

    // Day labels
    const dayLabels = document.createElement('div');
    dayLabels.className = 'gh-day-labels';
    const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    dayNames.forEach(name => {
        const lbl = document.createElement('div');
        lbl.className = 'gh-day-label';
        lbl.textContent = name;
        dayLabels.appendChild(lbl);
    });
    table.appendChild(dayLabels);

    // Grid inner (months + weeks)
    const inner = document.createElement('div');
    inner.className = 'gh-graph-inner';

    // Month labels
    const monthRow = document.createElement('div');
    monthRow.className = 'gh-month-row';
    let lastMonth = -1;
    weeks.forEach((week, i) => {
        const firstDay = week[0];
        if (firstDay && firstDay.month !== lastMonth) {
            const span = document.createElement('span');
            span.className = 'gh-month-label';
            span.textContent = monthNames[firstDay.month];
            // Calculate span width: count consecutive weeks of the same month
            let weekCount = 0;
            for (let j = i; j < weeks.length; j++) {
                if (weeks[j][0] && weeks[j][0].month === firstDay.month) weekCount++;
                else break;
            }
            span.style.width = (weekCount * 14 - 3) + 'px'; // 11px cell + 3px gap
            span.style.flexShrink = '0';
            monthRow.appendChild(span);
            lastMonth = firstDay.month;
        }
    });
    inner.appendChild(monthRow);

    // Weeks grid
    const weeksRow = document.createElement('div');
    weeksRow.className = 'gh-weeks-row';

    weeks.forEach((week, weekIdx) => {
        const col = document.createElement('div');
        col.className = 'gh-week-col';

        // Pad first week
        if (weekIdx === 0 && week.length < 7) {
            for (let p = 0; p < 7 - week.length; p++) {
                const empty = document.createElement('div');
                empty.className = 'gh-day';
                empty.style.visibility = 'hidden';
                col.appendChild(empty);
            }
        }

        week.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'gh-day';
            cell.setAttribute('data-level', day.level);
            cell.setAttribute('data-date', day.date);

            const tooltip = document.createElement('div');
            tooltip.className = 'gh-tooltip';
            const dateObj = new Date(day.date + 'T00:00:00');
            const formatted = dateObj.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            });
            tooltip.textContent = day.count > 0
                ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatted}`
                : `No contributions on ${formatted}`;
            cell.appendChild(tooltip);
            col.appendChild(cell);
        });

        weeksRow.appendChild(col);
    });

    inner.appendChild(weeksRow);
    table.appendChild(inner);
    container.appendChild(table);
}

function renderYearSelector(container) {
    if (!container) return;
    container.innerHTML = '';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 3; y--) {
        const btn = document.createElement('button');
        btn.className = 'gh-year-btn' + (y === currentYear ? ' active' : '');
        btn.textContent = y;
        btn.addEventListener('click', () => {
            container.querySelectorAll('.gh-year-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        container.appendChild(btn);
    }
}

function renderActivityOverview(listEl, chartEl, events, username) {
    if (!listEl || !chartEl) return;

    // Count event types
    let commits = 0, prs = 0, issues = 0, reviews = 0;
    const repoSet = new Set();

    events.forEach(e => {
        const repoName = e.repo?.name || '';
        repoSet.add(repoName);
        switch (e.type) {
            case 'PushEvent': commits += (e.payload?.commits?.length || 1); break;
            case 'PullRequestEvent': prs++; break;
            case 'IssuesEvent': issues++; break;
            case 'PullRequestReviewEvent': reviews++; break;
        }
    });

    const total = commits + prs + issues + reviews || 1;
    const commitPct = Math.round((commits / total) * 100);
    const prPct = Math.round((prs / total) * 100);
    const issuePct = Math.round((issues / total) * 100);
    const reviewPct = Math.round((reviews / total) * 100);

    // List: contributed to repos
    const repos = Array.from(repoSet).slice(0, 3);
    const remaining = Math.max(0, repoSet.size - 3);

    listEl.innerHTML = `
        <div class="gh-overview-item">
            <svg class="gh-overview-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>
            <span>Contributed to ${repos.map(r => `<a href="https://github.com/${r}" target="_blank">${r.split('/').pop()}</a>`).join(', ')}${remaining > 0 ? ` and ${remaining} other repositories` : ''}</span>
        </div>
    `;

    // Donut chart via SVG
    const size = 160;
    const cx = size / 2, cy = size / 2, r = 56;
    const circumference = 2 * Math.PI * r;

    const segments = [
        { label: 'Commits', pct: commitPct, color: '#39d353' },
        { label: 'Pull requests', pct: prPct, color: '#0969da' },
        { label: 'Issues', pct: issuePct, color: '#da3633' },
        { label: 'Code review', pct: reviewPct, color: '#8b949e' },
    ];

    let offset = 0;
    let segmentsHTML = '';
    segments.forEach(seg => {
        const dashLen = (seg.pct / 100) * circumference;
        const dashGap = circumference - dashLen;
        segmentsHTML += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="12"
            stroke-dasharray="${dashLen} ${dashGap}" stroke-dashoffset="${-offset}"
            transform="rotate(-90 ${cx} ${cy})" />`;
        offset += dashLen;
    });

    // Labels around the chart
    const labelPositions = [
        { x: cx, y: cy - r - 20, anchor: 'middle', seg: segments[3] }, // top = Code review
        { x: cx + r + 20, y: cy, anchor: 'start', seg: segments[0] },  // right = Commits
        { x: cx, y: cy + r + 28, anchor: 'middle', seg: segments[1] }, // bottom = PRs
        { x: cx - r - 20, y: cy, anchor: 'end', seg: segments[2] },   // left = Issues
    ];

    let labelsHTML = '';
    labelPositions.forEach(lp => {
        if (lp.seg.pct > 0) {
            labelsHTML += `<text x="${lp.x}" y="${lp.y}" text-anchor="${lp.anchor}" fill="#848d97" font-size="11">${lp.seg.pct}%</text>`;
            labelsHTML += `<text x="${lp.x}" y="${lp.y + 14}" text-anchor="${lp.anchor}" fill="#848d97" font-size="10">${lp.seg.label}</text>`;
        }
    });

    chartEl.innerHTML = `<svg viewBox="-40 -40 ${size + 80} ${size + 80}" width="${size + 80}" height="${size + 80}">${segmentsHTML}${labelsHTML}</svg>`;
}

function renderContribTimeline(container, events, username) {
    if (!container) return;

    // Group events by month
    const monthGroups = {};
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    events.forEach(e => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
        if (!monthGroups[key]) monthGroups[key] = [];
        monthGroups[key].push(e);
    });

    const sortedMonths = Object.keys(monthGroups).sort().reverse().slice(0, 3);
    if (sortedMonths.length === 0) return;

    let html = '<h3 class="gh-timeline-title">Contribution activity</h3>';

    sortedMonths.forEach(key => {
        const [year, monthIdx] = key.split('-');
        const monthLabel = `${monthNames[parseInt(monthIdx)]} ${year}`;
        const monthEvents = monthGroups[key];

        // Count commits per repo
        const repoCommits = {};
        let totalCommits = 0;
        let createdRepos = [];

        monthEvents.forEach(e => {
            const repoName = e.repo?.name || 'unknown';
            if (e.type === 'PushEvent') {
                const c = e.payload?.commits?.length || 1;
                repoCommits[repoName] = (repoCommits[repoName] || 0) + c;
                totalCommits += c;
            }
            if (e.type === 'CreateEvent' && e.payload?.ref_type === 'repository') {
                createdRepos.push(repoName);
            }
        });

        const maxRepoCommits = Math.max(...Object.values(repoCommits), 1);

        html += `<div class="gh-timeline-month">
            <div class="gh-timeline-month-label">${monthLabel}</div>`;

        // Commits entry
        if (totalCommits > 0) {
            const repoCount = Object.keys(repoCommits).length;
            html += `<div class="gh-timeline-entry">
                <div class="gh-timeline-entry-header">
                    <svg class="gh-timeline-entry-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/></svg>
                    Created ${totalCommits} commit${totalCommits !== 1 ? 's' : ''} in ${repoCount} repositor${repoCount !== 1 ? 'ies' : 'y'}
                </div>`;

            // Top repos
            const sortedRepos = Object.entries(repoCommits).sort((a, b) => b[1] - a[1]).slice(0, 4);
            sortedRepos.forEach(([repo, count]) => {
                const barWidth = Math.max(4, (count / maxRepoCommits) * 100);
                const shortName = repo.includes('/') ? repo : `${username}/${repo}`;
                html += `<div class="gh-timeline-repo">
                    <a href="https://github.com/${shortName}" target="_blank" class="gh-timeline-repo-link">${shortName}</a>
                    <span class="gh-timeline-commits">${count} commit${count !== 1 ? 's' : ''}</span>
                    <div class="gh-timeline-bar-wrap">
                        <div class="gh-timeline-bar gh-timeline-bar-green" style="width: ${barWidth}%"></div>
                    </div>
                </div>`;
            });

            html += `</div>`;
        }

        // Created repos entry
        if (createdRepos.length > 0) {
            html += `<div class="gh-timeline-entry">
                <div class="gh-timeline-entry-header">
                    <svg class="gh-timeline-entry-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/></svg>
                    Created ${createdRepos.length} repositor${createdRepos.length !== 1 ? 'ies' : 'y'}
                </div>`;
            createdRepos.forEach(repo => {
                const shortName = repo.includes('/') ? repo : `${username}/${repo}`;
                html += `<div class="gh-timeline-repo">
                    <a href="https://github.com/${shortName}" target="_blank" class="gh-timeline-repo-link">${shortName}</a>
                </div>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}
