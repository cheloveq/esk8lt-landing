document.addEventListener("DOMContentLoaded", () => {
  const objects = document.querySelectorAll("object")
  let loadedCount = 0

  // Animation control variables
  let currentSpeed = 3
  const MIN_SPEED = currentSpeed
  const MAX_SPEED = 12
  const SPEED_STEP = 2
  let lastTime = 0
  let animationPosition = -800
  let animationFrame

  // Add new variables for spoke animation
  let spokeRotation = 0

  // Add touch/scroll control variables
  let touchStartY = 0
  let touchStartX = 0
  const SPEED_SENSITIVITY = 0.02
  let isGestureInProgress = false
  let gestureTimeout

  const animate = (timestamp) => {
    if (!lastTime) lastTime = timestamp
    const deltaTime = timestamp - lastTime
    lastTime = timestamp

    const cityscape = document.querySelector(".cityscape")
    const wheels = document.querySelectorAll(".spokes")
    
    // Update cityscape position based on speed
    animationPosition += (deltaTime * 0.16 * currentSpeed)
    if (animationPosition >= 0) animationPosition = -800

    // Update spoke rotation based on speed
    spokeRotation += (deltaTime * 0.16 * currentSpeed)
    if (spokeRotation >= 360) spokeRotation -= 360

    // Apply transforms
    cityscape.style.transform = `translate3d(${animationPosition}px, 0, 0)`
    wheels.forEach(wheel => {
      wheel.style.transform = `rotate(${spokeRotation}deg)`
    })

    animationFrame = requestAnimationFrame(animate)
  }

  const updateAnimationSpeed = (speed) => {
    currentSpeed = speed
    // Optional: update UI to show current speed
    console.log('Current speed:', currentSpeed)
  }

  // document.getElementById("speed-up").addEventListener("click", () => {
  //   if (currentSpeed < MAX_SPEED) {
  //     currentSpeed += SPEED_STEP
  //     updateAnimationSpeed(currentSpeed)
  //   }
  // })

  // document.getElementById("slow-down").addEventListener("click", () => {
  //   if (currentSpeed > MIN_SPEED) {
  //     currentSpeed -= SPEED_STEP
  //     updateAnimationSpeed(currentSpeed)
  //   }
  // })

  // Add gesture handlers
  document.addEventListener('wheel', (e) => {
    e.preventDefault()
    
    // Adjust speed based on scroll delta
    const speedChange = e.deltaY * SPEED_SENSITIVITY
    const newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, currentSpeed + speedChange))
    updateAnimationSpeed(newSpeed)
    
    // Clear previous timeout and set new one
    clearTimeout(gestureTimeout)
    gestureTimeout = setTimeout(() => {
      isGestureInProgress = false
    }, 150)
  }, { passive: false })

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
    touchStartX = e.touches[0].clientX
    isGestureInProgress = true
  })

  document.addEventListener('touchmove', (e) => {
    if (!isGestureInProgress) return
    
    const touchY = e.touches[0].clientY
    const touchX = e.touches[0].clientX
    
    // Check if vertical swipe is more prominent than horizontal
    const deltaY = touchStartY - touchY
    const deltaX = Math.abs(touchStartX - touchX)
    
    if (Math.abs(deltaY) > deltaX) {
      e.preventDefault()
      
      // Adjust speed based on swipe delta
      const speedChange = deltaY * SPEED_SENSITIVITY
      const newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, currentSpeed + speedChange))
      updateAnimationSpeed(newSpeed)
      
      touchStartY = touchY
    }
  }, { passive: false })

  document.addEventListener('touchend', () => {
    isGestureInProgress = false
  })

  const checkAllLoaded = () => {
    loadedCount++
    if (loadedCount === objects.length) {
      document.body.classList.add("loaded")

      const cityscape = document.querySelector(".cityscape")
      const cities = cityscape.innerHTML
      cityscape.innerHTML = cities + cities

      // Start the animation
      animationFrame = requestAnimationFrame(animate)
    }
  }

  objects.forEach((obj) => {
    if (obj.getSVGDocument()) {
      checkAllLoaded()
    } else {
      obj.addEventListener("load", checkAllLoaded)
    }
  })

  // Cleanup on page unload
  window.addEventListener('unload', () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })
})