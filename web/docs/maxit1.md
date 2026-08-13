# MAXIT — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/MAXIT1.BAS` — versi PET, diadaptasi oleh **Patrick Leabo**, Tucson Arizona |
| Tahun | 20 Maret 1982 |
| Ukuran asli | 145 baris |
| Hasil port | [`../games/maxit1/`](../games/maxit1/index.html) |
| Analisis BASIC | [`../../reviews/MAXIT1.md`](../../reviews/MAXIT1.md) |

Papan 8×8 berisi 64 angka dan sebuah penanda. Anda mengambil angka dari
**baris** penanda; lawan dari **kolom**-nya. Penanda pindah ke sel yang diambil
— jadi tiap langkah Anda menentukan pilihan apa yang tersedia untuk lawan.

Aturannya muat satu paragraf. Yang layak dibaca ada di cara menulisnya.

---

## 1 · Angka 600 yang mendarat tepat di nol

```basic
1640 FL=600:FOR J=0 TO 7:FL=FL+BD(C1,J):NEXT
1650 IF FL=0 THEN RETURN
```

Sel kosong bernilai `−100`, penanda bernilai `100`. Kalau sebuah baris hanya
berisi penanda dan tujuh sel kosong:

```
100 + 7 × (−100) = −600
FL = 600 + (−600) = 0
```

Angka **600 dipilih supaya penjumlahannya mendarat tepat di nol** ketika tidak
ada langkah tersisa.

Satu perulangan penjumlahan menggantikan perulangan pencarian, dan hasilnya
sekaligus menjadi benderanya. Di 4,77 MHz itu setengah pekerjaan yang hemat.

Tapi perhatikan apa yang dituntutnya agar benar:

| Harus benar | Kalau berubah |
|---|---|
| Sel kosong = −100 | 600 tidak lagi berarti apa-apa |
| Penanda = 100 | idem |
| Panjang jalur = 8 | 600 harus jadi 700 atau 500 |

Tiga angka yang saling terkunci, dan **tidak ada satu pun baris yang menyatakan
hubungannya**. `600` muncul begitu saja, dua kali (baris 1640 dan 1670).

> **Pelajaran.** Konstanta yang merupakan *hasil hitungan dari konstanta lain*
> harus ditulis sebagai hitungan, bukan sebagai angka jadi.
> `FL = -(MARK + 7*EMPTY)` menjelaskan dirinya; `600` tidak.
>
> Ini keluarga yang sama dengan urutan dua baris di [MAZE](maze.md) dan pagar
> tak sengaja di [PEGLEAP](pegleap.md): benar, tapi kebenarannya tidak
> tertulis di mana pun.

Halaman portnya menampilkan `FL` untuk kedua jalur secara langsung, jadi Anda
bisa melihatnya turun ke nol menjelang akhir permainan.

---

## 2 · Mengocok dengan larik yang menyusut

```basic
1270 FOR K=1 TO 64:AV(K)=K:NEXT
1280 FOR K=64 TO 1 STEP -1:READ PC
1290 P1=1+INT(K*RND(1))
1300 J=AV(P1)-1
1310 IF P1<K THEN FOR I=P1 TO K-1:AV(I)=AV(I+1):NEXT
1320 I=INT(J/8):J=J-8*I
1330 BD(I,J)=PC
```

Isi larik `AV` dengan 1…64. Ambil satu indeks acak. Pakai isinya sebagai posisi
papan. Lalu **geser seluruh sisanya** menutup lubang, dan ulangi dengan K yang
menyusut.

Itu pengambilan sampel tanpa pengembalian yang **benar** — tiap posisi terpakai
tepat sekali. Tapi biayanya O(n²): tiap pengambilan menggeser rata-rata separuh
larik.

Fisher–Yates menyelesaikan hal yang sama dalam O(n) dengan **menukar** elemen
terpilih ke ujung alih-alih menggeser:

```js
for (let i = t.length - 1; i > 0; i--) {
  const j = r.int(i + 1);
  const x = t[i]; t[i] = t[j]; t[j] = x;
}
```

Untuk 64 elemen bedanya tidak terasa — 2000 operasi lawan 64. Yang berbeda
bukan kecepatannya, melainkan **gagasannya**: menggeser menjaga urutan yang
tidak dibutuhkan siapa pun. Begitu Anda sadar urutan sisa larik tidak penting,
menukar jadi pilihan yang jelas.

Baris 1320 juga layak dilihat: `I=INT(J/8):J=J-8*I` — membongkar satu indeks
lurus 0…63 jadi (baris, kolom). Pola yang sama dengan [TICTAC](tictac.md),
[PEGLEAP](pegleap.md), dan [MAZE](maze.md); di sini tanpa pagar, karena tidak
ada yang berjalan melewati tepi.

