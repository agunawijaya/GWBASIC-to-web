# ABM 2 — Missile Command yang membela pabrik IBM

> `run/ABM2A.BAS` · Ed Davis, versi 18 Juli 1982 · 231 baris
> · [pakai portnya](../games/abm2a/index.html) ·
> [analisis BASIC aslinya](../../reviews/ABM2A.md)

---

## 1 · Enam kota yang dibela itu enam pabrik IBM

```basic
1070 PRINT "Your mission is to defend the IBM"
1080 PRINT "East coast sites from the enemy."
 870 T%(1,I)=48*(I+1)
 980 …PRINT"BTV";…"FSH";…"HPN";…"MAN";…"RAL";…"BOC";
```

Enam label itu bukan kota sembarangan. Itu **situs IBM di pantai timur
Amerika**, berurutan dari utara ke selatan, dan koordinatnya rata 48 piksel:

| x | Kode | Situs |
|--:|---|---|
| 48 | `BTV` | Burlington / Essex Junction, Vermont |
| 96 | `FSH` | East Fishkill, New York |
| 144 | `HPN` | White Plains (Westchester), New York |
| 192 | `MAN` | Manassas, Virginia |
| 240 | `RAL` | Raleigh / Research Triangle Park, North Carolina |
| 288 | **`BOC`** | **Boca Raton, Florida** — tempat IBM PC dirancang |

Jadi ini *Missile Command* yang membela pabrik IBM sendiri, ditulis di disket
IBM, dan **sasaran paling kanan adalah tempat komputer yang menjalankannya
dilahirkan**.

Dua sisi mata uang yang sama di koleksi ini: [ATTACK](attack.md) mengebom pabrik
Apple, ABM 2 membela pabrik IBM. Dan satu tautan lagi — penulis `BATSHIP.BAS`
di koleksi ini beralamat di **Essex Junction, Vermont**, yaitu situs `BTV`,
sasaran paling kiri.

---

## 2 · Satu angka mengendalikan dua hal

```basic
230 IF ABS(M(2,I)-DX)<WH%+1 AND ABS(M(3,I)-DY)<WH% THEN …
250 …SC=SC+(10-WH%)
```

`WH%` (3–9) menentukan **ukuran kotak bunuh** sekaligus **nilai tiap kena**:

| WH% | Skor | Kotak bunuh | Luas |
|--:|--:|---|--:|
| 3 | 7 | 7 × 5 | 35 |
| 4 | 6 | 9 × 7 | 63 |
| 5 | 5 | 11 × 9 | 99 |
| 9 | 1 | 19 × 17 | **323** |

Dari 3 ke 9: luasnya **9,2 kali lipat**, imbalannya **sepertujuh**. Satu
variabel, satu garis tukar-menukar, tanpa satu pun tabel kesulitan.

---

## 3 · "3 = SMALL (EXPERT)" bukan sulit — sebagian besarnya mustahil

```basic
1640 SY=SY-10   1660 SY=SY+10      ' bidikan bergerak SEPULUH piksel
1680 X=X+10     1700 X=X-10
```

Bidikan hanya bisa berada di **kisi 10 piksel**. Tapi rudal musuh bergerak
**pecahan piksel** mendatar — `M(4,I)=(T%(1,II)-M(5,I))/160` — dan satu piksel
menurun. Jadi rudal bisa berhenti di antara dua titik yang bisa dijangkau
bidikan.

Kalau kotak bunuhnya lebih sempit daripada kisinya, ada **posisi yang tidak
bisa dikenai sama sekali**. Dihitung dengan mencuplik seluruh layar per 0,1
piksel terhadap seluruh titik bidik yang mungkin:

| WH% | Kotak | x mustahil | y mustahil | Gabungan |
|---|---|--:|--:|--:|
| **3** — SMALL (EXPERT) | 7×5 | 21,0% | 41,0% | **53,4%** |
| 4 — NORMAL (GOOD) | 9×7 | 1,0% | 21,0% | 21,8% |
| 5 — BIG (BEGINNER) | 11×9 | 0,0% | 1,0% | 1,0% |
| 9 — WOW! (CHICKEN) | 19×17 | 0,0% | 0,0% | **0,0%** |

Dengan hulu ledak terkecil, **lebih dari separuh layar tidak bisa dikenai** —
bukan sulit, *mustahil*. Dan **5 = BIG (BEGINNER)** ternyata hulu ledak terkecil
yang selalu bisa menjangkau sasaran mana pun.

Diverifikasi di port: dengan bidikan diarahkan sedekat mungkin ke satu rudal,
`WH%=9` mengenai (+1) dan `WH%=3` **meleset** pada rudal yang sama.

> **Pelajaran.** Label "EXPERT" dan skor tertinggi menjanjikan tantangan yang
> bisa dikuasai. Yang sebenarnya ditawarkan **lotre**: rudal yang kebetulan
> lewat di titik kisi mati tidak akan pernah tertembak, dan pemainnya tidak
> punya cara membedakannya dari salah bidik.
>
> Akarnya satu ketidakcocokan yang tidak pernah dinyatakan di mana pun:
> **resolusi kendali** (10 piksel) lebih kasar daripada **resolusi aturan**
> (7 piksel). Kedua angka itu benar sendiri-sendiri; yang salah cuma bahwa
> tidak ada yang membandingkannya.

Dipertahankan apa adanya di port, termasuk langkah 10 piksel. Mengecilkan
langkahnya akan menghapus cacatnya — dan cacat inilah yang membuat pilihan hulu
ledaknya jadi cerita.

---

## 4 · Handicap melewati bingkai, bukan mengubah kecepatan

```basic
 260 IF CT%<RS% THEN CT%=CT%+1:GOTO 70
1470 RS%=RS%-1:IF RS%<0 THEN RS%=0
```

`RS%` bukan pengali kecepatan — ia mencacah berapa bingkai **masukan** yang
lewat sebelum rudal musuh maju satu langkah. Anda tetap bisa menggeser bidikan
selama bingkai-bingkai itu, jadi handicap tinggi memberi *lebih banyak
kesempatan membidik*, bukan musuh yang lebih lambat secara fisik.

| RS% | Musuh maju |
|---|---|
| 0 — MISSION-IMPOSSIBLE | tiap **1** bingkai |
| 3 — NORMAL | tiap **4** bingkai |
| 5 — JUNIOR | tiap **6** bingkai |

Dan baris 1470 **menguranginya satu tiap kali Anda menang**. Tidak ada layar
"level 2"; cuma satu variabel yang terus mengecil sampai nol.

---

## 5 · Satu tanda persen yang hilang

```basic
400 FLAG=-1:N=0:PT%=M(1,MIRV%):TT%=PT%+1
440 IF N<4 THEN FLAG%=-1:GOTO 410
```

Baris 400 menyetel `FLAG` — **tanpa tanda persen**. Di BASIC itu variabel yang
berbeda dari `FLAG%`, dan ia tidak pernah dibaca di mana pun.

Yang menyelamatkan programnya cuma kebetulan: baris 440 menyetel `FLAG%` yang
benar selama `N<4`, jadi sesudah gelung MIRV selesai nilainya *sudah* −1 dan
baris 340 tidak mengulangi MIRV-nya. Satu aksara yang salah, ditutup oleh baris
lain yang kebetulan berada di jalur yang sama.

---

## 6 · `DRAW` dipakai sebagai bahasa bersubrutin

```basic
920 CT$ ="U2R4U18R7D8R3D3R3U9R3D7R5D4R3D5R5D2"
950 PSET(0,180):DRAW "R32;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)
960 DRAW "R16;X"+VARPTR$(CT3$)+"…X"+VARPTR$(CT$)+"…"
```

