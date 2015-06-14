+function () {
  'use strict';

  var App = {
    onClick: function (dest, callback) {
      document.querySelector('[data-href="' + dest + '"]').addEventListener('click', function (e) {
        callback(e);
      });
    },

    render: function (templateName, options, callback) {
      var indexSource = document.getElementById(templateName).innerHTML,
          template = Handlebars.compile(indexSource);

      callback = function () {};

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      document.getElementsByTagName('main')[0].innerHTML = template(options);

      callback();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    App.render('index');

    App.onClick('join', function (e) {
      App.render('join');
    });

    App.onClick('create', function (e) {
      App.render('search', function () {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/parties', true);

        xhr.onload = function (response) {
          var data = JSON.parse(response.target.response),
              playlistID = data.party_id.toUpperCase(),
              modal = document.getElementById('new-playlist-modal'),
              navBar = document.getElementsByClassName('navigation-bar')[0];

          modal.querySelector('.code').innerText = playlistID;

          // $(modal).modal('show');
          navBar.querySelector('.title').innerText = playlistID;
        };

        xhr.send();

      });
    });

    // App.onClick('search', function (e) {
    //   App.render('search');
    // });
  });
}();
