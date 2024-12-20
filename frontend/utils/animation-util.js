// frontend/utils/animation-util.js
export function animateText(element, text, animationSpeed = 5) {
  return new Promise((resolve) => {
    let index = 0;
    element.textContent = ""; // Clear existing content
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= animationSpeed) {
        element.textContent += text[index];
        index++;
        // You might need to trigger a scroll here if the message component isn't handling it
        lastTime = currentTime;
      }
      if (index < text.length) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(animate);
  });
}
