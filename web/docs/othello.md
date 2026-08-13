# OTHELLO — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/OTHELLO.BAS` — versi PET, diadaptasi ke IBM PC oleh **Patrick Leabo**, Tucson Arizona |
| Tahun | Maret 1982 |
| Ukuran asli | 248 baris |
| Hasil port | [`../games/othello/`](../games/othello/index.html) |
| Analisis BASIC | [`../../reviews/OTHELLO.md`](../../reviews/OTHELLO.md) |

Othello 8×8 lawan komputer. Tiga hal di dalamnya layak dibaca, dan yang
pertama ada di baris komentar.

---

## 1 · Sebuah permintaan yang ditulis di baris 1025

```basic
1000 REM  OTHELLO -- PET VERSION -- MODIFIED BY PATRICK   LEABO
1010 REM                            TUCSON, ARIZONA
1020 REM                                 3-82
1025 REM NOT DONE YET BUT HAVE FUN -- PLEASE ADD A GOOD ALGORITHM TO IT
```

Program ini dikirim ke dunia dengan pengakuan bahwa AI-nya **belum selesai**,
dan permintaan terbuka supaya siapa pun yang menemukannya menuliskan yang
lebih baik.

Tahun 1982. Sebelas tahun sebelum istilah *open source* ada, dan sepuluh tahun
sebelum ada tempat untuk mengirimkan perbaikannya kembali. Ia diketik di
sebuah baris `REM` di berkas yang disalin dari disket ke disket, dan
satu-satunya cara "berkontribusi" adalah menyunting salinan Anda sendiri lalu
memberikannya ke orang lain.

Ada dua hal yang sudah lengkap di situ: **atribusi** (nama, kota, tanggal) dan
**undangan**. Yang belum ada cuma infrastrukturnya.

> Baris 1000 juga menyebut "PET VERSION" — program ini sudah berpindah dari
> Commodore PET ke IBM PC sebelum sampai ke sini. Ia sudah di-*fork* sebelum
> kata itu punya arti.

---

## 2 · Papan 10×10 untuk permainan 8×8

```basic
1080 DIM A(9,9),I4(7),J4(7),D$(2),P$(2):Z0= 0
```

`A(9,9)` berarti indeks 0..9 di kedua arah — sepuluh kali sepuluh. Papan
sesungguhnya hanya 1..8; satu cincin di sekelilingnya tidak pernah diisi dan
tetap bernilai nol seumur hidup program.

Itu menentukan saat menghitung bidak yang terkepung. Rutin di baris 2780
berjalan lurus ke satu arah sampai bertemu bidak sendiri:

```basic
2800 IF A(I6,J6)<>T2 THEN 2910    ' bukan bidak lawan -> arah ini batal
2820 IF A(I6,J6)=T1 THEN 2850     ' bidak sendiri     -> terkepung, hitung
2830 IF A(I6,J6)=Z0 THEN 2910     ' kosong            -> batal
2840 GOTO 2810                    ' lanjut berjalan
```

Berjalan keluar papan akan membaca sel pagar, yang bernilai nol, dan baris
2830 membatalkannya. **Tidak ada satu pun pemeriksaan tepi di seluruh rutin
itu.**

Diuji dengan 400 permainan acak sampai habis: sel pagar **tidak pernah sekali
pun** terisi.

Ini teknik yang sama dengan [TICTAC](tictac.md) dan [PEGLEAP](pegleap.md), dan
dengan ini koleksi punya empat program yang menghadapi masalah tepi:

| Program | Cara | Berhasil? |
|---|---|---|
| TICTAC | pagar tersurat, nilai penjaga 3 | ya |
| **OTHELLO** | **pagar tersurat, `DIM A(9,9)` untuk papan 8×8** | **ya** |
| PEGLEAP | pagar tersirat, kisi 9 kolom | ya |
| [HIQUE2](hique2.md) | tidak ada | **tidak — 8 lompatan liar** |

Yang menarik pada OTHELLO: pagarnya **tidak butuh nilai khusus**. Nol sudah
berarti "kosong", dan "kosong" sudah berarti "berhenti". Sel pagar dan sel
kosong diperlakukan sama, dan itu memang benar untuk aturan Othello.

> **Pelajaran.** Pagar paling murah adalah yang nilainya sudah punya arti yang
> tepat. TICTAC harus mengarang nilai 3 karena 0/1/2 sudah terpakai; OTHELLO
> tidak perlu mengarang apa pun.

---

## 3 · Jendela pencarian yang membesar sendiri

```basic
1070 XL= 3:XH= 6:YL= 3:YH= 6
1620 FOR I= YL TO YH:FOR J= XL TO XH
…
2940 IF I=YL THEN YL=YL-1:IF YL<1 THEN YL=1
2950 IF I=YH THEN YH=YH+1:IF YH>8 THEN YH=8
2960 IF J=XL THEN XL=XL-1:IF XL<1 THEN XL=1
2970 IF J=XH THEN XH=XH+1:IF XH>8 THEN XH=8
```

AI-nya **tidak memindai 64 kotak**. Ia mulai dari 4×4 di tengah — 25% papan —
dan jendelanya melebar satu setiap kali bidak diletakkan tepat di batasnya.

Dan itu bukan sekadar hemat: ia **benar**. Langkah Othello selalu bersebelahan
dengan bidak yang sudah ada, jadi setiap langkah sah pasti berada di dalam
kotak pembatas bidak ditambah satu ring — persis apa yang dijaga jendela ini.

