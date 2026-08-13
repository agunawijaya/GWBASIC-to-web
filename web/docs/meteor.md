# METEOR — dari Creative Computing 1981 ke web

> `run/METEOR.BAS` · Edward T. Ordman, November 1981 · terbit di
> *Creative Computing* Vol. 8 No. 8, hlm. 178–185 · 80 baris, 6 subrutin
> · [pakai portnya](../games/meteor/index.html) ·
> [analisis BASIC aslinya](../../reviews/METEOR.md)

Program ini ditulis untuk **dicetak di majalah dan diketik ulang pembaca**, dan
itu terlihat di seluruh bentuknya: 32% barisnya komentar — rasio tertinggi di
koleksi — dan enam subrutinnya diberi nama yang menyebut variabel yang dipakai.

Tapi yang membuatnya layak dibaca hari ini bukan kerapiannya. Ada tiga hal.

---

## 1 · Seluruh dunianya ada di layar

Cari larik sasaran di 80 baris program ini. Tidak ada — **tidak ada larik apa
pun**. Baloknya cuma aksara yang tercetak, dan satu-satunya cara program tahu
ada balok di suatu tempat adalah menanyakannya kembali:

```basic
370 IF SCREEN(Y,X)=219 THEN C2=-1:SOUND 660,2:GOSUB 740   ' meteor
700 IF SCREEN(HY,HX)=219 THEN SOUND 440,1:C2=10:GOSUB 740 ' pemain
710 IF SCREEN(HY,HX)=25  THEN SOUND 420,1:C2=2 :GOSUB 740 ' pemain
```

Meteor dan pemain memakai **pertanyaan yang sama persis**. Tidak ada "daftar
balok" yang dibaca salah satunya dan tidak dibaca yang lain; ada satu petak
aksara, dan keduanya bertanya ke sana.

### Yang membuatnya lebih dari sekadar penghematan

Karena `LOCATE:PRINT` **menyimpan sekaligus menggambar**, maka menimpa berarti
menghancurkan. Wajah yang melewati balok menuliskan `CHR$(2)` ke sel itu, dan
baloknya lenyap dari satu-satunya tempat ia pernah ada.

Itu bukan efek samping — **itu aturan mainnya**. Petunjuk baris 990 berbunyi
*"SEE IF YOU CAN ERASE THE SOLID BLOCKS"*, dan "menghapus" di sini harfiah:
menimpa selnya.

| Kode | Glif | Yang disimpannya |
|--:|:-:|---|
| 2 | `☻` | wajah pemain |
| 25 | `↓` | jejak meteor — **tidak pernah dihapus meteor** |
| 219 | `█` | balok sasaran |
| 178 | `▓` | arsiran pesan `BANG` |

Perhatikan baris kedua. Meteor menaruh panah dan **tidak pernah membereskannya**,
jadi layar makin lama makin penuh sampah. Yang membereskan cuma pemain, dan ia
dibayar **+2** untuk itu. Satu keputusan rancangan yang seluruhnya lahir dari
"layar adalah satu-satunya penyimpanan": kalau ada larik, jejaknya tak perlu ada
sama sekali.

### Port ini menirunya, bukan menggantinya

Ada petak `Int16Array(80×25)` berisi kode aksara. `set()` satu-satunya penulis,
`at()` satu-satunya pembaca, dan tabrakan dihitung dengan menanyakan petak.

Dan karena di aslinya menyimpan dan menggambar adalah **satu** tindakan, di sini
`set()` juga begitu: ia mengubah petak **dan** memperbarui simpul SVG selnya.
Tidak ada langkah "gambar ulang semuanya" — kalau ada, port ini akan punya dua
sumber kebenaran yang bisa menyimpang, dan seluruh alasan §1 ada akan hilang.

### Diverifikasi

Papan awal dihitung dari baris 860–870 lalu dicacah dari petak, untuk kelima
tingkat kesulitan:

