# CRAPS — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/CRAPS.BAS` — "Nevada Dice" |
| Penerbit | Friendlyware, 1982 |
| Ukuran asli | 254 baris |
| Hasil port | [`../games/craps/`](../games/craps/index.html) |
| Analisis BASIC | [`../../reviews/CRAPS.md`](../../reviews/CRAPS.md) |
| Peran | pengguna kedua `_shared/dice.js` sesudah [YAHTZEE](yahtzee.md) |

Craps kasino, aturannya benar, dan tiga hal di bawahnya masing-masing layak
dibaca sendiri: cara menggambar dadu yang brilian, cara mengacak yang
menghancurkan permainannya, dan satu daftar harga barang yang lebih jujur
daripada seluruh sisa program.

---

## 1 · Sebuah dadu disimpan sebagai satu string — termasuk gerak kursornya

```basic
1420 A1=CHR$(201)+STRING$(2,205)+CHR$(187)+CHR$(31)+STRING$(4,29)+CHR$(186)+STRING$(2,28)+CHR$(186)+CHR$(31)+STRING$(4,29)+CHR$(200)+STRING$(2,205)+CHR$(188)
```

Seratus lima puluh tujuh kolom, tanpa satu pun komentar. Dan ini bukan sekadar
sambungan karakter.

`CHR$(31)` adalah **kursor turun**. `CHR$(29)` adalah **kursor kiri**. Keduanya
karakter kendali, bukan karakter yang tampil. Jadi string ini, saat
di-`PRINT`, **menggerakkan kursornya sendiri** turun dan mundur, lalu
menggambar kotak **dua dimensi** dari satu perintah tunggal.

Namanya sekarang *escape sequence*, dan itulah cara kerja `\033[2J` di terminal
Unix sampai hari ini. Prinsipnya persis sama, hanya dengan kode karakter CP437.

### Dua jawaban berlawanan untuk soal yang sama

| Program | Cara | Untuk berapa gambar |
|---|---|---|
| **CRAPS** | gambar jadi, satu `PRINT` | 6 |
| [CRAZY8](crazy8.md) | dirakit dari data ke `FIG$(5,5)`, 25 `LOCATE`+`PRINT` | 52 |

Dan **keduanya benar untuk kebutuhannya sendiri.** CRAPS cuma punya enam gambar
dan memilih kecepatan; CRAZY8 punya lima puluh dua dan memilih satu rutin yang
melayani semuanya. Kalau CRAPS memakai cara CRAZY8 ia jadi lebih lambat tanpa
imbalan; kalau CRAZY8 memakai cara CRAPS ia butuh 52 string sepanjang 157 kolom.

> **Pelajaran.** "Rakit dari data" dan "simpan hasil jadi" bukan yang satu
> benar dan yang lain salah. Yang menentukan adalah **berapa banyak gambar yang
> harus dilayani** — satu angka, dan ia membalik jawabannya.

Ongkosnya nyata dan ditanggung pembaca: baris 1420 tidak punya satu pun
komentar yang menyebutkan bahwa itu **adalah sebuah gambar**.

---

## 2 · `RANDOMIZE` dipanggil di dalam lemparannya sendiri

Ini temuan terbesar di sesi ini.

```basic
1220 FOR B=1 TO 6                     ' enam bingkai animasi
1240 C=INT(RND(1)*6)+1                ' dadu pertama
1260 RANDOMIZE(VAL(RIGHT$(TIME$,2))*RND)
1270 D=INT(RND(1)*6)+1                ' dadu kedua
1290 RANDOMIZE(VAL(RIGHT$(TIME$,2)))  ' semai ulang LAGI
1310 NEXT
```

`RANDOMIZE` menyetel keadaan pengacak dari benihnya. Jadi sesudah baris 1290,
keadaan pengacak **sepenuhnya ditentukan oleh detik pada jam**.

Dua akibat bisa diturunkan **tanpa tahu isi `RND` sama sekali** — dan itu yang
membuat kesimpulannya kuat:

