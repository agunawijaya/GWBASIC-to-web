# Blackjack Tutor — nasihat yang dihitung, bukan disalin

> Halaman: [`web/games/blackjack-tutor/`](../games/blackjack-tutor/index.html) ·
> Berasal dari: [`web/games/21/`](../games/21/index.html) ·
> Catatan port setianya: [`docs/blackjack.md`](blackjack.md) ·
> Sumber: [`run/21.BAS`](../../run/21.BAS) (336 baris) ·
> Analisis BASIC: [`reviews/21.md`](../../reviews/21.md)

**Ini bukan port.** Ia tidak ada di dalam koleksi 66 program, tidak dihitung di
statistik kemajuan, dan port setia `21.BAS` berdiri sendiri, utuh, di
[`games/21/`](../games/21/index.html) — tidak disentuh sama sekali.

Yang dikerjakan halaman ini satu pertanyaan: **kalau tiap keputusan di meja
disertai alasannya, apa yang sebenarnya sedang diajarkan?**

Jawaban yang mudah adalah menempelkan tabel *basic strategy*. Jawaban itu
salah, dan dokumen ini tentang kenapa.

---

## 1 · Meja ini bukan meja kasino

Tabel *basic strategy* yang beredar di mana-mana disusun untuk satu jenis meja:
blackjack dibayar 3:2, enam dek, sering bandar menambah di 17 lunak. `21.BAS`
bukan meja itu, dan bedanya bisa dibaca langsung dari kodenya:

| | `21.BAS` | meja kasino biasa | baris |
|---|---|---|---|
| Bayaran blackjack | **2 : 1** | 3 : 2 | 860, 1770 (`CSH=CSH+BT*300` lawan `BT*200`) |
| Jumlah dek | 1 | 6–8 | 50 (`DIM DK(52)`) |
| Bandar di 17 lunak | berhenti | sering menambah | 670 (`IF CPHD>16`) |
| Asuransi | tidak ada | ada | — |
| Kocok ulang | sesudah **40** dari 52 kartu | kartu potong | 150 (`IF CD>40`) |

Bayaran 2:1 bukan detail kecil. Ia membalik keunggulan rumah — dan menempelkan
tabel kanonik ke meja ini akan menghasilkan saran yang **salah**, diucapkan
dengan percaya diri, lengkap dengan alasan yang terdengar benar.

Untuk sebuah bahan ajar, itu kegagalan terburuk yang mungkin. Bukan karena
salahnya besar, tapi karena **tidak ada yang akan tahu**.

---

## 2 · Karena itu semuanya dihitung

Tidak ada satu pun tabel keputusan di halaman ini. Yang ada mesin hitung yang
membaca aturan program dan komposisi kartu yang **masih tersisa**, lalu
menjawab pertanyaan yang sama setiap kali: *dari sini, tiap pilihan bernilai
berapa?*

- **Sebaran hasil akhir bandar** — rekursif atas komposisi sisa, memakai aturan
  berhentinya sendiri (`A.bandarH17`, yang untuk 21 bernilai `false`).
- **Nilai harapan BERHENTI** — langsung dari sebaran itu.
- **Nilai harapan TAMBAH** — rekursif, dengan kelanjutan optimal di tiap
  simpul, bukan "tambah sekali lalu berhenti".
- **Nilai harapan GANDAKAN** — tepat satu kartu lalu wajib berhenti, taruhan
  dua kali.

Keempatnya **eksak**. Satu yang tidak: **PECAH** dihitung sebagai dua tangan
bebas tanpa pecah ulang dan tanpa memperhitungkan bahwa keduanya berbagi
sepatu yang sama. Hampiran itu ditandai bintang **di layar**, bukan disembunyikan
di catatan kaki.

Karena angkanya datang dari kartu yang tersisa, **sarannya bisa berubah di
akhir sepatu**. Pada satu dek yang sudah berjalan 40 kartu, itu bukan hiasan.

---

## 3 · Tiga cacat, dan tidak satu pun memberi galat

Ini bagian yang paling layak dibaca, karena ketiganya jenis kegagalan yang sama:
**mesin hitung yang keliru tidak berhenti bekerja. Ia terus memberi nasihat,
dengan angka meyakinkan di belakangnya.**

### Cacat 1 — bandar yang blackjack, yang tidak mungkin ada

Baris 230–240 `21.BAS`:

```basic
230 IF CP(1)=10 AND CP(2)=1 THEN BJK1=1:GOTO 710
240 IF CP(2)=10 AND CP(1)=1 THEN BJK1=1:GOTO 710
```

Bandar yang blackjack menang **seketika**, sebelum pemain sempat menambah,
menggandakan, atau memecah. Jadi pada saat pemain memutuskan, keadaan itu
**sudah tersaring keluar** — ia tidak lagi mungkin.

Versi pertama mesin ini tidak menyaringnya, jadi taruhan ganda dan pecah
dibebani kekalahan dua satuan melawan sesuatu yang tidak akan pernah terjadi.

**Gejalanya:** PECAH 8,8 lawan kartu buka 10 keluar sebagai pilihan
**terburuk** — padahal setiap tabel blackjack yang pernah diterbitkan
mengatakan *selalu pecah delapan*.

| | sebelum | sesudah |
|---|---|---|
| PECAH | −0,576 (terburuk) | **−0,463 (terbaik)** |
| TAMBAH | −0,545 | −0,512 |
| BERHENTI | −0,558 | −0,518 |

Perbaikannya: hitung sebaran bandar **dengan syarat bandar tidak blackjack**,
lalu normalkan ulang.

### Cacat 2 — kartu potong yang mengeluarkan kartu dari dek

Getter komposisi menghitung sisa kartu hanya sampai **kartu potong**, bukan
sampai akhir dek. Padahal kartu potong cuma memicu kocok ulang; ia tidak
mengeluarkan kartu dari dek.

**Gejalanya:** hitungan Hi-Lo menunjukkan **−2 pada dek yang masih utuh** —
sebelas kartu di belakang kartu potong dikira sudah keluar.

### Cacat 3 — penasihat yang mengintip

`meja.bandarKartu` memuat **kartu tertutup** juga. Memberikannya ke mesin
hitung membuat penasihatnya melihat sesuatu yang pemain tidak lihat.

**Gejalanya:** *"peluang bandar bangkrut: 0%"* dengan nilai harapan BERHENTI
tepat **−1,000** — karena total akhir bandar sudah pasti diketahui.

Perbaikannya dua bagian, dan bagian kedua mudah terlewat: penasihat hanya boleh
melihat **kartu buka** — dan kartu tertutup itu, karena sudah keluar dari dek
tapi belum terlihat pemain, harus **dikembalikan** ke kumpulan yang belum
diketahui. Kalau tidak, peluangnya dihitung atas dek yang salah.

---

## 4 · Bagaimana ia diperiksa

Dua lapis, dan lapis pertama tidak bergantung pada tabel siapa pun.

**Sebaran bandar** dibandingkan dengan angka terbitan untuk satu dek, bandar
berhenti di 17 lunak. Tiap sebaran juga diperiksa berjumlah tepat 1:

| kartu buka | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | As |
|---|---|---|---|---|---|---|---|---|---|---|
| peluang bangkrut | 35,3% | 37,6% | 40,3% | 42,9% | 42,1% | 26,0% | 23,9% | 23,3% | 21,4% | 11,7% |

**Keputusannya** diadu dengan tabel satu dek S17 yang diterbitkan:

| keadaan | mesin ini | tabel |
|---|---|---|
| 8,8 lawan 10 | PECAH | pecah |
| A,A lawan 10 | PECAH | pecah |
| 10,10 lawan 6 | BERHENTI | jangan pernah pecah sepuluh |
| 11 lawan 10 | GANDAKAN | gandakan |
| 11 lawan As | GANDAKAN | gandakan |
| 16 lawan 10 | TAMBAH | tambah |
| A,7 lawan 9 | TAMBAH | tambah |
| A,7 lawan 8 | BERHENTI | berhenti |

Satu hasil **berbeda** dari tabel biasa, dan itu benar: **12 lawan 4 keluar
sebagai TAMBAH** (−0,194 lawan −0,212 untuk berhenti). Tabel total-dependen
mengatakan berhenti; tapi tangan itu tersusun dari 10+2, dan mengeluarkan satu
dua dari dek satu-dek menggeser jawabannya. Itu pengecualian
*composition-dependent* yang memang terdokumentasi — dan ia muncul sendiri di
sini justru karena tidak ada tabel yang disalin.

---

## 5 · Bentuk nasihatnya

**Tiga lapis**, karena satu kalimat saja mudah dihafal tanpa dimengerti:

1. Kalimat biasa — *"Bandar besar kemungkinan bangkrut sendiri — biarkan."*
2. Angka di baliknya — *"Peluang bandar bangkrut: 42%."*
3. Tabel nilai harapan tiap pilihan, yang terbaik disorot.

**Dua arah**, keduanya aktif sekaligus:

- **SARAN** muncul sebelum Anda menekan tombol.
- **PENILAIAN** muncul sesudahnya: tepat atau tidak, dan kalau tidak, **berapa
  satuan taruhan yang terlepas**.

Ada saklar *sembunyikan saran sampai saya memutuskan* — untuk yang mau menguji
diri dulu, bukan karena mode itu lebih baik.

**Catatan berjalan** menyimpan dua angka: keputusan optimal dari total
keputusan, dan **ongkos kekeliruan** dalam satuan taruhan. Angka kedua lebih
jujur daripada yang pertama: melewatkan satu keputusan yang selisihnya 0,002
tidak sama dengan melewatkan yang selisihnya 0,3.

Ditambah **sisa kartu** dan **hitungan berjalan Hi-Lo**, karena keduanya yang
membuat sarannya berubah — dan tombol **Mulai ulang** untuk mengocok dari awal.

---

## 6 · Temuan sampingan tentang port 21

Saat menyalin objek aturannya, satu beda muncul: `21.BAS` mengocok ulang
sesudah **40** kartu (baris 150 `IF CD>40`), sementara
[`games/21/`](../games/21/index.html) memakai `potong: null` — yang berarti
baru mengocok saat kelima puluh dua kartu habis. `docs/blackjack.md` juga
mencatat kartu potongnya sebagai tidak ada.

Halaman ini memakai yang 40, karena seluruh nasihatnya dihitung dari sisa kartu
dan titik kocok ulang menentukan seberapa jauh komposisinya boleh menyimpang.

**Port 21 sengaja tidak diubah.** Ia bukan milik pekerjaan ini, dan mengubah
halaman lain diam-diam sambil membangun yang baru adalah cara paling rapi untuk
merusak dua-duanya sekaligus.

---

## 7 · Kenapa ia di EXTRAS

Sama alasannya dengan [ASCII Studio](draw-studio.md) dan
[Free Play](freeplay.md): ia bukan salah satu dari 83 program BASIC itu. Angka
"66 dari 66" dihitung dari `CATALOG` saja, dan memasukkan halaman ini ke sana
akan membuat statistik kemajuan seluruh proyek salah.

Satu perubahan menyentuh berkas bersama: `_shared/blackjack.js` mendapat
beberapa getter **baca-saja** (`fase`, `tangan`, `bandarKartu`, `komposisi`).
Murni penambahan — keempat halaman blackjack yang sudah ada tidak memanggil
satu pun, jadi tidak ada yang berubah bagi mereka.

---

## 8 · Latihan

1. Sebaran bandar dihitung ulang dari nol tiap kali sebuah pilihan dinilai.
   Sebutkan satu keadaan di mana hasilnya **berbeda** untuk dua pilihan di
   tangan yang sama, dan terangkan kenapa.
2. Cacat 1 membuat PECAH tampak buruk. Apakah ia juga memengaruhi GANDAKAN?
   Ke arah mana, dan kenapa besarnya tidak sama?
3. Hampiran PECAH mengabaikan bahwa kedua tangan berbagi sepatu. Perkirakan
   arah biasnya — terlalu tinggi atau terlalu rendah — dan susun satu keadaan
   yang membuat biasnya paling besar.
4. Bayaran blackjack 2:1 tidak muncul di satu pun tabel nilai harapan di
   halaman ini. Terangkan kenapa itu benar, lalu sebutkan satu keputusan yang
   **akan** berubah kalau bayarannya 3:2.
5. Hitungan Hi-Lo ditampilkan tapi tidak pernah dipakai mesin hitungnya.
   Terangkan kenapa menambahkannya tidak akan memperbaiki sarannya sedikit pun.
