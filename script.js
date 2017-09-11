//****Event Listeners****

$(document).on('blur', '.output-title', editCardTitle);
$(document).on('blur', '.output-task', editCardTask);

$(document).on('keydown', '.output-title', enterKeySubmit);
$(document).on('keydown', '.output-task', enterKeySubmit);

$('.clear-all-button').on('click', clearAllToDos);
$('.save-button').on('click', createToDoCard);

$('.input-title, .input-task').on('keyup', enableSaveButton);
$('.search-engine').on('keyup', searchToDos);

$('.bottom-container').on('click', '.delete', deleteToDoCard);
$('.bottom-container').on('click', '.up-vote', voteUp);
$('.bottom-container').on('click', '.down-vote', voteDown);

$('.bottom-container').on('click', '.completed-btn', saveCompleted);

//****Functions****

$(document).ready(searchToDos);

Card.prototype.toggleCompleted = function() {
  this.completed = !this.completed;
  return this.completed;
};

function saveCompleted() {
  var articleElement = $(this).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.toggleCompleted();
  articleElement.toggleClass('toggle-completed');
  card.save();
};

function enterKeySubmit(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $(this).blur();
  };
};

function enableSaveButton() {
  var saveButton = $('.save-button');
  if ($('.input-title').val() !== "" && $('.input-task').val() !== "") {
    saveButton.removeAttr('disabled');
  } else {
    saveButton.attr('disabled', true);
  };
};

function Card(params) {
  this.title = params.title;
  this.task = params.task;
  this.id = params.id || Date.now();
  if (params.qualityIndex == undefined) {
    this.qualityIndex = 2;
  } else {
    this.qualityIndex = params.qualityIndex;
  };
  this.completed = params.completed || false;
};

function createToDoCard(event) {
  event.preventDefault();
  var title = $('.input-title').val();
  var task = $('.input-task').val();
  var theToDo = new Card({title, task});
  $('.bottom-container').prepend(toDoCardTemplate(theToDo));
  Card.create(theToDo);
  resetInputs();
};

function resetInputs() {
  $('.input-title').val("");
  $('.input-task').val("");
  $('.input-title').focus();
  $('.save-button').attr("disabled", true);
};

Card.create = function(card) {
  localStorage.setItem(card.id, JSON.stringify(card));
};

function toDoCardTemplate(toDo) {
  $('.bottom-container').prepend(
      `<article id=${toDo.id}>
          <h2 contenteditable=true class="output-title" aria-label="title of toDo">${toDo.title}</h2>
          <button class="delete"></button>
          <p contenteditable=true class="output-task" aria-label="task of toDo">${toDo.task}</p>
          <button class="up-vote"></button>
          <button class="down-vote"></button>
          <p class="quality">importance: </p><p class="level">${toDo.getQuality()}</p>
          <button class="completed-btn" aria-label="mark as completed">Completed Task</button>
        </article>`
    );
  if (toDo.completed) {
    $(`#${toDo.id}`).addClass('toggle-completed');
  };
};

function renderCards(cards = []) {
  for ( var i = 0; i < cards.length; i++) {
    var card = cards[i];
    $('.bottom-container').append(toDoCardTemplate(card));
  };
};

function clearAllToDos(event) {
  event.preventDefault();
  var allArticles = $('article');
  if (allArticles.length !== 0){
    allArticles.remove();
    localStorage.clear();
    $('.input-title').focus();
  };
};

function editCardTitle(event){
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.title = $(event.target).text();
  card.save();
};

function editCardTask(event){
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.task = $(event.target).text();
  card.save();
};

function voteUp(event) {
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.incrementQuality();
  card.save();
  articleElement.find('.level').text(card.getQuality());
};

function voteDown(event) {
  event.preventDefault();
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  var card = Card.find(id);
  card.decrementQuality();
  card.save();
  articleElement.find('.level').text(card.getQuality());
};

Card.prototype.getQuality = function() {
  var qualityArray = ['None', 'Low', 'Normal', 'high', 'critical'];
  return qualityArray[this.qualityIndex];
};

Card.prototype.incrementQuality = function() {
  if (this.qualityIndex < 4) {
    this.qualityIndex += 1;
  };
};

Card.prototype.decrementQuality = function() {
  if (this.qualityIndex > 0) {
    this.qualityIndex -= 1;
  }
};

function deleteToDoCard(event) {
  var articleElement = $(event.target).closest('article');
  var id = articleElement.prop('id');
  articleElement.remove();
  Card.delete(id);
};

Card.delete = function(id) {
  localStorage.removeItem(id);
};

Card.prototype.save = function() {
  Card.create(this);
};

Card.find = function(id) {
  return new Card(JSON.parse(localStorage.getItem(id)));
};

Card.findAll = function() {
  var values = [],
  keys = Object.keys(localStorage);
    for (var i = 0; i < keys.length; i++) {
      values.push(new Card(JSON.parse(localStorage.getItem(keys[i]))));
    };
    return values;
};

function searchToDos() {
  var searchEngineValue = $('.search-engine').val();
  if (searchEngineValue !== "") {
    var cards = Card.findAll();
    var searchRegex = new RegExp(searchEngineValue);
    var results = cards.filter(function(card) {
      return searchRegex.test(card.title) || searchRegex.test(card.task);
    });
  } else {
    var results = Card.findAll();
  };
    $('.bottom-container').empty();
    renderCards(results);
};

// renderCards(Card.findAll());

