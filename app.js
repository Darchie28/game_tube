// clientID
// const clientId = "n1ngtfb3jyknsdy5mdgl4zgqft4ekg"; Twitch
// const apiKey = 'AIzaSyCDCMNwP9XUSHLgKEQ9j3ivsHfCcaJC9cQ';
// const searchURL = 'https://www.googleapis.com/youtube/v3/search';

("use strict");
// "Client-ID": "n1ngtfb3jyknsdy5mdgl4zgqft4ekg"
const streamURL = "https://api.twitch.tv/helix/streams?language=en";
const gameURL = "https://api.twitch.tv/helix/games/top";
const searchURL = "https://www.googleapis.com/youtube/v3/search";
const apiKey = "AIzaSyCDCMNwP9XUSHLgKEQ9j3ivsHfCcaJC9cQ";
const clientId = "n1ngtfb3jyknsdy5mdgl4zgqft4ekg";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

//Display Youtube video to DOM
function displayYoutube(responseJson, maxResult) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the json array, stopping at the max number of results
  for (let i = 0; i < responseJson.items.length; i++) {
    $("#results-list").append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

//Search Games using the Youtube API
function getYouTubeVideos(query, maxResults = 10) {
  const params = {
    key: apiKey,
    q: query,
    part: "snippet",
    maxResults,
    type: "video"
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYoutube(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

//Streams section
function displayStreams(responseJson, maxResult) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the json array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results-list").append(
      `<div class="card" style="width: 18rem;">
                  <img src="${responseJson.data[i].thumbnail_url
                    .replace("{width}", "200")
                    .replace(
                      "{height}",
                      "200"
                    )}" class="card-img-top" alt="...">
                       <div class="card-body">
                           
                           <p class="card-text">${
                             responseJson.data[i].user_name
                           } is streaming<b>:${
        responseJson.data[i].type
      }</b> and the channel has :${
        responseJson.data[i].viewer_count
      } viewers</p>
                           <a href="https://www.twitch.tv/${
                             responseJson.data[i].user_name
                           }" target="_blank" class="btn btn-primary">Channel ${
        responseJson.data[i].user_name
      }</a>
                       </div>
              </div>`
    );
  }

  //display the results section
  $("#results").removeClass("hidden");
}

function getStreams(query, maxResults = 10) {
  const params = {
    q: query,
    language: "en"
  };
  const queryString = formatQueryParams(params);
  const url = streamURL + "?" + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "Client-ID": clientId
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayStreams(responseJson, maxResults))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

//Getting Video Games
function getGames(query, maxResults = 10) {
  const params = {
    q: query,
    language: "en"
  };
  const queryString = formatQueryParams(params);
  const url = gameURL + "?" + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "Client-ID": clientId
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayGames(responseJson, maxResults))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayGames(responseJson, maxResult) {
  console.log(responseJson);
  $("#results-list").empty();

  //iterate through object
  for (let i = 0; i < responseJson.data.length; i++) {
    let rank = 1;
    $("#results-list").append(
      `
      <div class="card" style="width: 18rem;">
      <img src="${responseJson.data[i].box_art_url
        .replace("{width}", "200")
        .replace("{height}", "200")}" class="card-img-top"
        alt="json_img">
        
        <div class="card-body">
        <h5 class="card-title>${rank}</h5>
        <p class="card-text">${responseJson.data[i].name}
        <a href="https://www.twitch.tv/directory/game/${
          responseJson.data[i].name
        }" target="_blank" class="btn btn-primary">${
        responseJson.data[i].name
      }</a>
        </p>
        </div>
        </div>`
    );
    rank++;
  }
  $("#results").removeClass("hidden");
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getYouTubeVideos(searchTerm, maxResults);
    $("search").click(getYouTubeVideos);
    $("#ranking").click(getGames);
    $("#online").click(getStreams);
  });
}

$(watchForm);
