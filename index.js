const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

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

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 9999999);
}

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `);
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        });
    };

    if ( persons.find(person => person.name === body.name) ){
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    };
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };
    
    persons = persons.concat(person);
    
    response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});