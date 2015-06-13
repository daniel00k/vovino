exports.playlist = {
    destroy: function(redisInstance){
        
    },
    addSong: function(redisInstance, partyId, songUrl){
        redisInstance.rpush([partyId, songUrl], function(err, reply) {
            console.log(reply);
            return reply;
        });
    },
    songs: function(redisInstance, partyId){
        redisInstance.lrange(partyId, 0, -1, function(err, reply) {
            console.log(reply);
            return reply;
        });
    }
};