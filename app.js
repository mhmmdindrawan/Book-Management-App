// Get references to DOM elements
const addBookForm = document.getElementById('addBookForm');
const searchForm = document.getElementById('searchForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const statusInput = document.getElementById('statusInput');
const readingList = document.getElementById('readingBooks');
const finishedList = document.getElementById('finishedBooks');
const searchInput = document.getElementById('searchInput');

// Load books from storage when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

// Function to load books from storage and display them
function loadBooks() {
    readingList.innerHTML = ''; // Clear existing books
    finishedList.innerHTML = '';

    // Check if books exist in storage
    if (localStorage.getItem('books')) {
        const books = JSON.parse(localStorage.getItem('books'));

        // Loop through books and create list items
        books.forEach((book, index) => {
            if (book.title.toLowerCase().includes(searchInput.value.toLowerCase())) {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteBook(index));
                li.appendChild(deleteButton);

                if (book.status === 'reading') {
                    const moveButton = document.createElement('button');
                    moveButton.textContent = 'Move to Finished';
                    moveButton.addEventListener('click', () => moveBook(index, 'reading', 'finished'));
                    li.appendChild(moveButton);
                    readingList.appendChild(li);
                } else if (book.status === 'finished') {
                    const moveButton = document.createElement('button');
                    moveButton.textContent = 'Move to Reading';
                    moveButton.addEventListener('click', () => moveBook(index, 'finished', 'reading'));
                    li.appendChild(moveButton);
                    finishedList.appendChild(li);
                }
            }
        });
    }
}

// Function to add new book
function addBook(title, author, status) {
    // Create book object
    const book = {
        title: title,
        author: author,
        status: status
    };

    // Add book to storage
    let books = [];
    if (localStorage.getItem('books')) {
        books = JSON.parse(localStorage.getItem('books'));
    }
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

    // Reload books and clear form inputs
    loadBooks();
    titleInput.value = '';
    authorInput.value = '';
}

// Function to delete book
function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem('books'));
    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    loadBooks();
}

// Function to move book between shelves
function moveBook(index, fromShelf, toShelf) {
    let books = JSON.parse(localStorage.getItem('books'));
    const bookToMove = books[index];
    bookToMove.status = toShelf;
    books.splice(index, 1);
    books.push(bookToMove);
    localStorage.setItem('books', JSON.stringify(books));
    loadBooks();
}

// Event listener for form submission
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const status = statusInput.value;
    if (title !== '' && author !== '') {
        addBook(title, author, status);
    }
});

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    loadBooks();
});
