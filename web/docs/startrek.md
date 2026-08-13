# STARTREK — manual yang meragukan rutin yang benar

> Port web: [`web/games/startrek/`](../games/startrek/index.html) ·
> Sumber: [`run/STARTREK.BAS`](../../run/STARTREK.BAS) (508 baris) ·
> Manual asli: [`docs/STARTREK.DOC`](../../docs/STARTREK.DOC) ·
> Analisis BASIC: [`reviews/STARTREK.md`](../../reviews/STARTREK.md)

Silsilahnya paling panjang di koleksi ini: Mike Mayfield 1971 → *Creative
Computing* → **BASIC Computer Games** karya Dave Ahl → port IBM PC oleh
**Bob & Sharon Fritz, Oktober–November 1981**, lengkap dengan alamat dan
nomor telepon San Diego di baris 610–620.

Yang membuat berkas ini istimewa bukan kodenya melainkan **manualnya**.
`STARTREK.DOC` ditutup kalimat yang tidak muncul di satu pun berkas lain:

> *"This program is distributed AS IS. It certainly needs work, but at least
> we're started off."*

Dan ia menyebut **tiga keraguan penulisnya sendiri**. Dokumen ini menguji
ketiganya. Hasilnya: dua yang mereka ragukan ternyata benar, dan yang keliru
justru yang tidak mereka sebut.

---

## 1 · Keraguan #1 — *"9 supposed to be synonymous with 1, but I'm not sure it works"*

Bekerja. Baris 1030–1050 membangun sembilan vektor satuan, dan yang terakhir
**sengaja disamakan dengan yang pertama**:

```
C(1) = ( 0, +1)   kanan          C(6) = (+1, -1)
C(2) = (-1, +1)                  C(7) = (+1,  0)   bawah
C(3) = (-1,  0)   atas           C(8) = (+1, +1)
C(4) = (-1, -1)                  C(9) = ( 0, +1)   <- sama dengan C(1)
C(5) = ( 0, -1)   kiri
```

Karena `C(9) = C(1)`, interpolasi di baris 2080 melingkar dengan benar untuk
arah pecahan 8,x. Tapi `IF C1=9 THEN C1=1` di baris 1720 dan 2770 **bukan
kenyamanan** — ia penjaga:

```basic
2080 X1=C(C1,1)+(C(C1+1,1)-C(C1,1))*(C1-INT(C1))
 960 DIM G(8,8),C(9,2),…
```

Rumusnya membaca `C(C1+1)`. Untuk `C1=9` itu `C(10)` — satu di luar
`DIM C(9,2)`, dan program akan berhenti dengan *Subscript out of range*.
Penjaganya **persis selebar yang dibutuhkan**: satu nilai, dan itu yang benar.

Penulisnya menulis penjaga yang tepat lalu tidak yakin ia bekerja.

---

## 2 · Keraguan #2 — *"TOR DATA … reliable only if direction is a whole number"*

Justru **tepat sempurna**.

Kalkulator arah ada di baris 4590–4730, penggerak torpedo di 2810–2870.
Disapu seluruh kombinasi posisi di kuadran 8×8 — Enterprise di mana saja,
sasaran di mana saja, **4.032 pasangan** — dengan arah yang dihitung
kalkulatornya lalu diumpankan ke penggeraknya:

```
pasangan diuji : 4.032
kena           : 4.032   (100,00 %)
luput          : 0
```

Dan itu bertahan setelah pembulatan. Angka yang tercetak di layar 1981 punya
tujuh angka berarti dan pemain mengetiknya kembali; disapu ulang pada 7, 6, 5,
4, dan bahkan **3** angka berarti: nol luput di semuanya.

### Kenapa ia tepat

Karena **"arah" di sini bukan sudut.** Penggeraknya memetakan sebuah bilangan
1–9 ke vektor lewat interpolasi linear antar vektor satuan. Kalkulatornya:

```basic
4660 PRINT"Direction =";C1+(ABS(A)/ABS(X))
4650 PRINT"Direction =";C1+(((ABS(A)-ABS(X))+ABS(A))/ABS(A))
```

`C1 + |A|/|X|` adalah **fungsi kebalikan** dari interpolasi itu, bukan sebuah
`atan2` yang dibulatkan. Keduanya parameter dari satu pemetaan linear
sepotong-sepotong yang sama. Diperiksa dengan perkalian silang: vektor langkah
yang dihasilkan sejajar sempurna dengan vektor ke sasaran pada **4.032 dari
4.032** pasangan.

Itu rancangan yang bagus, dan penulisnya tidak mempercayainya.

