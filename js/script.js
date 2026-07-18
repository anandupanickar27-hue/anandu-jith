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

    contactForm.addEventListener('submit', (e) => {

        e.preventDefault();

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

        appendTerminalLine('Query OK, 1 row affected (0.02 sec)', 'success', 3800);

        appendTerminalLine('Records: 1  Duplicates: 0  Warnings: 0', 'system', 4500);

        appendTerminalLine('mysql> COMMIT;', 'typing', 5200);

        appendTerminalLine('Query OK, 0 rows affected (0.00 sec)', 'success', 5900);

        appendTerminalLine('mysql> EXIT;', 'typing', 6600);

        appendTerminalLine('Bye.', 'success', 7200);

        contactForm.reset();

    });

}

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
        subject: "JARVIS Upgrade",
        message: "Need a node interface visual synth. Let's collaborate."
    },
    {
        name: "Luke Skywalker",
        email: "luke@rebellion.org",
        subject: "HUD Console Refit",
        message: "X-Wing computer targets look blocky. Can you build an interactive display?"
    },
    {
        name: "Ada Lovelace",
        email: "ada@analyticalengine.org",
        subject: "Timeline Graphics",
        message: "Fascinated by your book flip animations. Need it for engine layouts."
    },
    {
        name: "Elon Musk",
        email: "elon@spacex.com",
        subject: "Starship Console",
        message: "Build a glassmorphic HUD targeting system for our Mars spacecraft."
    }
];

if (queryContactsBtn) {

    queryContactsBtn.addEventListener("click", () => {

        easterEggResults.innerHTML = "";
        easterEggResults.style.display = "none";

        setTimeout(() => {

            let table = `

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

        }, 500);

    });

}

// ===========================
// PROJECT MODAL
// ===========================

const projects = [

    {

        title: "Mekanik",

        logo: "static/images/projects/mekanik.png",

        description: "AI Vehicle Service Platform that helps users manage vehicles, appointments and maintenance.",

        features: [

            "User Authentication",

            "Vehicle Management",

            "Appointment Booking",

            "AI Vehicle Assistant",

            "Dockerized Deployment"

        ],

        tech: [

            "Flask",

            "MySQL",

            "Docker",

            "HTML",

            "CSS",

            "JavaScript"

        ],

        github:"#",

        live:"#"

    },

    {

        title:"Impruv",

        logo:"static/images/projects/impruv.png",

        description:"Student Skill Evaluation System with assessments and analytics.",

        features:[

            "Student Login",

            "MCQ Assessments",

            "Skill Analytics",

            "Admin Dashboard",

            "Learning Path"

        ],

        tech:[

            "Flask",

            "MySQL",

            "Bootstrap",

            "JavaScript"

        ],

        github:"#",

        live:"#"

    },

    {

        title:"Notes App",

        logo:"static/images/projects/notes.png",

        description:"Simple CRUD Notes Application built with Django.",

        features:[

            "Authentication",

            "Create Notes",

            "Edit Notes",

            "Delete Notes",

            "Responsive UI"

        ],

        tech:[

            "Django",

            "SQLite",

            "Bootstrap"

        ],

        github:"#",

        live:"#"

    }

];

const modal=document.getElementById("projectModal");

const modalLogo=document.getElementById("modalLogo");

const modalTitle=document.getElementById("modalTitle");

const modalDescription=document.getElementById("modalDescription");

const modalFeatures=document.getElementById("modalFeatures");

const modalTech=document.getElementById("modalTech");

const modalGithub=document.getElementById("modalGithub");

const modalLive=document.getElementById("modalLive");

const closeModal=document.getElementById("closeModal");

document.querySelectorAll(".project-card").forEach((card,index)=>{

    card.addEventListener("click",()=>{

        const project=projects[index];

        modalLogo.src=project.logo;

        modalTitle.textContent=project.title;

        modalDescription.textContent=project.description;

        modalGithub.href=project.github;

        if(project.live==="#"){

    modalLive.removeAttribute("href");

    modalLive.style.opacity=".5";

    modalLive.style.pointerEvents="none";

    modalLive.innerHTML=`
        <i class="fa-solid fa-clock"></i>
        Coming Soon
    `;

}else{

    modalLive.href=project.live;

    modalLive.style.opacity="1";

    modalLive.style.pointerEvents="auto";

    modalLive.innerHTML=`
        <i class="fa-solid fa-up-right-from-square"></i>
        Live Demo
    `;

}

        modalFeatures.innerHTML="";

        project.features.forEach(feature=>{

            modalFeatures.innerHTML+=`<li>${feature}</li>`;

        });

        modalTech.innerHTML="";

        project.tech.forEach(skill=>{

            modalTech.innerHTML+=`<span>${skill}</span>`;

        });

        modal.classList.add("active");

    });

});

closeModal.addEventListener("click",()=>{

    modal.classList.remove("active");

});

modal.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("active");

    }

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
