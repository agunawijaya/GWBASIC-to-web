# FLYS — dari sprite makro 1985 ke web

> `run/FLYS.BAS` · 1985 · 180 baris, 3 subrutin, **3 `GOTO`** — rasio lompatan
> terbaik di koleksi · [pakai portnya](../games/flys/index.html) ·
> [analisis BASIC aslinya](../../reviews/FLYS.md)

Judulnya "pukul lalat", tapi bukan itu permainannya. Menjalankan kodenya
menjawab tiga hal yang tidak bisa dijawab dengan membacanya, dan yang pertama
mengubah pemahaman soal permainannya sendiri.

---

## 1 · Sprite yang digambar oleh kode, lalu dipotret

Tidak ada satu pun bitmap di berkas ini. Lalatnya digambar dengan **bahasa makro
`DRAW`** — bahasa penyu yang tertanam di BASIC — lalu *dipotret* ke larik dengan
`GET`:

```basic
200 BODY$   ="c1u5be1d6r1u6bf1d5"
210 URWING$ ="c3bu3br1e3r1g3r1e3"
220 ULWING$ ="bg3bl7h3l1f3l1h3"
250 DRAW BODY$+URWING$+ULWING$      ' lalat pertama
260 DRAW "bd20br6"                  ' turun 20, geser 6
270 DRAW BODY$+DRWING$+DLWING$      ' lalat kedua
280 GET (131,91)-(152,103),FLY0
290 GET (151,91)-(172,103),FLY1
300 GET (151,105)-(172,117),FLY2
```

`u5` naik lima, `d6` turun enam, `b` awalan "pindah tanpa menggambar",
`e`/`f`/`g`/`h` empat diagonal, `c1` ganti warna. Itu seluruh bahasanya.

Ini pemisahan **fase persiapan** dari **fase jalan** yang bersih: aset dibangun
sekali di luar gelung, lalu gelungnya cukup mem-`PUT` larik mana pun.

### Port ini menjalankan string itu

Ada penafsir `DRAW` di `flys.js`. Ia menjalankan kelima string aslinya,
merasterkan hasilnya dengan Bresenham, lalu mengambil ketiga persegi `GET` dari
peta piksel yang sama — persis urutan baris 250–300. **Lalat yang tergambar di
halaman itu lalat 1985 itu**, bukan tafsiran saya tentang bentuk lalat.

Alasannya sama dengan alasan [SERPENT](serpent.md) menggambar ularnya dengan
menelusuri rantai glif: kalau bentuknya dikarang terpisah, halamannya punya dua
sumber kebenaran yang bisa menyimpang, dan bukti yang di bawah ini jadi tidak
berarti apa-apa.

---

## 2 · FLY0 bukan fase kepakan — ia penghapus

[Reviewnya](../../reviews/FLYS.md) menulis `DIM FLY0(21),FLY1(21),FLY2(21)`
sebagai *"tiga fase kepakan sayap"*. Itu **keliru**, dan menjalankan makronya
membuktikannya.

Penanya menggambar **100 piksel**, seluruhnya di kotak `x 154..169`,
`y 94..114`. Ketiga persegi `GET` lalu diperiksa:

| Larik | Persegi `GET` | Piksel di dalamnya |
|---|---|--:|
| `FLY0` | (131,91)-(152,103) | **0** |
| `FLY1` | (151,91)-(172,103) | 50 |
| `FLY2` | (151,105)-(172,117) | 50 |

`FLY0` berhenti di kolom 152. Lalat pertama baru **mulai** di kolom 154. Jadi
`FLY0` tidak memotret apa pun — ia persegi kosong 22×13.

Gunanya ada di baris 630:

```basic
630 PUT(74*FLY,67),FLY0,PSET
```

`PSET` menimpa seluruh persegi termasuk piksel kosongnya, jadi **menaruh sprite
kosong berarti menghapus**. Kepakannya **dua fase, bukan tiga**.

### Dan itu mengubah permainannya

Baris 630 berjalan di akhir **setiap** hinggapan — termasuk yang terakhir,
sebelum baris 670 menurunkan pemukulnya. Jadi lalatnya **sudah hilang** saat
Anda ditanya.

