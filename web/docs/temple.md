# TEMPLE — sebuah komentar yang berubah jadi kode

> Port web: [`web/games/temple/`](../games/temple/index.html) ·
> Sumber: [`run/TEMPLE.BAS`](../../run/TEMPLE.BAS) (1.187 baris) +
> [`run/TEM-INS.BAS`](../../run/TEM-INS.BAS) (290 baris) ·
> Analisis BASIC: [`reviews/TEMPLE.md`](../../reviews/TEMPLE.md) ·
> Pendahulunya: [WIZARD](wizard.md)

*The Temple of Loth* v4.2, oleh **John Belew** — "Nurruc the Chaotic" of the
Apple Eliminators. Layar judul bertanggal **25 Juli 1984**; komentar di dalam
kodenya **29 Juni 1984**. Seribu seratus delapan puluh tujuh baris: program
terpanjang di koleksi ini.

Dan hampir dua pertiganya bukan tulisan Belew.

---

## 1 · Program ini mengaku, di baris 750

```basic
700 REM
710 REM    ****************************************************
720 REM    *  WRITTEN BY JOHN BELEW FOR USE WITH THE I.B.M.   *
730 REM    *            AND OTHER COMPATIBLE                  *
740 REM    *        THANKS TO TSR FOR THE MONSTERS            *
750 REM    * THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL*
760 REM    * PROGRAM          JUNE 29, 1984                   *
770 REM    ****************************************************
```

*Recreational Computing* Juli/Agustus 1980 adalah tempat **The Wizard's
Castle** karya Joseph R. Power terbit — yaitu [`WIZARD.BAS`](wizard.md) di
koleksi yang sama. Belew menyebutkan sumbernya di dalam kodenya sendiri, dan
TSR — penerbit *Dungeons & Dragons* — untuk monsternya.

Seberapa banyak yang diwarisi bisa diukur. Nomor barisnya berbeda seluruhnya,
jadi yang dibandingkan adalah isi pernyataannya: nomor baris dibuang, spasi
dinormalkan, dan nomor di dalam `GOTO`/`GOSUB` ikut dibuang.

| | |
|---|--:|
| pernyataan berkode di WIZARD | 915 |
| pernyataan berkode di TEMPLE | 1.158 |
| **identik kata demi kata** | **706** |
| … sebagai bagian TEMPLE | **61,0 %** |
| … sebagai bagian WIZARD | **77,2 %** |

Dan yang paling menentukan:

```basic
DIM C$(34),I$(34),R$(4),W$(8),E$(8)      ' identik aksara demi aksara
DIM L(512),C(3,4),T(8),O(3),R(3)         ' identik aksara demi aksara
DEF FNA(Q)=1+INT(RND(1)*Q)               ' identik
DEF FNB(Q)=Q+8*((Q=9)-(Q=0))             ' identik
DEF FNC(Q)=-Q*(Q<19)-18*(Q>18)           ' identik
DEF FND(Q)=64*(Q-1)+8*(X-1)+Y            ' identik
DEF FNE(Q)=Q+100*(Q>99)                  ' identik
```

Kedua blok `DATA` juga punya bentuk yang sama persis — **12 blok, 88 item**
di kedua program. Belew tidak mengubah satu pun **ukuran**; ia mengganti
**kata-katanya**.

### Karena itu port ini tidak menyalin mesinnya

Kedua halaman memanggil `_shared/zot.js` yang sama. Yang ada di
`games/temple/temple.js` cuma objek aturan: nama kamar, nama senjata, nama
ras, cerita pembuka, dan empat hal yang benar-benar baru.

Itu pola yang sama dengan [`_shared/blackjack.js`](_fondasi.md), yang
melayani empat program blackjack. Dan di sini ia bukan sekadar kerapian:
menyalin mesinnya dua kali akan mengulang **persis kesalahan yang jadi
temuan utama halaman ini**.

---

## 2 · Sebuah komentar yang berubah jadi kode

```basic
WIZARD 4150  IF Q > 99 THEN Q=Q-100 ' LET Q=34 TO HIDE ROOMS
TEMPLE 4570  IF Q > 99 THEN Q=Q-100:LET Q=34:REM TO HIDE ROOMS
```

