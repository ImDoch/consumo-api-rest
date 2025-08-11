import { getTrendingMoviesPreview, getCategoriesPreview } from "./main.js";

const navigator = () => {
    console.log({ location });
    
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
        getTrendingMoviesPreview()
        getCategoriesPreview()
    }
}

const homePage = () => {
    console.log('home')
}

const categoriesPage = () => {
    console.log('category');
}

const movieDetailsPage = () => {
    console.log('movie'); 
}

const searchPage = () => {
    console.log('search');
}

const trendsPage = () => {
    console.log('trends');
}
export { navigator }