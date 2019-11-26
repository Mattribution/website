import Fingerprint2 from "fingerprintjs2";

// function getUrlVars() {
//   var vars = {};
//   var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
//     m,
//     key,
//     value
//   ) {
//     vars[key] = value;
//   });
//   return vars;
// }

// function getUrlParam(parameter, defaultvalue) {
//   var urlparameter = defaultvalue;
//   if (window.location.href.indexOf(parameter) > -1) {
//     urlparameter = getUrlVars()[parameter];
//   }
//   return urlparameter;
// }

function track(event, userId, extra) {
  async function sendTrackingInfo(fpHash) {
    var urlParams = new URLSearchParams(window.location.search);
    const data = {
      userId: userId || null,
      fpHash,
      pageURL: window.location.href,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      pageReferrer: document.referrer,
      event,
      campaignSource: urlParams.get("campaign_source"),
      campaignMedium: urlParams.get("campaign_medium"),
      campaignName: urlParams.get("campaign_name"),
      campaignContent: urlParams.get("campaign_content"),
      sentAt: Date.now()
    };

    const encoded = btoa(JSON.stringify(data));
    const response = await fetch(
      `http://localhost:8080/v1/pixel/track?data=${encoded}`
    );
  }

  // Get fingerprint
  if (window.requestIdleCallback) {
    requestIdleCallback(function() {
      Fingerprint2.get(async function(components) {
        var values = components.map(function(component) {
          return component.value;
        });
        var murmur = Fingerprint2.x64hash128(values.join(""), 31);
        await sendTrackingInfo(murmur);
      });
    });
  } else {
    setTimeout(function() {
      Fingerprint2.get(async function(components) {
        var values = components.map(function(component) {
          return component.value;
        });
        var murmur = Fingerprint2.x64hash128(values.join(""), 31);
        await sendTrackingInfo(mrumur);
      });
    }, 500);
  }
}

export default { track };
