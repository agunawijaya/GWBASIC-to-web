# MATCH — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/MATCH.BAS` — Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Ukuran asli | 369 baris (bernomor 10–3780), **0% komentar** |
| Hasil port | [`../games/match/`](../games/match/index.html) |
| Analisis BASIC | [`../../reviews/MATCH.md`](../../reviews/MATCH.md) |

Permainan ingatan bergaya acara kuis televisi: empat puluh kotak, dua puluh
hadiah yang masing-masing muncul dua kali, tiga kartu khusus, dan sebuah babak
tebak angka sebagai penutup.

Program ini punya **pola data terbaik di koleksi** dan **salah satu bug paling
tidak adil** — keduanya di berkas yang sama.

---

## 1 · Pemain sebagai indeks, bukan variabel bernomor

```basic
130 DIM A(20),B(40),PV(40),PZ(81),VL(81),TBL(1,50),PL(1),T(1),MATCH(1),KEEP(1,21)
```

`DIM` terpanjang di koleksi — sepuluh larik dalam satu baris. Yang penting pola
`(1)` yang muncul **empat kali**: `PL(1)`, `T(1)`, `MATCH(1)`, `KEEP(1,21)`.

Larik berukuran dua (indeks 0 dan 1) adalah cara program ini menyimpan **data
per pemain**. `PL(0)` dan `PL(1)` nama kedua pemain, `MATCH(0)`/`MATCH(1)`
skornya, `KEEP(0,·)`/`KEEP(1,·)` hadiah yang mereka simpan.

Konsekuensinya besar: pemain menjadi **indeks**, bukan sekumpulan variabel
bernomor (`PL1$`, `PL2$`, `SKOR1`, `SKOR2`). Dan karena itu **seluruh logika
giliran cukup ditulis sekali**, dengan satu penunjuk pemain aktif.

Port ini memakai bentuk yang sama (`pemain[0]`, `pemain[1]`) bukan sebagai
penghormatan, melainkan karena alasannya masih berlaku persis. Menduplikasi
kode giliran untuk dua pemain adalah cara paling andal membuat keduanya
pelan-pelan berbeda.

### Yang tidak ditiru

```basic
1490 ... Q(T(T)) ...
```

Larik `T` diindeks oleh variabel skalar `T`. Sah di BASIC — nama larik dan nama
skalar hidup di ruang nama yang berbeda, jadi `T` dan `T()` adalah dua hal —
tapi hampir mustahil dibaca benar sekali lihat.

Ini kebalikan dari pelajaran §1: pola datanya bagus, penamaannya membuang
seluruh keuntungannya.

---

## 2 · Angka rahasia yang tidak cocok dengan petunjuknya

```basic
270  SC=FIX(RND*89)+10                 ' 10 sampai 98
3320 PRINT "... Guess My Secret Number <11 to 99>"
```

Rentang yang **diminta layar**: 11–99.
Rentang yang **benar-benar dibangkitkan**: 10–98.

Meleset satu di **kedua** ujungnya. Akibatnya bagi pemain yang percaya pada
petunjuknya:

| | |
|---|---|
| Angka 10 | tidak akan pernah ditebak — kalau itu rahasianya, ia **tidak bisa menang** |
| Angka 99 | akan ditebak sia-sia; mustahil |

Dan babak ini menentukan **siapa yang memenangkan permainan** — bukan nilai
hadiahnya. Jadi bug satu-langkah ini bisa mengunci seorang pemain dari
kemenangan sepenuhnya, di babak yang paling menentukan.

> **Pelajaran.** Bug rentang yang paling berbahaya bukan yang membuat program
> berhenti, melainkan yang membuat **petunjuk dan perilaku tidak sepakat**.
> Programnya tetap benar menurut kodenya sendiri; yang salah adalah janjinya.
> Dan pemain tidak punya cara membedakan keduanya dari dalam permainan.

Perhatikan juga **di mana** baris 270 berada: di dalam perulangan
`FOR A=1 TO 20` yang memilih hadiah. Angka rahasianya dibangkitkan ulang dua
puluh kali, dan hanya yang terakhir yang terpakai — tidak berbahaya, tapi
menunjukkan baris itu ditaruh di sana tanpa banyak dipikirkan.

Port ini **mempertahankan rentang 10–98**, karena itulah aturan yang
benar-benar dijalankan program 1982. Yang ditambahkan cuma pemberitahuannya.

---

## 3 · `RANDOMIZE` di dalam perulangan, untuk ketiga kalinya