| C | Baris balok dari BASIC | Tercacah | Balok dari BASIC | Tercacah |
|--:|---|---|--:|--:|
| 1 | 11–23 | 11–23 | 195 | 195 |
| 3 | 9–21 | 9–21 | 195 | 195 |
| 5 | 7–19 | 7–19 | 195 | 195 |
| 7 | 5–17 | 5–17 | 195 | 195 |
| 9 | 3–15 | 3–15 | 195 | 195 |

195 = 13 baris × 3 kolom × 5 (`C5$`). Dan sekali angkanya **194**, sebabnya bisa
ditunjuk: baris 900 menggambar wajah **sesudah** baris 870 menggambar balok, jadi
pemain yang kebetulan mulai di atas balok **menghapusnya tanpa mendapat poin**.
Itu perilaku aslinya, dan port ini mempertahankannya.

Pembukuan kedua, dari satu ronde nyata: pemain melewati 4 balok, satu meteor
menimpa satu balok.

| Cara menghitung | Hasil |
|---|--:|
| Sensus petak: 194 − 4 − 1 | **189** |
| Tercacah dari petak | **189** |
| Aritmetika skor: 4×(+10) + 1×(−1) | **39** |
| Papan angka | **39** |

Dua pembukuan yang tidak saling tahu, cocok.

---

## 2 · Benih acak yang diaduk selama Anda berpikir

```basic
150 CLS:KEY OFF:PRINT "DO YOU WANT DIRECTIONS (Y/N)?":R=523
160 R$=INKEY$:IF R$="Y" THEN GOSUB 930:GOTO 180
170 IF R$="N" OR R$=CHR$(13) THEN 180 ELSE R=(R+511)MOD 32003:GOTO 160
180 RANDOMIZE R:REM SEED BASED ON DELAY IN ANSWERING QUESTION
```

Selagi menunggu jawaban, program **terus memutar benihnya**. Yang menentukan
benih akhir adalah berapa lama pemain berpikir — waktu reaksi manusia, sumber
entropi yang nyata dan gratis.

### Berapa banyak benih yang benar-benar bisa dicapai?

Bukan 32.003 begitu saja. Kalau `511` berbagi faktor dengan modulusnya, orbitnya
akan lebih pendek — misalnya kalau modulusnya 32.004, `gcd(511, 32004) = 7` dan
yang tercapai cuma seperujuhnya. Jadi angkanya harus dihitung:

```
32003 = 32003            (prima)
gcd(511, 32003) = 1
orbit dari R=523         = 32.003 nilai berbeda
```

Orbitnya melingkupi **seluruh 32.003 nilai**. Klaim majalahnya berdiri.

### Bandingannya, diukur di koleksi ini

Dari 83 berkas `.BAS`, **35** memanggil `RANDOMIZE`:

| Cara menyemai | Berkas | Benih mungkin |
|---|--:|--:|
| `RIGHT$(TIME$,2)` — detik saja | 27 | **60** |
| `MID$(TIME$,…)` — menit & detik | 8 | ≤ 3.600 |
| **METEOR** — `(R+511) MOD 32003` | **1** | **32.003** |

Dua puluh tujuh program memakai pola detik-saja: `RANDOMIZE
VAL(RIGHT$(TIME$,2))`. Enam puluh kemungkinan. Mainkan salah satunya dua kali
dalam detik yang sama dan Anda dapat permainan yang identik.

METEOR sendirian di barisnya, dan ia satu-satunya di seluruh koleksi yang
**memakai pemainnya sendiri sebagai sumber keacakan**.

### Di port

Sumbernya sama, cara memutarnya berbeda. Aslinya satu putaran = satu `INKEY$`
yang gagal, dalam gelung yang membakar prosesor. Di port satu putaran = satu
milidetik sejak halaman siap:

```js
const T0 = Date.now();
const benihSekarang = () => (523 + 511 * (Date.now() - T0)) % 32003;
```