### `RANDOMIZE` lagi

Baris 1110 dan 1260 keduanya `RANDOMIZE VAL(RIGHT$(TIME$,2))` — **60 benih
yang mungkin**, dan disemai dua kali dari sumber yang sama.

Ini kemunculan **keempat** pola tersebut di koleksi ini, setelah
[MASTER](master.md), [MAZE](maze.md), dan `WILDCAT.BAS`. Lihat
[fondasi §2.6](_fondasi.md).

---

## 3 · Penulis yang sama dengan Othello

```basic
1000 '   MAXIT  FROM PET
1010 '   ADAPTED TO IPM PC BY PATRICK LEABO
1020 '   3-20-82              TUCSON ARIZONA
```

[OTHELLO.BAS](othello.md) ditulis orang yang sama, dari kota yang sama, bulan
yang sama, dan juga *"adapted from PET"*. Dua program di koleksi ini dari satu
tangan — dan keduanya menuliskan **nama, kota, dan tanggal** di baris komentar,
pada masa ketika tidak ada mekanisme apa pun yang menuntutnya.

Perhatikan juga salah ketiknya: **"IPM PC"**.

Ia bertahan empat puluh tahun, disalin dari disket ke disket, sampai ke berkas
ini. Bukan karena tidak ada yang menyadarinya — melainkan karena tidak ada
seorang pun yang punya cara **mengirimkan perbaikannya kembali**. Persis
masalah yang diminta OTHELLO di baris 1025-nya.

---

## 3b · Kode Othello yang tertinggal di dalamnya

```basic
2350 PLOT 8:END
2360 REM  OTHER OTHELLO BOARD
2370 '
2380 TOP$="╔═══╤═══╤…"
2390 LOCATE 4,4:PRINT TOP$
2400 FOR Y=5 TO 17 STEP 2:LOCATE Y,4:PRINT MD1$…
```

Baris 2350 adalah `END`. Semua yang sesudahnya **tidak pernah dijalankan** —
dan yang ada di sana adalah rutin penggambar papan, diberi label
*"OTHER OTHELLO BOARD"*.

Ini bukti langsung bahwa MAXIT dibangun dengan **menyalin OTHELLO.BAS** lalu
menggantinya sedikit demi sedikit. Rutin papan lamanya tidak dihapus, cuma
ditinggalkan di belakang `END`.

Jadi hubungan kedua program itu bukan sekadar "penulis yang sama" — yang satu
adalah **turunan langsung** dari yang lain, dan jejaknya masih ada di dalam
berkasnya.

> **Pelajaran.** Kode mati yang ikut terkirim hampir selalu punya sebab yang
> sama: menghapusnya terasa lebih berisiko daripada membiarkannya. Di 1982
> tidak ada kendali versi — sekali dihapus, hilang selamanya. Membiarkannya di
> belakang `END` adalah cadangan.
>
> Alat yang menghapus alasan itu bukan alat penghapus kode mati, melainkan
> `git`. Setelah ada tempat untuk mengambilnya kembali, tidak ada lagi alasan
> menyimpannya di jalur eksekusi.

---

## 4 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan | `BD(7,7)`, kosong = −100, penanda = 100 | Satu larik untuk nilai *dan* keadaan | **Dipertahankan** — dan `FL` ditampilkan hidup (§1) |
| Pengocokan | Larik menyusut, O(n²) | Tidak ada `SWAP` untuk larik | Fisher–Yates; alasannya dijelaskan, bukan disembunyikan |
| Pengacak | `RANDOMIZE` dua kali dari detik | Tidak ada entropi | Disemai **sekali** dari `crypto.getRandomValues` |
| Jalur yang berlaku | tidak ditandai | Layar teks | Baris dan kolom penanda disorot dua warna berbeda |
| Lawan komputer | ada | — | **Tidak diport** — lihat di bawah |
| Dua pemain | `NP=2` | — | Belum diport |

### Petunjuk bermain

Aslinya menawarkan layar petunjuk sebelum bermain (baris 2210–2340), dan versi
pertama port ini **tidak menyertakannya sama sekali** — pemain dihadapkan pada
papan 8×8 berisi angka tanpa penjelasan apa pun.

Itu kelalaian, bukan penyederhanaan. Aturan MAXIT tidak bisa ditebak dari
papannya: tidak ada apa pun di layar yang menunjukkan bahwa satu pemain
bergerak mendatar dan satunya menegak.

Sekarang ada panel **"Cara bermain"** yang terbuka secara bawaan, dan teks
petunjuk aslinya dikutip utuh di kolom kanan.

Letaknya butuh tiga percobaan, dan tiap percobaan mematahkan asumsi
percobaan sebelumnya.

