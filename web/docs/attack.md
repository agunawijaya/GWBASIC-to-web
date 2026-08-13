# ATTACK — dari disket utilitas IBM 1982 ke web

> `run/ATTACK.BAS` · 7 Oktober 1982, kode build `MOD-5-5-M` · 204 baris
> · [pakai portnya](../games/attack/index.html) ·
> [analisis BASIC aslinya](../../reviews/ATTACK.md)

Sehari sesudah [SERPENT](serpent.md), dari tangan yang sama, dengan kerangka
layar pembuka yang sama persis. Dan temanya membuatnya artefak paling jujur soal
zamannya di seluruh koleksi ini.

---

## 1 · Sebuah program IBM yang mengebom pabrik Apple

Layar pembukanya berbunyi **"IBM — General utility programs"**. Layar
petunjuknya:

```basic
1820 PRINT "  YOUR MISSION IS TO ATTACK AND DESTROY"
1830 PRINT "THE APPLE COMPUTER MANUFACTURING PLANT."
1850 PRINT "THERE ARE APPLE-OWNED FIGHTERS TRYING"
1860 PRINT "TO STOP YOU,YOU MUST DESTROY THEM WITH"
```

Ketiga berkas *Attack / Serpent / Zap'em* satu tangan, satu minggu:

| Berkas | Tanggal | Kode build |
|---|---|---|
| [SERPENT](serpent.md) | 6 Oktober 1982 | `USR-5-5-K` |
| **ATTACK** | **7 Oktober 1982** | `MOD-5-5-M` |
| ZAP'EM | — | — |

Perang IBM–Apple bukan gaya pemasaran yang muncul belakangan. Ia sudah jadi tema
permainan yang ditulis orang dalam untuk disket utilitas kantor, di bulan yang
sama IBM PC berumur setahun.

---

## 2 · Seluruh lanskapnya satu string

```basic
540 A$="_____/\_____/\__/\_______/\_/\____/\__/\___▄▄▄_…?"
670 B$=MID$(A$,L+Z,40-Z)
680 COLOR 6:LOCATE 23,1+Z:PRINT B$;
```

Tidak ada larik medan, tidak ada peta, tidak ada generator. Ada **satu string**,
dan yang bergulir adalah jendela 40 kolom yang menggeser satu aksara per
bingkai.

| | |
|---|--:|
| Panjang `A$` | **190** |
| Indeks terjauh tersentuh (`L=149`) | 188 |
| Aksara yang tak pernah terlihat | **2** |
| Pabrik — kode 210 & 193 | **6** |
| Bangunan lain — kode ≥169 | **30** |
| Medan — `_` `/` `\` | **153** |
| Penanda ujung `?` | 1 |

Datanya **tidak diketik ulang** di port ini. `web/games/attack/attack-data.js`
dibangkitkan langsung dari `run/ATTACK.BAS`, dan cacah di atas dihitung halaman
itu sendiri saat dibuka — jadi tidak ada kesempatan salah salin, dan kalau
berkas aslinya berubah, angkanya ikut berubah.

### Guncangan layar dengan satu variabel

Perhatikan `40-Z`, bukan `40`.

```basic
1530 Z=4          ' baris 1530, saat bom meledak
 660 IF Z>0 THEN Z=Z-1
