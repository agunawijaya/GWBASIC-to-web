# DRAW — Shift bukan huruf besar, ia pasangan

> Port web: [`web/games/draw/`](../games/draw/index.html) ·
> Sumber: [`run/DRAW.BAS`](../../run/DRAW.BAS) (287 baris) ·
> Analisis BASIC: [`reviews/DRAW.md`](../../reviews/DRAW.md)

Bukan permainan: **penyunting gambar karakter**. Friendlyware,
`1 'update 8/30/82 11:00 am`. Kanvas 80 kolom × 19 baris, digambar dengan lima
puluh karakter CP437.

---

## 1 · Dua puluh lima tombol dengan dua sisi

```basic
2310 DATA 200,188,186,202,185,197,192,217,179,193,180,...
2320 DATA 201,187,205,203,204,206,218,191,196,194,195,...
2290 FOR A=0 TO 1:FOR B=1 TO 25:READ ARRAY%(A,B):NEXT:NEXT
 490 LOCATE X,Y:PRINT CHR$(ARRAY%(1,ASC(Z)-64));   ' A-Y
 510 LOCATE X,Y:PRINT CHR$(ARRAY%(0,ASC(Z)-96));   ' a-y
```

Dua baris `DATA`, dua puluh lima kode masing-masing, dipetakan ke `A`–`Y` dan
`a`–`y`. Kode ke-*n* di kedua baris selalu **sepasang** — dan hubungannya
berganti-ganti sesuai apa yang dibutuhkan:

| tombol | Shift | biasa | hubungannya |
|---|:--:|:--:|---|
| A B G H | ╔ ╗ ┌ ┐ | ╚ ╝ └ ┘ | sudut atas ↔ sudut bawah |
| C I | ═ ─ | ║ │ | mendatar ↔ tegak |
| D E F J K | ╦ ╠ ╬ ┬ ├ | ╩ ╣ ┼ ┴ ┤ | sambungan berlawanan arah |
| L M | █ ▓ | ▒ ░ | empat tingkat naungan di dua tombol |
| N O | ▐ ▀ | ▌ ▄ | separuh blok kanan/kiri, atas/bawah |
| P Q S | ► → ↑ | ◄ ← ↓ | panah berlawanan |
| T U | ☼ ° | ∙ · | besar ↔ kecil |
| W X Y | ♠ ♥ ☺ | ♦ ♣ ☻ | hitam ↔ merah, putih ↔ hitam |
| R | » | « | kutip berlawanan |

Jadi papan ketiknya bukan daftar lima puluh benda melainkan **dua puluh lima
tombol dengan dua sisi**, dan Shift memilih pelengkapnya. Untuk sebuah kotak
berbingkai ganda Anda cuma perlu `A B C a b c`: sudut atas, garis, sudut
bawah — tekan Shift untuk membalik potongannya.

Diperiksa dari datanya sendiri: 50 kode, dan **tidak ada satu pun yang muncul
dua kali**. Tidak ada tempat yang terbuang untuk pengulangan.

**Dan tidak ada satu baris pun** di seluruh 287 baris yang menjelaskan ini.
Layar bantuan (baris 1980–2071) hanya menerangkan tombol kursor dan perintah
warna. Paletnya memang dicetak di baris 720–780 sebagai dua deret glif dengan
huruf tombolnya di tengah — susunan itu *memperlihatkan* pasangannya, tapi
tidak pernah menyebutnya. Halaman port ini menyebutnya, dan menyusun ulang
tabelnya menurut jenis hubungannya.

---

## 2 · Sebuah .PIC adalah salinan mentah memori layar

```basic
 310 IF (PEEK(&H410) AND 48)=48 THEN SEGMENT=&HB000 ELSE SEGMENT=&HB800
1740 DEF SEG=SEGMENT
1750 BLOAD KEEP$,480
1960 BSAVE "tempory.tmp",480,3040
```

Tidak ada format berkas. Menyimpan gambar berarti menyalin **memori layar** apa
adanya; memuatnya berarti menuliskannya kembali. Kedua angkanya bisa
diturunkan:

```
offset 480  = 80 kolom × 3 baris × 2 bita   (tiga baris menu yang dilewati)
panjang 3040 = 80 kolom × 19 baris × 2 bita  (sisa layarnya)
```

Dua bita per sel karena layar teks PC menyimpan karakter *dan* atributnya
berdampingan — jadi warna ikut tersimpan di dalam gambar, tanpa kode tambahan
sebaris pun.

Baris 310 memilih segmennya dengan mengintip bita konfigurasi BIOS di
`&H410`: monokrom → `&HB000`, CGA → `&HB800`. Program 1982 yang **mendeteksi
perangkat kerasnya sendiri** alih-alih menuntut satu jenis — praktik yang baik,
dan jarang di koleksi ini. Bandingkan dengan baris 85 yang memakai
`FILES"menu.bas"` untuk mendeteksi disket program, trik yang sama seperti di
[STATS](stats.md).