Yang menentukan tetap berapa lama Anda berpikir sebelum menekan **Mulai** —
tanpa harus memutar CPU untuk mendapatkannya. Benih yang terpakai ditampilkan
di papan angka, supaya klaim di atas bisa dilihat langsung.

---

## 3 · Kendali selot, dan kenapa WASD tidak boleh ditambahkan

```basic
340 K$=INKEY$:IF K$<>"" THEN H$=K$      ' H$ IS LATCH
350 IF LEN(H$)>0 THEN GOSUB 570
590 IF LEN(H$)=1 THEN H$="":RETURN      ' aksara biasa -> berhenti
630 IF HH=77 THEN HX=HX+1:H$=K$:IF HX>80 THEN HX=1
```

Tombol panah di PC menghasilkan **dua** aksara lewat `INKEY$`: `CHR$(0)` diikuti
kode pindaian. Aksara biasa menghasilkan satu. Program memakai perbedaan panjang
itu sebagai seluruh model kendalinya:

| Yang ditekan | `LEN(H$)` | Akibatnya |
|---|--:|---|
| Panah | 2 | pindah satu sel, lalu **memasang selot lagi** — jalan terus |
| Huruf, angka, tanda baca | 1 | selot kosong — **berhenti** |
| Spasi | 1 | ditangkap lebih dulu di baris 580 — **jeda** |
| Tombol khusus lain (F1, Home…) | 2 | tidak cocok 77/75/80/72, selot tak dipasang lagi — **berhenti** |

Jadi wajahnya **tidak digerakkan dengan menahan tombol**. Satu ketukan panah
menyalakan gerak terus-menerus; apa pun yang lain mematikannya. Petunjuk aslinya
menyatakannya: *"ANY LETTER (AND SOME OTHER KEYS) WILL STOP CURSOR MOTION."*

> **Konsekuensinya untuk port, dan ini menarik.** Menambahkan WASD sebagai arah
> — hal yang wajar dilakukan di hampir semua port arkade — **akan menghapus
> separuh kendalinya**, karena di permainan ini huruf punya tugas: menghentikan.
> Kenyamanan yang biasanya gratis di sini berbiaya. Jadi tidak ditambahkan, dan
> alasannya ditulis di panel supaya tidak terlihat seperti kelalaian.

### Tepinya tidak simetris, dan itu ada di kodenya

```basic
630 IF HH=77 THEN HX=HX+1:H$=K$:IF HX>80 THEN HX=1   ' membungkus, selot dipasang
670 IF HH=80 AND HY<24 THEN HY=HY+1:H$=K$            ' di baris 24: TIDAK dipasang
```

Kiri/kanan membungkus dan memasang selot lagi. Atas/bawah di baris 1 dan 24
tidak memasang selot sama sekali — jadi wajah yang menyentuh tepi atas atau
bawah **berhenti sendiri**, sementara yang menyentuh tepi kiri atau kanan muncul
di sisi seberang dan terus berjalan. Dipertahankan persis.

### Diverifikasi

| Uji | Hasil |
|---|---|
| Satu ketukan `←`, 12 bingkai pada 30 langkah/dtk | wajah pindah **6 sel** = 6 langkah simulasi, satu sel per langkah |
| Lalu satu ketukan huruf `q`, 12 bingkai lagi | wajah pindah **0 sel** |

---

## 4 · Satu sel layar yang melahirkan tiga tambalan

Menulis ke sel pojok kanan-bawah memicu gulir di BASIC. Program ini menabraknya
di **tiga tempat berbeda**, dan menambalnya tiga kali:

```basic
375 IF Y=24 AND X=80 THEN X=79      ' meteor
690 IF HX=80 AND HY=24 THEN HY=23   ' wajah
460 HX=HX-4:IF HX>72 THEN HX=72     ' pesan BANG
```

Tiga baris dari delapan puluh — **3,75% programnya** — ada semata-mata untuk
menghindari satu sel.

