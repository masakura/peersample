(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
})();

$(document).ready(function () {
  'use strict';

  var myStream;

  navigator.getUserMedia({audio: false, video: true}, function (stream) {
    $('#video').prop('src', URL.createObjectURL(stream));
    myStream = stream;
  }, function (error) {
    console.log(error);
  });

  var log = function (text) {
    $('<p>').text(text).appendTo('#messages');
  };

  var showOtherStream = function (stream) {
    $('#other-video').prop('src', URL.createObjectURL(stream));
  };

  var peer = new Peer({key: 'vvx00u5ssce1xlxr'});
  peer
    .on('open', function (id) {
      log(id);
    })
    .on('call', function (call) {
      call.answer(myStream);
      call.on('stream', showOtherStream);
    });

  $(document).on('click', '#call', function () {
    var call = peer.call($('#other-peerid').val(), myStream);
    call.on('stream', showOtherStream);
  });
});
