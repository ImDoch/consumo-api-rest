import { API_KEY } from "./api.js"
import { navigator } from "./navigation.js"

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': 'es'
    }
})

const getTrendingMoviesPreview = async () => {
    const { data } = await api(`trending/movie/day`)
    const movies = data.results
    const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')
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

    trendingPreviewMoviesContainer.append(...elements)
}

const getCategoriesPreview = async () => {
    const { data } = await api(`genre/movie/list`)
    const categories = data.genres
    const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')
    const elements = categories.map(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.id = `id${category.id}`
        categoryTitle.textContent = category.name

        categoryContainer.append(categoryTitle)
        return categoryContainer
    })

    previewCategoriesContainer.append(...elements)
}

export { getTrendingMoviesPreview, getCategoriesPreview }
