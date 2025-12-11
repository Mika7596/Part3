const express = require("express");
const app = express();
const morgan = require("morgan");


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (request, response) => {
    response.send("Welcome to Phonebook backend!")
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
  response.send(`<h2>Phonebook has info for ${persons.length} people</h2><p>${new Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id == id);
  if (person) {
    response.json(person)
  } else {
    response.status(404).end("Entry not found")
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const personToDelete = persons.find(p => p.id == id);
  if (personToDelete){
    persons = persons.filter(p => p.id != id);
    response.status(204).end("Entry deleted");
  } else {
    response.status(404).end("Entry not found")
  }
})

app.use(express.json());
app.use(morgan("tiny"));
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
function generateNewId () {
  const newId = Math.floor(Math.random() * 200);
  return newId;
}
app.post("/api/persons", (request, response) => {
  const newEntry = request.body;
  if (!newEntry.name.trim() || !newEntry.number.trim()) {
    return response.status(404).end("Please fill out both name and number inputs.")
  }
  if (persons.find(p => p.name == newEntry.name)){
    return response.status(404).end("Entry with this name already exists in phonebook.")
  }
  let id = 1;
  do {
    id = generateNewId()
  } while (persons.find(p => p.id == id))
  newEntry.id = id;
  persons = persons.concat(newEntry);
  response.json(newEntry);
  response.send(`${newEntry} added to phonebook successfully!`)
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);