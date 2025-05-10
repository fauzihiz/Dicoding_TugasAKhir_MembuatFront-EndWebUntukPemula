// Do your work here...
// Fungsi untuk membuat ID unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

// Get Form Element
const form = document.getElementById('bookForm');
const checkbox = document.getElementById('bookFormIsComplete');
const submitBtn = document.getElementById('bookFormSubmit');
const searchForm = document.getElementById('searchBook');
const searchInput = document.getElementById('searchBookTitle');

// Update teks button submit berdasarkan checkbox
function updateSubmitButtonText() {
  const spanText = checkbox.checked ? 'selesai dibaca' : 'Belum selesai dibaca';
  submitBtn.innerHTML = `Masukkan Buku ke rak <span>${spanText}</span>`;
}

checkbox.addEventListener('change', updateSubmitButtonText);

// Submit form: tambah atau edit 
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Mencegah reload halaman

  // Ambil nilai dari input dan checkbox
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = checkbox.checked;
  const editingId = form.getAttribute('data-editing-id');

  // Get data from local storage
  let allBooks = JSON.parse(localStorage.getItem('formData')) || [];

  //check mode update/edit atau mode add
  if (editingId) {
    // Mode Edit
    const index = allBooks.findIndex(item => item.bookId === editingId);
    if (index !== -1) {
      allBooks[index] = { ...allBooks[index], bookTitle, bookAuthor, bookYear, bookIsComplete };
      form.setAttribute('data-editing-id', '');
    }
  } else {
    // Mode Add
    const dataBuku = {
      bookId: generateUniqueId(),
      bookTitle,
      bookAuthor,
      bookYear,
      bookIsComplete
    };
    allBooks.push(dataBuku);
  }

  localStorage.setItem('formData', JSON.stringify(allBooks));

  form.reset();
  updateSubmitButtonText();
  tampilkanData();
});

// Menampilkan daftar buku sesuai status
function tampilkanData(data = null) {
  const dataTersimpan = Array.isArray(data) ? data : JSON.parse(localStorage.getItem('formData')) || [];
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  dataTersimpan.forEach(buku => {
    const el = document.createElement('div');
    el.setAttribute('data-bookid', buku.bookId);
    el.setAttribute('data-testid', 'bookItem');

    el.innerHTML = `
      <h3 data-testid="bookItemTitle">${buku.bookTitle}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${buku.bookAuthor}</p>
      <p data-testid="bookItemYear">Tahun: ${buku.bookYear}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${buku.bookIsComplete ? 'Belum dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Button Toggle selesai/belum
    el.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
      const books = JSON.parse(localStorage.getItem('formData')) || [];
      const index = books.findIndex(item => item.bookId === buku.bookId);
      if (index !== -1) {
        books[index].bookIsComplete = !books[index].bookIsComplete;
        localStorage.setItem('formData', JSON.stringify(books));
        tampilkanData();
      }
    });

    // Button Delete 
    el.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
      let books = JSON.parse(localStorage.getItem('formData')) || [];
      books = books.filter(item => item.bookId !== buku.bookId);
      localStorage.setItem('formData', JSON.stringify(books));
      tampilkanData();
    });

    // Button Edit
    el.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
      document.getElementById('bookFormTitle').value = buku.bookTitle;
      document.getElementById('bookFormAuthor').value = buku.bookAuthor;
      document.getElementById('bookFormYear').value = buku.bookYear;
      checkbox.checked = buku.bookIsComplete;
      form.setAttribute('data-editing-id', buku.bookId);
      submitBtn.innerHTML = 'Update Data Buku';
    });

    // Masukkan ke rak yang sesuai
    (buku.bookIsComplete ? completeList : incompleteList).appendChild(el);
  });
}

// Search berdasarkan judul
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const keyword = searchInput.value.toLowerCase();
  const books = JSON.parse(localStorage.getItem('formData')) || [];
  const hasil = books.filter(book => book.bookTitle.toLowerCase().includes(keyword));
  tampilkanData(hasil);
});

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanData);