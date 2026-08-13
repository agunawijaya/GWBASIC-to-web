# WIZARD — sebuah perbandingan bukan benar/salah, ia angka

> Port web: [`web/games/wizard/`](../games/wizard/index.html) ·
> Sumber: [`run/WIZARD.BAS`](../../run/WIZARD.BAS) (944 baris) ·
> Analisis BASIC: [`reviews/WIZARD.md`](../../reviews/WIZARD.md)

*The Wizard's Castle.* Joseph R. Power untuk Exidy Sorcerer, terbit di
**Recreational Computing** Juli/Agustus 1980; diport ke Heath Microsoft BASIC
oleh J.F. Stetson; disket **IPCO 2039-A**. Sembilan ratus empat puluh empat
baris — terpanjang kedua di koleksi ini sesudah `TEMPLE`.

Sebuah roguelike lengkap sebelum kata itu ada: delapan lantai, masing-masing
8×8 kamar, dua belas jenis monster, delapan harta, pedagang, kutukan, kolam
ajaib, dan satu Orb of Zot yang harus dibawa keluar hidup-hidup.

---

## 1 · Satu gagasan menjalankan seluruh program

Di BASIC, sebuah perbandingan **bukan** nilai benar/salah — ia **angka**:
`-1` kalau benar, `0` kalau salah. Power memakai itu di mana-mana, dan
hasilnya program 944 baris yang hampir tidak pernah bercabang.

Empat dari lima `DEF FN`-nya adalah gagasan yang sama dipadatkan:

```basic
1140 DEF FNA(Q)=1+INT(RND(1)*Q)          ' dadu
1150 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))        ' lingkar 1..8, tanpa IF
1160 DEF FNC(Q)=-Q*(Q<19)-18*(Q>18)      ' min(Q,18), tanpa IF
1170 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y       ' (lantai,baris,kolom) -> 1..512
1180 DEF FNE(Q)=Q+100*(Q>99)             ' buang penanda "belum terlihat"
```

`FNB` yang paling padat. Untuk `Q=9` ia menghitung `9 + 8*(-1 - 0) = 1`;
untuk `Q=0`, `0 + 8*(0 - (-1)) = 8`; untuk yang lain, `Q + 8*0 = Q`. **Itu
aritmetika torus dalam sebelas aksara**, dan akibatnya petak 8×8-nya
melingkar: berjalan ke timur dari kolom 8 membawa Anda ke kolom 1.

`FNC` sama: `-Q*(Q<19)` menghasilkan `Q` kalau `Q<19` (karena dikali −1) dan
`0` kalau tidak; `-18*(Q>18)` menghasilkan 18 kalau `Q>18`. Jumlahnya
`min(Q,18)` — batas atas semua atribut, tanpa satu pun `IF`.

Idiom yang sama meresap ke seluruh badan program:

| baris | yang ditulis | artinya |
|---|---|---|
| 3900 | `X=X+(O$="N")-(O$="S")` | gerak, tanpa satu pun `IF` |
| 2480 | `AV=-3*(O$="P")-2*(O$="C")-(O$="L")` | huruf jadi angka 0..3 |
| 3040 | `C(Q,4)=-(C(Q,1)=X)*(C(Q,2)=Y)*(C(Q,3)=Z)` | **DAN** tiga arah = perkalian |
| 4860 | `ON (1-(ST<1)) GOTO 2920,8840` | `if/else` jadi lompatan berindeks |
| 8400 | `VF=VF+(L(FND(Z))=25)` | menyuap pedagang membatalkan kemarahannya |

Baris 4860 pantas dibaca dua kali. `ST<1` bernilai −1 kalau benar, jadi
`1-(-1) = 2` dan `ON … GOTO` mengambil cabang **kedua** (mati); kalau salah,
`1-0 = 1`, cabang pertama (lanjut). Sebuah `if/else` yang ditulis sebagai
tabel lompat dua entri.

Port ini **mempertahankan idiomnya** lewat satu fungsi:

```js
/** Nilai sebuah perbandingan di BASIC: -1 kalau benar, 0 kalau salah. */
const b = (c) => (c ? -1 : 0);
```

Meratakannya jadi `if/else` akan menghapus justru hal yang membuat program
ini layak dibaca — dan menyembunyikan satu cacatnya, yang lahir dari **tanda**
idiom itu sendiri (§3).

---

## 2 · Petanya membuka seluruh lantai, dan komentarnya tahu

