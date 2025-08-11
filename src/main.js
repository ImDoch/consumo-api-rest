import { API_KEY } from './api.js'
import { navigator } from './navigation.js'
import { trendingMoviesPreviewList, categoriesPreviewList, searchFormBtn, trendingBtn, arrowBtn, genericSection, searchFormInput, headerTitle } from './nodes.js'

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
const createMovies = (movies, container) => {
    const elements = movies.map(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.alt = movie.title
        movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`

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
    createMovies(movies, trendingMoviesPreviewList)
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
    createMovies(movies, genericSection)
}

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    })
    const movies = data.results
    createMovies(movies, genericSection)
}

const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    createMovies(movies, genericSection)
}

export { getTrendingMoviesPreview, getCategoriesPreview, getMoviesByCategory, getMoviesBySearch, getTrendingMovies }
