/* ==========================================================================
   SCRIPT.JS - Main App Orchestration, Scroll Observers, Typing and Terminal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Navigation ---
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            // Toggle hamburger icon between bars and close X
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // --- 2. Navbar Scrolling Effects & Back to Top Toggle ---
    const navbar = document.getElementById('main-navbar');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            if (backToTopBtn) backToTopBtn.style.opacity = '1';
        } else {
            if (backToTopBtn) backToTopBtn.style.opacity = '0';
        }
    });

    // --- 3. Scroll spy - Active Nav Link highlighter ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight when section is 40% into the screen
            if (window.scrollY >= (sectionTop - sectionHeight * 0.4)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Intersection Observers for Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Intersection Observer for Skills (Proficiency Animation) ---
    const skillCards = document.querySelectorAll('.skill-item-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('active');
                
                // Animate proficiency bar
                const bar = card.querySelector('.proficiency-bar');
                const targetVal = parseInt(card.getAttribute('data-proficiency'), 10);
                if (bar) {
                    bar.style.width = `${targetVal}%`;
                }

                // Animate label count
                const label = card.querySelector('.proficiency-label');
                if (label) {
                    animateCount(label, 0, targetVal, 1200);
                }

                skillObserver.unobserve(card);
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));

    function animateCount(element, start, end, duration) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = `${value}%`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // --- 6. Hero Typing Animation ---
    const typeWords = [
        "Creative Web Architecture",
        "Interactive Interface Design",
        "Modern Systems Development",
        "Pixel-Perfect Architectures"
    ];
    const typedTextEl = document.getElementById('typed-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        if (!typedTextEl) return;
        const currentWord = typeWords[wordIndex];
        
        if (isDeleting) {
            typedTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 40;
        } else {
            typedTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 90;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typeWords.length;
            typeDelay = 400; // Pause before starting next word
        }

        setTimeout(typeEffect, typeDelay);
    }
    
    // Start typing after initial load
    setTimeout(typeEffect, 1000);

   // --- 7. MySQL Terminal Contact Form Simulator ---
const contactForm = document.getElementById('contact-terminal-form');
const terminalOutputs = document.getElementById('terminal-outputs');

if (contactForm && terminalOutputs) {

    contactForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const submitBtn = document.getElementById('terminal-submit-btn');

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Executing...';

        const name = document.getElementById('sql-name').value;
        const email = document.getElementById('sql-email').value;
        const subject = document.getElementById('sql-subject').value;
        const message = document.getElementById('sql-message').value;

        terminalOutputs.innerHTML = '';

        appendTerminalLine('mysql> CONNECT portfolio;', 'typing', 0);
        appendTerminalLine('Connection established.', 'success', 500);
        appendTerminalLine('mysql> USE portfolio;', 'typing', 1000);
        appendTerminalLine('Database changed.', 'success', 1500);

        appendTerminalLine(
            `mysql> INSERT INTO contacts (name, email, subject, message)
VALUES ('${name}', '${email}', '${subject}', '${message.substring(0, 20)}...');`,
            'typing',
            2200
        );

        try {

            const formData = new FormData(contactForm);

            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            if (result.success) {

                appendTerminalLine('Query OK, 1 row affected (0.02 sec)', 'success', 3800);

                appendTerminalLine('Records: 1  Duplicates: 0  Warnings: 0', 'system', 4500);

                appendTerminalLine('mysql> COMMIT;', 'typing', 5200);

                appendTerminalLine('Query OK, 0 rows affected (0.00 sec)', 'success', 5900);

                appendTerminalLine('Notification sent successfully.', 'success', 6600);

                appendTerminalLine('mysql> EXIT;', 'typing', 7200);

                appendTerminalLine('Bye.', 'success', 7800);

                contactForm.reset();

            } else {

                appendTerminalLine(
                    `ERROR: ${result.message || 'Failed to send message.'}`,
                    'error',
                    3800
                );

            }

        } catch (error) {

            appendTerminalLine(
                'ERROR: Unable to connect to mail server.',
                'error',
                3800
            );

            console.error(error);

        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Query';

    });

}

function updateFavicon(theme) {

    const favicon = document.getElementById("favicon");

    if (!favicon) return;

    favicon.href = theme === "dark"
        ? "images/anandu-light.png"
        : "images/anandu-dark.png";

}



const currentTheme =
    document.documentElement.getAttribute("data-theme");

updateFavicon(currentTheme);

function appendTerminalLine(text, cssClass, delay) {

    setTimeout(() => {

        const line = document.createElement('p');

        line.className = `output-line ${cssClass}`;

        line.innerHTML = text;

        terminalOutputs.appendChild(line);

        const container = document.querySelector('.terminal-content');

        if (container) {

            container.scrollTop = container.scrollHeight;

        }

    }, delay);

}



// =========================
// Premium 3D Tilt
// =========================

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;

        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 18;

        const rotateY = (x - centerX) / 18;

        card.style.transition = "transform .08s linear";

        card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.04)
        `;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transition = "transform .45s ease";

        card.style.transform = `
            perspective(1200px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;

    });

});

    // --- 8. MySQL Mini Terminal ---
const queryContactsBtn = document.getElementById("query-contacts-btn");
const miniTerminalOutput = document.getElementById("mini-terminal-output");
const easterEggResults = document.getElementById("easter-egg-results");

const mockContacts = [
    {
        name: "Tony Stark",
        email: "tony@starkindustries.com",
        subject: "J.A.R.V.I.S. Dashboard Upgrade",
        message: "Need a next-generation AI dashboard with holographic UI. Interested in collaborating?"
    },
    {
        name: "Bruce Wayne",
        email: "bruce@wayneenterprises.com",
        subject: "Batcomputer Security Audit",
        message: "Looking for a developer to strengthen the Batcomputer's security and optimize its interface."
    },
    {
        name: "Reed Richards",
        email: "reed@baxterfoundation.org",
        subject: "Multiverse Research Portal",
        message: "Need an interactive portal dashboard capable of visualizing multidimensional research data."
    },
    {
        name: "Cyborg",
        email: "victor@starlabs.org",
        subject: "S.T.A.R. Labs Neural Interface",
        message: "Can you build a responsive control panel for my cybernetic systems and AI integrations?"
    },
    {
        name: "Thor Odinson",
        email: "thor@newasgard.gov",
        subject: "Instagram for New Asgard",
        message: "Lady Sif insists New Asgard needs an Instagram account. I have no idea where to begin."
    }
];

if (queryContactsBtn) {

    queryContactsBtn.addEventListener("click", () => {

        easterEggResults.innerHTML = "";
        easterEggResults.style.display = "none";

        setTimeout(() => {

            let table = `

                <button
                    type="button"
                    id="close-easter-egg"
                    class="btn btn-danger close-table-btn">

                    <i class="fa-solid fa-xmark"></i>
                    Close

                </button>

                <div class="mini-query-output">

                    <p class="output-line typing">

                        mysql&gt; SELECT * FROM contacts;

                    </p>

                    <p class="output-line success">

                        Query OK. Fetching rows...

                    </p>

                    <table class="sql-table">

                        <thead>

                            <tr>

                                <th>name</th>
                                <th>email</th>
                                <th>subject</th>
                                <th>message</th>

                            </tr>

                        </thead>

                        <tbody>

            `;

            mockContacts.forEach(row => {

                table += `

                    <tr>

                        <td>${row.name}</td>

                        <td>${row.email}</td>

                        <td>${row.subject}</td>

                        <td>${row.message}</td>

                    </tr>

                `;

            });

            table += `

                        </tbody>

                    </table>

                    <div class="sql-table-meta">

                        4 rows returned (0.04 sec)

                    </div>

                </div>

            `;

            easterEggResults.innerHTML = table;
            easterEggResults.style.display = "block";

            document.getElementById("close-easter-egg").addEventListener("click", () => {

                easterEggResults.style.display = "none";

            });

        }, 500);

    });

}

const closeTableBtn = document.getElementById("close-easter-egg");

if (closeTableBtn && easterEggResults) {

    closeTableBtn.addEventListener("click", () => {

        easterEggResults.style.display = "none";

    });

}

// ===========================
// PROJECT MODAL
// ===========================

const projects = [

    {

        title: "GoFi",

        logo: "images/gofi-icon.svg",

        images: [
            "images/gofi/Image1.png",
            "images/gofi/Image2.png",
            "images/gofi/Image3.png",
            "images/gofi/Image4.png",
            "images/gofi/Image5.png"

        ],

        description:
            "AI-powered productivity platform that combines intelligent note management, contextual AI assistance, and secure cloud-based storage to help users organize, search, and interact with their knowledge.",

        features: [
            "Context-Aware AI Chat (RAG)",
            "Smart Note & Category Management",
            "Secure User Authentication",
            "Cloud Database Integration (TiDB)",
            "Responsive Dashboard",
            "Semantic Search with ChromaDB"
        ],

        tech: [
            "Django",
            "Python",
            "Gemini AI",
            "LangChain",
            "ChromaDB",
            "TiDB",
            "Docker",
            "Bootstrap",
            "HTML",
            "CSS",
            "JavaScript"
        ],

        github: "https://github.com/anandupanickar27-hue/NotesHub",

        live: "https://gofi-app.onrender.com"

    },

    {

        title: "Mekanik",

        logo: "images/mekanik-icon.svg",

        images: [
            "images/mekanik/Image1.png",
            "images/mekanik/Image2.png",
            "images/mekanik/Image3.png",
            "images/mekanik/Image4.png",
            "images/mekanik/Image5.png",
            "images/mekanik/Image6.png",
            "images/mekanik/Image7.png",
            "images/mekanik/Image8.png",
            "images/mekanik/Image9.png"
        ],

        description:
            "AI-powered vehicle service platform that streamlines vehicle maintenance through intelligent diagnostics, appointment scheduling, maintenance tracking, and seamless collaboration between customers and mechanics.",

        features: [
            "Vehicle & Service History Management",
            "AI-Based Vehicle Issue Analysis",
            "Mechanic Appointment Booking",
            "Maintenance & Repair Tracking",
            "Cloud Database Integration",
            "Dockerized & Production Deployment"
        ],

        tech: [
            "Flask",
            "SQLAlchemy",
            "TiDB Cloud",
            "Google Gemini AI",
            "Docker",
            "Gunicorn",
            "Render",
            "HTML",
            "CSS",
            "JavaScript",
            "Bootstrap"
        ],

        github: "https://github.com/anandupanickar27-hue/mekanik-ai-vehicle-service-platform",

        live: "https://mekanik-app.onrender.com"

    },

    {

        title: "Impruv",

        logo: "images/impruv-icon.png",

        images: [
            "images/impruv/image1.png",
            "images/impruv/image2.png",
            "images/impruv/image3.png",
            "images/impruv/image4.png",
            "images/impruv/image5.png",
            "images/impruv/image6.png",
            "images/impruv/image7.png",
            "images/impruv/image8.png"
        ],

        description:
            "Student skill evaluation platform designed to assess technical proficiency through interactive assessments, analytics, and personalized learning insights.",

        features: [
            "MCQ Assessments",
            "Coding Challenges",
            "Skill Analytics",
            "Admin Dashboard",
            "Personalized Learning Path"
        ],

        tech: [
            "Flask",
            "MySQL",
            "Bootstrap",
            "HTML",
            "CSS",
            "JavaScript"
        ],

        github: "https://github.com/anandupanickar27-hue/impruv-skill-evaluation-system",

        live: null

    }

];

const modal = document.getElementById("projectModal");

const modalLogo = document.getElementById("modalLogo");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalFeatures = document.getElementById("modalFeatures");
const modalTech = document.getElementById("modalTech");

const modalGithub = document.getElementById("modalGithub");
const modalLive = document.getElementById("modalLive");

const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");
const carouselDots = document.getElementById("carouselDots");

let currentImages = [];
let currentImageIndex = 0;
/* Live Demo Popup */

