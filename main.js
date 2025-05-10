// Do your work here...
// Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}


const checkbox = document.getElementById('bookFormIsComplete');
const submitBtn = document.getElementById('bookFormSubmit');

// Fungsi untuk update teks tombol
function updateSubmitButtonText() {
  const isChecked = checkbox.checked;
  const spanText = isChecked ? 'selesai dibaca' : 'Belum selesai dibaca';
  submitBtn.innerHTML = `Masukkan Buku ke rak <span>${spanText}</span>`;
}

checkbox.addEventListener('change', updateSubmitButtonText);


// get element form
const form = document.getElementById('bookForm');

// event listener saat form disubmit
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Mencegah reload halaman

  // Ambil nilai dari input dan checkbox
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

  // Baca ulang attribute editingId di sini
  const editingId = form.getAttribute('data-editing-id');

  let allBooks = JSON.parse(localStorage.getItem('formData')) || [];

  if (editingId) {
    // MODE EDIT
    let allBooks = JSON.parse(localStorage.getItem('formData')) || [];
    const index = allBooks.findIndex(item => item.bookId === editingId);
    if (index !== -1) {
      allBooks[index] = {
        ...allBooks[index],
        bookTitle,
        bookAuthor,
        bookYear,
        bookIsComplete
      };
      localStorage.setItem('formData', JSON.stringify(allBooks));
    }
    form.setAttribute('data-editing-id', ''); // Reset form state
  } else {
    // MODE TAMBAH
    const dataBuku = {
      bookId: generateUniqueId(),
      bookTitle,
      bookAuthor,
      bookYear,
      bookIsComplete
    };
    const allBooks = JSON.parse(localStorage.getItem('formData')) || [];
    allBooks.push(dataBuku);
    localStorage.setItem('formData', JSON.stringify(allBooks));
  }

  /* Buat object dari data
  const dataBuku = {
    bookId: generateUniqueId(),
    bookTitle: bookTitle,
    bookAuthor: bookAuthor,
    bookYear: bookYear,
    bookIsComplete: bookIsComplete
  };*/

  // Kosongkan form
  form.reset();
  form.setAttribute('data-editing-id', '');
  updateSubmitButtonText(); // kembalikan ke default


  //Panggil ulang agar data baru muncul
  tampilkanData(); 
});


function tampilkanData() {
  // Ambil data dari localStorage
  const dataTersimpan = JSON.parse(localStorage.getItem('formData')) || [];
  // Ambil elemen tempat menampilkan
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  // Kosongkan dulu
  completeList.innerHTML = '';
  incompleteList.innerHTML = '';

  // map untuk cek isi data dan masukkan ke element html
  dataTersimpan.map((buku) => {
    const el = document.createElement('div');
    el.setAttribute('data-bookid', buku.bookID);
    el.setAttribute('data-testid', 'bookItem');

    /* ${buku.bookIsComplete ? 'Belum dibaca' : 'Selesai dibaca'}
        menentukan tulisan di button sesuai status
    */
    el.innerHTML = `
      <h3 data-testid="bookItemTitle">${buku.bookTitle}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${buku.bookAuthor}</p>
      <p data-testid="bookItemYear">Tahun: ${buku.bookYear}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${buku.bookIsComplete ? 'Belum dibaca' : 'Selesai dibaca'} 
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;


    const toggleBtn = el.querySelector('[data-testid="bookItemIsCompleteButton"]');

    toggleBtn.addEventListener('click', () => {
      // Ambil semua buku dari storage
      const allBooks = JSON.parse(localStorage.getItem('formData')) || [];
    
      // Cari index buku yang cocok
      const index = allBooks.findIndex(item => item.bookId === buku.bookId);
    
      if (index !== -1) {
        // Toggle status
        const updatedStatus = !allBooks[index].bookIsComplete;
        allBooks[index].bookIsComplete = updatedStatus;
    
        // Update localStorage
        localStorage.setItem('formData', JSON.stringify(allBooks));
    
        // Ubah label tombol
        toggleBtn.textContent = updatedStatus ? 'Belum dibaca' : 'Selesai dibaca';
    
        // Pindahkan DOM ke tempat yang sesuai
        const completeList = document.getElementById('completeBookList');
        const incompleteList = document.getElementById('incompleteBookList');
    
        if (updatedStatus) {
          completeList.appendChild(el);
        } else {
          incompleteList.appendChild(el);
        }
      }
    });


    const deleteBtn = el.querySelector('[data-testid="bookItemDeleteButton"]');

    deleteBtn.addEventListener('click', () => {
      // Ambil semua buku
      let allBooks = JSON.parse(localStorage.getItem('formData')) || [];

      // Filter keluar buku yang akan dihapus
      allBooks = allBooks.filter(item => item.bookId !== buku.bookId);

      // Simpan kembali
      localStorage.setItem('formData', JSON.stringify(allBooks));

      // Hapus dari DOM
      el.remove();
    });


    const editBtn = el.querySelector('[data-testid="bookItemEditButton"]');

    editBtn.addEventListener('click', () => {
      // Isi form dengan data buku
      document.getElementById('bookFormTitle').value = buku.bookTitle;
      document.getElementById('bookFormAuthor').value = buku.bookAuthor;
      document.getElementById('bookFormYear').value = buku.bookYear;
      document.getElementById('bookFormIsComplete').checked = buku.bookIsComplete;

      // Tandai ID buku yang sedang diedit
      const form = document.getElementById('bookForm');
      form.setAttribute('data-editing-id', buku.bookId);

      // Ganti tombol menjadi "Update Data Buku"
      submitBtn.innerHTML = 'Update Data Buku';

    });



    // Masukkan ke list sesuai status
    if (buku.bookIsComplete) {
      completeList.appendChild(el);
    } else {
      incompleteList.appendChild(el);
    }   
  });
  };

// Panggil fungsi saat pertama kali halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanData);