var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var GameSchema = new Schema({
    name: String
  , valid: String
  , businessId: {type : Schema.ObjectId, ref : 'Business'}
  , userId: {type : Schema.ObjectId, ref : 'User'}
  , key: String
  , structure: String
  , createDate: {type : Date, default : Date.now}
})

mongoose.model('Game', GameSchema)