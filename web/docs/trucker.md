# TRUCKER — satu bilangan yang memuat dua hal

> Port web: [`web/games/trucker/`](../games/trucker/index.html) ·
> Sumber: [`run/TRUCKER.BAS`](../../run/TRUCKER.BAS) (385 baris) ·
> Analisis BASIC: [`reviews/TRUCKER.md`](../../reviews/TRUCKER.md)

Ditulis **Hughes Glantzberg** di Carrollton, Texas, 1982 — dua tahun sesudah
*Motor Carrier Act 1980* mederegulasi angkutan truk Amerika, dan delapan tahun
sesudah batas kecepatan nasional 55 mil per jam diberlakukan untuk menghemat
bahan bakar. Kedua hal itu bukan latar belakang: keduanya ada di dalam
aritmetikanya.

Ini bukan permainan aksi. Ia **simulasi ekonomi** dengan satu putaran = satu
jam, dan satu keputusan tetap: seberapa cepat.

---

## 1 · Satu bilangan yang memuat dua hal

Tiap titik jalan disimpan sebagai empat nilai:

```basic
9040 DATA 90,Barstow,I-15 in California,7.80
```

Mil, nama tempat, nama jalan — lalu satu bilangan pecahan. Bilangan itu
dipakai dua kali, dengan dua arti:

```basic
3130 ON INT(ZH) GOSUB 3210,3310,3360,3410,3500,3710,3860
3870 IF RND < ZH-INT(ZH) THEN RETURN
```

`INT(7,80) = 7` memilih kejadian ketujuh — unit pendingin rusak. `0,80` adalah
**peluang kejadian itu tidak jadi**. Jadi Barstow punya 20 % peluang merusak
pendingin Anda, dan seluruh informasi itu muat dalam satu bilangan tunggal di
tengah `DATA`.

Kecuali untuk jenis **2**. Di sana:

```basic
3310 T=100*(ZH-INT(ZH))
3320 PRINT"STOP!   Pay toll of " USING"$##.##";T
```

Pecahannya bukan peluang lagi melainkan **besar tol dalam dolar**. Satu kolom
data, dua tata bahasa, dan tidak ada apa pun di dalam berkas yang menandai
perbedaannya. Anda hanya bisa mengetahuinya dengan membaca kedua penanganya.

Yang dihitung port ini dari datanya sendiri:

| | |
|---|--:|
| Titik jalan seluruhnya | **64** |
| Tanpa kejadian (`0`) | 16 |
| Jumlah seluruh tol di tiga rute | **$530** |
| Zona waktu · tol · perbaikan · radar · timbang · longsor · pendingin | 8 · 11 · 8 · 5 · 10 · 1 · 5 |

Titik-titiknya nyata: Barstow, Needles, Flagstaff, Tucumcari, Terre Haute,
Holland Tunnel. Nomor jalannya juga — I-40, I-70, I-80, I-10, I-20,
Pennsylvania Turnpike. Longsor terowongan **hanya ada satu di seluruh
permainan**, di rute tengah: Alleghany Tunnel di Pennsylvania.

---

## 2 · 55 mil per jam, sebagai puncak kurva

```basic
1480 T=ABS(55-SP):IF T>12 THEN T=12.5
1490 T1=SP/(4.5-0.2*T)
1500 WF=WF-T1
```

Konsumsinya `SP / (4,5 − 0,2 × |55−SP|)`, dengan `|55−SP|` dibatasi 12,5.
Halaman portnya menyapu 20–100 MPH dan mencari titik teririt sendiri:
jawabannya **55 MPH, 4,5 mpg**.

Kurvanya **simetris**, dan di situlah pelajarannya: merangkak 20 MPH sama
borosnya dengan menggeber 100 MPH — keduanya 2,0 mpg. Melambat di bawah 55
tidak menghemat apa pun; ia menghukum Anda dua kali, dalam solar dan dalam
waktu.

Jangkauan satu tangki penuh 200 galon: **900 mil**. Rute terpendek 2.710 mil,
jadi berhenti mengisi bukan pilihan melainkan tiga kali keharusan.

---

## 3 · Tiga rute, dan satu angka yang menariknya ke dua arah

```basic
1365 IF IKEY$="n" THEN RT=1:RH=4
1370 IF IKEY$="m" THEN RT=0:RH=2
1375 RT=2:RH=1
```

`RH` muncul di **tiga** tempat, dan tidak semuanya searah:

| Baris | Pemakaian | Efek RH tinggi |
|---|---|---|
| `1450` | `IF SP>SL-RH+10 THEN GOSUB 2300` | polisi memperhatikan pada kecepatan **lebih rendah** |
| `2310` | `IF (SP-SL+2*RH-5)^2 < 900*RND THEN RETURN` | **lebih sulit** lolos dari tilang |
| `1440` | `IF AF > RH*25000*RND THEN GOSUB 2600` | ban **lebih jarang** meletus |

| Rute | Mil | Titik | RH | Polisi | Ban | Badai salju di ujung |
|---|--:|--:|--:|---|---|--:|
| northern | 2.710 | 18 | 4 | paling ketat | paling jarang | 15,9 % |
| middle | 2.850 | 21 | 2 | sedang | sedang | 16,2 % |
| southern | 3.120 | 25 | 1 | paling longgar | paling sering | **6,9 %** |

Rute utara paling pendek dan paling diawasi. Rute selatan **410 mil lebih
panjang** tapi polisinya paling longgar dan cuacanya jauh paling ramah. Tidak
ada rute yang menang di segalanya, dan itu jarang terjadi di program sekecil
ini.

---

## 4 · Cuaca memburuk makin ke timur

```basic
2810 AF=(3000+MF)*RND:ON RT+1 GOTO 2870,2820,2910
```

`MF` adalah odometer. Jadi jangkauan `AF` **tumbuh sepanjang perjalanan**, dan
karena ambangnya tetap, cuaca buruk baru mungkin sesudah Anda cukup jauh.
Di mil nol, `AF < 3000` selalu — badai salju **mustahil**. Di ujung timur ia
menunggu.

Peluang badai salju di ujung rute = `1 − ambang / (3000 + panjang rute)`; itu
angka di kolom terakhir tabel §3. Untuk sebuah perjalanan LA–New York di musim
dingin, arahnya benar.

