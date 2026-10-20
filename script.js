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