> **Pelajarannya.** Ketidakpercayaan pada kode sendiri biasanya lahir dari
> *melihat angka yang tidak bulat*. Di sini 1,3333 terlihat seperti
> pembulatan yang mencurigakan, padahal ia nilai eksak dari sebuah parameter.
> Yang membedakan tebakan dari pengetahuan cuma satu langkah: **jalankan
> keduanya dan bandingkan.** Empat ribu pasangan butuh beberapa detik
> sekarang; di 1981 itu berjam-jam, dan di situlah keraguan itu masuk akal.

---

## 3 · Yang tidak mereka ragukan, dan justru keliru: jaraknya

```basic
4730 PRINT"Distance =";SQR(X^2+A^2)     ' garis lurus (Euclid)
2100 FOR I=1 TO N:S1=S1+X1:S2=S2+X2 …   ' satu petak per putaran (Chebyshev)
1820 N=INT(W1*8+0.5)
```

Jaraknya diukur **garis lurus**, tapi kapalnya bergerak **satu petak per
putaran pada sumbu dominan** — dan manualnya sendiri berkata *"decimal speed
of 0.1 moves one sector."* Jadi angka yang tercetak dan jumlah langkah yang
dibutuhkan adalah dua besaran berbeda.

Disapu keseluruhan 4.032 pasangan, memakai angka *Distance* apa adanya:

| selisih langkah | pasangan | |
|---|--:|--:|
| tepat | 2.748 | 68,2 % |
| kelebihan 1 | 1.076 | 26,7 % |
| kelebihan 2 | 204 | 5,1 % |
| kelebihan 3 | 4 | 0,1 % |

**31,8 % perjalanan akan melewati sasarannya.** Yang terburuk diagonal murni:
tiga petak diagonal tercetak **4,2426** — 41 % terlalu jauh; dari sudut ke
sudut, 9,8995 lawan 7 langkah yang sebenarnya.

Rasa tidak nyaman penulisnya nyata. Ia cuma ada di angka yang lain.

---

## 4 · Satu nomor baris yang meleset, dan seluruh permainan berubah

```basic
1930 NEXT I:GOSUB 4810:D1=0:D6=W1:IF W1>=1 THEN D6=1
…
4800 R1=FNR(1):R2=FNR(1):A$="   ":Z1=R1:Z2=R2:GOSUB 4990:IF Z3=0 THEN 4800
4810 RETURN
…
3350 IF K3<=0 THEN RETURN               ' REM klingons shooting
```

Baris 4810 isinya **hanya `RETURN`** — ia cuma pintu keluar gelung
pencari-tempat-kosong di 4800. Jadi `GOSUB 4810` di baris 1930 tidak melakukan
apa pun.

Yang seharusnya dipanggil hampir pasti **3350**, rutin `klingons shooting`.
Buktinya bisa dihitung: 3350 dipanggil dari **empat** tempat di seluruh
program — 2730 (sesudah phaser), 2950, 3060, 3070 (sesudah torpedo) — dan
**keempatnya sesudah pemain menembak**. Tidak satu pun sesudah bergerak.

Akibatnya menentukan seluruh rasa mainnya:

> **Klingon tidak pernah menembak lebih dulu.**

Diuji di port ini: empat puluh perintah NAV berturut-turut di kuadran berisi
dua Klingon bertenaga penuh, perisai tetap **500 → 500**, dan pesan
*ENTERPRISE HIT!* tidak pernah muncul sekali pun.

Anda bisa masuk kuadran Condition RED, melintasinya, berlabuh di starbase,
memperbaiki kapal, lalu pergi — tanpa sekali pun kena, asal Anda tidak
menembak duluan. Sebuah permainan bertahan-hidup berubah jadi permainan
pilihan, karena satu nomor baris meleset dari 3350 ke 4810.

---

## 5 · Dua string yang tidak pernah ditutup

GW-BASIC memaafkan tanda kutip penutup yang hilang: stringnya berlaku sampai
akhir baris. Ada dua di program ini, dan akibatnya sangat berbeda.

**Yang pertama cuma terlihat.**

```basic
2580 PRINT"Phasers locked on target;  :;
```

Jumlah tanda kutipnya ganjil, jadi yang tercetak memuat ekornya sendiri:
`Phasers locked on target;  :;`. Sebuah kekeliruan ketik yang muncul di layar
tiap kali Anda menembak, selama sembilan belas tahun. Dipertahankan di port
ini.

**Yang kedua menelan sebuah perintah.**

```basic
3120 IF X<E+S THEN 3150
3130 PRINT"Shield Control reports  'This is not the federation treasury.'"
3140 PRINT"<shields unchanged>:goto 1990
3150 E=E+S-X:S=X:PRINT"Deflector Control Room report:"
3160 PRINT"  'Shields now at";INT(S);"units per your command.'":GOTO 1520
```

