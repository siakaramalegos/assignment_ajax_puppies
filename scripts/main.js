'use strict;'

var PUP = PUP || {};

PUP.MainModule = (function(){

  var puppies, breeds;
  var _puppiesURL = "https://ajax-puppies.herokuapp.com/puppies.json";
  var _breedsURL = "https://ajax-puppies.herokuapp.com/breeds.json";

  function init(){
    console.log('Initiating main module...');
    _getPuppies();
    _getBreeds();
    _listenForNewPuppy();
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

  function _getBreeds(event){
    console.log('Getting breed list.');
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", function(){
      PUP.MainModule.breeds = JSON.parse(this.responseText);
      // _renderBreedsDropdown();
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
      _renderPuppy(puppy);
    });

    // Listeners
    _listenForRefresh();
    // Where should this go? It won't work for individually added puppies
    _listenForAdopt();
  }

  function _renderPuppy(puppy){
    var $puppyLink = $('<a href="#">adopt</a>')
      .attr('id', puppy.id)
      .attr('class', 'adopt-link');
    var time_stamp = jQuery.timeago(puppy.created_at);
    var $puppy = $('<li></li>')
      .append('<strong>' + puppy.name + '</strong>')
      .append(' (' + puppy.breed.name + '), created ' + time_stamp + ' -- ')
      .append($puppyLink);

    $('#puppy-list').append($puppy);
  }



  function _addPuppy(event){
    event.preventDefault();

    var formData = $(event.target).serializeArray();
    var puppyData = JSON.stringify({
      name: formData[0].value,
      breed_id: formData[1].value
    });
    console.log(puppyData);

    $.ajax({
      url: _puppiesURL,
      method: 'POST',
      data: puppyData,
      contentType: 'application/json',
      dataType: 'json',

      success: function(json){
        var puppy = JSON.parse(json);
        console.log(puppy);
        _renderPuppy(puppy);
      },

      error: function(xhr, status, errorThrown){
        alert( "Sorry, there was a problem!" );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });
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

  function _listenForNewPuppy(){
    $('form#new-puppy').submit(_addPuppy);
  }

  return {
    init: init,
    puppies: puppies
  }
})();