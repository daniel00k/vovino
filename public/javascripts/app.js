+function () {
  'use strict';

  var App = {
    playlistID: '',

    onClick: function (dest, callback) {
      document.addEventListener('click', function (e) {
        var elem = document.querySelector('[data-href="' + dest + '"]');

        if (elem && elem.dataset.href === e.target.dataset.href) {
          callback(e);
        }
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
              modal = document.getElementById('new-playlist-modal'),
              navBar = document.getElementsByClassName('navigation-bar')[0];

          App.playlistID = data.party_id.toUpperCase();
          modal.querySelector('.code').innerText = App.playlistID;

          localStorage.setItem(App.playlistID, []);

          $(modal).modal('show');
          navBar.querySelector('.title').innerText = App.playlistID;
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

    App.onClick('add-song', function (e) {
      var xhr = new XMLHttpRequest(),
          listElement = e.target.parentNode,
          trackInfo;

      while (Array.prototype.indexOf.call(listElement.classList, 'result') < 0) {
        listElement = listElement.parentNode;
      }

      trackInfo = JSON.parse(listElement.dataset.track);

      xhr.open('PUT', '/parties/' + App.playlistID, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function (response) {
        var data = response.target.response;

        debugger
        // localStorage.setItem(App.playlistID, data.songs);
      };

      xhr.send(JSON.stringify({song: {
        title: trackInfo.title,
        channelTitle: trackInfo.channelTitle,
        thumbnail: trackInfo.thumbnail
      }}));

      e.preventDefault();
    });

    var socket = io("localhost:3001");
    // $('form').submit(function(){
    // socket.emit('chat message', "un mensaje");
    // console.log("asdas");
    // return false;
    // });
    socket.on('song_added', function(msg){
      debugger
      console.log(msg);
    });
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