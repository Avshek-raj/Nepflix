const API_KEY = 'api_key=58849ed063aa6342b28375e0158bad3b';
const BASE_URL = 'https://api.themoviedb.org/3';
let catagory = 'popular';
const API_URL = BASE_URL + `/movie/${catagory}?` + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?' + API_KEY;
const GENRE_URL = BASE_URL + '/discover/movie?with_genres=';


const main = document.querySelector('#main');
const form = document.querySelector('#form');
const searchEl = document.querySelector('.search');
const title = document.querySelector('#title');
const tagsEl = document.querySelector('#tags');
const overlay = document.querySelector('.overlay-content');
const nextPage = document.querySelector(".next-page")
const previousPage = document.querySelector('.previous-page')
const pageNo = document.querySelector('.pageNo');

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
let selectedgenre = [];

setGenre();

function setGenre(){
    tagsEl.innerText = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', ()=>{
          if(selectedgenre.length == 0)
            selectedgenre.push(genre.id);
          else{
            if(selectedgenre.includes(genre.id)){
              selectedgenre.forEach((id, idx) =>{
                if(id ==genre.id){
                  selectedgenre.splice(idx, 1);
                }
              })   
            }
            else{
              selectedgenre.push(genre.id);
            }
          }
          getMovies(GENRE_URL+selectedgenre +'&' + API_KEY);
          highlightTag();
        })
        tagsEl.append(t);
    })
}
function highlightTag(){
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag =>{
    tag.classList.remove('highlight');
  })
  if(selectedgenre.length !=0){
    selectedgenre.forEach(id =>{
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add('highlight');
    })
  }
}


getMovies(API_URL);
let totalPages = 0;
function getMovies(url){
   fetch(url).then(res => res.json()).then(data => {
       showMovies(data.results);
       totalPages = data.total_pages;
       if (data.results.length == 0){
          main.innerHTML = `<h1 id="noResult">No Results Found</h1>`;
       }
   })
}


function showMovies(data){  
    main.innerHTML = `<div class="Category">
    <div class="Category-style"></div>
    <h2 class="Category-heading">Most Popular Movies</h2>
    </div>`;
    data.forEach(movie => {
        const {title, vote_average, poster_path,overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <div class="movie">
        <img src="${poster_path? IMG_URL + poster_path: 'https://via.placeholder.com/1080x1580' }" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        
        <div class="overview">
            <H3>Overview</H3>
            ${overview}
            <button class="know-more" id="${id}">Trailer</button>
        </div>
    </div> ` 

    main.appendChild(movieEl);
    document.getElementById(id).addEventListener('click', ()=>{
      openNav(movie);
      
    });
    })
   
}
let overlayContent = document.querySelector('#overlay-content');
function openNav(movie) {
  const id = movie.id; 
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json())
  .then(videoData => {
    if(videoData){
      console.log(videoData);
      if(videoData.results.length>0){
        let embed = [];
        let dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video;
          if(site == 'YouTube'){
            embed.push(`
              <iframe width="854" height="430" src="https://www.youtube.com/embed/${key}" 
              title="${name}" class="embed hide" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen></iframe>
            `)
            
            dots.push(`
              <span class="dot">${idx +1}</span>
            `)
          }
        })
        let content = (`  ${embed.join('')}
          <div class="dot-div">${dots.join('')}</div>
        `);
        overlayContent.innerHTML = content;
        showTrailer(embed);
        document.getElementById("myNav").style.width = "100%";
      }  
      else{
        overlay.innerHTML = `<h1 id="noResult">No Results Found</h1>`;
          }
    }
  })
}

let activeSlide = 0;
let totalTrailer = 0;
function showTrailer(){
  let embedList = document.querySelectorAll('.embed');
  let activeDot = document.querySelectorAll('.dot');
  totalTrailer = embedList.length;
  embedList.forEach((embedTrailer, idx) =>{
    if(activeSlide == idx){
      embedTrailer.classList.add('show');
      embedTrailer.classList.remove('hide');
    }
    else{
      embedTrailer.classList.remove('show');
      embedTrailer.classList.add('hide');
    }
  })
  activeDot.forEach((dot, idx) =>{
    if(activeSlide ==idx)
    dot.classList.add('dot-highlight');
    else
    dot.classList.remove('dot-highlight');
    dot.addEventListener('click', ()=>{
      activeSlide = idx;
      showTrailer();
    })
  })
}

const leftArrowTrailer = document.querySelector('.left-arrow');
const rightArrowTrailer = document.querySelector('.right-arrow');

leftArrowTrailer.addEventListener('click', ()=>{
  if(activeSlide ==0){
    activeSlide = totalTrailer-1;
    showTrailer();
  }else{
    activeSlide--;
    showTrailer();
  }
});

rightArrowTrailer.addEventListener('click', ()=>{
  if(activeSlide < totalTrailer-1){
    activeSlide ++;
    showTrailer();
  }else{
    activeSlide =0;
    showTrailer();
  }
});

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  overlayContent.innerHTML = '';
}

function getColor(vote_average){
    if(vote_average >= 8){
        return 'green';
    }
    else if(vote_average >= 5){
        return 'orange';
    }
    else{
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchEl.value;

    if(searchTerm){
        getMovies(SEARCH_URL + '&query=' + searchTerm);
    }
    else{
        getMovies(API_URL);
    }
});

function home(){
  selectedgenre = [];
  highlightTag();
    getMovies(API_URL);
    page=1;
    pageNo.innerHTML = `${page}`;
}

let page = 1;
nextPage.addEventListener('click', ()=>{
  if(page != totalPages){  
    getMovies(API_URL + `&page=${++page}`);
    pageNo .innerHTML = `${page}`;
    tagsEl.scrollIntoView({behavior : 'smooth'});
  }
});

previousPage.addEventListener('click', ()=>{
  if(page != 1){
    getMovies(API_URL + `&page=${--page}`);
    pageNo.innerHTML = `${page}`;
    tagsEl.scrollIntoView({behavior : 'smooth'});
  }
});

