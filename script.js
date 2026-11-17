/* ==========================================================================
   ISHIKA & TARUN — MODERN ROYAL DIGITAL WEDDING INVITATION
   Editorial Interactive Script · English Edition
   Scratch Card Canvas · GSAP ScrollTrigger · Countdown · Audio · RSVP
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Register GSAP Plugins safely
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ========================================================================
  // 2. INTERACTIVE SCRATCH CARD CANVAS
  // ========================================================================
  const scratchCanvas = document.getElementById("scratch-canvas");
  const scratchInstruction = document.getElementById("scratch-instruction");
  const quickRevealBtn = document.getElementById("quick-reveal-btn");
  const enterPortalBtn = document.getElementById("enter-portal-btn");

  let isRevealed = false;
  let isScratching = false;

  if (scratchCanvas) {
    const ctx = scratchCanvas.getContext("2d");
    let canvasWidth = (scratchCanvas.width = scratchCanvas.offsetWidth || 380);
    let canvasHeight = (scratchCanvas.height = scratchCanvas.offsetHeight || 220);

    function initScratchCanvas() {
      if (isRevealed) return;
      canvasWidth = scratchCanvas.width = scratchCanvas.offsetWidth || 380;
      canvasHeight = scratchCanvas.height = scratchCanvas.offsetHeight || 220;

      // Draw Luxury Champagne Gold Metallic Foil
      const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      grad.addColorStop(0, "#c59b48");
      grad.addColorStop(0.25, "#f7e6b5");
      grad.addColorStop(0.5, "#a67c2e");
      grad.addColorStop(0.75, "#faebba");
      grad.addColorStop(1, "#c59b48");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Add subtle metallic stardust texture
      for (let i = 0; i < 350; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const r = Math.random() * 1.5;
        ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.45)" : "rgba(100,70,20,0.18)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Border outline on canvas
      ctx.strokeStyle = "rgba(197, 155, 72, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, canvasWidth - 12, canvasHeight - 12);
    }

    setTimeout(initScratchCanvas, 50);
    window.addEventListener("resize", () => {
      if (!isRevealed) initScratchCanvas();
    });

    function scratchAt(clientX, clientY) {
      if (isRevealed) return;

      const rect = scratchCanvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Erase foil layer
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      if (scratchInstruction) {
        scratchInstruction.classList.add("hidden");
      }

      checkScratchPercentage();
    }

    let lastCheckTime = 0;
    function checkScratchPercentage() {
      const now = Date.now();
      if (now - lastCheckTime < 250) return;
      lastCheckTime = now;

      try {
        const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const pixels = imgData.data;
        let transparentPixels = 0;
        const totalPixels = pixels.length / 4;

        // Sample every 16th pixel
        for (let i = 3; i < pixels.length; i += 64) {
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const percentage = (transparentPixels / (totalPixels / 16)) * 100;
        if (percentage >= 35) {
          revealDateCompletely();
        }
      } catch (e) {
        // Fallback
      }
    }

    function revealDateCompletely() {
      if (isRevealed) return;
      isRevealed = true;

      scratchCanvas.classList.add("revealed");
      if (scratchInstruction) scratchInstruction.classList.add("hidden");
      if (quickRevealBtn) quickRevealBtn.style.display = "none";

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          ".scratch-reveal-content",
          { scale: 0.96, filter: "brightness(1.2)" },
          { scale: 1, filter: "brightness(1)", duration: 0.7, ease: "back.out(1.5)" }
        );
      }

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }

    // Pointer Events (Mouse & Touch)
    scratchCanvas.addEventListener("pointerdown", (e) => {
      isScratching = true;
      scratchAt(e.clientX, e.clientY);
    });

    window.addEventListener("pointermove", (e) => {
      if (isScratching) {
        scratchAt(e.clientX, e.clientY);
      }
    });

    window.addEventListener("pointerup", () => {
      isScratching = false;
    });

    if (quickRevealBtn) {
      quickRevealBtn.addEventListener("click", revealDateCompletely);
    }
  }

  // Smooth scroll into invitation
  if (enterPortalBtn) {
    enterPortalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("invitation-start");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      playAuspiciousMusic();

      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 400);
      }
    });
  }

  // ========================================================================
  // 3. LIVE COUNTDOWN TIMER (25 NOV 2026, 10:15 AM IST)
  // ========================================================================
  const weddingTimestamp = new Date("November 25, 2026 10:15:00 GMT+0530").getTime();

  function runCountdown() {
    const current = Date.now();
    const remaining = weddingTimestamp - current;

    if (remaining > 0) {
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      const elDays = document.getElementById("cd-days");
      const elHours = document.getElementById("cd-hours");
      const elMins = document.getElementById("cd-minutes");
      const elSecs = document.getElementById("cd-seconds");

      if (elDays) elDays.textContent = String(days).padStart(2, "0");
      if (elHours) elHours.textContent = String(hours).padStart(2, "0");
      if (elMins) elMins.textContent = String(minutes).padStart(2, "0");
      if (elSecs) elSecs.textContent = String(seconds).padStart(2, "0");
    } else {
      const heading = document.querySelector(".countdown-heading-mini");
      if (heading) heading.textContent = "The Auspicious Wedding Celebrations Have Begun!";
    }
  }

  runCountdown();
  setInterval(runCountdown, 1000);

  // ========================================================================
  // 4. FLOATING MUSIC CONTROLLER (Bollywood Wedding Instrumental Track)
  // ========================================================================
  const audioToggle = document.getElementById("audio-toggle-btn");
  const audioTrack = document.getElementById("ambient-audio-track");
  let isAudioPlaying = false;
  let audioContext = null;
  let synthNodes = [];

  function startRaagDrone() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const pitches = [138.59, 207.65, 277.18, 369.99];
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.001, audioContext.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 2.5);
      masterGain.connect(audioContext.destination);

      pitches.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);

        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.18 + idx * 0.08, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(1.2, audioContext.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.25 / (idx + 1), audioContext.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        synthNodes.push(osc, lfo, gain);
      });
      synthNodes.push(masterGain);
    } catch (e) {
      console.warn("Audio Context init pending interaction:", e);
    }
  }

  function stopRaagDrone() {
    synthNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {}
    });
    synthNodes = [];
  }

  function playAuspiciousMusic() {
    if (!audioTrack) return;
    if (isAudioPlaying && !audioTrack.paused) return;

    if (!audioTrack.src || audioTrack.src === "" || audioTrack.src.endsWith("/")) {
      audioTrack.src = "music.mp3";
    }

    audioTrack.volume = 0.8;
    const playPromise = audioTrack.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      }).catch((err) => {
        console.log("Audio autoplay waiting for user interaction:", err);
        // Fallback to ambient Raag drone if browser blocks local media file
        startRaagDrone();
        isAudioPlaying = true;
        updateAudioUI(true);
      });
    } else {
      isAudioPlaying = true;
      updateAudioUI(true);
    }
  }

  function pauseAuspiciousMusic() {
    if (audioTrack) {
      audioTrack.pause();
    }
    stopRaagDrone();
    isAudioPlaying = false;
    updateAudioUI(false);
  }

  function updateAudioUI(playing) {
    if (!audioToggle) return;
    if (playing) {
      audioToggle.classList.add("active");
      audioToggle.setAttribute("title", "Pause Wedding Music");
      audioToggle.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" style="stroke: currentColor; fill: none; width: 22px; height: 22px;">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    } else {
      audioToggle.classList.remove("active");
      audioToggle.setAttribute("title", "Play Wedding Music");
      audioToggle.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" style="stroke: currentColor; fill: none; width: 22px; height: 22px;">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      if (isAudioPlaying) {
        pauseAuspiciousMusic();
      } else {
        playAuspiciousMusic();
      }
    });
  }

  // Auto-play wedding music on first user touch / click / scratch
  function triggerAudioOnFirstTouch() {
    if (!isAudioPlaying) {
      playAuspiciousMusic();
    }
  }
  window.addEventListener("pointerdown", triggerAudioOnFirstTouch, { once: true });
  window.addEventListener("touchstart", triggerAudioOnFirstTouch, { once: true });

  // ========================================================================
  // 5. EXTENDED FAMILY HONOUR TABS
  // ========================================================================
  const familyTabs = document.querySelectorAll(".family-nav-tab");
  const familyPanes = document.querySelectorAll(".family-pane");

  familyTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetPaneId = tab.getAttribute("data-pane");

      familyTabs.forEach(t => t.classList.remove("active"));
      familyPanes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(targetPaneId);
      if (target) {
        target.classList.add("active");

        if (typeof gsap !== "undefined") {
          gsap.fromTo(
            target.querySelectorAll(".family-name-tile, .bhanch-parivar-banner"),
            { y: 10 },
            { y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" }
          );
        }
      }
    });
  });

  // ========================================================================
  // 6. WHATSAPP RSVP FORM GENERATOR
  // ========================================================================
  const rsvpForm = document.getElementById("rsvp-english-form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const guestName = document.getElementById("rsvp-guest-name").value.trim();
      const attendance = document.getElementById("rsvp-attendance").value;
      const count = document.getElementById("rsvp-guest-count").value;
      const message = document.getElementById("rsvp-wishes").value.trim();

      const hostPhone = "919530353636"; // Shri Padam Chand Jain

      let msg = `*Wedding RSVP — Ishika & Tarun*\n\n`;
      msg += `👤 *Guest Name:* ${guestName}\n`;
      msg += `✨ *Attendance:* ${attendance}\n`;
      msg += `👥 *Number of Guests:* ${count} Guest(s)\n`;
      if (message) {
        msg += `💌 *Personal Message / Wishes:* "${message}"\n\n`;
      }
      msg += `_Heartfelt congratulations to the Baunch family and newlyweds!_`;

      const whatsappURL = `https://wa.me/${hostPhone}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappURL, "_blank");
    });
  }

  // ========================================================================
  // 7. EDITORIAL SIDE-SLIDE SCROLL ANIMATIONS WITH OPACITY EFFECT (GSAP)
  // ========================================================================
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const isMobile = window.innerWidth < 768;
    const xDistance = isMobile ? 45 : 75;

    // Helper to safely bind side-entrance animation
    function animateSideEntrance(element, direction, delay = 0) {
      if (!element) return;
      const startX = direction === "left" ? -xDistance : (direction === "right" ? xDistance : 0);
      const startY = direction === "up" ? 40 : (direction === "down" ? -30 : 0);

      gsap.fromTo(element,
        {
          x: startX,
          y: startY,
          opacity: 0
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.85,
          delay: delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: isMobile ? "top 92%" : "top 88%",
            once: true,
            onComplete: () => {
              element.style.opacity = "1";
              element.style.transform = "none";
            }
          }
        }
      );
    }

    // A. Section Headers: Gentle slide down with opacity
    gsap.utils.toArray(".section-header").forEach(header => {
      gsap.fromTo(header,
        { y: -25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 90%",
            once: true
          }
        }
      );
    });

    // B. Jain Manglacharan: Graceful fade & subtle upward lift
    const mangla = document.querySelector(".manglacharan-container");
    if (mangla) {
      gsap.fromTo(mangla,
        { y: 35, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mangla,
            start: "top 88%",
            once: true,
            onComplete: () => {
              mangla.style.opacity = "1";
              mangla.style.transform = "none";
            }
          }
        }
      );
    }

    // C. Meet the Couple Section:
    // Left: Bride Card (slides from LEFT with opacity)
    const brideCard = document.querySelector(".couple-editorial-layout .profile-column-card:first-child");
    animateSideEntrance(brideCard, "left");

    // Center: Couple Photo Frame (scales & lifts upward with opacity)
    const centerPortrait = document.querySelector(".couple-portrait-wrapper");
    if (centerPortrait) {
      gsap.fromTo(centerPortrait,
        { y: 45, scale: 0.9, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.95,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: centerPortrait,
            start: "top 88%",
            once: true,
            onComplete: () => {
              centerPortrait.style.opacity = "1";
            }
          }
        }
      );
    }

    // Right: Groom Card (slides from RIGHT with opacity)
    const groomCard = document.querySelector(".couple-editorial-layout .profile-column-card:last-child");
    animateSideEntrance(groomCard, "right");

    // D. Our Favourites Section:
    // Card 1 (Ishika): slides from LEFT with opacity
    const favCard1 = document.querySelector(".favorites-duo-grid .fav-card:first-child");
    animateSideEntrance(favCard1, "left");

    // Card 2 (Tarun): slides from RIGHT with opacity
    const favCard2 = document.querySelector(".favorites-duo-grid .fav-card:last-child");
    animateSideEntrance(favCard2, "right", 0.12);

    // E. Formal Wedding Letter Card:
    const formalLetter = document.querySelector(".invitation-formal-card");
    if (formalLetter) {
      gsap.fromTo(formalLetter,
        { y: 45, scale: 0.97, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formalLetter,
            start: "top 88%",
            once: true,
            onComplete: () => {
              formalLetter.style.opacity = "1";
              formalLetter.style.transform = "none";
            }
          }
        }
      );
    }

    // F. Schedule of Ceremonies (6 Cards):
    // Even index cards from LEFT, Odd index cards from RIGHT with opacity
    const ceremonyCards = document.querySelectorAll(".ceremony-card");
    ceremonyCards.forEach((card, idx) => {
      const direction = idx % 2 === 0 ? "left" : "right";
      animateSideEntrance(card, direction, (idx % 2) * 0.1);
    });

    // G. Wedding Venues (2 Cards):
    // Venue 1 (Jagdamba Palace) from LEFT with opacity
    const venueCard1 = document.querySelector(".venues-duo-grid .venue-editorial-card:first-child");
    animateSideEntrance(venueCard1, "left");

    // Venue 2 (Palliwal Jain Dharmashala) from RIGHT with opacity
    const venueCard2 = document.querySelector(".venues-duo-grid .venue-editorial-card:last-child");
    animateSideEntrance(venueCard2, "right", 0.12);

    // H. Baal Manuhar / Special Request Box:
    const kidsBox = document.querySelector(".kids-message-box");
    animateSideEntrance(kidsBox, "left");

    // I. Family Section:
    const familyTabsBox = document.querySelector(".family-tabs-controller");
    const activeFamilyPane = document.querySelector(".family-pane.active");
    if (familyTabsBox) {
      gsap.fromTo(familyTabsBox,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: familyTabsBox,
            start: "top 90%",
            once: true
          }
        }
      );
    }
    if (activeFamilyPane) {
      gsap.fromTo(activeFamilyPane.querySelectorAll(".family-name-tile"),
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: activeFamilyPane,
            start: "top 90%",
            once: true
          }
        }
      );
    }

    // J. Preshak & RSVP Section:
    // Preshak Host Card from LEFT with opacity
    const preshakCard = document.querySelector(".preshak-editorial-card");
    animateSideEntrance(preshakCard, "left");

    // RSVP Form Card from RIGHT with opacity
    const rsvpCard = document.querySelector(".rsvp-form-card");
    animateSideEntrance(rsvpCard, "right", 0.12);

    // Dynamic Recalculation Safeguards
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });

    const coupleImg = document.querySelector(".couple-portrait-img");
    if (coupleImg) {
      if (coupleImg.complete) {
        ScrollTrigger.refresh();
      } else {
        coupleImg.addEventListener("load", () => {
          ScrollTrigger.refresh();
        });
      }
    }

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });

    // Universal Fail-safe: After 2.5s, ensure any cards in viewport are completely visible
    setTimeout(() => {
      document.querySelectorAll(".fav-card, .ceremony-card, .venue-editorial-card, .profile-column-card, .preshak-editorial-card, .rsvp-form-card, .kids-message-box, .invitation-formal-card").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.2) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 2500);
  }
});
