var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: String
  , email: String
  , username: String
  , provider: String
  , address: String
  , phone: String
  , createDate: {type : Date, default : Date.now}
})

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('username').validate(function (username) {http://ucdchina.com/baiya/?p=922
  return username.length
}, 'Username cannot be blank')

// pre save hooks
UserSchema.pre('save', function(next) {
  next()
})

mongoose.model('User', UserSchema)