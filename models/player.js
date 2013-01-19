var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var PlayerSchema = new Schema({
    status: String
  , uniqueHashKey: String
  , playName: String
  , playerWeiId: String
  , playerWeiIdHashId: String
  , businessWeiId: String
  , businessWeiIdHashKey: String
  , businessId: {type : Schema.ObjectId, ref : 'Business'}
  , userId: {type : Schema.ObjectId, ref : 'User'}
  , gameId: {type : Schema.ObjectId, ref : 'Game'}
  , createDate: {type : Date, default : Date.now}
});
mongoose.model('Player', PlayerSchema);