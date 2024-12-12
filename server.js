import express from "express";
import cors from "cors";
import res from "express/lib/response";
import boardgames from "./data/boardgames.json"

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  //documentation
  //Express List Endpoints
  res.send("Hello Technigo!");
});


app.get("/boardgames", (req, res) => { 
  res.json(boardgames); 
})


app.get("/boardgames", (req, res) => { 
  const category = req.query.category

  const filteredBoardgames = boardgames.filter(game => game.category.toLowerCase() === category)
  res.json(filteredBoardgames); // ex http://localhost:8080/boardgames?category=strategy will show only game with category = strategy
}) 

app.get("/boardgames/:id", (req, res) => { 
  const id = req.params.id;

  const boardgame = boardgames.find(game => game.id === +id) // + is to convert a string into a number
  if (boardgame) {
    res.status(200).json(boardgame)
  } else {
    res.status(404).send("No game found with that ID!")
  }  
 })




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
