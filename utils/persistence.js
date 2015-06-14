exports.playlist = {
    destroySong: function(io, redisInstance, partyId, req, res){
        var that = this;
        redisInstance.lpop(partyId, function(err, reply) {
            redisInstance.lrange(partyId, 0, 0, function (err, reply) {
                io.sockets.emit("song_deleted"+partyId, reply);
                that.songs(redisInstance, partyId, req, res);
                console.log(err, reply);
            });
        });
        // Si devuelve el del otro extremo, ya sea tail o head, entonces probar con
        // redisInstance.lpop(partyId);
    },
    addSong: function(io, redisInstance, partyId, songMetadata, req, res){
        var that = this;
        // Emit song added
        io.sockets.emit("song_added"+partyId, songMetadata);
        redisInstance.exists(partyId, function(err, reply) {
            if (reply === 1) {
                console.log('exists');
            } else {
                console.log('new list');
                io.sockets.emit("first_song_added"+partyId, songMetadata);
            }
        });

        redisInstance.rpush([partyId, songMetadata], function(err, reply) {
            that.songs(redisInstance, partyId, req, res);
        });
    },
    songs: function(redisInstance, partyId, req, res){
        redisInstance.lrange(partyId, 0, -1, function(err, reply) {
            console.log("canciones.....", reply);
            res.json({party_id: req.param("party_id"), songs: reply});
        });
    },

    listSongs: function (redisInstance, partyId) {
        redisInstance.lrange(partyId, 0, -1, function(err, reply) {
            console.log('REPLY', reply);
            return reply;
        });
    }
};