Ini bukan permainan ketangkasan; ini permainan **ingatan**. Yang diuji bukan
seberapa cepat Anda memukul, melainkan apakah Anda masih tahu di mana ia
terakhir hinggap setelah tujuh sampai sebelas lompatan yang makin singkat.

Nama berkasnya, judul katalognya, dan reviewnya semuanya mengatakan hal lain.
Judul katalog sudah diperbaiki jadi **"Flys (ikuti lalatnya)"** — kesalahan
judul ketiga di koleksi ini setelah [ANATOMY](anatomy.md) dan
[HISTORY](history.md), dan seperti keduanya, ketahuan hanya karena programnya
dijalankan.

### Diverifikasi dua sumber

Penafsir `DRAW` ditulis dua kali dan tidak saling melihat: satu di Python untuk
memeriksa, satu di JavaScript untuk halamannya.

| | Python | JavaScript (halaman) |
|---|--:|--:|
| Total piksel | 100 | 100 |
| Kotak batas | 154..169 × 94..114 | 154..169 × 94..114 |
| `FLY0` | 0 | 0 |
| `FLY1` | 50 | 50 |
| `FLY2` | 50 | 50 |

Angka di halaman **dihitung saat halaman dibuka**, bukan diketik. Kalau
penafsirnya rusak, tabelnya ikut berubah.

---

## 3 · Ukuran lariknya dihitung, bukan ditebak

```basic
130 DIM FLY0(21),FLY1(21),FLY2(21)
140 DIM SWAT(714)
```

Kenapa 21? Kenapa 714? Ukuran larik `GET` di GW-BASIC punya rumusnya:

```
bita = 4 + INT((lebar × bit_per_piksel + 7) ÷ 8) × tinggi
```

`SCREEN 1` memakai **2 bit per piksel**. Larik `FLY0` dan kawan-kawan namanya
mulai huruf `F` dan `S`, dan `DEFINT X,Y` di baris 120 hanya mencakup `X` dan
`Y` — jadi keduanya **presisi tunggal, empat bita per elemen**.

| | Ukuran | Butuh | `DIM` × 4 | Sisa |
|---|---|--:|--:|--:|
| lalat | 22×13 | 82 | 21 → **84** | 2 |
| swat | 76×150 | 2.854 | 714 → **2.856** | 2 |

Keduanya **minimum yang muat**, dan sisa dua bita itu bukan pilihan — ia
dipaksa oleh pembulatan ke kelipatan empat.

Angka 21 dan 714 tidak mungkin ditebak. Keduanya dihitung dengan rumus itu
sebelum satu baris permainannya ditulis, dan itu memberi tahu sesuatu tentang
cara orang menulis program grafis di 1985: **ruang dihitung lebih dulu**.

---

## 4 · Kurva yang rata di lalat ke-12

```basic
570 WHILE+ BUZZ < DELAY
580 PUT(74*FLY,67),FLY1,PSET
590 PUT(74*FLY,67),FLY2,PSET
600 BUZZ=BUZZ+99
610 WEND
 850 DELAY=0.7370001*DELAY   ' kena
1260 DELAY=1.47*DELAY        ' meleset, dibatasi 3000
1490 SPEED=(3000-DELAY)*10/3
```

Lama satu hinggapan bukan waktu — ia **cacah kerja**: `ceil(DELAY ÷ 99)` pasang
`PUT`. Dan 99 adalah kuantum terkecil yang bisa dihitung, jadi begitu `DELAY`
turun di bawah 99, cacahnya **terkunci di 1** dan tidak bisa mengecil lagi.

Akibatnya bisa dihitung di muka, lalu dicocokkan dengan port yang berjalan:

| Bunuh ke- | DELAY | SPEED | Kepak | |
|--:|--:|--:|--:|---|
| 0 | 3.000 | 0 | 31 | |
| 1 | 2.211,00 | 2.630 | 23 | |
| 5 | 652,32 | 7.826 | 7 | |
| **6** | 480,76 | **8.397** | 5 | ambang 8000 → *Senior De-Bugger* |
| 7 | 354,32 | 8.819 | 4 | |
| **8** | 261,13 | **9.130** | 3 | ambang 9000 → *Professional* |
| 11 | 104,54 | 9.652 | 2 | |
| **12** | **77,04** | 9.743 | **1** | **kurvanya rata di sini** |
| 20 | 6,71 | 9.978 | 1 | |
| **31** | 0,32 | **9.999** | 1 | ambang 9999 → menang |