Satu detail kecil yang mudah terlewat: ketiga penanganya menguji
`AF < ambang AND CR<>50`. Artinya **sekali badai salju turun, cuaca tidak boleh
langsung kembali cerah** — ia harus lewat kabut, hujan, atau jalan basah dulu.
Itu satu-satunya ingatan yang dimiliki cuaca di seluruh program, dan ia
dinyatakan dengan satu perbandingan.

> Perhatikan juga `ON RT+1 GOTO 2870,2820,2910`: urutan targetnya **tidak**
> menaik. RT=0 melompat ke 2870, RT=1 ke 2820. Blok yang ditulis lebih dulu di
> berkas bukan blok yang dipanggil lebih dulu. Benar, tapi menyesatkan pembaca.

---

## 5 · Risiko celaka adalah hasil kali

```basic
1400 AF=SP^2*CD*CR
1420 IF AF>RND*10000000 THEN GOTO 4000
```

Empat hal dikalikan: kecepatan kuadrat, kondisi pengemudi, kondisi jalan.

| Kondisi pengemudi | `CD` | Kondisi jalan | `CR` |
|---|--:|---|--:|
| rested | 1 | clear & dry | 1 |
| fine | 2 | clear, roadway wet | 3 |
| bored | 4 | rain / light snow | 5 |
| tired | 8 | fog | 10 |
| fatigued | 25 | **blizzard** | **50** |
| exhausted | 100 | | |

Yang membunuh bukan satu faktor melainkan **hasil kalinya**:

| Keadaan | Peluang celaka per jam |
|---|--:|
| 55 MPH, segar, cerah | 0,03 % |
| 55 MPH, kehabisan tidur, cerah | 3,03 % |
| 70 MPH, lelah, badai salju | **61,3 %** |

Port ini menampilkan angka itu di papan, tiap jam, dan menghitung ulangnya
saat Anda menggeser penggeser kecepatan. Itu tambahan — aslinya tidak
memperlihatkan apa-apa. Tapi ia menampilkan angka yang *sudah ada*, tidak
mengubah satu pun aturan.

Dan alasan kematian dipilih **sesudah** kematiannya, dari keadaan yang sama
(baris 4070–4120), berurutan: mengantuk, lalu badai, lalu kabut, lalu
kecepatan, lalu jalan licin, lalu — kalau tidak ada yang cocok — *"A drunk
driver rammed your rig. Tough luck!"* Sebab yang terakhir itu satu-satunya
yang bukan salah Anda, dan ia disediakan hanya untuk kasus di mana tidak ada
yang bisa disalahkan.

---

## 6 · Pengukur bahan bakarnya berbohong, dan itu disengaja

```basic
1560 …PRINT"Approximate fuel:";:PRINT INT(WF-4+RND*10);…
```

Yang ditampilkan **bukan** isi tangki. Ia isi tangki digeser acak antara −4 dan
+5, **diundi ulang tiap jam**. Kata *"Approximate"* di label itu bukan basa-basi;
ia peringatan yang jujur.

Diverifikasi di port dengan isi tangki ditahan pada 190 galon: dua belas
pengundian berturut-turut menghasilkan 193, 189, 194, 193, 188, 191, 188, 189,
194, 194, 194, 191 — lima nilai berbeda, rentang 188–194, persis jangkauan
−4…+5 yang dijanjikan rumusnya.

Satu hal penting soal **kapan** ia diundi: baris 1560 dijalankan sekali per
putaran, jadi angkanya berubah sekali per jam permainan dan diam di antaranya.
Port ini sempat salah di titik itu — mengundinya setiap kali papan angka
disegarkan — dan akibatnya bukan sekadar berkedip: karena undian itu mengambil
dari aliran acak permainan, **jumlah penyegaran tampilan ikut menggeser
jalannya permainan**. Lihat §11b.3.

Akibatnya nyata: Anda tidak pernah tahu persis kapan harus mengisi, dan baris
2500 menghukum tebakan yang salah dengan $200, beberapa jam, dan — kalau
muatannya jeruk — kerusakan muatan. Port menambahkan **bilah hijau** yang
menunjukkan nilai sebenarnya, dan menyatakannya sebagai tambahan.

---

## 7 · Kelelahan: aturan yang tidak diumumkan

```basic
1950 DH=HR-24*INT(HR/24)
1960 HR=HR+T:…
1970 IF DH>21 OR DH<12 THEN T=INT(T/2+0.6):PRINT"Thanks to the daytime noise…"
1980 HS=HS+T
1990 IF T>3 THEN HL=0 ELSE HL=HL/2
```

Urutannya yang menentukan. Jam maju sebanyak `T` **penuh** (baris 1960), lalu
baris 1970 **memangkas** `T` kalau Anda tidur siang, lalu baris 1990 memakai
`T` yang **sudah dipangkas** untuk memutuskan apakah jam terjaga disetel ulang.

Akibatnya, aturan sebenarnya:

- **Malam (20.00–05.00):** tidur ≥ 4 jam menyetel ulang kelelahan ke nol.
- **Siang (06.00–19.00):** butuh **≥ 7 jam**, karena 7 dipangkas jadi 4.
  Tidur lima jam menghabiskan lima jam dan hanya membukukan tiga — dan tiga
  tidak lebih besar dari tiga, jadi kelelahan cuma **dibagi dua**.

Tidak satu pun dari itu diberitahukan kepada pemain. Dalam pengujian port ini,
sopir otomatis yang tidur lima jam tiap berhenti tetap berakhir *EXHAUSTED* di
mil 2.750 dan menabrak — persis karena aturan ini.

---

## 8 · Lima cacat yang benar-benar ada

### 8a · `STOP` di baris 1850 — program berhenti

```basic
1800 IF TS>0 THEN 1900
1830 PRINT "     Do you want to buy a tire (Y or N)?"
1840 IF IKEY$="n" OR IKEY$="N" THEN 1900
1850 STOP
```

Tawaran membeli ban di truck stop hanya muncul kalau ban serep Anda **sudah
terpakai** — dan menjawab **Y** menjatuhkan program ke `STOP`. Kode
pembeliannya tidak pernah ditulis; harga di baris 1810–1820 dihitung dan
dicetak, lalu tidak dipakai.

Jadi satu-satunya jawaban aman untuk pertanyaan itu adalah "tidak". **Port
menghapus tawarannya** dan menjelaskan kenapa di tempat yang sama.

### 8b · `HL=HR+T+1` di baris 2660 — ban kempes membuat Anda mengantuk

```basic
2660 …:HR=HR+T:HL=HR+T+1
2730 HR=HR+4:HL=HL+4          ' bandingkan: bentuk yang benar
```

