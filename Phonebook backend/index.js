const express = require("express");
const app = express();

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
    response.send("Entry deleted");
    response.status(204).end();
  } else {
    response.status(404).end("Entry not found")
  }
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);