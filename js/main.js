const moviesContainer = document.querySelector("#movie-container");
const switchMovieBetweenFavoriteAndDefault = document.querySelector("#switchMovieBetweenFavoriteAndDefault");
let isInputCheck = false;
let search = document.querySelector("#movie-name");
let currentResearch = "default";

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
	rating.innerText = Number(movie.vote_average).toFixed(1);

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

	moviesContainer.appendChild(movieCard);
}

const clearMovieContainer = () => moviesContainer.innerHTML = "";

const addMoviesInContainer = (movies) => {
	clearMovieContainer();
	movies.forEach(movie => renderMovies(movie));
}

const getMovies = async (search) => {
	if (search === "default") {
		try {
			const url = "https://api.themoviedb.org/3/movie/popular?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-br&page=1";
			const movies = await fetch(url);
			const response = await movies.json();
			const data = await response.results;
			currentResearch = "default";

			return addMoviesInContainer(data);
		} catch (error) {
			console.log(error);
		}
	}
	return getMoviesByName(search);
}

const getMoviesByName = async (movieName) => {
	currentResearch = movieName;
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

window.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		if (search !== "") {
			handleMovieSearch();
		}
	}
});


const addMovieInLocalStorage = (id) => {
	const IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		const allIDs = JSON.parse(IDs);
		localStorage.setItem("idMovie", JSON.stringify([...allIDs, id]));
		return getMovies(currentResearch);
	}
	localStorage.setItem("idMovie", JSON.stringify([id]));
	return getMovies(currentResearch);
}

const removeMovieFromLocalStorage = (id) => {
	let idMovies = localStorage.getItem("idMovie");
	idMovies = JSON.parse(idMovies);

	let newIdMovies = idMovies.filter(idMovie => idMovie != id)

	localStorage.setItem("idMovie", JSON.stringify([...newIdMovies]));

	if (isInputCheck) {
		return checkingFavoriteMovies();
	}
	return getMovies(currentResearch);
}

const movieExistsInLocalStorage = (id) => {
	const IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		const movieExists = JSON.parse(IDs)
		return movieExists.includes(id) ? true : false;
	}
	return false
}

const handleToggleFavoriteMovie = async (id) => {
	if (!movieExistsInLocalStorage(id)) {
		return addMovieInLocalStorage(id);
	}
	removeMovieFromLocalStorage(id)
}

const getMoviebyID = async (id) => {
	try {
		const url = (`https://api.themoviedb.org/3/movie/${id}?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-BR`);
		const movies = await fetch(url).then(res => res.json())
		return movies
	} catch (error) {
		console.log(error);
	}
}

const getMoviesFavorite = (arrayIDs) => {
	let arrayMovies = []
	arrayIDs.map(id => {
		arrayMovies.push(getMoviebyID(id))
	});
	arrayMovies = Promise.all(arrayMovies).then(favoriteMovies => favoriteMovies)
	arrayMovies.then(favoriteMovies => addMoviesInContainer(favoriteMovies))
}

const checkingFavoriteMovies = () => {
	const alertText = "Ops! Infelizmente você ainda não favoritou nenhum filme, para usar essa funcionalidade, pesquise seus filmes preferidos e clique em favoritar e tente novamente!";
	let arrayIDs = localStorage.getItem("idMovie");
	arrayIDs = JSON.parse(arrayIDs);

	arrayIDs.length > 0 ? getMoviesFavorite(arrayIDs) : alert(alertText);
}

switchMovieBetweenFavoriteAndDefault.addEventListener("change", () => {
	isInputCheck = !isInputCheck;
	if (isInputCheck) {
		return checkingFavoriteMovies();
	}
	return getMovies(currentResearch);
});

getMovies(currentResearch);

