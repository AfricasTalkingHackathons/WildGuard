// WildGuard JavaScript Application
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    initNavigation();
    initAnimations();
    initWildlifeGallery();
    initReportForm();
    initDashboard();
    initCommunityLeaderboard();
    initContactForm();
    initScrollEffects();

    console.log('WildGuard application initialized successfully!');
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling ONLY for same-page anchors
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // If href is another page (like rangers.html), let browser handle it
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
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


// Animation initialization
function initAnimations() {
    // Counter animation for hero stats
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current).toLocaleString();

            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, 16);
    };

    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => animateCounter(stat));
                observer.unobserve(entry.target);
            }
        });
    });

    if (heroSection) {
        observer.observe(heroSection);
    }

    // Fade in animations for cards and sections
    const animatedElements = document.querySelectorAll('.problem-card, .solution-feature, .wildlife-card, .community-stat, .contact-item');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, Math.random() * 200);

                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => fadeInObserver.observe(el));
}

// Wildlife gallery initialization
function initWildlifeGallery() {
    const galleryContainer = document.getElementById('wildlife-gallery');

    const wildlifeData = [
        {
            name: 'African Elephant',
            status: 'endangered',
            image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'Largest land mammal, critical for ecosystem balance.'
        },
        {
            name: 'African Lion',
            status: 'threatened',
            image: 'https://www.pexels.com/photo/majestic-african-lion-close-up-in-natural-habitat-34004589.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'King of the savanna, apex predator of African ecosystems.'
        },
        {
            name: 'Black Rhinoceros',
            status: 'endangered',
            image: 'https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'Critically endangered species, heavily protected against poaching.'
        },
        {
            name: 'African Leopard',
            status: 'threatened',
            image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'Elusive big cat, excellent climber and night hunter.'
        },
        {
            name: 'Giraffe',
            status: 'threatened',
            image: 'https://images.pexels.com/photos/802112/pexels-photo-802112.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'Tallest mammal on Earth, facing habitat fragmentation.'
        },
        {
            name: 'Plains Zebra',
            status: 'safe',
            image: 'https://images.pexels.com/photos/750223/pexels-photo-750223.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            description: 'Iconic striped herbivore, important prey species.'
        }
    ];

    if (galleryContainer) {
        wildlifeData.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'wildlife-card';
            card.innerHTML = `
                <img src="${animal.image}" alt="${animal.name}" class="wildlife-image" loading="lazy">
                <div class="wildlife-info">
                    <h3>${animal.name}</h3>
                    <span class="wildlife-status status-${animal.status}">${animal.status}</span>
                    <p>${animal.description}</p>
                </div>
            `;
            galleryContainer.appendChild(card);
        });
    }
}

// Report form functionality
function initReportForm() {
    const reportForm = document.getElementById('wildlife-report-form');
    const modal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.modal-close');

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(reportForm);
            const reportData = {
                type: document.getElementById('report-type').value,
                animal: document.getElementById('animal-type').value,
                location: document.getElementById('location').value,
                urgency: document.getElementById('urgency').value,
                description: document.getElementById('description').value,
                contact: document.getElementById('contact').value,
                timestamp: new Date().toISOString(),
                id: generateReportId()
            };

            // Validate required fields
            if (!reportData.type || !reportData.location || !reportData.urgency || !reportData.description) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate report submission
            submitReport(reportData);

            // Show success modal
            if (modal) {
                modal.style.display = 'block';
            }

            // Reset form
            reportForm.reset();
        });
    }

    // Modal close functionality
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // ===== Summary Metrics =====
    const summaryMetrics = [
        { name: "Total Reports", value: 156 },
        { name: "Pending Reports", value: 12 },
        { name: "Verified Today", value: 8 },
        { name: "Active Threats", value: 3 },
        { name: "Online Rangers", value: 5 },
        { name: "Sensor Alerts", value: 2 }
    ];

    const summaryContainer = document.getElementById("summary-metrics");
    summaryMetrics.forEach(metric => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${metric.name}</h3>
            <p class="counter" data-target="${metric.value}">0</p>
        `;
        summaryContainer.appendChild(card);
    });

    // ===== Sensor Metrics =====
    const sensorMetrics = [
        { name: "Total Sensors", value: 25 },
        { name: "Online", value: 23 },
        { name: "Alerting", value: 2 },
        { name: "Low Battery", value: 1 }
    ];

    const sensorContainer = document.getElementById("sensor-metrics");
    sensorMetrics.forEach(sensor => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <p class="counter" data-target="${sensor.value}">0</p>
        `;
        sensorContainer.appendChild(card);
    });

    // ===== Recent Reports =====
    const recentReports = [
        { type: "Poaching", priority: "Urgent", location: "-2.153456, 34.678901", description: "Gunshots near River Camp", time: "2025-09-23 13:45", phone: "+254712345678", trust: 92, distance: "2.3km" },
        { type: "Wildlife Sighting", priority: "Normal", location: "-1.234567, 35.678901", description: "Herd of elephants", time: "2025-09-23 12:00", phone: "+254798765432", trust: 88, distance: "5km" }
        // Add more reports as needed
    ];

    const reportsTable = document.getElementById("recent-reports");
    recentReports.forEach(report => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${report.type}</td>
            <td class="${report.priority === 'Urgent' ? 'priority-urgent' : ''}">${report.priority}</td>
            <td>${report.location}</td>
            <td>${report.description}</td>
            <td>${report.time}</td>
            <td>${report.phone}</td>
            <td>${report.trust}</td>
            <td>${report.distance}</td>
        `;
        reportsTable.appendChild(row);
    });

    // ===== Threat Predictions =====
    const threatPredictions = [
        { type: "Poaching Risk", score: 0.87, location: "-2.150000, 34.680000", timeWindow: "Next 6h", factors: "Historical Incidents, Night Activity", action: "Immediate Patrol (Urgent)" },
        { type: "Habitat Threat", score: 0.65, location: "-1.500000, 35.000000", timeWindow: "Next 12h", factors: "Deforestation", action: "Monitor Area" }
    ];

    const threatTable = document.getElementById("threat-predictions");
    threatPredictions.forEach(threat => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${threat.type}</td>
            <td>${threat.score}</td>
            <td>${threat.location}</td>
            <td>${threat.timeWindow}</td>
            <td>${threat.factors}</td>
            <td class="${threat.action.includes('Urgent') ? 'priority-urgent' : ''}">${threat.action}</td>
        `;
        threatTable.appendChild(row);
    });

    // ===== Animate Counters =====
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.innerText;
            const increment = Math.ceil(target / 200);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
});

