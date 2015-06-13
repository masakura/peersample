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
    $('#calling').hide();
    $('#catch').hide();
    $('.disconnect').show();
  };

  var hideOtherStream = function () {
    $('#other-video').prop('src', '');
    $('#call-box').show();
    $('#call').show();
    $('#calling').hide();
    $('.disconnect').hide();
    $('#catch-box').hide();

    log('close');
  };

  var phone = (function () {
    var myStream;
    var peer;
    var call;

    return {
      start: function () {
        $('#call-box').show();
        $('#call').show();
        $('#calling').hide();

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
        call = peer.call(id, myStream);
        call.on('stream', showOtherStream);
        call.on('close', hideOtherStream);

        $('#call-box').show();
        $('#call').hide();
        $('#calling').show();
      },
      answer: function () {
        call.answer(myStream);
        call.on('stream', showOtherStream);
        call.on('close', hideOtherStream);
      },
      disconnect: function () {
        call.close();
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
    })
    .on('click', '.disconnect', function () {
      phone.disconnect();
    });
});
