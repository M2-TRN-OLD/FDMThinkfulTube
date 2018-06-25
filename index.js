// Single state object
var state = {
	userSelectedSearchItem: ""
};

function openModal() {
  document.getElementById('myModal').style.display = "block";
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

var slideIndex = 1;
/*showSlides(slideIndex); */

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
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
 captionText.innerHTML = dots[slideIndex-1].alt;
}

function renderVid(vidforModal) {
  console.log(`made it to renderModal`);
  
  return `
    <div class="mySlides">
    <iframe width="420" height="345" src="https://www.youtube.com/embed/${vidforModal.id.videoId}?controls=1"" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
  `;
}

function renderTitleThumbDesc(titleThumbDesc) {
  return `
    <div class="col-3">
      
      <h3><span class="js-result-name">
      <a href="${titleThumbDesc.snippet.title}" style="width:100%" target="_blank">${titleThumbDesc.snippet.title}</a>
      </span></h3>
      <span class="js-image"><p>
      <img class="hover-shadow cursor" data-videoid="${titleThumbDesc.id.videoId}" src="${titleThumbDesc.snippet.thumbnails.medium.url}" style="width:100%" onclick="openModal();currentSlide(1)" ></p>
      </span>
      <span class="js-desc">
      <p>${titleThumbDesc.snippet.description}</p>
      </span>
     
    </div>
  `;
}

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(callback) {
  
  const query = {
    q: `${userSelectedSearchItem} in:name`,
    key: `AIzaSyDoLr1m73oBf7SHHiLQMEXg_8nhHUBWLYM`,
    part: 'snippet',
    per_page: 'results',
    videoID:'id'
  }
 $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function displayYouTubeSearchData(data) {
  console.log(data);
  const titleThumbDesc = data.items.map((item, index) => renderTitleThumbDesc(item));
  const vidforModal = data.items.map((item, index) => renderVid(item));
  $('#js-search-title').html(`<h2 style="text-align:center">The following are the Thinkful Tube results for :  ${userSelectedSearchItem}</h2>`);
  $('.js-search-results').html(titleThumbDesc);
  $('.js-modal-content').html(vidforModal);
  
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    userSelectedSearchItem  = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    console.log('after queryTarget');
    getDataFromApi(displayYouTubeSearchData);

   
  });
}


watchSubmit();

