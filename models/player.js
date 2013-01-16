var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var PlayerSchema = new Schema({
    status: String
  , playName: String
  , playerWeiId: String
  , busiunesWeiId: String
  , businessId: {type : Schema.ObjectId, ref : 'Business'}
  , userId: {type : Schema.ObjectId, ref : 'User'}
  , gameId: {type : Schema.ObjectId, ref : 'Game'}
  , createDate: {type : Date, default : Date.now}
});
mongoose.model('Player', PlayerSchema);