```basic
1310 L(Q)=101                  ' semua 512 kamar: kode+100 = belum terlihat
4140 Q=L(FND(Z))
4150 IF Q > 99 THEN Q=Q-100    ' LET Q=34 TO HIDE ROOMS
4170 PRINT " ";I$(Q);"   ";
…
9550 DATA X,"?",NO WEAPON," SANDWICH"
```

`L()` menyimpan "belum terlihat" sebagai **kode + 100**, dan baris 1310
mengisi seluruh kastel dengan `101` = kamar kosong + 100. Baris 4150
seharusnya menyembunyikan kamar yang belum dikunjungi. Yang ditulis justru
**membukanya** — dan komentar di baris yang sama menyebutkan perbaikannya.

`DATA` di baris 9550 bahkan sudah menyediakan entri ke-34 (`X` / `?`) khusus
untuk itu. Semuanya siap; satu pernyataan menghubungkannya, dan pernyataan
itu tidak ditulis.

Kabutnya sendiri **dipelihara dengan benar** oleh enam baris — 1180, 3000,
4390, 4690, 5540, 6000 — dan tidak satu pun dari mereka pernah dibaca untuk
peta. Yang ikut mati:

| yang jadi tak berguna | baris |
|---|---|
| suar (`FLARE`) — membuka 3×3 di sekeliling | 4320–4460 |
| lampu (`LAMP`) — membuka satu kamar bersebelahan | 4520–4720 |
| kutukan *Forgetting* — menyembunyikan ulang satu kamar acak | 2970–3050 |
| *Green Gem* — penangkal kutukan itu | 3780–3810 |

Empat mekanik, satu barang yang dibeli dengan emas, satu kutukan, dan satu
harta — semuanya dinetralkan oleh satu baris yang tidak berbunyi.

### 2a · Satu-satunya penyimpangan aturan main di port ini

Keputusan (c) di [fondasi](_fondasi.md) berbunyi: **aturan main dipertahankan
persis**, dan perbaikan hanya untuk yang jelas-jelas bug. Di sini saya
menyimpang, dan penyimpangannya dinyatakan alih-alih disamarkan:

> **Port ini menyalakan kabutnya sebagai bawaan.**

Alasannya bukan selera. Dengan kabut mati — perilaku disket 1980 — **empat
mekanik yang dibangun lengkap tidak berguna sama sekali**: suar yang dibeli
dengan emas, lampu seharga 20 GP, kutukan *Forgetting*, dan *Green Gem* yang
menangkalnya. Yang tersisa bukan permainan yang lebih mudah melainkan
permainan yang **berbeda**: sebuah kastel yang seluruh isinya terlihat dari
giliran pertama, tempat satu-satunya yang belum diketahui adalah letak Orb.

Ini juga bukan tebakan tentang maksud penulisnya. Komentar di baris 4150
menyebut perbaikannya, dan `DATA` 9550 menyediakan entri `?` khusus untuk
itu; keduanya ditulis oleh orang yang sama yang menerbitkan program ini.

Saklar **`LET Q=34`** di bawah layar mengembalikan perilaku 1980 **persis** —
matikan, tekan `M`, dan seluruh lantai terbuka. Yang berubah cuma nilai
bawaannya; kedua perilaku ada, dan keduanya satu klik.

---

Dengan kabut menyala, tekan `M`:

```
 ?    ?    ?   <E>   ?    ?    ?    ?
 ?    ?    ?    ?    ?    ?    ?    ?
 …
```

Tekan `F` sekali, lalu `M` lagi:

```
 ?    ?    F   <E>   .    ?    ?    ?
 ?    ?    S    O    S    ?    ?    ?
 …
 ?    ?    .    M    V    ?    ?    ?      <- baris ke-8
```

Perhatikan baris terakhir. Suar membuka 3×3 di sekeliling Anda, dan karena
Anda ada di **baris 1**, sepertiga bawah petaknya muncul di **baris 8**.
Itu `FNB` bekerja: petaknya torus, dan suar tidak tahu apa-apa soal tepi.

---

## 3 · Empat ras yang jumlah nilainya sama persis

```basic
2120 IF LEFT$(R$(Q),1)=O$ THEN RC=Q : ST=ST+2*Q : DX=DX-2*Q
2150 OT=OT+4*(RC=1)
9580 DATA HOBBIT,ELF,MAN,DWARF
```

