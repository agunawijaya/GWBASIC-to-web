# BIO — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/BIO.BAS` — *"Personal Biorhythm"* |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | 169 baris |
| Hasil port | [`../games/bio/`](../games/bio/index.html) |
| Analisis BASIC | [`../../reviews/BIO.md`](../../reviews/BIO.md) |

Kalkulator biorhythm: teori abad ke-19 yang menyatakan manusia dikendalikan
tiga siklus tetap sejak lahir — fisik 23 hari, emosi 28, intelektual 33.

**Teorinya tidak punya dasar ilmiah.** Yang menarik di sini bukan teorinya,
melainkan bagaimana grafiknya digambar tanpa satu perintah grafis pun — dan
dua cacat yang saling menutupi selama lima puluh dua tahun.

---

## 1 · Dua cacat, dan yang satu menyembunyikan yang lain

### 1a · Cacat pertama: tahun selalu ditambah 1900

```basic
460 GOSUB 1340          ' baca m-d-y
470 YEAR=YEAR+1900
480 RETURN
```

Tanpa syarat. Jadi tahun yang bisa dicapai persis **1900–1999**. Ketik `26`
dan Anda mendapat 1926, bukan 2026 — program ini **tidak bisa menggambar hari
ini**.

Bukan kelalaian besar pada 1982; ia jadi besar belakangan. Yang menarik adalah
apa yang dijaganya tetap tersembunyi.

### 1b · Cacat kedua: urutan kali dan bagi tertukar

Rumus Julian Day di baris 490–550 adalah **Fliegel & Van Flandern**,
diterbitkan di *Communications of the ACM* 11(10):657, 1968 — algoritma yang
cukup terkenal untuk disalin, dan cukup padat untuk salah disalin.

Baris 530 salah menyalinnya:

```
BASIC : INT( INT(3*(Y+4900+W) /100) / 4 )   ← kali 3 dulu, baru bagi 100
baku  : ( 3 * ((Y+4900+L) /100) ) / 4       ← bagi 100 dulu, baru kali 3
```

Pada pembagian bulat, urutan itu **tidak** boleh ditukar. Untuk `Y=2034`:

| | perhitungan | hasil |
|---|---|--:|
| BASIC | `INT(3×6934/100)/4` = `INT(208,02)/4` | **52** |
| baku | `3×INT(6934/100)/4` = `3×69/4` | **51** |

### 1c · Dan di sinilah menariknya

Diukur atas seluruh 1900-01-01 sampai 2100-12-31 — 73.414 tanggal:

| | |
|---|--:|
| Tanggal diuji | 73.414 |
| Berbeda dari rumus baku | 69.601 |
| Gagal pulang-pergi (tanggal → JDN → tanggal) | 24.106 |
| **Kegagalan pertama** | **1 Maret 2034** |
| **Gagal di dalam 1900–1999** | **0** |

Kegagalan pertama jatuh lima puluh dua tahun setelah program ditulis — dan
**jauh di luar jangkauan yang bisa dicapai** karena baris 470.

> **Pelajaran.** Cacat Y2K menjaga cacat kalender tetap tertidur. Memperbaiki
> yang satu **membangunkan** yang lain — dan seorang yang memperbaiki "tahun
> sekarang empat digit" tanpa memeriksa aritmetikanya akan mengirim program
> yang baru rusak di tahun 2034, dengan gejala yang tidak berhubungan sama
> sekali dengan perubahannya. **Batas yang menutupi cacat adalah bagian dari
> sistemnya, bukan cuma keterbatasannya.**

Port ini memperbaiki keduanya, dan menampilkan angkanya di halaman — dihitung
hidup, bukan dikutip.

---

## 2 · Kenapa rumus yang berbeda dari baku tetap memberi jawaban benar

Rumus maju itu menyimpang dari Julian Day baku sebesar 0 sampai −3 tergantung
tahunnya. Tapi program **tidak pernah memakai nilai mutlaknya**:

```basic
300 N=JC-JB      ' hanya SELISIH-nya yang dipakai
```

