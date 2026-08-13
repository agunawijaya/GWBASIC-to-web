# OCTAVE — dari BASIC 1990 ke web

| | |
|---|---|
| Sumber | `run/OCTAVE.BAS` — disket majalah *What Micro?*, direktori CARPARK |
| Ukuran asli | **6 baris** — terkecil di seluruh koleksi |
| Hasil port | [`../games/octave/`](../games/octave/index.html) |
| Analisis BASIC | [`../../reviews/OCTAVE.md`](../../reviews/OCTAVE.md) |

Enam baris, dan **tidak melakukan apa yang namanya janjikan**.

Yang dijalankan di halaman port adalah **versi yang sudah diperbaiki** — dua
baris ditambahkan, ditandai warna berbeda supaya jelas mana yang bukan kode
1990. Rumusnya sendiri tidak disentuh sama sekali; ia memang sudah benar.
Bugnya tetap jadi inti dokumen ini, dan sekarang bisa **dilihat** di not balok
alih-alih hanya didengar (lihat §3).

---

## 1 · Seluruh programnya

```basic
10 octave = -2: note = 1: length = 1
20 PLAY "o0 t255"
30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
40 SOUND freq, length
50 PLAY "c"
60 GOTO 30
```

`README.CAR` di disket aslinya menjelaskannya begini:

> *OCTAVE BAS — Uses the SOUND command and a standard formula to play an octave*

Tapi ia **tidak pernah memainkan satu oktaf**.

---

## 2 · Bugnya

`note` ditetapkan sekali di baris 10 dan **tidak pernah berubah**. Baris 60
melompat ke **30**, bukan ke sebuah perulangan yang menaikkannya.

Jadi baris 30 menghitung frekuensi yang sama setiap putaran:

```
freq = 440 × 2^(−2 + (1 − 10)/12) = 440 × 2^(−2,75) = 65,41 Hz
```

Programnya berbunyi: 65,41 Hz selama 1/18,2 detik, lalu `PLAY "c"` pada oktaf 0,
lalu ulangi — **selamanya**. Sebuah dengung tersendat. Hanya Ctrl+Break yang
menghentikannya.

### Yang membuatnya menarik: rumusnya benar

Ini bukan kesalahan matematika. Baris 30 adalah **rumus temperamen sama** yang
tepat:

```
f = 440 × 2^(oktaf + (not − 10)/12)
```

440 Hz adalah A di atas C tengah; naik satu oktaf berarti dikali dua; satu oktaf
dibagi dua belas semitone yang rasionya sama. Setiap tuner dan synthesizer
memakai rumus yang sama.

Yang hilang cuma **satu perulangan**.

### Buktinya ada di disket yang sama

[`NOTETABL.BAS`](notetabl.md) memakai rumus **persis sama**:

```basic
170 freq = 440 * (2 ^ (oct + (note - 10) / 12))
```

tapi dibungkus `FOR note = 1 TO 12` — dan ia bekerja. Dua program, satu disket,
satu rumus; yang satu berjalan, yang satu macet.

Kemungkinan besar `OCTAVE.BAS` adalah potongan yang dicetak di majalah sebagai
**demonstrasi rumusnya**, bukan program yang dimaksudkan untuk dijalankan
sampai selesai. Tapi berkasnya beredar apa adanya, dan deskripsinya
menjanjikan hal lain.

---

## 3 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Perulangan | `60 GOTO 30` — tak berujung, `note` tetap | Tidak ada; ini kelalaian, bukan keterbatasan | **Dua baris ditambahkan** (`note = note + 1` dan `IF note <= 12 THEN GOTO 30`), ditandai warna berbeda di daftar kode |
| Nada | `SOUND freq, length` | Speaker PC | `audio.sound()` dengan satuan 1/18,2 detik yang sama |
| Panjang bunyi | `length = 1` = 1/18,2 detik ≈ 55 ms | Cukup untuk speaker PC yang tajam | **Dikali lima** (≈275 ms). Di speaker modern dengan instrumen berselubung halus, 55 ms nyaris tak terdengar. Ini penyimpangan tampilan, bukan perbaikan bug |
| Berhenti | Ctrl+Break | Loop tak berujung | Berhenti sendiri setelah dua belas nada; tombol Berhenti untuk memutus lebih awal |
| Umpan balik | tidak ada | — | Not balok + papan tuts + rumus yang dihitung langsung + baris kode yang disorot |

### Kenapa sekarang hanya versi yang diperbaiki

Versi pertama port ini menyediakan **dua tombol** — "jalankan seperti aslinya"
dan "versi yang diperbaiki" — dengan alasan pembaca perlu mendengar bedanya.

Itu dicabut. Alasannya: begitu ada not balok, bugnya **tidak perlu didengar
lagi, karena sudah terlihat.**

| | Versi asli | Versi diperbaiki |
|---|---|---|
| Deret atas (baris 40) | dua belas not di ketinggian **sama** | tangga yang menanjak |
| Deret bawah (baris 50) | datar | datar |

