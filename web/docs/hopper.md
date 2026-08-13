# HOPPER — dari EXE ≤1991 ke web

| | |
|---|---|
| Sumber | `run/HOPPER.EXE` |
| Basis port | `decompile/HOPPER/hopper-run.bas` — 394 baris, 0 panggilan runtime tak tertangani |
| Ukuran asli | 208 pernyataan · CGA mode 4 · 11 jalur |
| Tahun | **≤1991** — batas atas dari `HOPPER.SCO`; tidak ada petunjuk tahun di binernya |
| Hasil port | [`../games/hopper/`](../games/hopper/index.html) |
| Analisis dekompilasi | [`../../decompile/HOPPER/ARCHITECTURE.md`](../../decompile/HOPPER/ARCHITECTURE.md) |

Menyeberang jalan dan sungai. Satu-satunya dari empat `.EXE` yang menyimpan keadaan
**di luar dirinya**, dan satu-satunya yang menyuntikkan assembly ke dirinya sendiri.

---

## 1 · Program BASIC yang menyuntikkan assembly ke dirinya sendiri

Tiga belas pernyataan `DATA` berisi 232 angka desimal. Program membacanya dengan
`READ`, mem-`POKE` satu per satu ke memori bebas yang dihitungnya sendiri dari
pointer ruang kerja BASIC, lalu memanggilnya:

```basic
550  DEF SEG : F4! = INT(CSNG(PEEK(779)*256 + PEEK(778) + 514) * .0625)
590  READ F6! : POKE CINT(F3!), (CINT(F6!)) AND 255
8580 DEF SEG = CINT(F4!) : CALL I1%
```

| Klaim | Bukti |
|---|---|
| Bytenya asli, bukan karangan | **13 dari 13** pernyataan `DATA` cocok persis dengan teksnya di segmen data biner |
| Bytenya kode 8086 yang sah | dibongkar jadi penggulung CGA: `std` (salinan mundur), `mul bx` dengan `0x1E0` = 480 = 6 baris × 80 bita |
| Ia benar-benar menggulung | dijalankan di emulator dengan pola uji: **geseran 8 piksel mendatar**, 19.659 dari 64.000 piksel berubah |
| Kadensinya | **sekali per bingkai**, tepat sesudah `PUT` menggambar kataknya |

**Kenapa serumit itu?** Karena BASIC tidak bisa menggulung *sebagian* layar. Satu
`PUT` per kendaraan sudah lambat; menggulung sebelas jalur setiap bingkai mustahil.
Jadi penulisnya menulis assembly, mengubahnya menjadi angka desimal, dan
menempelkannya sebagai `DATA` di tengah program BASIC-nya.

> **Pelajaran.** Ketika sebuah bahasa kehabisan tenaga tepat di satu titik panas,
> jalan keluarnya sering bukan mengganti bahasanya melainkan **menembusnya** di
> titik itu saja. Bentuknya berubah — `DATA`+`POKE`+`CALL` dulu, `WebAssembly`,
> ekstensi C, atau *intrinsic* SIMD sekarang — tapi bentuk keputusannya sama
> persis: satu lubang sempit yang sengaja dibor, dan seluruh sisanya tetap di
> bahasa yang mudah.

---

## 2 · Tabel kecepatan sebelas jalur, terbaca dari dalam kode mesin

Di dalam 232 bita itu, offset 5–15 bukan instruksi melainkan parameter:

```
[1, -1, 2, -1, 2, 0, 1, -1, 2, -2, -1]
```

Sebelas nilai. Arah berselang-seling. Satuannya **bita layar** — satu bita CGA
mode 4 memuat empat piksel, jadi `2` berarti delapan piksel per gulir.

Dan yang keenam **nol**: jalur diam. Itu **median strip** Frogger, dan ia terbaca
dari *data*, bukan dari melihat layarnya.

> **Pelajaran.** Blok kode yang disuntikkan sering membawa parameternya di dalam
> dirinya, tepat di depan titik masuk, karena di situlah tempat termudah
> menaruhnya. Sebuah `jmp` pendek di byte pertama adalah tanda paling jelas bahwa
> yang dilompati itu **data**, bukan kode — dan di sini byte pertamanya memang
> `EB 12`, lompat 18 bita ke depan.

---

## 3 · Makro `DRAW`-nya asli — tapi bukan aset yang dipakai

Enam string `DRAW` byte-identik dengan deskriptor di biner:

```
S4$ = "C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE"        katak
S5$ = "C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF2"        batang kayu
```

`DRAW` bahasa makro penggerak pena di GW-BASIC: `U D L R` empat arah lurus,
`E F G H` empat diagonal, `C n` ganti warna, awalan `B` berarti pindah **tanpa**
menggambar.

Versi pertama port ini **menafsirkan makronya dan menggambar hasilnya langsung ke
layar** — dengan alasan yang sama seperti `audio.js` menafsirkan makro `PLAY`.

Idenya menarik dan hasilnya buruk. Makro-makro itu sprite CGA seukuran **11 × 10
piksel**; ditumpangkan sebagai garis tipis di atas kotak sebesar jalur, yang keluar
coretan, bukan gambar. Dilaporkan pemilik proyek setelah melihatnya, dan benar.

Jadi seluruh rupa halaman ini **digambar ulang** — bentuk vektor yang dirancang
untuk ukuran layar ini. Penafsir `DRAW`-nya tetap ada dan tetap dijalankan, tapi
hanya untuk **melaporkan** angka di panel (21 ruas garis, kotak 11 × 10), supaya
angka itu hasil penafsiran dan bukan angka yang saya ketik.

Temuan bahwa keenam string itu byte-identik dengan biner tetap berdiri. Yang
berubah cuma perannya: ia **bukti**, bukan aset.

Adanya `E F G H` sebagai perintah tersendiri itu sendiri sebuah temuan: di layar
yang pikselnya tidak persegi dan prosesornya tanpa pengali, diagonal yang harus
dirakit dari dua perintah akan mahal — jadi bahasanya menyediakannya langsung.

> **Pelajaran.** "Setia pada sumbernya" dan "bagus dilihat" adalah dua tujuan yang
> bisa bertabrakan, dan ketika bertabrakan, yang menang tergantung **apa yang
> sedang dikirim**. Untuk sebuah dokumen, kesetiaan menang. Untuk sesuatu yang
> dimainkan, tidak — dan menyamarkan hasil yang buruk sebagai kesetiaan cuma cara
> halus untuk tidak mengakuinya.
>
> Yang tidak perlu dikorbankan: temuannya sendiri. String itu tetap byte-identik,
> tetap didokumentasikan, tetap bisa diperiksa. Ia hanya berhenti jadi aset.

---

## 4 · Logikanya tidak pernah membaca layar — dan itu harus diukur dulu

Pertanyaan yang menentukan bentuk port ini: apakah penggulung itu **hanya
memindahkan piksel**, atau juga mengubah sesuatu yang dibaca kembali oleh logika
permainan? Kalau yang kedua, mengganti gulirnya dengan animasi akan diam-diam
mengubah aturannya.

Pertanyaannya bukan teoretis. [PAC-GAL](pacgal.md) di koleksi yang sama membaca
layarnya sendiri untuk mendeteksi tabrakan.

Diukur dengan kait pada **setiap pembacaan memori dari B800** selama 150 juta
instruksi:

| | |
|---|--:|
| Pembacaan VRAM total | 21.873 |
| Dari **kode pengguna** | **0** |
| Sisanya | rutin grafis runtime |

Dan diperiksa langsung di sumbernya: `hopper-run.bas` memakai `SCREEN()`
**nol kali** (PAC-GAL: dua belas). Jadi keadaan permainan hidup di variabel, dan
mengganti penggulung dengan animasi **tidak mengubah aturan apa pun**.

> **Pelajaran.** "Boleh diganti" adalah klaim tentang *ketergantungan*, dan
> ketergantungan bisa diukur. Menebaknya dari membaca kode berisiko; memasang kait
> dan menghitung tidak.

---

## 5 · Dua bukti yang berbeda, dan yang satu lebih lemah

Halaman port sengaja memberi keduanya judul yang berbeda, karena mereka menguji
hal yang berbeda.

### Bukti I/O — kuat

`run/HOPPER.SCO` ditulis program aslinya pada **2 Agustus 1991 (UTC)**. Disodorkan
ke rekonstruksi, dibaca, diurutkan, ditulis kembali:

