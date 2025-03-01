function showNewBookForm() {
    const newBookButton = document.querySelector('.add-new-book-button');
  const newBookContainer = document.querySelector(".new-book-form");

  newBookButton.addEventListener("click", () => {
    newBookContainer.classList.toggle('toggle');
  });
}

showNewBookForm()