**Percobaan pertama: di atas papan**, tujuh langkah bernomor. Hasilnya lebih
buruk daripada tidak ada petunjuk sama sekali — halaman terbuka dengan dinding
teks, dan permainannya terdorong ke bawah layar.

**Percobaan kedua: dua lapis.** Tiga kata kunci ("Anda → baris", "Komputer →
kolom", "penanda pindah") tepat di bawah papan, dan penjelasan penuhnya jadi
panel pertama di **kolom kanan**. Alasannya masuk akal: yang perlu diingat
*sambil* bermain di dekat papan, yang perlu dibaca *sebelum* bermain di tempat
membaca.

Yang luput: itu mengandaikan kolom kanan selalu ada **di kanan**. Di bawah
980px tata letaknya menumpuk jadi satu kolom, dan "panel pertama kolom kanan"
berubah arti — ia jatuh di bawah papan, HUD, ruleset, *dan* tombol reset.
Pemain yang membuka halaman di jendela sempit tidak menemukannya, lalu
melaporkan bahwa MAXIT tidak punya petunjuk bermain. Panel itu ada; letaknya
saja yang berpindah tanpa ada yang memutuskan.

**Bentuk sekarang:**

| | Isi | Letak |
|---|---|---|
| **Pengingat** | tiga kata kunci — "Anda → baris", "Komputer → kolom", "penanda pindah" | tepat di bawah papan |
| **Penjelasan** | tiga langkah + catatan, terbuka sejak awal | tepat di bawah pengingat, di kolom permainan |

Keberatan percobaan pertama tetap dihormati — panel ini **di bawah** papan,
jadi tidak ada yang terdorong ke bawah layar. Yang hilang cuma
ketergantungannya pada lebar jendela. Kolom kanan kembali jadi murni kolom
pembahasan.

Perubahan yang sama diterapkan ke [PEGLEAP](pegleap.md), yang sebelumnya tidak
punya panel ini sama sekali.

> **Pelajaran.** Petunjuk yang dibaca **sekali** dan pengingat yang dilihat
> **terus-menerus** memang dua hal berbeda — percobaan kedua benar soal itu.
> Kesalahannya bukan pada pembagiannya, melainkan pada **menyatakan letak
> sebagai kolom, bukan sebagai urutan**. Kolom adalah janji yang batal saat
> tata letaknya menumpuk; urutan bertahan di semua lebar layar.
>
> Sanak-saudaranya banyak: apa pun yang diletakkan "di samping" akan suatu saat
> berada "di bawah", dan yang di bawah bisa berarti *jauh* di bawah.

Kalimat terakhir petunjuk aslinya menjelaskan masukan yang sudah tidak ada
lagi — *"use the space bar to position yourself, and then push return"* —
yaitu menggeser penunjuk selangkah demi selangkah, karena tidak ada tetikus.

### Deviasi yang perlu dinyatakan: AI-nya tidak diport

AI aslinya tidak saya baca sampai tuntas, dan yang ada di port ini adalah
buatan sendiri: memilih langkah yang memaksimalkan *(nilai yang diambil)*
dikurangi *(nilai terbaik yang tersisa untuk lawan sesudahnya)* — satu langkah
ke depan.

Itu kedalaman yang sama dengan AI OTHELLO karya penulis yang sama, jadi
rasanya mungkin mirip. Tapi saya tidak mengklaim itu; ia **belum diperiksa**,
dan siapa pun yang ingin kesetiaan penuh perlu membaca baris 1700 ke atas
lebih dulu.

---

## 5 · Latihan

1. **Nyatakan angka 600.** Ganti kedua kemunculannya dengan hitungan dari
   konstanta `MARK` dan `EMPTY`. Lalu ubah papan jadi 10×10 — berapa tempat
   yang perlu disentuh sekarang, dan berapa sebelumnya?

2. **Ukur pengocokannya.** Hitung berapa operasi geser yang dilakukan baris
   1310 untuk 64 elemen. Bandingkan dengan 64 pertukaran Fisher–Yates. Pada
   ukuran berapa selisihnya mulai terasa di 4,77 MHz?

3. **Uji keadilannya.** Jalankan pengocokan aslinya sejuta kali dan hitung
   berapa sering nilai 100 mendarat di tiap sel. Apakah meratanya sama dengan
   Fisher–Yates?

4. **Port AI aslinya.** Baca baris 1700 ke atas, terapkan apa adanya, lalu
   adu dengan AI satu-langkah di halaman ini. Mana yang menang, dan apa yang
   dilihat AI aslinya yang tidak dilihat yang ini?

---

Berkas terkait: [mainkan](../games/maxit1/index.html) ·
[OTHELLO — penulis yang sama](othello.md) ·
[fondasi §2.6 — keacakan](_fondasi.md) · [MAZE](maze.md)
