let quotes = [];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Clear the current quote
    quoteDisplay.innerHTML = '';

    // Create and append new quote elements
    const quoteText = document.createElement('p');
    quoteText.textContent = quote.text;
    const quoteCategory = document.createElement('em');
    quoteCategory.textContent = `– ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    // Save the last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formHTML = `
    <div id="newQuoteForm">
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', formHTML);
}

// Function to add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        saveQuotes();
        showRandomQuote(); // Display the new quote immediately
        populateCategories(); // Update category filter dropdown
    } else {
        alert('Please fill in both the quote and category.');
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories(); // Update category dropdown when saving quotes
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    showRandomQuote();
    populateCategories(); // Populate categories on load
}

// Function to import quotes from a JSON string
function importQuotes(jsonString) {
    try {
        const importedQuotes = JSON.parse(jsonString);
        if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            showRandomQuote();
            alert('Quotes imported successfully!');
            populateCategories(); // Update category filter dropdown
        } else {
            alert('Invalid JSON format. Please provide a valid JSON array.');
        }
    } catch (error) {
        alert('Failed to import quotes. Please check the JSON format.');
    }
}

// Function to export quotes to a JSON string
function exportQuotes() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to handle file import
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        showRandomQuote();
        alert('Quotes imported successfully!');
        populateCategories(); // Update category filter dropdown
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    let filteredQuotes = quotes;

    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;
        const quoteCategory = document.createElement('em');
        quoteCategory.textContent = `– ${quote.category}`;

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });
}

// Function to populate categories in the dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = sessionStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }

    filterQuotes();
}

// Event listener for category filter change
document.getElementById('categoryFilter').addEventListener('change', function () {
    sessionStorage.setItem('lastSelectedCategory', this.value);
    filterQuotes();
});

// Initial setup
loadQuotes();
createAddQuoteForm();
populateCategories(); // Populate categories on initial load

// Event listener for the button to show a new random quote
const newQuoteButton = document.getElementById('newQuote');
newQuoteButton.addEventListener('click', showRandomQuote);