---

## 3 · DRAW.EXE hilang, jadi bagian itu dibangun ulang dari perilakunya

```basic
  40 DEF SEG=&HE00
  50 BLOAD"DRAW.EXE",0
 180 BSAVE "DRAW.EXE",0,200
 400 CODE=0    : CALL CODE
2210 CODE=&H40 : CALL CODE
```

Dua ratus bita kode mesin dimuat ke `&HE00` dan dipanggil di **dua titik
masuk**. Berkasnya **tidak ada di koleksi ini** — yang tersimpan hanya
`DRAW.BAS` yang memuatnya.

Isinya tidak bisa dipulihkan. Tapi *perilakunya* bisa dibaca dari tempat ia
dipanggil:

- `CALL 0` selalu muncul tepat **sebelum** `CLS` (baris 620 dan 2340).
- `CALL &H40` muncul tepat **sesudah** `CLS`, di dalam rutin F2 yang menunya
  sendiri menyebut *"Runs Previous Picture (memory)"* (baris 850).

Jadi keduanya sepasang: **simpan-layar** dan **pulihkan-layar**, ditulis dalam
kode mesin karena menyalin 4.000 bita lewat BASIC terlalu lambat untuk terasa
seketika.

Yang dibangun ulang di port ini adalah **perilaku itu**, bukan isinya: F6
menyimpan salinan sebelum membersihkan, F2 memulihkannya. Ini satu-satunya
bagian yang tidak diturunkan dari kode yang ada, dan karena itu disebut
terpisah — di sini dan di panel halamannya.

---

## 4 · Kursor yang membungkus, bukan yang mentok

```basic
 970 IF X>22 THEN X=22
 980 IF X<4 THEN X=4
 990 IF Y>80 THEN IF X<22 THEN X=X+1:Y=Y-80:GOTO 1010 ELSE Y=80:GOTO 1010
1000 IF Y<1  THEN IF X>4  THEN X=X-1:Y=Y+80:GOTO 1010 ELSE Y=1:GOTO 1010
```

Perhatikan susunannya. Melewati kolom 80 tidak menahan kursor — ia **turun satu
baris dan kembali ke kiri**, seperti mesin tik. Melewati kolom 1 ke kiri
menaikkannya satu baris ke kolom 80. Tapi di baris terakhir (`X=22`) dan baris
pertama (`X=4`) ia berhenti.

Akibatnya menggambar sepanjang tepi mengalir sendiri tanpa pemakai menekan
Enter, dan itu satu-satunya alasan program ini enak dipakai. Dipertahankan
persis, termasuk batas barisnya — diuji: dari kolom 80 baris 4, satu panah
kanan memberi baris 5 kolom 1.

---

## 4b · Satu cacat tata letak, dan kenapa ia tidak terlihat dari kode

Bilah paletnya 25 tombol berjajar. Versi pertama memberi tiap barisnya
`overflow-x: auto` sendiri — tapi **tanpa `min-width: 0`**. Anak sebuah grid
atau flex secara bawaan tidak boleh menyusut di bawah lebar isinya, jadi baris
selebar 762 px itu memaksa seluruh kolom kiri ikut selebar itu, dan di jendela
yang lebih sempit halamannya bergeser mendatar sampai tombol di tepi kanan
keluar layar.

Yang membuatnya sulit dilihat: di jendela lebar, semuanya tampak baik-baik saja.
`overflow-x: auto` *ada* di CSS-nya, jadi membaca kodenya pun tidak menunjukkan
apa-apa yang salah. Yang menemukannya adalah pengukuran, bukan pembacaan:
menyapu setiap elemen di halaman dan membandingkan tepi kanannya dengan tepi
kanan induknya, lalu mengulanginya di tujuh lebar berbeda.

Perbaikannya dua bagian. Pertama `min-width: 0` di setiap tingkat, supaya
penyusutan diizinkan. Kedua, ketiga barisnya digulung dalam **satu** kotak
gulir — kalau masing-masing punya kotaknya sendiri, menggulir baris glif tidak
menggeser baris hurufnya, dan glif jadi tidak lagi sejajar dengan nama
tombolnya. Label `UPPER`/`LOWER` dibuat `position: sticky` supaya tetap terbaca
selagi digulir.

Tapi itu belum seluruh cacatnya. Yang tersisa lebih dalam dan ada di
stylesheet **bersama**: `.screen` di `_shared/base.css` memakai
`overflow: hidden` — perlu untuk sudut membulatnya, tapi artinya apa pun yang
melebihi lebarnya **dipotong tanpa batang gulir**. Isi yang tidak muat bukan
sekadar tersembunyi; ia tidak bisa dicapai sama sekali. Di layar yang cukup
sempit, tombol *Contoh* di ujung baris menghilang begitu saja.

