// State Management
let portfolioData = {
    profile: {
        name: "Abdulaziz Zakzriyya Muhammed",
        title: "Web Developer | Computer Science Student | Aspiring Software Engineer",
        bio: "I'm a Computer Science student and aspiring software developer passionate about technology, creative problem-solving, and building digital solutions for individuals, businesses, and institutions.",
        education: "Abubakar Tatari Ali Polytechnic, Bauchi State, Nigeria.",
        goals: "Aspiring software engineer passionate about building impactful web platforms for institutions, enterprise businesses, and local communities.",
        email: "abdulazizmuhammed40@gmail.com",
        wa1: "0703664967",
        wa2: "08102613935",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
        cvUrl: "#"
    },
    skills: [
        { name: "HTML5", category: "Frontend" },
        { name: "CSS3", category: "Frontend" },
        { name: "JavaScript", category: "Frontend" },
        { name: "Responsive Design", category: "Design" },
        { name: "Python", category: "Backend" },
        { name: "MySQL", category: "Database" },
        { name: "Git & GitHub", category: "Tools" },
        { name: "Website Deployment", category: "DevOps" }
    ],
    services: [
        {
            title: "Business Website Design",
            desc: "Custom built, highly responsive corporate & business websites tailored to convert visitors.",
            icon: "globe"
        },
        {
            title: "Portfolio Development",
            desc: "Modern personal brand portfolios with dynamic admin backend controls.",
            icon: "layout"
        },
        {
            title: "Web Applications",
            desc: "Interactive multi-user web applications integrated with database backends.",
            icon: "cpu"
        },
        {
            title: "Website Maintenance",
            desc: "Speed optimization, code updates, content management, and security patches.",
            icon: "wrench"
        }
    ],
    messages: []
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
    renderProfile();
    renderSkills();
    renderServices();
    initIcons();
    initParticleCanvas();
});

function initIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

function loadSavedData() {
    const localProfile = localStorage.getItem("az_portfolio_profile");
    if (localProfile) portfolioData.profile = JSON.parse(localProfile);

    const localSkills = localStorage.getItem("az_portfolio_skills");
    if (localSkills) portfolioData.skills = JSON.parse(localSkills);

    const localMessages = localStorage.getItem("az_portfolio_messages");
    if (localMessages) portfolioData.messages = JSON.parse(localMessages);
}

function renderProfile() {
    const p = portfolioData.profile;
    document.getElementById("heroProfileImg").src = p.photoUrl;
    document.getElementById("aboutBioDisplay").innerHTML = `<p>${p.bio}</p>`;
    document.getElementById("aboutEducationDisplay").innerText = p.education;
    document.getElementById("aboutGoalsDisplay").innerText = p.goals;
    
    document.getElementById("contactEmailDisplay").innerText = p.email;
    document.getElementById("contactEmailLink").href = `mailto:${p.email}`;
    
    document.getElementById("contactWaDisplay1").innerText = p.wa1;
    document.getElementById("contactWaLink1").href = `https://wa.me/234${p.wa1.replace(/^0/, '')}`;
    
    document.getElementById("contactWaDisplay2").innerText = p.wa2;
    document.getElementById("contactWaLink2").href = `https://wa.me/234${p.wa2.replace(/^0/, '')}`;

    document.getElementById("footerNameDisplay").innerText = p.name;
}

function renderSkills() {
    const container = document.getElementById("skillsGrid");
    container.innerHTML = portfolioData.skills.map(s => `
        <div class="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800 text-center hover:border-electric-500 transition-all hover:-translate-y-1 group shadow-sm">
            <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-electric-500 transition-colors">${s.name}</span>
            <span class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 block">${s.category || 'Core'}</span>
        </div>
    `).join("");
}

function renderServices() {
    const container = document.getElementById("servicesGrid");
    container.innerHTML = portfolioData.services.map(s => `
        <div class="p-6 rounded-3xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-electric-500/50 transition-all space-y-3 hover:-translate-y-1 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-500 flex items-center justify-center">
                <i data-lucide="${s.icon || 'code'}" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">${s.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${s.desc}</p>
            <a href="https://wa.me/234${portfolioData.profile.wa1.replace(/^0/, '')}?text=Hello%20Abdulaziz,%20I%20am%20interested%20in%20your%20${encodeURIComponent(s.title)}%20services." target="_blank" class="inline-flex items-center space-x-1 text-xs font-semibold text-electric-500 hover:underline pt-2">
                <span>Request Quote</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>
    `).join("");
    initIcons();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("hidden");
}

function handleDownloadCv(e) {
    e.preventDefault();
    if (portfolioData.profile.cvUrl && portfolioData.profile.cvUrl !== "#") {
        window.open(portfolioData.profile.cvUrl, "_blank");
    } else {
        showToast("CV file has not been uploaded yet.", "info");
    }
}

function handlePublicContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value;

    const newMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleDateString()
    };

    portfolioData.messages.push(newMessage);
    localStorage.setItem("az_portfolio_messages", JSON.stringify(portfolioData.messages));

    showToast("Message sent successfully!", "success");
    document.getElementById("publicContactForm").reset();
}

function showToast(msg, type="info") {
    const toast = document.getElementById("toastNotification");
    const text = document.getElementById("toastText");
    text.innerText = msg;
    toast.classList.remove("translate-y-20", "opacity-0");
    setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
    }, 3000);
}

// Lightweight particle canvas
function initParticleCanvas() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
        requestAnimationFrame(animate);
    }
    animate();
}
