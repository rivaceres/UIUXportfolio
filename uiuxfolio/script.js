// Load header
fetch('shared/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  });

// Load footer
fetch('shared/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  });

// Skeleton layout shown while a case study loads (mirrors the shared case study structure)
const CASE_STUDY_SKELETON = `
<span class="visually-hidden" role="status">Loading case study…</span>
<div class="container" aria-hidden="true">
  <div class="row align-items-center mb-5">
    <div class="col-md-5">
      <div class="skeleton skeleton-btn mb-3"></div>
      <div class="skeleton skeleton-title mt-4"></div>
      <div class="skeleton skeleton-text mt-5"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text w-75 mb-5"></div>
    </div>
    <div class="col-md-7"><div class="skeleton skeleton-hero"></div></div>
  </div>
  <div class="row text-center py-5">
    ${`<div class="col">
      <div class="skeleton skeleton-icon mx-auto mb-2"></div>
      <div class="skeleton skeleton-text w-50 mx-auto"></div>
      <div class="skeleton skeleton-text w-75 mx-auto"></div>
    </div>`.repeat(4)}
  </div>
  ${`<div class="row py-5 border-top">
    <div class="col-md-4"><div class="skeleton skeleton-heading mb-3"></div></div>
    <div class="col-md-8">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text w-50"></div>
    </div>
  </div>`.repeat(3)}
</div>`;

// Shimmer each image until it finishes loading
function skeletonImages(root) {
  root.querySelectorAll("img").forEach(img => {
    if (img.complete) return;
    img.classList.add("skeleton");
    const done = () => img.classList.remove("skeleton");
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".case-study-card");
  const mainContent = document.getElementById("main-content");

  skeletonImages(mainContent);
  revealOnScroll(mainContent);

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const file = card.getAttribute("data-file");
      const cssFile = `styles/${getCssFileName(file)}`;

      mainContent.innerHTML = CASE_STUDY_SKELETON;
      mainContent.setAttribute("aria-busy", "true");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Remove previously injected case study styles
      document.querySelectorAll("[data-case-style]").forEach(el => el.remove());

      // Inject CSS now so the page isn't shown unstyled; skeleton stays until it loads
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssFile;
      link.setAttribute("data-case-style", "true");
      const cssLoaded = new Promise(resolve => { link.onload = link.onerror = resolve; });
      document.head.appendChild(link);

      const htmlLoaded = fetch(file).then(response => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.text();
      });

      Promise.all([htmlLoaded, cssLoaded])
        .then(([html]) => {
          mainContent.innerHTML = html;
          skeletonImages(mainContent);
          revealOnScroll(mainContent);
        })
        .catch(error => {
          mainContent.innerHTML = "<p>Error loading content. Please try again.</p>";
          console.error("Error loading file:", error);
        })
        .finally(() => mainContent.removeAttribute("aria-busy"));
    });
  });
});

// Content rows fade up the first time they scroll into view
function revealOnScroll(root) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });

  // .content-section rows: case studies; section > .row: home page card grid
  root.querySelectorAll(".content-section > .row, section > .row").forEach(row => {
    row.classList.add("reveal");
    observer.observe(row);
  });
}

// Helper: maps HTML filename to CSS filename
function getCssFileName(htmlFilePath) {
  const fileName = htmlFilePath.split("/").pop().split(".")[0];
  return `${fileName}.css`;
}


// Show button after scrolling 100px down
  window.onscroll = function() {
    const btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  };

  function getCssFileName(htmlFilePath) {
  const fileName = htmlFilePath.split("/").pop().split(".")[0];
  
  // If the HTML file is "casestud.html", load "casestud2.css"
  if (fileName === "casestud") {
    return "casestud2.css";
  }

  // Default behavior: same base name + .css
  return `${fileName}.css`;
}
