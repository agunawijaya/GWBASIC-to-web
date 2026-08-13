# BREAKOUT — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/BREAKOUT.BAS` — di layarnya sendiri: **"Spinout"** |
| Penulis | **K.R. Sloan, Jr.** — 1 Januari 1982 |
| Ukuran asli | 164 baris |
| Peran | **pilot arkade** — menetapkan gelung permainan, masukan, dan rasa main untuk sesi 18–25 |
| Hasil port | [`../games/breakout/`](../games/breakout/index.html) |
| Analisis BASIC | [`../../reviews/BREAKOUT.md`](../../reviews/BREAKOUT.md) |

Namanya di berkas `BREAKOUT.BAS`, tapi baris 140 mencetak *"Welcome to
Spinout"* — dan nama itu yang tepat. Bedanya dengan Breakout biasa bukan
hiasan: **bolanya punya spin, dan spin itu membelokkan lintasannya
terus-menerus.**

---

## 1 · Spin: matriks rotasi yang menyamar

```basic
760 VX=OVX-(SPIN*OVY*.05):VY=OVY+(SPIN*OVX*.05)+G
761 SPIN=SPIN*.9999
```

Baca ulang sebagai matriks. Dengan *t* = `SPIN × 0,05`:

```
⎡vx'⎤   ⎡ 1  -t ⎤ ⎡vx⎤
⎣vy'⎦ = ⎣ t   1 ⎦ ⎣vy⎦
```

Itu **rotasi sudut kecil**, diterapkan tiap langkah. Bola berspin tidak
dibelokkan sekali lalu lurus — ia **terus berbelok** selama masih berspin.
Efek Magnus, dalam satu baris BASIC.

| Spin | Belok per langkah | Langkah per putaran penuh |
|--:|--:|--:|
| 0,25 | 0,7° | 502 |
| 0,5 | 1,4° | 251 |
| 1 | 2,9° | 126 |
| 2 | 5,7° | 63 |

### Tapi ia tidak menjaga laju

Determinan matriks itu **1 + t²**, bukan 1. Jadi bola berspin ikut makin
cepat:

| Spin | Pertumbuhan laju per 100 langkah |
|--:|--:|
| 0,25 | +0,8% |
| 0,5 | +3,2% |
| 1 | **+13,3%** |
| 2 | **+64,5%** |

Rotasi yang benar butuh `cos` dan `sin`. Yang dipakai di sini adalah
hampirannya untuk sudut kecil, dan percepatan itu adalah **galat
hampirannya** — bukan fitur yang dirancang.

Yang menahannya cuma `MAXVX`/`MAXVY` di baris 770–781. Dan batas itu sendiri
longgar dalam dua hal:

1. Ia membatasi **tiap komponen**, bukan besaran vektornya. Pada kemampuan 10
   batasnya 10 per sumbu, jadi laju sesungguhnya boleh mencapai
   √(10²+10²) = 14,1.
2. *English* papan di baris 1250 diterapkan **sesudah** penjepitan, dan baru
   dijepit di langkah berikutnya — jadi nilai jauh di atas 14 bisa berkelebat
   sesaat. Diukur di port: 36,68.

> **Pelajaran.** Hampiran sudut kecil benar untuk *arahnya* dan salah untuk
> *panjangnya*. Kesalahan itu tidak terlihat dalam satu langkah dan menumpuk
> secara eksponensial di ratusan langkah — dan yang menyembunyikannya adalah
> sebuah penjepit yang dipasang untuk alasan yang sama sekali lain.

---

## 2 · Satu angka yang mengendalikan enam hal

Baris 270 cuma menanyakan satu hal: *"How good are you at this game (1-10)?"*.
Jawabannya dibagi sepuluh, lalu dipakai di enam tempat yang tidak
berhubungan:

| Baris | Yang dikendalikan |
|---|---|
| `290` | laju maksimum bola — `6 + 4×SKILL` |
| `295` | **gravitasi** — `SKILL/5`, bola ditarik ke bawah |
| `710` | pengali laju saat mengenai dua baris atas |
| `1150` | **peluang bata dikembalikan** |
| `1250` | kekuatan *english* dari titik pukul papan |
| `1260` | berapa banyak spin yang ditambahkan |

Menaikkan kemampuan dari 5 ke 10 bukan "lebih cepat" — ia mengubah
**fisikanya**. Bolanya lebih berat (gravitasi ganda), lebih liar (spin ganda),
dan papannya dipasang ulang sepuluh kali lebih sering.

