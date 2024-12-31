document.addEventListener('DOMContentLoaded', () => {
    // Fetch the recipe data from JSON
    fetch('/api/recipes')
        .then(response => response.json())
        .then(data => {
            const hotChocolateRecipe = data.recipes.find(recipe => recipe.name === "Hot Chocolate");

            // Populate the recipe name
            document.getElementById('recipe-name').textContent = hotChocolateRecipe.name;

            // Populate the ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            hotChocolateRecipe.ingredients.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                ingredientsList.appendChild(listItem);
            });

            // Populate the steps
            const stepsList = document.getElementById('steps-list');
            hotChocolateRecipe.steps.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                stepsList.appendChild(listItem);
            });

            // Store the original recipe for adjustment
            window.originalRecipe = hotChocolateRecipe;
        })
        .catch(error => console.error('Error fetching recipe:', error));

    // Handle the Connect Scale button
    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            // Request a Bluetooth Serial device (Bluetooth Classic)
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 }); // Ensure baud rate matches your scale's configuration

            // Create a reader to get data from the serial port
            const reader = port.readable.getReader();
            const decoder = new TextDecoder();

            document.getElementById('status').innerText = "Connected to the scale. Awaiting weight...";

            // Continuously read data from the scale
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                // Decode and parse the incoming weight data
                const decodedValue = decoder.decode(value).trim();
                const weightFromScale = parseFloat(decodedValue);

                if (!isNaN(weightFromScale)) {
                    if (weightFromScale === 0) {
                        // Do not adjust the recipe if weight is 0
                        document.getElementById('status').innerText = "Scale reads 0. Showing original recipe.";
                        displayOriginalRecipe();
                    } else {
                        document.getElementById('status').innerText = `Connected. Scale says: ${weightFromScale} g`;
                        // Adjust the recipe based on the weight value
                        adjustRecipe(weightFromScale);
                    }
                }
            }

            // Close the port after reading (optional)
            await port.close();
        } catch (error) {
            console.error('Connection failed', error);
            document.getElementById('status').innerText = 'Connection failed. Please check your device.';
            document.getElementById('status').style.color = 'red';
        }
    });

    // Display the original recipe
    function displayOriginalRecipe() {
        const originalRecipe = window.originalRecipe;
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = ''; // Clear the existing list

        originalRecipe.ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            ingredientsList.appendChild(listItem);
        });
    }

    // Adjust recipe based on the scale's weight and selected ingredient
    function adjustRecipe(ingredientWeight) {
        const adjustedIngredientsList = document.getElementById('ingredients-list');
        adjustedIngredientsList.innerHTML = ''; // Clear the existing list

        const originalRecipe = window.originalRecipe;
        const selectedIngredient = document.getElementById('ingredient-select').value;

        // Find the selected ingredient's entry in the original recipe
        const selectedIngredientEntry = originalRecipe.ingredients.find(ingredient => ingredient.includes(selectedIngredient));
        if (!selectedIngredientEntry) {
            document.getElementById('status').innerText = `Selected ingredient (${selectedIngredient}) not found in the recipe.`;
            return;
        }

        // Extract the original weight for the selected ingredient
        const originalWeightMatch = selectedIngredientEntry.match(/(\d+)(g)/);
        if (!originalWeightMatch) {
            document.getElementById('status').innerText = `No weight found for the selected ingredient.`;
            return;
        }

        const originalWeight = parseFloat(originalWeightMatch[1]);

        // Calculate the adjustment factor
        const adjustmentFactor = ingredientWeight / originalWeight;

        // Adjust all ingredients based on the selected ingredient's new weight
        const adjustedIngredients = originalRecipe.ingredients.map(ingredient => {
            const match = ingredient.match(/(\d+)(g)/);
            if (match) {
                const weight = parseFloat(match[1]);
                const adjustedWeight = Math.round(weight * adjustmentFactor);
                return {
                    original: ingredient,
                    adjusted: ingredient.replace(`${weight}g`, `${adjustedWeight}g`),
                };
            }
            return { original: ingredient, adjusted: ingredient }; // Return non-weight ingredients as is
        });

        adjustedIngredients.forEach(({ original, adjusted }) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${original} → ${adjusted}`;
            adjustedIngredientsList.appendChild(listItem);
        });

        document.getElementById('status').innerText = `Recipe adjusted based on scale weight: ${ingredientWeight} g`;
    }
});
