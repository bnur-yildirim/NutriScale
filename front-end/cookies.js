document.addEventListener('DOMContentLoaded', () => {
    // Fetch the recipe data from JSON (adjusted to match the cookie recipe structure)
    fetch('recipes.json')  // Use the correct path if necessary
        .then(response => response.json())
        .then(data => {
            const cookiesRecipe = data.recipes.find(recipe => recipe.name === "Cookies");

            // Populate the recipe name
            document.getElementById('recipe-name').textContent = cookiesRecipe.name;

            // Populate the ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            cookiesRecipe.ingredients.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                ingredientsList.appendChild(listItem);
            });

            // Populate the steps
            const stepsList = document.getElementById('steps-list');
            cookiesRecipe.steps.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                stepsList.appendChild(listItem);
            });

            // Store the original recipe for adjustment
            window.originalRecipe = cookiesRecipe;
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

    // Adjust recipe based on the scale's weight
    function adjustRecipe(ingredientWeight) {
        const adjustedIngredientsList = document.getElementById('ingredients-list');
        adjustedIngredientsList.innerHTML = ''; // Clear the existing list

        const originalRecipe = window.originalRecipe;

        // Assume the first ingredient is the one we adjust by weight
        const firstIngredient = originalRecipe.ingredients[0];
        const originalWeight = parseFloat(firstIngredient.match(/(\d+)(g)/)[1]);

        const adjustmentFactor = ingredientWeight / originalWeight;

        // Adjust all ingredients based on the first ingredient's new weight
        const adjustedIngredients = originalRecipe.ingredients.map(ingredient => {
            const match = ingredient.match(/(\d+)(g)/);
            if (match) {
                const originalWeight = parseFloat(match[1]);
                const adjustedWeight = Math.round(originalWeight * adjustmentFactor);
                return {
                    original: ingredient,
                    adjusted: ingredient.replace(`${originalWeight}g`, `${adjustedWeight}g`),
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
