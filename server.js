import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import listEndpoints from 'express-list-endpoints';
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/books";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Author = mongoose.model("Author", {
  name: String
});

const Book = mongoose.model("Book", {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author"
  }
});

if (process.env.RESET_DATABASE) {
  console.log("Resetting database!Yaya")
  
  const seedDatabase = async () => { 
    await Author.deleteMany()
    await Book.deleteMany()

    const tolkien = new Author({ name: "J.R.R Tolkien" })
    await tolkien.save()
    
    const rowling = new Author({ name: "J.K Rowling"})
    await rowling.save()
  
    await new Book({ title: "Harry Potter and the Philosopher's Stone", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Half-Blood Prince", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
    await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
    await new Book({ title: "The Hobbit", author: tolkien }).save()      
 }
 seedDatabase()
};

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 7080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => { 
  if (mongoose.connection.readyState == 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable"})
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  //documentation
  //Express List Endpoints
  const endpoints = listEndpoints(app);

  res.send({
    message: "Hello World!",
    endpoints: endpoints
  });
});

app.get("/authors", async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
});

app.get("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({error: "Author didn't found. Try again."})
    }
  } catch (err) {
    res.status(400).json({error: "Invalid author ID !!!"})
  }
})

app.get("/authors/:id/books", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    if (author) {
      const books = await Book.find({
      author: mongoose.Types.ObjectId.createFromHexString(author.id)
    })
    res.json(books)
    } else {
      res.status(404).json({error: "Author didn't found. Try again."})
    }
  } catch (err) {
    res.status(400).json({error: "Invalid author ID"})
  }
})

app.get("/books", async (req, res) => {
  const books = await Book.find().populate("author")
  res.json(books)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
