# BOWLING — dari BASIC 1986 ke web

| | |
|---|---|
| Sumber | `run/BOWLING.BAS` — public domain / listing majalah |
| Tahun | 1986 |
| Ukuran asli | **75 baris** — terpendek di Sesi 7 |
| Hasil port | [`../games/bowling/`](../games/bowling/index.html) |
| Analisis BASIC | [`../../reviews/BOWLING.md`](../../reviews/BOWLING.md) |

Tujuh puluh lima baris, dan **paling padat pelajarannya di antara semua yang
sudah diport**. Ia memakai tiga pola khas BASIC sekaligus — dan ketiganya sudah
punya nama di [fondasi](_fondasi.md), satu sebagai teladan, satu sebagai
peringatan, satu sebagai kejutan.

---

## 1 · Layar sebagai struktur data

```basic
570 IF SCREEN(V,H)=234 THEN J=J+1 ELSE 610
590 X1=X1+D:X2=X2+1:IF SCREEN(X1,X2)=234 THEN
    LOCATE X1,X2:PRINT " ";:J=J+1:SOUND 74,0.5:GOTO 590
```

**Program ini tidak menyimpan di mana pinnya berada.**

Untuk mengetahui apakah bola mengenai pin, ia membaca kembali layar:
`SCREEN(V,H)` mengembalikan kode karakter pada baris V kolom H, dan 234 adalah
karakter pin (Ω). Menjatuhkan pin berarti `PRINT " "` di posisi itu.

Tampilan **adalah** keadaan permainannya. Tidak ada larik pin, tidak ada daftar
— satu-satunya catatan tentang pin mana yang masih berdiri adalah piksel di
layar.

Fondasi §8 menyebut ini sebagai contoh utama dari aturan yang **tidak** boleh
ditiru, dan di sinilah programnya.

### Kenapa orang menulisnya begini

Bukan kemalasan. Di 1986, layar teks adalah struktur data yang paling murah
yang tersedia:

- sudah ada, tanpa `DIM`
- sudah dua dimensi, dengan alamat `(baris, kolom)`
- **bisa dibaca maupun ditulis** — `SCREEN()` dan `PRINT`
- tidak memakan satu byte pun dari 64 KB yang tersedia

`DIM PIN(10)` justru terasa boros: menyimpan hal yang sudah tersimpan.

### Harganya

Harganya tidak terlihat sampai sesuatu berubah:

| Yang berubah | Yang rusak |
|---|---|
| Warna latar pin | Tidak ada — `SCREEN()` membaca karakter, bukan warna |
| Geser tata letak dua baris | Semua koordinat pin salah |
| Ganti karakter pin | Perbandingan `=234` gagal, semua lemparan jadi meleset |
| Jendela di atasnya | Pin "hilang" dari permainan |

Yang paling halus: **aturan permainan dan tata letak layar jadi satu benda.**
Tidak ada tempat di program ini yang bisa Anda baca untuk menjawab "pin mana
yang masih berdiri?" tanpa juga mengetahui di mana pin digambar.

> **Pelajaran.** Pertanyaan yang membedakan keduanya sederhana: *kalau
> tampilannya diganti seluruhnya, berapa banyak logika yang ikut ditulis
> ulang?* Jawaban yang sehat adalah "nol".

Di port ini pin adalah data — `PINS` dengan nomor, baris, dan kolom — dan layar
digambar darinya. Halamannya menyediakan tombol untuk menampilkan datanya
berdampingan dengan lintasannya, supaya bedanya terlihat, bukan cuma dibaca.

---

## 2 · Satu `PRINT` menggambar sepuluh pin

```basic
1001 DATA 234,31,29,29,234,31,29,29,234,28
1002 DATA 234,31,29,29,29,29,234,28,234,31
1003 DATA 29,29,234,28,234,31,29,29,234,31,234

400 FOR I=1 TO 31:READ PC:PRINT CHR$(PC);:NEXT :RESTORE
```

Tiga puluh satu angka, satu perulangan — tapi hanya **sepuluh** di antaranya
yang berupa pin. Sisanya perintah gerak kursor:

