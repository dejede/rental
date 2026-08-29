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

function generateNotaPDF() {
    const unit = document.getElementById('unitPilihanHidden').value;
    const nama = document.getElementById('namaPenyewa').value;
    const durasi = document.getElementById('durasi').value || 1;
    const jaminan = document.getElementById('jaminan').value || '-';

    if (!unit || keranjang.length === 0) {
        alert('Silakan pilih minimal 1 unit dari katalog dan isi formulir pemesanan terlebih dahulu!');
        return;
    }

    if (!nama) {
        alert('Silakan isi Nama Lengkap penyewa terlebih dahulu!');
        document.getElementById('namaPenyewa').focus();
        return;
    }

    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    document.getElementById('notaTanggal').innerText = today;
    document.getElementById('notaNamaPenyewa').innerText = nama;
    document.getElementById('notaJaminan').innerText = jaminan;
    document.getElementById('notaDurasi').innerText = durasi;
    document.getElementById('sigPenyewa').innerText = nama;

    const tbody = document.getElementById('notaTableBody');
    tbody.innerHTML = '';

    let totalSemua = 0;
    keranjang.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah * parseInt(durasi);
        totalSemua += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${item.jumlah * parseInt(durasi)} Hari</td>
            <td>${item.nama}</td>
            <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
        `;
        tbody.appendChild(row);
    });

    for (let i = keranjang.length; i < 4; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center; color: transparent;">${i + 1}</td>
            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
        `;
        tbody.appendChild(row);
    }

    document.getElementById('notaGrandTotal').innerText = 'Rp ' + totalSemua.toLocaleString('id-ID');
    document.getElementById('notaModal').style.display = 'flex';
}

function closeNotaModal() {
    document.getElementById('notaModal').style.display = 'none';
}

function printNotaPDF() {
    const printContents = document.getElementById('notaPrintArea').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nota Pembayaran - Dejede Rental</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #000; }
                .nota-sheet { background: #ffffff; padding: 20px; border: 2px solid #000; max-width: 700px; margin: 0 auto; }
                .nota-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .nota-brand-info h2 { font-size: 22px; font-weight: 900; margin: 0 0 2px 0; }
                .nota-brand-info p { font-size: 11px; color: #555; margin-bottom: 8px; }
                .nota-badge { background: #000; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 10px; display: inline-block; font-weight: 600; }
                .nota-meta { text-align: right; font-size: 12px; line-height: 1.4; }
                .nota-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                .nota-table th, .nota-table td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
                .nota-table th { background: #f2f2f2; font-size: 11px; font-weight: bold; text-align: center; }
                .nota-footer-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 15px; gap: 15px; }
                .nota-warning { border: 1.5px solid #000; padding: 8px 10px; width: 50%; font-size: 10px; }
                .nota-signatures { display: flex; gap: 20px; width: 50%; justify-content: flex-end; text-align: center; font-size: 11px; }
                .sig-box { width: 110px; }
                .nota-bottom-note { text-align: center; font-size: 10.5px; font-weight: bold; margin-top: 20px; border-top: 1px dashed #000; padding-top: 8px; }
            </style>
        </head>
        <body>
            <div class="nota-sheet">${printContents}</div>
            <script>window.onload = function() { window.print(); window.close(); };<\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

async function downloadNotaJPEG() {
    const element = document.getElementById('notaPrintArea');
    if (!element) return;
    
    const modal = document.getElementById('notaModal');
    const wasHidden = modal.style.display !== 'flex';
    if (wasHidden) {
        modal.style.display = 'flex';
    }

    try {
        // Beri waktu render DOM & pastikan gambar termuat
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff'
        });
        
        const image = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        
        const namaPenyewa = document.getElementById('notaNamaPenyewa')?.innerText || 'Rental';
        link.download = `Nota-Dejede-${namaPenyewa.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
        link.href = image;
        link.click();
    } catch (error) {
        console.error('Gagal mendownload JPEG:', error);
        alert('Gagal mengunduh JPEG. Pastikan file logo di folder assets dapat diakses.');
    } finally {
        if (wasHidden) {
            modal.style.display = 'none';
        }
    }
}
