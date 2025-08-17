const words = ["AI Enthusiast", "Web Developer", "Tech Explorer"];
let i = 0;
let j = 0;
let isDeleting = false;

function typeEffect() {
  const typingElement = document.getElementById("typing");
  if (!typingElement) return;

  const current = words[i];
  const partial = isDeleting ? current.substring(0, j--) : current.substring(0, j++);

  typingElement.innerHTML = partial + '<span class="cursor">|</span>';

  if (!isDeleting && j === current.length + 1) {
    isDeleting = true;
    setTimeout(typeEffect, 1000); // pause before deleting
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % words.length;
    setTimeout(typeEffect, 500); // pause before next word
  } else {
    setTimeout(typeEffect, isDeleting ? 60 : 120);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);
