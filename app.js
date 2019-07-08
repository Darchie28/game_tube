// clientID
// const clientId = "n1ngtfb3jyknsdy5mdgl4zgqft4ekg";

$(document).ready(function() {
  $("#ranking").click(getDataGames);
  $("#online").click(getDataStreams);
});

("use strict");
// "Client-ID": "n1ngtfb3jyknsdy5mdgl4zgqft4ekg"
const searchURL = "https://api.twitch.tv/helix/streams?language=en";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayStreams(responseJson, maxResult) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the articles array, stopping at the max number of results
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
  const url = searchURL + "?" + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "Client-ID": "n1ngtfb3jyknsdy5mdgl4zgqft4ekg"
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

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#ranking").val();
    const maxResults = $("#online").val();
    getStreams(searchTerm, maxResults);
  });
}

$(watchForm);
