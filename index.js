// Single state object
var state = {
  userSelectedSearchTerm: '',
  nextPageToken: ''
};

const youtubeURL = 'https://www.googleapis.com/youtube/v3/search';


// Render the API data to the DOM
function renderAPIData(data) {
  $('.dataItem').remove();
  var indexNum = 0;
  $.each(data, function(index, item) {
    indexNum +=1;
    $(`#js-search-results`).append(`
      <div class='dataItem col-3'>
      <h3><div class='js-result-name'>
        <a href='${item.snippet.title}' style='width:100%' target='_blank'>${item.snippet.title}</a>
      </div></h3>
      <div class='js-image'><p>
      <img class='hover-shadow cursor' data-videoid='${item.id.videoId}' src='${item.snippet.thumbnails.medium.url}' ></p>
      </div>
      <div class='js-desc'>
      <p>${item.snippet.description}</p>
      </div>
      <div class="col-12 modal">
        <!-- Modal content-->
        <span class="close cursor">&times;</span>
        <span id="modalLogo"><h1><i class="fas fa-kiwi-bird"></i>  MissyTube </h1></span>
          <div class='myVideo' id='${indexNum}'>
            <iframe data-videoIndex = ${index} src='https://www.youtube.com/embed/${item.id.videoId}?controls=1'></iframe>
          </div>
      </div>`
    );
  });
}

    

// Queries to the API, get the data
function getAPIData(userSelectedSearchItem) {
  const params = {
    q: `${userSelectedSearchItem} in:name`,
    key: `AIzaSyDoLr1m73oBf7SHHiLQMEXg_8nhHUBWLYM`,
    part: 'snippet',
    maxResults: 8,
    videoID:'id'
  }
 $.getJSON(youtubeURL, params, function(data){
   renderAPIData(data.items);
   nextPageToken = data.nextPageToken;
 });
}

function getAPIDataNextPage(userSelectedSearchTerm) {
  const params = {
    q: `${userSelectedSearchTerm} in:name`,
    key: `AIzaSyDoLr1m73oBf7SHHiLQMEXg_8nhHUBWLYM`,
    part: 'snippet',
    maxResults: 8,
    videoID:'id',
    pageToken: nextPageToken
  }
  $.getJSON(youtubeURL, params, function(data){
    renderAPIData(data.items);
     nextPageToken = data.nextPageToken;
  });
}

/* Event listeners */

function closeModal() {
  $('.close').on('click', 'span', function (event){
    console.log('made it to click');
    $('myvideos').trigger('pause');
    //document.getElementById('myModal').style.display = 'none';
  });
}

function watchSubmit() {
  $('.js-search-form').submit(function(event){
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    userSelectedSearchTerm  = queryTarget.val();
    getAPIData(userSelectedSearchTerm);
    $('#next').show();

  });

  $('#next').on('click', function(event){
    event.preventDefault();
    getAPIDataNextPage(userSelectedSearchTerm);
  })

  //open modal here
  $('#js-search-results').on('click', '.js-image', function(event){
    event.preventDefault();
    $(event.currentTarget).closest(".dataItem").find(".modal").show();
  });

  //get the span element that closes the modal
  $('.close').on('click', function(event){
    //event.preventDefault();
    //$(event.currentTarget).closest(".modal").hide();
    console.log('got the close button');
    //modal.style.display="none";
  });
}


watchSubmit();

