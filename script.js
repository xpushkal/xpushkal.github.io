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
// Contribution data is fetched from a public, token-free proxy so no
// secrets ever ship to the client. Falls back to the REST Events API.
const GH_CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4';

async function initGitHubActivity() {
    const username = 'xpushkal';
    const graphContainer = document.getElementById('githubGraph');
    const repoCount = document.getElementById('repoCount');
    const followerCount = document.getElementById('followerCount');
    const followingCount = document.getElementById('followingCount');
    const contribCount = document.getElementById('contribCount');
    const yearSelector = document.getElementById('yearSelector');

    if (!graphContainer) return;

    try {
        // Fetch user profile data (REST API - no token needed)
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (userRes.ok) {
            const userData = await userRes.json();
            if (repoCount) repoCount.textContent = `${userData.public_repos || 0} repos`;
            if (followerCount) followerCount.textContent = `${userData.followers || 0} followers`;
            if (followingCount) followingCount.textContent = `${userData.following || 0} following`;
        }

        // Real contribution calendar via token-free public proxy.
        let contributionData = null;
        let totalContribs = 0;

        const proxyData = await fetchContributionsProxy(username);
        if (proxyData) {
            contributionData = proxyData.contributions;
            totalContribs = proxyData.totalContributions;
        }

        if (!contributionData) {
            // Fallback: use REST Events API (limited to ~90 days)
            const events = await fetchEvents(username);
            contributionData = buildContributionData(events);
            totalContribs = Object.values(contributionData).reduce((a, b) => a + b, 0);
        }

        if (contribCount) contribCount.textContent = `${totalContribs.toLocaleString()} contributions in the last year`;
        renderGitHubGraph(graphContainer, contributionData);
        renderYearSelector(yearSelector);

    } catch (error) {
        console.warn('GitHub API error:', error);
        const fallbackData = generateFallbackData();
        if (contribCount) contribCount.textContent = '-- contributions in the last year';
        renderGitHubGraph(graphContainer, fallbackData);
        renderYearSelector(yearSelector);
        if (repoCount) repoCount.textContent = '-- repos';
        if (followerCount) followerCount.textContent = '-- followers';
        if (followingCount) followingCount.textContent = '-- following';
    }
}

// Token-free contribution calendar (last 365 days) via public proxy.
async function fetchContributionsProxy(username) {
    try {
        const res = await fetch(`${GH_CONTRIB_API}/${username}?y=last`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.contributions) return null;

        const contributions = {};
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        let total = 0;
        data.contributions.forEach(day => {
            const d = new Date(day.date + 'T00:00:00');
            if (d >= oneYearAgo && d <= today) {
                contributions[day.date] = day.count;
                total += day.count;
            }
        });

        return { contributions, totalContributions: total };
    } catch (e) {
        console.warn('Contributions proxy fetch failed:', e);
        return null;
    }
}

// REST Events API fallback
async function fetchEvents(username) {
    let allEvents = [];
    for (let page = 1; page <= 10; page++) {
        const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100&page=${page}`);
        if (!res.ok) break;
        const events = await res.json();
        if (events.length === 0) break;
        allEvents = allEvents.concat(events);
    }
    return allEvents;
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
    ['', 'Mon', '', 'Wed', '', 'Fri', ''].forEach(name => {
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
            let weekCount = 0;
            for (let j = i; j < weeks.length; j++) {
                if (weeks[j][0] && weeks[j][0].month === firstDay.month) weekCount++;
                else break;
            }
            span.style.width = (weekCount * 14 - 3) + 'px';
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

