const mongoose = require('mongoose')
const Entry = require('./models/phonebookEntry')

if (process.argv.length < 5) {
  console.log('One or more arguments missing')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://mika7596_db_user:${password}@cluster0.aojgs27.mongodb.net/?appName=Cluster0`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to db successfully!')
    const newEntry = new Entry({
      name: name,
      number: number,
      id: Math.floor(Math.random() * 500)
    })
    return newEntry.save()
  })
  .then(() => {
    console.log(`New entry added to phonebook successfully: ${name}  ${number}`)
    mongoose.connection.close()  
  })
  .catch((error) => {
    console.error('Error connecting to DB or saving the new number', error.message)
    mongoose.connection.close()
  })