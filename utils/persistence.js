exports.playlist = {
    destroySong: function(redisInstance, partyId, songMetadata){
        var that = this;
        redisInstance.publish("song_deleted", songMetadata, function(err, reply){
            that.songs();
        });
        redisInstance.lrem(partyId, 0, songMetadata);
    },
    addSong: function(redisInstance, partyId, songUrl, req, res){
        var that = this;

        redisInstance.publish("song_added", songUrl);
        redisInstance.rpush([partyId, songUrl], function(err, reply) {
            console.log(reply);
            that.songs(redisInstance, partyId, req, res);
        });
    },
    songs: function(redisInstance, partyId, req, res){
        redisInstance.lrange(partyId, 0, -1, function(err, reply) {
            console.log("canciones.....", reply);
            res.json({party_id: req.param("party_id"), songs: reply});
        });
    }
};