> **Pelajaran.** Satu tuas yang menggerakkan enam hal adalah desain yang
> hemat dan mustahil di-*tune*. Kalau permainan terasa salah pada kemampuan 7,
> tidak ada cara memperbaikinya tanpa mengubah enam hal sekaligus.

---

## 3 · Bata yang sudah pecah bisa kembali

```basic
1150 IF (RND(1)*2)>SKILL GOTO 1210     ' lewati kalau tidak beruntung
1160 BX=INT(RND(1)*19.99):BY=INT(RND(1)*3.99)
1170 IF BRICK[1+BX,1+BY]>0 GOTO 1210   ' masih utuh? tidak jadi
1180 BRICK[1+BX,1+BY]=-BRICK[1+BX,1+BY]
1190 LINE …                            ' digambar kembali
1200 SCORE=SCORE-BRICK[1+BX,1+BY]      ' skor ditarik kembali
```

Setiap kali bola mengenai papan Anda, ada peluang sebuah bata yang sudah pecah
**dipasang kembali** dan skornya **ditarik kembali**.

| Kemampuan | Peluang undian |
|--:|--:|
| 1 | 5% |
| 3 | 15% |
| 5 | 25% |
| 7 | 35% |
| 10 | **50%** |

**Makin tinggi Anda menilai diri sendiri, makin sering permainan membatalkan
pekerjaan Anda.** Bukan bolanya yang dipercepat — papannya yang dipasang
ulang.

### Baris 1170 menambahkan kurva kesulitan yang tidak disengaja

Bata yang diundi **harus sudah pecah**, kalau tidak percobaannya batal. Jadi
peluang sesungguhnya adalah

```
SKILL/2  ×  (bagian bata yang sudah pecah)
```

Di awal permainan hampir tidak pernah terjadi — dengan 5 dari 80 bata pecah
dan kemampuan 10, peluangnya cuma 3% per pukulan. Dan **makin dekat Anda ke
kemenangan, makin sering ia menyerang**: pada 79 dari 80 bata pecah,
peluangnya mendekati 50%.

Kurva kesulitan yang lahir dari satu baris `IF`, dan hampir pasti bukan
disengaja.

---

## 4 · 6800 bukan angka ajaib

```basic
330 BRICK[1+BX,1+BY]=10+50*BY
970 IF SCORE<6800 GOTO 1050
```

| Baris bata | Nilai | × 20 kolom |
|---|--:|--:|
| 0 (paling atas) | 10 | 200 |
| 1 | 60 | 1.200 |
| 2 | 110 | 2.200 |
| 3 (terbawah) | 160 | 3.200 |
| **Total** | | **6.800** |

Enam ribu delapan ratus adalah **persis** jumlah seluruh bata. Jadi syarat
menang di baris 970 sebenarnya berbunyi "semua bata pecah" — hanya dinyatakan
sebagai skor, bukan sebagai hitungan.

Itu **bisa** begitu justru karena baris 1200 mengurangi skor persis sebesar
nilai bata yang dikembalikan. Dua baris yang berjauhan menjaga satu persamaan
tetap benar, dan tidak ada satu pun yang menyebut yang lain.

### Arah nilainya terbalik

Baris **paling atas** — paling jauh dan paling sulit dijangkau — bernilai
**10**. Baris terbawah, yang tepat di depan papan, bernilai **160**.
Kebalikan dari Breakout baku.

Dan baris 870–880 membuat bola **makin cepat** justru saat mengenai dua baris
teratas yang murah itu. Jadi menembus ke atas menghukum dua kali: sedikit
poin, dan bola yang lebih sulit dikendalikan sesudahnya.

---

## 5 · Program tanpa pewaktu

Cari `SLEEP`, `TIMER`, atau perulangan penunda di 164 barisnya — tidak ada.
Satu langkah simulasi adalah satu putaran perulangan 740→1300, dan
kecepatannya adalah **kecepatan penafsir BASIC di mesin itu**.

Akibatnya sama dengan [READING](reading.md): program yang sama terasa berbeda
di mesin berbeda, dan tidak ada angka yang bisa disalin. Karena itu port ini
**menanyakannya** lewat penggeser (bawaan 32 langkah/detik), bukan menebak
diam-diam.

Bola dihapus dengan `PUT…XOR` dua kali (baris 1270–1280) — teknik yang sama
dengan [SPACE](space.md), kemunculan ketiga di koleksi ini.

---

## 6 · Sisa-sisa yang tertinggal