Seluruh baris di atas **dihasilkan port yang benar-benar dimainkan sampai
tamat** oleh pemain otomatis, dan cocok digit demi digit dengan hitungan yang
dibuat lebih dulu dari rumusnya.

Jadi dari bunuh ke-12 sampai ke-31 — **dua puluh lalat** — tingkat kesulitannya
**persis sama**. Anda mengulang tugas yang identik dua puluh kali sambil angka
`SPEED` terus naik menuju ambang yang tidak ada hubungannya dengan apa yang
sedang Anda kerjakan.

> **Pelajaran.** Ini bukan rancangan yang buruk; ini akibat langsung dari
> **mengukur waktu dengan menghitung pekerjaan**. `SPEED` dan `DELAY` masih
> punya resolusi penuh — yang kehabisan resolusi adalah `ceil(DELAY/99)`, satu
> pembagian bulat di tengah. Kurva kesulitan yang mati diam-diam karena
> kuantisasi adalah kegagalan yang **tidak terlihat di variabelnya**: keduanya
> terus bergerak dengan rapi sampai akhir.
>
> Ini juga sebabnya `SLOWDOWN.COM` dan `GOSLOW.COM` di `tools/` koleksi ini
> pernah ada — lihat [`_fondasi.md`](_fondasi.md) dan `_shared/loop.js`.

---

## 5 · Lagu sebagai pewaktu

```basic
1080 PRINT "YOU JUST MADE 'SENIOR DE-BUGGER'!!!"
1090 PLAY"MF O3 T200 L5 MS cde.cffcd.cde.cffcd..."
1180 LINE (15,15)-(304,184),0,BF
```

Baris 1180 menghapus layar tepat setelah pesan pujian dicetak. Tidak ada
`FOR…NEXT` di antaranya, tidak ada `INKEY$`. Kalau tidak ada apa-apa yang
menahan, pesannya **tidak akan sempat terbaca sama sekali**.

Yang menahannya adalah `MF` di awal baris 1090 — *music foreground*, yang
**memblokir** di GW-BASIC sampai lagunya habis.

Jadi lagunya bukan hiasan: **ia satu-satunya alasan pujian itu terlihat.** Ganti
`MF` jadi `MB` (*music background*) dan pesan pujian di seluruh permainan ini
lenyap tanpa satu pun baris lain berubah.

Port ini memainkan ketiga makro `PLAY` aslinya apa adanya lewat penafsir di
[`_shared/audio.js`](../_shared/audio.js), dan menahan pesannya sampai lagunya
selesai — sebab yang sama, mekanisme yang sama.

---

## 6 · Dua hal kecil yang layak disebut

**Baris 570 salah ketik, dan tetap jalan.**

```basic
570 WHILE+ BUZZ < DELAY
```

Ada tanda tambah setelah `WHILE`. GW-BASIC membacanya sebagai plus uner pada
`BUZZ`, jadi tidak berpengaruh apa-apa, dan ia sudah berada di sana sejak 1985.

**Layar menangnya tidak punya jalan keluar.**

```basic
1660 PLAY "T169 L9 MS abcdefgacegecacgfedfdfdgdccedabbcaegfc"
1670 BGD = INT(RND * 6)
1680 PLT = INT(RND * 2)
1690 COLOR BGD,PLT
1700 GOTO 1660
```

