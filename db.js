var mongoose = require('mongoose');
mongoose.connect("mongodb://...");
var userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
});
exports.User = mongoose.model("user", userSchema);

module.exports = {
  'url' : 'mongodb://localhost/passport'
}
