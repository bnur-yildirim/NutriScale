document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const dropdown = document.getElementById('search-dropdown');

    // Fetch the recipes JSON data
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => searchRecipes(data.recipes, query, dropdown));
});

function searchRecipes(recipes, query, dropdown) {
    dropdown.innerHTML = ''; // Clear previous results

    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query)
    );

    if (filteredRecipes.length > 0) {
        dropdown.style.display = 'block'; // Show dropdown

        filteredRecipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.textContent = recipe.name;
            recipeElement.onclick = function () {
                window.location.href = `${recipe.name.toLowerCase().replace(/\s+/g, '-')}.html`; // Navigate to recipe page
            };
            dropdown.appendChild(recipeElement);
        });
    } else {
        dropdown.style.display = 'none'; // Hide dropdown if no results
    }
}

// Hide dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('search-dropdown');
    if (!event.target.closest('.search-bar')) {
        dropdown.style.display = 'none';
    }
});