Lagunya diulang selamanya sambil warna layar diacak. Tidak ada `INKEY$`, tidak
ada syarat keluar. Satu-satunya cara meninggalkan kemenangan setelah 31 lalat
adalah **mematikan komputernya**. Di port lagunya diputar sekali dan tombol
*Main lagi* kembali aktif.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Sprite | makro `DRAW` + `GET` (§1) | bitmap tidak muat di disket, dan tidak ada penyunting gambar | **Makronya dijalankan**, bukan digambar ulang. Penafsir `DRAW` di `flys.js`, dirasterkan Bresenham, lalu `GET` dari peta piksel yang sama |
| `FLY0` | persegi kosong, dipakai menghapus (§2) | `PUT…PSET` menimpa seluruh persegi | **Dipertahankan sebagai mekanisme**, bukan diganti "sembunyikan elemen". Itu yang membuat lalatnya hilang sebelum ditanya |
| Palet | `SCREEN 1`, `COLOR 0,1` | CGA empat warna | **Warna literal, bukan token tema** — pengecualian yang sama dengan BREAKOUT dan PAC-GAL. Mengambilnya dari token akan menghapus justru hal yang ditiru |
| Lama hinggapan | `ceil(DELAY/99)` pasang `PUT` (§4) | tidak ada pewaktu | **Cacahnya dipertahankan persis**, lalu diberi satuan waktu lewat penggeser "PUT per detik". Aslinya kecepatannya ditentukan CPU; penggeser inilah satuan waktu yang tidak pernah ia punya — dan ia membuat rata di §4 bisa **dilihat** |
| `DELAY` naik-turun | ×0,7370001 dan ×1,47, batas 3000 | — | **Dipertahankan persis**, termasuk tujuh angka desimal ganjil itu |
| Ambang pangkat | 8000 / 9000 / 9999 | — | **Dipertahankan persis**, termasuk penurunan pangkat di baris 1420–1430 saat meleset |
| `PLAY MF` sebagai penahan | musik memblokir (§5) | tidak ada `sleep` | **Ditiru sebagai sebab**, bukan sebagai lama: pesannya ditahan sampai lagunya selesai. Dua pengaman ditambahkan — pesan tetap ditahan 2,5 detik kalau bunyi dimatikan, dan ada batas atas 8 detik supaya alur tidak pernah menggantung pada janji audio |
| Lompatan lalat | 7–11 kali (`FOR I=1 TO 7+5*RND`) | — | **Dipertahankan persis.** Diverifikasi: 436 bingkai ke pertanyaan pertama = (436+1−3)÷62 = **7 hinggapan bulat** |
| Cara menjawab | hanya tuts `1`/`2`/`3` (770–790) | tidak ada tetikus di PC 1985 | **Pemukulnya bisa diklik langsung**, atas permintaan pemilik koleksi. Bidang kliknya seukuran **persis** kotak `PUT` masing-masing pemukul — `(87×SWIPE−51, 35)` selebar 76 setinggi 150 — jadi yang diklik benar-benar pemukulnya, bukan kira-kira daerahnya. Tuts 1/2/3 **tetap jalan**, karena itu yang tertulis di layar oleh baris 760 dan membuangnya akan membuat teks aslinya berbohong |
| Layar menang | gelung tanpa ujung (§6) | — | **Lagunya sekali**, lalu tombol kembali aktif. Penyimpangan, dan disebut: aslinya memang tidak bisa ditinggalkan |
| Rupa | piksel CGA datar | — | **Lapisan modern di atasnya** — lihat §7b. Tombol *Mode 1985* mematikan seluruhnya |
| Lebar halaman | — | — | **Dilonggarkan jadi 1.320px** pada layar ≥1.400px, khusus halaman ini. Papan 320 satuan pada lebar bersama cuma 1,8px per piksel CGA; sekarang 2,17. Sama seperti [METEOR](meteor.md), dan alasannya sama |
| Keluar | `CHAIN "MENU"` lewat `ON KEY(10)` | tiap program berkas terpisah | Tautan kembali di bilah atas |

Yang menyimpang: layar menang, pengaman `PLAY`, cara menjawab, lebar halaman,
dan lapisan rupa di §7b. Semuanya dinyatakan.

Satu catatan soal cara menjawab. Godaannya adalah membuang tuts 1/2/3 begitu
kliknya ada — dan itu akan salah, karena baris 760 mencetak
`"Check which swatter (1,2,3) ?"` **ke layar permainan**, dan teks itu
dipertahankan apa adanya. Membuang tutsnya akan membuat kalimat aslinya
berbohong tentang programnya sendiri. Jadi keduanya ada, dan baris petunjuk di
bawah layar menyebut keduanya.

### 7b · Lapisan modern, dan jaminannya

Pemilik koleksi meminta tampilannya lebih modern.