`:goto 1990` ada **di dalam** teks, jadi tidak pernah dijalankan. Alurnya
jatuh ke 3150 — yang justru **menerapkan** perubahan yang baru saja
ditolaknya. Minta perisai lebih besar daripada seluruh energi kapal, dan Anda
akan diberi tahu bahwa ini bukan bendahara Federasi, lalu **diberi**.

Tapi itu bukan celah — itu **jebakan**. `E=E+S-X` membuat energi manuver
negatif, dan baris 1820 menolak tiap gerakan sesudahnya. Diuji: perisai
99.999, lalu NAV warp 1 menjawab *"Insufficient energy available"* dan kapal
tidak bergerak satu sektor pun. Anda jadi kebal **dan** terpaku, lalu kalah
karena kehabisan hari.

Dan seandainya kutipnya tertutup, `GOTO 1990` mendarat di `1990 NEXT I` —
tanpa `FOR` yang aktif, yaitu *NEXT without FOR*. Jadi kekeliruan ketik itu
menukar sebuah **kemacetan** dengan sebuah **jebakan yang tenang**: keduanya
merugikan pemain, tapi hanya yang pertama yang akan pernah dilaporkan.

---

## 6 · Satu titik dua yang hilang, dan "Klingon8 left"

```basic
1750 X$="8":IF D(1)<0 THEN X$="0.2"
1760 PRINT"Warp factor(0-";X$;")";:INPUT W1
…
4400 GOSUB 840:PRINT"   Status Report:"X$="":IF K9>1 THEN X$="s"
4410 PRINT"Klingon";X$;" left: ";K9
```

`X$` dipakai untuk dua hal yang tidak berhubungan: **akhiran jamak**
(*Klingon**s***, *starbase**s***) dan **batas warp** yang dicetak di prompt
NAV.

Baris 4400 bermaksud mengosongkannya lebih dulu, tapi titik dua sebelum `X$`
hilang. Yang tertulis jadi `PRINT "…" X$=""` — dan di dalam `PRINT`, sebuah
`=` bukan penetapan melainkan **perbandingan**. Hasilnya ikut tercetak sebagai
`0` atau `-1`, dan `X$` **tidak pernah dikosongkan**.

Jadi begitu Anda pernah menekan NAV, `X$` berisi `"8"`. Kalau tinggal satu
Klingon, laporan statusnya berbunyi:

```
   Status Report:
 0
Klingon8 left: 1
```

Diverifikasi di port ini dengan menyusun keadaan itu langsung. Angka `0` yang
berdiri sendiri di baris kedua adalah hasil perbandingan tadi — sisa sebuah
titik dua.

---

## 7 · Peta nama galaksi, bocor di dua tempat

```basic
5040 IF Z5<+4 THEN ON Z4 GOTO 5060,5070,5080,5090,5100,5110,5120,5130
5140 ON Z4 GOTO 5150,5160,5170,5180,5180,5200,5210,5220
5180 G2$="Betelgeuse":GOTO 5230
5190 G2$="Aldebaran":GOTO 5230
5230 IF G5<>1 THEN ON Z5 GOTO 5250,5260,5270,5280,5250,5260,5270,5280
```

**(a) `Z5<+4`, bukan `Z5<5`.** Tanda tambah uner itu kekeliruan ketik yang
sama jenisnya dengan `WHILE+ A$=""` di `BOWLING.BAS` — dan GW-BASIC memaafkan
keduanya karena `+` di depan sebuah nilai sah. Akibatnya **kolom 4 memakai
keluarga nama yang kedua**: kuadran (1,4) bernama *Sirius iv* alih-alih
*Antares iv*.

**(b) Baris 5140 menyebut `5180` dua kali dan `5190` nol kali.** Jadi baris 5
ikut bernama *Betelgeuse*, dan **Aldebaran** — yang tertulis lengkap di 5190 —
tidak pernah bisa muncul.

Peta yang benar-benar dihasilkan (kolom 4 dan baris 5 yang salah):

|  | 1 | 2 | 3 | **4** | 5 | 6 | 7 | 8 |
|--|---|---|---|---|---|---|---|---|
| 1 | Antares i | Antares ii | Antares iii | **Sirius iv** | Sirius i | Sirius ii | Sirius iii | Sirius iv |
| 4 | Vega i | Vega ii | Vega iii | **Betelgeuse iv** | Betelgeuse i | … | … | Betelgeuse iv |
| **5** | Canopus i | Canopus ii | Canopus iii | **Betelgeuse iv** | **Betelgeuse i** | … | … | **Betelgeuse iv** |