| | |
|---|--:|
| Isi sampai penanda `0x1A` | 101 bita |
| Isi asli lawan hasil tulis | **identik** |
| Berkas asli | 128 bita |
| Selisih | 27 bita padding nol |

Klaimnya **isi-identik**, bukan berkas-identik: aslinya 128 bita karena DOS
memadatkan ke blok, dan padding nol itu **satu sampel** — tidak cukup untuk
menggeneralkan bahwa DOS selalu menulis nol dan bukan sisa penyangga.

### Bukti gambar — statistik, bukan eksak

| | |
|---|--:|
| Warna terpakai, EXE lawan `.bas` | sama |
| Peta baris berisi sepakat | **193 / 200 (96%)** |
| Korelasi profil tinta per baris | **0,844** |

Bandingkan: PAC-GAL **24/24 baris** dan 3DTTT **18/18**, keduanya *eksak, sel demi
sel*. Bukti HOPPER lebih lemah, dan itu dinyatakan di halamannya.

Sebabnya bukan kemalasan: HOPPER satu-satunya yang layarnya **bergerak terus**,
jadi kedua sisi tidak pernah berada pada saat yang sama. Selisih jumlah tinta
(22.098 lawan 14.465) itu **selisih waktu, bukan selisih gambar**. Perbandingan
eksak hanya mungkin untuk layar yang diam.

> **Pelajaran.** Dua bukti yang bersebelahan tanpa label akan membuat yang lemah
> meminjam kekuatan yang kuat. Berkas skor menguji **I/O**; perbandingan layar
> menguji **gambar**. Menyebut keduanya "terverifikasi" tanpa membedakannya
> menyembunyikan persis bagian yang paling perlu diketahui pembaca.

---

## 6 · Tahunnya tidak diketahui, dan itu ditulis apa adanya

Entri katalog sempat menulis `"year": "1984"`. **Itu tebakan saya, tanpa dasar.**

Diperiksa: pencarian pola `19xx` di seluruh `HOPPER.EXE` menemukan **nol** konteks
ASCII yang masuk akal. Tanggal berkasnya 2000-01-29 — jelas tanggal penyalinan,
sama dengan `SPACEWAR.EXE`.

Yang benar-benar ada cuma batas atas: papan skornya sudah ditulis program itu pada
1991. Jadi entrinya sekarang `≤1991`, dengan alasannya di `note`.

> **Pelajaran.** Metadata yang **ditebak** terlihat persis sama dengan metadata
> yang **diperiksa** — keduanya cuma angka di kolom yang sama. Satu-satunya
> pertahanannya menuliskan dasarnya di sebelahnya, supaya yang kosong terlihat
> kosong.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Gulir jalur | 232 bita assembly di-`POKE` lalu `CALL`, sekali per bingkai | BASIC tidak bisa menggulung sebagian layar; `PUT` per kendaraan terlalu lambat | Animasi biasa. **Boleh** karena diukur: logikanya nol kali membaca VRAM, jadi penggulung itu murni piksel |
| Kecepatan jalur | tabel 11 nilai di dalam kode mesin | parameter paling murah ditaruh di depan titik masuk | **Dipakai apa adanya** dari data yang dipulihkan, bukan disetel ulang dengan tangan |
| Sprite | `GET`/`PUT` XOR, bentuk dari makro `DRAW` | tidak ada buffer ganda; XOR menggambar dan menghapus dengan perintah yang sama | **Digambar ulang** sebagai bentuk vektor. Percobaan pertama memakai makro `DRAW` aslinya dan hasilnya coretan — sprite 11 × 10 piksel tidak bisa jadi gambar seukuran jalur. Makronya tetap ditafsirkan untuk melaporkan angkanya, tapi **bukan lagi aset**. XOR-nya tidak ditiru; sudah dibahas di [`space.md`](space.md) §2 |
| Papan skor | berkas `HOPPER.SCO` di disket | satu-satunya penyimpanan | `localStorage` lewat `store.js`, **diisi awal dengan sepuluh pasang dari berkas 1991** — data yang selamat, bukan hiasan |
| Prompt skill/speed | `PRINT USING` dengan nilai berjalan di dalam kurung siku, mis. `[1]`; dua sumbu, **skill 1&ndash;4** dan **speed 1&ndash;500** (bawaan 100) | menanyakan kesulitan di awal adalah satu-satunya cara sebelum ada menu | **Promptnya tidak diport, sumbunya diport.** Prompt teks sebelum bermain kendala terminal, bukan rancangan; tapi sumbu kecepatannya nyata dan dipakai: tiap level mengalikan laju jalur, berhenti di **×5,00** karena 500/100 itulah langit-langit dial aslinya. Yang ditambahkan cuma *siapa yang memutar dialnya* &mdash; lihat &sect;7b |
| Perataan katak | `PUT` menaruh sprite pada koordinat kiri-atas | sprite CGA memang dialamati dari sudut | **Titik tengah**, dan sempat salah: port menggambar di `y + 6` seolah `y` tepi atas, padahal `y` sudah titik tengah. Kataknya turun 6 dari 13 piksel tinggi jalur dan duduk di perbatasan. Tabrakannya tetap benar &mdash; logikanya memakai `y`, bukan gambarnya &mdash; jadi yang rusak justru yang paling sulit dilihat dari kode: **yang tampak tidak cocok dengan yang dihitung** |
| Layar | CGA mode 4, 320×200, empat warna | mode grafis termurah yang berwarna | SVG `viewBox="0 0 320 200"` — resolusi yang sama, supaya koordinat dari kode aslinya tetap berarti |
| Warna | palet CGA mode 4: hitam, cyan, magenta, putih | perangkat keras | **Tidak ditiru, dan itu perlu dikatakan** karena komentar di `hopper.css` sempat mengaku menirunya sementara keempat warnanya bukan warna CGA. Begitu rupanya digambar ulang, palet empat warna kehilangan alasannya. Kini enam warna kendaraan, dipilih **per kendaraan** dengan kocokan tanpa ulang &mdash; jumlahnya enam karena harus melebihi kendaraan terpadat di satu jalur (4). Bandingkan `pacgal.css`, yang memang masih meniru |

---

## 7b &middot; Fase &mdash; keadaan yang hilang, dan akibatnya

Versi pertama port ini cuma punya dua keadaan: **sedang main** dan **selesai**.
Tidak ada keadaan untuk *"sedang menunjukkan sesuatu, permainannya belum lanjut"*.

Akibatnya persis seperti yang dilaporkan pemilik proyek saat memainkannya:
mengisi rumah kelima membuat permainan **berhenti tanpa keterangan**, dan satu-satunya
jalan keluar adalah menekan tombol Mulai. Secara kode tidak ada yang menggantung
&mdash; `usai()` memang dipanggil, toast memang muncul. Tapi menyelesaikan seluruh
layar dan tamat total dipetakan ke keadaan yang **sama**, jadi keberhasilan dan
kegagalan tampak identik.

Sekarang lima fase:

| Fase | Yang jalan | Yang berhenti | Keluar bila |
|---|---|---|---|
| `main` | semua | &mdash; | mati, atau kelima rumah terisi |
| `gepeng` | jalur bergulir | masukan, jam, tabrakan | 1,15 dtk |
| `nyemplung` | jalur bergulir | masukan, jam, tabrakan | keluar layar, batas 2,8 dtk |
| `tuntas` | jalur bergulir | masukan lompat, jam | 2,2 dtk **atau tombol apa pun** |
| `usai` | &mdash; | semua | tombol Mulai |

Tiga keputusan di tabel itu yang perlu alasan:

**Jalurnya tetap bergulir selama animasi mati.** Membekukan seluruh layar akan
membuat jeda satu detik itu terbaca sebagai program menggantung &mdash; keluhan
yang sama yang melahirkan bagian ini. Dunia yang jalan terus memberitahu pemain
bahwa yang berhenti cuma dia.

**Dua sebab mati, dua animasi.** Air dan jalan membunuh dengan cara berbeda, dan
kalau keduanya cuma "katak hilang, katak muncul lagi", pemain kehilangan
satu-satunya umpan balik yang memberitahu **kesalahan mana** yang barusan ia buat.
Terlindas: memipih 0,18 dtk secara lintas-pudar ke bentuk cipratan bermata silang,
plus bekas ban, lalu diam. Tenggelam: riak menyebar di **titik masuk** &mdash; bukan
di posisi kataknya, karena riak tinggal di tempat sedang kataknya hanyut &mdash;
kataknya berputar tenggelam, bergelembung, dan terseret sampai keluar layar.