Power meninggalkan catatan untuk dirinya sendiri: *kalau mau menyembunyikan
kamar, setel Q ke 34.* Ia tidak pernah melakukannya, dan akibatnya peta
WIZARD membuka seluruh lantai dari giliran pertama.

Empat tahun kemudian Belew **membacanya dan melakukannya**. Instruksinya
pindah dari balik tanda kutip ke dalam alur program; sisa kalimatnya —
*"TO HIDE ROOMS"* — jadi `REM`.

Perhatikan `Q=Q-100` yang dibiarkan di depannya. Penetapan kedua menimpa yang
pertama, jadi pengurangan itu sekarang **tidak berguna**: ia fosil dari
perbaikannya sendiri. Belew **menambahkan**, bukan mengganti.

Akibatnya besar. Di WIZARD, kabut yang mati membuat **empat mekanik** tidak
berguna: suar, lampu, kutukan *Forgetting*, dan *Green Gem* yang
menangkalnya. Di TEMPLE keempatnya hidup. **Satu pernyataan mengembalikan
empat mekanik.**

### 2a · Tidak satu pun dari kedua program bisa memilih

`Q=34` muncul **tepat sekali** di masing-masing berkas, dipaku di dalam rutin
petanya (WIZARD 4100–4230, TEMPLE 4520–4650). Tidak ada `INPUT`, tidak ada
bendera, tidak ada pilihan menu yang menyentuhnya. Pemain 1980 mendapat peta
terbuka, pemain 1984 mendapat kabut, dan tidak seorang pun bisa menukarnya.

Kotak centang di kedua halaman port karena itu **tambahan saya**, dan artinya
**berbeda di kedua halaman**:

| | dicentang | tidak dicentang |
|---|---|---|
| **WIZARD** | penyimpangan port ([§2a](wizard.md)) | **perilaku disket 1980 yang sebenarnya** |
| **TEMPLE** | **perilaku disket 1984 yang sebenarnya** | keadaan yang **tidak pernah dikirim** |

Di halaman TEMPLE, mematikan saklarnya tidak memperlihatkan versi historis
apa pun — ia memperlihatkan **baris WIZARD yang belum diperbaiki**, yaitu
bagaimana TEMPLE akan berperilaku seandainya Belew tidak menulis
`:LET Q=34:`. Itu bukan sejarah, tapi justru itulah perbandingan yang jadi
inti halaman ini, dan labelnya menyebutkannya apa adanya.

---

## 3 · Tiga cacat, tiga nasib

| cacat WIZARD | di TEMPLE | kenapa |
|---|---|---|
| peta membuka seluruh lantai | **diperbaiki** | terlihat saat bermain, **dan** penulis lama meninggalkan catatannya |
| tidak ada `RANDOMIZE` | **diperbaiki** | terlihat: kastel yang sama tiap kali dijalankan |
| `OT=OT+4*(RC=1)` menghukum Hobbit | **diwarisi utuh** | tidak terlihat: tersembunyi di dalam **tanda** sebuah idiom |

```basic
WIZARD 2150  OT=OT+4*(RC=1)
TEMPLE 2150  OT=OT+4*(RC=1)
```

Baris itu bernomor **sama persis** di kedua program — seluruh blok pembuatan
tokohnya disalin lengkap dengan penomorannya. Hobbit tetap mendapat empat
titik lebih sedikit daripada tiga ras lain yang nilai dasarnya identik
(`ST+DX` selalu 16), dan tetap tidak ada satu kalimat pun yang
menyebutkannya.

> **Pelajarannya.** Kode yang diwarisi membawa cacatnya, dan yang
> **diperbaiki** adalah cacat yang terlihat saat dimainkan atau yang sudah
> dicatat penulis sebelumnya. Cacat yang hidup di dalam sebuah **tanda
> minus** tidak terlihat oleh keduanya — bukan karena Belew ceroboh, tapi
> karena tidak ada gejalanya. Program yang dirawat orang lain akan kehilangan
> tepat kelas kesalahan itu.

---

## 4 · Benih: dari 1 jadi 60

```basic
15 N=VAL (MID$(TIME$,7,2))
20 RANDOMIZE N
```

WIZARD tidak punya satu pun `RANDOMIZE`, jadi kastel pertamanya identik tiap
kali program dijalankan — ruang benih **1**. Belew melihatnya dan menambahkan
dua baris di paling depan.