Pemetaan ini seharusnya **satu-satu**: 8 nama × 4 akhiran × 2 keluarga = 64,
untuk 64 kuadran. Yang dihasilkan:

| | |
|---|--:|
| nama berbeda | **52** |
| kuadran yang berbagi nama dengan kuadran lain | **22** |
| kuadran yang salah nama | **12** dari 64 |
| kuadran bernama *Betelgeuse* | **10** |
| kuadran bernama *Aldebaran* | **0** |

Papan status di port ini menandai merah kalau kuadran tempat Anda berada
kebetulan salah satu yang salah, dan menyebutkan nama seharusnya.

Ada satu akibat lagi yang mudah terlewat: karena akhiran ` iv` hanya pernah
dipasangkan dengan keluarga **kedua**, tidak ada satu pun kuadran bernama
*Antares iv*, *Rigel iv*, … *Pollux iv*. Delapan nama lagi yang tertulis di
kode dan tidak pernah dipakai.

---

## 8 · Empat hal yang programnya bisa katakan, dan tidak pernah bisa

| baris | yang tertulis | kenapa tak terjangkau |
|---|---|---|
| 5190 | `"Aldebaran"` | 5140 menyebut 5180 dua kali dan 5190 nol kali |
| 4770–4780 | Spock: *no starbases in this quadrant* | 4760 `GOTO 4540` tanpa syarat melompatinya |
| 3000–3020 | hukuman *CYGNUS 12* | lihat di bawah |
| 3770 | `CC$="docked"` | `CC$` muncul **tepat sekali** di seluruh program dan tidak pernah dibaca |

**CYGNUS 12.** Baris 2990 berbunyi `IF B9>0 OR K9>T-T0-T9 THEN 3030`. Baris
2180 menjamin `T ≤ T0+T9` selama permainan berjalan, jadi `T-T0-T9 ≤ 0`; dan
`K9 ≥ 1` (kalau nol, 2900 sudah menyatakan menang). Maka ruas kanan **selalu
benar** dan hukumannya selalu dilewati. Bentuknya menunjukkan yang dimaksud
adalah **sisa** hari, `T0+T9-T`; tandanya terbalik.

**"docked".** Baris 3770 menulis `CC$`, sementara baris 3900 mencetak `C$` —
dan di jalur berlabuh `C$` tidak pernah diperbarui. Jadi kata "docked" ada di
dalam program, tidak pernah bisa terlihat, **dan** indikator Condition membeku
pada nilai kuadran sebelumnya. Port ini menampilkan `⟨CC$="docked"⟩` di
sebelah nilai `C$` yang basi, supaya keduanya bisa dilihat bersamaan.

**BAS NAV tanpa starbase** jenisnya berbeda: ia tidak berhenti, ia
menghitung. Kalau `B3=0`, `W1` dan `X` tidak pernah diisi — dan keduanya
variabel yang dipakai ulang untuk hal lain: `W1` terakhir dipakai sebagai
**faktor warp** (1760), `X` sebagai **jumlah unit phaser** (2600). Jadi
"arah ke starbase" dihitung ke titik (faktor warp, unit phaser). Diuji di
port: warp 3 dan 250 unit phaser memberi *Direction = 8.995918,
Distance = 245.002*.

---

## 9 · Bunyinya adalah jam permainannya

```basic
 510 PLAY "mb"                          ' music background
5300 FOR J= 1 TO 4
5310   FOR K=1000 TO 2000 STEP 20
5320     SOUND K,0.01*18.2
5330   NEXT K
5340 NEXT J
```

Baris 510 menyalakan **music background**, yang membuat `SOUND` mengantre
alih-alih memblokir. Tapi antrean GW-BASIC dalamnya **32 nada**, dan tiap
rutin mengantre jauh lebih banyak — jadi programnya berhenti menunggu.

| rutin | baris | nada | lama |
|---|---|--:|--:|
| siaga merah | 5290–5350 | 204 | 2,04 dtk |
| torpedo | 5360–5410 | 142 | 1,42 dtk |
| phaser | 5420–5470 | 80 | 0,72 dtk |
| alarm kena | 5480–5570 | 216 | 2,16 dtk |

Empat rutin itu satu-satunya yang menahan mesin 1981; tanpa mereka
permainannya seketika. Ini temuan yang sama dengan
[LANDER](lander.md), tempat *Blue Danube* ternyata jam permainannya dan
menekan tombol senyap **mempercepat** permainan berlipat.