| ras | Q | ST | DX | **ST+DX** | titik bebas |
|---|--:|--:|--:|--:|--:|
| HOBBIT | 1 | 4 | 12 | **16** | **4** |
| ELF | 2 | 6 | 10 | **16** | 8 |
| MAN | 3 | 8 | 8 | **16** | 8 |
| DWARF | 4 | 10 | 6 | **16** | 8 |

`ST` mulai dari 2 dan `DX` dari 14, lalu `+2Q` dan `−2Q`. Keduanya saling
meniadakan: **`ST+DX` selalu 16, apa pun rasnya.** Jadi satu-satunya yang
benar-benar membedakan keempat ras adalah **jumlah titik bebas**.

Dan baris 2150 memberi Hobbit **empat titik lebih sedikit**, bukan lebih
banyak. `(RC=1)` bernilai −1, jadi `OT+4*(RC=1)` **mengurangi**. Untuk
menambah, tandanya harus `OT-4*(RC=1)`.

Hasilnya Hobbit **didominasi ketat**: nilai dasarnya sama dengan yang lain,
titik bebasnya separuh, dan tidak ada satu kalimat pun di layar yang
menyebutkannya. Diperiksa di port ini: pilih HOBBIT, dan permintaan pembagian
titik berhenti setelah 4.

> **Pelajarannya.** Idiom yang membuat program ini elegan adalah juga yang
> membuat cacat ini tak terlihat. Sebuah tanda minus yang hilang tidak
> menghasilkan galat, tidak menghasilkan peringatan, dan tidak menghasilkan
> perilaku yang jelas salah — cuma ketidakadilan yang diam. Kode yang padat
> menyembunyikan kesalahan dengan cara yang berbeda dari kode yang bertele-
> tele: bukan di dalam tumpukan, melainkan di dalam **tanda**.

---

## 4 · Seluruh syarat kemenangan ada di satu baris

```basic
1960 Q=109                    ' Orb DISIMPAN sebagai kamar "warp" biasa
6080 IF Q > 9 GOTO 6110
6090 IF (O(1)=X) AND (O(2)=Y) AND (O(3)=Z) THEN ON (1-(O$="T")) GOTO 3900,9370
5650 IF RF <> 0 GOTO 5690     ' teleport butuh Runestaff
```

Orb of Zot disimpan sebagai kamar **warp** — kode 109, sama persis dengan 24
warp jebakan lainnya di kastel. Di peta ketiganya bertanda `W`, dan layar
bantuan aslinya menuliskannya apa adanya: *"W = WARP/ORB"*.

Baris 6090 memutuskan mana yang terjadi. `O$` berisi perintah terakhir; kalau
ia `"T"`, perbandingannya −1, `1−(−1)=2`, dan `ON…GOTO` mengambil cabang
**kedua** — Anda menemukan Orb. Untuk perintah lain nilainya 1, cabang
pertama, dan Anda terlempar ke kamar acak.

Jadi rantai kemenangan seluruh permainan — bunuh monster pembawa Runestaff,
pandang bola kristal sampai ia menyebut letak Orb, teleport **tepat** ke
sana, lalu keluar lewat pintu masuk di lantai 1 — dinyatakan dalam **satu
baris**, lewat sebuah perbandingan yang dipakai sebagai indeks.

### 4a · Dan bola kristalnya berbohong 62,5 % waktu

```basic
5590 A=FNA(8) : B=FNA(8) : C=FNA(8)
5600 IF FNA(8) < 4 THEN A=O(1) : B=O(2) : C=O(3)
5610 PRINT "***THE ORB OF ZOT*** AT (";A;",";B;") LEVEL";C;"!"
```

Tiga koordinat **acak dibuat lebih dulu**, lalu 3 dari 8 kemungkinan
menimpanya dengan letak Orb yang sebenarnya. Petunjuknya benar **37,5 %**
waktu — disimulasikan 200.000 kali: 37,63 %, selisihnya tebakan acak yang
kebetulan tepat (1 dari 512).

Dan tidak ada apa pun di layar yang membedakan petunjuk benar dari petunjuk
palsu. Satu-satunya cara memastikannya adalah teleport ke sana dan lihat —
yang butuh Runestaff, dan kalau salah berarti mendarat di kamar acak.

---

## 5 · Tiga hal dalam satu blok DATA, dan dua tabel dalam satu larik

