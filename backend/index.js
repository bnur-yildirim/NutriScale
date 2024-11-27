const express = require("express")
const app = express()
const path = require("path")
const recipeRoutes = require('./recipeRoutes.js');
const recipes = require('./recipes.json');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front-end')));

app.get("^/$|/index(.html)", (req, res) => {
    res.sendFile(path.join(__dirname, "../front-end", "index.html"));
});

app.get("/about-us(.html)", (req, res) => {
    res.sendFile(path.join(__dirname, "../front-end", "About_us.html"));
});

app.use('/api', recipeRoutes);

app.get('/api/recipes', (req, res) => {
    res.json(recipes); // Serve the JSON data
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