`HR`, bukan `HL`. `HR` adalah **total jam perjalanan**; `HL` adalah **jam sejak
tidur terakhir**. Menyalin yang satu ke yang lain berarti: sesudah ban meletus
pada jam ke-60, jam-terjaga Anda melompat ke 62 — jauh di atas ambang 19 — dan
kondisi Anda langsung jadi `EXHAUSTED`, `CD=100`.

Yang berarti: **ban kempes membuat Anda tertidur di belakang kemudi.** Sebab
dan akibat yang tidak masuk akal, dari satu huruf. Baris 2730 di subrutin yang
sama menulis bentuk yang benar, jadi ini salah ketik, bukan maksud.

**Dipertahankan** — dan port mencatat lompatannya di layar supaya terlihat.

### 8c · `COS` yang tidak pernah salah

```basic
3020 IF HL<4 AND COS(HR/HS)<2.3 THEN CD=1:…
3030 IF HL<8 AND COS(HR/HS)<2.5 THEN CD=2:…
```

`COS` mengembalikan nilai antara −1 dan 1. `COS(x) < 2,3` **selalu benar**.
Jadi dua dari enam tingkat kelelahan sebenarnya ditentukan `HL` saja. Baris
3040 dan 3050 di bawahnya memakai `HR/HS<=3` langsung, tanpa `COS` — hampir
pasti itulah yang dimaksud.

### 8d · Denda keterlambatan yang tidak pernah dipotong

```basic
5330 IF HR<95 THEN 5400
5340 CX=2:PRINT"     You're late!!  Subtract ten percent penalty.":GOTO 5400
5400 PRINT:XT=XT-XC:XP=XP+XT:…
```

Baris 5340 menyetel `CX=2`, mencetak pengumumannya, lalu meloncat ke 5400 —
yang cuma mengurangkan biaya. Untuk muatan *freight* (`CT=2`), `CX` **tidak
pernah dibaca lagi**. Dendanya tidak ada.

Ini bertentangan langsung dengan menu di baris 1050, yang menjual muatan itu
sebagai *"freight forwarding — penalty for late delivery"*. Ciri pembeda satu
pilihan muatan dari dua lainnya tidak berfungsi.

**Diverifikasi**, dan aritmetikanya telanjang di layar port ini:

```
Collect five cents a pound for freight: $1950.00
     You're late!!  Subtract ten percent penalty.
     Trip expenses totaled $1106.11
     Truck payment, insurance and taxes cost $680
Your net profit this trip was $163.89
```

1950 − 1106,11 − 680 = **163,89**, persis. Kalau 10 % ($195) benar-benar
dipotong, labanya −$31,11. Keempat angka itu hanya cocok kalau dendanya nol.

**Dipertahankan**, dan dilaporkan di catatan akhir perjalanan.

### 8e · Gudang New York yang tidak pernah tutup

```basic
5110 T=HR-INT(HR/24):IF T<10 OR T>21 THEN 5140
1950 DH=HR-24*INT(HR/24)          ' bentuk yang benar, di baris lain
```

Baris 5110 lupa mengalikan dengan 24. Rumusnya **kebetulan benar** selama 24
jam pertama, lalu meleset makin jauh: pada `HR=24` ia menghasilkan 23, pada
`HR=48` menghasilkan 46 — keduanya `>21`, artinya "buka".

Dan perjalanan tersingkat yang mungkin adalah 2.710 mil pada 82 MPH ≈ **33
jam**, jadi tidak seorang pun pernah tiba dalam 24 jam pertama. Pemeriksaan
"gudang tutup malam hari" itu **tidak pernah bisa berjalan**.

Kode yang benar di jendela yang tidak pernah dimasuki. Kebalikan dari kode
mati biasa: ia bukan tak terjangkau secara sintaksis, ia tak terjangkau secara
*fisika permainannya sendiri*.

### 8f · Sisanya

- `2740 TIMEPUT=2` — salah ketik `TIMEOUT`; jeda sesudah truk derek memakai
  nilai lama.
- `4160 RUN "b:???0??"` — nama berkas berjoker yang tidak akan pernah dimuat.
  Jalan keluar yang satu lagi (`5530 RUN "menu"`) benar.
- `5420` dan `5440` diuji terpisah, jadi laba antara $100 dan $200 memicu
  **keduanya**: *"G O O D   W O R K !!"* disusul *"You'd make more money washing
  dishes!"* Program memuji dan menghina Anda dalam dua baris berurutan.

---

## 9 · Batas resmi yang bukan batas

Baris 1100 bertanya: *"How many pounds will you carry (40,000 is the legal
limit)"*. Jembatan timbang di baris 3540 menimbang **kotor**:

```basic
3540 T=19000+WL+7*WF+25*(INT(RND*10))
3560 T=INT(T-60000)
```

Traktor 19.000 lb + muatan + **7 lb per galon solar** + jitter sampai 225 lb.
Dengan muatan "batas resmi" 40.000 dan tangki awal 190 galon:
19.000 + 40.000 + 1.330 = **60.330 lb** — sudah lewat 60.000 sebelum roda
berputar. Muatan yang benar-benar aman dengan tangki penuh sekitar **39.600
lb**, dan lebih besar kalau tangki tinggal separuh.

Angka yang dikutip program bukan angka yang ditegakkan program. Dan satu
pengecualian tidak diumumkan sama sekali: di **perbatasan Louisiana** —
satu-satunya titik dengan angka **tepat 5** di seluruh 64 titik data —
kelebihan berat tidak didenda melainkan membuat Anda diusir memutar 200 mil
lewat Arkansas dengan batas 45 MPH:

```basic
3660 SL=45:MR$(RT,NP)="Arkansas county roads"
3670 FOR I=12 TO 25:MP(RT,I)=MP(RT,I)+200:NEXT I
3680 MT(RT)=MT(RT)+200
```

Program **menyunting data rutenya sendiri** saat berjalan — dan tidak pernah
mengembalikannya, jadi perjalanan berikutnya di sesi yang sama mewarisi rute
selatan yang 200 mil lebih panjang sampai `RESTORE`/`READ` di baris 1130–1170
membacanya ulang. Kebetulan baris 1130 memang `RESTORE`, jadi cacatnya
tertutup. Port menyalin datanya sebelum menyunting, dan menyatakannya.

---

## 10 · Batang huruf T yang digambar dengan kursor

Layar judulnya mengeja **TRUCKER** dengan aksara gambar-kotak CP437. Enam huruf
terakhir digambar `LOCATE` demi `LOCATE`. Huruf pertama tidak:

```basic
20 …LOCATE 7,7:FOR X=1 TO 7:PRINT"══" CHR$(31) STRING$(2,29);:NEXT X:PRINT"╚╝";
```

`CHR$(31)` adalah **kursor turun** dan `CHR$(29)` **kursor kiri** — keduanya
aksara kendali, bukan glif. Barisnya berbunyi: *cetak dua batang, turun satu
baris, mundur dua kolom*, tujuh kali. Batang tegak huruf T digambar dengan
**menggerakkan** kursor, bukan dengan memposisikannya.

Itu sebabnya sapuan pertama saya atas berkas ini kehilangan huruf T: pencari
pola `LOCATE r,c:PRINT"…"` menemukan enam huruf dan mengira judulnya
"RUCKER". Yang mengembalikannya bukan pembacaan ulang kode melainkan
**menghitung lebarnya** — tujuh huruf pada kolom 3, 14, 25, 36, 47, 58, 69,
berjarak sebelas kolom, dan yang pertama kosong.

---

## 11 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| `INPUT` teks untuk tiap keputusan | tidak ada tetikus | Satu pertanyaan per saat | Panel keputusan yang berganti isi menurut fase; penggeser untuk kecepatan. Jumlah dan urutan pertanyaannya tidak berubah |
| Layar teks 80×25, tanpa gambar apa pun | 64 KB, monokrom | Simulasi angka, bukan gambar | **Pemandangan samping ditambahkan** — langit mengikuti jam sungguhan, cuaca mengikuti `CR`, marka jalan digeser oleh **odometer** sehingga kecepatan benar-benar terlihat. Semuanya turunan dari keadaan yang sudah ada |
| Data rute hanya dibaca, tak pernah diperlihatkan | — | 64 titik jalan yang tak terlihat | **Pita mil** di bawah layar: satu titik per titik jalan, berwarna menurut jenis kejadian, dengan nama dan nomor jalan di tooltip. Ini menampilkan data yang ada, bukan menambah aturan |
| `PRINT INT(WF-4+RND*10)` | — | Pengukur sengaja tidak akurat | **Dipertahankan** di papan angka; bilah hijau di bawahnya menunjukkan nilai sebenarnya, dinyatakan sebagai tambahan |
| Risiko celaka tidak pernah ditampilkan | layar penuh | — | **Ditampilkan** sebagai persen per jam, dan dihitung ulang saat penggeser digerakkan. Angkanya sudah ada di baris 1400; yang ditambahkan cuma pembagiannya dengan 10⁷ |
| Tempo diatur `TIMEOUT`/`GOSUB 59950` (gelung jam sibuk) | tidak ada `SLEEP` | Jeda dramatis | **Dihapus.** Jeda itu mengukur waktu dengan menghitung pekerjaan — persis yang tidak boleh ditiru |
| `RANDOMIZE` dari jam·menit·detik (baris 160) | tidak ada sumber acak | — | Kotak **Benih**: benih sama → perjalanan sama. Bilangan acaknya bukan bilangan GW-BASIC; LCG-nya tidak ditiru |
| `1850 STOP` | fitur tak selesai | — | Tawaran belinya **dihapus**, dan alasannya ditulis di panel (§8a) |
| `HL=HR+T+1` (2660) | salah ketik | — | **Dipertahankan**, lompatannya dicatat di layar (§8b) |
| Denda 10 % yang tidak dipotong (5340) | salah alur | — | **Dipertahankan**, dilaporkan di catatan akhir (§8d) |
| Alamat rumah penulis di baris 140–150 | kebiasaan 1982 | — | **Sengaja tidak disalin.** Nama dan kotanya disebut; berkas asli tetap utuh di `run/` |

Yang **tidak** diubah: seluruh baris 1400–1530, 2300–2740, 2810–3060, dan
3100–3920 apa adanya — termasuk `COS` yang selalu benar, ambang cuaca per
rute, dan aritmetika denda.

---

## 11b · Adegan bergerak, dan pagar yang menjaganya

Permintaan awalnya sederhana — "buat truknya terlihat berjalan" — tapi pada
program yang seluruh nilainya terletak pada kesetiaan terhadap 385 baris BASIC,
menambahkan animasi membawa satu bahaya yang harus ditutup lebih dulu:
**hiasan tidak boleh mengubah permainan.**

Tiga pagar dipasang untuk itu.

### 11b.1 · Berkas terpisah

Seluruh pemandangan tinggal di `trucker-scene.js` dan **tidak memuat satu pun
aturan**. `trucker.js` menjalankan aturannya seperti sebelumnya, lalu
menyerahkan hasilnya sebagai daftar kejadian bercap waktu 0–1. Siapa pun yang
ingin memeriksa kesetiaan port ini cukup membaca satu berkas dan boleh
mengabaikan yang lain sepenuhnya.

### 11b.2 · Aliran acak yang terpisah

Pesawat yang lewat, kereta barang, mobil yang menyalip — semuanya diundi dari
`rHias`, generator **tersendiri** yang dibenihi jam perjalanan. Kalau mereka
memakai `rnd()` milik permainan, maka menyalakan animasi akan menggeser setiap
bilangan acak sesudahnya, dan port ini berhenti bisa diperbandingkan dengan
aslinya.

### 11b.3 · Satu cacat yang baru terlihat karena animasi

Pagar kedua itu langsung menangkap sesuatu yang sudah ada sebelumnya, dan yang
tidak akan pernah saya temukan tanpa menguji dua mode berdampingan.

Pengukur bahan bakar yang berbohong (§6) saya hitung **di dalam
`perbaruiHud()`** — artinya tiap kali papan angka disegarkan, satu bilangan
acak permainan ikut terpakai. Jumlah penyegaran tampilan berbeda antara mode
animasi dan mode langsung, jadi **dua permainan dengan benih yang sama berakhir
berbeda**. Bukan animasi yang menyebabkannya; animasi hanya membuatnya
terlihat.

Perbaikannya sekaligus membuat port ini **lebih** setia, bukan kurang: di
aslinya baris 1560 dijalankan **sekali per putaran**, sesudah baris 1530 dan
sebelum titik jalan. Sekarang port melakukan hal yang sama — mengundi angkanya
sekali per jam, di tempat yang sama dalam urutan, lalu menampilkan angka yang
tersimpan. Efek sampingnya menyenangkan: pengukurnya jadi tidak berkedip-kedip
lagi saat papan angka disegarkan, persis seperti layar 1982 yang hanya menulis
ulang sekali per putaran.

