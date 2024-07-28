// Array of quote objects (initially empty)
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

window.addEventListener('DOMContentLoaded', () => {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        quotes.push(JSON.parse(lastViewedQuote));
        showRandomQuote();
    } else {
        loadQuotes();
    }
});


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
        quotes.push({ text, category });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        saveQuotes();
        showRandomQuote(); // Display the new quote immediately
    } else {
        alert('Please fill in both the quote and category.');
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    showRandomQuote();
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

function importQuotes(jsonString) {
    try {
        const importedQuotes = JSON.parse(jsonString);
        if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            showRandomQuote();
            alert('Quotes imported successfully!');
        } else {
            alert('Invalid JSON format. Please provide a valid JSON array.');
        }
    } catch (error) {
        alert('Failed to import quotes. Please check the JSON format.');
    }
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        showRandomQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

document.getElementById('importButton').addEventListener('click', () => {
    const jsonString = prompt('Enter JSON string to import quotes:');
    importQuotes(jsonString);
});

document.getElementById('exportButton').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);


// Initial setup
loadQuotes();
createAddQuoteForm();

// Event listener for the button to show a new random quote
const newQuoteButton = document.getElementById('newQuote');
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for the import button
document.getElementById('importButton').addEventListener('click', () => {
    const jsonString = prompt('Enter JSON string to import quotes:');
    importQuotes(jsonString);
});

// Event listener for the export button
document.getElementById('exportButton').addEventListener('click', exportQuotes);

// Event listener for file input to import quotes from JSON file
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