Halaman ini punya dua benda yang memang selebar layar teks 80 kolom — kanvas
dan bilah palet — jadi di sini pemotongan senyap itu diganti
`overflow-x: auto`. Sumbu tegaknya ikut menjadi `auto` menurut aturan CSS, tapi
tinggi `.screen` mengikuti isinya sehingga batang gulir tegak tidak pernah
muncul; diperiksa: `overflow-y` terhitung `hidden`.

Diukur pada 1400, 1200, 1100, 980, 860, 760, 720, 640, 600, 520, dan 420 px:
sampai **760 px** semuanya muat tanpa batang gulir; di bawah itu batang gulir
mendatar muncul dan tombol *Contoh* **terjangkau setelah digulir**. Tidak ada
lebar di mana isinya hilang tanpa cara mencapainya.

> Pelajarannya lebih umum daripada halaman ini: `overflow-x: auto` pada
> pembungkus dalam tidak menolong kalau ada **induk** yang `overflow: hidden`.
> Dan `min-width: 0` tidak menolong kalau isinya memang lebih lebar dari
> layarnya — pada titik itu satu-satunya jawaban yang jujur adalah batang
> gulir, bukan pemangkasan.

---

## 5 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Kanvas = memori layar 80×25, tiga baris atas untuk menu, tiga baris bawah untuk palet | layar teks satu-satunya keluaran | Ukuran gambarnya 80×19, dan itu bukan pilihan | **Petak 80×19** dengan larik `sel[y][x]` berisi `{kode, depan, latar}` — dua bita per sel yang sama, hanya tidak lagi di RAM video |
| Palet dicetak sebagai dua deret glif dengan huruf di tengah (720–780) | — | Susunannya memperlihatkan pasangan tapi tidak menyebutnya | **Bilah palet yang bisa diklik**, susunan aslinya dipertahankan (UPPER, huruf, LOWER), plus tabel pasangan menurut jenis hubungannya di panel |
| Tombol fungsi F1–F10 lewat `ON KEY` | — | — | Tombol bernama. F1 (bantuan) jadi panel *Cara memakainya* yang selalu terbuka |
| `.pic` = `BSAVE` mentah dari `&HB800` | tidak ada format berkas | Warna ikut tersimpan gratis | Disimpan di peramban sebagai `{kode, depan, latar}`. Batas **delapan huruf** (baris 1830) dan pengubahan ke huruf besar (baris 1850) dipertahankan |
| `DRAW.EXE`, 200 bita kode mesin, dua titik masuk | BASIC terlalu lambat menyalin layar | Berkasnya hilang; perilakunya terbaca dari pemanggilnya | **Dibangun ulang sebagai perilaku**: F6 menyimpan, F2 memulihkan. Satu-satunya bagian yang tidak diturunkan dari kode yang ada |
| `COLOR F,F1` diketik sebagai `<No,No>` (1050) | — | — | Dua kotak pilih dengan nama warna CGA. Nomornya tetap ditampilkan di papan angka, karena nomor itulah yang aslinya diketik |
| Deteksi segmen lewat `PEEK(&H410)` | dua jenis kartu grafis | — | Tidak berlaku lagi, tapi dicatat di panel sebagai praktik yang baik |

---

## 6 · Latihan

1. Ketik `A`, lalu `a`. Ketik `I`, lalu `i`. Ketik `L`, `M`, `l`, `m`
   berturut-turut. Pasangannya langsung terlihat.
2. Gambar sebuah kotak berbingkai ganda memakai **hanya** enam tombol:
   `A B C a b c`. Tombol **Contoh** melakukannya untuk Anda.
3. Bawa kursor ke kolom 80 dan tekan panah kanan. Ia turun satu baris, bukan
   berhenti.
3b. Tekan **Contoh**. Judul dan bilah naungan `█ ▓ ▒ ░` keduanya dipusatkan
   terhadap lebar dalam kotaknya, dihitung dari ukuran kotak itu sendiri —
   bukan dari angka yang ditulis tangan, yang di versi pertama meleset dua
   sel keluar bingkai.
4. Tekan F5, ketik sesuatu, tekan F5 lagi. Palet grafis dan huruf biasa
   berbagi kanvas yang sama — di aslinya juga, karena keduanya cuma kode
   karakter di sel yang sama.
5. Gambar sesuatu, simpan dengan nama sembilan huruf. Hanya delapan yang
   tersimpan — batas `LEN(ZH)>7` di baris 1830.

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/DRAW.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