```basic
210 FOR A=1 TO 20
220  RANDOMIZE(VAL(RIGHT$(TIME$,2)))   ' di DALAM perulangan
230  A(A)=(RND*80):IF A(A)=0 THEN 230
240   FOR B=1 TO A-1
250    IF A(B)=A(A) THEN B=A:A=A-1     ' tolak duplikat, mundurkan pencacah
260   NEXT B
```

Penyakit yang sama dengan [CRAPS](craps.md): menyemai ulang dari detik, di
dalam perulangan yang sedang membangkitkan angka. Selama satu detik berjalan,
`RND` dikembalikan ke keadaan yang sama tiap putaran.

Yang menyelamatkan papannya dari berisi dua puluh hadiah yang sama adalah baris
240–260, yang **menolak duplikat** dan memundurkan pencacahnya (`B=A:A=A-1`) —
trik yang sama dengan [KENO](keno.md) baris 690.

Jadi pemeriksaan duplikat di sini bukan kehalusan tambahan; ia **satu-satunya
hal yang membuat program ini bisa dimainkan sama sekali**. Buang baris 250 dan
papannya jadi dua puluh salinan hadiah yang sama.

Muncul lagi di baris 320, di dalam perulangan penempatan.

| Program | `RANDOMIZE` di dalam | Diselamatkan oleh |
|---|---|---|
| [CRAPS](craps.md) | perulangan animasi lemparan | **tidak ada** — 60 hasil yang mungkin |
| **MATCH** | perulangan pemilihan hadiah | penolakan duplikat (baris 250) |

---

## 4 · Delapan puluh hadiah, dan potret 1982 yang tidak disengaja

Daftar hadiahnya (baris 2520–3310, 80 entri) kini jadi arsip yang jauh lebih
tajam daripada yang dimaksudkan penulisnya:

| Hadiah | Nilai |
|---|---|
| BRICK HOME | $55.000 |
| MOBILE HOME | $21.000 |
| WINNABAGO | $13.540 |
| SWIMMING POOL | $10.000 |
| IBM P.C. | $2.300 |
| BETAMAX | $1.150 |
| DISK DRIVE | $350 |
| **FRIENDLYWARE** | **$49,95** |
| BYTE MAGAZINE | $3 |
| TAMPA NUGGET | $0,75 |
| BAR OF SOAP | $0,25 |

Sebuah **IBM PC seharga $2.300** berdiri di daftar yang sama dengan rumah bata
$55.000 — jadi sebuah PC bernilai seperempat puluh rumah. Sebuah **Betamax
$1.150** ada di sana, format yang akan kalah dalam sepuluh tahun. Dan
penerbitnya menaruh **produknya sendiri** seharga $49,95: satu-satunya hadiah
di papan yang bisa Anda beli dari orang yang menulis programnya.

Tiga entri terakhir bukan hadiah melainkan **kartu khusus**, ditandai dengan
nilai negatif:

| Nilai | Kartu | Akibatnya |
|---|---|---|
| −1 | TAKE ONE | ambil satu hadiah lawan (baris 1420) |
| −2 | LOSE ONE | serahkan satu hadiah sendiri (baris 1540) |
| −3 | WILD CARD | cocok dengan apa pun (baris 780–790) |

Menandai kartu khusus sebagai **nilai negatif di larik yang sama** adalah trik
yang rapi: satu larik `VL()` menyimpan harga *dan* jenis, dan `IF VL(...)<0`
memisahkannya. Tidak butuh larik kedua, tidak butuh bendera.

Salah ketiknya ikut dipertahankan: `PET SQURRIEL`, `WINNABAGO`, dan
*"Congradulations"* di baris 3340. Empat puluh tahun, dan tidak ada seorang pun
yang punya cara mengirimkan perbaikan.

---

## 4b · Kartu wild merusak parity papan — dan aslinya tahu itu

Ini bug yang saya buat sendiri saat memport, dan ia layak ditulis panjang
karena akarnya bukan kesalahan ketik melainkan **invarian yang tidak saya
sadari sedang saya andalkan**.

Papan berisi 20 hadiah, masing-masing **dua** salinan. Selama yang dicocokkan
selalu sepasang yang sama, papan pasti bisa dihabiskan sampai kosong: tiap
langkah membuang dua salinan dari hadiah yang sama, jadi setiap hadiah selalu
tersisa dalam jumlah genap.

Kartu **WILD CARD** menghancurkan invarian itu. Ia boleh mencocokkan apa saja
(baris 780–790), jadi begitu ia memakan satu salinan hadiah lain, pasangan
hadiah itu jadi **yatim**:

```
W1 + TAKE1   ->  sisa: W2, TAKE2, IBM1, IBM2
W2 + IBM1    ->  sisa: TAKE2, IBM2      <- mustahil cocok
```