Yang ketiga paling halus. Sekilas `IF HX>72 THEN HX=72` terlihat seperti
perataan pesan supaya tidak terpotong. Tapi angkanya bukan 72 karena estetika:
baris 500 mencetak `E8$` selebar **delapan** aksara di baris `HY+1`, dan
72 + 8 − 1 = **79**. Batas itu dipilih supaya pesan kematian berhenti tepat satu
kolom sebelum sel terlarang.

Dan ada pertahanan keempat yang tidak menyebut dirinya sama sekali. Ketiga teks
baris bantuan dicetak dari kolom 35, dan panjangnya diukur:

| Baris | Panjang | Kolom |
|--:|--:|---|
| 520 `    DEL = FINISH,  INS = PLAY AGAIN          ` | **45** | 35–79 |
| 760 `KEYS: INS=CONTINUE, DEL=STOP, ENTER=RESTORE  ` | **45** | 35–79 |
| 910 `     HIT SPACE BAR TO PAUSE                  ` | **45** | 35–79 |

Ketiganya **tepat 45**, dengan spasi bantalan yang berbeda-beda jumlahnya untuk
mencapainya. Tiga teks yang panjang isinya 31, 43, dan 22 aksara, semuanya
diganjal sampai berhenti di kolom 79. Port ini memotong di 45 supaya tetap
begitu.

> **Pelajaran.** Satu kendala perangkat keras yang tidak muncul di mana pun dalam
> aturan mainnya tetap membentuk **empat** tempat berbeda di kodenya, dan yang
> keempat sama sekali tidak terlihat seperti tambalan — ia cuma tiga string yang
> kebetulan sama panjang. Membaca kode lama tanpa tahu kendalanya akan membuat
> keempatnya terlihat seperti angka ajaib, atau lebih buruk: seperti tidak ada.

---

## 5 · Kesulitan yang menggeser, bukan mempercepat

```basic
230 HX=20+INT(40*RND+1):HY=16+INT(8*RND+1)   ' pemain: baris 17-24, kolom 21-60
860 FOR I=12-C TO 24-C                        ' balok
```

Angka kesulitan `C` **tidak muncul di satu pun** perhitungan kecepatan, jumlah
meteor, atau ukuran kotak tabrakan. Ia hanya menggeser ladang balok ke atas.

| C | Balok | Pemain mulai | Jarak naik minimum |
|--:|---|---|---|
| 1 | 11–23 | 17–24 | **0** — bertumpang |
| 5 | 7–19 | 17–24 | 0–5 baris |
| 9 | 3–15 | 17–24 | **2–9 baris** — seluruhnya di atas |

"Lebih sulit" di sini berarti **lebih jauh dari tempat aman**. Dan itu berpasangan
dengan baris 420:

```basic
420 IF Y>HY+1 THEN RETURN
```

Meteor berhenti digambar begitu melewati baris pemain. Sekilas cuma penghematan
— tidak ada gunanya menggambar sesuatu yang tak bisa lagi mengenai Anda. Tapi
akibatnya nyata: **makin tinggi posisi Anda, makin pendek jejak yang
tertinggal**, dan makin sedikit panah `+2` yang bisa dipungut.

Jadi kesulitan tinggi memaksa Anda naik, dan naik **memiskinkan sumber poin kedua
Anda**. Dua baris yang tak saling menyebut, bekerja sama membentuk keseimbangan
— dan kemungkinan besar tidak disengaja.

Diverifikasi: 1.280 bingkai melewati enam ronde, dengan sampai 299 panah di layar
sekaligus. Panah yang muncul di bawah baris `HY+1`: **nol**.

---

## 6 · Tombol skor tak terbatas, dan programnya mengumumkannya

```basic
580 IF H$=CHR$(32) THEN 760            ' spasi -> menu jeda
790 IF H$=CHR$(13) THEN 840            ' ENTER -> PUT TARGETS lagi
970 PRINT "THE SPACE BAR STOPS ALL ACTION TEMPORARILY, AND ALLOWS ";
975 PRINT "RESTORING TARGETS."
```

