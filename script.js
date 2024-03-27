let carouselList1El = document.querySelector("#carouselList1");
let carouselList2El = document.querySelector("#carouselList2");
let dropDownEl = document.querySelector("#dropDown");

let inputEl = document.querySelector("#searchBox");

let favtMoviesList = [];
let recommendedMoviesList = [];

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
      img.setAttribute("data-photo-id", photo.id); // Add photo id as data attribute
      favoriteIcon.classList.add("favorite-icon");
      favoriteIcon.setAttribute("data-photo-id", photo.id); // Add photo id as data attribute to favorite icon
      favoriteIcon.innerHTML = "&#x2661;"; // Heart symbol
      liEl.appendChild(img);
      liEl.appendChild(favoriteIcon); // Append favorite icon to the slide
      photoContainer.appendChild(liEl);
    });

    splide1.mount();
  }
}

function addToFavorites(event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("favorite-icon")) {
    const photoId = clickedElement.getAttribute("data-photo-id");
    const slideToRemove = clickedElement.closest(".splide__slide");
    const slideClone = slideToRemove.cloneNode(true);

    // Modify favorite icon in the cloned slide to red
    const favoriteIcon = slideClone.querySelector(".favorite-icon");
    favoriteIcon.style.color = "red";

    carouselList2El.appendChild(slideClone); // Add cloned slide to favorites
    // Remount Splide instance for the favorites carousel
    if (!splide2.initialized) {
      splide2.mount();
    } else {
      splide2.refresh();
    }
  }
}

function getData(e) {
  console.log(e.target.value);
  getPhotos(e.target.value);
}

let splide1 = new Splide("#carousel1", {
  pagination: false,
  perPage: 4,
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
  breakpoints: {
    425: {
      perPage: 2,
    },
    768: {
      perPage: 3,
    },
  },
});

inputEl.addEventListener("change", getData);

carouselList1El.addEventListener("click", addToFavorites);