`MID$(TIME$,7,2)` mengambil aksara ke-7 dan ke-8 dari `HH:MM:SS`: **detik**.
Jadi **60** benih. Itu tetap yang paling lemah di koleksi ini — sama dengan
27 program lain — tapi enam puluh kali lebih baik daripada satu.

---

## 5 · Dua rumus skor di satu program

```basic
 6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5   ' di papan status
11050 LET JOHN!=ST+IQ+DX+GP!-T                          ' perintah '#'
```

Baris 6450 ada **di dalam rutin papan status**, jadi skor yang sesungguhnya
sudah tercetak tiap giliran. Lalu perintah `#` — yang Belew tambahkan sendiri
dan daftarkan di layar bantuan — menghitung ulang dengan rumus yang **sama
sekali berbeda**.

Diukur di port ini pada tokoh yang sama: papan status **3.210**, perintah
`#` **45**. Tidak ada apa pun di layar yang menjelaskan kenapa.

Bonusnya:

| | |
|---|--:|
| `KM!` — tiap monster dibunuh | +1.000 |
| `FTRS` — Runestaff ditemukan | +10.000 |
| `REQ` — Amulet of Chaos | +20.000 |

Dan peubah skornya bernama **`JOHN!`** — nama depan penulisnya, dengan
akhiran `!` yang di BASIC berarti presisi tunggal. Ia dipakai di enam belas
baris. Baris 6460 memuat sebuah batas yang dikomentari kembali:
`' IF JOHN! > 30000 THEN JOHN!=30000` — Belew pernah membatasi skornya di
30.000, lalu membatalkannya ketika tangga peringkatnya tumbuh sampai 140.000.

---

## 6 · Tangga peringkat yang tidak cocok dengan manualnya

```basic
10020 IF JOHN! < 20000 THEN RANK$ ="a Wimp"
10021 IF JOHN! > 35000 THEN RANK$="a Peasant"
10022 IF JOHN! > 50000 THEN RANK$="an Amateur"
10023 IF JOHN! > 75000 THEN RANK$="a Scout"
10024 IF JOHN! > 90000 THEN RANK$="an Adventurer"
10025 IF JOHN! > 110000 THEN RANK$="a Hero"
10026 IF JOHN! > 125000 THEN RANK$="a Wizard"
10027 IF JOHN! > 140000 THEN GOTO 11999
10050 PRINT "You are ranked as ";RANK$
```

| skor | kode (10020–27) | manual (TEM-INS 2760–90) |
|---|---|---|
| 0–20.000 | a Wimp | Whimp |
| **20.000–35.000** | **tidak ada** | Peasent |
| 35.000–50.000 | a Peasant | Ameteur |
| 50.000–75.000 | an Amateur | Scout |
| 75.000–90.000 | a Scout | **tidak disebut** |
| 90.000–110.000 | an Adventurer | Adventurer |
| 110.000–125.000 | a Hero | Hero |
| 125.000–140.000 | a Wizard | Wizard |
| 140.000+ | a Lord | Lord |

Dua kekeliruan berbeda di satu tabel.

**Pertama:** tujuh `IF` menyetel `RANK$`, dan **tidak satu pun menyentuh
20.000–35.000**. Di BASIC itu berarti `RANK$` menyimpan nilai **permainan
sebelumnya** — atau string kosong pada permainan pertama, sehingga layarnya
berbunyi *"You are ranked as"* lalu tidak ada apa-apa.

Diperiksa di port ini, yang meniru perilaku peubah itu persis (peubah
`pangkat` sengaja hidup di luar keadaan permainan):

```
permainan pertama, skor 25.000  ->  "You are ranked as "
setelah permainan bernilai 100.000, skor 25.000  ->  "an Adventurer"
```

**Kedua:** seluruh tangganya **bergeser satu anak** terhadap manualnya.
Rentang yang manual sebut *Ameteur* dinamai kode *Peasant*. Empat peringkat
teratas cocok; lima yang bawah tidak. Manualnya juga melewatkan rentang
75.000–90.000 sama sekali, dan mengeja tiga namanya berbeda dari kode
(*Whimp*, *Peasent*, *Ameteur*).

---

## 7 · Papan skornya adalah sebuah `PRINT` di berkas lain

