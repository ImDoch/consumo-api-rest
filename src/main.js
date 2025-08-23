import { API_KEY } from './api.js'
import { navigator } from './navigation.js'
import { trendingMoviesPreviewList, categoriesPreviewList, searchFormBtn, trendingBtn, arrowBtn, genericSection, searchFormInput, headerTitle, movieDetailTitle, movieDetailDescription, movieDetailScore, movieDetailCategoriesList, headerSection, relatedMoviesContainer } from './nodes.js'

//Events
headerTitle.addEventListener('click', () => location.hash = '#home')
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value.trim()}`
})
trendingBtn.addEventListener('click', () => location.hash = '#trends')
arrowBtn.addEventListener('click', () => {
    const previousUrl = document.referrer
     if (previousUrl.includes(location.hostname)) {
        history.back();
    } else {
        location.hash = '#home';
    }
})

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

//Utils
const lazyLoader = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const imgUrl = entry.target.dataset.img
            entry.target.src = imgUrl
            observer.unobserve(entry.target)
        }   
    })
})

const createMovies = (movies, container, lazyLoad = false) => {
    const elements = movies.map(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', () => {
            location.hash= `#movie=${movie.id}`
        })

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.alt = movie.title
        lazyLoad 
            ? movieImg.dataset.img = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`

        movieImg.addEventListener('error', () => {
            movieImg.src = './img/404-error-robot-img.png'
        })
        if(lazyLoad) lazyLoader.observe(movieImg)

        movieContainer.append(movieImg)
        return movieContainer
    })
    container.innerHTML=''
    container.append(...elements)
}

const createCategories = (categories, container) => {
    const elements = categories.map(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.id = `id${category.id}`
        categoryTitle.textContent = category.name
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })
        categoryContainer.append(categoryTitle)
        return categoryContainer
    })
    container.innerHTML=''
    container.append(...elements)
}

//API Calls
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
})

const getTrendingMoviesPreview = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    createMovies(movies, trendingMoviesPreviewList, true)
}

const getCategoriesPreview = async () => {
    const { data } = await api(`genre/movie/list`)
    const categories = data.genres
    createCategories(categories, categoriesPreviewList)
}

const getMoviesByCategory = async (id) => {
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
        }
    })
    const movies = data.results
    createMovies(movies, genericSection, true)
}

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    })
    const movies = data.results
    createMovies(movies, genericSection, true)
}

const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    createMovies(movies, genericSection, true)
}

const getMovieDetailById = async (id) => {
    const { data: movie } = await api(`movie/${id}`)
    
    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    headerSection.style.background = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), 
        url(${movieImgUrl})`

    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent =  movie.overview
    movieDetailScore.textContent = movie.vote_average

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMoviesById(id)
}

const getRelatedMoviesById = async (id) => {
    const { data } = await api(`movie/${id}/similar`)
    const relatedMovies = data.results
    createMovies(relatedMovies, relatedMoviesContainer, true)
}


export { getTrendingMoviesPreview, getCategoriesPreview, getMoviesByCategory, getMoviesBySearch, getTrendingMovies, getMovieDetailById }
