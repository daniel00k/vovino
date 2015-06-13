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
	playlist.addSong(redis, partyId, req.param("song"), req, res);
});

router.get("/join/:party_id", function(req, res) {
	playlist.songs(redis, req.param("party_id"), req, res);
});

module.exports = router;
