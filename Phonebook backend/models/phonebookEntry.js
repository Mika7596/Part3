const mongoose = require('mongoose')

const phoneRegex = /^\d{2,3}-\d{6,}$/

const entrySchema = new mongoose.Schema({
  name: {type: String, minLength: 3, required: true},
  number: {type: String, required: true, minLength: 8, validate: {
    validator: function(v) {
      return phoneRegex.test(v)
    },
    message: props => `${props.value} is not a valid number. It must follows one of the next formats: XX-XXXXXXX or XXX-XXXXXXXX`
  }}
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry
