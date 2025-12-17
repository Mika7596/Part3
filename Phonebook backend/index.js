const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./dbConfig");
const Entry = require("./models/phonebookEntry");

dotenv.config();

app.use(cors());
app.use(express.static("dist"));

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

app.use(express.json());
app.use(morgan("tiny"));
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send("Welcome to Phonebook backend!");
});

app.get("/api/persons", (request, response, next) => {
  Entry.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Entry.countDocuments({})
    .then((count) => {
      response.send(
        `<h2>Phonebook has info for ${count} people</h2><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Entry.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end("Entry not found");
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Entry.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        response.status(204).end("Entry deleted");
      } else {
        const error = new Error("Entry not found");
        error.name = "NotFoundError";
        next(error);
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const newEntry = new Entry({ name: body.name, number: body.number });

  if (!newEntry.name.trim() || !newEntry.number.trim()) {
    return response
      .status(400)
      .end("Please fill out both name and number inputs.");
  }

  Entry.findOne({ name: newEntry.name.toLowerCase() })
    .then((existingPerson) => {
      if (existingPerson) {
        return response
          .status(400)
          .end("Entry with this name already exists in phonebook.");
      }
      return newEntry.save();
    })
    .then((savedEntry) => {
      console.log("New entry added to phonebook");
      response.status(201).json(savedEntry);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({ error: 'Name and number are required' });
    }

    Entry.findByIdAndUpdate(id, { number }, { new: true, runValidators: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                console.log(`Person with id ${id} updated`);
                response.json(updatedPerson);
            } else {
                const error = new Error("Entry not found");
                error.name = "NotFoundError";
                next(error);
            }
        })
        .catch(error => next(error));
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

  if (error.name === "NotFoundError") {
    return response.status(404).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
