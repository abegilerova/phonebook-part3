//const http = require('http')
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');
const PORT = process.env.PORT;

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformated id' })
    }
    next(error)
}

app.use(errorHandler)

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))

const bodyParser = require('body-parser')


app.use(cors());
app.use(express.static('build'))
app.use(bodyParser.json())


// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//     },
//     {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 456
//     },

//     {
//         "name": "Aika Begilerova",
//         "number": "272148",
//         "id": 457
//     }
// ]
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

//let numberOfPeople = persons.length;
let date = new Date();
app.get('/info', (req, res) => {
    //Person.find({}).then(persons => {
    //  res.json('Phonebook has info for ' + persons.length + ' people ' + '\n ' + date)
    //})

    Person.estimatedDocumentCount().then(persons => {
        console.log(persons)
        res.send('Phonebook has info for ' + persons + ' people \n ' + date)
    })


})

// app.get('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const person = persons.find(person => person.id === id)
//     if (person) {
//         res.json(person)
//     } else {
//         res.status(404).end();
//     }
// })

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(note.toJSON())
        } else {
            res.status(404).end()
        }
        res.json(person.toJSON())
    })
        .catch(error => next(error)) //{
    //console.log(error);
    //res.status(400).send({ error: 'malformated id' });
    //})
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     persons = persons.filter(person => person.id !== id)
//     res.status(204).end()
// })

app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id).then(result => {
        if (result === null) {
            res.status(404).json({ error: "person does not exist " });
        }
        res.json(result.toJSON());
    });
});

// Delete method with 204 status as success
// app.delete('/api/persons/:id', (request, response, next) => {
//     Person.findByIdAndRemove(request.params.id)
//         .then(result => {
//             response.status(204).end()
//         })
//         .catch(error => next(error))
// })


app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})


const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content is missing'
        })

    }
    const person = new Person({
        name: body.name,
        number: body.number
        //id: generateId(),
    })
    //persons = persons.concat(person)
    //res.json(person)

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

})