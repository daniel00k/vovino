+function () {
  'use strict';

  var App = {
    onClick: function (dest, callback) {
      document.querySelector('[data-href="' + dest + '"]').addEventListener('click', function (e) {
        callback(e);
      });
    },

    onSubmit: function (dest, callback) {
      document.addEventListener('submit', function (e) {
        if (e.target.id === dest) {
          callback(e);
        }
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
    },

    insertInto: function (source, dest, data, callback) {
      var indexSource = document.getElementById(source).innerHTML,
          template = Handlebars.compile(indexSource);

      document.getElementById(dest).innerHTML = template(data);

      if (callback) {
        callback();
      }
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

    App.onSubmit('search-form', function (e) {
      var xhr = new XMLHttpRequest(),
          query = e.target.querySelector('#search-input').value,
          key = 'AIzaSyBVOo94mZqD7gLS5s2KS6dmS2p3dw5HehY',
          params = 'order=viewCount&part=snippet&q=' + query + '&maxResults=20&key=' + key;

      xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?' + params, true);

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function (response) {
        var data = JSON.parse(response.target.response);

        App.insertInto('search-results-list', 'search-results', data);
      };

      xhr.send();

      e.preventDefault();
    });

    // App.onClick('search', function (e) {
    //   App.render('search');
    // });

  // $.get("https://www.googleapis.com/youtube/v3/search?order=viewCount&part=snippet&q=bruno mars&maxResults=20&key=AIzaSyBVOo94mZqD7gLS5s2KS6dmS2p3dw5HehY", function(data){console.log(data)})
  });
}();

addSong = function (element) {
  var partyId =  $(".code").text();
  var _parent =  $(element).parent();
  var str     =  JSON.stringify({"thumb": _parent.find("img").attr('src'), "title": _parent.find("span.tit").text(), "channelTitle": _parent.find("span.chTitle").text(), "id": _parent.find("img").data('id')});
  $.ajax({
    url: "/parties/" + partyId,
    type: "put",
    data: {
      song: str
    }
  });
}

loadYTAPI = function(){
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.player;

function onYouTubeIframeAPIReady() {
  var partyId =  $(".code").text();
  window.player = new YT.Player('player', {
          height: '250',
          width: '400',
          playerVars: { 'autoplay': 1, controls: 1},
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
  setSocketListeners(partyId);
  console.log("ready");
}

function onPlayerStateChange() {
  if(player.getPlayerState() === 0) {
    deleteSong();
  }
}

function deleteSong(){
  var partyId =  $(".code").text();
  $.ajax({
    url: "/parties/" + partyId,
    type: "delete"
  });
}

function setSocketListeners(partyId){
  socket.on('song_deleted'+partyId, function(song){
    console.log("cancion borrada...toca la siguiente usando player.loadVideoById(JSON.parse(song).id, 0, "large") ",song);
  });
  
  socket.on('song_added'+partyId, function(song){
    console.log("cancion aniadida, añadela a la cola", song);
  });
  
  socket.on('first_song_added'+partyId, function(song){
    player.loadVideoById(JSON.parse(song).id, 0, "large")
  });
}