Satu Klingon yang membalas memainkan alarm 2,16 detik; tiga Klingon
membuatnya 6,5 detik. Itu bukan hiasan — itu jeda yang membuat pertempurannya
terasa punya berat.

---

## 10 · Benih: 3.600 yang runtuh jadi 119

```basic
 810 RANDOMIZE 120*(VAL(RIGHT$(TIME$,2)) + VAL(MID$(TIME$,4,2)) )
1250 PRINT:PRINT ' "hit any key except return when ready to accept command"
1260 I=RND(1):IF INP(1)=13 THEN 1260
```

Detik dan menit **dijumlahkan**. Tiga ribu enam ratus kombinasi jam runtuh
jadi **119** jumlah berbeda, dan mengalikannya dengan 120 tidak menambah apa
pun — perkalian dengan tetapan tidak pernah menambah entropi.

Bandingkan dengan [DROIDS](droids.md), yang **menyambung** detik dengan menit
sebagai teks sebelum `VAL` dan karena itu mendapat 3.600 penuh — satu-satunya
di koleksi yang benar-benar melebarkan ruang benihnya. Operatornya `+`, bukan
penyambungan, dan itulah seluruh bedanya.

Baris 1250–1260 seharusnya menambal itu dengan trik [METEOR](meteor.md):
mengaduk `RND` selama pemain membaca. Dua-duanya gagal.

- Teks *"hit any key except return when ready"* ada **di belakang tanda kutip
  tunggal**, jadi ia komentar dan tidak pernah tercetak.
- `INP(1)` membaca **port I/O nomor 1**, bukan papan ketik — port data papan
  ketik IBM PC ada di `&H60`. Syaratnya praktis tak pernah benar, gelungnya
  keluar seketika, dan pengaduknya berputar **tepat sekali**.

Sebuah pengaduk entropi yang tidak pernah berputar, di depan prompt yang
tidak pernah tercetak.

---

## 11 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Petak kuadran | `Q$` — satu string **192 aksara** (8×8 sel × 3 aksara), diubah dengan `LEFT$/MID$/RIGHT$` di 4830 | Larik dua dimensi berisi string mahal di 64 KB; satu string panjang gratis | **Dipertahankan sebagai string 192 aksara.** Tabrakan (2110), pencarian tempat kosong (4800), dan tampilan semuanya membacanya. Ini kerabat dekat "layar sebagai struktur data" yang muncul enam kali di koleksi — di sini bentuknya *string sebagai petak dua dimensi*, dan menggantinya dengan larik akan menghapus temuannya |
| Isi kuadran | `G(I,J)=K3*100+B3*10+S3` | 64 bilangan lebih murah daripada 64 catatan | **Dipertahankan.** Satu kolom data, tiga arti — kerabat titik jalan [TRUCKER](trucker.md) yang memuat dua hal dalam satu pecahan |
| `INPUT "command"` berulang | REPL yang memblokir | Tidak ada konsep asinkron | Kotak isian + Enter, dan **sub-prompt bertingkat** (`minta()`) yang meniru `INPUT` di tengah rutin: NAV bertanya arah lalu warp, persis urutan aslinya |
| `KEY 1,"NAV"+CHR$(13)` … (850–940) | Program benar-benar **memprogram tombol fungsi** GW-BASIC | Tidak ada tombol layar; F1–F10 satu-satunya pintasan yang tersedia | **Tombol F1–F9 sungguhan** plus barisan tombol yang bisa diklik. Teksnya sama persis dengan yang diprogram baris 850–940 |
| `SOUND` di dalam `PLAY "mb"` | Empat penyapu frekuensi, 80–216 nada | Speaker satu suara, antrean 32 nada | `audio.playNotes()` dengan frekuensi dan durasi yang sama. **Bedanya: di port ini bunyinya tidak menahan apa pun.** Itu penyimpangan yang dinyatakan — peramban punya penjadwal, dan §9 mencatat berapa lama tiap rutin menahan mesin aslinya |
| `RANDOMIZE 120*(detik+menit)` | 119 benih | Yang tersedia cuma jam | `crypto.getRandomValues` + mulberry32 ([fondasi §2.6](_fondasi.md)), **dan nomor benihnya ditampilkan** sehingga sebuah galaksi bisa diulang dengan sengaja — kemampuan yang mustahil dimiliki versi 1981 |
| `LOAD"MENU",R` di baris 3670 | Kembali ke menu disket | Overlay: satu program satu berkas | Tombol *Semua program* di bilah atas |
| Glif sel: `╠É╣`, `+☻+`, `«⌂»`, ` ☼ ` (1440–1500) | Mode grafis CGA memakan 16 KB dari 64 KB; menulis karakter ke memori layar hampir gratis | Yang dimaksud baris-baris itu adalah *ini kapal, ini kapal musuh, ini stasiun, ini bintang* — glifnya kompromi, bukan pilihan | **Digambar sebagai SVG** di `armada.js` (lihat §11a). Glif aslinya tetap ada di balik saklar *Glif CP437 asli* |
| Layar 80×25: petak dan status **berdampingan** (3830–3970) | `PRINT` hanya bisa maju ke kanan lalu turun, jadi status ditempel di ujung tiap baris petak | — | Petak mendapat seluruh lebar kolom, status pindah ke bawahnya. **Yang dipertahankan urutan kedelapan pembacaannya, bukan tempatnya** — lihat §11a |
| Kekeliruan ketik yang terlihat (2580, 3140, 4400) | — | — | **Dipertahankan persis**, termasuk `;  :;` dan `<shields unchanged>:goto 1990` yang tercetak. Ini bukan selera: teksnya adalah buktinya |
| Cacat aturan (Klingon tak menembak, CYGNUS 12, nama kuadran) | — | — | **Tidak diperbaiki**, sesuai keputusan (c) di [fondasi](_fondasi.md). Yang dilakukan port adalah **menunjukkannya**: papan status menandai nama yang salah, dan panel menyebut nomor barisnya |