```basic
TEM-INS 2810  PRINT "  The highest score to date is that of Lord Nur£cc: 142,498"
TEMPLE 12100  IF JOHN! > 142498 THEN PRINT " Don't forget to replace my score
              on Tem-Ins.Bas
```

Rekor tertinggi tidak disimpan di berkas data, tidak di tempat mana pun yang
bisa ditulis program. Ia sebuah **pernyataan `PRINT` di dalam kode sumber
manualnya** — dan cara memperbaruinya adalah **menyunting sumber itu**, yang
justru diminta oleh permainannya sendiri kalau Anda mengalahkannya.

Angka yang sama juga tertulis keras di dalam permainannya, di baris 12100.
Jadi mengalahkan rekor menuntut Anda menyunting **dua berkas** yang harus
tetap sinkron, dan tidak ada apa pun yang menjaganya.

Nama pemegangnya, *Lord Nurᵣcc*, adalah Belew sendiri — "Nurruc the Chaotic"
di layar judul, dieja dengan aksara kotak CP437 yang tidak selamat.

---

## 8 · Satu pintu, dua kunci

```basic
TEMPLE    55  IF ANS$="ARIOCH" GOTO 700
TEM-INS 3010  CHAIN "Temple",700
```

Baris 700 adalah tempat permainannya benar-benar mulai, sesudah layar judul
grafis, logo blok, dan musiknya. Ada **dua** cara ke sana.

Manualnya memakainya lewat `CHAIN` — itulah cara pemain kembali ke permainan
dari petunjuk. Dan pemain bisa memakainya sendiri dengan mengetik
**`ARIOCH`** di prompt *"Do you want graphics (Y/N)"*, yang melompati seluruh
pembukaan.

Nomor baris sebagai antarmuka publik — pola `MORTGAGE.BAS`
([fondasi §2.7](_fondasi.md)), di sini dipakai oleh **dua program yang saling
memanggil**. Dan kata sandinya **Arioch**, pangeran iblis dari Michael
Moorcock, yang tidak pernah disebut di petunjuk mana pun.

`TEM-INS.BAS` sendiri layak disebut: 290 baris, 191 di antaranya `PRINT`,
dengan menu dua belas bagian dan `LOCATE` untuk tata letaknya. **Manualnya
adalah sebuah program.** Ia bukan berkas teks yang dibaca program lain — ia
program yang mencetak dirinya sendiri, lalu `CHAIN` kembali.

---

## 9 · Yang diganti, dan yang tidak

Ke-34 nama kamar berubah — tapi tiga puluh di antaranya cuma berubah huruf
besar-kecilnya. Yang benar-benar diganti isinya cuma monster dan pedagangnya:

| WIZARD (1980) | TEMPLE (1984) |
|---|---|
| A KOBOLD | a Green Slime |
| A WOLF | an Evil Dwarf |
| AN OGRE | **a Mind Flayer** |
| A BEAR | a Giant spider |
| A GARGOYLE | **a Drow** |
| A CHIMERA | **a Drider** |
| A BALROG | **a Balor Demon** |
| A DRAGON | a Red Dragon |
| A VENDOR | **a Drow Merchant** |

Mind Flayer, Drow, Drider, Balor — semuanya *Monster Manual*. Perhatikan
Balrog → **Balor**: nama Tolkien diganti nama TSR untuk makhluk yang sama,
yang memang begitulah TSR melakukannya sesudah masalah hak cipta 1977. Belew
mengikuti penggantian itu tanpa berkomentar.

Tapi kedelapan **harta** dibiarkan persis seperti Power menulisnya —
*Palantir* dan *Silmaril* tetap Tolkien. Belew mengganti musuhnya dan
membiarkan hadiahnya.

Dan Orb of Zot jadi **Amulet of Chaos**, yang tidak cuma berganti nama:

```basic
10250 DX=18
10260 REQ=20000
10261 BF=0
10262 BL=0
```

Amulet menyembuhkan kebutaan, melepaskan buku yang melekat di tangan, dan
menaikkan kelincahan ke maksimum. Orb of Zot tidak memberi satu pun dari
ketiganya.

---