### 11b.4 · Bukti

Satu perjalanan penuh, benih 1982, jeruk 39.000 lb, rute tengah, 55 MPH,
tidur 6 jam tiap berhenti — dijalankan dua kali di halaman yang baru dimuat,
sekali dengan animasi dan sekali tanpa:

| | tanpa animasi | dengan animasi |
|---|--:|--:|
| Putaran | 92 | 92 |
| Tiba | Sunday 11 AM | Sunday 11 AM |
| Odometer | 2.857 | 2.857 |
| Pengeluaran | $2.563,00 | $2.563,00 |
| Baris catatan | 227 | 227 |
| Sidik jari seluruh catatan (aksara) | 9.562 | 9.562 |
| Hasil | rugi $535,00 | rugi $535,00 |

Identik. Animasi murni penyajian.

> Catatan sampingan yang muncul saat menyiapkan uji ini: `NSTOP` (padanan `NS`
> di baris 1630) **terbawa antar perjalanan**, dan itu setia — `NS` tidak
> pernah disetel ulang di baris 1000 maupun 1190, dan baris 5460 kembali ke
> 1000 tanpa menyentuhnya. Begitu pula `NT`, jumlah tilang: ia hanya dinolkan
> sesudah menabrak (baris 4170), jadi tilang **menumpuk lintas perjalanan** dan
> tilang keempat mengirim Anda ke penjara meski di perjalanan yang berbeda.

### 11b.5 · Yang hilang di tengah gerakan, dan kenapa itu bukan soal keindahan

Versi pertama lapisan ini membangun ulang seluruh pemandangan **setiap jam**.
Gejalanya baru terlihat di truck stop: mobil yang sedang menyalip lenyap
seketika begitu truk berhenti. Tapi itu cuma tempat gejalanya paling
mencolok — sebenarnya **tiap pergantian jam** semuanya dihapus dan lahir ulang.

Ada dua obat yang mungkin, dan keduanya masuk akal:

**(a) Tunggu dulu.** Tahan panel keputusan sampai kendaraan yang sedang
menyalip lewat. Ditolak: itu membuat **aturan permainan menunggu hiasan**.
Jamnya sudah selesai dihitung; menunda keputusan pemain karena sebuah mobil
dekorasi belum keluar layar adalah ekor yang menggoyang anjing, dan lamanya
jeda jadi tak bisa ditebak.

**(b) Bekukan adegannya.** Dipilih — tapi bukan dengan membekukan segalanya.
Yang diberlakukan: **truk melambat sampai berhenti, dan tiap kendaraan lain
terus berjalan dengan kecepatannya sendiri.**

Yang membuat (b) mungkin adalah mengganti cara benda bergerak. Sebelumnya tiap
benda punya *pengali relatif*; sekarang tiap benda punya **kecepatan mutlak**,
dan geseran di layar dihitung satu rumus:

```
dx = (v_benda − v_kita) × parallax_lapisan × dt
```

| Benda | `v_benda` | Saat kita 55 MPH | Saat kita berhenti |
|---|--:|---|---|
| Pohon, rambu, marka | 0 | bergeser kiri | **diam** |
| Mobil menyalip kita | 1,55 × kita | bergeser kanan pelan | terus ke kanan, keluar layar |
| Mobil kita salip | 0,52 × kita | bergeser kiri pelan | **berbalik** ke kanan — ia jalan, kita tidak |
| Berlawanan arah | −1,05 × kita | bergeser kiri cepat | terus ke kiri |

Baris ketiga itu yang menyenangkan: mobil yang tadi kita salip, begitu kita
berhenti, **menyalip kita balik**. Tidak ada satu baris kode pun yang mengatur
itu; ia jatuh sendiri dari rumusnya.

Gelungnya tidak dimatikan saat truk berhenti. Ia terus berjalan selama masih
ada benda yang punya kecepatan sendiri, lalu **mati sendiri** begitu semuanya
diam — dengan pagar 12 detik supaya halaman yang ditinggalkan terbuka tidak
memutar gelung selamanya demi satu mobil.

Diverifikasi: pada akhir sebuah jam, `bergerak` tetap **4** sementara `v` turun
495 → 427 → 160 → 60 → 22 → 8 → 0, dan cacah benda tidak pernah anjlok. Dua jam
berturut-turut menunjukkan odometer adegan menyambung (1.275 → 1.634) alih-alih
kembali ke nol.

> Ini gejala yang **ketiga kalinya** muncul di proyek ini dengan wajah berbeda:
> apel SERPENT yang dihapus kodok, penanda kena SUB yang lenyap saat `SUB(n)`
> ditimpa 99, dan sekarang kendaraan yang hilang saat adegan dibongkar. Satu
> aturan yang sama menutup ketiganya: **keadaan yang sudah terlihat pemain
> tidak boleh menghilang tanpa sebab yang bisa dilihat.**

### 11b.6 · Teks yang mengukur dirinya sendiri

Tulisan di badan truk dan di rambu sempat melimpah keluar kotaknya — "FRESH
CITRUS" lewat ujung trailer, "TRUCK STOP" lewat papannya. Penyebabnya sepele
dan khas SVG: **teks tidak pernah membungkus dan tidak pernah mengecil
sendiri**, dan lebar huruf tidak bisa ditebak dari jumlah aksara.

Sekarang tiap teks membawa `data-maks` — lebar kotak yang tersedia baginya —
dan sesudah masuk dokumen ia **diukur** dengan `getComputedTextLength()`. Kalau
kepanjangan, ukuran hurufnya dikecilkan menurut rasio yang terukur.

Bukan `textLength`: atribut itu merenggangkan glif dan hasilnya gepeng —
pelajaran dari papan angka [ATTACK](attack.md) §6c. Mengecilkan ukuran huruf
mempertahankan bentuknya.

Dua hal yang tetap diperbaiki dengan tangan karena mengecilkan huruf bukan
jawaban yang benar: papan TRUCK STOP **dilebarkan** 132 → 192 satuan (tulisan
sebesar itu memang harus terbaca dari jauh), dan lambang jeruk di trailer
dipindah ke ujung buritan karena ia bertumpuk dengan tulisannya.


### 11b.7 · Urutan lapisan adalah urutan kedalaman

