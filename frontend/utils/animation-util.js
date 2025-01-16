export function animateText(element, text, animationSpeed = 2) {
  return new Promise((resolve) => {
    let index = 0;
    element.textContent = ""; // Clear existing content
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= animationSpeed) {
        if (index < text.length) {
          element.textContent += text[index];
          index++;
          lastTime = currentTime;
        }
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

export async function animateHTMLContent(container, htmlContent, speed = 2) {
  // Create a temporary container to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = htmlContent;

  // Clear the target container
  container.innerHTML = "";

  // Animate each element sequentially
  for (const node of temp.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Only create a span for non-empty text nodes
      if (node.textContent.trim()) {
        const span = document.createElement("span");
        container.appendChild(span);
        await animateText(span, node.textContent, speed);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Clone the element without its content
      const el = node.cloneNode(false);
      container.appendChild(el);
      // Animate its content
      await animateHTMLContent(el, node.innerHTML, speed);
    }
  }
}