Dua deret mendatar yang sejajar adalah gambar yang langsung memberi tahu apa
yang salah, tanpa perlu diperdengarkan delapan kali. Tombol keduanya jadi
menambah pilihan tanpa menambah pemahaman — dan setiap pilihan yang tidak
menambah pemahaman adalah beban.

Yang **tidak** hilang: baris tambalannya tetap ditandai terang di daftar kode,
jadi pembaca selalu tahu persis di mana port ini menyimpang dari disket 1990.

Enam baris ini tetap contoh terbaik di koleksi tentang betapa mudahnya sebuah
program "hampir benar" lolos tanpa ketahuan — rumusnya benar, sintaksnya benar,
tidak ada galat, dan tetap saja salah.

### Dua nada per putaran, bukan satu

Yang mudah terlewat kalau hanya membaca kodenya: tiap putaran membunyikan
**dua** nada. Baris 40 membunyikan hasil hitungan; baris 50 membunyikan
`PLAY "c"` pada oktaf 0 — C1, yang tetap sama selamanya.

Di not balok, keduanya terpisah jelas: C tetap itu jadi deretan lurus di
paranada bas, sementara nada hitungan menaiki tangga di atasnya. Inilah alasan
halaman-halaman ini memakai **paranada besar** (bas + treble) dan bukan treble
saja — dua deret yang jaraknya lebih dari dua oktaf tidak muat di satu paranada.

---

## 4 · Sebelum & sesudah

```basic
30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
40 SOUND freq, length
50 PLAY "c"
60 GOTO 30
```

```js
/* Dua belas putaran DIJADWALKAN di muka, bukan dirantai dengan await. */
const PLAN = [];
for (let note = 1; note <= 12; note++) {          // ← yang hilang di aslinya
  const f = freqOf(OCTAVE, note);                 // baris 30, tak diubah
  PLAN.push({ note, at: (note - 1) * PERIOD, freq: f,
              midi: audio.noteName(f).midi });
}

PLAN.forEach(p => {
  at(p.at * 1000 - 60, () => mark(2), my);                  // baris 30
  at(p.at * 1000, () => audio.sound(p.freq, LENGTH * 5), my);// baris 40
  at(p.at * 1000 + AT_C * 1000, () => audio.note(24, .26), my); // baris 50
});
```

### Kenapa dijadwalkan, bukan dirantai

Versi pertama menulis ini sebagai rantai `await`: hitung, bunyikan, tunggu,
bunyikan C, tunggu, ulangi. Itu terbaca lebih mirip kode BASIC-nya, dan
karena itu terasa lebih jujur.

Masalahnya baru muncul setelah ada not balok. Tiap `await` selesai **sedikit
lebih lambat** dari yang diminta — `setTimeout(140)` tidak pernah tepat 140 ms.
Sisa itu menumpuk, dan setelah dua belas putaran gambar sudah tidak sejajar lagi
dengan bunyinya.

Menjadwalkan semuanya dari satu titik nol menghapus penumpukan itu sama sekali:
nada ke-dua belas dijadwalkan pada `11 × PERIOD` sejak awal, tidak peduli berapa
lama sebelas nada sebelumnya sebenarnya berjalan.

> **Pelajaran.** Rantai `await` mengukur waktu **relatif terhadap kejadian
> sebelumnya**, jadi galatnya berakumulasi. Jadwal mengukur waktu **relatif
> terhadap satu titik nol**, jadi galatnya tidak. Kalau sesuatu harus tetap
> sejalan setelah ratusan langkah, pakai jadwal.

---

## 5 · Latihan

1. **Kembalikan bugnya.** Di `octave.js`, ubah `freqOf(OCTAVE, note)` menjadi
   `freqOf(OCTAVE, 1)` di dua tempat — persis apa yang dilakukan `GOTO 30`.
   Jalankan, lalu lihat not baloknya. Berapa lama sampai Anda sadar ada yang
   salah **hanya dari gambarnya**? Bandingkan dengan berapa lama kalau Anda
   hanya mendengarnya.

2. **Perbaiki di BASIC.** Tulis ulang enam baris itu supaya benar-benar
   memainkan satu oktaf, dengan tetap memakai `GOTO` (tanpa `FOR`). Berapa
   baris tambahan yang perlu?

3. **Rumusnya.** Kenapa `(note − 10)`, bukan `(note − 1)`? Petunjuk: pada
   `oct = 0`, nada mana yang menghasilkan tepat 440 Hz?

4. **Cari yang serupa.** Program mana lagi di koleksi ini yang deskripsinya
   tidak cocok dengan perilakunya? Mulai dari
   [`WHATMONF.BAS`](../../reviews/WHATMONF.md).

5. **Kembalikan panjang aslinya.** Ubah `LENGTH * 5` menjadi `LENGTH` di
   `octave.js`, lalu dengarkan dengan instrumen `Speaker PC (asli)` dan
   dengan `Biola`. Kenapa 55 ms cukup untuk yang satu dan tidak untuk yang
   lain? Petunjuk: lihat nilai `env.a` (serang) kedua instrumen di
   `_shared/audio.js`.

---

## Not balok bergulir & pilihan instrumen

Dua tambahan yang berlaku untuk **semua** halaman musik, dan keduanya murni
tambahan — tidak ada padanannya di kode aslinya, yang hanya berbunyi.

