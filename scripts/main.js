'use strict;'

var PUP = PUP || {};

PUP.MainModule = (function(){

  var puppies;
  var breeds = {};
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

    $.ajax({
      url: _puppiesURL,
      method: 'GET',

      success: function(json){
        _finishedNotification();
        PUP.MainModule.puppies = json;
        _renderPuppies();;
      },

      error: function(xhr, status, errorThrown){
        _errorNotification(errorThrown);
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });

  }

  function _getBreeds(event){
    console.log('Getting breed list.');

    $.ajax({
      url: _breedsURL,
      method: 'GET',

      success: function(json){
        _finishedNotification();

        json.forEach(function(breed){
          PUP.MainModule.breeds[breed.id] = breed.name;
        });
        _renderBreedsDropdown(json);
      },

      error: function(xhr, status, errorThrown){
        _errorNotification(errorThrown);
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });
  }

  function _renderBreedsDropdown(breedsArray){
    breedsArray.forEach(function(breed){
      $breed = $('<option></option>')
        .text(breed.name)
        .attr('value', breed.id);

      $("#breed-select").append($breed);
    });
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

  function _renderPuppy(puppy, breed_id, prepend){
    var breedName;

    if (breed_id) {
      breedName = breeds[breed_id];
    } else {
      breedName = puppy.breed.name;
    }

    var $puppyLink = $('<a href="#">adopt</a>')
      .attr('id', puppy.id)
      .attr('class', 'adopt-link');
    var time_stamp = jQuery.timeago(puppy.created_at);
    var $puppy = $('<li></li>')
      .append('<strong>' + puppy.name + '</strong>')
      .append(' (' + breedName + '), created ' + time_stamp + ' -- ')
      .append($puppyLink);

    if (prepend) {
      $('#puppy-list').prepend($puppy);
    } else {
      $('#puppy-list').append($puppy);
    }
  }

  function _addPuppy(event){
    event.preventDefault();

    var formData = $(event.target).serializeArray();
    var puppyData = JSON.stringify({
      name: formData[0].value,
      breed_id: formData[1].value
    });

    $.ajax({
      url: _puppiesURL,
      method: 'POST',
      data: puppyData,
      contentType: 'application/json',
      dataType: 'json',

      success: function(json){
        _finishedNotification();
        _renderPuppy(json, json.breed_id, true);
      },

      error: function(xhr, status, errorThrown){
        _errorNotification(errorThrown);
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

    $.ajax({
      url: url,
      method: 'DELETE',

      success: function(json){
        _finishedNotification();
        _getPuppies();
      },

      error: function(xhr, status, errorThrown){
        _errorNotification(errorThrown);
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });
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



  // Notifications
  function _finishedNotification(){
    $('.notification')
      .addClass('success')
      .text('Finished!')
      .show();

    window.setTimeout(function(){
      $('.notification')
        .removeClass('success')
        .fadeOut();
    }, 2000)
  }

  function _errorNotification(errorThrown){
    var error = 'Failed.';

    if (errorThrown !== ''){
      error += ' Errors were: ' + errorThrown;
    }

    $('.notification')
      .addClass('error')
      .text(error)
      .show();

    window.setTimeout(function(){
      $('.notification')
        .removeClass('error')
        .fadeOut();
    }, 2000)
  }

  return {
    init: init,
    puppies: puppies,
    breeds: breeds
  }
})();