**Arus yang dipercepat.** Mengikuti kecepatan jalur apa adanya lebih benar secara
fisika, tapi jalur terpelan cuma 20 piksel/detik: dari tengah layar butuh **delapan
detik** untuk keluar. Delapan detik menunggu bukan animasi, melainkan hukuman. Jadi
arusnya digambarkan menyeret &mdash; mulai selambat jalurnya lalu menderas, dan
keluar dalam 1,5&ndash;2 detik.

> **Pelajaran.** Cacat ini tidak kelihatan dari membaca kode, karena secara kode
> tidak ada yang salah: setiap baris melakukan persis apa yang tertulis. Yang salah
> ada di **pemetaannya** &mdash; dua kejadian yang sangat berbeda artinya bagi
> pemain dipetakan ke satu keadaan program. Bug seperti ini cuma muncul kalau
> seseorang benar-benar memainkannya, dan itu sebabnya "sudah lolos uji" tidak sama
> dengan "sudah dicoba".

---

## 7c &middot; Menguji animasi di tab yang tidak pernah terlihat

Kesulitan yang tidak terduga: tab yang dikendalikan lewat otomasi selalu
`visibilityState: "hidden"`, dan Chrome **menghentikan `requestAnimationFrame`**
di tab tersembunyi. Gelung permainannya tidak pernah berdetak, jadi tidak ada satu
pun bingkai animasi yang bisa dilihat. Membaca itu sebagai "animasinya tidak jalan"
akan salah &mdash; sama sekali bukan halamannya yang bermasalah.

Jalan keluarnya bukan menambah kait khusus-uji ke kode yang dikirim, melainkan
**mengambil alih jamnya**: `requestAnimationFrame` diganti antrean, lalu diputar
tangan dengan cap waktu yang naik persis 1/60 detik. Yang diuji tetap kode aslinya
&mdash; hanya sumber detaknya yang diganti, dan langkahnya jadi bisa diulang persis.

Dua kesalahan uji muncul dan keduanya sempat menyamar jadi cacat program:

1. Bingkai dipotong ke jendela **tetap**, lalu kataknya hanyut keluar dari jendela
   itu. Terbaca seolah animasinya hilang di detik pertama. Potongannya kemudian
   **dihitung dari posisi kataknya sendiri**.
2. Tombol lompat ditekan **selagi fase nyemplung masih jalan**. Masukan di fase itu
   memang sengaja diabaikan, jadi kataknya tidak pernah naik ke jalan dan uji
   berikutnya kelihatan gagal.

> **Pelajaran.** Sama seperti di sisi dekompilasi: **sebuah ketiadaan bukan bukti.**
> Nol bingkai animasi selalu punya dua penjelasan &mdash; animasinya tidak jalan,
> atau alat ukurnya tidak bisa melihat. Yang membedakan bukan menatap hasilnya
> lebih lama, tapi memeriksa alatnya lebih dulu.

---

## 7d &middot; Panel angka yang bisa mematikan permainan

Sesudah &sect;7b dikirim, pemilik proyek melaporkan gejala baru: **kendaraan dan
batang kayunya diam total**. Kataknya masih bisa melompat &mdash; hanya dunianya
yang beku.

Kombinasi itu yang menunjuk sebabnya. Kalau gelung permainan mati, seharusnya
*semuanya* diam. Yang tetap hidup adalah hal-hal yang menggambar sendiri di luar
gelung: `lompat()` memanggil `gambar()` langsung, jadi kataknya tetap tampak
bergerak. Artinya bukan `update()` yang salah &mdash; **gelungnya tidak pernah
dinyalakan**.

Penangan tombol Mulai berbunyi begini:

```js
reset(true);
pesanLayar(null);
gambar(); segarkan();        // <-- melempar di sini
$('go').textContent = 'Berjalan';
mainLoop.start();            // <-- tidak pernah tercapai
```

