exports.playlist = {
    destroySong: function(redisInstance, partyId, songMetadata){
        var that = this;
        redisInstance.publish("song_deleted", songMetadata, function(err, reply){
            that.songs();
        });
        redisInstance.lrem(partyId, 0, songMetadata);
    },
    addSong: function(redisInstance, partyId, songMetadata){
        redisInstance.publish("song_added", songMetadata);
        redisInstance.rpush([partyId, songMetadata], function(err, reply) {
            console.log(reply);
            return reply;
        });
    },
    songs: function(redisInstance, partyId, req, res){
        redisInstance.lrange(partyId, 0, -1, function(err, reply) {
            console.log("canciones.....", reply);
            res.json({party_id: req.param("party_id"), songs: JSON.parse(reply)});
        });
    }
};