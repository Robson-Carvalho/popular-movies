const movieContainer = document.querySelector("#movie-container");
let search = document.querySelector("#movie-name");
let urlCurrent = window.location.href;

const isFavorite = (id) => {
	let IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		IDs = JSON.parse(IDs)
		return IDs.includes(id) ? true : false;
	}
	return false;
}

const renderMovies = (movie) => {
	const movieCard = document.createElement("div");
	movieCard.classList.add("movie-card")

	const info = document.createElement("div");
	info.classList.add("info");

	const movieCover = document.createElement("img");
	movieCover.setAttribute("src", movie.image);
	movieCover.classList.add("movie-cover")
	movieCover.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`)

	const description = document.createElement("div");
	description.classList.add("description");

	const title = document.createElement("p");
	title.classList.add("title");
	title.innerText = movie.title;

	const category = document.createElement("div");
	category.classList.add("category");

	const stars = document.createElement("div");
	stars.classList.add("stars");

	const iconStars = document.createElement("img")
	iconStars.setAttribute("src", "./assets/star.svg");

	const rating = document.createElement("p");
	rating.innerText = movie.vote_average;

	const favorite = document.createElement("div");
	favorite.classList.add("favorite");

	const buttonFavorite = document.createElement("button");
	buttonFavorite.classList.add("btn-favorite");
	buttonFavorite.setAttribute("onclick", `handleToggleFavoriteMovie(${movie.id})`)

	const imgFavorite = document.createElement("img");
	imgFavorite.setAttribute("src", isFavorite(movie.id) ? "./assets/heart-full.svg" : "./assets/heart-empty.svg");

	const textButton = document.createElement("p");
	textButton.innerText = "Favoritar"

	const sinopse = document.createElement("p");
	sinopse.classList.add("sinopse")
	sinopse.innerText = movie.overview ? movie.overview : "Sem descrição!";

	stars.appendChild(iconStars);
	stars.appendChild(rating);
	buttonFavorite.appendChild(imgFavorite);
	buttonFavorite.appendChild(textButton);
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

const clearMovieContainer = () => movieContainer.innerHTML = "";

const addMoviesInContainer = (movies) => {
	clearMovieContainer();
	movies.forEach(movie => renderMovies(movie));
}

const getMovies = async (urlCurrent) => {
	try {
		let url = "https://api.themoviedb.org/3/movie/popular?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-br&page=1";
		url = urlCurrent === undefined ? url : window.location.href;
		const movies = await fetch(url);
		const response = await movies.json();
		const data = await response.results;

		addMoviesInContainer(data);
	} catch (error) {
		console.log(error);
	}
}

const getMoviesByName = async (movieName) => {
	try {
		const url = `https://api.themoviedb.org/3/search/movie?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-BR&query=${movieName}&page=1&include_adult=false`;
		const movies = await fetch(url)
		const response = await movies.json()
		const data = response.results;

		addMoviesInContainer(data)
	} catch (error) {
		console.log(error);
	}
}

const handleMovieSearch = () => {
	if (search !== "") {
		getMoviesByName(search.value);
		return search.value = "";
	}
}

const addMovieInLocalStorage = (id, movie) => {
	const IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		const allIDs = JSON.parse(IDs);
		localStorage.setItem("idMovie", JSON.stringify([...allIDs, id]));
		return getMovies(urlCurrent);
	}
	localStorage.setItem("idMovie", JSON.stringify([id]));
	return getMovies(urlCurrent);
}

const movieExistsInLocalStorage = (id) => {
	const IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		const movieExists = JSON.parse(IDs)
		return movieExists.includes(id) ? true : false;
	}
	return false
}

const removeMovieFromLocalStorage = (id) => {
	let idMovies = localStorage.getItem("idMovie");
	idMovies = JSON.parse(idMovies);

	let newIdMovies = idMovies.filter(idMovie => idMovie != id)

	localStorage.setItem("idMovie", JSON.stringify([...newIdMovies]));
	return getMovies(urlCurrent);
}

const handleToggleFavoriteMovie = async (idMovie) => {
	if (!movieExistsInLocalStorage(idMovie)) {
		try {
			const url = (`https://api.themoviedb.org/3/movie/${idMovie}?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-BR`);
			const movies = await fetch(url)
			const data = await movies.json()

			return addMovieInLocalStorage(idMovie, data);
		} catch (error) { console.log(error) }
	}
	removeMovieFromLocalStorage(idMovie)
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		if (search !== "") {
			handleMovieSearch();
		}
	}
});

getMovies();