Truk yang menyalip sempat lewat **di belakang** kincir angin dan papan nama —
padahal ia jelas lebih dekat ke kamera daripada apa pun yang berdiri di pinggir
jalan. Dan kendaraan yang berlawanan arah tertimbun oleh aspal jalur seberang
itu sendiri, karena aspalnya digambar belakangan.

Keduanya satu sebab: SVG menggambar menurut **urutan dokumen**, jadi urutan
lapisan *adalah* urutan kedalaman — dan saya menyusunnya menurut kemudahan,
bukan menurut jarak. Sekarang urutannya dibaca seperti berjalan dari cakrawala
menuju kamera:

| # | Lapisan | Apa yang ada di sana |
|--:|---|---|
| 1 | `langit` | gradien langit |
| 2 | `surya` | matahari / bulan / bintang |
| 3 | `gunung` | siluet gunung (parallax 0,05) |
| 4 | `bukit` | bukit & mesa (0,14) |
| 5 | `benda_langit` | pesawat, burung |
| 6 | `jauh` | tanah dan **aspal jalur seberang** |
| 7 | `seberang` | **kendaraan berlawanan arah** (0,42) |
| 8 | `pembatas` | pagar median (0,55) |
| 9 | `pinggir` | pohon, rambu, kincir, truck stop (1,0) |
| 10 | `aspal` | **aspal jalur kita** |
| 11 | `marka` | cat marka — di atas aspal, di bawah roda |
| 12 | `salip` | **kendaraan searah / lajur salip** (1,0) |
| 13 | `truk` | truk kita |
| 14 | `depan` | rumput terdepan (1,4) |
| 15 | `cuaca` | hujan, salju, kabut |

Dua hubungan yang penting, dan keduanya bisa diperiksa tanpa melihat layar:
`salip` harus **sesudah** `pinggir`, dan `seberang` harus **sesudah** `jauh`.
Keduanya sekarang diuji sebagai perbandingan indeks, bukan dengan mata.

Perhatikan juga parallaxnya jadi menaik rapi dari 0,05 sampai 1,4 mengikuti
urutan itu — lebih dekat berarti lebih cepat. Ketika kedua daftar itu sejalan,
tidak ada lagi benda yang "melayang di kedalaman yang salah".

### 11b.8 · Warna yang membawa arti tidak boleh berdiri di atas latar yang berubah

Catatan perjalanan memakai warna untuk menandai jenis baris: kuning untuk
kejadian, merah untuk bahaya, hijau untuk kabar baik, putih untuk judul. Warna
itu dipilih untuk latar gelap — tapi kotaknya memakai `var(--bg-sunken)`, yang
mengikuti tema halaman. Di tema terang, baris pembuka *"You are at the Los
Angeles trucking terminal."* menjadi **putih di atas putih** dan hilang sama
sekali.

Kotak catatan sekarang berlatar gelap **tetap**, tidak mengikuti tema. Itu
sekaligus jujur pada asalnya: ini keluaran teks program DOS, dan di sana ia
memang putih di atas hitam.

Aturannya bisa dipakai ulang: **kalau warna dipakai untuk menyampaikan sesuatu,
latar di bawahnya tidak boleh berubah.** Kalau latarnya harus ikut tema, maka
warnanya juga harus, dan keduanya harus diperiksa berpasangan.


### 11b.9 · Dua peristiwa yang akhirnya punya gambar

**Ditilang.** Sebelumnya tilang cuma empat baris teks. Sekarang ia empat babak,
dan jam simulasi berhenti selama berlangsung:

| Babak | Yang terjadi |
|---|---|
| `kejar` | mobil polisi muncul dari belakang, lampu menyala, kecepatannya 1,9× kecepatan kita |
| `merapat` | begitu sampai di belakang truk, ia **`ikut`** — kecepatannya menjadi sama dengan kita — dan keduanya melambat sampai berhenti |
| `diam` | tertahan 1,9 detik; **baris dendanya ditulis di sini**, bukan saat polisi baru muncul |
| `lanjut` | kita menambah kecepatan lagi; polisi dilepas (`v = 0`) sehingga tertinggal dan tergeser keluar layar |

`ikut` itu satu-satunya tambahan pada mesin gerak, dan artinya sederhana:
*kecepatanmu sama dengan kecepatanku*. Karena rumus geserannya
`(v_benda − v_kita)`, benda ber-`ikut` otomatis diam di posisi layarnya apa pun
yang kita lakukan — mengekor saat kita masih melaju, ikut berhenti saat kita
berhenti. Tidak ada kode khusus untuk "mengekor".

Dan karena baris denda ditahan sampai babak `diam`, urutan bacanya jadi benar:
*"Smokey is behind you — pull over!"* muncul saat lampunya menyala di
belakang, sisanya baru muncul sesudah truk benar-benar berhenti di bahu jalan.
Ditilang lagi → mobil polisi datang lagi, dan seterusnya.

**Menabrak.** Ini satu-satunya tempat di seluruh berkas adegan yang
menggerakkan **truknya sendiri**; di semua keadaan lain truk diam di
(330, garis-lajur) dan dunianya yang bergerak.

| Waktu | Yang terjadi |
|--:|---|
| 0,00–0,52 s | truk keluar jalur ke bahu dekat: x 330→516, y turun 26, miring 0°→7° |
| 0,52 s | **hantam** — miring 14°, kaca retak, asap dari moncong, serpihan terbang, pohon tumbang 24°, layar berguncang |
| 0,52–1,50 s | mereda ke 11°, asap terus naik |

Pohonnya ditaruh di x=760 saat urutan dimulai, bukan di 660: selama truk
melambat, dunianya masih bergeser kira-kira `v × TAU` ≈ 100 satuan, jadi
pohonnya berhenti tepat di depan moncong. Angka itu turunan, bukan tebakan.

Bangkainya **tidak dihapus** ketika pesan kekalahan muncul — `berhenti()`
sengaja tidak menyentuh posisi truk maupun benda tabrakan, supaya
pemandangannya masih terlihat selama pesannya dibaca.

> Satu jebakan yang layak dicatat karena mudah terulang: bagian pohon yang
> tumbang ada di `<g>` **dalam**, bukan di `<g>` luar. Sebabnya bukan gaya —
> `<g>` luar memakai **atribut** `transform` untuk posisinya, dan properti
> **CSS** `transform` akan menimpanya sepenuhnya. Memasang kelas dengan
> `transform: rotate(24deg)` pada elemen yang sama membuat pohonnya meloncat ke
> titik asal SVG. Memisahkan "di mana ia berdiri" dari "seberapa miring ia"
> menghilangkan tabrakan itu, dan miringnya digerakkan JS supaya tidak ada CSS
> sama sekali yang menyentuh transform-nya.


