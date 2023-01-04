const movieContainer = document.querySelector("#movie-container");

getMovies();

function renderMovies(movie) {
	const movieData = movie;
	const movieCard = document.createElement("div");
	movieCard.classList.add("movie-card")
	const info = document.createElement("div");
	info.classList.add("info");
	const movieCover = document.createElement("img");
	movieCover.setAttribute("src", movieData.image);
	movieCover.classList.add("movie-cover")
	movieCover.setAttribute("src", `https://image.tmdb.org/t/p/w500${movieData.poster_path}`)
	const description = document.createElement("div");
	description.classList.add("description");
	const title = document.createElement("p");
	title.classList.add("title");
	title.innerText = movieData.title;
	const category = document.createElement("div");
	category.classList.add("category");
	const stars = document.createElement("div");
	stars.classList.add("stars");
	const iconStars = document.createElement("img")
	iconStars.setAttribute("src", "./assets/star.svg");
	const rating = document.createElement("p");
	rating.innerText = movieData.vote_average;
	const favorite = document.createElement("div");
	favorite.classList.add("favorite");
	const isFavorite = document.createElement("img");
	isFavorite.setAttribute("src", movieData.isFavorite ? "./assets/heart-full.svg" : "./assets/heart-empty.svg");
	const buttonFavorite = document.createElement("button");
	buttonFavorite.innerText = "Favoritar";
	const sinopse = document.createElement("p");
	sinopse.classList.add("sinopse")
	sinopse.innerText = movieData.overview ? movieData.overview : "Sem descrição!";

	stars.appendChild(iconStars);
	stars.appendChild(rating);
	favorite.appendChild(isFavorite);
	favorite.appendChild(buttonFavorite)
	category.appendChild(stars);
	category.appendChild(favorite)
	description.appendChild(title);
	description.appendChild(category);
	info.appendChild(movieCover);
	info.appendChild(description);
	movieCard.appendChild(info);
	movieCard.appendChild(sinopse)

	movieContainer.appendChild(movieCard);
}

function addMovies(movies) {
	movieContainer.innerHTML = "";
	movies.forEach(movie => renderMovies(movie));
}

async function getMovies() {
	try {
		const url = "https://api.themoviedb.org/3/movie/popular?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-br&page=1";
		const movies = await fetch(url);
		const response = await movies.json()
		const data = await response.results

		addMovies(data)
	} catch (error) {
		console.log(error);
	}
}

function handleSearchMovieByName() {
	let name = document.querySelector("#movie-name");
	if (name !== "") {
		getMovieByName(name.value);
		return name.value = "";
	}
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		handleSearchMovieByName();
	}
});

async function getMovieByName(movieName) {
	try {
		const url = `https://api.themoviedb.org/3/search/movie?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-BR&query=${movieName}&page=1&include_adult=false`;
		const movies = await fetch(url)
		const response = await movies.json()
		const data = response.results;

		addMovies(data)
	} catch (error) {
		console.log(error);
	}
}
