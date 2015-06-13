(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
})();

$(document).ready(function () {
  'use strict';

  var log = function (text) {
    $('<p>').text(text).appendTo('#messages');
  };

  var showOtherStream = function (stream) {
    $('#other-video').prop('src', URL.createObjectURL(stream));
  };

  var phone = (function () {
    var myStream;
    var peer;
    var call;

    return {
      start: function () {
        $('#call-box').show();
        navigator.getUserMedia({audio: false, video: true}, function (stream) {
          $('#video').prop('src', URL.createObjectURL(stream));
          myStream = stream;
        }, function (error) {
          log(error);
        });

        peer = new Peer({key: 'vvx00u5ssce1xlxr'});

        peer.on('error', function (error) {
          log(JSON.stringfy(error));
        });
        peer.on('open', function (id) {
          log(id);
        });
        peer.on('call', function (catchCall) {
          call = catchCall;
          $('#catch-other-peerid').val(call.peer);
          $('#call-box').hide();
          $('#catch-box').show();
        }.bind(this));
      },
      call: function (id) {
        var call = peer.call(id, myStream);
        call.on('stream', showOtherStream);
      },
      answer: function () {
        call.answer(myStream);
        call.on('stream', showOtherStream);
      }
    };
  })();

  phone.start();

  $(document)
    .on('click', '#call', function () {
      phone.call($('#other-peerid').val());
    })
    .on('click', '#catch', function () {
      phone.answer();
    });
});