### 11b.10 · Bilah solar yang tidak punya patokan

Laporan yang masuk: bilah bahan bakar terasa **tidak stabil** — kadang hijau,
kadang merah, tanpa pemain mengisi apa pun.

Yang pertama harus diperiksa: apakah ia benar-benar tidak stabil, atau hanya
tidak terbaca? Satu perjalanan ditelusuri dengan pemain **tidak pernah membeli
solar sama sekali**:

```
178 hijau  166 hijau  153 hijau  141 hijau  129 hijau  117 hijau  104 hijau
 92 hijau   80 hijau   68 hijau   54 hijau   42 kuning  30 kuning  18 MERAH
  6 MERAH  → 55 hijau  43 kuning  31 kuning  18 MERAH   6 MERAH
 → 55 hijau  … (dua kali lagi)
```

Turunnya **monoton**. Yang naik hanya tiga lompatan 6 → 55 galon — dan catatan
perjalanan memuat **tepat tiga** baris *"It cost $200 to get a barrel of diesel
delivered."* Itu baris 2550: begitu tangki habis, program mengirim barel darurat
dan mengisi tangki jadi **55 galon**. Jadi merah berubah hijau tanpa pemain
mengisi apa pun, dan itu memang aturan aslinya.

Berarti bilahnya tidak salah — ia **tidak punya patokan**. Satu-satunya ambang
yang dipakainya (20 galon) tidak tergambar di mana pun, angka di sebelahnya
adalah pengukur yang sengaja berbohong (§6), dan lompatan barel darurat
tampak seperti kedipan acak.

Tiga hal ditambahkan, dan ketiganya membuat gambar, bukan mengubah aturan:

1. **Garis skala** di 50 / 100 / 150 galon, jadi panjangnya bisa dibaca sebagai
   ukuran.
2. **Zona berwarna tercetak di jalurnya** — merah 0–20 galon, kuning 0–50 —
   sehingga ambangnya terlihat sebelum dilewati, bukan sesudah.
3. **Angka di sebelahnya**: galon sebenarnya *dan* jangkauannya dalam mil pada
   kecepatan yang sedang dipilih (`gal × mpg`), plus satu baris kunci di
   bawahnya yang menyatakan aturannya dengan kata-kata.

Ambangnya sendiri diturunkan, bukan dikarang: **50 galon ≈ 225 mil** pada 55
MPH, kira-kira satu penggal antar truck stop (empat jam mengemudi); **20 galon
≈ 90 mil**, cukup untuk mencari pom bensin dan tidak lebih.

> Pelajaran yang sama bentuknya dengan §11b.8: kalau sebuah tampilan memakai
> warna untuk memberi peringatan, **ambangnya harus tergambar**. Warna yang
> berubah tanpa garis acuan tidak terbaca sebagai ukuran — ia terbaca sebagai
> kerusakan.

### 11b.11 · Menepi, bukan ditabrak dari belakang

Mobil polisi sempat berhenti **menempel** di buritan trailer, dan itu terlihat
seperti ia menabrak truknya. Ruangnya memang tidak ada: truk membentang dari
x≈78 sampai 450, sedangkan mobil polisi selebar 116 satuan — tidak muat di
belakangnya tanpa keluar layar.

Jawabannya bukan menggeser mobil polisi melainkan **menggerakkan truknya**:
saat ditilang, truk sekarang **maju menepi** ke x=470 dan turun 6 satuan ke
bahu jalan, persis seperti yang dilakukan pengemudi sungguhan. Baru sesudah itu
ada ruang di belakangnya.

Celahnya sendiri diturunkan dari geometri, bukan disetel dengan mata:

```
x_polisi = x_truk + buritan_trailer − moncong_polisi − 38
```

`buritan_trailer` berbeda untuk tiap muatan (−244 jeruk, −252 freight, −204
pos), jadi rumus itu memberi **celah 38 satuan yang sama** untuk ketiganya —
diverifikasi: 38, 38, 38. Dan karena mobil polisi menahan posisinya terhadap
buritan tiap bingkai, celahnya tetap utuh selama truk masih merayap menepi.


### 11b.12 · Kejadian yang hanya ada di teks adalah kejadian yang tidak terjadi

Laporan berikutnya menutup §11b.10 dengan rapi. Pemain bingung melihat bilah
solar melompat merah → hijau; sesudah bilahnya diberi skala, ia menemukan
sebabnya sendiri — di catatan perjalanan:

> *"After 1 more miles, you ran out of fuel (DUMMY !!) It cost $200 to get a
> barrel of diesel delivered."*

Jadi memang ada pengisian. Diagnosis saya di §11b.10 benar tapi **belum
lengkap**: masalahnya bukan sekadar bilah tanpa patokan, melainkan bahwa
seluruh kejadian itu hanya berupa dua baris teks di kotak yang boleh saja tidak
sedang dibaca. Sesuatu yang mengubah keadaan permainan sebesar itu — tangki
terisi 55 galon, $200 melayang, beberapa jam hilang — tidak boleh cuma
tertulis.

Sekarang ia punya gambar, dan gambarnya memakai **mesin sela yang sama persis
dengan tilang** — hanya kendaraannya yang berbeda, dan babak terakhirnya
terbalik:

| Babak | Tilang | Kehabisan solar |
|---|---|---|
| 1 | polisi mengejar dari belakang | **kita berhenti dulu** dan menepi |
| 2 | merapat, keduanya berhenti | truk tangki datang dari belakang |
| 3 | tertahan; **baris denda ditulis di sini** | tertahan; **baris pengantaran ditulis di sini** |
| 4 | kita pergi, **polisi ditinggal** | **truk tangki yang pergi** mendahului, baru kita jalan |

Urutan babak pertama itu bukan pilihan gaya. Percobaan pertama memunculkan truk
tangki selagi kita masih 55 MPH, dan dengan kecepatan mutlak 430 lawan 495 ia
justru **tertinggal makin jauh** — karena memang lebih lambat. Menunggu kita
berhenti membalik tanda selisihnya, dan ia menyusul dengan sendirinya. Sistem
kecepatan mutlak (§11b.5) menolak dijadikan bohong: kalau adegannya tidak masuk
akal secara fisika, ia tidak akan tergambar.