Port pertama mengakhiri babak papan hanya kalau papannya **kosong**. Dengan
dua kartu yatim tersisa, permainan berhenti di tempat: tidak ada langkah sah,
tidak ada jalan ke babak tebak, tidak ada cara menyelesaikannya. Dilaporkan
oleh pemain, dengan dua kartu persis itu — `IBM PC` dan `TAKE ONE`.

**Aslinya tidak punya bug ini.** Ia memeriksa hal yang benar, di baris
1280–1340:

```basic
1280 FOR A=1 TO 39
1290  IF B(A)=0 THEN 1330       ' kotak kosong, lewati
1300  FOR B=A+1 TO 40
1310   IF B(A)=B(B) THEN 1350   ' masih ada pasangan -> lanjut
1320  NEXT B
1330 NEXT A
1340 FLAG=1                     ' TIDAK ADA pasangan -> babak papan selesai
```

Babak papan berakhir saat **tidak ada pasangan tersisa**, bukan saat papan
kosong. Perbedaannya tidak terlihat sampai wild dimainkan — dan hanya sekitar
seperempat permainan yang bahkan berisi wild.

> **Pelajaran.** Kondisi berhenti "sampai habis" dan "sampai tidak ada langkah"
> terdengar sama, dan sama hasilnya di hampir semua permainan. Yang membedakan
> keduanya adalah satu aturan yang merusak invariannya — dan aturan seperti itu
> biasanya justru yang paling menarik di permainannya.

### Satu perbedaan yang disengaja dari aslinya

Pemeriksaan aslinya memakai kesamaan **murni** (`IF B(A)=B(B)`), jadi ia tidak
menganggap wild bisa dipasangkan. Akibatnya **aturan cocok dan aturan selesai
di program 1982 tidak sepakat soal wild**: kalau tersisa satu wild dan satu
IBM PC, baris 780 mengatakan itu langkah sah, tapi baris 1310 mengatakan tidak
ada pasangan dan menutup babaknya.

Port ini membuat keduanya sepakat: sebuah pasangan dianggap ada kalau dua kotak
berisi hadiah yang sama **atau** salah satunya wild. Itu superset dari syarat
aslinya, jadi ia tetap pasti berhenti — dan ia tidak pernah menutup papan saat
pemain masih punya langkah.

Diuji dengan simulasi 20.000 permainan memakai strategi paling merusak yang
mungkin (selalu menyia-nyiakan wild pada kartu lain): **nol buntu**, paling
banyak dua kartu tersisa, rata-rata 1,94.

Kotak yang tersisa sekarang **dibuka** saat babak papan berakhir. Aslinya
langsung menghapus papannya (baris 1940), jadi pemain tidak pernah tahu apa
yang tertinggal — apalagi kenapa babaknya berakhir lebih cepat.

---

## 5 · Templat `PRINT USING` yang diberi nama

```basic
140 PTR="$$##,###.##"
...
1710 PRINT USING PTR;VL(TBL(T,A))
```

Format uang disimpan **sekali** dalam variabel bernama, lalu dipakai ulang di
setiap tempat yang mencetak nilai hadiah.

Kecil, dan hampir tidak ada program lain di koleksi yang melakukannya —
sebagian besar menyebarkan literal formatnya di enam tempat, lalu satu di
antaranya berbeda tanpa ada yang menyadari.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan | 8 baris × 5 kolom, label `A1`–`E8` | Layar teks 80×25 | **Dipertahankan persis**, termasuk urutan labelnya (baris 2490) |
| Hadiah | 20 dari 80, masing-masing dua kali | — | Dipertahankan; tabelnya **dibangkitkan langsung dari `DATA`** agar persis |
| Kartu khusus | nilai negatif di larik yang sama | Menghindari larik kedua | Dipertahankan sebagai gagasan (`v < 0`) |
| Data per pemain | larik berindeks 0/1 (§1) | — | **Dipertahankan** — alasannya masih berlaku |
| `Q(T(T))` | larik diindeks skalar senama | Ruang nama BASIC | Tidak ditiru; penunjuk giliran diberi nama |
| Angka rahasia | 10–98, layar bilang 11–99 (§2) | — | **Rentangnya dipertahankan**, bugnya diberitahukan |
| Pengacak | `RANDOMIZE` di dalam perulangan (§3) | Tidak ada entropi selain jam | Disemai **sekali** dari `crypto.getRandomValues` |
| Warna kotak terbuka | `COLOR 0,7` — tinta gelap di latar terang | Satu-satunya cara membedakan di layar teks | Dipertahankan sebagai gagasan: kotak terbuka berlatar terang |
| Format uang | `PTR` bernama (§5) | — | Dipertahankan sebagai satu fungsi `uang()` |
| Nama pemain | diketik | — | `PLAYER 1` / `PLAYER 2`; tidak ada aturan yang bergantung padanya |
| Tampilan kotak | nama hadiah, 14 kolom teks | Layar teks | **Ditambahkan** mode gambar dengan tiga tema — lihat §6b |

