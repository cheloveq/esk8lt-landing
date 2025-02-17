document.addEventListener("DOMContentLoaded", () => {
  const objects = document.querySelectorAll("object")
  let loadedCount = 0

  let currentSpeed = 3
  const MIN_SPEED = currentSpeed
  const MAX_SPEED = 12
  let lastTime = 0
  let animationPosition = -800
  let animationFrame
  let spokeRotation = 0
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
    
    animationPosition += (deltaTime * 0.16 * currentSpeed)
    if (animationPosition >= 0) animationPosition = -800

    spokeRotation += (deltaTime * 0.16 * currentSpeed)
    if (spokeRotation >= 360) spokeRotation -= 360

    cityscape.style.transform = `translate3d(${animationPosition}px, 0, 0)`
    wheels.forEach(wheel => {
      wheel.style.transform = `rotate(${spokeRotation}deg)`
    })

    animationFrame = requestAnimationFrame(animate)
  }

  const updateAnimationSpeed = (speed) => {
    currentSpeed = speed
  }

  document.addEventListener('wheel', (e) => {
    e.preventDefault()
    
    const speedChange = e.deltaY * SPEED_SENSITIVITY
    const newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, currentSpeed + speedChange))

    updateAnimationSpeed(newSpeed)
    
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
    
    const deltaY = touchStartY - touchY
    const deltaX = Math.abs(touchStartX - touchX)
    
    if (Math.abs(deltaY) > deltaX) {
      e.preventDefault()
      
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
      // document.body.classList.add("loaded")

      const cityscape = document.querySelector(".cityscape")
      const cities = cityscape.innerHTML
      cityscape.innerHTML = cities + cities

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

  window.addEventListener('unload', () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })
})