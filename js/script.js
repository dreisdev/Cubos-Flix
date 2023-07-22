// Iniciando primeiro comentário e PR.

const body = document.querySelector('body');
const size = document.querySelector('.size');
const header = document.querySelector('.header');
const headerContainerLogo = document.querySelector('.header__container-logo');
const headerTitle = document.querySelector('header__title');
const headerContainerRight = document.querySelector('.header__container-right');

const filterInput = document.querySelector('.input');
const btnTheme = document.querySelector('.btn-theme');

const container = document.querySelector('.container');
const moviesContainer = document.querySelector('.movies-container');
const btnPrev = document.querySelector('.btn-prev');
const movies = document.querySelector('.movie');
const btnNext = document.querySelector('.btn-next');
const movieInfo = document.querySelector('.movie__info');
const movieTitle = document.querySelector('.movie__title');
const movieRating = document.querySelector('.movie__rating');

const highlight = document.querySelector('.highlight');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightVideo = document.querySelector('.highlight__video');
const highlightInfo = document.querySelector('.highlight__info');
const highlightTitleRating = document.querySelector('.highlight__title-rating');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenreLaunch = document.querySelector('.highlight__genre-launch');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');

const modal = document.querySelector('.modal');
const modalHidden = document.querySelector('.hidden');
const modalBody = document.querySelector('.modal__body');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenreAverage = document.querySelector('.modal__genre-average');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');
const modalClose = document.querySelector('.modal__close');
const inputColor = document.querySelector('.input');




const totalMovies = 18;
const moviesPerPage = 6;

let currentPage = 0;

let moviesData = [];

let searchTerm = '';



async function fetchMovies() {
    const response = await api.get('3/discover/movie?language=pt-BR&include_adult=false');
    const moviesData = response.data.results.slice(0, totalMovies);
    return moviesData;

};

async function fetchMoviesFilter() {
    const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchTerm}`);
    const moviesData = response.data.results.slice(0, totalMovies);
    return moviesData;

};

async function fetchMoviesVideo() {

    const responseVideo = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    const moviesDataVideo = await responseVideo.data.results[1].key;

    return moviesDataVideo;

}

fetchMoviesVideo();


async function fetchMoviesGenres() {

    const responseG = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const moviesDataG = await responseG.data;

    const genres = [
        moviesDataG.genres[0].name,
        moviesDataG.genres[1].name,
        moviesDataG.genres[2].name,
    ];

    const genresString = genres.join(', ');

    highlightGenres.textContent = genresString;


    return moviesDataG;


}

fetchMoviesGenres();



async function fetchMoviesGeral() {
    const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const moviesData = await response.data;
    return moviesData;

}

async function showMovies(searchTerm = '') {

    const startIndex = currentPage * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;


    if (searchTerm.length <= 0) {
        moviesData = await fetchMovies();
    } else {

        moviesData = await fetchMoviesFilter();
    }



    const allElements = moviesContainer.querySelectorAll('*');

    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        if (!element.classList.contains('btn-prev') && !element.classList.contains('btn-next')) {
            element.remove();
        }
    }


    moviesData.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(startIndex, endIndex)
        .forEach(movie => {
            const cardMovies = movie.poster_path;
            const movieTitle = movie.title;
            const movieRating = movie.vote_average;

            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.style.backgroundImage = `url(https://image.tmdb.org/t/p/w342${cardMovies})`;
            movieElement.addEventListener('click', () => openModal(movie.id));

            const movieInfo = document.createElement('div');
            movieInfo.classList.add('movie__info');
            movieElement.appendChild(movieInfo);

            const movieTitleElement = document.createElement('span');
            movieTitleElement.classList.add('movie__title');
            movieTitleElement.textContent = movieTitle;
            movieInfo.appendChild(movieTitleElement);

            const movieRatingElement = document.createElement('span');
            movieRatingElement.classList.add('movie__rating');
            movieRatingElement.textContent = movieRating;
            movieInfo.appendChild(movieRatingElement);

            const movieRatingImage = document.createElement('img');
            movieRatingImage.src = '../assets/estrela.svg';
            movieRatingImage.alt = 'Estrela';
            movieRatingElement.appendChild(movieRatingImage);

            moviesContainer.appendChild(movieElement);



        });
};

showMovies();

