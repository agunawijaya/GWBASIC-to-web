# INTRO — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/INTRO.BAS` — *"Introduction To Computers"* |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | **23 baris, satu layar, nol halaman** |
| Hasil port | [`../games/intro/`](../games/intro/index.html) |
| Analisis BASIC | [`../../reviews/INTRO.md`](../../reviews/INTRO.md) |

Program terpendek yang diport sejauh ini, dan yang paling banyak mengoreksi
asumsi.

---

## 1 · Ia tidak mengajarkan apa pun

Judulnya berbunyi *"Introduction To Computers"*, tapi seluruh isi programnya
adalah ini:

```basic
160 RESP$=INKEY$:IF RESP$="" THEN 160
170 IF RESP$="1" THEN RUN"HISTORY"
180 IF RESP$="2" THEN RUN"anatomy"
185 IF RESP$="3" THEN RUN"HINTS
190 GOTO 160
```

Sebuah **perute**. Ia menggambar satu layar, menunggu tombol, lalu mengganti
dirinya sendiri dengan program lain.

| Tombol | Baris | Tujuan | Nasibnya di koleksi ini |
|---|--:|---|---|
| `1` | 170 | `HISTORY` | diport — [16 layar pelajaran](history.md) |
| `2` | 180 | `anatomy` | diport — [9 layar listing MASTER MIND](anatomy.md) |
| `3` | 185 | `HINTS` | 132 baris; `PLAN.md` meleburnya ke shell |

Perhatikan ejaan di baris 180: `RUN"anatomy"` huruf kecil, dua yang lain huruf
besar. DOS tidak peduli; yang peduli cuma pembaca berikutnya, dan tidak ada
yang merapikannya.

---

## 2 · Ia membantah alasan lahirnya `reader.js`

Saat `_shared/reader.js` dibuat di sesi 14, alasannya ditulis begini:

> *"tujuh program berikutnya — HISTORY, INTRO, HEAREYE, BIO, READING, CHECK,
> BUSONE — semuanya berbentuk yang sama, yaitu urutan layar yang dibalik
> maju-mundur oleh pemakai."*

INTRO membantahnya paling telak. Tidak ada halaman, tidak ada `BACKFLAG`,
tidak ada `ON KEY(1)`. Dari empat program yang sudah dibaca, klaim itu hanya
benar untuk **satu**:

| | Bentuk sebenarnya |
|---|---|
| HISTORY | 16 halaman tetap — memang pembaca berhalaman ([tapi mundurnya tidak seragam](history.md)) |
| **INTRO** | **satu layar menu, nol halaman** |
| HEAREYE | dua alur maju-saja; `ON KEY(1)`..`(9)` menunjuk ke `RETURN` kosong — tombol mundurnya sengaja **dimatikan** |
| BIO | kalkulator; jumlah "halaman" tidak diketahui di muka |

Jadi port ini **tidak memakai `reader.js`**. Memaksakannya berarti menambahkan
tombol maju/mundur ke sesuatu yang tidak punya urutan — antarmuka yang
berbohong tentang bentuk programnya.

Klaim yang salah itu **dicoret, bukan dihapus**, di kepala `reader.js`.

> **Pelajaran.** Sebuah modul bersama yang dibuat dari *rencana* tentang apa
> yang akan datang, bukan dari *bacaan* atas apa yang benar-benar ada, akan
> membawa asumsinya ke dalam setiap pemakainya. `cards.js` dan `dice.js` lahir
> setelah dua program terbukti membutuhkannya; `reader.js` lahir setelah satu,
> dengan enam yang dijanjikan. Selisih itulah yang jadi salah.

---

## 3 · Yang benar-benar dipakai bersama jauh lebih kecil

Baris 10–90 INTRO hampir sama dengan `HEAREYE.BAS`: layar bersih,
`DEF SEG:POKE 106,0`, jebakan <kbd>F10</kbd>, kotak `┌──┐`, dan pita
`F R I E N D L Y W A R E`.