Menjeda lalu menekan `ENTER` menggambar ulang **seluruh** ladang balok, dan
skornya tidak diatur ulang. 195 balok senilai 1.950 poin bisa dipanen berkali-kali
tanpa batas.

Ini **bukan cacat**. Petunjuk di baris 970 menyebutnya terang-terangan sebagai
fitur, dan itu masuk akal untuk zamannya: skor adalah urusan Anda sendiri di
depan layar sendiri, bukan angka yang dibandingkan dengan orang lain. Papan skor
bersama belum ada; yang ada cuma keinginan main lebih lama.

Dipertahankan apa adanya, dan disebut di panel supaya pemain tahu itu memang
aslinya, bukan celah yang lolos dari port.

Diverifikasi: dijeda dengan 183 balok tersisa dan skor 43 → `ENTER` → **195**
balok, skor tetap **43**.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Penyimpanan dunia | petak aksara layar, `SCREEN(Y,X)` (§1) | tidak ada memori untuk larik 80×25 | **Ditiru persis.** `set()` satu-satunya penulis, `at()` satu-satunya pembaca. Mengganti dengan daftar objek akan lebih pendek **dan menghapus seluruh alasan program ini layak dibaca** |
| Menggambar vs menyimpan | satu tindakan (`LOCATE:PRINT`) | — | **Tetap satu tindakan**: `set()` mengubah petak dan simpul SVG selnya sekaligus. Tidak ada "gambar ulang semuanya" |
| Rupa sel | aksara CP437 | — | Digambar sebagai balok, panah, dan wajah. Tombol **Tampilan glif** mengembalikan aksaranya; keduanya membaca petak yang sama |
| Kecepatan | satu putaran perulangan penafsir | tidak ada pewaktu | Penggeser baris/detik, bawaan **30**. Yang **dipertahankan persis** adalah rasionya: satu langkah simulasi = satu baris meteor = paling banyak satu sel gerak wajah. Angka mutlaknya selera, rasionya bukan |
| Benih acak | `(R+511) MOD 32003` diputar `INKEY$` (§2) | tidak ada jam berresolusi tinggi | **Rumus sama, pemutar berbeda**: satu putaran per milidetik, bukan per polling. Sumber entropinya tetap lama Anda berpikir |
| Kendali | selot `H$`, panah menyalakan gerak terus-menerus (§3) | `INKEY$` mengembalikan 1 atau 2 aksara | **Dipertahankan persis**, termasuk asimetri tepinya. **WASD sengaja tidak dipasang** — huruf punya tugas menghentikan |
| Tambalan sel (24,80) | tiga baris (§4) | `PRINT` di sel terakhir memicu gulir | **Ketiganya dipertahankan**, termasuk potongan 45 aksara di baris bantuan. Membuangnya menghapus jejak kendala yang membentuk kodenya |
| Isi ulang sasaran | `ENTER` saat jeda (§6) | — | **Dipertahankan**, berikut skor tak terbatasnya. Aslinya mengumumkannya sebagai fitur di baris 970 |
| Nyawa | satu; kena sekali, selesai | — | **Dipertahankan** |
| Pesan `BANG` | ditulis ke petak layar (500) | — | **Ditulis ke petak juga**, bukan dilapiskan di atasnya. Ia bagian dari dunia, dan meteor berikutnya bisa menimpanya |
| Lebar halaman | — | — | **Dilonggarkan jadi 1.320px** pada layar ≥1.400px, khusus halaman ini. Papan 80 kolom pada lebar bersama 1.100px cuma 7,4×11,8px per sel; pada 1.320px jadi 9,1×14,6 — sama dengan sel aksara VGA yang ditirunya. Penyimpangan dari lebar bersama, dan disengaja: program lain 40 kolom dan tidak membutuhkannya |
| Kepala meteor & pijar | tidak ada | — | **Tambahan, dinyatakan begitu.** Tapi ia mengumumkan sesuatu yang nyata: sel yang baru saja ditulis meteor. Kalau ia melenceng dari panah terbawah, penggambar garisnya salah |
| Guncangan layar, serpihan, angka melayang | tidak ada | — | **Tambahan, murni hiasan.** Tidak satu pun menyentuh petak |
| Keluar | `LOAD "MENU",R` | tiap program berkas terpisah | Tautan kembali di bilah atas |

