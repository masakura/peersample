(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
})();

$(document).ready(function () {
  'use strict';

  navigator.getUserMedia({audio: false, video: true}, function (stream) {
    $('#video').prop('src', URL.createObjectURL(stream));
  }, function (error) {
    console.log(error);
  });
});
