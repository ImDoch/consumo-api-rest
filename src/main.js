import { API_KEY } from './api.js'
import { navigator } from './navigation.js'
import { trendingMoviesPreviewList, categoriesPreviewList, searchFormBtn, trendingBtn, arrowBtn, genericSection, searchFormInput, headerTitle, movieDetailTitle, movieDetailDescription, movieDetailScore, movieDetailCategoriesList, headerSection, relatedMoviesContainer, sentinel } from './nodes.js'

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
const state = {
    page: 1,
    maxPage: undefined
}

const lazyLoader = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const imgUrl = entry.target.dataset.img
            entry.target.src = imgUrl
            observer.unobserve(entry.target)
        }   
    })
})

const createInfineScrollObserver = (callback) => {
    const infineScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback()
            }
        })
    }, {
        rootMargin: '200px 0px'
    })

    return infineScrollObserver
}

const createMovies = (
    movies,
    container,
    {
        lazyLoad = false, 
        clean = true
    } = {}
) => {
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
    if (clean) container.innerHTML=''
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
    params: {
        'api_key': API_KEY,
    }
})

const getTrendingMoviesPreview = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    createMovies(movies, trendingMoviesPreviewList, {lazyLoad: true})
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
    state.maxPage = data.total_pages
    createMovies(movies, genericSection, {lazyLoad: true, clean: true})
}

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie', {
        params: {
            query
        }
    })
    const movies = data.results
    state.maxPage = data.total_pages
    createMovies(movies, genericSection, {lazyLoad: true, clean: true})
}

const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    state.maxPage = data.total_pages
    createMovies(movies, genericSection, {lazyLoad: true, clean: true})
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

const getPaginatedTrendingMovies = async () => {
    const isNotMaxPage = state.page < state.maxPage
    if (isNotMaxPage) {
        state.page++
        const { data } = await api(`trending/movie/day`, {
            params: {
                page: state.page
            }
        })
        const movies = data.results
        createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
}

const getPaginatedMoviesBySearch = async (query) => {
    const isNotMaxPage = state.page < state.maxPage
    if (isNotMaxPage) {
        state.page++
        const { data } = await api('search/movie', {
            params: {
                query,
                page: state.page
            }
        })
        const movies = data.results
        createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
}

const getPaginatedMoviesByCategory = async (id) => {
    const isNotMaxPage = state.page < state.maxPage
    if (isNotMaxPage) {
        state.page++
        const { data } = await api(`discover/movie`, {
            params: {
                with_genres: id,
                page: state.page
            }
        })
        const movies = data.results
        createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
}


export { getTrendingMoviesPreview, getCategoriesPreview, getMoviesByCategory, getMoviesBySearch, getTrendingMovies, getMovieDetailById, createInfineScrollObserver, getPaginatedTrendingMovies, getPaginatedMoviesBySearch, getPaginatedMoviesByCategory, state}
