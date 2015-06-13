var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.map(function () {
  this.route('login');
  this.route('join');
});

App.ApplicationRoute = Ember.Route.extend({
  renderTemplate: function() {
    var playlistSelected = false,
        playlistID = '';

    if (playlistSelected) {
      this.render('with-playlist');
    } else {
      this.render('no-playlist');
    }
  }
});
