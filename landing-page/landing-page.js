// Mobile Menu Toggle
const menuOpenBtn = document.getElementById("menu-open-button")
const menuCloseBtn = document.getElementById("menu-close-button")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")

if (menuOpenBtn) {
  menuOpenBtn.addEventListener("click", () => {
    document.body.classList.add("show-mobile-menu")
    navMenu.style.right = "0"
  })
}

if (menuCloseBtn) {
  menuCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu")
    navMenu.style.right = "-100%"
  })
}

if (navLinks) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu")
      navMenu.style.right = "-100%"
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      centeredSlides: true, // Center slide in view
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 3,
          centeredSlides: false,
        },
      },
      on: {
        init: function () {
          updateNavigationState(this)
          updatePaginationNumbers(this)
        },
        slideChange: function () {
          updateNavigationState(this)
          updatePaginationNumbers(this)
        },
      },
    })

    // Function to update navigation buttons state
    function updateNavigationState(swiper) {
      // At the beginning, hide prev button
      if (swiper.isBeginning) {
        document.querySelector(".swiper-button-prev").classList.add("swiper-button-disabled")
      } else {
        document.querySelector(".swiper-button-prev").classList.remove("swiper-button-disabled")
      }

      // At the end, hide next button
      if (swiper.isEnd) {
        document.querySelector(".swiper-button-next").classList.add("swiper-button-disabled")
      } else {
        document.querySelector(".swiper-button-next").classList.remove("swiper-button-disabled")
      }
    }
    
    // Function to update pagination numbers
    function updatePaginationNumbers(swiper) {
      const paginationNumbers = document.querySelectorAll(".pagination-number")

      if (paginationNumbers.length > 0) {
        paginationNumbers.forEach((number, index) => {
          if (index === swiper.activeIndex) {
            number.classList.add("active")
          } else {
            number.classList.remove("active")
          }
        })
      }
    }
    

    // Add click event to pagination numbers
    const paginationNumbers = document.querySelectorAll(".pagination-number")
    if (paginationNumbers.length > 0) {
      paginationNumbers.forEach((number) => {
        number.addEventListener("click", () => {
          const slideIndex = Number.parseInt(number.getAttribute("data-index"), 10)
          swiper.slideTo(slideIndex)
        })
      })
    }
  } else {
    console.error("Swiper is not defined. Make sure Swiper.js is included in your HTML.")
  }
})

// Add smooth scrolling with offset for anchor links
document.addEventListener("DOMContentLoaded", () => {
  // Get all links with hash
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  // Add click event to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only prevent default if the href is not just "#"
      if (this.getAttribute("href") !== "#") {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          // Get the navbar height to offset the scroll
          const navbarHeight = document.querySelector("header").offsetHeight

          // Calculate the target position with offset
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }
    })
  })
})