---

## 11a · Kesetiaan yang keliru, dan bagaimana ia diperbaiki

Versi pertama port ini menggambar kuadrannya dengan **glif CP437 asli**:
`╠É╣` untuk Enterprise, `+☻+` untuk Klingon, `«⌂»` untuk starbase, ` ☼ `
untuk bintang. Itu setia pada baris 1440–1500 — dan itu keliru.

[`_fondasi.md` §2.3](_fondasi.md) menyatakannya lebih dulu dan lebih jelas
daripada yang saya kerjakan: karakter kotak CP437 adalah **kompromi, bukan
pilihan estetis**. Kendalanya nyata dan bisa disebut angkanya — mode grafis
CGA memakan 16 KB dari 64 KB yang tersedia, sementara menulis karakter ke
memori layar hampir gratis — dan kendala itu sudah tidak ada. Menyalin
glifnya apa adanya berarti menyalin **kendalanya**, bukan **maksudnya**.

Yang sebenarnya dimaksud baris 1440–1500 adalah: *ini kapal, ini kapal
musuh, ini stasiun, ini bintang.* Itu yang digambar sekarang, di
`games/startrek/armada.js`:

- **Enterprise** kelas Constitution dari atas — cakram utama dengan kubah
  anjungan dan cincin geladak, leher dorsal, lambung teknik dengan piring
  deflektor, dua tiang penopang menyapu ke belakang, dua nacelle dengan
  kolektor Bussard merah di depan dan kisi medan warp biru di sisi dalam.
- **Klingon** kelas D7 — sayap menyapu ke belakang, leher panjang, kepala
  komando. **Haluannya sengaja berlawanan arah** dengan Enterprise: di layar
  1981 kedua benda cuma tiga aksara dan tidak punya arah sama sekali, dan
  arah yang berlawanan adalah cara tercepat mata membedakan kawan dari lawan
  tanpa mengandalkan warna saja.
- **Starbase** — tiang dok dengan enam tambatan, inti bersegi delapan, dua
  sayap panel surya, satu piring antena.
- **Bintang** — tiga warna (kuning, biru-putih, jingga) dengan korona dan
  paku difraksi, dipilih dari koordinat selnya sendiri sehingga kuadrannya
  beragam tapi **tetap sama tiap kali digambar ulang**.

Latarnya medan bintang jauh yang dibangkitkan dari **nomor kuadran**, bukan
dari `Math.random` — kalau acak murni, ia akan berkedip tiap kali layar
digambar ulang, dan layar ini digambar ulang setiap perintah.

Ditambah tiga efek yang seluruhnya mengikuti angka yang sudah dicetak
programnya: **sinar phaser** ke tiap Klingon (baris 2630 memang membagi
tenaga ke semuanya sekaligus), **jejak torpedo** yang menelusuri persis
sel-sel yang dicetak baris 2860 sebagai *"Torpedo track:"*, dan **ledakan**
di sel yang sama dengan pesan `**** KLINGON DESTROYED ****`.

Semuanya `<path>`/`<ellipse>`/`<rect> `yang ditulis tangan di dalam
`<symbol>` berkotak 100×100, dipakai berkali-kali lewat `<use>` — persis
semangat `DIM FIG$(5,5)` di `CRAZY8.BAS` dan pola yang sama dengan
`_shared/svg.js`.

