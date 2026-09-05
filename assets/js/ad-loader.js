(function() {
  function renderAd(container, adData) {
    if (!adData || !container) return;

    var mediaUrl = adData.media_url || '/assets/img/combo_365_google_canva.jpg';
    mediaUrl = mediaUrl.replace('/assets/img/combos/', '/assets/img/');

    var isVideo = adData.media_type === 'video' || (mediaUrl && mediaUrl.match(/\.(mp4|webm)$/i));
    var mediaHtml = '';

    if (isVideo) {
      mediaHtml = '<video src="' + mediaUrl + '" autoplay loop muted playsinline></video>';
    } else {
      mediaHtml = '<img src="' + mediaUrl + '" alt="' + (adData.title || 'Oferta especial') + '" onerror="this.onerror=null;this.src=\'/assets/img/combo_365_google_canva.jpg\';">';
    }

    var adBadge = adData.badge || 'OFERTA DESTACADA';
    var adTitle = adData.title || '';
    var adDesc = adData.desc || '';
    var adCta = adData.cta_text || 'Consultar por WhatsApp →';
    var adLink = adData.link_url || '#';
    var cleanTitle = adTitle.replace(/'/g, '');

    container.innerHTML = 
      '<div class="ad-slot-card">' +
        '<span class="ad-badge">' + adBadge + '</span>' +
        '<div class="ad-media-wrap">' + mediaHtml + '</div>' +
        '<h4 class="ad-title">' + adTitle + '</h4>' +
        '<p class="ad-desc">' + adDesc + '</p>' +
        '<a class="ad-cta-btn" href="' + adLink + '" target="_blank" onclick="if(window.gtag){gtag(\'event\',\'ad_click\',{ad_title:\'' + cleanTitle + '\'});}">' +
          adCta +
        '</a>' +
      '</div>';
  }

  function resolveAd(adId, adsData) {
    if (!adsData) return null;
    if (adsData[adId]) return adsData[adId];

    if (adId.indexOf('_confianza_ad') !== -1 && adsData['global_confianza_ad']) {
      return adsData['global_confianza_ad'];
    }
    if (adId.indexOf('_yape_ad') !== -1 && adsData['global_yape_ad']) {
      return adsData['global_yape_ad'];
    }
    if (adId.indexOf('_wu_ad') !== -1 && adsData['global_wu_ad']) {
      return adsData['global_wu_ad'];
    }

    return adsData['global_yape_ad'] || null;
  }

  function initAds() {
    var slots = document.querySelectorAll('.ad-slot');
    if (!slots.length) return;

    function applyAds(data) {
      slots.forEach(function(slot) {
        var adId = slot.getAttribute('data-ad-id');
        if (adId) {
          var ad = resolveAd(adId, data);
          if (ad) renderAd(slot, ad);
        }
      });
    }

    // 1. Instant render from localStorage if present
    var customAds = null;
    try {
      var stored = localStorage.getItem('jnxkeys_custom_ads');
      if (stored) customAds = JSON.parse(stored);
    } catch(e) {}

    if (customAds) {
      applyAds(customAds);
    }

    // 2. Fetch fresh ads.json with cache buster to synchronize with disk/server updates
    fetch('/assets/data/ads.json?t=' + Date.now())
      .then(function(res) {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(function(adsData) {
        applyAds(adsData);
      })
      .catch(function(err) {
        if (!customAds) {
          console.warn('JNxKeys ad-loader fallback:', err.message);
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
