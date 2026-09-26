// Supabase Configuration
const SUPABASE_URL = "https://dyxfrxuiogqpjhibvesk.supabase.co";
const SUPABASE_KEY = "sb_publishable_4Pv-BiMKeGkWQGYfj2Octw_h_Cr1ZER";

const $ = id => document.getElementById(id);
let db;

// Initialize Supabase
async function init() {
    if (!window.supabase) {
        $("loginMsg").textContent =
            "Supabase load nahi hua. Page refresh karo.";
        return;
    }

    db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const { data, error } = await db.auth.getSession();

    if (error) {
        $("loginMsg").textContent = error.message;
        return;
    }

    if (data.session) {
        openPanel(data.session.user);
    }
}

// Login
$("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    if (!db) {
        $("loginMsg").textContent =
            "Please refresh the page.";
        return;
    }

    $("loginMsg").textContent = "Logging in...";

    const { data, error } = await db.auth.signInWithPassword({
        email: $("email").value.trim(),
        password: $("password").value
    });

    if (error) {
        $("loginMsg").textContent = error.message;
        return;
    }

    $("loginMsg").textContent = "";
    openPanel(data.user);
});

// Open Admin Panel
function openPanel(user) {
    $("loginCard").classList.add("hidden");
    $("app").classList.remove("hidden");
    loadJobs();
}

// Logout
$("logout").addEventListener("click", async () => {
    await db.auth.signOut();
    location.reload();
});

// Save Vacancy
$("jobForm").addEventListener("submit", async e => {
    e.preventDefault();

    $("formMsg").textContent = "Saving...";

    const job = {
        title: $("title").value.trim(),
        organization: $("organization").value.trim(),
        category: $("category").value.trim() || "Government Jobs",
        last_date: $("lastDate").value || null,
        pdf_url: $("pdfUrl").value.trim() || null,
        apply_url: $("applyUrl").value.trim() || null,
        description: $("description").value.trim(),
        active: $("active").checked
    };

    const id = $("jobId").value;

    const result = id
        ? await db.from("jobs").update(job).eq("id", id)
        : await db.from("jobs").insert(job);

    if (result.error) {
        $("formMsg").textContent = result.error.message;
        return;
    }

    $("formMsg").textContent = "Vacancy saved successfully!";
    resetForm();
    loadJobs();
});

// Load Vacancies
async function loadJobs() {
    $("jobs").textContent = "Loading...";

    const { data, error } = await db
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        $("jobs").textContent = error.message;
        return;
    }

    if (!data.length) {
        $("jobs").textContent = "No vacancies yet.";
        return;
    }

    $("jobs").innerHTML = data.map(job => `
        <div class="job">
            <h4>${escapeHTML(job.title)}</h4>
            <p>${escapeHTML(job.organization)}</p>
            <p>${job.active ? "Published" : "Draft"}</p>
            <button class="alt" data-edit="${job.id}">
                Edit
            </button>
            <button data-delete="${job.id}">
                Delete
            </button>
        </div>
    `).join("");

    $("jobs").querySelectorAll("[data-edit]").forEach(button => {
        button.onclick = () => {
            editJob(data.find(job => job.id === button.dataset.edit));
        };
    });

    $("jobs").querySelectorAll("[data-delete]").forEach(button => {
        button.onclick = () => deleteJob(button.dataset.delete);
    });
}

// Edit Vacancy
function editJob(job) {
    $("jobId").value = job.id;
    $("title").value = job.title || "";
    $("organization").value = job.organization || "";
    $("category").value = job.category || "Government Jobs";
    $("lastDate").value = job.last_date || "";
    $("pdfUrl").value = job.pdf_url || "";
    $("applyUrl").value = job.apply_url || "";
    $("description").value = job.description || "";
    $("active").checked = !!job.active;

    $("heading").textContent = "Edit Vacancy";
    window.scrollTo(0, 0);
}

// Delete Vacancy
async function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this vacancy?")) {
        return;
    }

    const { error } = await db
        .from("jobs")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadJobs();
}

// Clear Form
function resetForm() {
    $("jobForm").reset();
    $("jobId").value = "";
    $("category").value = "Government Jobs";
    $("active").checked = true;
    $("heading").textContent = "Add Vacancy";
    $("formMsg").textContent = "";
}

// Refresh Button
$("refresh").addEventListener("click", loadJobs);

// Escape HTML for safe display
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Start
init().catch(error => {
    $("loginMsg").textContent = error.message;
});job.active ? "Published" : "Draft"}</p>
            <button class="alt" data-edit="${job.id}">
                Edit
            </button>
            <button data-delete="${job.id}">
                Delete
            </button>
        </div>
    `).join("");

    $("jobs").querySelectorAll("[data-edit]").forEach(button => {
        button.onclick = () => {
            editJob(data.find(job => job.id === button.dataset.edit));
        };
    });

    $("jobs").querySelectorAll("[data-delete]").forEach(button => {
        button.onclick = () => deleteJob(button.dataset.delete);
    });
}

// Edit Vacancy
function editJob(job) {
    $("jobId").value = job.id;
    $("title").value = job.title || "";
    $("organization").value = job.organization || "";
    $("category").value = job.category || "Government Jobs";
    $("lastDate").value = job.last_date || "";
    $("pdfUrl").value = job.pdf_url || "";
    $("applyUrl").value = job.apply_url || "";
    $("description").value = job.description || "";
    $("active").checked = !!job.active;

    $("heading").textContent = "Edit Vacancy";
    window.scrollTo(0, 0);
}

// Delete Vacancy
async function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this vacancy?")) {
        return;
    }

    const { error } = await db
        .from("jobs")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadJobs();
}

// Clear Form
function resetForm() {
    $("jobForm").reset();
    $("jobId").value = "";
    $("category").value = "Government Jobs";
    $("active").checked = true;
    $("heading").textContent = "Add Vacancy";
    $("formMsg").textContent = "";
}

// Refresh Button
$("refresh").addEventListener("click", loadJobs);

// Escape HTML for safe display
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Start
init().catch(error => {
    $("loginMsg").textContent = error.message;
});