Sebuah offset yang sama di kedua sisi pengurangan lenyap begitu saja.
Diperiksa untuk seluruh 1963–2000 terhadap kalender sungguhan: **nol selisih
hari yang salah**.

> **Pelajaran.** "Salah dibanding rumus baku" dan "salah untuk keperluannya"
> adalah dua pertanyaan berbeda. Yang pertama menarik; yang kedua yang
> menentukan. Melaporkan yang pertama sebagai bug tanpa memeriksa yang kedua
> akan mengirim orang memperbaiki sesuatu yang tidak rusak — dan
> memperkenalkan risiko baru.

---

## 3 · Grafik tanpa satu perintah grafis pun

Tiap baris grafik adalah **satu string** yang dibedah dengan `LEFT$`, `MID$`,
dan `RIGHT$`:

```basic
680 E=SPACE$(72)
690 E=LEFT$(E,T)+CHR$(222)+RIGHT$(E,T)      ' T=35
740 W=T*SIN(W):W=W+T+1.5
750 W=INT(W)
790 E=LEFT$(E,W-1)+C+RIGHT$(E,T+T+1-W)
```

### 3a · Satu konstanta, tiga koreksi

`W=W+T+1.5` di baris 740 menggabungkan tiga hal berbeda:

| Bagian | Kenapa |
|---|---|
| `T` | memusatkan gelombang di kolom tengah |
| `+1` | indeks string BASIC mulai dari 1, bukan 0 |
| `+0.5` | `INT` memotong ke bawah, jadi `INT(x+0.5)` adalah pembulatan ke terdekat |

Tanpa komentar. Sepupunya di koleksi ini: `+0.005000001` di
[MORTGAGE](mortgage.md), yang juga menggabungkan pembulatan dan penjaga
pecahan biner dalam satu angka.

### 3b · Penyangga yang memendek lalu dipanjangkan lagi

| Langkah | Panjang |
|---|--:|
| baris 680, `SPACE$(72)` | 72 |
| baris 690, `LEFT$(E,35)+CHR$(222)+RIGHT$(E,35)` | **71** |
| baris 350, `E=" "+E` | 72 |
| 8 kolom tanggal + 72 | **80** |

Baris 690 **memendekkan** penyangganya satu aksara — 35 + 1 + 35 = 71, bukan
72. Baris 350, tiga ratus nomor baris kemudian, mengembalikannya dengan
menyisipkan satu spasi di depan.

Dua baris yang berjauhan dan saling bergantung, tanpa satu pun menyebut yang
lain. Kalau salah satu diubah, layarnya bergeser satu kolom dan penyebabnya
ada di tempat yang tidak akan dicurigai siapa pun.

### 3c · Urutan pemanggilan yang wajib dan tidak tertulis

```basic
310 V=23:GOSUB 660
320 V=28:GOSUB 660
330 V=33:GOSUB 660
 …
670 IF V<>23 THEN 710      ' lewati pembuatan E
```

Penyangga `E` hanya dibuat ulang saat `V=23`. Dua panggilan berikutnya menulis
ke penyangga yang **sama** — itulah cara tiga kurva muat di satu baris.

Akibatnya: **23 wajib dipanggil lebih dulu.** Menukar urutan tiga baris itu
membuat baris pertama memakai sisa baris sebelumnya, dan tidak ada apa pun di
660–800 yang menyatakan syarat itu.

Baris 760 melengkapinya: kalau kolom tujuan sudah berisi `P`, `E`, atau `&`,
yang ditulis jadi `&`. Penanda tabrakan dalam satu baris `IF`, tanpa struktur
data apa pun.

> **Pelajaran.** Keadaan bersama yang dibawa antar-panggilan adalah cara
> termurah membuat tiga hal muat di satu tempat — dan cara termurah pula
> membuat urutan jadi syarat yang tak terlihat. Yang hilang bukan
> kinerjanya; yang hilang adalah kemampuan membaca satu subrutin dan tahu
> apakah ia benar.

---

## 4 · Nol yang ternyata spasi