| Baris 10–90 | |
|---|--:|
| Baris kerangka | ~20 |
| **Identik byte demi byte** | **13** |
| Berbeda | baris 41 (`ON ERROR`), baris 50, dan isi menunya |

Berkas tinjauan otomatis menyebut rentang itu *"identik"*. Setelah dibandingkan
satu per satu: **13 dari sekitar 20**. Sudah dikoreksi di sana.

Yang terbukti dipakai bersama di keempat program edukasi ini bukan mesin
halaman, melainkan hal-hal jauh lebih kecil:

| Yang dibagi | Berapa kali |
|---|--:|
| `DEF SEG:POKE 106,0` (kosongkan penyangga tombol) | 4× persis |
| Idiom bingkai `STRING$(80,219)` | 3× persis |
| Blok konfirmasi keluar <kbd>F10</kbd> | 2× hampir persis |

Penyebabnya sama dengan [SPACE dan PIECHART](space.md): BASIC tidak punya cara
berbagi kode antarprogram, jadi kerangka yang sama diketik ulang di tiap
berkas — lalu pelan-pelan menyimpang.

---

## 4 · `RUN` sebagai satu-satunya cara berpindah

`RUN "nama"` memuat program lain dan **membuang seluruh variabel yang ada**.
Itu bukan pilihan penulisnya — itu satu-satunya mekanisme yang tersedia.

Akibatnya terlihat di seluruh koleksi: tiap program Friendlyware harus
menggambar ulang kerangkanya sendiri dari nol, karena tidak ada apa pun yang
bertahan melewati perpindahan. Itu pula sebabnya kerangka 13 baris itu ada di
dua berkas sekaligus (§3) — bukan kemalasan, melainkan syarat.

Di port, ia jadi tautan biasa, dan tidak ada yang hilang.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Layar menu | `LOCATE`+`PRINT` (§1) | CGA teks 80×25 | Kisi 80×25, warna per sel, **dijalankan** dari sumbernya — penafsir yang sama dengan [HISTORY](history.md) |
| Pilihan `1`/`2`/`3` | `INKEY$` + `RUN` | tidak ada cara lain | Tombol yang **sama**, ditambah kartu yang bisa diklik |
| Tujuan yang tidak diport | `RUN "HINTS"` | — | Kartunya `<div>`, bukan `<a>`, dan tampak berbeda **sebelum** diklik |
| <kbd>F10</kbd> keluar | `RUN "menu"` **tanpa konfirmasi** | — | Tautan kembali di bilah atas. Perhatikan: HISTORY dan BIO bertanya Y/N dulu; INTRO tidak. Tidak diseragamkan, karena perbedaannya adalah datanya |
| `reader.js` | — | — | **Tidak dipakai** (§2) |
| Layar 80×25 & panel | — | — | Menumpang `history.css`, bukan disalin — supaya keduanya berubah bersama-sama |

---

## 6 · Latihan

1. **Hitung kerangkanya sendiri.** Bandingkan baris 10–90 `INTRO.BAS` dan
   `HEAREYE.BAS` baris demi baris. Berapa yang identik menurut hitungan Anda,
   dan bagaimana Anda memperlakukan baris yang cuma beda spasi?

2. **Cari yang bertanya dan yang tidak.** Dari empat program edukasi ini,
   mana yang meminta konfirmasi sebelum keluar? Apa yang membuat perbedaannya
   masuk akal — atau tidak?

3. **Uji premisnya.** Baca `READING`, `CHECK`, dan `BUSONE`. Berapa dari
   ketiganya yang benar-benar berbentuk pembaca berhalaman? Perbarui hitungan
   di §2.

---

Berkas terkait: [pakai](../games/intro/index.html) ·
[HISTORY — tombol 1](history.md) · [ANATOMY — tombol 2](anatomy.md)
