//****Global Variables****

//Submit Input Button
var saveButton = $('.save-button');
//Bottom Container
var bottomContainer = $('.bottom-container');
//Search Input
var searchEngine = $('.search-engine');

//****Event Listeners****

//Submit Click
saveButton.on('click', createIdeaCard);
//Search Input Keydown
//Delete Button
bottomContainer.on('click', '.delete', deleteIdeaCard);
// //Up Vote Button
bottomContainer.on('click', '.up-vote', voteUp);
// //Down Vote Button
bottomContainer.on('click', '.down-vote', voteDown);


//****Funtions****

// //Vote Up
function voteUp() {
  var id = $(this).closest('article').prop('id');
  console.log($('.up').val());
  var up = $('.up').innerHTML;
  console.log(up);
  if(level === 'swill') {
    $(this).siblings('.level').text('plausible')
    Card.quality = 'plausible';
  }
  else if (Card.quality === 'plausible') {
    $(this).siblings('.level').text('genius')
    Card.quality = 'genius';
  }
  console.log("up vote");
};

//Vote Down
function voteDown() {
  var id = $(this).closest('article').prop('id');
  if(Card.quality === 'genius') {
    $(this).siblings('.level').text('plausible')
    Card.quality = 'plausible';
  }
  else if (Card.quality === 'plausible') {
    $(this).siblings('.level').text('swill')
    Card.quality = 'swill';
  }
  console.log("down vote");
};

//Delete Card
function deleteIdeaCard() {
  var id = $(this).closest('article').prop('id');
  $(this).parent('article').remove();
};

//Card
function Card(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = "swill";
}

//Create Card
function createIdeaCard(event) {
  event.preventDefault();
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var theIdea = new Card(title, body);
  prependIdeaCard(theIdea);
  // saveToLocal(theIdea);
}

//Prepend Card
function prependIdeaCard(idea) {
  $('.bottom-container').prepend(`
        <article id=${idea.id}>
          <h2 contenteditable=true class="output-title">${idea.title}</h2>
          <button class="delete"></button>
          <p contenteditable=true class="output-body">${idea.body}</p>
          <button class="up-vote"></button>
          <button class="down-vote"></button>
          <p class="quality">quality: </p><p class="level">${idea.quality}</p>
          <hr>
        </article>
      `)}

//Save To Local
//Get From Local
//
