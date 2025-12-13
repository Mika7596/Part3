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
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


app.get("/", (request, response) => {
    response.send("Welcome to Phonebook backend!")
})

app.get("/api/persons", (request, response) => {
    Entry.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
      response.status(500).send("Error fetching phonebook entries.");
    });
})

app.get("/info", (request, response) => {
  Entry.countDocuments({})
    .then(count => {
      response.send(`<h2>Phonebook has info for ${count} people</h2><p>${new Date()}</p>`);
    })
    .catch(error => {
      console.error('Error al contar las personas:', error.message);
      response.status(500).send("Error al contar las personas.");
    });
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Entry.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end("Entry not found");
      }
    })
    .catch(error => {
      console.error('Error al obtener la persona:', error.message);
      response.status(500).send("Error al obtener la persona.");
    });
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Entry.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        response.status(204).end("Entry deleted");
      } else {
        response.status(404).end("Entry not found");
      }
    })
    .catch(error => {
      console.error('Error deleting entry:', error.message);
      response.status(500).send("Error deleting entry.");
    });
})

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const newEntry = new Entry({name:body.name, number:body.number})

  if (!newEntry.name.trim() || !newEntry.number.trim()) {
    return response.status(404).end("Please fill out both name and number inputs.")
  }

  Entry.findOne({ name: newEntry.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).end("Entry with this name already exists in phonebook.");
      }
      return newEntry.save();
    })
    .then(savedEntry => {
      console.log("New entry added to phonebook");
      response.status(201).json(savedEntry);
    })
    .catch(error => {
      console.error("Error saving entry:", error.message);
      response.status(500).send("Error saving entry to the phonebook.");
    });

})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);