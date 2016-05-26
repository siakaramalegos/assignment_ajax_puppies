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

  function _getPuppies(){
    console.log('Rendering puppy list.');
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function(){
      PUP.MainModule.puppies = JSON.parse(this.responseText);
      _renderPuppies();
      console.log( PUP.MainModule.puppies );
    });
    xhr.open("GET", _puppiesURL, true);
    xhr.send();
  }

  function _renderPuppies(){
    PUP.MainModule.puppies.forEach(function(puppy){
      var $puppyLink = $('<a>adopt</a>');
      var time_stamp = jQuery.timeago(puppy.created_at);
      var $puppy = $('<li></li>')
        .append('<strong>' + puppy.name + '</strong>')
        .append(' (' + puppy.breed.name + '), created ' + time_stamp + ' -- ')
        .append($puppyLink);

      $('#puppy-list').append($puppy);
    });
  }

  return {
    init: init,
    puppies: puppies
  }
})();