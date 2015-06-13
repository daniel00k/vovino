exports.playlist = {
    destroy: function(redisInstance){
        
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