`segarkan()` menulis ke enam elemen HUD, dan satu di antaranya baru ditambahkan
bersama sistem level (`s-level`). Cukup satu dari enam itu tidak ada &mdash;
misalnya `index.html` versi lama masih tersimpan di cache sementara `hopper.js`
sudah versi baru &mdash; dan `TypeError` di baris itu menghentikan seluruh
penangan **sebelum** `mainLoop.start()`.

Diuji dengan membuang elemennya di halaman yang berjalan: label tombol tidak
berubah jadi "Berjalan", nol kendaraan bergerak, kataknya tetap melompat. Gejala
cocok persis.

Tiga perbaikan, dan yang ketiga yang paling penting:

| Perbaikan | Isi |
|---|---|
| Urutan dibalik | `mainLoop.start()` dipanggil **pertama**, gambar dan panel menyusul |
| Penulisan HUD jadi toleran | `tulis(id, nilai)` melewatkan elemen yang tidak ada, alih-alih melempar |
| Tombol panah memulai sendiri | tekanan panah pertama menyalakan gelungnya kalau belum jalan |

Yang ketiga menghapus **keadaannya**, bukan cuma penyebabnya. Selama masih mungkin
kataknya melompat sementara gelungnya belum jalan, akan selalu ada jalan untuk
sampai ke layar yang tampak macet &mdash; dan itu keadaan yang tidak pernah berguna
bagi siapa pun.

> **Pelajaran.** Ini kegagalan **urutan**, bukan kegagalan logika: tidak ada satu
> pun baris yang salah, tapi pekerjaan rapuh ditaruh mendahului pekerjaan penting,
> sehingga *panel angka punya kuasa untuk mematikan permainan*. Aturan yang keluar
> darinya: **nyalakan yang esensial lebih dulu, hias belakangan** &mdash; dan apa
> pun yang cuma menampilkan informasi tidak boleh bisa melempar ke jalur yang
> menjalankan permainannya.
>
> Perhatikan juga bentuk laporannya. "Kendaraannya diam tapi kataknya jalan" jauh
> lebih menunjuk daripada "rusak": justru **bagian yang masih hidup** yang
> memberitahu di mana batas kerusakannya.

---

## 8 &middot; Latihan

1. **Bongkar sisa kode mesinnya.** 232 bita, dan baru sebagian yang terbaca.
   Instruksi mana yang menangani jalur berkecepatan **negatif**, dan bagaimana ia
   berbeda dari yang positif? Petunjuk: `test cs:[0x11], 0x80`.
2. **Ukur ongkos yang dihindari.** Perkirakan berapa `PUT` yang dibutuhkan untuk
   menggulung sebelas jalur tanpa assembly, lalu bandingkan dengan satu `CALL`.
   Pada 4,77 MHz, berapa bingkai per detik yang tersisa?
3. **Uji penafsir `DRAW`-nya.** Beri ia makro `S3$` — yang terpanjang. Berapa ruas
   garis yang dihasilkannya, dan berapa sub-jalur terpisah (dihitung dari jumlah
   awalan `B`)? Bentuk apa yang keluar?
4. **Cari batas bukti statistik.** Ambil dua tangkapan layar HOPPER pada saat
   berbeda dari rekonstruksi yang **sama**, lalu jalankan `gfxref.py` di antara
   keduanya. Berapa korelasinya? Angka itu adalah *lantai* — di bawahnya,
   perbandingan 0,844 terhadap EXE tidak bisa dibedakan dari selisih waktu belaka.
5. **Periksa klaim padding.** Tulis ulang `HOPPER.SCO` dengan isi yang lebih
   pendek dari 101 bita, lalu periksa 27 bita terakhirnya. Apakah nol lagi, atau
   sisa penyangga? Satu percobaan tambahan sudah mengubah "satu sampel" menjadi
   dua.

---
Berkas terkait: [pakai](../games/hopper/index.html) ·
[fondasi](_fondasi.md) ·
[PAC-GAL — port pertama dari EXE](pacgal.md) ·
[3DTTT](3dttt.md) ·
[SPACE — teknik XOR GET/PUT](space.md) ·
[blok data & penggulung](../../decompile/HOPPER/DATA-BLOCKS.md) ·
[EXE aslinya](../../run/HOPPER.EXE)
