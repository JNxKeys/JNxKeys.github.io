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
    var adCta = adData.cta_text || 'Ver Combo';
    var adLink = adData.link_url || '/combos/';
    var cleanTitle = adTitle.replace(/'/g, '');

    // Formato especial: Tarjeta integrada en el carrusel de Packs y Combos
    if (container.classList.contains('ad-slot-combo')) {
      var badgeContent = '';
      if (mediaUrl) {
        badgeContent = isVideo
          ? '<video src="' + mediaUrl + '" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;border-radius:16px;"></video>'
          : '<img src="' + mediaUrl + '" alt="' + cleanTitle + '" style="width:100%;height:100%;object-fit:cover;border-radius:16px;" onerror="this.onerror=null;this.src=\'/assets/img/combo_365_google_canva.jpg\';">';
      }

      container.innerHTML = 
        '<a class="combo-card combo-card-featured" href="' + adLink + '" onclick="if(window.gtag){gtag(\'event\',\'combo_click\',{combo:\'' + cleanTitle + '\'});}">' +
          '<div>' +
            '<div class="combo-top">' +
              '<span class="combo-tag" style="background: rgba(37,99,235,0.12); color: #1D4ED8; border: 1px solid rgba(37,99,235,0.25);">' + adBadge + '</span>' +
              '<span class="combo-save" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #fff;">DESTACADO</span>' +
            '</div>' +
            '<div class="combo-middle">' +
              '<div class="combo-middle-info">' +
                '<h3 class="combo-title">' + adTitle + '</h3>' +
                '<p class="combo-includes">' + adDesc + '</p>' +
              '</div>' +
              '<div class="combo-visual-badge" title="' + cleanTitle + '">' +
                badgeContent +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="combo-price-row" style="justify-content: space-between; align-items: center; width: 100%; border-top: 1px dashed rgba(37,99,235,0.25); padding-top: 12px; margin-top: 14px;">' +
            '<span class="combo-new-price" style="font-size: 15px; font-weight: 800; color: #2563EB; display: flex; align-items: center; gap: 4px;">' +
              adCta + ' →' +
            '</span>' +
            '<div style="width: 32px; height: 32px; border-radius: 50%; background: #EFF6FF; border: 1px solid rgba(37,99,235,0.25); display: flex; align-items: center; justify-content: center; color: #2563EB;">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>' +
            '</div>' +
          '</div>' +
        '</a>';
      return;
    }

    // Formato estándar para otras páginas y pasarelas
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
