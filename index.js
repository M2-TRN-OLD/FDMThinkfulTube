
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';


function getDataFromApi(searchTerm, callback) {
    console.log('made it to getdatafromapi');
  const query = {
    q: `${searchTerm} in:name`,
    per_page: 5
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `
    <div>
      <h2>
      <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
      <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
      <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>
    </div>
  `;
}

function displayYouTubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
}

function watchSubmit() {
    console.log('made it to watchSubmit');
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    console.log('queryTarget is ' + queryTarget);
    const query = queryTarget.val();
    console.log('query val is ' + query);
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}


$(document).ready(function() {
   watchSubmit();
});
