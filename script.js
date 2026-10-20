// Alcohol Free Tracker — Web-to-App Attribution & UI Script
// Automatically formats App Store Connect campaign links (pt + ct + mt=8)
// so every web & SEO guide click is tracked inside App Store Connect > Analytics > Acquisition > Campaigns.

const ASC_CONFIG = {
  appId: "6791035303",
  providerToken: "1793695638", // Apple Developer / Provider ID (update in seo_config.json if needed)
  defaultCampaign: "web_organic"
};

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

(function enrichAppStoreCampaignLinks() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") || params.get("ref") || "";
  const utmCampaign = params.get("utm_campaign") || params.get("ct") || "";

  document.querySelectorAll('a[href*="apps.apple.com"]').forEach((link) => {
    let baseCampaign = link.getAttribute("data-campaign") || ASC_CONFIG.defaultCampaign;
    if (utmCampaign) {
      baseCampaign = `${baseCampaign}_${utmCampaign}`;
    } else if (utmSource) {
      baseCampaign = `${baseCampaign}_${utmSource}`;
    }
    // Apple ASC campaign token max length is 40 chars, alphanumeric + _ -
    const cleanCt = baseCampaign.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    const targetUrl = new URL(`https://apps.apple.com/app/apple-store/id${ASC_CONFIG.appId}`);
    targetUrl.searchParams.set("pt", ASC_CONFIG.providerToken);
    targetUrl.searchParams.set("ct", cleanCt);
    targetUrl.searchParams.set("mt", "8");
    link.href = targetUrl.toString();
  });
})();

// --- Interactive 3-Minute Urge Surfing Lab ---
(function initUrgeSurfingWidget() {
  const toggleBtn = document.getElementById("breathing-toggle-btn");
  const labelEl = document.getElementById("breathing-label");
  const clockEl = document.getElementById("breathing-clock");
  const haloEl = document.getElementById("breathing-halo");

  if (!toggleBtn || !labelEl || !clockEl) return;

  let isRunning = false;
  let remainingSeconds = 180;
  let cycleSeconds = 0;
  let timerInterval = null;

  function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    clockEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // 12-second box cycle: 4s Inhale, 4s Hold, 4s Exhale
    const phase = cycleSeconds % 12;
    if (phase < 4) {
      labelEl.textContent = "Inhale (4s)";
    } else if (phase < 8) {
      labelEl.textContent = "Hold (4s)";
    } else {
      labelEl.textContent = "Exhale (4s)";
    }
  }

  function start() {
    isRunning = true;
    toggleBtn.textContent = "Pause Reset";
    toggleBtn.style.background = "var(--ink)";
    toggleBtn.style.color = "white";
    if (haloEl) haloEl.style.animationPlayState = "running";

    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        cycleSeconds++;
        updateDisplay();
      } else {
        stop();
        labelEl.textContent = "Wave Passed ✨";
        toggleBtn.textContent = "Reset 3 Minutes";
        remainingSeconds = 180;
        cycleSeconds = 0;
      }
    }, 1000);
  }

  function stop() {
    isRunning = false;
    clearInterval(timerInterval);
    toggleBtn.textContent = "Resume Reset";
    toggleBtn.style.background = "";
    toggleBtn.style.color = "";
    if (haloEl) haloEl.style.animationPlayState = "paused";
  }

  toggleBtn.addEventListener("click", () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  });

  updateDisplay();
})();

// --- Interactive Body Recovery Timeline Switcher ---
(function initTimelineSwitcher() {
  const STAGES = {
    "8h": {
      stat: "Hour 8: Blood Sugar & Ethanol Clearance",
      desc: "Blood alcohol drops to 0.00. The liver shifts energy from alcohol detoxification back to glucose regulation, preventing nighttime hypoglycemic crashes."
    },
    "72h": {
      stat: "Day 3 (72h): Neurotransmitter Equilibrium",
      desc: "GABA and glutamate balance stabilizes. The brain fog, post-drinking jitters, and 'Hanxiety' (hangover anxiety) subside as your central nervous system baseline steadies."
    },
    "7d": {
      stat: "Day 7: Deep REM Sleep Architecture Restored",
      desc: "Alcohol suppresses Rapid Eye Movement sleep. By night 7 without alcohol, restorative REM cycles rebound (+40% efficiency) and resting heart rate drops by 4 to 8 BPM."
    },
    "30d": {
      stat: "Day 30: Hepatic Fat Drop & Dopamine Reset",
      desc: "Clinical studies demonstrate up to 15–20% reduction in liver fat. Natural dopamine receptor sensitivity returns, restoring intrinsic motivation and emotional resilience."
    }
  };

  const buttons = document.querySelectorAll(".timeline-pill-btn");
  const statEl = document.getElementById("timeline-stat");
  const descEl = document.getElementById("timeline-desc");

  if (!buttons.length || !statEl || !descEl) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stageKey = btn.getAttribute("data-stage");
      if (!STAGES[stageKey]) return;

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Smooth text transition
      statEl.style.opacity = "0";
      descEl.style.opacity = "0";

      setTimeout(() => {
        statEl.textContent = STAGES[stageKey].stat;
        descEl.textContent = STAGES[stageKey].desc;
        statEl.style.opacity = "1";
        descEl.style.opacity = "1";
      }, 140);
    });
  });

  statEl.style.transition = "opacity 140ms ease";
  descEl.style.transition = "opacity 140ms ease";
})();

