var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var BusinessSchema = new Schema({
    name: String
  , valid: String
  , businessWeiId: String
  , userId: {type : Schema.ObjectId, ref : 'User'}
  , key: String
  , structure: String
  , createDate: {type : Date, default : Date.now}
})


mongoose.model('Business', BusinessSchema)