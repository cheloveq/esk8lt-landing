document.addEventListener("DOMContentLoaded", () => {
  const objects = document.querySelectorAll("object")
  let loadedCount = 0

  // Function to check if all objects are loaded
  const checkAllLoaded = () => {
    loadedCount++
    if (loadedCount === objects.length) {
      // All objects loaded - remove loading state
      document.body.classList.add("loaded")

      const cityscape = document.querySelector(".cityscape")

      // Clone the first set of cities to create seamless loop
      const cities = cityscape.innerHTML
      cityscape.innerHTML = cities + cities
    }
  }

  objects.forEach((obj) => {
    if (obj.getSVGDocument()) {
      // Already loaded
      checkAllLoaded()
    } else {
      obj.addEventListener("load", checkAllLoaded)
    }
  })
})