Dan urutannya di layar jadi benar dengan sendirinya: baris *"ran out of fuel"*
muncul saat truk mulai kehabisan tenaga, baris *"$200 for a barrel"* muncul saat
truk tangki sudah berhenti di sampingnya, dan bilah solar baru berubah hijau
sesudah jam itu selesai — karena papan angka memang hanya disegarkan di akhir
jam. Tidak ada satu baris pun kode yang mengatur urutan itu.

> Aturan yang layak dibawa ke port berikutnya: **kalau sebuah kejadian mengubah
> keadaan yang ditampilkan, kejadian itu harus punya gambar.** Teks saja
> membuat perubahannya tampak seperti kerusakan — dan pemain yang tidak sedang
> membaca kotak catatan tidak punya cara untuk tahu bedanya.


---

## 11c · Apa yang digambar, dan dari mana asalnya

| Di layar | Asalnya |
|---|---|
| Papan nama kota | kolom nama di `DATA` — BARSTOW, NEEDLES, FLAGSTAFF … |
| Perisai Interstate dengan nomornya | diurai dari kolom nama jalan: `I-40 in California` → **40** |
| Papan "TIME ZONE — SET CLOCK AHEAD 1 HOUR" | kejadian jenis 1 |
| Gerbang tol berpalang | kejadian jenis 2 |
| Drum oranye + rambu SPEED LIMIT 35 | kejadian jenis 3 |
| Mobil polisi (sirene menyala kalau ditilang) | kejadian jenis 4, dan nyalanya mengikuti hasil sebenarnya |
| Jembatan timbang | kejadian jenis 5 |
| Mulut terowongan tertutup batu | kejadian jenis 6 — hanya ada **satu** di seluruh permainan |
| Papan TRUCK STOP, kanopi pompa, dua truk parkir tampak belakang | tawaran baris 1710; kalau Anda menolak, ia **lewat begitu saja** |
| Mobil polisi berhenti di belakang truk, lalu ditinggal | tilang baris 2320–2410 |
| Truk keluar jalur menghantam pohon, berasap dan retak | celaka baris 4000–4120 |
| Truk tangki kecil datang mengisi solar, lalu pergi | kehabisan bahan bakar, baris 2500–2560 |
| Warna langit & matahari/bulan | jam sungguhan, `DH = HR+8` |
| Hujan, salju, kabut, jalan basah | `CR` — 3, 5, 10, 50 |
| Lampu depan menyala | gelap, atau kabut/badai |

Dan yang murni suasana, tanpa kaitan aturan: pesawat berjejak uap, kawanan
burung, kereta barang sejajar jalan, kincir angin, silo gandum, kuda di padang
berpagar, kaktus saguaro di gurun, papan reklame.

**Bentang alam berganti menurut seperlima perjalanan** — gurun, dataran tinggi,
padang rumput, pertanian, lalu kota — dan itu angka yang sama yang dipakai
program untuk apa pun: odometer dibagi panjang rute.

### Kedalaman itu selisih kecepatan

Tidak ada perspektif di layar ini. Yang ada enam lapisan yang bergerak dengan
pengali berbeda terhadap **satu** kecepatan:

| Lapisan | Pengali |
|---|--:|
| Gunung | 0,05 |
| Bukit & mesa | 0,14 |
| Jalur berlawanan | 0,42 |
| Pinggir jalan, marka, lajur salip | 1,00 |
| Rumput terdepan | 1,40 |

Kendaraan lain tidak memakai pengali lapisannya melainkan **kecepatan
relatif**, dan tandanya yang bercerita: positif berarti bergerak ke kiri (kita
yang menyalip), **negatif berarti bergerak ke kanan** (mereka yang menyalip
kita), dan angka besar untuk yang berpapasan karena kedua kecepatan bertambah.

Roda berputar menurut **jarak**, bukan waktu: `sudut += jarak / jari-jari`.
Jadi ketika truknya melambat, rodanya melambat sendiri — tidak ada satu pun
angka "kecepatan putar" yang perlu disetel, dan tidak mungkin roda berputar
sementara truk diam.

Piksel per mil per jam (9) dan lama animasi (2,6 detik pada 1×) adalah
**selera**, dan dinyatakan begitu: di aslinya satu jam berlalu seketika begitu
Anda menekan Enter. Penggeser *Animasi* menyediakan 0,5× / 1× / 2× /
langsung, dan pilihan **langsung** memulihkan perilaku 1982 persis.

Selama animasi berjalan **tidak ada satu pun tombol di panel** — jamnya sudah
terlanjur dihitung, jadi tidak ada keputusan yang masuk akal untuk diambil di
tengahnya.

---

## 12 · Latihan

1. Jalankan satu jam pada **20 MPH**, lalu satu jam pada **100 MPH**. Bandingkan
   solar yang terpakai. Keduanya 2,0 mpg — kurvanya simetris, dan merangkak
   bukan penghematan.
2. Ambil rute **selatan** dan perhatikan cuaca di seribu mil pertama. Badai
   salju mustahil, dan itu bukan keberuntungan: `AF = (3000+MF)*RND` tidak bisa
   melewati 5.700 sebelum odometer Anda 2.700.
3. Muat **40.000 lb** persis seperti yang disarankan baris 1100, lalu lewati
   jembatan timbang pertama dengan tangki penuh. Hitung dendanya.
4. Tidur **5 jam** di siang hari, lalu periksa papan kondisi. Lalu ulangi
   dengan **7 jam**. Selisih dua jam itu selisih antara "dibagi dua" dan
   "disetel ulang".
5. Bawa **freight** dan sengaja tiba sesudah `HR = 95`. Catat empat angka di
   akhir (bayaran, biaya, cicilan, laba) dan periksa apakah 10 % benar-benar
   hilang. Jawabannya ada di §8d, tapi hitung sendiri dulu.
6. Ambil rute **tengah** dan cari Alleghany Tunnel — satu-satunya longsor di
   seluruh permainan. Berapa mil dari Los Angeles, dan berapa peluangnya
   benar-benar terjadi?
7. Setel *Animasi* ke **langsung**, mainkan satu perjalanan, catat hasilnya.
   Ulangi dengan animasi menyala dari halaman yang baru dimuat. Angkanya harus
   sama persis — kalau tidak, ada hiasan yang mencuri bilangan acak (§11b).
8. Perhatikan **noktah putih** di ban saat melaju 20 MPH lalu 90 MPH. Ia tidak
   dipercepat oleh siapa pun; ia hanya menempuh jarak yang lebih jauh.

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/TRUCKER.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
