let carouselList1El = document.querySelector("#carouselList1");
let carouselList2El = document.querySelector("#carouselList2");
let dropDownEl = document.querySelector("#dropDown");

let inputEl = document.querySelector("#searchBox");

let favtList = [];
let recommendedList = [];

function getPhotos(userValue) {
  const API_KEY = "rakVZ84e4ueEcJDOZiR23XPAEw25CGdfCO61jybSvCxygXTC423MpOrD";
  const perPage = 10;

  const url = `https://api.pexels.com/v1/search?query=${userValue}&per_page=${perPage}`;

  fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      updatePhotoSection(data.photos[0]);
      displayPhotos(data.photos);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  function updatePhotoSection(photoObject) {
    console.log(photoObject);
    const photoContainer = document.getElementById("searchResultsSection");
    photoContainer.innerHTML = `
    <img
          class="search-photo"
          src=${photoObject.src.original}
          alt=""
          data-photo-id="${photoObject.id}"
        />    

        <div class="search-photo-content">
          <h1 class="search-photo-title">${photoObject.alt}</h1>
          <p class="photographer-name">${photoObject.photographer}</p>
          <button class="photo-btn poster-watch-button">Explore</button>
        </div>
    `;
  }

  function displayPhotos(photos) {
    const photoContainer = document.getElementById("carouselList1");
    photoContainer.innerHTML = "";

    photos.forEach((photo) => {
      const img = document.createElement("img");
      const favoriteIcon = document.createElement("span");
      const liEl = document.createElement("li");
      liEl.classList.add("splide__slide", "splide-list-item");
      img.src = photo.src.medium;
      img.alt = photo.photographer;
      img.setAttribute("data-photo-id", photo.id);
      favoriteIcon.classList.add("favorite-icon");
      favoriteIcon.setAttribute("data-photo-id", photo.id);
      favoriteIcon.innerHTML = "&#x2661;";
      liEl.appendChild(img);
      liEl.appendChild(favoriteIcon);
      photoContainer.appendChild(liEl);
    });

    splide1.mount();
  }
}

// Event listener for adding to favorites
carouselList1El.addEventListener("click", addToFavorites);

// Event listener for removing from favorites
carouselList2El.addEventListener("click", removeFromFavorites);

function addToFavorites(event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("favorite-icon")) {
    const slideToRemove = clickedElement.closest(".splide__slide");

    // Modify favorite icon in the slide to red
    const favoriteIcon = slideToRemove.querySelector(".favorite-icon");
    favoriteIcon.style.color = "red";

    // Append the slide to the favorites list
    carouselList2El.appendChild(slideToRemove);

    // Remount Splide instance for the favorites carousel
    splide2.mount();
  }
}

function removeFromFavorites(event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("favorite-icon")) {
    const slideToRemove = clickedElement.closest(".splide__slide");
    const favoriteIcon = slideToRemove.querySelector(".favorite-icon");
    favoriteIcon.style.color = "";

    // Append the slide back to the main carousel
    carouselList1El.appendChild(slideToRemove);

    // Remount Splide instance for the main carousel
    splide1.refresh();
  }
}

// Initialize Splide instances

function getData(e) {
  console.log(e.target.value);
  getPhotos(e.target.value);
}

let splide1 = new Splide("#carousel1", {
  pagination: false,
  perPage: 4,
  gap: 25,
  breakpoints: {
    425: {
      perPage: 2,
    },
    768: {
      perPage: 3,
    },
  },
});

let splide2 = new Splide("#carousel2", {
  pagination: false,
  perPage: 4,
  gap: 25,

  breakpoints: {
    425: {
      perPage: 2,
    },
    768: {
      perPage: 3,
    },
  },
});
// splide2.mount();
inputEl.addEventListener("change", getData);

carouselList1El.addEventListener("click", addToFavorites);
// carouselList2El.addEventListener("click", removeFromFavorites);
