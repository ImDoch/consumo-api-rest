import { getTrendingMoviesPreview, getCategoriesPreview, getMoviesByCategory, getMoviesBySearch,getTrendingMovies, getMovieDetailById, createInfineScrollObserver, getPaginatedTrendingMovies, getPaginatedMoviesBySearch, getPaginatedMoviesByCategory, state} from "./main.js";
import { headerSection, trendingPreviewSection, categoriesPreviewSection, genericSection, movieDetailSection, searchForm, trendingMoviesPreviewList, categoriesPreviewList, movieDetailCategoriesList, relatedMoviesContainer, headerTitle, arrowBtn, headerCategoryTitle, searchFormInput, movieDetailTitle, movieDetailDescription, movieDetailScore, sentinel } from "./nodes.js"

let currentObserver = null

const navigator = () => {
    if (location.hash.startsWith('#trends')) {
        trendsPage()
    }
    else if (location.hash.startsWith('#search=')) {
        searchPage()
    }
    else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage()
    }
    else if (location.hash.startsWith('#category=')) {
        categoriesPage()
    }
    else {
        homePage()
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
}


const homePage = () => {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--withe')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()

    if(currentObserver) {
        currentObserver.disconnect()
        currentObserver = null
    }
}

const categoriesPage = () => {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--withe')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    sentinel.classList.remove('inactive')

    const [_, categoryData] = location.hash.split('=')
    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.textContent = categoryName

    state.page = 1
    getMoviesByCategory(categoryId)

    if(currentObserver) {
        currentObserver.disconnect()
        currentObserver = null
    }
    currentObserver = createInfineScrollObserver(() => getPaginatedMoviesByCategory(categoryId))
    currentObserver.observe(sentinel)
}

const movieDetailsPage = () => {
    headerSection.classList.add('header-container--long')
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [_, movieId] = location.hash.split('=')
    getMovieDetailById(movieId)

    if(currentObserver) {
        currentObserver.disconnect()
        currentObserver = null
    }
}

const searchPage = () => {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--withe')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    sentinel.classList.remove('inactive')

    const [_, queryValue] = location.hash.split('=')

    state.page = 1

    getMoviesBySearch(queryValue)

    if(currentObserver) {
        currentObserver.disconnect()
        currentObserver = null
    }
    currentObserver = createInfineScrollObserver(() => getPaginatedMoviesBySearch(queryValue))
    currentObserver.observe(sentinel)
}

const trendsPage = () => {
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--withe')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    sentinel.classList.remove('inactive')

    headerCategoryTitle.textContent = 'Tendencias'

    state.page = 1
    getTrendingMovies()

    if(currentObserver) {
        currentObserver.disconnect()
        currentObserver = null
    }
    currentObserver = createInfineScrollObserver(getPaginatedTrendingMovies)
    currentObserver.observe(sentinel)
}


export { navigator }