Perintah `X` di dalam makro `DRAW` **menjalankan string lain**, dan `VARPTR$`
memberi alamatnya. Jadi cakrawala kotanya disusun dari **tiga cetakan gedung**
yang dipanggil berulang.

[FLYS](flys.md) memakai `DRAW` untuk *membuat* sprite; ABM 2 memakai
kemampuannya *memanggil*. Pemakaian ulang di dalam bahasa makro, di sebuah
program 1982 — dan cakrawala di port ini disusun dengan pola yang sama: tiga
cetakan, dipakai bergantian.

---

## 7 · Dua cara membuang penyangga papan ketik

```basic
1210 DEF SEG=0:POKE 1050,PEEK(1052)   ' ABM2A
  40 POKE 106,0                       ' idiom GW-BASIC di program lain
```

Alamat 1050 dan 1052 adalah `0040:001A` dan `0040:001C` — penunjuk **kepala**
dan **ekor** penyangga papan ketik BIOS. Menyamakan keduanya mengosongkan
penyangga itu.

Program lain di koleksi memakai `POKE 106,0`, yang menulis ke ruang kerja
*penafsir GW-BASIC*, bukan ke BIOS. Dua idiom, dua lapisan sistem, satu maksud
yang sama — dan keduanya jadi satu baris di port: `input.flush()`.

---

## 8 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Enam sasaran | situs IBM di `48*(I+1)` (§1) | — | **Dipertahankan persis**, berikut kode dan koordinatnya; nama lengkap situsnya ditambahkan di panel |
| Hulu ledak | `WH%` mengendalikan kotak bunuh dan skor (§2) | satu variabel lebih murah daripada tabel | **Dipertahankan persis** |
| Kisi bidikan 10 piksel | 1640–1710 (§3) | — | **Dipertahankan**, termasuk akibatnya bahwa `WH%=3` sebagian mustahil. Mengecilkan langkahnya akan menghapus temuannya |
| Handicap | melewati bingkai (§4) | tidak ada pewaktu | **Dipertahankan**, dan berkurang tiap menang |
| Ledakan ABM | tumbuh `RR` 2..11 lalu menghitung kena **sekali** di akhir | — | **Dipertahankan persis.** Yang menentukan bukan kapan Anda menekan, melainkan di mana rudal berada saat ledakannya selesai |
| MIRV | sekali per ronde, 4 anak dari `M(12..15)` | `DIM M(6,15)` | **Dipertahankan**, termasuk batas satu kali |
| `FLAG` vs `FLAG%` | salah ketik yang tidak berakibat (§5) | — | **Tidak diport** — dicatat, karena ia lolos hanya karena kebetulan |
| Papan angka | `LOCATE` di layar | — | **Digambar di dalam layar**, baris 1 |
| Meriam ABM | **tidak digambar sama sekali** — baris 150 cuma menarik garis dari (168,160) | layar grafis 320×200 sudah penuh | **Digambar sendiri**: bunker berpita peringatan, kubah turret, laras yang **mengikuti bidikan**, dan piringan radar. Titik asal `x=168` diambil dari baris 150 dan tidak digeser. Lihat §8b |
| Lebar cakrawala | `DRAW` mengalir bebas dari `PSET(0,180)` | — | Dibatasi **±12** supaya tidak bertumpuk dengan meriam — dihitung, bukan selera; lihat §8b |
| Kecepatan | satu putaran gelung penafsir | tidak ada pewaktu | Penggeser bingkai/detik, bawaan 30 |
| Kendali | panah + `Esc` | `INKEY$` dua aksara | **Dipertahankan**, `Spasi` ditambahkan sebagai padanan `Esc`, plus tombol layar |
| Penyangga papan ketik | `POKE 1050,PEEK(1052)` (§7) | — | `input.flush()`. **Dicatat**, karena idiomnya berbeda dari program lain di koleksi |
| Sakelar mono/warna | `POKE &H410` (1850–2000) | dua jenis kartu video | Tidak diport — peramban tidak punya padanannya. Dicatat |
| Logo "DAVIS DISK" | 60 baris `LINE`+`PAINT`, gelung 4× | — | Tidak diport |
| Keluar | `LOAD "MENU",R` | tiap program berkas terpisah | Tautan kembali di bilah atas |