```basic
1340 FOR Q=1 TO 8 : READ W$(Q),E$(Q) : NEXT Q
9550 DATA X,"?",NO WEAPON," SANDWICH"
9560 DATA DAGGER," STEW",MACE," SOUP",SWORD," BURGER",NO ARMOR," ROAST"
9570 DATA LEATHER," FILET",CHAINMAIL," TACO",PLATE," PIE"
5960 PRINT "WEAPON = ";W$(WV+1);"  ARMOR = ";W$(AV+5)
```

| Q | `W$(Q)` | `E$(Q)` | |
|--:|---|---|---|
| 1 | NO WEAPON | SANDWICH | ← senjata, `WV+1` |
| 2 | DAGGER | STEW | |
| 3 | MACE | SOUP | |
| 4 | SWORD | BURGER | |
| 5 | NO ARMOR | ROAST | ← baju zirah, `AV+5` |
| 6 | LEATHER | FILET | |
| 7 | CHAINMAIL | TACO | |
| 8 | PLATE | PIE | |

`W$` berisi **empat senjata lalu empat baju zirah** di satu larik delapan,
dan `+5` di baris 5960 adalah jahitannya. Sementara `E$` — daftar lelucon
makanan yang dipakai waktu Anda memakan monster yang baru dibunuh — ikut
terbaca di gelung `READ` yang sama.

Jadi satu blok `DATA` memuat tiga hal yang sama sekali tidak berhubungan, dan
yang memisahkannya cuma **urutan**. Menyisipkan satu senjata baru akan
menggeser nama baju zirah *dan* menu makanannya sekaligus.

---

## 6 · Monster tanpa tabel monster

```basic
6180 A=L(FND(Z))-12
7390 Q1=1+INT(A/2) : Q2=A+2 : Q3=1
```

| monster | A | serang | darah |
|---|--:|--:|--:|
| KOBOLD | 1 | 1 | 3 |
| ORC | 2 | 2 | 4 |
| … | | | |
| BALROG | 11 | 6 | 13 |
| DRAGON | 12 | 7 | 14 |
| **VENDOR** | 13 | 7 | **15** |

Serangan dan darah tiap monster diturunkan dari **satu angka**: urutannya di
`DATA`. Tidak ada tabel serangan, tidak ada tabel darah, tidak ada satu pun
angka keseimbangan yang ditulis tangan.

Perhatikan barisnya: **lawan terkuat di permainan ini adalah toko.** Pedagang
menempati slot 13 hanya karena ia kebetulan tertulis sesudah naga, dan
rumusnya tidak tahu bedanya.

Menyisipkan satu monster di tengah daftar akan menggeser seluruh kurva
kesulitan tanpa satu baris pun perlu diubah — hemat, dan sekaligus membuat
penyetelan mustahil.

---

## 7 · Tidak ada satu pun RANDOMIZE

```basic
1250 Q=RND(1)
```

Di seluruh 944 baris **tidak ada `RANDOMIZE`**. Tanpa itu, `RND` di GW-BASIC
selalu mulai dari benih yang sama: **kastel pertama tiap kali program
dijalankan identik.**

Bandingkan dengan sisa koleksi:

| program | ruang benih |
|---|--:|
| `WILDCAT`, dan 27 program lain | 60 |
| `STARTREK` | 119 |
| `DROIDS` | 3.600 |
| `METEOR` | 32.003 |
| **`WIZARD`** | **1** |

Baris 1250 membuang satu bilangan acak, yang tidak mengubah apa pun. Kastel
*kedua* dan seterusnya berbeda, karena baris 9320 kembali ke 1240 tanpa
memulai ulang deretnya — jadi permainan kedua di satu sesi terasa acak, dan
permainan pertama tidak pernah begitu.

---

## 8 · Bagaimana kastelnya ditata

```basic
1530 L(FND(1))=2                      ' pintu masuk di (1,4) lantai 1
1540 FOR Z=1 TO 7
1560   Q=104 : GOSUB 9590             ' tangga turun di kamar kosong acak
1580   L(FND(Z+1))=103                ' tangga naik di (X,Y) yang SAMA
```

Baris 1580 menulis **tanpa memeriksa** apakah kamar di lantai atasnya kosong.
Itu aman hanya karena lantai `Z+1` belum diisi apa pun pada saat itu — dan
akibat sampingannya jadi aturan permainan: **tangga naik selalu tepat di
atas tangga turun.**

Disimulasikan, isi kastelnya:

| | jumlah kamar |
|---|--:|
| kamar kosong | 161 |
| monster (12 jenis × 8 lantai) | 96 |
| kolam / peti / emas / suar / lubang / bola / buku | 24 masing-masing |
| warp | **25** — 24 jebakan + **Orb of Zot** |
| pedagang | 24 |
| tangga naik + turun | 28 |
| harta | 8 |
| pintu masuk | 1 |
| **terisi** | **351 dari 512** |

Satu lagi yang mudah terlewat:

```basic
6110 IF Q=10 THEN Z=FNB(Z+1) : GOTO 5920
```

Lubang memakai `FNB`, jadi jatuh ke lubang di **lantai 8 membawa Anda ke
lantai 1**. Kastelnya melingkar tegak juga — tapi hanya lewat lubang. Tangga
memakai `Z-1`/`Z+1` polos, dan aman hanya karena penataan di 1540–1600 tidak
pernah menaruh tangga naik di lantai 1 maupun tangga turun di lantai 8.

---

## 9 · Sisa-sisa yang tertinggal di listing

| baris | apa | keadaannya |
|---|---|---|
| 4240–4250 | `PRINT ") LEVEL";Z : GOTO 2920` | baris 4230 berakhir `GOTO 4470` dan tak ada satu pun lompatan ke 4240 — **tak terjangkau**. Sisa dari versi peta yang lebih lama |
| 9960–9980 | `INPUT O$ : Q=INT(VAL(O$)) : RETURN` | subrutin yang **tidak pernah dipanggil**; kembarannya di 9990–10060 punya pemeriksaan 1..8 dan itulah yang dipakai |
| 1010 | `SAMP$="YES"` | **bukan** mati — itu **titik masuk kedua**, dipakai `CHAIN "SAMPLES",1000` di baris 10180. Nomor baris sebagai antarmuka publik, sama seperti `MORTGAGE.BAS` ([fondasi §2.7](_fondasi.md)) |

Tapi `SAMPLES.BAS` **tidak ada di koleksi ini**. Baris terakhir program
menunjuk ke berkas yang hilang — separuh program yang lenyap untuk kesekian
kalinya, sesudah [CHECK](check.md) yang meluncurkan `info.sys` dan
`DRAW.EXE` yang hilang dari [DRAW](draw.md).

---

## 10 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Kastel | `DIM L(512)` + `FND(Q)=64*(Q-1)+8*(X-1)+Y` | Larik tiga dimensi mahal di BASIC; satu larik datar dan sebuah rumus indeks jauh lebih murah | **Dipertahankan persis** — larik 512 dan rumus yang sama. Ini pengkodean indeks yang masih dipakai di mana-mana (baris-mayor di C, `y*lebar+x` di buffer piksel) |
| Kabut | kode + 100 di larik yang sama | Tidak ada larik boolean terpisah yang murah | Mekanismenya **dipertahankan persis**. Yang berubah cuma **nilai bawaannya**: port ini menyalakan kabut, disket 1980 mematikannya. Satu-satunya penyimpangan aturan main di sini, dan saklar `LET Q=34` mengembalikan perilaku aslinya — lihat §2a |
| Perbandingan sebagai angka | `X=X+(O$="N")-(O$="S")` | `IF` memakan satu baris dan waktu penafsir; aritmetika tidak | **Dipertahankan** lewat `b(c) => c ? -1 : 0`. Meratakannya akan menghapus temuannya |
| `ON (1-(ST<1)) GOTO a,b` | tabel lompat dua entri | Tidak ada `if/else` sungguhan | Ditulis sebagai `if` biasa di JS, **tapi nilai `1-b(...)`-nya tetap dihitung** di tempat yang penting (baris 6090), karena di situlah ia jadi aturan permainan |
| Kamar = satu huruf | `. E U D P C G F W S O B M V T ?` | Peta 8×8 harus muat di layar teks bersama sisa antarmukanya | **Digambar** sebagai SVG di `kastil.js` — enam belas simbol 100×100 dipakai lewat `<use>`. **Hurufnya tetap dicetak di pojok tiap petak**, karena huruf itulah bahasa layar bantuan di 3700–3740 |
| `RND` tanpa `RANDOMIZE` | satu kastel | Tidak ada sumber entropi, dan penulisnya tidak memakai jam sama sekali | `crypto.getRandomValues` + mulberry32 ([fondasi §2.6](_fondasi.md)), **dan nomor benihnya ditampilkan** sehingga sebuah kastel bisa diulang dengan sengaja |
| `INPUT` di tengah rutin | REPL yang memblokir | Tidak ada konsep asinkron | `minta(teks, terima)` — satu pertanyaan menggantung, plus barisan tombol yang berubah mengikuti pilihan yang sah saat itu |
| Cacat aturan (Hobbit, peta, monster=toko) | — | — | **Tidak diperbaiki**, sesuai keputusan (c) di [fondasi](_fondasi.md). Yang dilakukan port adalah **menunjukkannya** |