**Glif aslinya tidak dibuang.** Ada saklar *Glif CP437 asli* di bawah layar
yang mengembalikannya, karena bentuk 1981 itu tetap bagian dari
pelajarannya — dan sekarang keduanya bisa dibandingkan berdampingan.

### Tiga kesalahan yang layak dicatat

**Satu: `id` gradien menabrak `id` simbol.** Gradien untuk lambung Klingon
dan `<symbol>` kapalnya sama-sama diberi nama `tr-klingon`. Akibatnya kapal
Klingon **tidak tergambar sama sekali**: `href` di `<use>` menemukan
gradiennya lebih dulu, dan sebuah gradien tidak menggambar apa pun. Tidak
ada galat, tidak ada peringatan di konsol — cuma sel kosong. Ruang nama
`id` di sebuah dokumen SVG itu **satu**, dan berlaku untuk semua jenis
elemen sekaligus.

**Dua: backtick di dalam *template literal*.** Komentar SVG di dalam string
`DEFS` memakai backtick untuk mengutip nama (`` `tr-g` ``), dan backtick
**menutup** template literal-nya. Seluruh berkas jadi galat sintaks, dan
gejalanya muncul di berkas *lain*: `startrek.js` berhenti dengan
`Cannot read properties of undefined (reading 'DEFS')`. Yang menunjukkan
sebabnya cuma satu baris di konsol — `SyntaxError: Unexpected identifier`
di `armada.js` — dan itu tercetak **lebih dulu**, jadi mudah terlewat.

**Tiga: efek yang digambar lalu langsung ditimpa.** Lapisan efek semula ada
di dalam `<svg>` papannya. Satu perintah memanggil `gambar()` lebih dari
sekali — sekali di dalam penangannya, sekali lagi sesudah masukan diterima —
dan penggambaran kedua menghapus lapisan yang baru saja diisi. Sinar
phasernya benar-benar dibuat, benar-benar dimasukkan ke DOM, dan hilang
dalam milidetik yang sama. Perbaikannya bukan menambah penjaga melainkan
**memisahkan lapisannya**: papan dan efek jadi dua `<svg>` yang bertumpuk di
sel grid yang sama, dengan `viewBox` identik. Setelah itu papan boleh
digambar ulang sesering apa pun.

> **Pelajarannya**, dan ini yang paling umum dari ketiganya: dua yang pertama
> **tidak menimbulkan galat di tempat yang salah**, dan yang ketiga tidak
> menimbulkan galat sama sekali. Ketiganya hanya bisa ditemukan dengan
> **melihat hasilnya**, bukan dengan membaca kodenya — sama seperti dua
> cacat tata letak di sesi 27 dan 28.

### Satu keputusan tata letak yang ikut berubah

Versi pertama menaruh petak dan papan status **berdampingan**, meniru layar
80×25. Begitu tiap sel berisi kapal dan bukan tiga aksara, pembagian itu
menyisakan ~31 px per sel dan seluruh detailnya hilang. Sekarang petaknya
mendapat seluruh lebar kolom (~59 px per sel) dan status pindah ke bawahnya.

Yang dipertahankan adalah **urutan** kedelapan pembacaannya — Stardate,
Condition, Quadrant, Sector, Photon torpedoes, Total energy, Shields,
Klingons remaining, persis baris 3880–3960 — bukan tempatnya. Tempatnya
lahir dari kenyataan bahwa `PRINT` hanya bisa maju ke kanan lalu turun; itu
kendala, dan kendala itu sudah tidak ada.

---

## 12 · Peta translasi

| Pola di BASIC | Padanan di port | Kenapa begitu |
|---|---|---|
| `Q$` + `MID$` di 4830/4990 | `S.QS` string 192 aksara + `taruh()`/`cocok()` | struktur datanya yang jadi temuan; diganti = hilang |
| `G(I,J)=K3*100+B3*10+S3` | angka yang sama, dibongkar di `masukKuadran()` | pengkodean terpaket dipertahankan |
| `DEF FND(D)=SQR(…)` | `Math.sqrt(…)` sebaris | parameternya **hiasan** — badannya memakai `I` global, jadi `FND(0)` dan `FND(1)` benda yang sama |
| `DEF FNR(R)=INT(RND(R)*7.98+1.01)` | `fnr()` | di sini parameternya **benar-benar** dipakai (argumen `RND`) — penulisnya tahu bedanya, sekali |
| `RND(0)` di 3380 | satu undian `r` dipakai dua kali | `RND(0)` di GW-BASIC **mengulang** nilai terakhir, jadi kerasnya pukulan dan cepatnya Klingon kehabisan tenaga berasal dari satu undian, bukan dua |
| `ON I GOTO 1720,1510,…` | larik fungsi `[nav, srs, lrs, …]` | bentuk tabel dipertahankan ([fondasi §2.8](_fondasi.md)) |
| `INPUT "…";X` di tengah rutin | `minta(teks, terima)` | satu pertanyaan menggantung, sama seperti satu `INPUT` |
| `GOSUB 4810` (baris berisi `RETURN` saja) | **tidak dipanggil** | menirunya berarti tidak memanggil apa pun — dan itulah yang terjadi |

