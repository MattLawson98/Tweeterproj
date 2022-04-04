/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Uses timeago to convert time tweet was created into normal values
const tweetdate = function(data) {
let time = timeago.format(data)
return time;
}

//escape function to secure sight input
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Turns the tweet that is submitted into an html formatted article!
const createTweetElement = function(data) {
  let $tweet = $(`
  <article class="tweet">
  <header>
    <div class="user">
      <img
        src="${escape(data.user.avatars)}"
        alt="">
      <p>${escape(data.user.name)}</p>
    </div>
    <h4>${escape(data.user.handle)}</h4>
  </header>
  <p>${escape(data.content.text)}</p>
  <footer>
    <span>${escape(tweetdate(data.created_at))}</span>
    <div>
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </div>
  </footer>
</article>
  `);
  return $tweet;
};

//adds tweets to the tweet container
const renderTweet = function(data) {
  $('#tweets').empty();
  for (let tweet of data) {
    $('#tweets').prepend(createTweetElement(tweet));
  }
};

//Ajax request to get json data and then pass it through renderTweet!
const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log("your page is grabbing the tweets from database");
      renderTweet(tweets);
    })
    .catch((err) => {
      console.log("An error has occured!", err);
    });
  };


//On a submit callback this will handle ajax post requests as well as form validation
const submitTweetPost = function(event) {
  event.preventDefault();
  $('.errorText').slideUp(400).text('');

  if (!$(this).children().find('textarea').val()) {
    return $('.errorText').text('Please enter a valid tweet').slideDown();
  }

  if ($(this).children().find('textarea').val().length > 140) {
    return $('.errorText').text('Your Tweet exceeds the maximum characters').slideDown();
  }
  
  //Tweet submission database
  $.ajax('/tweets', {
    method: 'POST',
    data: $(this).serialize()
  })
    .then(function(tweet) {
      loadTweets();
    })
    .catch((err) => {
      console.log('There was an error', err);
    });
  $(this).children().find('textarea').val('');
  $('.counter').text(140);
};

//Loads any premade tweets on initial launch
loadTweets();

$(document).ready(function() {
  $('form.tweetSubmit').on('submit', submitTweetPost);
});