Putaran pertama mengikuti aturan yang dipakai [SERPENT](serpent.md) dan
[BREAKOUT](breakout.md): kecantikannya diturunkan dari datanya — cahaya,
bayangan, dan gema di atas piksel makro `DRAW`. Pemilik koleksi melihat
hasilnya dan memutuskan **lalat dan pemukulnya digambar ulang sendiri, tidak
memakai aset program aslinya.**

> **Ini pembalikan prinsip, dan dinyatakan begitu.** Di tempat lain koleksi ini
> berkeras menurunkan bentuk dari datanya, dengan alasan yang masih berlaku:
> bentuk yang dikarang terpisah menciptakan sumber kebenaran kedua yang bisa
> menyimpang. Yang menyelesaikannya bukan kompromi di tengah, melainkan
> memastikan **kedua-duanya ada di port yang sama**:
>
> - **Panel bukti tetap menjalankan makro aslinya** dan mencacah pikselnya
>   (100 / 0 / 50 / 50). Itulah tempat temuan §2 hidup, dan ia tidak disentuh
>   sedikit pun oleh perubahan ini.
> - **Tombol *Mode 1985* mengembalikan permainannya ke sprite piksel asli** —
>   lalat dan pemukul, keduanya. Jadi aset 1985 masih dipakai bermain, satu
>   tombol jaraknya.
>
> Yang berubah cuma **mana yang jadi bawaan**.

Gambar barunya memakai kotak yang sama persis dengan `GET`-nya — lalat 22×13
pada `(74×FLY, 67)`, pemukul 76×150 pada `(87×SWIPE−51, 35)` — jadi letak,
ukuran, dan seluruh aturan mainnya tidak bergeser sedikit pun. Dan satu detail
diwarisi: **jumlah lubang pemukulnya 7×8 = 56**, cacah yang sama dengan gelung
`FOR X = 5 TO 65 STEP 10` / `FOR Y = 55 TO 125 STEP 10` di baris 340–370.

| Lapisan | Dari mana bentuknya | Sifat |
|---|---|---|
| Lalat & pemukul | **digambar sendiri** — permintaan pemilik koleksi | gambar baru; aset asli tetap ada di Mode 1985 |
| Warna gambar baru | di luar palet CGA, sengaja | menyamarkannya jadi empat warna akan membuatnya tampak seperti sprite asli yang cacat |
| Cahaya fosfor | filter Gauss di atas lapisan yang bergerak | rupa |
| Gema sayap | **fase kepakan yang satu lagi**, digambar penggambar yang sama | rupa; ia tidak bisa menyimpang dari lalatnya |
| Bayangan | elips di bawah kotak sprite | rupa |
| Goyang dengung | ±0,6 satuan naik-turun mengikuti fase sayap | rupa; nol sel berubah |
| Bantalan pendaratan | tiga persegi di `74×i, 67` | **tambahan** — menunjukkan letak ketiga tempat |
| Pemukul menghantam | luncur 0,22 dtk + debu + guncangan | rupa; aslinya seketika lewat satu `PUT` |
| Goresan cipratan | **titik ujung yang sama** dengan ruas baris 980 | rupa; piksel CGA di bawahnya tetap tinggal |
| Arena & tabung | gradien, vignet, kilau kaca, sudut membulat | rupa |
| Grafik kurva | dihitung dari rumus yang sama dengan permainannya | penjelasan |

Satu koreksi rupa yang layak dicatat: perut lalatnya semula kuning-amber, dan
**terbaca sebagai lebah**. Diganti jadi kelabu-zaitun kusam. Itu pelajaran §6c
[SERPENT](serpent.md) lagi dalam bentuk lain — rupa yang salah menjanjikan hewan
yang salah, dan yang salah rupanya.

Dua hal yang **tidak** dilakukan, dan keduanya menarik karena keduanya godaan
yang wajar:

- **Lalatnya tidak diberi lintasan terbang antar-tempat.** Ia melompat, persis
  seperti aslinya. Lintasan akan membuat permainannya jauh lebih enak
  dilihat — dan **menghancurkannya**, karena mata bisa mengikuti gerak yang
  berkesinambungan tanpa perlu mengingat apa pun. Yang diuji permainan ini
  justru ingatan (§2).
