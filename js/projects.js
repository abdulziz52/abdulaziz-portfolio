let initialProjects = [
    {
        id: "proj_1",
        title: "Latest Designer Furniture",
        category: "Business Website",
        status: "published",
        shortDesc: "A sleek furniture showroom platform displaying modern furniture lines.",
        fullDesc: "A furniture business website designed to showcase furniture products and provide customers with a convenient way to explore products and contact the business directly.",
        tech: ["HTML", "CSS", "JavaScript"],
        liveUrl: "https://lates-designer-furniture.netlify.app",
        coverUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "proj_2",
        title: "Online Student Complaint Logging System",
        category: "Web Application",
        status: "published",
        shortDesc: "Multi-tenant complaint ticketing portal for Nigerian polytechnics & universities.",
        fullDesc: "An online complaint logging and ticketing management platform designed to help educational institutions organize student complaints, track tickets, and improve complaint handling across multiple campuses.",
        tech: ["HTML", "CSS", "JavaScript", "LocalStorage"],
        liveUrl: "https://student-complaint-tecting-l-system.netlify.app",
        coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "proj_3",
        title: "Hospital Location & Directory System",
        category: "Academic Project",
        status: "published",
        shortDesc: "Map-based emergency healthcare search and directory service.",
        fullDesc: "Design and Implementation of Hospital Location and Directory System Using Google Map API. Enables users to locate verified healthcare centers in real-time.",
        tech: ["HTML", "CSS", "JavaScript", "Google Maps API"],
        liveUrl: "",
        coverUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "proj_4",
        title: "AMZ Smart Ride & Smart Delivery",
        category: "Startup Concept",
        status: "published",
        shortDesc: "Proposed multi-service logistics & ride-hailing prototype for Nigeria.",
        fullDesc: "A proposed mobile-first transport and delivery platform designed for the Nigerian market, featuring bike dispatch, parcel courier, rider dispatch tracking, and administrative control.",
        tech: ["UI/UX Design", "Web Concept", "Prototype"],
        liveUrl: "",
        coverUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800"
    }
];

let projectsData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    renderPublicProjects("All");
});

function loadProjects() {
    const localProj = localStorage.getItem("az_portfolio_projects");
    if (localProj) {
        projectsData = JSON.parse(localProj);
    } else {
        projectsData = [...initialProjects];
        localStorage.setItem("az_portfolio_projects", JSON.stringify(projectsData));
    }
}

function renderPublicProjects(filter = "All") {
    const grid = document.getElementById("projectsGrid");
    const published = projectsData.filter(p => p.status === "published");
    const filtered = filter === "All" ? published : published.filter(p => p.category === filter);

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-12 text-sm">No projects published under this category yet.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white dark:bg-navy-900/60 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-electric-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 shadow-md">
            <div>
                <div class="h-48 overflow-hidden relative">
                    <img src="${p.coverUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-electric-400 text-[10px] font-bold uppercase tracking-wider">
                        ${p.category}
                    </span>
                </div>
                <div class="p-6 space-y-3">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-electric-500 transition-colors">${p.title}</h3>
                    <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">${p.shortDesc}</p>
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        ${(p.tech || []).map(t => `<span class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">${t}</span>`).join("")}
                    </div>
                </div>
            </div>

            <div class="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4">
                <button onclick="viewProjectDetails('${p.id}')" class="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-electric-500 flex items-center space-x-1">
                    <span>Details</span>
                    <i data-lucide="info" class="w-3.5 h-3.5"></i>
                </button>

                ${p.liveUrl ? `
                    <a href="${p.liveUrl}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-electric-500 text-white text-xs font-semibold shadow-md shadow-electric-500/20 flex items-center space-x-1">
                        <span>Live Site</span>
                        <i data-lucide="external-link" class="w-3 h-3"></i>
                    </a>
                ` : `<span class="text-[10px] text-slate-400 italic">Concept Demo</span>`}
            </div>
        </div>
    `).join("");

    if (window.lucide) lucide.createIcons();
}

function filterProjects(category) {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("bg-electric-500", "text-white");
        btn.classList.add("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");
    });
    event.target.classList.add("bg-electric-500", "text-white");
    renderPublicProjects(category);
}

function viewProjectDetails(id) {
    const p = projectsData.find(item => item.id === id);
    if (!p) return;

    const content = document.getElementById("modalProjectContent");
    content.innerHTML = `
        <img src="${p.coverUrl}" class="w-full h-56 sm:h-72 object-cover rounded-2xl">
        <div>
            <span class="text-xs font-bold uppercase text-electric-500">${p.category}</span>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">${p.title}</h2>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${p.fullDesc || p.shortDesc}</p>
        <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technologies</h4>
            <div class="flex flex-wrap gap-2">
                ${(p.tech || []).map(t => `<span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200">${t}</span>`).join("")}
            </div>
        </div>
        ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-electric-500 text-white text-sm font-semibold shadow-lg shadow-electric-500/20">
                <span>Visit Live Platform</span>
                <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
        ` : ''}
    `;

    document.getElementById("projectDetailModal").classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
}

function closeProjectModal() {
    document.getElementById("projectDetailModal").classList.add("hidden");
}
