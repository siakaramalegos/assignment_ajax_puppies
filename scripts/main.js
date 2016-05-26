'use strict;'

var PUP = PUP || {};

PUP.MainModule = (function(){

  var puppies;
  var _puppiesURL = "https://ajax-puppies.herokuapp.com/puppies.json"
  // var _puppyURL = "https://ajax-puppies.herokuapp.com/puppies/:id.json"

  function init(){
    console.log('Initiating main module...');
    _getPuppies();
  }

  function _getPuppies(event){
    if (event) { event.preventDefault(); }

    console.log('Getting puppy list.');
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function(){
      PUP.MainModule.puppies = JSON.parse(this.responseText);
      _renderPuppies();
    });
    xhr.open("GET", _puppiesURL, true);
    xhr.send();
  }

  function _renderPuppies(){
    // Clear current list
    $('#puppy-list').html('');

    var puppies = PUP.MainModule.puppies.sort(function(a, b){
      if (a.created_at > b.created_at) {
        return -1
      } else if (a.created_at < b.created_at) {
        return 1;
      } else {
        return 0;
      }
    });

    puppies.forEach(function(puppy){
      var $puppyLink = $('<a href="#">adopt</a>')
        .attr('id', puppy.id)
        .attr('class', 'adopt-link');
      var time_stamp = jQuery.timeago(puppy.created_at);
      var $puppy = $('<li></li>')
        .append('<strong>' + puppy.name + '</strong>')
        .append(' (' + puppy.breed.name + '), created ' + time_stamp + ' -- ')
        .append($puppyLink);

      $('#puppy-list').append($puppy);
    });

    // Listeners
    _listenForRefresh();
    _listenForAdopt();
  }

  function _adoptPuppy(event){
    event.preventDefault();

    console.log('Adopting puppy #' + event.target.id);
    var url = "https://ajax-puppies.herokuapp.com/puppies/" + event.target.id + ".json";

    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function(){
      _getPuppies;
    });
    xhr.open("DELETE", url, true);
    xhr.send();
  }



  // Listeners
  function _listenForRefresh(){
    $('#refresh').click(_getPuppies);
  }

  function _listenForAdopt(){
    $('.adopt-link').click(_adoptPuppy);
  }

  return {
    init: init,
    puppies: puppies
  }
})();