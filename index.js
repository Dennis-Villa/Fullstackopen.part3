require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("dist"));

morgan.token("body", (req) => {
    if (req.method === "POST") {
        return JSON.stringify( req.body );
    }

    return "";
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(err => next(err));
});

app.get("/info", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.send(`
                <div>
                    <p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>
                </div>
            `);
        })
        .catch(err => next(err));

});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then(resp => {
            response.json(resp.toJSON());
        })
        .catch(err => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person);
            }
            else {
                response.status(404).end();
            }
        })
        .catch(err => next(err));

});

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: "query" })
        .then(person => {
            if (person) {
                response.json(person);
            }
            else {
                response.status(404).end();
            }
        })
        .catch(err => next(err));

});

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end();
        })
        .catch(err => next(err));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }
    else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});