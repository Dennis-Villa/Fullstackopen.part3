require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('dist'));

morgan.token('body', (req, res) => { 
    if (req.method === 'POST') {
        return JSON.stringify( req.body );
    }
    
    return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const generateId = () => {
    return Math.floor(Math.random() * 9999999);
}

app.get('/api/persons', (request, response) => {
    Person.find({})
    .then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    Person.find({})
    .then(persons => {
        response.send(`
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
            </div>
        `);
    });
    
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        });
    };
    
    const person = new Person({
        name: body.name,
        number: body.number,
    });
    
    person.save()
    .then(resp => {
        response.json(resp);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Person.findById(id)
    .then(person => {
        if (person) {
            response.json(person);
        }
        else {
            response.status(404).end();
        }
    });
    
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});