const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  
  if (data !== null) {
    books = data;
  }

  document.dispatchEvent(new Event("ondataloaded"));
}

function generateId() {
  return +new Date();
}

function addBook() {
  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteInput = document.getElementById('bookFormIsComplete');

  const id = generateId();
  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);
  const isComplete = isCompleteInput.checked;

  const newBook = {
    id,
    title,
    author,
    year,
    isComplete
  };
  
  books.push(newBook);
  document.dispatchEvent(new Event("ondatachanged"));
  saveData();
}

function removeBook(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event("ondatachanged"));
    saveData();
  }
}

function toggleBookStatus(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event("ondatachanged"));
    saveData();
  }
}

function editBook(bookId, newData) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.title = newData.title;
    book.author = newData.author;
    book.year = newData.year;
    document.dispatchEvent(new Event("ondatachanged"));
    saveData();
  }
}

function createBookElement(bookData) {
  const { id, title, author, year, isComplete } = bookData;

  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const titleElement = document.createElement('h3');
  titleElement.setAttribute('data-testid', 'bookItemTitle');
  titleElement.classList.add('judul-buku');
  titleElement.innerText = title;

  const authorElement = document.createElement('p');
  authorElement.setAttribute('data-testid', 'bookItemAuthor');
  authorElement.classList.add('penulis');
  authorElement.innerText = `Penulis: ${author}`;

  const yearElement = document.createElement('p');
  yearElement.setAttribute('data-testid', 'bookItemYear');
  yearElement.classList.add('tahun');
  yearElement.innerText = `Tahun: ${year}`;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-set-container');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.classList.add('mark-completed');
  toggleButton.innerText = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.onclick = () => toggleBookStatus(id);

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.classList.add('delete-book-list');
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="#ffffff">
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z"/>
    </svg>
    Hapus Buku`;
  deleteButton.onclick = () => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      removeBook(id);
    }
  };

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.classList.add('edit-book');
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
    Edit Buku`;
  editButton.onclick = () => {
    const newTitle = prompt('Masukkan judul baru:', title);
    const newAuthor = prompt('Masukkan penulis baru:', author);
    const newYear = parseInt(prompt('Masukkan tahun baru:', year));

    if (newTitle && newAuthor && newYear) {
      editBook(id, {
        title: newTitle,
        author: newAuthor,
        year: newYear
      });
    }
  };

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookContainer.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookContainer;
}

function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  if (incompleteBookshelfList) {
    incompleteBookshelfList.innerHTML = '';
  }
  if (completeBookshelfList) {
    completeBookshelfList.innerHTML = '';
  }

  const incompletedBooks = books.filter(book => !book.isComplete);
  const completedBooks = books.filter(book => book.isComplete);

  if (incompletedBooks.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-state');
    emptyMessage.innerHTML = 'Belum ada buku yang ditambahkan';
    incompleteBookshelfList?.appendChild(emptyMessage);
  } else {
    for (const book of incompletedBooks) {
      const bookElement = createBookElement(book);
      incompleteBookshelfList?.append(bookElement);
    }
  }

  if (completedBooks.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-state');
    emptyMessage.innerHTML = 'Belum ada buku yang selesai dibaca';
    completeBookshelfList?.appendChild(emptyMessage);
  } else {
    for (const book of completedBooks) {
      const bookElement = createBookElement(book);
      completeBookshelfList?.append(bookElement);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const bookForm = document.getElementById('bookForm');

  bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    bookForm.reset();
  });

  document.addEventListener("ondatachanged", () => {
    renderBooks();
  });

  document.addEventListener("ondataloaded", () => {
    renderBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function showNewBookForm() {
  const newBookButton = document.querySelector('.add-new-book-button');
  const newBookContainer = document.querySelector(".new-book-form");

  newBookButton.addEventListener("click", () => {
    newBookContainer.classList.toggle('toggle');
  });
}

showNewBookForm();