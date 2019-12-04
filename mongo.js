const mongoose = require('mongoose')



const password = process.argv[2]

const url =
    `mongodb+srv://fullstackmongo:${password}@cluster0-jpc0j.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String

})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

console.log(person)

if (process.argv.length < 4) {
    console.log("phonebook: ")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })

        process.exit(1)
    })
}

person.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
})