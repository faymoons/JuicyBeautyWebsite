
function openMenu() {
  document.getElementById("menuPopup").classList.add("active");
}

function closeMenu() {
  document.getElementById("menuPopup").classList.remove("active");
}

document.addEventListener("click", function (event) {
  const popup = document.getElementById("menuPopup");
  const content = document.querySelector(".menu-popup-content");

  if (
    popup.classList.contains("active") &&
    !content.contains(event.target) &&
    !event.target.classList.contains("menu-btn")
  ) {
    closeMenu();
  }
});


function initScrollAnimations() {
  const animatedItems = document.querySelectorAll(".scroll-animate");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedItems.forEach((item) => observer.observe(item));
}


async function loadSections() {
  try {
    const response = await fetch("data/sections.json");

    if (!response.ok) {
      throw new Error("sections.json failed to load");
    }

    const data = await response.json();

    document.getElementById("heroTitle").textContent = data.heroTitle;
    document.getElementById("heroText").textContent = data.heroText;

    const heroBtn = document.getElementById("heroBtn");
    heroBtn.textContent = data.heroButtonText;

  
    const tickerTrack = document.getElementById("tickerTrack");
    tickerTrack.innerHTML = "";

    for (let i = 0; i < 4; i++) {
      const span = document.createElement("span");
      span.textContent = data.tickerText;
      tickerTrack.appendChild(span);
    }
  } catch (error) {
    console.error("Error loading sections:", error);

    document.getElementById("heroTitle").textContent =
      "Welcome to Juicy Beauty!";
    document.getElementById("heroText").textContent =
      "Sorry, content could not be loaded.";
  }
}


async function loadProducts() {
  const bestsellersContainer = document.getElementById("bestsellersCards");
  const collectionContainer = document.getElementById("collectionCards");

  try {
    const response = await fetch("data/products.json");

    if (!response.ok) {
      throw new Error("products.json failed to load");
    }

    const products = await response.json();

    bestsellersContainer.innerHTML = "";
    collectionContainer.innerHTML = "";

    products.forEach((product, index) => {
      const card = document.createElement("article");
      card.classList.add("card", "scroll-animate");

      // delay animation
      const delayClass = `scroll-delay-${(index % 3) + 1}`;
      card.classList.add(delayClass);

      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}">
        <p class="card-title">${product.title}</p>
        <p class="price">${product.price.toFixed(2)}$</p>
        <button class="btn small">BUY</button>
      `;

      if (product.section === "bestsellers") {
        bestsellersContainer.appendChild(card);
      } else if (product.section === "collection") {
        collectionContainer.appendChild(card);
      }
    });


    initScrollAnimations();
  } catch (error) {
    console.error("Error loading products:", error);

    bestsellersContainer.innerHTML =
      `<p style="color:red;">⚠️ Products could not be loaded.</p>`;

    collectionContainer.innerHTML =
      `<p style="color:red;">⚠️ Products could not be loaded.</p>`;
  }
}


async function initPage() {
  await Promise.all([loadSections(), loadProducts()]);
  initScrollAnimations();
}

initPage();
