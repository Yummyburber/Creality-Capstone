
//supabase connection//
//const SUPABASE_URL = 'https://supubas url';
//const SUPABASE_KEY = 'supabase-key';

//Library//
//const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//sample data//

console.log("Recipes JavaScript is running");

const sampleRecipes = [
    {
        id: 1,
        title: "Pasta Primavera",
        mealType: "Dinner",
        time: "30 min",
        difficulty: "Easy"
    },
    {
        id: 2,
        title: "Mac'n Cheese",
        mealType: "Dinner",
        time: "30 min",
        difficulty: "Easy"
    },
    {
        id: 3,
        title: "Steak Alfredo",
        mealType: "Dinner",
        time: "30 min",
        difficulty: "Easy"

    },
    {
        id: 4,
        title: "Chicken Caesar Salad",
        mealType: "Dinner",
        time: "30 min",
        difficulty: "Easy",
        dietaryNeeds: ["Gluten-free"]
    }
];

//page elements//
const searchInput = document.querySelector(".recipes-search-bar input");
const mealTypeSelect = document.getElementById("meal-type");
const dietaryNeedsSelect = document.getElementById("dietary-needs");
const clearFiltersButton = document.getElementById("clear-filters");
const recipesGrid = document.querySelector(".recipes-grid");
const sectionHeading = document.querySelector(".section-heading");

let allRecipes = sampleRecipes;

//load recipes from database//
// TODO: enable when supabase is set up and connected
//async function loadRecipes() {
   // const { data, error } = await supabaseClient
       // .from('recipes')
     //   .select('*');
   // if (error) {
   //     console.error('Error loading recipes:', error);
  //  } else {
   //     allRecipes = data.length > 0 ? data : sampleRecipes;
    //    renderRecipes(allRecipes);
   // }
//}//

function createRecipeCard(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';

    const title = document.createElement('h3');
    title.textContent = recipe.title;
     
    const mealType = document.createElement('p');
    mealType.textContent = recipe.mealType + " * " + recipe.time + " * " + recipe.difficulty;

    const link = document.createElement('a');
    link.href = `recipe.html?id=${recipe.id}`;
    link.textContent = "View Recipe";

    card.appendChild(title);
    card.appendChild(mealType);
    card.appendChild(link);

    return card;
}

//shimmering placeholder cards, shown while recipes are loading//
function showLoadingCards(count) {
    recipesGrid.replaceChildren();
    recipesGrid.setAttribute('aria-busy', 'true');

    for (let i = 0; i < count; i++) {
        const card = document.createElement('article');
        card.className = 'recipe-card is-loading';
        card.setAttribute('aria-hidden', 'true');
        card.innerHTML =
            '<div class="skeleton skeleton-image"></div>' +
            '<div class="skeleton skeleton-line"></div>' +
            '<div class="skeleton skeleton-line skeleton-line--short"></div>' +
            '<div class="skeleton skeleton-button"></div>';
        recipesGrid.appendChild(card);
    }
}

//show list of recipes function//
function renderRecipes(list) {
    recipesGrid.replaceChildren();
    recipesGrid.setAttribute('aria-busy', 'false');

    if (list.length === 0) {
        const message = document.createElement('p');
        message.classList.add('no-results');
        message.textContent = "Could not find any recipes. Try different keywords or clear your filters.";
        recipesGrid.appendChild(message);
        return;
}
    
    for (let i = 0; i < list.length; i++) {
        recipesGrid.appendChild(createRecipeCard(list[i]));
    }

}

//decide which recipes actually match//

function getfilteredRecipes (){
    const query = searchInput.value.trim().toLowerCase();
    const mealType = mealTypeSelect.value;
    const dietaryNeeds = dietaryNeedsSelect.value;

    return allRecipes.filter(function(recipe) {
        const matchesQuery = recipe.title.toLowerCase().includes(query);
        const matchesMealType = !mealType || recipe.mealType === mealType;
        const matchesDietaryNeeds = !dietaryNeeds || (recipe.dietaryNeeds || []).includes(dietaryNeeds);
        return matchesQuery && matchesMealType && matchesDietaryNeeds;
    });
}

function applyFilters() {
    const filteringRecipes = searchInput.value.trim() !== "" || mealTypeSelect.value !== "" || dietaryNeedsSelect.value !== "" ? getfilteredRecipes() : allRecipes;
    renderRecipes(filteringRecipes);
}

//the events //

searchInput.addEventListener("input", applyFilters);
mealTypeSelect.addEventListener("change", applyFilters);
dietaryNeedsSelect.addEventListener("change", applyFilters);

clearFiltersButton.addEventListener("click", function() {
    searchInput.value = "";
    mealTypeSelect.value = "";
    dietaryNeedsSelect.value = "";
    applyFilters();
});

const promptBtn = document.getElementById("import-recipes");

//promptBtn.addEventListener("click", function() {

//error banner//
const errorBanner = document.getElementById('error-banner');
function handleError(event) {
    errorBanner.textContent = "An error occurred: " + event.message;
    errorBanner.style.display = 'block';
}
window.addEventListener('error', handleError);

// fill search box if homepage sent a search term (homepage.js uses ?query=)
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('query');
if (searchTerm !== null) {
    searchInput.value = searchTerm;
}

// Placeholders show while recipes load. The sample recipes are instant, so they only
// become visible once loading from Supabase (loadRecipes) is turned on.
showLoadingCards(4);
applyFilters();