```

Selama `Z>0`, jendelanya **ikut menyempit** sekaligus bergeser ke kanan. Jadi
lanskapnya tersentak mundur lalu menyusul lagi selama empat bingkai. Guncangan
layar, dari satu variabel, tanpa satu pun baris yang khusus menanganinya.

---

## 3 · Bomnya selalu jatuh di kolom 3

```basic
1030 IF Y/2=INT(Y/2) THEN BY=Y+1 ELSE BY=Y    ' selalu baris ganjil
1050 COLOR 2:LOCATE BY,3:PRINT "•";
1080 …LOCATE BY,3:PRINT " ";:BY=BY+2:LOCATE BY,3:PRINT "•";
1070 IF BY=21 THEN GOSUB 1450
1460 BE=SCREEN(BY+2,3)
```

Kolomnya **tetap 3**, selalu. Yang berubah cuma **kapan** Anda menjatuhkannya —
lanskapnyalah yang bergerak melewati kolom itu.

Ini permainan pewaktuan yang menyamar jadi permainan membidik, dan tukar-menukarnya
utuh dalam dua baris. Lama jatuh = `(21 − BY) ÷ 2 + 1` bingkai, jadi dari
ketinggian bomnya lebih lama di udara dan sasarannya harus dipimpin lebih jauh.
Imbalannya naik persis sejalan:

```basic
1510 IF BE=210 OR BE=193 THEN SC=SC+(25-Y2)*12
```

`Y2` adalah baris pesawat **saat bom dilepas**.

| Baris lepas | Bingkai jatuh | Nilai pabrik |
|--:|--:|--:|
| 21 | 1 | 48 |
| 15 | 4 | 120 |
| 7 | 8 | **216** |

Tapi baris 7 tepat di bawah garis atmosfer di baris 5 — satu langkah salah dan
`Y5=1`, kendali hilang, pesawatnya jatuh sendiri (baris 810).

### Diverifikasi ujung ke ujung

Waktu jatuhnya dihitung **lebih dulu** dari aritmetika BASIC-nya, lalu
dijalankan di port:

| | |
|---|---|
| Indeks pabrik di `A$` | 123, 124, 125, 130, 131, 132 |
| Baris lepas `Y2` | 15 → `BY0 = 15`, jatuh 4 bingkai |
| Bingkai pelepasan yang dihitung | **117** |
| Aksara di kolom 3 saat meledak | **210** — cerobong pabrik |
| Skor bertambah | **120** |
| `(25 − 15) × 12` | **120** ✓ |

Dan satu ronde penuh dimainkan sampai bingkai 148 dengan 41 kejadian skor:
seluruhnya jatuh tepat di salah satu dari tiga rumus — `(25−Y2)×12`, `10..39`
acak, atau `+20` musuh. **Nol nilai yang tidak dikenali.**

---

## 4 · Benih acak yang kehilangan faktor enam puluh

```basic
500 R1$=LEFT$(TIME$,2):R2$=RIGHT$(TIME$,2):R3$=MID$(TIME$,3,2)
510 RANDOMIZE VAL(R1$+R2$+R3$)
```

`TIME$` berbentuk `"HH:MM:SS"`. Indeks ke-3 adalah **titik dua**, bukan menit.

| | | |
|---|---|---|
| `R1$` | `"HH"` | jam |
| `R2$` | `"SS"` | detik |
| `R3$` | `":M"` | **titik dua + satu digit menit** |

`VAL("HHSS:M")` berhenti di titik dua, jadi komponen ketiganya **tidak
menyumbang apa pun**:

| | |
|---|--:|
| Terbaca — HH + SS | 24 × 60 = **1.440** |
| Dimaksud — HH + SS + MM | 24 × 60 × 60 = **86.400** |
| Yang hilang | faktor **60** |

Satu posisi meleset. [FLYS](flys.md) di koleksi yang sama menulis
`MID$(TIME$,4,2)` dan benar; [METEOR](meteor.md) menghindari jam sepenuhnya dan
mendapat 32.003.

> **Pelajaran.** Cacat ini tidak pernah bisa terlihat dari perilaku program.
> 1.440 benih masih terasa acak bagi satu pemain; yang hilang cuma terlihat
> kalau rumusnya dibaca. Ekspresi yang **berhasil dijalankan** tanpa galat, dan
> hasilnya tetap masuk akal, adalah tempat paling nyaman bagi kesalahan untuk
> bersembunyi selama empat puluh tahun.

Cacatnya **dipertahankan** di port, dan benih yang dipakai ditampilkan di papan
angka supaya bisa diperiksa sendiri.

---

## 5 · Dua POKE ke bita yang sama, lewat dua jalan berbeda

```basic
520 …DEF SEG=&H40 : POKE &H17,&H40    ' 0040:0017 <- 64  = CapsLock
625  DEF SEG=0    : POKE 1047,32      ' 0000:0417 <- 32  = NumLock
```

`0x40:0x17` dan `0x0000:0x0417` adalah alamat linear yang **sama** — 1047
desimal, bita bendera papan ketik BIOS. Program ini menuliskannya dua kali
lewat dua cara pengalamatan yang berbeda.

Dan keduanya `POKE` biasa, bukan OR. Jadi baris 625 **menghapus CapsLock** yang
baru dinyalakan baris 520. Tulisan pertamanya mati sebelum sempat berguna: kode
mati yang terlihat seperti bekerja.

[SERPENT](serpent.md), sehari sebelumnya, cuma melakukan yang kedua — dan
melakukannya dengan alasan yang jelas (`VAL(INKEY$)` butuh NumLock menyala).
Baris 520 ATTACK kelihatannya sisa percobaan yang tidak ikut dibersihkan.

---

## 6 · Layar sebagai struktur data — kemunculan kelima, dan yang paling tak terduga

| Program | Yang dibaca dari layar |
|---|---|
| [SPACE](space.md) | latar, supaya `PUT…XOR` bisa menghapus dirinya |
| [METEOR](meteor.md) | seluruh dunianya |
| [SERPENT](serpent.md) | bentuk tubuhnya sendiri |
| **ATTACK** | **nilai skor** |
| PAC-GAL *(dari EXE)* | tabrakan labirin |

Empat yang lain menanyakan **tabrakan**: apakah ada sesuatu di sini. ATTACK
menanyakan **harga**: berapa nilai benda yang barusan saya kenai. Bomnya tidak
tahu apa yang dikenainya sampai ia membaca aksara di bawahnya, dan rumus mana
yang dipakai ditentukan oleh **kode aksara** itu — 210 dan 193 satu rumus, ≥169
rumus lain, sisanya tidak sama sekali.

Konsekuensinya menarik: **tabel harga permainan ini adalah fonta CP437.** Ganti
satu aksara di `A$` dengan aksara lain yang kodenya kebetulan ≥169, dan sebuah
bangunan baru muncul lengkap dengan nilainya, tanpa satu baris pun ditambahkan.

---

## 6b · Sinar laser yang tidak pernah tergambar

Dilaporkan pemilik koleksi: *"tembakan laser tidak kelihatan. Ada enemy yang
menurut saya sudah tertembak, tapi masih jalan terus."*

Dua keluhan, dan yang kedua akibat yang pertama.

**Sebabnya urutan, bukan logika.** Baris 790 dijalankan dari penangan tombol —
di **antara** dua bingkai. Versi pertama port ini memadamkan sinarnya di awal
bingkai berikutnya:

```js
if (B === 1) langkahBom();
if (laserSisa > 0) laserSisa -= 1;   // 1 -> 0
…
gambar();                             // membaca 0, jadi tidak menggambar apa pun
```

Jadi sinarnya **tidak pernah terlihat sekali pun** — bukan jarang, bukan
sekejap: nol kali. Aturan mainnya tetap benar sepanjang waktu; yang hilang cuma
gambarnya.

**Dan itulah yang melahirkan keluhan kedua.** Baris 1130 hanya membunuh musuh
yang barisnya **persis sama** dan `X>4`. Tanpa sinar, pemain tidak punya cara
tahu baris mana yang sebenarnya ditembak — jadi tembakan yang meleset satu baris
terlihat sama persis dengan musuh yang kebal.

Ada satu aturan asli yang ikut jadi tak terlihat karena hal yang sama: baris
1160 melompat keluar dari gelung setelah kena, jadi **satu tembakan paling
banyak menjatuhkan satu musuh**. Dua musuh sebaris berarti yang kedua selamat.
Itu ada di aslinya dan dipertahankan — sekarang terlihat, karena sinarnya
berkilat putih dan hanya satu yang meledak.

**Perbaikan pertama saya salah, dan pemilik koleksi menemukannya lagi.**

Saya membuat sinarnya bertahan satu bingkai penuh supaya terbaca pada 12
bingkai per detik. Laporan berikutnya: *"saya melihat dengan mata kepala saya
sendiri, ada pesawat musuh terkena laser, tapi masih tetap terbang."*

Kali ini sebabnya bukan sinar yang hilang melainkan **sinar yang berbohong**:

| | |
|---|---|
| Uji kenanya | dijalankan pada keadaan dunia **saat tombol ditekan** |
| Gambarnya | bertahan melewati **satu langkah simulasi** |
| Selama langkah itu | musuh bergerak **dua kolom** dan bisa berpindah baris |

Jadi pemain melihat sinar melintasi musuh yang **tidak pernah diuji** — musuh
itu baru pindah ke situ sesudah tembakannya dinilai. Deteksinya benar sepanjang
waktu; yang salah adalah gambar yang bertahan lebih lama daripada keadaan yang
diujinya.

**Perbaikan yang benar: sinarnya jadi kejadian, bukan keadaan.** Ia dibuat
sekali di lapisan efek, pada baris yang benar-benar diuji, lalu memudar sendiri.
`gambar()` tidak pernah menyentuhnya, jadi ia tidak bisa tergambar ulang
terhadap dunia yang sudah berubah. Tiga jaminan ia hilang, dan yang ketiga yang
mengikat:

1. animasi CSS selesai;
2. pewaktu cadangan, kalau animasinya tidak pernah berjalan — tab latar
   belakang atau `prefers-reduced-motion`;
3. **langkah simulasi berikutnya** — begitu dunia maju, sinarnya tidak lagi
   berhak tergambar.

Itu justru bentuk aslinya: baris 1100–1120 menggambar, menahan `FOR D=1 TO 20`,
lalu menghapus — semuanya di dalam satu penekanan tombol. Kilatan, bukan
keadaan.

Ditambah pembedaan **merah tua kalau meleset, putih menyilaukan kalau kena**.
Panjangnya bukan pilihan: baris 1100 mencetak `M$` selebar **36 aksara** mulai
kolom 5, dan baris 1130 membunuh yang `X>4` — gambarnya dan syarat bunuhnya
menutupi rentang yang sama persis.

### Diverifikasi

Satu ronde penuh, 59 tembakan, tiga invarian diperiksa pada **setiap** tembakan:

| Invarian | Pelanggaran |
|---|--:|
| Baris sinar = baris pesawat saat menembak | **0** |
| Sinar *meleset* → tidak ada musuh terlihat di barisnya (`X>4`) | **0** |
| Sinar *kena* → skor bertambah tepat +20 | **0** |
| Cacah *kena* (6) = cacah kejadian +20 (6) | ✓ |

Plus invarian tunggal yang menutup sebabnya: sinar **ada** tepat sesudah
menembak, dan **hilang** sesudah satu langkah simulasi.

> **Pelajaran, dan saya perlu dua putaran untuk sampai ke sini.** Cacat pertama
> membuat sinarnya tak terlihat; perbaikan saya membuatnya terlihat **tapi
> berbohong**, dan itu lebih buruk — pemain yang tidak melihat apa-apa tahu ia
> tidak tahu, pemain yang melihat sinar mengenai musuh **yakin** ia tahu.
>
> Akarnya satu: saya memperlakukan gambar sebuah **kejadian sesaat** sebagai
> **keadaan yang bertahan**. Begitu ia bertahan, ia harus ikut diperbarui saat
> dunia berubah — dan karena uji kenanya tidak bisa diulang tanpa mengubah
> aturan, satu-satunya jawaban yang benar adalah tidak membiarkannya bertahan
> sama sekali.
>
> Dan soal alat: pengujian saya yang memeriksa **nilai** lolos dua kali —
> 41 lalu 59 kejadian skor tanpa satu pun nilai asing. Yang menangkapnya baru
> invarian yang memeriksa **hubungan antara yang terlihat dan yang diuji**.
> Bandingkan [SERPENT §6d](serpent.md): invarian bagus untuk keadaan yang
> mustahil, tapi ia hanya sekuat pertanyaan yang Anda pikirkan untuk
> ditanyakan — dan pertanyaan itu datang dari orang yang memainkannya.

---

## 6c · Papan angkanya ada di dalam layar, dan saya melewatkannya

Ditanyakan pemilik koleksi: *"apakah laser ada limitnya? Kalau iya, harus
ditampilkan dong."* Lalu, setelah melihat di mana saya menaruhnya:
*"kamu menaruh informasi score, laser dan bom jauh di paling bawah, di bawah
cara bermain. Kenapa kamu memutuskan begitu ya? Aneh sekali. Biasanya informasi
seperti itu bahkan ada di dalam layar permainan, di paling atas."*

**Persis begitu, dan aslinya memang begitu.** Saya melewatkan baris 600:

```basic
 600 COLOR 7:LOCATE 4,3 :PRINT "BOMBS -";BD;" SCORE -";SC;
            :LOCATE 4,28:PRINT "LASERS -";SF;