### 6b · Mode gambar, dan kenapa namanya tetap ada

Ditambahkan mengikuti pola [15PUZZLE](15puzzle.md): gambar disimpan sebagai
**data** di berkas terpisah (`prizepics.js`), semuanya SVG gambar tangan, dan
dinyalakan lewat deret chip. Tidak ada berkas gambar terpisah, jadi tetap jalan
dari `file://`.

**Ikon per kategori, bukan per hadiah.** Ada delapan puluh hadiah; menggambar
delapan puluh ikon berarti delapan puluh gambar yang masing-masing muncul
rata-rata seperempat permainan. Yang dipakai: **31 ikon** untuk sekitar dua
puluh kategori, dan tiap hadiah dipetakan ke salah satunya. `WINNABAGO` dan
`MOBILE HOME` berbagi ikon karavan; `COLOR TV` dan `B&W T-V` berbagi ikon
televisi. Pemetaannya diverifikasi lengkap: **80 hadiah, nol tanpa ikon, nol
entri yatim.**

**Dan karena itu namanya tetap ditampilkan.** Ini konsekuensi langsung, bukan
pilihan gaya: kalau dua hadiah berbeda berbagi ikon dan namanya dihilangkan,
pemain akan mengira dua kotak cocok — sementara aturannya, yang membandingkan
*hadiah* dan bukan *ikon*, menolaknya tanpa penjelasan. Di permainan ingatan
itu fatal.

Perbedaannya dengan 15PUZZLE layak dinyatakan: di sana potongan gambar boleh
**menggantikan** angka sepenuhnya, karena tiap potongan memang unik. Di sini
ikonnya **menemani** nama, tidak menggantikannya.

**Tiga tema, satu set ikon.** `poster` (bidang datar berwarna), `garis` (tanpa
isian, paling terbaca saat kecil), `fosfor` (monokrom hijau, mengikuti aksen
koleksi ini). Dinyatakan terus terang: ini bukan tiga set gambar melainkan satu
set dengan tiga perlakuan warna — ikonnya memakai `currentColor` dan dua kelas
isian, jadi satu tema cukup mengganti tiga nilai.

Dua ikon sempat gagal uji "terbaca pada 22px" dan digambar ulang:

| Ikon | Versi pertama | Masalahnya | Sekarang |
|---|---|---|---|
| perahu | lambung lurus + satu layar | terbaca sebagai bendera di atas balok | lambung melengkung + **dua** layar berbeda ukuran |
| hewan | siluet tupai | gumpalan tanpa arti; dan kategorinya berisi tupai *dan* peternakan kalkun | **jejak kaki** — benar untuk keduanya, dan cuma lima lingkaran |

Pelajaran yang sama dengan pelempar [BOWLING](bowling.md): pada ukuran kecil,
yang menolong bukan detail melainkan bentuk yang bagiannya tidak saling
menutup.

---

## 7 · Latihan

1. **Buktikan bug rentangnya.** Tanpa menjalankan program: berapa peluang
   sebuah permainan tidak bisa dimenangkan oleh pemain yang mematuhi
   petunjuknya? (Petunjuk: berapa nilai yang mungkin, dan berapa di antaranya
   di luar 11–99?)

2. **Buang baris 250.** Apa yang terjadi pada papan kalau pemeriksaan duplikat
   dihapus, mengingat `RANDOMIZE` ada di dalam perulangan? Perkirakan dulu,
   baru uji.

3. **Hitung nilai papan.** Dari 80 hadiah, berapa harapan nilai total papan
   yang berisi 20 hadiah acak? Bandingkan dengan papan terkaya dan termiskin
   yang mungkin.

4. **Cari inflasinya.** Ubah tiap harga 1982 ke nilai sekarang. Hadiah mana
   yang naik paling banyak, dan mana yang justru **turun**? (IBM PC dan Betamax
   layak diperiksa lebih dulu.)

5. **Ganti `Q(T(T))`.** Tulis ulang baris 1490 dengan nama yang bisa dibaca,
   tanpa mengubah perilakunya. Berapa nama baru yang dibutuhkan?

---

Berkas terkait: [mainkan](../games/match/index.html) ·
[DOMINOES — 0% komentar yang lain](dominoes.md) ·
[CRAPS — `RANDOMIZE` di dalam perulangan](craps.md) ·
[KENO — trik mundurkan pencacah](keno.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