```basic
296 DEF SEG=0:EQUIPMENT%=PEEK(&H410) ':POKE &H410,EQUIPMENT%-&H10
1341 'DEF SEG=0:POKE &H410,125:WIDTH 40:WIDTH 80:SCREEN 0,0,0
```

Dua baris pengalih kartu tampilan, keduanya **dikomentari**. Penulisnya
sempat memaksa BIOS mengira ada kartu lain terpasang, lalu membatalkannya —
dan meninggalkan bekasnya.

```basic
297 WIDTH 40:WIDTH 80:SCREEN 0,0,0:SCREEN 1
```

Empat ganti mode berturut-turut untuk sampai ke satu mode grafis yang bersih.
Bukan salah ketik; itu tarian yang diketahui bekerja.

```basic
650 X=L+RND(X)*(R-L)
990 COLOR FLASH,.5+RND(FLASH)
```

`RND(n)` untuk n>0 di GW-BASIC **mengabaikan argumennya**. Jadi `RND(X)` dan
`RND(FLASH)` sama saja dengan `RND(1)` — argumennya sekadar variabel yang
kebetulan ada di dekat situ. Tidak berbahaya, dan menyesatkan pembaca yang
mengira ada hubungan.

`RANDOMIZE(VAL(RIGHT$(TIME$,2)))` di baris 65 adalah pola benih-60-detik yang
sama dengan enam program lain di koleksi ini.

---

## 7 · Pilot arkade: keputusan yang diwarisi sesi 18–25

| | Keputusan | Alasan |
|---|---|---|
| Gelung | `_shared/loop.js`, langkah tetap, batas kejar 5 | simulasi harus mandiri dari laju bingkai; batas kejar mencegah *spiral of death* saat tab kembali terlihat |
| Masukan | `_shared/input.js`, `isDown()` | gerak kontinu butuh keadaan tombol, bukan antrean kejadian |
| Gambar | **SVG**, bukan canvas | diukur, bukan diasumsikan — lihat §7b |
| Kecepatan | dinyatakan lewat penggeser | angkanya tidak pernah ada di aslinya (§5) |
| Interpolasi | `render(alpha)` dari `loop.js` | simulasi 32 langkah/detik tergambar mulus di 60 bingkai/detik **tanpa mengubah fisikanya sedikit pun** |
| Warna | dua mode, modern jadi bawaan | lihat §7c |
| Transisi CSS | **tidak ada** pada yang dipindah gelung | CSS dan gelung akan berebut nilai yang sama; cacatnya bergantung laju bingkai dan paling sulit dilacak. Animasi CSS hanya untuk yang **tidak** dikendalikan gelung: bata pecah, bata kembali, kedipan menang |

### 7b · Ambang SVG yang saya tetapkan sendiri, lalu saya uji

Versi pertama dokumen ini menulis *"SVG berhenti benar begitu ada ratusan
benda bergerak bersamaan"* — sebuah ambang yang saya tulis tanpa menguji.
Efek animasi yang ditambahkan kemudian adalah kasus itu, jadi ambangnya
**diukur**:

| | |
|---|--:|
| Elemen di dalam `<svg>` | 267 diam, **268** puncak |
| Partikel hidup sekaligus | **8** puncak |
| Angka melayang hidup | **1** puncak |
| Elemen yang **berubah** tiap bingkai | ± 20 |

Kolam partikel dibatasi 120 dan dipakai ulang — tidak ada elemen yang dibuat
atau dihapus selama bermain, karena membuat/menghapus elemen memaksa penataan
ulang DOM tepat pada saat paling ramai.

Jadi yang benar-benar berubah tiap bingkai adalah bola, papan, cincin spin,
sepuluh jejak, dan paling banyak sembilan efek. **SVG masih jauh dari
batasnya**, dan program arkade berikutnya harus mengukur ulang, bukan
menyalin angka ini.

### 7c · Dua mode, dan kenapa aturan lama tidak berlaku di sini

Versi pertama mengunci warnanya ke palet CGA, dengan alasan: *"layar 1982
yang disesuaikan tema berhenti jadi bukti tentang layar 1982."*

Alasan itu **masih benar untuk halaman edukasi**. [HISTORY](history.md),
[ANATOMY](anatomy.md), dan [CHECK](check.md) adalah alat baca — layarnya
barang bukti, dan mengubahnya merusak gunanya.

Halaman arkade **dimainkan**. Yang harus setia di sini adalah *fisikanya* —
dan ternyata rupa modern justru membuat fisika itu **lebih** terlihat:

| Yang ditambahkan | Selera? |
|---|---|
| **Jejak bola** | **Bukan.** Seluruh program ini tentang lintasan yang melengkung, dan pada satu titik yang berpindah tiap langkah, lengkungan itu praktis tak terlihat |
| **Cincin spin** | **Bukan.** Dibaca langsung dari `spin`, jadi ia tidak bisa berbohong tentang keadaan simulasi |
| Angka melayang | Sebagian — ia membuat nilai baris yang **terbalik** (§4) terbaca tanpa dijelaskan |
| Pecahan bata, getar layar, cahaya | **Selera**, dan dinyatakan begitu |
| Animasi bata kembali | Sebagian — mekanik khas program ini (§3) paling mudah terlewat kalau tidak ditandai |

Jadi: **mode modern jadi bawaan, mode 1982 tetap ada satu tombol jauhnya**,
dan keduanya menjalankan `langkah()` yang sama persis — fungsi fisikanya
tidak tahu mode mana yang sedang aktif.

> **Pelajaran.** Aturan fondasi yang benar untuk satu kelompok halaman bisa
> menjawab pertanyaan yang salah untuk kelompok lain. Yang perlu diperiksa
> bukan "apakah aturannya masih benar", melainkan **"apa yang sebenarnya
> harus setia di sini"** — di halaman baca itu tampilannya, di halaman main
> itu perilakunya.

---

## 8 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Fisika spin | baris 760–761 (§1) | — | **Dipertahankan persis**, termasuk percepatan akibat galat hampiran |
| Penjepit laju | per komponen, sesudahnya (§1) | — | **Dipertahankan**; papan angka menampilkan nilai apa adanya |
| Kemampuan 1–10 | enam akibat (§2) | — | **Dipertahankan persis** |
| Bata kembali | baris 1150–1200 (§3) | — | **Dipertahankan**, dan dihitung di papan angka |
| Pilihan tombol | pemain memilih kiri/kanan/saji/bunyi di layar pembuka | tidak ada kesepakatan tombol | **Tidak diport.** ←/→/Spasi tetap. Ritualnya dijelaskan, tidak dijalankan — empat layar tanya-jawab sebelum bermain adalah biaya yang lahir dari ketiadaan kebiasaan, bukan dari desain |
| Kecepatan | tanpa pewaktu (§5) | mesin yang menentukan | Penggeser langkah/detik, bawaan 32 |
| Papan bergerak | 5 piksel **per tombol di penyangga** | laju ulang papan ketik | 5 piksel **per langkah** selama ditahan — sama untuk yang menahan, bisa diprediksi untuk yang tidak |
| Bola menunggu saji | di **X acak**, tidak menempel papan | — | **Dipertahankan.** Menempelkannya ke papan adalah kebiasaan Breakout modern, dan itu menghapus keputusan pertama tiap bola |
| Bola & papan | `GET`/`PUT` XOR | tidak ada buffer ganda | Dua elemen SVG; teknik XOR-nya dijelaskan, tidak ditiru |
| Rupa | palet CGA, tanpa efek | perangkat keras | **Mode modern jadi bawaan** (§7c) — jejak, cincin spin, pecahan, angka melayang, getar layar. Mode 1982 satu tombol jauhnya, simulasi identik |
| Kedipan menang | 8× ganti warna + `PLAY` | — | Animasi CSS 8 langkah; dimatikan pada `prefers-reduced-motion` bersama seluruh efek lain |
| `RUN "MENU.PGM"` | keluar | tiap program berkas terpisah | Tautan kembali di bilah atas |

---

## 9 · Latihan

1. **Perbaiki rotasinya.** Ganti baris 760 dengan rotasi yang benar
   (`cos`/`sin`). Apa yang hilang dari rasa mainnya, dan apakah permainannya
   jadi lebih mudah atau lebih sulit?

2. **Ukur kurva bata-kembali.** Untuk kemampuan 10, gambarkan peluang
   sesungguhnya sebagai fungsi jumlah bata yang sudah pecah. Di titik mana ia
   melewati 25%?

3. **Cari titik seimbangnya.** Pada kemampuan berapa laju kemenangan tertinggi
   — dan kenapa bukan yang paling rendah?

4. **Balik nilainya.** Tukar nilai baris atas dan bawah supaya seperti
   Breakout baku. Apa yang terjadi pada baris 970, dan apa lagi yang harus
   ikut berubah?

---

Berkas terkait: [pakai](../games/breakout/index.html) ·
[SPACE — teknik XOR yang sama](space.md) ·
[READING — kecepatan yang ditentukan mesin](reading.md)