1040       …LOCATE 4,3 :PRINT "BOMBS -";BD
1100       …LOCATE 4,28:PRINT "LASERS -";SF
1160/1520  …LOCATE 4,14:PRINT "SCORE -";SC
```

Baris **4** — tepat di atas garis atmosfer baris 5, di dalam layar permainan,
dan diperbarui di empat tempat berbeda supaya selalu benar. Port versi pertama
saya tidak menggambar apa pun di sana; petak baris 4 dibiarkan kosong dan
angkanya dipindah ke panel HTML di luar layar.

Sekarang digambar di baris 4, kolom **3 / 14 / 28** — kolomnya diambil dari
baris pembaruannya (1040/1160/1100), bukan dari baris 600, karena ketiganya
yang berjalan terus-menerus.

*(Satu detail yang tidak ditiru: baris 600 mencetak lewat satu `PRINT`
beruntun, dan spasi di depan `" SCORE -"` membuatnya mulai di kolom 15,
sementara baris 1160 memakai kolom 14. Jadi di aslinya label SCORE bergeser
satu kolom ke kiri begitu skornya berubah pertama kali. Itu cacat tampilan,
bukan aturan main, jadi kolom 14 dipakai sejak awal.)*

### Aturan tata letak saya sendiri yang salah

Pertanyaan "kenapa kamu memutuskan begitu" punya jawaban, dan jawabannya tidak
membela keputusannya. Kontrak tata letak koleksi ini berbunyi
`.screen → .ruleset → .howto → .hud`, dan **saya yang menetapkannya** di sesi 9b.
Alasannya waktu itu benar: panel *Cara bermain* pernah ditaruh di kolom kanan
dan hilang di bawah lipatan saat tata letaknya menumpuk.

Tapi perbaikan itu kelewat jauh. `.howto` wajib `open` dan panjang, jadi
menaruh `.hud` **sesudahnya** mendorong keadaan permainan yang *hidup* — skor,
amunisi, sisa bingkai — ke bawah teks yang hanya dibaca sekali. Aturan yang
lahir untuk menyelamatkan panel bantuan malah mengubur papan angkanya.

Urutannya sudah dikoreksi jadi **`.screen → .ruleset → .hud → .howto`** dan
diterapkan ke **33 halaman** yang punya keduanya.

> **Pelajaran.** Aturan yang lahir dari satu kegagalan cenderung dioptimalkan
> untuk kegagalan itu saja. "Panel bantuan jangan sampai terkubur" diselesaikan
> dengan menaruhnya lebih tinggi daripada segalanya — dan tidak ada yang
> bertanya apa yang tergeser ke bawah. Yang lebih dalam lagi: papan angka HTML
> itu sendiri sudah salah tempat sejak awal, karena **program aslinya sudah
> punya papan angka, di dalam layarnya**. Saya membangun pengganti untuk
> sesuatu yang seharusnya cukup diport.

---

## 6d · "Pesawatnya tidak bisa diam?" — bisa, dan kenapa remnya harus ada

Ditanyakan pemilik koleksi: *"kalau sudah sekali menggerakkan ke atas atau ke
bawah, pesawat tidak bisa diam ya? Memang sengaja begitu by design?"*

Bisa — tuts **5** mendatarkannya, dan itu baris 730:

```basic
710 IF C$="8" THEN Y1=-1
720 IF C$="2" THEN Y1=1
730 IF C$="5" THEN Y1=0
```

Sudah diperiksa di port: datar di baris 9 → 6 langkah → masih 9; tekan `2` →
3 langkah → baris 12; tekan `5` → 7 langkah → masih 12. Tombol layar
*5 datar* sama.

**Dan ya, "menyetel arah" itu memang disengaja — tapi bukan karena selera.**
`INKEY$` tidak punya kejadian **tombol-dilepas**. BASIC DOS secara harfiah
tidak bisa tahu kapan Anda melepas tombol, jadi model "tahan untuk bergerak"
mustahil. Yang tersisa cuma: setel arah, lalu sediakan rem.

Ketiga permainan aksi di kelompok ini menyelesaikan kendala yang sama dengan
cara berbeda, dan perbandingannya rapi:

| Program | Cara menyetel arah | Remnya |
|---|---|---|
| **ATTACK** | `8` / `2` menyetel `Y1` | tuts khusus: **`5`** |
| [METEOR](meteor.md) | panah memasang selot `H$` | **tombol apa pun selain panah** |
| [SERPENT](serpent.md) | `4`/`6`/`2`/`8` menyetel `X1,Y1` | **tidak ada** — ularnya tidak pernah berhenti |

### Yang benar-benar salah: tidak ada penunjuknya

Aturannya benar sejak awal; yang kurang **cara melihat arah mana yang sedang
berlaku**. Tanpa itu, "sudah saya tekan 5, apa dia benar-benar datar?" tidak
punya jawaban di layar — dan wajar kalau disimpulkan pesawatnya memang tidak
bisa didiamkan.

Sekarang tombol arah yang sedang berlaku **disorot**, dan arahnya juga tertulis
di papan angka (`datar` / `naik` / `turun` / `jatuh (tak terkendali)`).

> **Pelajaran, dan ini ketiga kalinya berturut-turut di halaman yang sama.**
> Sinar laser yang tak tergambar (§6b), papan angka yang tidak diport (§6c),
> dan sekarang arah yang tidak ditampilkan — ketiganya **bukan cacat aturan**.
> Aturannya benar di ketiga kasus, dan setiap pengujian yang memeriksa *nilai*
> lolos. Yang rusak selalu hal yang sama: **keadaan yang berlaku tidak bisa
> dilihat.** Port yang setia pada aturan tapi tidak setia pada apa yang
> *diberitahukan* program aslinya kepada pemain masih port yang salah.

---

## 6e · Ya, laser dan bomnya ada batasnya

Ya, dan itu memang ada di aslinya:

```basic
 520 …SC=0:SF=60:BD=35…
 790 IF SF>0 AND C$="6" THEN GOSUB 1100
