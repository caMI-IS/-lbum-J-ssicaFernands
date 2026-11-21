const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const photos = Array.from({ length: 21 }, (_, index) => ({
  src: `img/fotos/foto ${index + 1}.jpeg`,
  number: index + 1
}));

let currentPhotoIndex = 0;
let loadedPhotos = [];

photos.forEach((photo) => {
  const card = document.createElement("div");
  card.className = "photo-card";

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = `Fotografia ${photo.number}`;
  image.loading = "lazy";

  image.addEventListener("load", () => {
    card.classList.remove("placeholder");
    card.innerHTML = "";
    card.appendChild(image);

    const number = document.createElement("span");
    number.className = "photo-number";
    number.textContent = `Recordação ${String(photo.number).padStart(2, "0")}`;
    card.appendChild(number);

    card.addEventListener("click", () => openLightbox(photo.number - 1));
    loadedPhotos.push(photo.number - 1);
  });

  image.addEventListener("error", () => {
    card.classList.add("placeholder");
    card.innerHTML = `
      <div class="placeholder-content">
        <span class="flower" aria-hidden="true">🌻</span>
        <strong>Adicione sua foto ${photo.number}</strong>
        <small>img/fotos/foto${photo.number}.jpg</small>
      </div>
    `;
  });

  card.appendChild(image);
  gallery.appendChild(card);
});

function openLightbox(index) {
  currentPhotoIndex = index;
  showPhoto();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function showPhoto() {
  const photo = photos[currentPhotoIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = `Fotografia ${photo.number}`;
  lightboxCaption.textContent = `Recordação ${String(photo.number).padStart(2, "0")} de 21`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function movePhoto(direction) {
  const available = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ photo }) => {
      // Só permite navegar por fotos que realmente existem.
      return loadedPhotos.includes(photo.number - 1);
    })
    .map(({ index }) => index);

  if (!available.length) return;
  const position = available.indexOf(currentPhotoIndex);
  const nextPosition = (position + direction + available.length) % available.length;
  currentPhotoIndex = available[nextPosition];
  showPhoto();
}

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevPhoto").addEventListener("click", () => movePhoto(-1));
document.getElementById("nextPhoto").addEventListener("click", () => movePhoto(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});
