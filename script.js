//****Global Variables****

//Submit Input Button
var saveButton = $('.save-button');
//Clear All Button
var clearAllButton = $('.clear-all-button');
//Bottom Container
var bottomContainer = $('.bottom-container');
//Search Input
var searchEngine = $('.search-engine');

var cardTitle = $('.output-title');

var cardBody = $('.output-body');
//****Event Listeners****

//Submit Click
$(document).on('blur', '.output-title', editCardTitle);

$(document).on('blur', '.output-body', editCardBody);

//Clear All ideas
clearAllButton.on('click', clearAllButton);

saveButton.on('click', createIdeaCard);

searchEngine.on('keyup', searchIdeas);
//Delete Button
bottomContainer.on('click', '.delete', deleteIdeaCard);
// //Up Vote Button
bottomContainer.on('click', '.up-vote', voteUp);
// //Down Vote Button
bottomContainer.on('click', '.down-vote', voteDown);



//****Funtions****



var qualityArray = ['swill', 'plausible', 'genius']

//Clear All From Local Storage
// function clearAllButton(event) {
//   event.preventDefault();
//   var allArticles = $('article').remove();
//   console.log(allArticles);
// }

function editCardTitle(event){
  event.preventDefault();
  var articleElement = $(event.target).closest('article')
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.title = $(event.target).text();
  card.save();
}

function editCardBody(event){
  event.preventDefault();
  var articleElement = $(event.target).closest('article')
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.body = $(event.target).text();
  card.save();
}

//Vote Up
function voteUp(event) {
  event.preventDefault();
  var articleElement = $(event.target).closest('article')
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.incrementQuality();
  card.save();
  articleElement.find('.level').text(card.getQuality());
};

//Vote Down
function voteDown(event) {
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.decrementQuality();
  card.save();
  articleElement.find('.level').text(card.getQuality());
};


function renderCards(cards = []) {
  for ( var i = 0; i < cards.length; i++) {
    var card = cards[i];
    $('.bottom-container').append(ideaCardTemplate(card));
  }
}


//Delete Card
function deleteIdeaCard(event) {
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  articleElement.remove();
  Card.delete(id);
};

//Card
function Card(params) {
  this.title = params.title;
  this.body = params.body;
  this.id = params.id || Date.now();
  this.qualityIndex = params.qualityIndex || 0 ;
};

Card.prototype.getQuality = function() {
  return qualityArray[this.qualityIndex];
};

Card.prototype.incrementQuality = function() {
  if (this.qualityIndex !== qualityArray.length - 1) {
    this.qualityIndex += 1;
  }
};

Card.prototype.decrementQuality = function() {
  if (this.qualityIndex !== 0) {
    this.qualityIndex -= 1;
  }
};

Card.prototype.save = function() {
  Card.create(this);
}

Card.create = function(card) {
  window.localStorage.setItem(card.id, JSON.stringify(card));
};

Card.find = function(id) {
  return new Card(JSON.parse(window.localStorage.getItem(id)));
};

Card.findAll = function() {
  var values = [],
    keys = Object.keys(window.localStorage);
    for (var i = 0; i < keys.length; i++) {
      values.push(new Card(JSON.parse(window.localStorage.getItem(keys[i]))));
    }
    return values;
};

Card.delete = function(id) {
  window.localStorage.removeItem(id);
};

//Create Card
function createIdeaCard(event) {
  event.preventDefault();
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var theIdea = new Card({title, body});
  $('.bottom-container').prepend(ideaCardTemplate(theIdea));
  Card.create(theIdea);
  $('.input-title').val("");
  $('.input-body').val("");
  $('.input-title').focus();
};

//Prepend Card
function ideaCardTemplate(idea) {
  $('.bottom-container').prepend(
      `
        <article id=${idea.id}>
          <h2 contenteditable=true class="output-title">${idea.title}</h2>
          <button class="delete"></button>
          <p contenteditable=true class="output-body">${idea.body}</p>
          <button class="up-vote"></button>
          <button class="down-vote"></button>
          <p class="quality">quality: </p><p class="level">${idea.getQuality()}</p>
          <hr>
        </article>
      `
    )
};
//Search Engine
function searchIdeas() {
  var searchEngineValue = searchEngine.val();
  var results
  if (searchEngineValue !== "") {
    var cards = Card.findAll();
    var searchRegex = new RegExp(searchEngineValue);
    results = cards.filter(function(card) {
      return searchRegex.test(card.title) || searchRegex.test(card.body)
    })
  } else {
    results = Card.findAll();
  }
    $('.bottom-container').empty();
    console.log(results)
    renderCards(results);
};

renderCards(Card.findAll())
