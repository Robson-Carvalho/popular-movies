const moviesContainer = document.querySelector("#movie-container");
const check = document.querySelector("#check");
let isCheck = false;
let search = document.querySelector("#movie-name");
let isInputCheck = false;
let currentResearch = "default";

const isFavorite = (id) => {
	let IDs = localStorage.getItem("idMovie");
	if (IDs !== null) {
		IDs = JSON.parse(IDs)
		return IDs.includes(id) ? true : false;
	}
	return false;
}

const renderMovie = (movie) => {
	const movieCard = document.createElement("div");
	movieCard.classList.add("movie-card")

	const divInfo = document.createElement("div");
	divInfo.classList.add("info");

	const movieCover = document.createElement("img");
	movieCover.setAttribute("src", movie.image);
	movieCover.classList.add("movie-cover")
	movieCover.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`)

	const divDescription = document.createElement("div");
	divDescription.classList.add("description");

	const movieTitle = document.createElement("p");
	movieTitle.classList.add("title");
	movieTitle.innerText = movie.title;

	const divCategory = document.createElement("div");
	divCategory.classList.add("category");

	const divStars = document.createElement("div");
	divStars.classList.add("stars");

	const iconStars = document.createElement("img")
	iconStars.setAttribute("src", "./assets/star.svg");

	const ranking = document.createElement("p");
	ranking.innerText = Number(movie.vote_average).toFixed(1);

	const divFavorite = document.createElement("div");
	divFavorite.classList.add("favorite");

	const buttonFavorite = document.createElement("button");
	buttonFavorite.classList.add("btn-favorite");
	buttonFavorite.setAttribute("onclick", `handleToggleFavoriteMovie(${movie.id})`);

	const imgHeart = document.createElement("img");
	imgHeart.setAttribute("src", isFavorite(movie.id) ? "./assets/heart-full.svg" : "./assets/heart-empty.svg");

	const textButtonFavorite = document.createElement("p");
	textButtonFavorite.innerText = "Favoritar"

	const movieSinopse = document.createElement("p");
	movieSinopse.classList.add("sinopse")
	movieSinopse.innerText = movie.overview ? movie.overview : "Sem descrição!";

	divStars.appendChild(iconStars);
	divStars.appendChild(ranking);
	buttonFavorite.appendChild(imgHeart);
	buttonFavorite.appendChild(textButtonFavorite);
	divFavorite.appendChild(buttonFavorite)
	divCategory.appendChild(divStars);
	divCategory.appendChild(divFavorite)
	divDescription.appendChild(movieTitle);
	divDescription.appendChild(divCategory);
	divInfo.appendChild(movieCover);
	divInfo.appendChild(divDescription);
	movieCard.appendChild(divInfo);
	movieCard.appendChild(movieSinopse)

	moviesContainer.appendChild(movieCard);
}

const clearMovieContainer = () => moviesContainer.innerHTML = "";

const addMoviesInContainer = (movies) => {
	clearMovieContainer();
	movies.map(movie => renderMovie(movie));
}

const getMovies = async (search) => {
	if (search === "default") {
		try {
			const url = "https://api.themoviedb.org/3/movie/popular?api_key=c01784035bbc1fa42a613a52fd09e823&language=pt-br&page=1";
			const movies = await fetch(url).then(res => res.json());
			const data = await movies.results;

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
		const movies = await fetch(url).then(res => res.json());
		const data = movies.results;

		addMoviesInContainer(data);
	} catch (error) {
		console.log(error);
	}
}

const handleMovieSearch = () => {
	if (search.value !== "") {
		getMoviesByName(search.value);
		return search.value = "";
	}
}

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

const refreshFavoriteMoviesOnScreen = (idMovies) => {
	if (idMovies.length > 0) {
		return checkingFavoriteMovies();
	} else {
		isCheck = false;
		check.checked = false;
		return getMovies(currentResearch);
	}
}

const removeMovieFromLocalStorage = (id) => {
	let idMovies = localStorage.getItem("idMovie");
	idMovies = JSON.parse(idMovies);

	idMovies = idMovies.filter(idMovie => idMovie != id)

	localStorage.setItem("idMovie", JSON.stringify([...idMovies]));

	refreshFavoriteMoviesOnScreen(idMovies);
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
		const movie = await fetch(url).then(res => res.json());
		return movie;
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

check.addEventListener("change", () => {
	isCheck = !isCheck;
	if (isCheck) {
		return checkingFavoriteMovies();
	}
	return getMovies(currentResearch);
});

window.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		console.log(search.value)
		if (search.value !== "") {
			handleMovieSearch();
		}
	}
});

getMovies(currentResearch);
