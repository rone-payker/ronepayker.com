/**
 * RonePayker Agency Upgrade Script
 * Handles mobile drawer navigation, Landing Page Funnel filtering, and interactive service selection.
 */
(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    var body = document.querySelector("body");
    var mobileToggleBtn = document.querySelector(".mobile-nav-toggle");
    var mobileCloseBtn = document.querySelector(".mobile-menu-close");
    var mobileBackdrop = document.getElementById("mobileNavBackdrop");

    function closeMobileMenu() {
      if (!body.classList.contains("mobile-nav-active")) return;
      body.classList.remove("mobile-nav-active");
      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute("aria-expanded", "false");
        var icon = mobileToggleBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-x");
          icon.classList.add("bi-list");
        }
      }
    }

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener("click", function() {
        var isOpen = body.classList.contains("mobile-nav-active");
        mobileToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", closeMobileMenu);
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobileMenu);
    }

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });

    // Landing Page Funnel interactive filter pills
    var funnelPills = document.querySelectorAll(".funnel-pill");
    var funnelCards = document.querySelectorAll(".funnel-card");

    funnelPills.forEach(function(pill) {
      pill.addEventListener("click", function() {
        funnelPills.forEach(function(p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var selectedCat = pill.getAttribute("data-funnel-filter") || "all";

        funnelCards.forEach(function(card) {
          var cardCat = card.getAttribute("data-funnel-category");
          if (selectedCat === "all" || cardCat === selectedCat) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // Landing Page Funnel Image Click-to-Zoom Lightbox
    var funnelLightbox = document.getElementById("funnelLightbox");
    var flbStage = document.getElementById("flbStage");
    var flbImg = document.getElementById("flbImg");
    var flbCaption = document.getElementById("flbCaption");
    var flbCount = document.getElementById("flbCount");
    var flbClose = document.getElementById("flbClose");
    var flbPrev = document.getElementById("flbPrev");
    var flbNext = document.getElementById("flbNext");
    var flbZoomToggle = document.getElementById("flbZoomToggle");
    var funnelTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-funnel-zoom]"));
    var currentFunnelIdx = 0;
    var lastFunnelFocus = null;
    var touchStartX = 0;

    function getVisibleFunnelTriggers() {
      return funnelTriggers.filter(function(trigger) {
        var card = trigger.closest(".funnel-card");
        return !card || card.style.display !== "none";
      });
    }

    function setFunnelZoom(zoomed) {
      if (!flbStage || !flbZoomToggle) return;
      var icon = flbZoomToggle.querySelector("i");
      if (zoomed) {
        flbStage.classList.add("is-zoomed");
        if (icon) {
          icon.classList.remove("bi-zoom-in");
          icon.classList.add("bi-zoom-out");
        }
      } else {
        flbStage.classList.remove("is-zoomed");
        flbStage.scrollTop = 0;
        flbStage.scrollLeft = 0;
        if (icon) {
          icon.classList.remove("bi-zoom-out");
          icon.classList.add("bi-zoom-in");
        }
      }
    }

    function renderFunnelSlide(idx) {
      var visible = getVisibleFunnelTriggers();
      if (!visible.length || !flbImg) return;
      currentFunnelIdx = (idx + visible.length) % visible.length;
      var activeTrigger = visible[currentFunnelIdx];
      var imgEl = activeTrigger.querySelector("img");
      var cardEl = activeTrigger.closest(".funnel-card");
      var titleEl = cardEl ? cardEl.querySelector("h3") : null;

      setFunnelZoom(false);
      if (imgEl) {
        flbImg.src = imgEl.currentSrc || imgEl.src;
        flbImg.alt = imgEl.alt || "Landing Page Funnel Preview";
      }
      if (flbCaption) {
        flbCaption.textContent = titleEl ? titleEl.textContent : (imgEl ? imgEl.alt : "");
      }
      if (flbCount) {
        flbCount.textContent = (currentFunnelIdx + 1) + " / " + visible.length;
      }
    }

    function openFunnelLightbox(trigger) {
      if (!funnelLightbox) return;
      var visible = getVisibleFunnelTriggers();
      var idx = visible.indexOf(trigger);
      if (idx === -1) idx = 0;
      lastFunnelFocus = document.activeElement;
      renderFunnelSlide(idx);
      funnelLightbox.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function() {
        funnelLightbox.classList.add("open");
      });
      if (flbClose) flbClose.focus();
    }

    function closeFunnelLightbox() {
      if (!funnelLightbox || funnelLightbox.hidden) return;
      funnelLightbox.classList.remove("open");
      setFunnelZoom(false);
      document.body.style.overflow = "";
      setTimeout(function() {
        funnelLightbox.hidden = true;
      }, 250);
      if (lastFunnelFocus) lastFunnelFocus.focus();
    }

    funnelTriggers.forEach(function(trigger) {
      trigger.addEventListener("click", function() {
        openFunnelLightbox(trigger);
      });
      trigger.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFunnelLightbox(trigger);
        }
      });
    });

    if (flbClose) flbClose.addEventListener("click", closeFunnelLightbox);
    if (flbPrev) flbPrev.addEventListener("click", function() { renderFunnelSlide(currentFunnelIdx - 1); });
    if (flbNext) flbNext.addEventListener("click", function() { renderFunnelSlide(currentFunnelIdx + 1); });

    if (flbZoomToggle) {
      flbZoomToggle.addEventListener("click", function() {
        setFunnelZoom(!flbStage.classList.contains("is-zoomed"));
      });
    }

    if (flbImg) {
      flbImg.addEventListener("click", function(e) {
        e.stopPropagation();
        setFunnelZoom(!flbStage.classList.contains("is-zoomed"));
      });
    }

    if (funnelLightbox) {
      funnelLightbox.addEventListener("click", function(e) {
        if (e.target === funnelLightbox || e.target === flbStage) {
          closeFunnelLightbox();
        }
      });

      funnelLightbox.addEventListener("touchstart", function(e) {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      funnelLightbox.addEventListener("touchend", function(e) {
        if (flbStage && flbStage.classList.contains("is-zoomed")) return;
        if (e.changedTouches && e.changedTouches.length === 1) {
          var deltaX = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) renderFunnelSlide(currentFunnelIdx + 1);
            else renderFunnelSlide(currentFunnelIdx - 1);
          }
        }
      }, { passive: true });
    }

    document.addEventListener("keydown", function(e) {
      if (!funnelLightbox || funnelLightbox.hidden) return;
      if (e.key === "Escape") closeFunnelLightbox();
      if (e.key === "ArrowLeft") renderFunnelSlide(currentFunnelIdx - 1);
      if (e.key === "ArrowRight") renderFunnelSlide(currentFunnelIdx + 1);
    });

    // Quick Service Pre-Selector buttons
    var serviceTriggers = document.querySelectorAll("[data-select-service]");
    var subjectInput = document.getElementById("audit-subject");
    var serviceSelect = document.getElementById("audit-service-select");

    serviceTriggers.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var chosenService = btn.getAttribute("data-select-service");
        if (serviceSelect && chosenService) {
          serviceSelect.value = chosenService;
        }
        if (subjectInput && chosenService) {
          subjectInput.value = "Strategy & Audit Request: " + chosenService;
        }
      });
    });
  });

  // Fail-safe preloader removal & AOS fallback
  setTimeout(function() {
    var pre = document.getElementById("preloader");
    if (pre) pre.remove();
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
    }
  }, 600);
})();
