let quotes = [];

// Mock server setup
const mockServer = {
    quotes: [],  // This will simulate the database

    fetchQuotes() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.quotes);
            }, 500);
        });
    },

    saveQuotes(newQuotes) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.quotes = newQuotes;
                resolve(this.quotes);
            }, 500);
        });
    }
};

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

// Function to save quotes to local storage and sync with server
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    syncWithServer();  // Sync with the server
}

// Function to load quotes from local storage and sync with the server
async function loadQuotes() {
    try {
        const serverQuotes = await mockServer.fetchQuotes();
        const localQuotes = getLocalQuotes();

        // Check if server data is more recent
        if (serverQuotes.length > localQuotes.length) {
            quotes = serverQuotes;
        } else {
            quotes = localQuotes;
        }

        showRandomQuote();
        populateCategories();
    } catch (error) {
        console.error('Failed to load quotes:', error);
    }
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
