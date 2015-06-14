var app = app || {};

(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

})();

app.view = (function () {
  'use strict';

  return {
    waiting: function () {
      $('#call-box').show();
      $('#catch-box').hide();

      $('#call').show();
      $('#calling').hide();
      $('.disconnect').hide();
    },
    calling: function () {
      $('#call-box').show();
      $('#catch-box').hide();

      $('#call').hide();
      $('#calling').show();
      $('.disconnect').hide();
    },
    catching: function (id) {
      $('#call-box').hide();
      $('#catch-box').show();

      $('#catch').show();
      $('.disconnect').hide();

      $('#catch-other-peerid').val(id);
    },
    talking: function () {
      $('#call-box').hide();
      $('#catch-box').show();

      $('#catch').hide();
      $('.disconnect').show();
    }
  };
})();

$(document).ready(function () {
  'use strict';

  var log = function (text) {
    $('<p>').text(text).appendTo('#messages');
  };

  var showOtherStream = function (stream) {
    $('#other-video').prop('src', URL.createObjectURL(stream));

    app.view.talking();
  };

  var hideOtherStream = function () {
    $('#other-video').prop('src', '');

    app.view.waiting();
  };

  var phone = (function () {
    var myStream;
    var peer;
    var call;

    return {
      start: function () {
        navigator.getUserMedia({audio: true, video: true}, function (stream) {
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

        app.view.waiting();
      },
      call: function (id) {
        call = peer.call(id, myStream);
        call.on('stream', showOtherStream);
        call.on('close', hideOtherStream);

        app.view.calling();
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