| Kode | | Arti |
|---|---|---|
| `234` | Ω | gambar satu pin |
| `31` | ↓ | kursor turun |
| `29` | ← | kursor kiri |
| `28` | → | kursor kanan |

Bentuk dua dimensi disimpan sebagai **deret satu dimensi berisi "gambar" dan
"pindah"**. Itu *escape sequence*, dan prinsipnya masih hidup: `\033[2J` yang
membersihkan terminal Unix hari ini bekerja persis begitu.

Pola ini adalah yang **ditiru** proyek ini — semangat "rakit sekali, gambar
berkali-kali" ada di `_shared/svg.js`, dan contoh lain di koleksi adalah gambar
dadu `CRAPS.BAS`.

Perhatikan juga `RESTORE` di ujung baris 400: penunjuk `DATA` dikembalikan ke
awal supaya rak pin bisa digambar lagi di lemparan berikutnya. Bandingkan
dengan [MAZE](maze.md), yang justru mengandalkan penunjuk itu **maju** untuk
memilih labirin.

---

## 3 · Skor boling sebagai mesin keadaan — dan bug saya sendiri

```basic
450 ON S(Z9) GOSUB 680,700,720,740,760

680 IF J1=10 THEN IF PS THEN S=2 ELSE S=5
700 T=T+J:IF J=10 THEN S=3 ELSE S=4
720 T=T+J*2:IF J<>10 THEN S=4
740 T=T+J:IF J1=10 THEN S=5 ELSE S=1
760 T=T+J:IF J=10 THEN S=2 ELSE S=1
```

Skor boling hampir selalu dijelaskan sebagai **melihat ke depan**: nilai sebuah
strike baru diketahui setelah dua lemparan berikutnya.

Program ini tidak pernah melihat ke depan. Ia menyimpan **satu angka** per
pemain, dan tiap lemparan memutakhirkannya:

| S | Arti |
|--:|---|
| 1 | frame biasa, belum ada bonus berjalan |
| 2 | bonus strike, lemparan bonus pertama |
| 3 | dua strike berturut-turut — lemparan ini dihitung ganda |
| 4 | bonus strike, lemparan bonus kedua |
| 5 | bonus spare |

Lima keadaan, dan itu cukup untuk seluruh aturan boling. Bonus dibayar **saat
lemparannya terjadi**, bukan dihitung mundur belakangan.

### Yang saya salah

Versi pertama port ini memakai mesin keadaan itu untuk menjumlah, dan saya
mengujinya dengan permainan yang nilainya sudah diketahui:

| Kasus | Hasil saya | Seharusnya |
|---|--:|--:|
| Permainan sempurna (12 strike) | **330** | 300 |
| Semua spare 5-5, bonus 5 | **155** | 150 |
| Sembilan lalu meleset ×10 | 90 | 90 |
| Satu strike lalu 3 dan 4 | 24 | 24 |

Kelebihan **tepat 30** pada permainan sempurna.

Yang salah bukan mesin keadaannya — melainkan penyederhanaan saya. Aslinya
punya cabang khusus untuk frame kesepuluh:

```basic
270 IF Q=10 THEN ON S GOTO 280,310,310,280,340
```

Lemparan bonus di frame sepuluh **bukan frame baru**; ia hanya membayar bonus
frame sebelumnya. Saya membuang cabang itu, sehingga dua lemparan terakhir
dihitung sebagai frame penuh **dan** sebagai bonus.

Perbaikannya: total dihitung dengan algoritma baku dari daftar lemparan mentah,
dan mesin keadaannya tetap **ditampilkan** sebagai mekanisme aslinya.

```js
function scoreGame(pins) {
  let t = 0, i = 0;
  for (let f = 0; f < 10; f++) {
    const a = pins[i] || 0, b = pins[i + 1] || 0, c = pins[i + 2] || 0;
    if (a === 10) { t += 10 + b + c; i += 1; }
    else if (a + b === 10) { t += 10 + c; i += 2; }
    else { t += a + b; i += 2; }
  }
  return t;
}
```

Lolos delapan kasus uji, termasuk strike dan spare di frame kesepuluh.

