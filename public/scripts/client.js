/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const tweetdate = function(data) {
let time = timeago.format(data)
return time;
}

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


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

const renderTweet = function(data) {
  $('#tweets').empty();
  for (let tweet of data) {
    $('#tweets').prepend(createTweetElement(tweet));
  }
};

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



const submitTweetPost = function(event) {
  event.preventDefault();
  $('.errorText').slideUp(400).text('');

  if (!$(this).children().find('textarea').val()) {
    return $('.errorText').text('Please enter a valid tweet').slideDown();
  }

  if ($(this).children().find('textarea').val().length > 140) {
    return $('.errorText').text('Your Tweet exceeds the maximum characters').slideDown();
  }
  
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

loadTweets();

$(document).ready(function() {
  $('form.tweetSubmit').on('submit', submitTweetPost);
});