var express   =  require('express');
var router    =  express.Router();
var helpers   =  require('../utils/helpers').tokenHelpers;
var playlist  =  require('../utils/persistence').playlist;
var redis     =  require("redis").createClient();
var io        =  require("socket.io").listen(process.env.PORT || 3001);

io.on("connection", function(socket){
    console.log("connected socket");
    socket.on("disconnect", function(){
        console.log("client disconnected");
        socket.disconnect();
    });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bovino', host: (process.env.PORT || 3001) });
});

router.post("/parties", function(req, res) {
	res.json({party_id: helpers.generatePartyId()});
});

router.put("/parties/:party_id", function(req, res) {
	var partyId =  req.param("party_id");
	playlist.addSong(io, redis, partyId, req.param("song"), req, res);
});

router.delete("/parties/:party_id", function(req, res) {
	var partyId =  req.param("party_id");
	playlist.destroySong(io, redis, partyId, req, res);
});

router.get("/join/:party_id", function(req, res) {
	playlist.songs(redis, req.param("party_id"), req, res);
});

module.exports = router;