- **Bantalan pendaratan menunjukkan LETAK, bukan ISI.** Ia tidak pernah
  menandai tempat mana yang sedang atau terakhir dipakai. Kalau ia melakukannya,
  ia membocorkan persis hal yang disembunyikan baris 630.

Dan hiasannya dibuang **di baris yang sama** dengan penghapusnya:

```js
taruh(gLalat, SPR.FLY0, 74 * lalat, 67);   // 630: MENGHAPUS
gHias.textContent = '';
gLalat.removeAttribute('transform');
```

Kalau bayangan atau gema sayap tertinggal satu bingkai saja, ia membocorkan
tempat terakhir lalatnya.

**Jaminannya bisa diuji, dan diuji.** Tombol *Mode 1985* mengembalikan seluruh
permainan ke sprite piksel asli — di JavaScript, bukan cuma disembunyikan di
CSS, dan termasuk pemukul yang sudah telanjur turun:

| | Modern | Mode 1985 |
|---|--:|--:|
| Lalat | gambar SVG (4 sayap-fase, 12 kaki, 4 mata) | 50 piksel dari makro `DRAW` |
| Pemukul | 3 gambar, 56 lubang masing-masing | 3 × **210 persegi piksel** |
| Elemen hiasan | 52 | **0** |
| Panel bukti (`FLY0`/`FLY1`/`FLY2`) | **0 / 50 / 50** | **0 / 50 / 50** |

Angka 210 itu sendiri bisa diturunkan: 1 bantalan + 56 lubang + 152 jalur tegak
pita "V" + 1 gagang = **210**, dan itulah yang tercacah.

Perhatikan baris terakhir: **panel buktinya tidak berubah di kedua mode**, karena
ia tidak pernah bergantung pada rupa permainannya. Itu yang membuat perubahan
ini aman.

> **Pelajaran.** "Buat lebih modern" dan "jangan hilangkan temuannya" ternyata
> bisa diselesaikan **tanpa** memaksa gambarnya diturunkan dari datanya —
> asalkan yang menyimpan temuannya bukan gambar itu. Di sini temuannya hidup di
> panel bukti yang menjalankan makro aslinya, dan aset 1985-nya tetap bisa
> dimainkan lewat satu tombol.
>
> Aturan "turunkan bentuk dari datanya" tetap benar untuk
> [SERPENT](serpent.md), dan alasannya spesifik: di sana bentuk ularnya
> **adalah** struktur datanya, jadi menggambarnya terpisah akan menciptakan
> sumber kebenaran kedua yang bisa menyimpang tanpa ketahuan. Di FLYS sprite-nya
> cuma aset — ia tidak menyimpan keadaan apa pun. Aturan yang sama, kesimpulan
> yang berbeda, karena **yang menentukan bukan aturannya melainkan apakah
> gambarnya memikul kebenaran**.

---

## 8 · Latihan

1. **Patahkan `FLY0`.** Isi persegi `GET` baris 280 dengan sesuatu — misalnya
   ganti jadi `GET (151,91)-(172,103)`. Apa yang terjadi pada permainannya, dan
   kenapa jawabannya bukan "lalatnya jadi tiga fase"?

2. **Hitung ulang `DIM`-nya.** Kalau programnya dipindah ke `SCREEN 2` (640×200,
   1 bit per piksel), berapa `DIM` minimum untuk lalat dan pemukulnya?
   Tunjukkan hitungannya.

3. **Perbaiki kurvanya.** Ubah baris 600 supaya kesulitannya terus naik sampai
   bunuh ke-31 tanpa mengubah `DELAY`, `SPEED`, maupun ambangnya. Apa yang harus
   diganti, dan kenapa `BUZZ=BUZZ+99` tidak bisa sekadar dikecilkan?

4. **Cari batas mundurnya.** Meleset mengali `DELAY` dengan 1,47 dan menang
   butuh 31 bunuh bersih. Berapa banyak meleset yang bisa ditanggung seorang
   pemain yang sudah sampai bunuh ke-30 sebelum ia jatuh kembali ke bawah
   ambang *Professional*?

---

Berkas terkait: [pakai](../games/flys/index.html) ·
[SERPENT — bentuk yang diturunkan dari datanya, bukan dikarang](serpent.md) ·
[METEOR](meteor.md) · [BREAKOUT](breakout.md) — pilot kelompok arkade