### 8b · Meriam yang tidak pernah digambar aslinya

Aslinya **tidak ada satu piksel pun** peluncur di layar. Baris 150 cuma menarik
garis:

```basic
150 DX=LX+10:DY=LY+10:LINE (168,160)-(DX,DY),3:ABM%=1:RR=1
```

Garis itu muncul dari titik kosong. Jadi bentuk meriamnya **seluruhnya
tambahan** — tapi satu hal bukan: **`x=168`**, dan itu tidak digeser sedikit
pun.

Pemilik koleksi melaporkan dua hal: gambarnya kurang bagus, dan ia
**bertumpuk** dengan gedung. Yang kedua bisa dihitung, dan hitungannya
menjelaskan kenapa itu terjadi:

> 168 adalah **titik tengah persis** antara HPN (144) dan MAN (192).

Jadi peluncurnya memang berdiri tepat di antara dua kota — dan cakrawala versi
pertama saya selebar ±19, sehingga HPN membentang sampai 160 dan MAN mulai di
173, sementara peluncurnya 160–176. Bertumpuk di kedua sisi.

Perbaikannya diukur, bukan dikira:

| | Versi pertama | Sekarang |
|---|--:|--:|
| Setengah lebar cakrawala | 19 | **12** |
| Dasar meriam | 160–176 | **157–179** |
| Sela ke HPN | −1 *(bertumpuk)* | **2,0** |
| Sela ke MAN | −4 *(bertumpuk)* | **1,0** |
| Cakrawala yang bertumpuk | 2 | **0** |

Piringan radarnya sempat menjorok 0,4 satuan ke atap MAN; tiangnya ditarik dari
`PX+9` ke `PX+7` dan jari-jarinya dari 3,4 ke 3.

**Larasnya mengikuti bidikan**, dan itu bukan sekadar hiasan: ia memperlihatkan
lintasan yang memang akan ditempuh baris 150, *sebelum* tombolnya ditekan.
Diverifikasi: menekan `←` enam kali memutar laras dari −42,2° ke −61,5°, lalu
`→` dua belas kali ke +1,8°.

Satu penyimpangan rupa yang perlu disebut: garis ABM sekarang ditarik dari
**ujung laras**, bukan dari `(168,160)` tetap, supaya sambung dengan meriamnya.
Itu murni rupa — yang menentukan aturan cuma `DX,DY`, dan keduanya tidak
disentuh.

---

## 9 · Latihan

1. **Perkecil langkah bidikan.** Ubah 10 jadi 2 di baris 1640–1710. Berapa
   persen posisi yang jadi bisa dikenai dengan `WH%=3`? Dan apa yang hilang
   dari permainannya?

2. **Cari titik mati.** Untuk `WH%=3`, tunjukkan satu koordinat x yang tidak
   bisa dikenai bidikan mana pun. Tunjukkan hitungannya, bukan hasil coba-coba.

3. **Hitung nilai satu ronde sempurna.** Dua belas rudal plus empat anak MIRV.
   Berapa skor maksimum dengan `WH%=3`, dan berapa dengan `WH%=9`? Lalu:
   dengan angka §3 di tangan, mana yang sebenarnya lebih menguntungkan?

4. **Kembalikan `FLAG`.** Andaikan baris 440 tidak ada. Apa yang terjadi pada
   MIRV-nya, dan kenapa cacat baris 400 baru terlihat di situ?

---

Berkas terkait: [pakai](../games/abm2a/index.html) ·
[ATTACK](attack.md) — sisi sebaliknya · [FLYS](flys.md) — `DRAW` untuk sprite ·
[ZAP'EM](zapem.md)