## 10 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Mesin permainan | 706 pernyataan disalin dari WIZARD | Tidak ada cara memakai ulang kode BASIC selain menyalin berkasnya; tidak ada `include`, tidak ada pustaka | **Satu mesin, dua objek aturan** (`_shared/zot.js`). Kendalanya sudah hilang, dan menyalinnya dua kali akan mengulang temuan utama halaman ini |
| Layar judul grafis | `SCREEN 1`, `CIRCLE`, `PAINT`, `DRAW`, 200 bintang acak | CGA 320×200 satu-satunya mode grafis | **Tidak ditiru.** Ia pembukaan tiga puluh detik yang bahkan penulisnya sediakan jalan pintasnya (`ARIOCH`); di sini permainannya langsung mulai |
| `ANS$="ARIOCH"` | kata sandi tak terdokumentasi | — | Dicatat di §8, tidak dipasang: di web tidak ada pembukaan untuk dilewati |
| Skor di papan status | `JOHN!` dihitung ulang tiap giliran di 6450 | — | **Dipertahankan**, dan ditampilkan sebagai kotak *Score* dengan nomor barisnya, supaya bisa dibandingkan dengan perintah `#` |
| `RANK$` yang tidak pernah dikosongkan | peubah global BASIC | Tidak ada lingkup; semua peubah hidup selamanya | **Ditiru persis**: `pangkat` di port ini sengaja hidup di luar keadaan permainan, jadi kekeliruannya bisa dilihat |
| Rekor di `TEM-INS.BAS` | sebuah `PRINT` di kode sumber | Tidak ada penyimpanan yang bisa ditulis program tanpa disket data | Papan skor `localStorage` untuk kemenangan Anda sendiri, **dan angka 142.498 dipertahankan** sebagai ambang pesan "replace my score" |
| Petunjuk sebagai program | `TEM-INS.BAS`, 290 baris, `CHAIN` balik ke 700 | Satu berkas satu program; tidak ada penampil teks | Panel dan dokumen ini. Yang dipertahankan: **kaitannya** — halaman TEMPLE menautkan balik ke WIZARD, karena itulah hubungan yang sebenarnya |

---

## 11 · Bagaimana port ini diperiksa

- **Perbandingan 706 pernyataan** dihitung dengan menormalkan kedua listing
  (nomor baris dibuang, nomor di dalam lompatan diganti `#`) lalu mencocokkan
  multiset pernyataannya.
- **Kedua `DIM` dan kelima `DEF FN`** dibandingkan aksara demi aksara: tujuh
  dari tujuh sama.
- **88 item `DATA`** di kedua program, dipisah dengan menghormati tanda
  kutip; hanya isinya yang berbeda.
- **Tangga peringkat** diuji pada tiga belas nilai skor: rentang
  20.000–35.000 memberi string kosong pada permainan pertama, dan peringkat
  permainan sebelumnya pada permainan berikutnya.
- **Dua rumus skor** dibandingkan pada tokoh yang sama: 3.210 lawan 45.
- **WIZARD diuji ulang setelah refaktor** — pembuatan tokoh, kabut, peta,
  dan sembilan perintahnya berperilaku sama seperti sebelum mesinnya
  dipindahkan.
- **Tata letak** diukur pada 1400, 1000, 860, 760, 640, 520, 420, dan 360 px
  di kedua halaman: nol elemen keluar dari wadahnya.

---

## 12 · Latihan

1. Buka [WIZARD](../games/wizard/index.html) dan TEMPLE berdampingan. Buat
   tokoh yang sama di keduanya. Perhatikan bahwa urutan pertanyaannya,
   harganya, dan kalimat penolakannya sama persis.
2. Pilih **Hobbit** di TEMPLE. Ia masih mendapat empat titik bebas, bukan
   dua belas. Cacat 1980 yang selamat sampai 1984.
3. Tekan `M` di TEMPLE, giliran pertama: kabut. Lalu buka WIZARD dan matikan
   saklarnya: seluruh lantai. Selisih keduanya satu pernyataan.
4. Tekan `#` dan bandingkan dengan kotak **Score** yang sudah ada di papan
   status. Keduanya menghitung hal yang berbeda.
5. Lihat daftar monsternya. Delapan dari dua belas berganti; kedelapan harta
   tidak satu pun.

---

[Katalog port](../index.html) · [Fondasi](_fondasi.md) ·
[WIZARD, pendahulunya](wizard.md) ·
[Analisis BASIC aslinya](../../reviews/TEMPLE.md)
