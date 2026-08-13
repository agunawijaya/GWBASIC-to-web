# CHECK — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/CHECK.BAS` — *"Check Register"* |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | 65 baris |
| Hasil port | [`../games/check/`](../games/check/index.html) |
| Analisis BASIC | [`../../reviews/CHECK.md`](../../reviews/CHECK.md) |

---

## 1 · Ini bukan program buku cek

Enam puluh lima barisnya adalah **peluncur**: dua layar penjelasan, satu
tanya-jawab kesiapan disket, lalu

```basic
510 RUN"menu
520 CLS
        ← dua ratus nomor baris kosong
720 GOSUB 740:CLOSE:CHAIN"info.sys",4250
```

| Yang disambung | Ada di koleksi? |
|---|---|
| `CHAIN "info.sys", 4250` | **tidak** |
| Selang nomor baris 520 → 720 | 200 |

Program buku ceknya bukan berkas ini. Berkas ini memastikan disketnya benar,
lalu menyerahkan kendali — dan berkas yang menerimanya tidak ikut terkumpul.

Ini kali **ketiga** dalam koleksi ini separuh sebuah program hilang:

| Program | Yang hilang |
|---|---|
| [ANATOMY](anatomy.md) | manual cetak halaman 11–15 |
| [BIO](bio.md) | manual halaman 31 |
| **CHECK** | **seluruh badan programnya** |

> **Pelajaran.** Sebuah program yang isinya cuma "siapkan lalu serahkan" tidak
> terlihat berbeda dari program lengkap sampai Anda mencari yang menerimanya.
> Enam puluh lima baris yang berjalan mulus dan tidak mengerjakan apa pun yang
> dijanjikan judulnya — dan katalog kita menyebutnya *"Buku Cek"* selama lima
> belas sesi.

---

## 2 · Sebuah program yang menuntut disket fisik

Kata *diskette* muncul **13 kali** dalam 65 baris. Layar pertama bukan
penjelasan fitur — ia daftar syarat perangkat keras:

- satu disket data untuk **tiap rekening**
- satu disket *MASTER* untuk setiap sepuluh rekening
- disket master wajib berisi `BASICA.COM`
- label disketnya ditentukan kata demi kata:
  `DATA DISKETTE #__, ACCOUNT #_______, 19__`

Perhatikan `19__` pada labelnya. Tahun 19-sesuatu, dicetak sebagai bagian
tetap dari petunjuk — sepupu [BIO](bio.md) baris 470, dan sama-sama tidak
pernah dianggap sebagai asumsi.

Layar itu juga merujuk *"your FriendlyWare manual, pages I and II"* — manual
yang, seperti dua program lain di koleksi ini, tidak ada.

---

## 3 · Galat sebagai cara bertanya "disket mana yang masuk?"

```basic
730 ERX=0:CLOSE:OPEN "I",1,"MENU.BAS":IF ERX=0 THEN ERROR 200
740 CLOSE:OPEN "I",1,"MENU.BAS":RETURN
750 ERX=1
754 IF ERR=70 OR ERR=72 OR ERR=71 THEN MG$="         Disk Not Ready"
755 IF ERR=200 THEN MG$="Insert `CHECK REGISTER' Diskette"
770 IF ERL=740 THEN MG$="Insert FriendlyWare Diskette #3"
```

Tidak ada cara bertanya *"disket apa yang sedang masuk?"*. Yang ada cuma:
**coba buka sebuah berkas, dan lihat apa yang terjadi.**

Baris 730 mencoba membuka `MENU.BAS`. Kalau **berhasil** (`ERX` masih 0),
berarti yang masuk adalah disket FriendlyWare — bukan yang dibutuhkan. Maka
program **membangkitkan galat 200 sendiri** untuk meminta disket yang benar.

| Kode | Artinya |
|---|---|
| `ERR=70` | permission denied / disk write-protect |
| `ERR=71` | disk not ready |
| `ERR=72` | disk media error |
| `ERR=200` | **bukan kode GW-BASIC** — nomor pesan buatan sendiri |

Dan penangannya memilih pesan dari **dua sumbu sekaligus**: `ERR` (galat apa)
dan `ERL` (baris mana yang gagal). Baris 770 memakai `ERL=740` untuk
menyimpulkan sesuatu yang tidak bisa disimpulkan dari kode galatnya.

> **Pelajaran.** Yang membuatnya rapi: satu penangan melayani galat perangkat
> keras *dan* pesan buatan sendiri lewat jalur yang sama. Yang membuatnya
> sulit dibaca: `IF ERX=0 THEN ERROR 200` terbaca **terbalik** dari maksudnya
> — "kalau berhasil, mengeluh" — dan tidak ada satu komentar pun yang
> menolong.

---

## 4 · Layar ketiga menimpa layar kedua

Baris 440–460 tidak memanggil `CLS`. Ia menulis di baris 17, 18, dan 20 di
atas layar kesiapan yang sudah ada.

Diverifikasi di port: layar ketiga adalah **superset ketat** dari layar kedua
— ketujuh baris layar 2 semuanya masih ada, ditambah tiga baris baru.

Sama seperti [HISTORY](history.md) halaman 2, 3, dan 10 — dan karena itu
ketiga layar di sini juga **dijalankan**, bukan disalin.

---

## 5 · Sembilan jebakan kosong, untuk keempat kalinya

```basic
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
 …