```basic
940 Z=STR$(DAY):W=LEN(Z)-1
950 IF DAY<10 THEN Z="0"+Z:W=W+1
960 C=C+MID$(Z,2,W)+"/"
```

Maksudnya jelas: beri nol di depan untuk tanggal satu digit. Hasilnya bukan
itu.

`STR$` di BASIC selalu menyisipkan **spasi tanda** di depan angka positif,
jadi `STR$(5)` adalah `" 5"`. Menambah `"0"` menghasilkan `"0 5"`, lalu
`MID$(Z,2,2)` mengambil aksara kedua dan ketiga: `" 5"`. **Spasi, bukan nol.**

Kolomnya tetap rapi — karena yang sebenarnya dikerjakan `"0"` itu adalah
menaikkan `W` jadi 2 sehingga lebar bidangnya tetap dua aksara.

| Masukan | Keluaran | Panjang |
|---|---|--:|
| 3 Mei 1985 | `" 3/ 5/85"` | 8 |
| 25 Des 1999 | `"12/25/99"` | 8 |
| 1 Jan 1900 | `" 1/ 1/00"` | 8 |

> **Pelajaran.** Efek sampingnya yang bekerja; maksudnya tidak. Kode seperti
> ini lulus semua pengujian yang memeriksa **tata letak** dan gagal semua yang
> memeriksa **isi** — dan tidak ada yang pernah menulis pengujian jenis kedua.

Dipertahankan di port, termasuk spasinya.

---

## 5 · Hal-hal yang berulang dari program tetangganya

| Hal | Di sini | Di tempat lain |
|---|---|---|
| Penangan `ON KEY` kosong | baris 480 melayani ekor rutin masukan **dan** jebakan F2–F9 | [HEAREYE](heareye.md) baris 1180, alasan yang sama: mematikan makro tombol fungsi GW-BASIC |
| `RETURN <nomor>` | baris 1680 `RETURN 1690` | [ANATOMY](anatomy.md) baris 1570 `RETURN 1580` |
| Manual cetak yang hilang | baris 1310, *"see page 31 in your manual"* | [ANATOMY](anatomy.md) — halaman 11–15 |
| Salah ketik nama sendiri | `B I O R T H Y M` di baris 1130 dan 1180; benar di baris 180 | [ANATOMY](anatomy.md) — `CONGRAGULATIONS` |
| Variabel dideklarasikan lalu tak dipakai | `DEFINT K,L` — `K` tidak muncul lagi | |

Dua salah ketik itu **keduanya di subrutin petunjuk**, sedangkan layar utama
benar. Subrutin itu tidak pernah dibaca ulang oleh siapa pun yang menjawab
`N` pada *"Would You Like Instructions?"*.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Siklus 23/28/33 | `SIN` langsung | — | **Dipertahankan persis**, termasuk `P=3.1415926535` apa adanya |
| Grafik | bedah string 72 kolom (§3) | layar teks, tanpa grafis | **Dua tampilan.** Bawaannya grafik SVG modern; keluaran 1982 ada di balik tombol *Tampilan 1982*. Lihat §6b |
| Julian Day | rumus di 490–550 (§1b) | — | **Dipertahankan** untuk menggambar; rumus baku dipakai **hanya** untuk membandingkan, dan hasilnya ditampilkan |
| Tahun | dua digit, `+1900` (§1a) | layar sempit, kebiasaan zaman | **Empat digit.** Perubahan ini membangunkan §1b, jadi §1b diperiksa lebih dulu — bukan sesudahnya |
| Masukan tanggal | rutin ketik-digit 130 baris (1340–1670) dengan backspace dan konfirmasi | tidak ada kolom isian | `<input type="date">`. Yang hilang: pemeriksaan bulan 1–12 dan hari 1–31 yang ditulis tangan di baris 1430 dan 1530 — sekarang dikerjakan peramban |
| Nol di depan tanggal | `"0"+STR$` yang menghasilkan spasi (§4) | `STR$` menyisipkan spasi tanda | **Dipertahankan**, termasuk spasinya |
| Batas mulai < lahir | baris 280 + pesan di 600–610 | — | **Dipertahankan**, dengan kata-kata Inggris aslinya |
| 21 baris per layar | `IF L<21 THEN 300` | layar 25 baris | Dipertahankan sebagai satuan; layarnya ditumpuk, tidak diganti |
| Lanjut / tanggal baru | spasi / <kbd>F1</kbd> | `ON KEY(1)` + `RETURN 1690` | Tombol; `RETURN` tidak lokal tidak dibutuhkan lagi |
| Ringkasan persen | **tidak ada** | — | **Ditambahkan** di `.hud` — angka yang sama yang menghasilkan grafiknya, dinyatakan sebagai tambahan |
| Halaman 31 manual | rujukan tanpa isinya (§5) | — | Diganti panel yang ditulis sekarang, ditandai begitu |

