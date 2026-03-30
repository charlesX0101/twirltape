(function () {
  const body = document.body;
  const transition = document.querySelector("[data-page-transition]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

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

  document.addEventListener("click", handlePageLeave);

  window.addEventListener("pageshow", () => {
    body.classList.remove("is-leaving");
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", handleMobileNav);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    body.classList.add("reduced-motion");
  }

  if (transition) {
    enablePageEnter();
  }
})();