---

## 11 · Bagaimana port ini diperiksa

- **Penataan kastel** disimulasikan terpisah di Python: 351 kamar terisi dari
  512, 25 warp (24 jebakan + Orb), 96 monster, tangga naik selalu tepat di
  atas tangga turun.
- **Bola kristal**: 200.000 undian → benar 37,63 %, cocok dengan
  3/8 + 5/8×1/512 yang dihitung dari kode.
- **`ST+DX = 16`** diperiksa untuk keempat ras; **Hobbit mendapat 4 titik**
  diverifikasi dengan memainkannya di port (permintaan pembagian titik
  berhenti setelah 4).
- **Saklar kabut** diuji di kedua kedudukannya: menyala → peta penuh `?`
  kecuali kamar sekarang; satu suar lalu membuka 3×3 yang **melingkar ke
  baris 8** (dua temuan terlihat sekaligus); dimatikan → seluruh 64 kamar
  terbaca dari giliran pertama, persis perilaku 1980.
- **Tata letak** diukur pada 1400, 1100, 1000, 860, 760, 640, 520, 420, dan
  360 px: nol elemen keluar dari wadahnya.

Dan satu kesalahan dalam pengerjaannya yang layak dicatat, karena ia
**pengulangan**: versi pertama `kastil.js` memberi nama `wz-bola`,
`wz-lubang`, dan `wz-warp` kepada gradien **sekaligus** simbolnya —
persis kesalahan `id` ganda yang sudah didokumentasikan di
[STARTREK §11a](startrek.md) satu sesi sebelumnya, dan yang peringatannya
sudah ditulis di kepala berkas ini sebelum kodenya diketik.

Yang menangkapnya bukan ingatan melainkan **pemeriksa enam baris** yang
menghitung `id` ganda sebelum halamannya dibuka sama sekali:

```python
ids = re.findall(r'id="([\w-]+)"', s)
ganda = [k for k, v in Counter(ids).items() if v > 1]
```

> **Pelajarannya.** Peringatan yang ditulis untuk diri sendiri tidak mencegah
> apa pun — saya menulisnya, lalu melanggarnya di berkas yang sama. Yang
> mencegah adalah **pemeriksaan yang dijalankan**, sekecil apa pun. Ini
> bentuk lain dari pelajaran §2 program ini sendiri: mekanisme yang
> dipelihara tapi tidak pernah dibaca sama saja dengan tidak ada.

---

## 12 · Latihan

1. Pilih **HOBBIT**. Hitung berapa titik bebas yang ditawarkan. Lalu mulai
   ulang dan pilih **DWARF**. Bandingkan `ST+DX` keduanya.
2. Tekan `M` di lantai 1, giliran pertama. Anda melihat kabut — semua `?`
   kecuali kamar tempat Anda berdiri.
3. **Matikan** saklar **`LET Q=34`** dan tekan `M` lagi. Seluruh lantai
   terbuka: itulah yang dilakukan disket 1980, dan itu satu baris kode.
4. Nyalakan lagi, lalu tekan `F` sekali dan `M`. Perhatikan **baris 8** ikut
   terbuka: petaknya torus, dan suar tidak tahu apa-apa soal tepi.
5. Berjalan ke timur dari kolom 8. Anda muncul di kolom 1 — itu `FNB`.
6. Cari bola kristal (`O`) dan tekan `G` sepuluh kali. Beberapa kali ia akan
   menyebutkan letak Orb of Zot. Rata-rata **kurang dari empat** di antara
   sepuluh itu benar, dan tidak ada cara membedakannya.
7. Serang seorang pedagang. Perhatikan angka darahnya: 15 — lebih tinggi
   daripada naga.

---

[Katalog port](../index.html) · [Fondasi](_fondasi.md) ·
[Analisis BASIC aslinya](../../reviews/WIZARD.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
