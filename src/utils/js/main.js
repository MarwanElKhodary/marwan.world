// Add your javascript here

window.darkMode = false;

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
  "border-neutral-300/50",
  "bg-cream",
  "dark:border-neutral-600/40",
  "dark:bg-rock",
  "backdrop-blur-2xl",
];
const unstickyClassesContainer = ["border-transparent"];
let headerElement = null;

document.addEventListener("DOMContentLoaded", () => {
  headerElement = document.getElementById("header");

  if (
    localStorage.getItem("dark_mode") &&
    localStorage.getItem("dark_mode") === "false"
  ) {
    showDay();
  } else {
    showNight();
  }
  stickyHeaderFuncionality();
  applyMenuItemClasses();
  evaluateHeaderPosition();
  mobileMenuFunctionality();
});

window.stickyHeaderFuncionality = () => {
  window.addEventListener("scroll", () => {
    evaluateHeaderPosition();
  });
};

window.evaluateHeaderPosition = () => {
  if (window.scrollY > 16) {
    headerElement.firstElementChild.classList.add(...stickyClassesContainer);
    headerElement.firstElementChild.classList.remove(
      ...unstickyClassesContainer,
    );
    headerElement.classList.add(...stickyClasses);
    headerElement.classList.remove(...unstickyClasses);
    document.getElementById("menu").classList.add("top-[56px]");
    document.getElementById("menu").classList.remove("top-[75px]");
  } else {
    headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
    headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
    headerElement.classList.add(...unstickyClasses);
    headerElement.classList.remove(...stickyClasses);
    document.getElementById("menu").classList.remove("top-[56px]");
    document.getElementById("menu").classList.add("top-[75px]");
  }
};

document.getElementById("darkToggle").addEventListener("click", () => {
  document.documentElement.classList.add("duration-300");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("dark_mode", false);
    showDay(true);
  } else {
    localStorage.setItem("dark_mode", true);
    showNight(true);
  }
});

function showDay() {
  document.getElementById("dayText").classList.remove("hidden");
  document.getElementById("nightText").classList.add("hidden");

  document.getElementById("moon").classList.add("hidden");
  document.getElementById("sun").classList.remove("hidden");

  document.documentElement.classList.remove("dark");
}

function showNight() {
  document.getElementById("nightText").classList.remove("hidden");
  document.getElementById("dayText").classList.add("hidden");

  document.getElementById("sun").classList.add("hidden");
  document.getElementById("moon").classList.remove("hidden");

  document.documentElement.classList.add("dark");
}

window.applyMenuItemClasses = () => {
  const menuItems = document.querySelectorAll("#menu a");
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].pathname === window.location.pathname) {
      menuItems[i].classList.add(
        "underline",
        "decoration-4",
        "underline-offset",
        "decoration-gasoline",
      );
    }
  }
};

function mobileMenuFunctionality() {
  document.getElementById("openMenu").addEventListener("click", () => {
    openMobileMenu();
  });

  document.getElementById("closeMenu").addEventListener("click", () => {
    closeMobileMenu();
  });
}

window.openMobileMenu = () => {
  document.getElementById("openMenu").classList.add("hidden");
  document.getElementById("closeMenu").classList.remove("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("mobileMenuBackground").classList.add("opacity-0");
  document.getElementById("mobileMenuBackground").classList.remove("hidden");

  setTimeout(() => {
    document
      .getElementById("mobileMenuBackground")
      .classList.remove("opacity-0");
  }, 1);
};

window.closeMobileMenu = () => {
  document.getElementById("closeMenu").classList.add("hidden");
  document.getElementById("openMenu").classList.remove("hidden");
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("mobileMenuBackground").classList.add("hidden");
};