// Dashboard functionality
function initDashboard() {
    const recentReportsList = document.getElementById('recent-reports-list');

    // Sample recent reports data
    const recentReports = [
        {
            type: 'Wildlife Sighting',
            location: 'Maasai Mara',
            time: '2 hours ago',
            description: 'Herd of 12 elephants near village water point'
        },
        {
            type: 'Poaching Alert',
            location: 'Amboseli',
            time: '4 hours ago',
            description: 'Suspicious activity reported near rhino sanctuary'
        },
        {
            type: 'Human-Wildlife Conflict',
            location: 'Laikipia',
            time: '6 hours ago',
            description: 'Lion spotted near cattle grazing area'
        },
        {
            type: 'Habitat Threat',
            location: 'Tsavo East',
            time: '8 hours ago',
            description: 'Illegal logging activity detected'
        },
        {
            type: 'Wildlife Sighting',
            location: 'Samburu',
            time: '12 hours ago',
            description: 'Leopard family with cubs observed'
        }
    ];

    if (recentReportsList) {
        recentReports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `
                <h4>${report.type}</h4>
                <p><strong>${report.location}</strong> - ${report.time}</p>
                <p>${report.description}</p>
            `;
            recentReportsList.appendChild(reportItem);
        });
    }

    // Filter functionality
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const timeFilter = document.querySelector('.time-filter');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Here you would implement actual filtering logic
            console.log('Filter changed:', checkbox.dataset.filter, checkbox.checked);
        });
    });

    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => {
            console.log('Time filter changed:', e.target.value);
        });
    }
}

// Community leaderboard
function initCommunityLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');

    const leaderboardData = [
        {
            rank: 1,
            name: 'Samuel Kiptoo',
            location: 'Maasai Mara',
            reports: 47
        },
        {
            rank: 2,
            name: 'Grace Wanjiku',
            location: 'Laikipia',
            reports: 35
        },
        {
            rank: 3,
            name: 'David Lekishon',
            location: 'Amboseli',
            reports: 28
        },
        {
            rank: 4,
            name: 'Mary Nyambura',
            location: 'Tsavo',
            reports: 23
        },
        {
            rank: 5,
            name: 'John Muriuki',
            location: 'Samburu',
            reports: 19
        }
    ];

    if (leaderboard) {
        leaderboardData.forEach(user => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="leaderboard-rank">${user.rank}</div>
                <div class="leaderboard-info">
                    <h4>${user.name}</h4>
                    <p>${user.location}</p>
                </div>
                <div class="leaderboard-score">${user.reports}</div>
            `;
            leaderboard.appendChild(item);
        });
    }
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you within 24 hours.');
                contactForm.reset();
            }, 500);
        });
    }
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');

        if (heroBackground) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });

    // Progress indicator (optional)
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '70px';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #2D5016, #4A7C2A)';
    progressBar.style.zIndex = '999';
    progressBar.style.transition = 'width 0.3s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Utility functions
function generateReportId() {
    return 'WG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function submitReport(reportData) {
    // In a real application, this would send data to a server
    console.log('Report submitted:', reportData);

    // Store in localStorage for demo purposes
    const reports = JSON.parse(localStorage.getItem('wildguard-reports') || '[]');
    reports.unshift(reportData);
    localStorage.setItem('wildguard-reports', JSON.stringify(reports.slice(0, 50))); // Keep last 50 reports
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Emergency reporting functions (for USSD/SMS simulation)
function handleEmergencyReport(method) {
    console.log(`Emergency report initiated via ${method}`);
    alert(`Emergency report system activated via ${method}. In a real scenario, this would connect to local authorities and conservation teams.`);
}

// Simulated USSD functionality
function simulateUSSD() {
    const ussdResponse = `
WildGuard USSD Menu:
1. Report Wildlife Sighting
2. Report Poaching/Threat
3. Report Human-Wildlife Conflict
4. Emergency Alert
5. Check Rewards

Reply with option number
    `;
    alert(ussdResponse.trim());
}

// Simulated SMS functionality
function simulateSMS() {
    const smsFormat = `
SMS Format:
WILD [TYPE] [LOCATION] [DESCRIPTION]

Examples:
WILD ELEPHANT Maasai_Mara Herd_near_village
WILD POACHING Tsavo Suspicious_activity
WILD CONFLICT Laikipia Lion_near_cattle

Send to: 40456
    `;
    alert(smsFormat.trim());
}

// Add event listeners for emergency buttons (if they exist)
document.addEventListener('click', (e) => {
    if (e.target.dataset.ussd) {
        simulateUSSD();
    } else if (e.target.dataset.sms) {
        simulateSMS();
    }
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.WildGuard = {
    closeModal,
    handleEmergencyReport,
    simulateUSSD,
    simulateSMS,
    submitReport
};