| Yang terjadi | Karena |
|---|---|
| Bingkai 2–6 semuanya masuk dengan keadaan yang sama | baris 1290 menyetelnya ke `seed(detik)` di ujung tiap putaran |
| → kelimanya menghasilkan pasangan dadu **identik** | keadaan sama ⇒ tarikan sama |
| Hasil akhir = bingkai keenam = **fungsi murni dari detik** | tidak ada masukan lain |

Jadi "animasi" enam bingkai itu sebenarnya **diam selama lima bingkai
terakhir**, dan hanya ada **enam puluh lemparan** yang mungkin di seluruh
riwayat program.

### Tangga kerusakan yang sama, tiga tingkat

| Program | Menyemai ulang | Akibat |
|---|---|---|
| [YAHTZEE](yahtzee.md) | sekali, di awal | 60 titik awal, 39 lemparan sesudahnya — tidak praktis dihafal |
| [KENO](keno.md) | tiap permainan | 60 undian, bisa dihafal |
| **CRAPS** | **dua kali di dalam satu lemparan** | 60 hasil, dan animasinya berhenti bergerak |

Pola benihnya sama persis di ketiganya — `VAL(RIGHT$(TIME$,2))`, detik saja.
Yang berbeda cuma **di mana ia dipanggil**, dan itu saja yang memisahkan
"kurang acak" dari "bukan acak sama sekali".

> **Pelajaran.** Menyemai ulang bukan cara memperbaiki pengacak yang lemah; ia
> cara **membuangnya**. Pengacak apa pun, sebagus apa pun, akan berubah jadi
> tabel yang diindeks jam dinding kalau disemai ulang lebih sering daripada ia
> dipakai.

Port ini menyemai **sekali** dari `crypto.getRandomValues`, dan keenam bingkai
animasinya benar-benar berbeda.

---

## 3 · Rumah seharga lima ratus dolar

Saat pemain kehabisan uang, program tidak berhenti. Ia menawarkan **menjual
barang Anda** supaya bisa terus bermain (baris 1830–1990), satu barang tiap
kali bangkrut, menurut daftar tetap:

| Barang | Nilai |
|---|---|
| Car | $2.000 |
| Boat | $2.000 |
| Computer | $2.000 |
| Motorcycle | $1.800 |
| Stereo | $1.200 |
| Golf Clubs | $600 |
| **House** | **$500** |
| Skate Board | $500 |

**Rumah bernilai $500** — lebih murah daripada sepeda motor, dan sama dengan
papan luncur. Entah lelucon, entah kecelakaan urutan; tidak ada komentar yang
menjelaskannya, dan tidak ada cara mengetahuinya sekarang.

Ini satu-satunya tempat di seluruh koleksi di mana sebuah program meminta
pemainnya mempertaruhkan sesuatu yang bukan uang permainan — dan ia
menuliskannya sebagai lelucon, pada 1982, di disket yang dijual untuk keluarga.

**Dipertahankan apa adanya**, termasuk urutan dan harganya. Menghapusnya berarti
menghapus satu-satunya kalimat jujur program ini tentang apa yang sedang
diajarkannya.

Satu detail yang ikut dipertahankan bentuknya:

```basic
1990 H1=0:H=VV
```

Menjual **tidak menambah** — ia **mengganti**. Sisa keping seribuan Anda hangus.
Karena rutin ini hanya dijalankan saat pemain benar-benar habis, hasilnya sama;
tapi bentuknya menyimpan kejutan kalau syaratnya pernah dilonggarkan.

---

## 4 · Satu baris yang nilainya tidak pernah dipakai

```basic
640 G=G*2   ' taruhan digandakan sesudah menang
```

Terlihat seperti aturan: menang, lalu taruhan naik dua kali lipat. Tapi tiap
ronde memanggil `GOSUB 1720`, yang menanyakan taruhan dari awal, dan baris 1750
menimpanya:

