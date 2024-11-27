const express = require('express');
const router = express.Router();
let recipes = require("./recipes.json")

// GET endpoint to fetch recipes
router.get('/api/recipes', (req, res) => {
    res.json(recipes); // Return the recipes data as JSON
});

// PUT endpoint to update a recipe based on cooking progress (for real-time updates)
router.put('/recipes/:id', (req, res) => {
    const recipeId = parseInt(req.params.id);
    const updatedData = req.body; // Assume it contains the updated recipe steps or ingredients

    // Find the recipe and update it
    let recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
        // Update the recipe (can be more detailed based on needs)
        recipe.steps = updatedData.steps || recipe.steps;
        recipe.ingredients = updatedData.ingredients || recipe.ingredients;

        res.json(recipe); // Return the updated recipe
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

module.exports = router;