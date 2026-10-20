let isAdminAuthenticated = false;

function openAdminModal() {
    document.getElementById("adminLoginModal").classList.remove("hidden");
}

function closeAdminModal() {
    document.getElementById("adminLoginModal").classList.add("hidden");
}

function handleAdminLogin(e) {
    e.preventDefault();
    const input = document.getElementById("adminPasswordInput").value;
    if (input === "admin123") {
        isAdminAuthenticated = true;
        closeAdminModal();
        openAdminDashboard();
    } else {
        document.getElementById("adminLoginError").classList.remove("hidden");
    }
}

function openAdminDashboard() {
    if (!isAdminAuthenticated) return openAdminModal();
    document.getElementById("adminDashboardOverlay").classList.remove("hidden");
    renderAdminStats();
    populateAdminProfileForm();
    renderAdminProjectsTable();
    renderAdminSkillsList();
    renderAdminInbox();
}

function closeAdminDashboard() {
    document.getElementById("adminDashboardOverlay").classList.add("hidden");
}

function switchAdminTab(tab) {
    document.querySelectorAll(".admin-tab-btn").forEach(b => {
        b.classList.remove("border-electric-500", "text-electric-400");
        b.classList.add("border-transparent", "text-slate-400");
    });
    document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));

    event.target.classList.add("border-electric-500", "text-electric-400");
    document.getElementById(`adminTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.remove("hidden");
}

function renderAdminStats() {
    document.getElementById("dashTotalProj").innerText = projectsData.length;
    document.getElementById("dashPubProj").innerText = projectsData.filter(p => p.status === "published").length;
    document.getElementById("dashDraftProj").innerText = projectsData.filter(p => p.status === "draft").length;
    document.getElementById("dashMessagesCount").innerText = portfolioData.messages.length;
}

function populateAdminProfileForm() {
    const p = portfolioData.profile;
    document.getElementById("editName").value = p.name;
    document.getElementById("editTitle").value = p.title;
    document.getElementById("editEmail").value = p.email;
    document.getElementById("editWa1").value = p.wa1;
    document.getElementById("editWa2").value = p.wa2;
    document.getElementById("editPhotoUrl").value = p.photoUrl;
    document.getElementById("editBio").value = p.bio;
    document.getElementById("editCvUrl").value = p.cvUrl || "";
}

function handleProfileUpdate(e) {
    e.preventDefault();
    portfolioData.profile.name = document.getElementById("editName").value;
    portfolioData.profile.title = document.getElementById("editTitle").value;
    portfolioData.profile.email = document.getElementById("editEmail").value;
    portfolioData.profile.wa1 = document.getElementById("editWa1").value;
    portfolioData.profile.wa2 = document.getElementById("editWa2").value;
    portfolioData.profile.photoUrl = document.getElementById("editPhotoUrl").value;
    portfolioData.profile.bio = document.getElementById("editBio").value;
    portfolioData.profile.cvUrl = document.getElementById("editCvUrl").value;

    localStorage.setItem("az_portfolio_profile", JSON.stringify(portfolioData.profile));
    renderProfile();
    showToast("Profile details updated successfully!", "success");
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById("editPhotoUrl").value = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function renderAdminProjectsTable() {
    const body = document.getElementById("adminProjectsTableBody");
    body.innerHTML = projectsData.map(p => `
        <tr>
            <td class="p-4 font-semibold text-white">${p.title}</td>
            <td class="p-4">${p.category}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                    ${p.status}
                </span>
            </td>
            <td class="p-4 flex items-center space-x-2">
                <button onclick="editProjectModal('${p.id}')" class="px-2 py-1 bg-slate-800 text-electric-400 rounded">Edit</button>
                <button onclick="deleteProjectRecord('${p.id}')" class="px-2 py-1 bg-red-900/40 text-red-400 rounded">Delete</button>
            </td>
        </tr>
    `).join("");
}

function openProjectEditModal() {
    document.getElementById("projectModalTitle").innerText = "Add New Project";
    document.getElementById("projEditId").value = "";
    document.getElementById("projEditTitle").value = "";
    document.getElementById("projEditShortDesc").value = "";
    document.getElementById("projEditFullDesc").value = "";
    document.getElementById("projEditTech").value = "";
    document.getElementById("projEditLiveUrl").value = "";
    document.getElementById("projEditCoverUrl").value = "";
    document.getElementById("adminProjectFormModal").classList.remove("hidden");
}

function closeProjectEditModal() {
    document.getElementById("adminProjectFormModal").classList.add("hidden");
}

function editProjectModal(id) {
    const p = projectsData.find(item => item.id === id);
    if (!p) return;

    document.getElementById("projectModalTitle").innerText = "Edit Project";
    document.getElementById("projEditId").value = p.id;
    document.getElementById("projEditTitle").value = p.title;
    document.getElementById("projEditCategory").value = p.category;
    document.getElementById("projEditStatus").value = p.status;
    document.getElementById("projEditShortDesc").value = p.shortDesc;
    document.getElementById("projEditFullDesc").value = p.fullDesc || "";
    document.getElementById("projEditTech").value = (p.tech || []).join(", ");
    document.getElementById("projEditLiveUrl").value = p.liveUrl || "";
    document.getElementById("projEditCoverUrl").value = p.coverUrl || "";

    document.getElementById("adminProjectFormModal").classList.remove("hidden");
}

function handleSaveProject(e) {
    e.preventDefault();
    const id = document.getElementById("projEditId").value;
    const title = document.getElementById("projEditTitle").value;
    const category = document.getElementById("projEditCategory").value;
    const status = document.getElementById("projEditStatus").value;
    const shortDesc = document.getElementById("projEditShortDesc").value;
    const fullDesc = document.getElementById("projEditFullDesc").value;
    const techStr = document.getElementById("projEditTech").value;
    const liveUrl = document.getElementById("projEditLiveUrl").value;
    const coverUrl = document.getElementById("projEditCoverUrl").value;

    const techArray = techStr.split(",").map(s => s.trim()).filter(Boolean);

    if (id) {
        const index = projectsData.findIndex(item => item.id === id);
        if (index !== -1) {
            projectsData[index] = { ...projectsData[index], title, category, status, shortDesc, fullDesc, tech: techArray, liveUrl, coverUrl };
        }
    } else {
        const newProj = {
            id: "proj_" + Date.now(),
            title, category, status, shortDesc, fullDesc, tech: techArray, liveUrl, coverUrl
        };
        projectsData.push(newProj);
    }

    localStorage.setItem("az_portfolio_projects", JSON.stringify(projectsData));
    renderAdminProjectsTable();
    renderPublicProjects("All");
    renderAdminStats();
    closeProjectEditModal();
    showToast("Project saved successfully!", "success");
}

function deleteProjectRecord(id) {
    if (confirm("Are you sure you want to delete this project?")) {
        projectsData = projectsData.filter(p => p.id !== id);
        localStorage.setItem("az_portfolio_projects", JSON.stringify(projectsData));
        renderAdminProjectsTable();
        renderPublicProjects("All");
        renderAdminStats();
        showToast("Project removed.", "info");
    }
}

function renderAdminSkillsList() {
    const list = document.getElementById("adminSkillsList");
    list.innerHTML = portfolioData.skills.map((s, idx) => `
        <div class="p-3 bg-slate-800 rounded-xl flex items-center justify-between text-xs text-white">
            <span>${s.name}</span>
            <button onclick="removeSkill(${idx})" class="text-red-400 hover:text-red-300"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div>
    `).join("");
    if (window.lucide) lucide.createIcons();
}

function handleAddNewSkill(e) {
    e.preventDefault();
    const name = document.getElementById("newSkillName").value;
    const category = document.getElementById("newSkillCategory").value || "General";
    portfolioData.skills.push({ name, category });
    localStorage.setItem("az_portfolio_skills", JSON.stringify(portfolioData.skills));
    renderAdminSkillsList();
    renderSkills();
    document.getElementById("newSkillName").value = "";
    showToast("New skill added!", "success");
}

function removeSkill(index) {
    portfolioData.skills.splice(index, 1);
    localStorage.setItem("az_portfolio_skills", JSON.stringify(portfolioData.skills));
    renderAdminSkillsList();
    renderSkills();
}

function renderAdminInbox() {
    const box = document.getElementById("adminInboxList");
    if (portfolioData.messages.length === 0) {
        box.innerHTML = `<p class="text-xs text-slate-500">No contact submissions received yet.</p>`;
        return;
    }

    box.innerHTML = portfolioData.messages.map(m => `
        <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <div class="flex items-center justify-between">
                <span class="font-bold text-white">${m.name} (${m.email})</span>
                <span class="text-slate-500">${m.date}</span>
            </div>
            <p class="text-electric-400 font-semibold">${m.subject}</p>
            <p class="text-slate-300">${m.message}</p>
        </div>
    `).join("");
}

function saveAdminStateToLocalStorage() {
    localStorage.setItem("az_portfolio_profile", JSON.stringify(portfolioData.profile));
    localStorage.setItem("az_portfolio_projects", JSON.stringify(projectsData));
    localStorage.setItem("az_portfolio_skills", JSON.stringify(portfolioData.skills));
    showToast("All admin configurations persisted to local database!", "success");
}
