var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var StatusSchema = new Schema({
    playerWeiId: String
  , playerId: {type : Schema.ObjectId, ref : 'Player'}
  , userName: String
  , busiunesWeiId: String
  , businessId: {type : Schema.ObjectId, ref : 'Business'}
  , gameId: {type : Schema.ObjectId, ref : 'Game'}
  , step: String
  , lastUpdateDate: {type : Date, default : Date.now}
})

mongoose.model('Status', StatusSchema)