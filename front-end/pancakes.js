document.addEventListener('DOMContentLoaded', () => {
    // Fetch the recipe data from JSON
    fetch('/api/recipes')
        .then(response => response.json())
        .then(data => {
            const pancakesRecipe = data.recipes.find(recipe => recipe.name === "Pancakes");

            // Populate the recipe name
            document.getElementById('recipe-name').textContent = pancakesRecipe.name;

            // Populate the ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            pancakesRecipe.ingredients.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                ingredientsList.appendChild(listItem);
            });

            // Populate the steps
            const stepsList = document.getElementById('steps-list');
            pancakesRecipe.steps.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                stepsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching recipe:', error));

    // Handle the Connect Scale button
    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service'] // Replace with your service UUID
            });

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('battery_service'); // Replace with your service UUID
            const characteristic = await service.getCharacteristic('battery_level'); // Replace with your characteristic UUID

            const value = await characteristic.readValue();
            const decodedValue = new TextDecoder().decode(value);
            document.getElementById('status').innerText = `Connected. Scale says: ${decodedValue}`;
        } catch (error) {
            console.error('Connection failed', error);
            document.getElementById('status').innerText = 'Connection failed.';
        }
    });
});