### Not balok

Not bergerak dari kanan ke kiri melewati sebuah garis penanda yang **diam**.
Not yang sedang menyentuh garis itulah yang sedang berbunyi.

Kenapa notnya yang bergerak dan bukan garisnya? Karena kalau garisnya yang
berjalan, ia akan sampai ke tepi kanan lalu harus melompat balik — dan setiap
lompatan memutus rasa waktu yang berjalan lurus. Menggulung kertasnya
menghasilkan gerakan yang tidak pernah putus, dan itu persis cara kerja
piano roll sungguhan.

Posisi tegak tiap not dihitung dari **langkah diatonis**, bukan dari nomor MIDI:

```
langkah = oktaf x 7 + indeksHuruf     (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
y       = Y0 - (langkah - 18) x 6
```

Ini bukan kerumitan yang dicari-cari. Kalau nomor MIDI dipakai langsung, C dan
C♯ akan jatuh di ketinggian yang berbeda — padahal di notasi sungguhan keduanya
menempati garis yang **sama**, bedanya hanya tanda kres di depan. Tangga nada
mayor yang seharusnya terlihat rata jadi terlihat timpang.

Dipakai **paranada besar** (bas + treble sekaligus, dengan C tengah sebagai
garis bantu di antaranya) karena satu paranada tidak cukup: GERMFOLK turun
sampai D3, DREAM naik sampai C6, dan NOTETABL merentang dari C1 sampai C7.

### Pilihan instrumen

Delapan instrumen tersedia sebagai **deretan tombol di bawah papan tuts**, dan
pilihannya berlaku di semua halaman. Bawaannya **`Speaker PC (asli)`**, dan itu
disengaja: ia satu-satunya yang berbunyi seperti mesin 1990. Tujuh sisanya
adalah kenyamanan yang ditawarkan, bukan koreksi.

Pergantian berlaku **seketika, termasuk di tengah lagu yang sedang berjalan.**
Itu terdengar sepele tapi menuntut perubahan mendasar di `audio.js`: nada tidak
lagi dijadwalkan seluruhnya di muka, melainkan 120 ms sebelum berbunyi. Lihat
[fondasi §2.4c](_fondasi.md).

### Jeda, bukan berhenti

Tombol keduanya sekarang **Jeda / Lanjut**, dan kembali ke awal adalah tindakan
terpisah: **Ulang**.

Versi pertama menggabungkan keduanya jadi satu tombol "Berhenti" yang juga
menggulung balik ke nol. Itu tombol yang menghukum: mendengarkan sebagian lalu
berhenti sebentar berarti kehilangan posisi, jadi satu-satunya cara aman adalah
membiarkannya jalan sampai habis.

> **Pelajaran.** Kalau sebuah tombol melakukan dua hal, tanyakan apakah
> pengguna selalu menginginkan keduanya bersamaan. Kalau tidak, itu dua tombol
> yang kebetulan digabung — dan yang lebih jarang diinginkan akan terus
> mengganggu yang lebih sering.

Dua jam harus dijeda bersamaan: jam bunyi di `audio.js` dan jam gambar di
halaman ini. Keduanya memakai pola yang sama — menabung waktu yang sudah lewat
alih-alih menyimpan "kapan mulai" — sehingga keduanya bisa dilanjutkan tanpa
menghitung ulang apa pun. Pola stopwatch, dan `RETRO.clock()` di
`_shared/loop.js` menyediakannya sekali untuk semua halaman.

Tempatnya juga bukan kebetulan. Versi pertama memakai `<select>` di bilah atas;
sekarang tombol, di dekat papan tuts. Instrumen bukan pengaturan halaman
seperti tema — ia bagian dari alat musiknya, dan dipakai sambil mendengarkan.
Sesuatu yang dipakai sambil mendengarkan tidak boleh butuh dua tindakan
(buka, lalu pilih) dan tidak boleh menutupi halaman selama terbuka.

Semuanya disintesis dari deret harmonik + amplop + penapis; tidak ada satu pun
berkas rekaman, karena halaman ini harus jalan dari `file://` tanpa aset
tambahan. Rinciannya di [fondasi §2.4a](_fondasi.md).

> **Yang perlu dinyatakan terus terang.** Dengan instrumen selain
> `Speaker PC (asli)`, bunyinya **tidak lagi setia pada mesin aslinya**. Itu
> pilihan pengguna, dan justru karena itu ia harus berupa pilihan — bukan
> bawaan yang diam-diam menggantikan.

Ingin mencoba menulis makro `PLAY` sendiri dengan cara menekan tuts? Lihat
[FREEPLAY](freeplay.md), program yang membalik arah keseluruhan halaman ini:
ia **menulis** string makro, bukan membacanya.

---

Berkas terkait: [mainkan](../games/octave/index.html) ·
[NOTETABL — rumus yang sama, tapi bekerja](notetabl.md) ·
[GERMFOLK](germfolk.md) · [FREEPLAY — rumus yang sama, dipakai terbalik](freeplay.md) ·
[fondasi](_fondasi.md)
