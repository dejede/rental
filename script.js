let keranjang = [];

// Fungsi untuk mengganti halaman dengan animasi
function switchPage(pageId, event) {
    // Sembunyikan semua halaman
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active-page');
    });

    // Hilangkan kelas active dari semua tombol navigasi
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }

    // Berikan kelas active pada tombol yang diklik
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function tambahKeKeranjang(namaUnit, harga) {
    const index = keranjang.findIndex(item => item.nama === namaUnit);
    if (index !== -1) {
        keranjang[index].jumlah += 1;
    } else {
        keranjang.push({ nama: namaUnit, harga: harga, jumlah: 1 });
    }
    
    updateTampilanKeranjang();
    
    // Pastikan user berada di halaman home (katalog & form) saat menambah produk
    switchPage('home');
    document.querySelector('.nav-btn').classList.add('active');
}

function hapusDariKeranjang(index) {
    keranjang.splice(index, 1);
    updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
    const listContainer = document.getElementById('listKeranjang');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';

    if (keranjang.length === 0) {
        listContainer.innerHTML = '<p class="cart-placeholder">Belum ada unit dipilih.</p>';
        document.getElementById('totalBiaya').innerText = 'Rp 0';
        document.getElementById('unitPilihanHidden').value = '';
        return;
    }

    let totalSemua = 0;
    let ringkasanTeks = [];

    keranjang.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah;
        totalSemua += subtotal;
        ringkasanTeks.push(`${item.nama} (${item.jumlah}x)`);

        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 5px; background: #f9f9f9; border-radius: 4px;";
        itemDiv.innerHTML = `
            <span style="font-size:0.75rem;">${item.nama} (${item.jumlah}x)</span>
            <button type="button" onclick="hapusDariKeranjang(${index})" style="background: #e74c3c; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">Hapus</button>
        `;
        listContainer.appendChild(itemDiv);
    });

    const durasiInput = document.getElementById('durasi');
    const durasi = durasiInput ? (durasiInput.value || 1) : 1;
    const grandTotal = totalSemua * durasi;

    document.getElementById('totalBiaya').innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
    document.getElementById('unitPilihanHidden').value = ringkasanTeks.join(', ');
}

function hitungTotal() {
    updateTampilanKeranjang();
}

function kirimKeWhatsApp(event) {
    event.preventDefault();

    const unit = document.getElementById('unitPilihanHidden').value;
    const nama = document.getElementById('namaPenyewa').value;
    const wa = document.getElementById('waPenyewa').value;
    const durasi = document.getElementById('durasi').value;
    const jaminan = document.getElementById('jaminan').value;
    const total = document.getElementById('totalBiaya').innerText;

    if (!unit) {
        alert('Silakan pilih minimal 1 unit kamera, iPhone, atau lensa terlebih dahulu dari katalog!');
        return;
    }

    const nomorAdmin = "6285236578999";

    const pesan = `Halo Admin Dejede Rental, saya ingin menyewa beberapa unit dengan detail berikut:

* Unit Dipilih: ${unit}
* Nama Penyewa: ${nama}
* No. WhatsApp: ${wa}
* Durasi Sewa: ${durasi} Hari
* Jaminan: ${jaminan}
* Estimasi Total: ${total}

Mohon ketersediaan unit dan informasi tahap selanjutnya. Terima kasih!`;

    const urlWhatsApp = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWhatsApp, '_blank');
}
// Tambahkan fungsi JavaScript ini di file script.js
function hitungDendaOtomatis() {
    const totalSewa = parseFloat(document.getElementById('totalSewa').value) || 0;
    const jamTerlambat = parseFloat(document.getElementById('jamTerlambat').value) || 0;
    
    // Perhitungan matematis: 5% dari total sewa dikali jumlah jam keterlambatan
    const dendaPerJam = totalSewa * 0.05;
    const totalDenda = dendaPerJam * jamTerlambat;

    document.getElementById('hasilDenda').innerText = 'Rp ' + totalDenda.toLocaleString('id-ID');
}

// Tambahkan fungsi JavaScript ini ke file script.js Anda
function openModal(imgElement, title, description) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    modal.style.display = 'flex';
    modalImg.src = imgElement.src;
    modalTitle.innerText = title;
    modalDesc.innerText = description;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}