Diuji dengan 400 permainan acak: **nol** langkah sah yang jatuh di luar
jendela.

Ini keluarga optimasi yang sama dengan daftar sel hidup di [LIFE2](life2.md):
*jangan cari di tempat yang tidak mungkin ada apa-apa*. Dua program berbeda,
dua penulis berbeda, satu gagasan.

Halaman portnya menandai jendela yang sedang berlaku di papan, dan
menyediakan tombol untuk mematikannya — supaya bisa dilihat bahwa hasilnya
memang tidak berubah.

---

## 4 · AI-nya: satu langkah ke depan, dan itu saja

Tiap kotak kosong dinilai dengan jumlah bidak yang terbalik, ditambah bobot
menurut letaknya:

| Baris/kolom | Bobot | Baris kode |
|---|--:|---|
| 1 atau 8 — tepi | **+2** | 1690–1700 |
| 2 atau 7 — sebelah tepi | **−2** | 1710–1720 |
| 3 atau 6 — dalam | **+1** | 1730–1740 |

Bobotnya benar secara strategi: tepi sulit direbut kembali, dan kotak
sebelah tepi berbahaya karena membuka jalan lawan ke sudut.

Yang tidak ada: **penelusuran**. AI ini tidak pernah membayangkan jawaban
lawan, bahkan satu langkah pun. Ia memilih langkah yang paling menguntungkan
*sekarang* — dan di Othello itu justru sering salah, karena membalik banyak
bidak di awal permainan biasanya melemahkan posisi.

Dua rincian yang mudah terlewat:

- **Seri dipecah dengan lemparan koin** (`IF RND(1)>0.5`, baris 1770), jadi ia
  tidak selalu memainkan langkah yang sama pada posisi yang sama.
- **Kalau tidak ada langkah bernilai positif, hukuman −2 dibuang dan pencarian
  diulang** (baris 1810–1830). Program lebih memilih langkah buruk daripada
  melewatkan giliran — dan itu keputusan yang benar di Othello.

Bobot posisi hanya aktif kalau pemain memilih tingkat sulit (baris 1320–1340:
`S2=2:S4=1:S5=-2`). Kalau tidak, ketiganya nol dan AI-nya murni serakah.
Kedua mode tersedia di halaman portnya lewat kotak centang, beserta peta bobot
8×8 yang dibangkitkan dari kode penilaian yang sama.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan | `A(9,9)` dengan cincin pagar | Menghindari pemeriksaan tepi | **Dipertahankan** — larik 10×10, dan pagarnya diuji tetap nol |
| Jendela AI | 4×4 melebar sendiri | 4,77 MHz | **Dipertahankan**, ditandai di papan, bisa dimatikan untuk dibandingkan |
| Penilaian | jumlah balik + bobot letak | Tidak ada memori untuk penelusuran | Dipertahankan persis, termasuk lemparan koin dan pembuangan hukuman |
| Warna bidak | `"RED"` dan `"BLUE"` (baris 1360–1380) | CGA teks | Dipertahankan — bukan hitam/putih seperti papan Othello sungguhan |
| Nama pemain | `INPUT "ENTER PLAYER 1,S NAME!"` | — | Dibuang. Menanyakan nama sebelum bermain adalah kebiasaan era ketika satu program dipakai bergantian di satu mesin |
| Dua pemain | `NP=2` | — | Belum diport; port ini hanya lawan komputer |
| Langkah sah | tidak ditandai | Layar teks | Ditandai titik di kotak yang bisa dimainkan |

Catatan soal warna: Othello sungguhan memakai bidak hitam-putih, dan program
ini memakai merah-biru. Itu **dipertahankan** — sama seperti pasak hitam-putih
di [MASTER](master.md) dipertahankan justru karena itu kosakata permainannya,
di sini merah-biru dipertahankan karena itu yang tertulis di baris 1360.

---

## 6 · Latihan

1. **Jawab permintaan baris 1025.** Tulis AI dengan penelusuran dua langkah
   (minimax kedalaman 2) memakai fungsi penilaian yang sama. Apakah ia
   mengalahkan yang asli? Sekarang coba kedalaman 4 — berapa posisi yang
   dievaluasi tiap langkah?

2. **Uji jendelanya.** Matikan jendela pencarian di halaman portnya dan mainkan
   beberapa permainan. Apakah AI-nya pernah memainkan langkah yang berbeda?
   Kalau tidak pernah, apa yang itu buktikan — dan apa yang tidak?

3. **Hapus pagarnya.** Ubah larik jadi 8×8 dan jalankan tanpa menambah
   pemeriksaan tepi. Berapa lama sampai ada bidak yang terbalik dari tepi kanan
   ke tepi kiri? Bandingkan dengan bug di [HIQUE2](hique2.md).

4. **Serakah itu buruk.** Mainkan sepuluh permainan dengan bobot posisi
   dimatikan, lalu sepuluh dengan dinyalakan. Apakah selisihnya terasa? Lalu
   cari tahu kenapa "membalik paling banyak bidak" adalah strategi Othello yang
   terkenal buruk di awal permainan.

---

Berkas terkait: [mainkan](../games/othello/index.html) ·
[TICTAC — pagar juga](tictac.md) · [PEGLEAP](pegleap.md) ·
[HIQUE2 — tanpa pagar](hique2.md) · [LIFE2 — jangan cari di tempat kosong](life2.md)
