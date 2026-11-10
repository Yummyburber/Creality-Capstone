const searchForm = document.querySelector('.search-bar');
const homesearchInput = document.querySelector('.search-bar input[type="text"]');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const query = homesearchInput.value.trim();

    if (query==="") {
        return;
    }

    window.location.href = `recipes.html?query=${encodeURIComponent(query)}`;
});