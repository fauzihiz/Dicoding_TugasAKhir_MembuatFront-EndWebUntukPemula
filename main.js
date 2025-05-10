// Do your work here...
// Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

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

  // Buat object dari data
  const dataBuku = {
    bookId: generateUniqueId(),
    bookTitle: bookTitle,
    bookAuthor: bookAuthor,
    bookYear: bookYear,
    bookIsComplete: bookIsComplete
  };

  // Cek apakah ada data lama di localStorage
  let dataBookshelf = JSON.parse(localStorage.getItem('formData')) || [];

  // Tambahkan data baru ke array
  dataBookshelf.push(dataBuku);

  // Simpan ke localStorage
  localStorage.setItem('formData', JSON.stringify(dataBookshelf));

  // Kosongkan form
  form.reset();

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

    // Masukkan ke list sesuai status
    if (buku.bookIsComplete) {
      completeList.appendChild(el);
    } else {
      incompleteList.appendChild(el);
    }
  });
}

// Panggil fungsi saat pertama kali halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanData);