const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resetPasswordSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  token: { type: String },  
  expiresAt: { type: Date, default: () => Date.now() + 3600000}  
});

module.exports = mongoose.model('ResetPasswordToken', resetPasswordSchema);  