### 6b · Dua tampilan untuk satu perhitungan

Keluaran 1982 memplot tiga kurva sebagai **huruf** di kisi 72 kolom: satu
aksara per hari, dan dua siklus yang berimpit jadi `&`. Itu bentuk yang
**dipaksa layar teks**, bukan bentuk yang dimaksud — teorinya bicara tentang
gelombang, dan gelombangnya tidak pernah benar-benar terlihat.

Jadi port ini menggambar yang dimaksud: tiga sinus utuh, dicuplik **empat kali
per hari** supaya lengkungnya mulus, dengan sumbu persen, garis nol
putus-putus, dan penanda hari kritis di sumbu.

| | Keluaran 1982 | Grafik port |
|---|---|---|
| Cuplikan | 1 per hari | 4 per hari |
| Resolusi tegak | 71 kolom aksara | menerus |
| Dua kurva berimpit | jadi `&` — **informasi hilang** | tetap dua garis |
| Hari kritis | garis `▐` tetap di tengah | ditandai per siklus di sumbu |

Baris ketiga itu yang menentukan. Di kisi aksara, dua siklus yang jatuh di
kolom sama **tidak bisa** ditampilkan berdampingan — satu-satunya jalan adalah
mengganti keduanya dengan satu tanda. Bentuk layar menghapus data.

Keluaran aslinya **tidak dibuang**: ia ada di balik tombol *Tampilan 1982*,
karena bedah string yang menghasilkannya (§3) adalah bahan bacaan tersendiri.
Keduanya digambar dari **satu sumber angka yang sama**, jadi mustahil
menceritakan hal yang berbeda — yang ditukar hanya cara menggambarnya.

Ini **selera**, dan dinyatakan begitu: tidak ada kendala 1982 yang
mengharuskan kurvanya berupa huruf selain layar teksnya sendiri, dan tidak ada
kendala sekarang yang mengharuskan kita mempertahankannya.

---

## 7 · Latihan

1. **Cari tanggal rusaknya.** Setelah 1 Maret 2034, tanggal mana lagi yang
   gagal pulang-pergi? Apa polanya, dan bagaimana ia berhubungan dengan
   kelipatan 100 tahun?

2. **Perbaiki baris 530 saja.** Kalau baris 470 dibiarkan apa adanya dan baris
   530 diperbaiki, apa yang berubah bagi pemakai 1982? Kenapa perbaikan itu
   tidak akan pernah terlihat?

3. **Balik urutannya.** Panggil `V=28` sebelum `V=23` di kepala Anda. Baris
   pertama grafiknya jadi seperti apa, dan berapa lama sampai ada yang sadar?

4. **Hitung tabrakannya.** Untuk tanggal lahir Anda sendiri, berapa hari dalam
   setahun yang menampilkan `&`? Bandingkan dengan tebakan dari perkalian
   peluang — dan jelaskan selisihnya.

---

Berkas terkait: [pakai](../games/bio/index.html) ·
[HEAREYE — idiom `ON KEY` kosong yang sama](heareye.md) ·
[ANATOMY — manual yang hilang, `RETURN` tidak lokal](anatomy.md) ·
[MORTGAGE — konstanta pembulatan tanpa komentar](mortgage.md)
