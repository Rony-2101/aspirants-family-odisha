// Supabase Configuration
const SUPABASE_URL = "https://dyxfrxuiogqpjhibvesk.supabase.co";
const SUPABASE_KEY = "sb_publishable_4Pv-BiMKeGkWQGYfj2Octw_h_Cr1ZER";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// HTML Elements
const loginForm = document.getElementById("loginForm");
const loginCard = document.getElementById("loginCard");
const app = document.getElementById("app");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginMsg = document.getElementById("loginMsg");
const logout = document.getElementById("logout");

const jobForm = document.getElementById("jobForm");
const jobId = document.getElementById("jobId");
const title = document.getElementById("title");
const organization = document.getElementById("organization");
const category = document.getElementById("category");
const lastDate = document.getElementById("lastDate");
const pdfUrl = document.getElementById("pdfUrl");
const applyUrl = document.getElementById("applyUrl");
const description = document.getElementById("description");
const active = document.getElementById("active");
const formMsg = document.getElementById("formMsg");
const jobs = document.getElementById("jobs");
const heading = document.getElementById("heading");
const refresh = document.getElementById("refresh");

// Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginMsg.textContent = "Logging in...";

    const { error } = await db.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
    });

    if (error) {
        loginMsg.textContent = error.message;
        return;
    }

    loginMsg.textContent = "";
    showApp();
});

// Check Login
async function checkLogin() {
    const { data, error } = await db.auth.getSession();

    if (error) {
        loginMsg.textContent = error.message;
        return;
    }

    if (data.session) {
        showApp();
    } else {
        loginCard.hidden = false;
        app.hidden = true;
    }
}

// Show Admin Panel
function showApp() {
    loginCard.hidden = true;
    app.hidden = false;
    loadJobs();
}

// Logout
logout.addEventListener("click", async () => {
    await db.auth.signOut();
    location.reload();
});

// Add or Update Vacancy
jobForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formMsg.textContent = "Saving vacancy...";

    const job = {
        title: title.value.trim(),
        organization: organization.value.trim(),
        category: category.value,
        last_date: lastDate.value || null,
        pdf_url: pdfUrl.value.trim() || null,
        apply_url: applyUrl.value.trim() || null,
        description: description.value.trim(),
        active: active.checked
    };

    let result;

    if (jobId.value) {
        result = await db
            .from("jobs")
            .update(job)
            .eq("id", jobId.value);
    } else {
        result = await db
            .from("jobs")
            .insert([job]);
    }

    if (result.error) {
        formMsg.textContent = result.error.message;
        return;
    }

    formMsg.textContent = "Vacancy saved successfully!";

    jobForm.reset();
    jobId.value = "";
    heading.textContent = "Add New Vacancy";

    loadJobs();
});

// Load Vacancies
async function loadJobs() {
    jobs.innerHTML = "Loading vacancies...";

    const { data, error } = await db
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        jobs.textContent = error.message;
        return;
    }

    if (!data || data.length === 0) {
        jobs.textContent = "No vacancies found.";
        return;
    }

    jobs.innerHTML = "";

    data.forEach((job) => {
        const item = document.createElement("div");
        item.className = "job-item";

        const name = document.createElement("h3");
        name.textContent = job.title;

        const org = document.createElement("p");
        org.textContent = job.organization || "";

        const status = document.createElement("p");
        status.textContent = job.active ? "Active" : "Inactive";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.type = "button";
        editBtn.addEventListener("click", () => editJob(job));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.addEventListener("click", () => deleteJob(job.id));

        item.append(name, org, status, editBtn, deleteBtn);
        jobs.appendChild(item);
    });
}

// Edit Vacancy
function editJob(job) {
    jobId.value = job.id;
    title.value = job.title || "";
    organization.value = job.organization || "";
    category.value = job.category || "";
    lastDate.value = job.last_date || "";
    pdfUrl.value = job.pdf_url || "";
    applyUrl.value = job.apply_url || "";
    description.value = job.description || "";
    active.checked = job.active;

    heading.textContent = "Edit Vacancy";
    formMsg.textContent = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
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

    alert("Vacancy deleted successfully!");
    loadJobs();
}

// Refresh Vacancies
refresh.addEventListener("click", loadJobs);

// Start
checkLogin();