> **Pelajaran.** Kedua bentuk itu menghitung hal yang sama, tapi **tidak sama
> mudahnya ditulis benar.** Mesin keadaan menyimpan konteks di sebuah variabel,
> jadi tiap kasus khusus harus ditambahkan sebagai cabang. Bentuk baku membaca
> ke depan dari daftar, jadi frame kesepuluh — yang memuat lemparan bonusnya
> sendiri — tidak butuh perlakuan khusus sama sekali.
>
> Mesin keadaan menang di memori; daftar menang di kemungkinan salah. Di 1986
> pilihan pertama tidak terhindarkan.

---

## 4 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala | Bentuk sekarang & alasannya |
|---|---|---|---|
| Pin | Karakter di layar, dibaca `SCREEN()` | Memori | **Data**, dan layar digambar darinya (§1) |
| Rak pin | 31 angka escape sequence | Satu `PRINT` lebih cepat dari sepuluh | SVG; teknik aslinya dijelaskan, tidak ditiru harfiah |
| Skor | Mesin keadaan lima langkah | Tidak ada larik riwayat | Algoritma baku; mesin keadaan tetap ditampilkan (§3) |
| Bidikan | Penunjuk berayun, `WHILE INKEY$=""` | — | Dipertahankan — ini yang membuatnya permainan keterampilan |
| Bentuk penunjuknya | `>` yang berpindah baris | Layar teks | **Pelempar yang melangkah** — lihat di bawah |
| Kesulitan | `FOR I=1 TO DIFLVL:NEXT` | Tidak ada pewaktu | Penggeser kecepatan; lihat [fondasi §2.2](_fondasi.md) |
| Sebaran pin | Menyerong ke depan-atas dan depan-bawah (baris 580–600) | — | Dipertahankan persis |
| Bunyi | `SOUND 37` bola, `SOUND 74` pin | — | Dipertahankan |
| Pemain | 1–4, nama diketik | Satu mesin dipakai bergantian | Satu pemain; nama tidak ditanyakan |
| Panel "Cara bermain" | **tidak ada** | — | Ditambahkan. Satu-satunya dari tiga program yang panelnya benar-benar baru, bukan dikembalikan |

Perbandingan yang layak dicatat: [HIQUE2](hique2.md) dan [MASTER](master.md)
sama-sama punya layar petunjuk di aslinya, dan port pertamanya menghapus
keduanya. BOWLING.BAS memang tidak punya — ia langsung masuk permainan. Jadi
dari tiga panel yang ditambahkan belakangan, **dua adalah regresi yang
diperbaiki dan hanya satu yang betul-betul tambahan.** Kecenderungan port ini
bukan menyederhanakan aturan; ia melupakan bahwa aturannya pernah dijelaskan.

### Dari segitiga jadi orang

Penunjuk bidik aslinya karakter `>` yang berpindah baris (baris 510–530).
Port ini pertama menggambarnya sebagai **segitiga amber** — setia pada
bentuknya. Tapi bentuk bukan arti. Yang bergerak naik-turun mencari jalur di
pangkal lintasan bukan sebuah panah; itu **orang yang memilih tempat
berdiri**. Segitiga membuat layar terbaca sebagai "penunjuk yang harus
disejajarkan"; orang yang melangkah membuatnya terbaca sebagai apa yang
sebenarnya terjadi.

Perubahannya butuh tiga putaran, dan tiap putaran mengajarkan hal berbeda.

**Putaran 1 — anatomi yang benar, layar yang gagal.** Digambar dari samping,
bola di tangan yang terjulur rendah seperti sesaat sebelum lepas. Di lebar
kolom yang ada, lintasan ini dirender sekitar **0,84×** ukuran viewBox-nya,
jadi seluruh orangnya cuma setinggi ~28px. Pada ukuran itu lengan terjulur
dan kaki melangkah berebut ruang yang sama, dan hasilnya gumpalan.

