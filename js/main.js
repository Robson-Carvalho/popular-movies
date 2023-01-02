const movieContainer = document.querySelector("#movie-container");

function renderMovie(movie) {
	const movieData = movie;

	const movieCard = document.createElement("div");
	movieCard.classList.add("movie-card")
	const info = document.createElement("div");
	info.classList.add("info");
	const movieCover = document.createElement("img");
	movieCover.setAttribute("src", movieData.image);
	movieCover.classList.add("movie-cover")
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
	rating.innerText = movieData.rating;
	const favorite = document.createElement("div");
	favorite.classList.add("favorite");
	const isFavorite = document.createElement("img");
	isFavorite.setAttribute("src", movieData.isFavorite ? "./assets/heart-full.svg" : "./assets/heart-empty.svg");
	const buttonFavorite = document.createElement("button");
	buttonFavorite.innerText = "Favoritar";
	const sinopse = document.createElement("p");
	sinopse.classList.add("sinopse")
	sinopse.innerText = movieData.description;

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

const movies = [
	{
		image: 'https://img.elo7.com.br/product/original/3FBA809/big-poster-filme-batman-2022-90x60-cm-lo002-poster-batman.jpg',
		title: 'Batman',
		rating: 9.2,
		year: 2022,
		description: "Descrição do filme…",
		isFavorited: true,
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9b/Avengers_Endgame.jpg/250px-Avengers_Endgame.jpg',
		title: 'Avengers',
		rating: 9.2,
		year: 2019,
		description: "Descrição do filme…",
		isFavorited: false
	},
	{
		image: 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
		title: 'Doctor Strange',
		rating: 9.2,
		year: 2022,
		description: "Descrição do filme…",
		isFavorited: false
	},
];

movies.forEach(movie => renderMovie(movie));