1040 …BD=BD-1:LOCATE 4,3:PRINT "BOMBS -";BD
1100 …SF=SF-1:COLOR 7:LOCATE 4,28:PRINT "LASERS -";SF
1840 PRINT "YOU ARE ALLOTED 35 BOMBS AND 60 LASERS."
```

**35 bom, 60 laser**, dan aslinya menampilkan keduanya terus-menerus di baris 4
layar — jadi ia memang tidak pernah dimaksudkan jadi angka tersembunyi. Port
versi pertama menaruhnya di papan angka saja, dan itu tidak cukup terbaca.
Sekarang tampil di **tiga tempat**: papan angka, angka pada tombolnya sendiri,
dan bilah sisa. Menekan tombol saat habis memberi pesan, bukan diam.

Dan ada satu aturan yang lebih keras lagi: **keduanya tidak diisi ulang di ronde
berikutnya.** Baris 520 hanya dijalankan sekali; baris 1799 (`GOTO 540`)
melompat melewatinya. Jadi ronde dua dimulai dengan sisa persediaan ronde satu.

Soal "aneh, laser kok ada limitnya" — memang aneh untuk laser, tapi itulah
seluruh ekonominya. Sasarannya terbatas dan tetap: **6 sel pabrik dan 30 sel
bangunan** dalam satu lanskap yang sama tiap ronde. Kalau amunisinya tak
terbatas, 149 bingkai cukup untuk menghabiskan semuanya tanpa satu pun
keputusan. Kelangkaan itulah yang membuat pilihan "bom sekarang atau tunggu
pabrik" punya harga.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Lanskap | satu string 190 aksara, digulir `MID$` (§2) | tidak ada memori untuk peta | **Ditiru persis**, dan datanya **dibangkitkan** dari `run/ATTACK.BAS`, bukan diketik ulang |
| Petak layar | `SCREEN(23,3)` menilai bom (§3) | tidak ada struktur data lain | **Dipertahankan sebagai mekanisme.** Ada petak 40×25; `at(23,3)` yang menentukan skor, bukan daftar objek |
| Guncangan `Z` | jendela menyempit jadi `40-Z` (§2) | — | **Dipertahankan persis**, ditambah guncangan CSS di luar layar |
| Rupa | aksara CP437 di layar teks | `SCREEN 0,1`, 40 kolom | **Digambar sendiri** per sel, diturunkan dari petak. Pemetaannya **bukan selera**: kode 210/193 satu-satunya bangunan berwarna hangat, karena keduanya satu-satunya yang dinilai `(25−Y2)×12`. Sasaran termahal harus paling mudah dikenali. Tombol **Mode 1982** mengembalikan aksaranya |
| Kecepatan | satu putaran gelung penafsir | tidak ada pewaktu | Penggeser bingkai/detik, bawaan **12**. Rasionya **dipertahankan persis**: satu bingkai = satu geseran lanskap = satu langkah musuh = dua baris jatuh bom |
| Kendali | tuts `8`/`2`/`5`/`4`/`6` | `INKEY$` tak punya kejadian tombol-dilepas | **Dipertahankan persis** — ia **menyetel arah** dengan `5` sebagai rem (710–730), bukan tombol ditahan. Panah dan tombol layar ditambahkan sebagai padanan. Arah yang berlaku **disorot** dan ditulis di papan angka; lihat §6d |
| Sinar laser | `M$` 36 aksara di baris `Y` mulai kolom 5, ditahan `FOR D=1 TO 20` lalu dihapus | tidak ada pewaktu | **Kejadian sesaat, bukan keadaan** — panjang dan awal sama persis, dan ia dibuang pada langkah simulasi berikutnya supaya tidak pernah tergambar terhadap dunia yang sudah berubah (§6b). Ditambahkan pembedaan **merah = meleset, putih = kena** |
| Baris status | `LOCATE 4,3 / 4,14 / 4,28` — **di dalam layar**, baris 4, tepat di atas garis atmosfer (600/1040/1100/1160) | — | **Digambar di baris 4 layar**, kolom 3/14/28 sama persis. Terlewat sepenuhnya di versi pertama port — lihat §6c |
| Tampilan persediaan | selalu di layar (§6c) | — | Di layar **plus** tiga tempat pendukung: papan angka HTML, angka pada tombolnya, dan bilah sisa. Menekan saat habis memberi pesan, bukan diam |
| Persediaan lintas ronde | tidak diisi ulang — 520 hanya jalan sekali, 1799 melompatinya | — | **Dipertahankan.** Ronde dua dimulai dengan sisa ronde satu |
| Satu tembakan, satu musuh | `GOTO 1160` keluar dari gelung sesudah kena | — | **Dipertahankan.** Dua musuh sebaris berarti yang kedua selamat; sekarang terlihat karena sinarnya berkilat dan hanya satu yang meledak |
| Benih | `MID$(TIME$,3,2)` mengambil titik dua (§4) | — | **Cacatnya dipertahankan.** Benih yang terpakai ditampilkan di papan angka |
| Dua `POKE` (§5) | menyalakan CapsLock lalu menghapusnya | — | Tidak diport — peramban tidak punya padanan. **Dicatat**, karena itu temuannya |
| Panjang ronde | `IF L=150 THEN 1580` | — | **Dipertahankan**: 149 bingkai |
| Ronde berikutnya | `IF SC>500 THEN … GOTO 540` | — | **Dipertahankan**, dan bom/laser **tidak** diisi ulang — sama seperti aslinya |
| Mati dengan skor tinggi | `IF SC>800 THEN … "GOOD JOB!!"` | — | **Dipertahankan.** Aslinya memang menganggap kematian bernilai tinggi sebagai keberhasilan |
| Keluar | `LOAD "MENU",R` | tiap program berkas terpisah | Tautan kembali di bilah atas |

Yang menyimpang: panah dan tombol layar sebagai tambahan kendali, dan lapisan
rupa. Keduanya dinyatakan.

---

## 8 · Latihan

1. **Geser satu aksara.** Ubah satu `_` di `A$` jadi kode 219. Berapa baris kode
   yang harus ditambahkan supaya ia bisa dibom dan menghasilkan poin? Kenapa
   jawabannya nol?

2. **Perbaiki benihnya.** Ganti `MID$(TIME$,3,2)` jadi `MID$(TIME$,4,2)`. Berapa
   benih yang tersedia sekarang, dan kenapa jawabannya bukan 86.400 kali lipat
   dari sebelumnya?

3. **Hitung nilai maksimum satu ronde.** Ada 6 sel pabrik dan 30 sel bangunan.
   Dengan 35 bom, 60 laser, dan 149 bingkai, berapa batas atas skornya? Sebutkan
   asumsi yang Anda pakai.

4. **Cari yang tak pernah terlihat.** Dua aksara terakhir `A$` tidak pernah
   masuk jendela. Aksara apa keduanya, dan apa dugaan Anda tentang kenapa
   penulisnya menaruhnya di sana?

---

Berkas terkait: [pakai](../games/attack/index.html) ·
[SERPENT — sehari sebelumnya, kerangka yang sama](serpent.md) ·
[METEOR](meteor.md) · [FLYS](flys.md) · [BREAKOUT](breakout.md)
