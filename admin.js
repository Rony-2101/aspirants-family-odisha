// ===== SUPABASE CONFIG =====
window.onerror = function(message) {
  alert("ERROR: " + message);
};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("loginForm").addEventListener("submit", function() {
    alert("LOGIN BUTTON WORKING");
  });
});
const SUPABASE_URL = "https://dyxfrxuiogqpjhibvesk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4Pv-BiMKeGkWQGYfj2Octw_h_Cr1ZER";

let sb = null;
let editingId = null;

const $ = id => document.getElementById(id);

function configured(){
  return SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("YOUR_") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("YOUR_");
}

async function init(){
  if(!configured()){
    $("loginMsg").textContent =
      "Supabase is not configured yet.";
    return;
  }

  sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const {data:{session}} =
    await sb.auth.getSession();

  if(session) showApp(session.user);
}

init();

$("loginForm").addEventListener("submit", async e=>{
  e.preventDefault();

  if(!sb){
    $("loginMsg").textContent =
      "Configure Supabase first.";
    return;
  }

  $("loginMsg").textContent = "Logging in...";

  const {data,error} =
    await sb.auth.signInWithPassword({
      email: $("email").value.trim(),
      password: $("password").value
    });

  if(error){
    $("loginMsg").textContent = error.message;
    return;
  }

  showApp(data.user);
});

async function showApp(user){
  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("adminEmail").textContent = user.email || "";
  await loadJobs();
}

$("logout").onclick = async ()=>{
  await sb.auth.signOut();
  location.reload();
};

document.querySelectorAll("[data-page]")
.forEach(btn =>
  btn.addEventListener("click", ()=>{
    const p = btn.dataset.page;

    document.querySelectorAll(".page")
      .forEach(x => x.classList.add("hidden"));

    $(p).classList.remove("hidden");

    document.querySelectorAll(".nav")
      .forEach(x =>
        x.classList.toggle(
          "active",
          x.dataset.page === p
        )
      );

    if(p === "jobs" || p === "dashboard")
      loadJobs();

    document
      .querySelector(".sidebar")
      .classList.remove("open");
  })
);

$("menu").onclick = () =>
  document.querySelector(".sidebar")
    .classList.toggle("open");

async function loadJobs(){
  if(!sb) return;

  const {data,error} =
    await sb.from("jobs")
      .select("*")
      .order("created_at",{ascending:false});

  if(error){
    $("recentJobs").innerHTML =
      `<p class="msg">${error.message}</p>`;
    return;
  }

  $("jobCount").textContent = data.length;

  $("activeCount").textContent =
    data.filter(x => x.active).length;

  renderJobs(data.slice(0,5),"recentJobs");
  renderJobs(data,"allJobs");
}

function renderJobs(data,target){
  const el = $(target);

  if(!data.length){
    el.innerHTML =
      "<p>No jobs yet. Add your first recruitment.</p>";
    return;
  }

  el.innerHTML = data.map(j =>