const livePopup = document.getElementById("liveDemoPopup");
const closeLivePopup = document.getElementById("closeLivePopup");

function updateCarousel() {

    if (currentImages.length === 0) {
        modalImage.src = "";
        carouselDots.innerHTML = "";
        return;
    }

    modalImage.src = currentImages[currentImageIndex];

    carouselDots.innerHTML = "";

    currentImages.forEach((_, index) => {

        const dot = document.createElement("span");

        if (index === currentImageIndex) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            currentImageIndex = index;
            updateCarousel();
        });

        carouselDots.appendChild(dot);

    });

}

/* Open Project */

document.querySelectorAll(".project-card").forEach((card, index) => {

    card.addEventListener("click", () => {

        const project = projects[index];

        modalLogo.src = project.logo;
        modalLogo.alt = project.title;
        currentImages = project.images;
        currentImageIndex = 0;
        updateCarousel();

        modalTitle.textContent = project.title;

        modalDescription.textContent = project.description;

        modalGithub.href = project.github;

        /* Features */

        modalFeatures.innerHTML = "";

        project.features.forEach(feature => {

            modalFeatures.innerHTML += `<li>${feature}</li>`;

        });

        /* Tech */

        modalTech.innerHTML = "";

        project.tech.forEach(skill => {

            modalTech.innerHTML += `<span>${skill}</span>`;

        });

        /* Live Demo */

        if (project.live === null) {

            modalLive.style.display = "none";

        }

        else {

            modalLive.style.display = "inline-flex";

            modalLive.href = project.live;

            modalLive.innerHTML = `
                <i class="fa-solid fa-up-right-from-square"></i>
                Live Demo
            `;

        }

        modal.classList.add("active");

        /* Lock Background Scroll */

        document.body.style.overflow = "hidden";

    });

});

