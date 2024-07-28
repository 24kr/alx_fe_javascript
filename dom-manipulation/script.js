// Array of quote objects
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
    { text: "Do not wait; the time will never be 'just right.' Start where you stand.", category: "action" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "growth" },
    { text: "You miss 100% of the shots you don’t take.", category: "motivational" }
];

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
        quotes.push({ text, category });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuote(); // Display the new quote immediately
    } else {
        alert('Please fill in both the quote and category.');
    }
}

// Initial display of a random quote
showRandomQuote();

// Setup the form to add new quotes
createAddQuoteForm();

// Event listener for the button to show a new random quote
const newQuoteButton = document.getElementById('newQuote');
newQuoteButton.addEventListener('click', showRandomQuote);
