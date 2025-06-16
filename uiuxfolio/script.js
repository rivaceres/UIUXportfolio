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

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".case-study-card");
  const mainContent = document.getElementById("main-content");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const file = card.getAttribute("data-file");
      const cssFile = `styles/${getCssFileName(file)}`;

      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok.");
          return response.text();
        })
        .then(html => {
          mainContent.innerHTML = html;

          // Remove previously injected case study styles
          document.querySelectorAll("[data-case-style]").forEach(el => el.remove());

          // Inject new CSS for the loaded case study
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = cssFile;
          link.setAttribute("data-case-style", "true");
          document.head.appendChild(link);

          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(error => {
          mainContent.innerHTML = "<p>Error loading content. Please try again.</p>";
          console.error("Error loading file:", error);
        });
    });
  });
});

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
