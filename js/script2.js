const API_KEY = '58849ed063aa6342b28375e0158bad3b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.querySelector('#main1');
let localMovieId = localStorage.getItem("movieId");
let trailer = localStorage.getItem('openNav(movie)');
console.log(localMovieId);
const movieId = localMovieId;
window.onbeforeunload = function(){
localStorage.setItem('movieId', movieId);
}

// getMovies();
// function getMovies(){
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', 'https://api.themoviedb.org/3/movie/popular?api_key=58849ed063aa6342b28375e0158bad3b', true);
//     xhttp.onload = function(){
//         obj = JSON.parse(this.responseText);
//         console.log(obj.results);
//         showMovie(obj.results);
//     }

//     xhttp.send();
// }

showMovie();

function showMovie(){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.themoviedb.org/3/movie/${movieId}?api_key=58849ed063aa6342b28375e0158bad3b`, true);
        xhr.onload = function(){
           let datas = JSON.parse(this.responseText);
            getData(datas);
            console.log(datas);
        }
        xhr.send();
    
}
main1.innerHTML = '';
function getData(datas){
    let {original_title, poster_path, backdrop_path, budget, genres, production_countries, 
    release_date, revenue, runtime, overview, vote_average, production_companies} = datas;
    let genre= [];
    let production = []
    let country = [];
    genres.forEach(genres =>{
      let {name} = genres;
      genre.push(' ' +name);
    })
    production_companies.forEach(pC =>{
        let {name} = pC;
        production.push(" " + name);
    })
    production_countries.forEach(production =>{
        let {name} = production;
        country.push(" " + name);
    })
    main.innerHTML = `
        <div class="main-div" style="background-image: url('${IMG_URL + backdrop_path}');">
    <div class="desc" >
                <div class="img-div">
                    <img src= '${IMG_URL + poster_path}'class="movie-img">
                </div>
                
                <div class="movie-desc">
                    <h1>${original_title}</h1>
                    <div class="page2-trailer" id="trailer">Trailer</div>
                    <span >TMDB:${vote_average}</span>
                   
                    <div class ="movie-overview" >Overview :
                      <div> ${overview} </div>
                    </div>
                    <div style="padding-top:5px; padding-bottom:5px">Released : ${release_date}</div>
                    <div style="padding-top:5px; padding-bottom:5px">Genre : ${genre}</div>
                    <div style="padding-top:5px; padding-bottom:5px">Duration:${runtime} min</div>
                    <div style="padding-top:5px; padding-bottom:5px">Production Companies : ${production}</div>
                    <div style="padding-top:5px; padding-bottom:5px">Country: ${country}</div>
                </div>
            </div>
    </div>        
    `;
}
const a = document.querySelector('#id');
a.addEventListener('click', ()=>{
    eval(trailer);
    openNav(movie);
})