**Putaran 2 — sikap awalan.** Bola dipegang **dua tangan setinggi dada**.
Bentuknya jadi piktogram: kepala, bola, dua kaki — dan ketiganya tidak pernah
saling tumpang tindih, jadi ia tetap terbaca saat kecil. Sikap ini juga yang
paling dikenali orang sebagai "boling", lebih daripada saat lepas. Ia
sekaligus menyelesaikan soal ruang: badannya menjulur ~19 satuan ke atas garis
bidik alih-alih ~28, jadi baris paling atas berhenti memotong kepalanya.
`viewBox` ditinggikan dari 240 jadi 260 untuk sisanya.

**Putaran 3 — warna.** Putaran 2 masih satu warna (amber), meneruskan warna
segitiga yang digantikannya. Siluet satu warna setinggi ~38px **tidak terbaca
sebagai orang** — ia terbaca sebagai coretan.

> **Pelajaran.** Yang membuat mata mengenali orang bukan bentuk luarnya,
> melainkan **batas antar bagian**: rambut lawan kulit, kulit lawan lengan
> baju, celana lawan sepatu. Batas itu butuh warna yang berbeda. Menambah
> detail geometri pada siluet satu warna tidak menolong sama sekali — detailnya
> ada, tapi tidak ada yang memisahkannya.

Arti "milik Anda" yang dulu dibawa warna amber sekarang dibawa **bajunya** —
bidang terbesar, tetap amber. Bolanya tetap hijau fosfor, karena bola di
tangan dan bola yang menggelinding harus terbaca sebagai benda yang sama.
Warnanya ditulis mutlak, bukan lewat token tema, karena pelemparnya selalu
berdiri di atas `.b-gutter` yang gelap di kedua tema.

**Langkah kakinya dibangkitkan dari satu variabel**, bukan dari daftar pose:

```js
const t = stride * Math.PI / 2;   // sin(t) = 0, 1, 0, -1, ...
const swing = Math.sin(t);
g.append(kaki(-swing, '--far'));  // dua kaki, otomatis berlawanan
g.append(kaki(swing, ''));
```

`stride` naik satu tiap kali barisnya berubah, jadi kecepatan langkahnya
selalu sama dengan kecepatan ayunannya: naikkan tingkat kesulitan, dan
langkahnya ikut cepat tanpa satu pun angka waktu ditulis dua kali. Sepatu
dihitung dari `v` yang sama dengan celananya, jadi sepatunya mustahil lepas
dari kakinya.

**Satu penyimpangan fisika yang disengaja:** bolanya **tidak ikut mengayun**
saat melangkah. Orang sungguhan mengayunkan bolanya. Tapi di sini bola itu
menandai jalur bidik — kalau ia bergerak naik-turun sendiri, ia berbohong
tentang ke mana lemparannya akan pergi. Yang bergerak hanya kaki dan pinggul.

---

## 5 · Latihan

1. **Rusak tata letaknya.** Di kode BASIC-nya, geser rak pin dua kolom ke
   kanan dengan mengubah `LOCATE`. Apa yang terjadi pada deteksi tabrakan?
   Sekarang lakukan hal yang sama di port ini — berapa yang rusak?

2. **Baca rak pinnya.** Terjemahkan ketiga baris `DATA` di §2 dengan tangan:
   gambar di kertas kotak-kotak, ikuti tiap kode sebagai "gambar" atau
   "pindah". Apakah hasilnya segitiga sepuluh pin?

3. **Uji mesin keadaannya.** Terapkan kelima keadaan di §3 apa adanya, lalu
   jalankan atas permainan sempurna. Anda akan mendapat 330. Sekarang tambahkan
   cabang frame kesepuluh — berapa baris yang perlu?

4. **Sebaran yang berbeda.** Baris 580–600 menyebarkan robohnya pin hanya
   menyerong ke depan. Ubah supaya menyebar ke segala arah. Apakah permainannya
   jadi lebih mudah, dan seberapa?

---

Berkas terkait: [mainkan](../games/bowling/index.html) ·
[fondasi §8 — logika terpisah dari tampilan](_fondasi.md) ·
[MAZE — penunjuk `DATA` yang maju](maze.md) ·
[LIFE2 — data sebagai sumber kebenaran](life2.md)