prevImage.addEventListener("click", () => {

    if (currentImages.length <= 1) return;

    currentImageIndex--;

    if (currentImageIndex < 0) {
        currentImageIndex = currentImages.length - 1;
    }

    updateCarousel();

});

nextImage.addEventListener("click", () => {

    if (currentImages.length <= 1) return;

    currentImageIndex++;

    if (currentImageIndex >= currentImages.length) {
        currentImageIndex = 0;
    }

    updateCarousel();

});

/* Close Modal */

function closeProjectModal(){

    modal.classList.remove("active");

    document.body.style.overflow = "";

}

closeModal.addEventListener("click", closeProjectModal);

modal.addEventListener("click",(e)=>{

    if(e.target===modal){

        closeProjectModal();

    }

});

/* Live Demo Click */

modalLive.addEventListener("click", (e) => {

    e.preventDefault();

    livePopup.classList.add("show");

});


const continueLiveDemo = document.getElementById("continueLiveDemo");

continueLiveDemo.addEventListener("click", () => {

    livePopup.classList.remove("show");

    window.open(modalLive.href, "_blank");

});
/* Close Live Popup */

closeLivePopup.addEventListener("click",()=>{

    livePopup.classList.remove("show");

});

livePopup.addEventListener("click",(e)=>{

    if(e.target===livePopup){

        livePopup.classList.remove("show");

    }

});

