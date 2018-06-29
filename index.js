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
           <a href='${item.snippet.title}'>${item.snippet.title}</a>
        </div></h3>
        <div class='js-image'>
         <img data-videoid='${item.id.videoId}' src='${item.snippet.thumbnails.medium.url}' >
        </div>
        <div class='js-desc'>
         <p>${item.snippet.description}</p>
        </div>
        <div class='myVideo' id='${indexNum}'>
            <iframe data-videoIndex = ${index} src='https://www.youtube.com/embed/${item.id.videoId}?controls=1'></iframe>
        </div>
      </div>
      `
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

function watchSubmit() {
  $('.js-search-form').submit(function(event){
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    userSelectedSearchTerm  = queryTarget.val();
    getAPIData(userSelectedSearchTerm);
    $('#next').show();
  });

  //get next set of data
  $('#next').on('click', function(event){
    event.preventDefault();
    getAPIDataNextPage(userSelectedSearchTerm);
  })

  //have video show in the lightbox
  $('.js-search-results').on('click', '.js-image', function(event){
    event.preventDefault();
    $('#lightboxVideo').remove();
    var selectedVideo = $(event.currentTarget).closest('.dataItem').find('iframe').attr('src');
    $(`#lightboxTarget`).append(`
            <iframe id='lightboxVideo' src='${selectedVideo}?controls=1'></iframe>
      `
    );
    $('#lightboxLabel').html('The video you selected will play here.');
  });
}

watchSubmit();

