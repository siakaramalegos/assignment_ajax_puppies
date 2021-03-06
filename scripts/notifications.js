'use strict;'

var PUP = PUP || {};

PUP.NotificationModule = (function(){

  var _waiting = false;

  function init(){
    // AJAX listeners
    $( document )
      .ajaxStart(_startNotification)
      .ajaxSuccess(_finishedNotification)
      .ajaxError(_errorNotification);
  }

  function _startNotification(){
    _waiting = true;

    $('.notification')
      .addClass('warning')
      .text('Waiting...')
      .show();

    window.setTimeout(function(){
      if ( _waiting ) {
        $('.notification')
          .text('Sorry this is taking so long...');
      }
    }, 1000);
  }

  function _finishedNotification(){
    _waiting = false;

    $('.notification')
      .removeClass('warning')
      .addClass('success')
      .text('Finished!')
      .show();

    window.setTimeout(function(){
      $('.notification')
        .removeClass('success')
        .fadeOut();
    }, 2000)
  }

  function _errorNotification(event, xhr, ajaxSettings, errorThrown){
    _waiting = false;
    var error = 'Failed.';

    if (errorThrown !== ''){
      error += ' Errors were: ' + errorThrown;
    }

    $('.notification')
      .removeClass('warning')
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
    init: init
  };
})();