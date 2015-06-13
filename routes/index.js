var express   =  require('express');
var router    =  express.Router();
var helpers   =  require('../utils/helpers').tokenHelpers;
var playlist  =  require('../utils/persistence').playlist;
var redis     =  require("redis").createClient();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post("/parties", function(req, res) {
	res.json({party_id: helpers.generatePartyId()});
});

router.put("/parties/:party_id", function(req, res) {
	var partyId =  req.param("party_id");
	playlist.addSong(redis, partyId, req.param("song_url"));
	var _songs   =  playlist.songs(redis, partyId);
	res.json({party_id: partyId, songs: _songs});
});

router.get("/join/:party_id", function(req, res) {
	console.log(req.param("party_id"));
});

module.exports = router;
