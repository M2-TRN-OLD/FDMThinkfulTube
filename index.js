// Single state object
var state = {
  userSelectedSearchItem: "",
};

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function openModal() {
  document.getElementById('myModal').style.display = "block";
}
var slideIndex = 1;
//showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  //slides[slideIndex-1].style.display = "block";
  //dots[slideIndex-1].className += " active";
captionText.innerHTML = dots[slideIndex-1].alt;
}


function renderVid(vidforModal) {
  
  return `
    <div class="mySlides">
    <iframe width="420" height="345" src="https://www.youtube.com/embed/${vidforModal.id.videoId}?controls=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
  `;
}




// Queries to the API
function getAPIData(callback) {
  const query = {
    q: `${userSelectedSearchItem} in:name`,
    key: `AIzaSyDoLr1m73oBf7SHHiLQMEXg_8nhHUBWLYM`,
    part: 'snippet',
    maxResults: 8,
    per_page: 4,
    videoID:'id'
  }
 $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function getAPIDataNextPage(token, callback) {
  const query = {
    q: `${userSelectedSearchItem} in:name`,
    key: `AIzaSyDoLr1m73oBf7SHHiLQMEXg_8nhHUBWLYM`,
    part: 'snippet',
    maxResults: 8,
    per_page: 4,
    videoID:'id',
    pageToken: token
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  //renderAPIDataNextPage(data);
}

// Render the API data
function renderAPIData(data) {
    var nextToken = data.nextPageToken;
    console.log('made it to displayYouTubeSearchData:' + nextToken);
   const titleThumbDesc = data.items.map((item, index) => renderTitleThumbDesc(item));
   const vidforModal = data.items.map((item, index) => renderVid(item));
   $('#js-search-title').html(`<h2 style="text-align:center">The following are the Thinkful Tube results for :  ${userSelectedSearchItem}</h2>`);
   $('.js-search-results').html(titleThumbDesc);
   $('.js-modal-content').html(vidforModal);
   nextButton(nextToken);
}

function renderTitleThumbDesc(titleThumbDesc) {
  //console.log(titleThumbDesc);
  return `
    <div id="searchresults" class="col-3">
      <h3><div class="js-result-name">
      <a href="${titleThumbDesc.snippet.title}" style="width:100%" target="_blank">${titleThumbDesc.snippet.title}</a>
      </div></h3>
      <div class="js-image"><p>
      <img class="hover-shadow cursor" data-videoid="${titleThumbDesc.id.videoId}" src="${titleThumbDesc.snippet.thumbnails.medium.url}" style="width:100%" onclick="openModal();currentSlide(1)" ></p>
      </div>
      <div class="js-desc">
      <p>${titleThumbDesc.snippet.description}</p>
      </div>
    </div>
  `;
}
function renderAPIDataNextPage(data){
    let nextToken = data.nextPageToken;
    console.log('nexttoken is:' + nextToken);
    let titleThumbDesc = data.items.map((item, index) => replaceTitleThumbDesc(item));
   // const vidforModal = data.items.map((item, index) => renderVid(item));
   let parent = document.getElementById("js-search-results");
   let child = document.getElementById("searchresults");
   while (parent.hasChildNodes()) { 
     console.log("this is the parent: " + parent.nodeName );
     parent.firstChild.remove();
   }
  $('.js-search-results').html(titleThumbDesc);
}


function replaceTitleThumbDesc(titleThumbDesc) {
  return `
    <div class="col-3">
      <h3><div class="js-result-name">
      <a href="${titleThumbDesc.snippet.title}" style="width:100%" target="_blank">${titleThumbDesc.snippet.title}</a>
      </div></h3>
      <div class="js-image"><p>
      <img class="hover-shadow cursor" data-videoid="${titleThumbDesc.id.videoId}" src="${titleThumbDesc.snippet.thumbnails.medium.url}" style="width:100%" onclick="openModal();currentSlide(1)" ></p>
      </div>
      <div class="js-desc">
      <p>${titleThumbDesc.snippet.description}</p>
      </div>
    </div>
  `;
}
    

function renderNextPage(obj) {
  const titleThumbDesc = data.items.map((item, index) => replaceTitleThumbDesc(item));
  const vidforModal = data.items.map((item, index) => renderVid(item));
  console.log('about to render html to js-search-results');
  $('.js-search-results').html(titleThumbDesc);
  $('.js-modal-content').html(vidforModal);
   //nextButton(nextToken);
}
   
/* Event listeners */
function closeModal() {
  $('.close').on('click', 'span', function (event){
    console.log('made it to click');
    $('mySlides').trigger('pause');
    //document.getElementById('myModal').style.display = "none";
  });
}

function nextButton(token){
  //listen for button click, execute the code
  $('#next').on('click', function(e) {
    e.preventDefault();
    getAPIDataNextPage(token,renderAPIDataNextPage);
  });
}

function watchSubmit() {
  $('.js-search-form').submit(e => {
    e.preventDefault();
    const queryTarget = $(e.currentTarget).find('.js-query');
    userSelectedSearchItem  = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getAPIData(renderAPIData);
  });
}


watchSubmit();
closeModal();

