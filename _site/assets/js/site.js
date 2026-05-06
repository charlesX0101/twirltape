(function () {
  const body = document.body;
  const transition = document.querySelector("[data-page-transition]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enablePageEnter = () => {
    window.requestAnimationFrame(() => {
      body.classList.add("is-ready");
    });
  };

  const shouldIntercept = (link) => {
    if (!link) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;
    if (link.getAttribute("href")?.startsWith("#")) return false;
    if (link.origin !== window.location.origin) return false;
    if (link.pathname === window.location.pathname && link.search === window.location.search) return false;
    return true;
  };

  const handlePageLeave = (event) => {
    const link = event.target.closest("a");
    if (!shouldIntercept(link)) return;

    event.preventDefault();
    body.classList.add("is-leaving");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 180);
  };

  const handleMobileNav = () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
    body.classList.toggle("nav-open", !expanded);
  };

  const setupHeroSequence = () => {
    const sequence = document.querySelector("[data-hero-sequence]");
    const frame = document.querySelector("[data-hero-frame]");
    const hero = sequence?.closest(".page-hero");

    if (!sequence || !frame || !hero) return;

    const frameCount = 25;
    const framePath = (index) => `/assets/img/frame${String(index).padStart(2, "0")}.png`;

    if (reducedMotion) {
      frame.src = framePath(1);
      return;
    }

    for (let index = 1; index <= frameCount; index += 1) {
      const image = new Image();
      image.src = framePath(index);
    }

    let currentFrame = 1;
    let ticking = false;

    const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

    const updateHeroFrame = () => {
      const rect = hero.getBoundingClientRect();
      const scrollRange = Math.max(hero.offsetHeight - window.innerHeight * 0.25, window.innerHeight);
      const progress = clamp((rect.top * -1) / scrollRange, 0, 1);
      const nextFrame = clamp(Math.floor(progress * (frameCount - 1)) + 1, 1, frameCount);

      if (nextFrame !== currentFrame) {
        currentFrame = nextFrame;
        frame.classList.add("is-changing");
        frame.src = framePath(currentFrame);

        window.setTimeout(() => {
          frame.classList.remove("is-changing");
        }, 120);
      }

      ticking = false;
    };

    const requestHeroFrame = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeroFrame);
    };

    frame.src = framePath(1);
    updateHeroFrame();

    window.addEventListener("scroll", requestHeroFrame, { passive: true });
    window.addEventListener("resize", requestHeroFrame);
  };

  const setupWallpaperRotation = () => {
    const wallpaper = document.querySelector(".page-wallpaper__image");

    if (!wallpaper || reducedMotion) return;

    const wallpapers = [
      "blueprint-cozy.png",
      "blueprint-hero.png",
      "blueprint-desk.png",
      "chrome.png",
      "chrome-purple.png"
    ];

    let currentWallpaper = -1;

    wallpapers.forEach((file) => {
      const image = new Image();
      image.src = `/assets/img/${file}`;
    });

    const rotateWallpaper = () => {
      currentWallpaper = (currentWallpaper + 1) % wallpapers.length;

      body.classList.add("wallpaper-is-changing");
      wallpaper.style.setProperty("--wallpaper-image", `url("/assets/img/${wallpapers[currentWallpaper]}")`);

      window.setTimeout(() => {
        body.classList.remove("wallpaper-is-changing");
      }, 5200);
    };

    window.setTimeout(() => {
      rotateWallpaper();
      window.setInterval(rotateWallpaper, 20000);
    }, 20000);
  };

  const setupScrollReveal = () => {
    if (reducedMotion) return;

    const revealItems = document.querySelectorAll(
  ".card, .academy-archive__group, .service-card"
);

    if (!revealItems.length) return;

    revealItems.forEach((item) => {
      item.classList.add("reveal-item");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const setupServiceCards = () => {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
      card.addEventListener("toggle", () => {
        card.classList.toggle("is-open", card.open);
      });
    });
  };

  document.addEventListener("click", handlePageLeave);

  window.addEventListener("pageshow", () => {
    body.classList.remove("is-leaving");
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", handleMobileNav);
  }

  if (reducedMotion) {
    body.classList.add("reduced-motion");
  }

  setupHeroSequence();
  setupWallpaperRotation();
  setupScrollReveal();
  setupServiceCards();

  if (transition) {
    enablePageEnter();
  }
})();