---

## 13 · Bagaimana port ini diperiksa

- **Kalkulator arah lawan penggerak torpedo**: 4.032 pasangan, disapu ulang
  **di dalam halaman** saat dimuat, dan angkanya yang muncul di panel — bukan
  angka yang saya ketik. Nol luput, 4.032 sejajar.
- **Jarak Euclid lawan langkah Chebyshev**: tabel selisihnya juga dihitung di
  halaman.
- **Peta nama** dibangkitkan dari kaidah 5040/5140/5230 sendiri lalu
  dibandingkan dengan versi yang seharusnya; sel merah dan ketiga angkanya
  (52 / 22 / 12) semuanya hasil hitungan.
- **Klingon tidak menembak duluan**: empat puluh perintah NAV di kuadran
  berisi dua Klingon bertenaga penuh, perisai 500 → 500, nol *ENTERPRISE HIT*.
- **Jebakan perisai**: perisai 99.999 lalu NAV warp 1 → *Insufficient energy*,
  kapal tidak bergerak. Bisa dibatalkan dengan `SHI` lalu `0`.
- **"Klingon8 left"** disusun langsung: `K9 = 1` sesudah sebuah perintah NAV.
- **`BAS NAV` tanpa starbase** dengan `W1 = 3`, `X = 250` → *Direction =
  8.995918, Distance = 245.002*.
- **Tata letak** diukur pada 1400, 1100, 1000, 860, 760, 640, 520, 420, dan
  360 px: nol elemen keluar dari wadahnya di semuanya. (Versi pertama gagal di
  ≤520 px karena kolom status memakai `minmax(max-content, auto)`; sekarang
  `.st-atas` menyusun ulang menurut lebar **kotaknya**, bukan lebar jendela —
  media query tidak bisa melihat kolom sempit di jendela lebar.)

Satu hal yang **tidak** bisa diperiksa dari sini: apakah GW-BASIC memangkas
atau membulatkan indeks larik pecahan di `C(C1,1)`. Port ini **memangkas**,
dan alasannya dinyatakan: itu satu-satunya bacaan yang membuat arah pecahan —
dan karena itu seluruh fitur `TOR DATA` yang penulisnya tulis sendiri —
berfungsi. Kalau ia membulatkan, tiap arah pecahan meleset satu petak arah,
dan keraguan di manualnya justru benar.

---

## 14 · Latihan

1. Tekan **F8** lalu ketik `TOR`. Catat arah dan jaraknya, lalu tekan **F5**
   dan masukkan arah itu apa adanya — termasuk pecahannya. Torpedonya akan
   mengenai. Coba lima kali dari posisi berbeda.
2. Sekarang pakai angka **Distance** untuk memilih warp (jarak ÷ 8) menuju
   Klingon diagonal. Anda akan melewatinya. Bandingkan dengan jumlah petak
   yang sebenarnya.
3. Masuk ke kuadran Condition RED dan **jangan menembak**. Terbang berkeliling
   dua puluh kali. Perisai Anda tidak akan berkurang sedikit pun.
4. Tekan **F6** dan minta perisai sepuluh kali lipat energi Anda. Baca
   penolakannya, lalu lihat papan angka. Lalu coba **F1** NAV.
5. Perhatikan *Nama kuadran* di papan status selama berkeliling. Dua belas
   dari 64 kuadran akan menyala merah — kolom 4 seluruhnya, dan baris 5.
6. Berlabuh di starbase. Baris *Condition* akan menampilkan nilai lama plus
   `⟨CC$="docked"⟩`: kata yang ditulis programnya sekali dan tidak pernah
   dibaca.
7. Tekan **F8** lalu `BAS` di kuadran **tanpa** starbase, sesudah sebuah
   perintah NAV dan sebuah tembakan phaser. Arah dan jaraknya dihitung ke
   titik (faktor warp, unit phaser).

---

[Katalog port](../index.html) · [Fondasi](_fondasi.md) ·
[Analisis BASIC aslinya](../../reviews/STARTREK.md) ·
[Manual asli 1981](../../docs/STARTREK.DOC) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
