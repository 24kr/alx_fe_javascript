let quotes = [];

// Mock server setup
const mockServer = {
    quotes: [],

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

// Fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        return data.map(post => ({ text: post.title, category: 'general' }));
    } catch (error) {
        console.error('Failed to fetch quotes:', error);
        return [];
    }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: quote.text, body: quote.category })
        });
        const data = await response.json();
        return { ...quote, id: data.id };
    } catch (error) {
        console.error('Failed to post quote:', error);
        return null;
    }
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');

    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    quoteText.textContent = quote.text;
    const quoteCategory = document.createElement('em');
    quoteCategory.textContent = `– ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

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
async function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        await postQuoteToServer(newQuote);
        saveQuotes();
        showRandomQuote();
        populateCategories();
    } else {
        alert('Please fill in both the quote and category.');
    }
}

// Function to save quotes to local storage and sync with server
async function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    await syncQuotes();
    populateCategories();
}

// Function to load quotes from local storage and sync with the server
async function loadQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = getLocalQuotes();

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

// Function to get local quotes from storage
function getLocalQuotes() {
    const quotesData = localStorage.getItem('quotes');
    return quotesData ? JSON.parse(quotesData) : [];
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
            populateCategories();
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
        populateCategories();
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

// Function to display filtered quotes
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

// Function to populate category filter dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to sync quotes with the server
async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = getLocalQuotes();

        const allQuotes = [...localQuotes, ...serverQuotes];
        const uniqueQuotes = Array.from(new Set(allQuotes.map(quote => JSON.stringify(quote))))
            .map(str => JSON.parse(str));

        quotes = uniqueQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        console.log('Data synced successfully');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Function to periodically sync data
function startPeriodicSync(interval = 30000) {
    setInterval(syncQuotes, interval);
}

// Function to resolve conflicts by prioritizing server data
function resolveConflicts(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];

    serverQuotes.forEach(serverQuote => {
        const localQuoteIndex = mergedQuotes.findIndex(localQuote =>
            localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
        );

        if (localQuoteIndex !== -1) {
            mergedQuotes[localQuoteIndex] = serverQuote;
        } else {
            mergedQuotes.push(serverQuote);
        }
    });

    return mergedQuotes;
}

// Function to notify users about conflicts
function notifyConflictResolution() {
    alert('Conflicts have been resolved. Please review the data.');
}

// Function to handle data conflicts
async function h