Empat baris terakhir adalah tambahan, dan dinyatakan begitu. Sisanya mengikuti
aslinya.

---

## 8 · Layar sebagai struktur data — kelompok yang makin ramai

| Program | Yang dibaca dari layar |
|---|---|
| [SPACE](space.md) | latar, supaya `PUT…XOR` bisa menghapus dirinya sendiri |
| **METEOR** | **seluruh dunianya** — balok, jejak, dan tabrakan |
| [SERPENT](serpent.md) | bentuk tubuhnya sendiri, sebagai senarai berantai |
| PAC-GAL *(dari EXE)* | tabrakan labirin — `SCREEN(r, c*2+1)` |

SERPENT memakai layar untuk menyimpan **satu** struktur; METEOR memakainya untuk
**semuanya**. Dan pasangan keduanya memperlihatkan dua sisi teknik yang sama:

| | METEOR | SERPENT |
|---|---|---|
| Menimpa sel berarti | **menghancurkan objek** | **menghancurkan objek** |
| Dan itu | **aturan mainnya** — begitulah cara mengikis balok | **cacat** — musuh yang melewati apel mengunci ronde selamanya |

Teknik yang sama, konsekuensi yang sama, satu disengaja dan satu tidak. Yang
membedakan bukan kodenya melainkan apakah perancangnya **memikirkan** apa yang
hilang saat sesuatu ditimpa. Rinciannya di [SERPENT §6d](serpent.md).

> **Catatan batas klaim.** Semua di atas dinyatakan pada tingkat **bahasa**:
> program memakai layar sebagai penyimpanannya. Di mana persisnya jawaban
> `SCREEN()` diambil adalah pertanyaan lain, dan untuk BASCOM sudah ditelusuri
> agen dekompilasi sampai ke `int 10h ah=08h` — lihat [SERPENT §4](serpent.md).
> METEOR adalah `.BAS` yang **ditafsirkan**, jalur yang berbeda, dan itu belum
> diukur. Jadi tidak diklaim.

---

## 9 · Latihan

1. **Patahkan penggambar garisnya.** Ganti `INT(0.5+S)` di baris 410 dengan
   `INT(S)`. Ke arah mana meteornya melenceng, dan kenapa hanya kelihatan pada
   garis yang landai?

2. **Hitung ulang orbit benihnya.** Kalau modulusnya diganti jadi 32.004,
   berapa nilai benih yang tersisa? Tunjukkan hitungannya, bukan hasilnya saja.

3. **Cari tambalan kelima.** §4 menemukan empat pertahanan untuk sel (24,80).
   Baris 240 mencetak dari kolom 1 dan baris 740 dari kolom 27 — periksa
   keduanya. Apakah ada yang bisa menyentuh kolom 80, dan kalau tidak, apakah
   itu disengaja atau kebetulan?

4. **Ukur baris 420.** Pada C=1 dan C=9, berapa rata-rata panah yang tertinggal
   per meteor? Buktikan bahwa selisihnya berasal dari baris 420 dan bukan dari
   jumlah meteornya.

5. **Buang selotnya.** Ganti kendalinya jadi "tombol ditahan" biasa. Aturannya
   tidak berubah sedikit pun — tapi apa yang hilang dari permainannya?

---

Berkas terkait: [pakai](../games/meteor/index.html) ·
[SERPENT — sisi lain dari teknik yang sama](serpent.md) ·
[SPACE](space.md) · [BREAKOUT](breakout.md) — pilot kelompok arkade