function pagination() {

    btnPrev.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
        } else {
            currentPage = 2;
        }

        showMovies();


    });

    btnNext.addEventListener('click', () => {
        if (currentPage < 2) {
            currentPage++;
        } else {
            currentPage = 0;
        }
        showMovies();

    });

}

pagination();

async function MoviesFilter() {

    filterInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {

            currentPage = 0;
            searchTerm = event.target.value;
            showMovies(searchTerm);
            filterInput.value = '';

        }
    });

};

MoviesFilter();


async function movieDay() {
    const moviesDataVideo = await fetchMoviesVideo();
    const moviesData = await fetchMoviesGeral();
    const highlightMovies = moviesData.backdrop_path;
    const highlightT = moviesData.title;
    const highlightR = moviesData.vote_average;
    const highlightL = moviesData.release_date;
    const highlightD = moviesData.overview;



    highlightVideo.style.backgroundImage = `url(${highlightMovies})`;
    highlightTitle.textContent = highlightT;
    highlightRating.textContent = highlightR;
    highlightLaunch.textContent = new Date(highlightL).toLocaleDateString('pt-br', {
        year: 'numeric',
        month: "long",
        day: "numeric",
    });
    highlightDescription.textContent = highlightD;

    highlightVideoLink.href = 'https://www.youtube.com/watch?v=' + moviesDataVideo;



};

movieDay();

async function modalMovies(id) {


    modal.classList.remove("hidden");

    const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
    const moviesData = await response.data;



    modalGenres.textContent = '';
    moviesData.genres.forEach((genre) => {
        const modalGenre = document.createElement("span");
        modalGenre.textContent = genre.name;
        modalGenre.classList.add("modal__genre");

        modalGenres.append(modalGenre);


        modalTitle.textContent = moviesData.title;
        modalImg.src = moviesData.backdrop_path;
        modalDescription.textContent = moviesData.overview;
        modalAverage.textContent = moviesData.vote_average;

        return moviesData;

    });

}


function openModal(id) {

    modalMovies(id);

}


function closeModal() {
    modal.style.overflowY = "auto";
    modal.classList.add("hidden");


}

function actionCloseModal() {
    modal.addEventListener('click', (event) => {

        if (event.target.classList.contains('modal__body') || event.target.classList.contains('modal__close')
            || event.target.classList.contains('modal__title') || event.target.classList.contains('modal__img')
            || event.target.classList.contains('modal__description') || event.target.classList.contains('modal__genre-average')
            || event.target.classList.contains('modal__genres') || event.target.classList.contains('modal__genres')) {
            closeModal();
        }

    })


}

actionCloseModal();


function configTheme() {

    btnTheme.addEventListener('click', changeTheme);

    localStorage.getItem('theme') === 'dark' ? themeDark() : themeLight();

    function changeTheme() {
        localStorage.getItem("theme") === "dark" ? themeLight() : themeDark();
    }

    function themeDark() {

        localStorage.setItem('theme', 'dark');
        btnTheme.src = '../assets/dark-mode.svg';
        btnPrev.src = '../assets/seta-esquerda-branca.svg';
        btnNext.src = '../assets/seta-direita-branca.svg';
        modalClose.src = '../assets/close.svg';

        body.style.setProperty('--background', '#1B2028');
        body.style.setProperty('--text-color', '#FFFFFF');
        moviesContainer.style.setProperty('--bg-secondary', '#2D3440');
        highlight.style.setProperty('--bg-secondary', '#2D3440');
        modalBody.style.setProperty('--bg-secondary', '#2D3440');
        inputColor.style.setProperty('--background', '#665F5F');
        inputColor.style.setProperty('--input-color', '#FFFFFF');




    }

    function themeLight() {

        localStorage.setItem('theme', 'light');
        btnTheme.src = '../assets/light-mode.svg';
        btnPrev.src = '../assets/seta-esquerda-preta.svg';
        btnNext.src = '../assets/seta-direita-preta.svg';
        modalClose.src = '../assets/close-dark.svg';

        body.style.setProperty('--background', '#fff');
        body.style.setProperty('--text-color', '#1b2028');
        moviesContainer.style.setProperty('--bg-secondary', '#ededed');
        highlight.style.setProperty('--bg-secondary', '#ededed');
        modalBody.style.setProperty('--bg-secondary', '#ededed');
        inputColor.style.setProperty('--background', '#fff');
        inputColor.style.setProperty('--input-color', '#979797');



    }



}

configTheme();



