// ===========================
// Mobile Skill Icon Preview
// ===========================

document.querySelectorAll(".skill-name").forEach(skill => {

    skill.addEventListener("click", () => {

        // Desktop keeps existing hover behavior
        if (window.innerWidth > 768) return;

        // Remove previous active icon
        document.querySelectorAll(".mobile-skill-icon").forEach(icon => icon.remove());

        document.querySelectorAll(".skill-name").forEach(item => {
            if (item !== skill){
                item.classList.remove("active");
            }
        });

        // Toggle off if already active
        if(skill.classList.contains("active")){
            skill.classList.remove("active");
            return;
        }

        skill.classList.add("active");

        const icon = document.createElement("i");
        icon.className = `${skill.dataset.icon} mobile-skill-icon`;

        skill.appendChild(icon);

    });

});

// --- 9. Particle Background Canvas System ---

    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let numberOfParticles = 75;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce borders
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }

            draw() {
                // Resolve fill color dynamically based on active theme
                const currentTheme = document.documentElement.getAttribute('data-theme');
                ctx.fillStyle = currentTheme === 'light' ? 'rgba(227, 100, 20, 0.45)' : 'rgba(34, 211, 238, 0.45)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particlesArray.push(new Particle(x, y));
            }
        }

        function connectParticles() {
            const maxDistance = 115;
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const alpha = (1 - (distance / maxDistance)) * 0.15;
                        ctx.strokeStyle = currentTheme === 'light' 
                            ? `rgba(227, 100, 20, ${alpha})` 
                            : `rgba(6, 182, 212, ${alpha})`;
                            
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- 10. Card Hover Interactive coordinates aura ---
    // (Used to draw radial gradient backgrounds on cursor moves)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

function updateFavicon(theme) {

    const favicon = document.getElementById("favicon");

    if (theme === "dark") {

        favicon.href = "assets/favicon-dark.png";

    } else {

        favicon.href = "assets/favicon-light.png";

    }

}