```basic
1750 A=INKEY$: ... IF A=" " THEN G=VAL(A0):RETURN
```

Nilai hasil penggandaan itu **tidak pernah sempat dipakai**. Ia bukan bug —
tidak ada yang rusak — melainkan **niat yang tertinggal**: seseorang pernah
merencanakan taruhan yang naik sendiri, lalu memutuskan menanyakannya tiap
ronde, dan lupa menghapus barisnya.

Sepupunya ada di [MAXIT1](maxit1.md): rutin papan Othello yang tertinggal di
belakang `END`. Keduanya kode mati yang ikut terkirim karena menghapusnya
terasa lebih berisiko daripada membiarkannya.

### Dan satu batas yang tidak disengaja

```basic
1740 A0=SPACE$(7)          ' mulai dengan TUJUH spasi
1770 IF LEN(A0)>10 THEN G=0:RETURN
```

`A0` dimulai berisi tujuh spasi, bukan kosong. Batas panjangnya 10. Jadi pemain
hanya bisa mengetik **tiga digit** sebelum taruhannya dipaksa jadi nol —
maksimum $99.900, bukan karena aturan, melainkan karena tujuh spasi yang tidak
pernah dimaksudkan jadi bagian dari hitungan panjang.

---

## 5 · Sembilan baris yang sama persis

```basic
10 ON KEY(1) GOSUB 840
20 ON KEY(2) GOSUB 840
   ... sampai ...
90 ON KEY(9) GOSUB 840
100 FOR A=1 TO 9:KEY(A) ON:NEXT   ' perulangan, di baris berikutnya
```

Yang menarik bukan pengulangannya, melainkan **baris 100**. Penulisnya jelas
tahu cara memakai perulangan — ia memakainya tepat sesudahnya, untuk separuh
pekerjaan yang lain (`KEY(A) ON`), dengan `A` sebagai variabel.

Jadi ia memakai perulangan di tempat yang menerima variabel, dan menulis tangan
di tempat yang tidak. Simpulan yang paling masuk akal: `ON KEY(n) GOSUB`
menuntut angka harfiah, sementara `KEY(n) ON` tidak. **Ini simpulan dari bentuk
kodenya, bukan sesuatu yang diverifikasi dengan menjalankan GW-BASIC.**

Pembandingnya `BIO.BAS`, yang juga menulis sembilan `ON KEY` berturut — tapi di
sana tujuannya **berbeda-beda** (baris 30 ke 1680, 40–60 ke 480), jadi
perulangan memang tidak akan menolong. Di CRAPS kesembilan tujuannya sama.

Layak dicatat karena mudah sekali dibaca sebagai kecerobohan — dan mungkin
bukan.

---

## 6 · Aturannya, dalam empat baris

```basic
190 K=INT(C+D):IF K=7 OR K=11 THEN IF P=0 THEN 580 ELSE 680
200 IF K=2 OR K=3 OR K=12 THEN IF P=0 THEN 680 ELSE 580
280 IF J=K THEN IF P=1 THEN 720 ELSE 660
290 IF J=7 THEN IF P=0 THEN 720 ELSE 660
```

`P=0` berarti bertaruh PASS (bersama dadu), `P=1` berarti DON'T PASS (melawan).
Empat baris, dan seluruh aturan permainan judi paling terkenal di dunia muat di
situ — termasuk kedua sisi taruhannya, yang saling membalik di keempat cabang.

Yang membuatnya elegan: **tujuh muncul di dua peran yang berlawanan.** Ia
memenangkan lemparan pembuka *dan* mematikan Anda sesudah POINT ditetapkan.
Halaman port menampilkan sebaran dua dadu di sebelahnya — tujuh punya enam cara
keluar, lebih banyak daripada angka mana pun — dan dari situ terlihat kenapa
aturannya harus begitu.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan | craps kasino, PASS / DON'T PASS, bayaran 1:1 | — | **Dipertahankan persis** (§6) |
| Uang awal | `H=10:H1=1` → $2.000 | — | Dipertahankan |
| Menang besar | `H+H1*10>100` → "YOU BROKE THE BANK" | — | Dipertahankan, di atas $10.000 |
| Gambar dadu | satu string berisi karakter kendali (§1) | Layar teks; satu `PRINT` jauh lebih cepat | `_shared/dice.js`, titiknya lingkaran SVG. Teknik aslinya **dijelaskan**, tidak ditiru harfiah |
| Pengacak | `RANDOMIZE` dua kali **di dalam** lemparan (§2) | Tidak ada entropi selain jam | Disemai **sekali** dari `crypto.getRandomValues` |
| Animasi lemparan | 6 bingkai, 5 di antaranya identik (§2) | akibat langsung dari baris 1290 | 6 bingkai yang **benar-benar berbeda** |
| Menjual barang saat bangkrut | 8 barang, rumah $500 (§3) | — | **Dipertahankan apa adanya**, termasuk urutan dan harganya |
| `G=G*2` | nilainya tidak pernah dipakai (§4) | — | Dipertahankan sebagai **ketiadaan**: taruhan tetap ditanya tiap ronde |
| Masukan taruhan | ketik digit, spasi untuk mengakhiri; batas 3 digit tak disengaja (§4) | Tidak ada penyangga masukan | Kotak angka; batasnya jumlah keping yang benar-benar dimiliki |
| Tumpukan keping | digambar sampai 12 saja (baris 2280) | Batas layar | **Dipertahankan** — tumpukan yang tumbuh sampai seratus tidak memberi tahu apa-apa |
| Sembilan `ON KEY` | ditulis tangan (§5) | Kemungkinan batas bahasanya | Tidak relevan lagi; dicatat sebagai temuan |
| Keluar | `CHAIN "MENU"` | Tiap program berkas terpisah | Tautan kembali di bilah atas |

### Yang tidak ditambahkan

Tidak ada tabel odds, tidak ada saran taruhan, tidak ada peringatan. Halaman ini
menampilkan sebaran dua dadu karena itu **fakta tentang dadu**, bukan nasihat —
dan berhenti di situ. Program 1982 ini sudah mengatakan apa yang perlu
dikatakan lewat daftar barangnya sendiri.

---

## 8 · Latihan

1. **Buktikan klaim §2 tanpa menjalankan program.** Tulis argumen lengkapnya:
   kenapa bingkai 2–6 pasti identik, dan kenapa hasilnya pasti fungsi dari
   detik. Bagian mana yang bergantung pada isi `RND`, dan bagian mana yang
   tidak?

2. **Perbaiki dengan satu penghapusan.** Baris mana saja yang harus dihapus
   agar lemparannya benar-benar acak? Apakah cukup menghapus, atau ada yang
   harus dipindahkan?

3. **Hitung keunggulan rumah.** Dari sebaran dua dadu, hitung peluang menang
   taruhan PASS. Berapa persen keunggulan rumah? Bandingkan dengan angka craps
   sungguhan (1,41%).

4. **Ubah jumlah gambarnya.** §1 mengatakan jawabannya dibalik oleh "berapa
   banyak gambar". Pada berapa gambar cara CRAPS mulai kalah dari cara CRAZY8?
   Ukur dengan menghitung karakter, bukan dengan menebak.

5. **Cari niat yang tertinggal.** §4 menemukan satu baris yang nilainya tak
   pernah dipakai. Telusuri satu program lain di koleksi ini dan cari satu
   penugasan yang hasilnya selalu ditimpa sebelum dibaca.

---

Berkas terkait: [mainkan](../games/craps/index.html) ·
[YAHTZEE — pilot `dice.js`](yahtzee.md) ·
[CRAZY8 — gambar dirakit dari data](crazy8.md) ·
[KENO — benih yang sama, satu tingkat lebih ringan](keno.md) ·
[MAXIT1 — kode mati yang ikut terkirim](maxit1.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