70 RETURN
```

Idiom yang sama persis dengan [HEAREYE](heareye.md) baris 1080–1180 dan
[BIO](bio.md) baris 30–120: sembilan tombol fungsi dijebak ke penangan kosong,
untuk mematikan makro bawaan GW-BASIC agar tidak menumpahkan `LIST` ke dalam
`INKEY$`.

Di sini bahkan lebih padat — **satu baris memasang kesembilannya**. Dan
seperti di dua program lain, baris 70 melayani dua peran: penangan *dan* ekor
rutin tunggu tombol di 40–60.

Empat program Friendlyware, satu kebiasaan rumah yang sama, nol komentar di
keempatnya.

> **Pelajaran.** Sebuah idiom yang muncul empat kali tanpa penjelasan adalah
> pengetahuan yang hidup di kepala tim, bukan di berkasnya. Ia bertahan
> selama timnya bertahan — dan jadi teka-teki begitu platformnya hilang.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Tiga layar | `LOCATE`+`PRINT` | CGA teks 80×25 | Kisi 80×25, warna per sel, **dijalankan** dari sumbernya |
| Layar ketiga | menimpa yang kedua (§4) | menggambar bingkai mahal | **Dipertahankan** — hasilnya sama persis karena programnya dijalankan |
| Badan program | `CHAIN "info.sys"` (§1) | berkas terpisah | **Tidak bisa diport.** Ketiadaannya dihitung dan ditampilkan, bukan disamarkan |
| Syarat disket | 13× kata *diskette* (§2) | penyimpanan floppy | **Dipertahankan sebagai teks**; tidak ada yang bisa disiapkan |
| Deteksi disket | `ERROR 200` buatan sendiri (§3) | tidak ada API media | **Tidak diport** — dijelaskan sebagai temuan, dengan tabel kodenya |
| 9 `ON KEY` kosong | mematikan makro F1–F9 (§5) | GW-BASIC | **Tidak diport**; dijelaskan |
| Navigasi | maju satu arah, tanpa mundur | — | Pembaca tiga halaman dengan mundur dan rel — **tambahan**, konsisten dengan keputusan sesi 15 untuk HEAREYE |
| Keluar | `RUN "menu"` | tiap program berkas terpisah | Tautan kembali di bilah atas |

---

## 7 · Latihan

1. **Cari yang menerimanya.** `CHAIN "info.sys",4250` melompat ke baris 4250.
   Apa yang bisa Anda simpulkan tentang ukuran `info.sys` dari angka itu saja?

2. **Baca ulang baris 730.** Tulis ulang syaratnya sehingga maksudnya terbaca
   langsung. Berapa baris yang Anda butuhkan, dan apa yang hilang?

3. **Hitung disketnya.** Untuk 25 rekening, berapa disket yang dibutuhkan
   menurut layar pertama? Berapa kapasitas total datanya pada floppy 360 KB?

4. **Bandingkan tiga kehilangan.** ANATOMY kehilangan manualnya, BIO satu
   halaman, CHECK seluruh badannya. Mana yang paling mungkin dipulihkan, dan
   apa yang membuatnya begitu?

---

Berkas terkait: [pakai](../games/check/index.html) ·
[HEAREYE](heareye.md) · [BIO](bio.md) — idiom `ON KEY` kosong yang sama ·
[ANATOMY](anatomy.md) — separuh program yang hilang
