# GERMFOLK — dari BASIC 1990 ke web

| | |
|---|---|
| Sumber | `run/GERMFOLK.BAS` — disket majalah *What Micro?*, direktori CARPARK |
| Ukuran asli | 10 baris, 0 subrutin, 0 `GOTO`, 10% komentar |
| Hasil port | [`../games/germfolk/`](../games/germfolk/index.html) |
| Analisis BASIC | [`../../reviews/GERMFOLK.md`](../../reviews/GERMFOLK.md) |

Program terkecil kedua di koleksi, dan **satu-satunya yang menjelaskan dirinya
sendiri sepenuhnya**. Kalau Anda menulis contoh untuk orang lain, tulis seperti
ini.

---

## 1 · Arsitektur asli

Tidak ada arsitektur untuk dibahas — dan itulah pelajarannya.

```basic
10 REM ******A German Folk Tune******
20 PLAY "o2 t200 l8"
30 PLAY "d g a b >c d4 ml e c< "
40 PLAY "mn b p8 a p8 g4 p8 "
…
```

Baris 20 menyetel **keadaan** sekali: oktaf 2, tempo 200, panjang not
seperdelapan. Baris 30–100 hanya not.

Pemisahan antara *konfigurasi* dan *isi* itulah yang membuatnya terbaca seperti
partitur. Prinsip yang sama berlaku jauh di luar musik: Anda melakukannya tiap
kali menulis `ctx.fillStyle = 'red'` sebelum menggambar sepuluh kotak, atau
menaruh setelan di puncak berkas.

Keadaan **diwarisi antar baris** — `PLAY` di baris 20 tetap berlaku sampai baris
100. Itu sebabnya baris 60 bisa langsung menulis `e c <b` tanpa menyebut ulang
oktaf atau tempo.

---

## 2 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Melodi | 9 string makro `PLAY` | Speaker PC: satu suara, gelombang kotak | **String disalin PERSIS** dan ditafsirkan `_shared/audio.js`. Bunyi notnya sama |
| Pewarisan keadaan | otomatis antar perintah `PLAY` | Interpreter menyimpan oktaf/tempo/panjang di ruang kerjanya | Ditiru: `audio.play()` mewarisi keadaan kecuali diberi `{fresh:true}` |
| Umpan balik visual | **tidak ada** | Tidak ada tempat di layar; program hanya berbunyi | Not balok bergulir + papan tuts menyala + baris yang berbunyi disorot. Murni tambahan, alasannya pedagogis |
| Gelombang | kotak | speaker PC hanya bisa itu | Tetap kotak — itu bunyi khasnya |

Yang **tidak** diubah: nada, tempo, urutan, artikulasi. Lagu ini berbunyi persis
seperti tahun 1990.

### Sembilan baris disambung jadi satu

Versi pertama port ini memutar tiap baris `PLAY` secara terpisah, satu per satu
dengan `await` — supaya kodenya terbaca semirip mungkin dengan BASIC-nya.
Sekarang kesembilan baris **disambung jadi satu string** dan ditafsirkan sekali.

Penyambungan itu sah persis karena aturan pewarisan di baris tabel di atas: di
GW-BASIC, `PLAY "a"` lalu `PLAY "b"` menghasilkan bunyi yang identik dengan
`PLAY "ab"`. Keadaan oktaf/tempo/panjang mengalir menembus batas baris, jadi
menyambungnya tidak mengubah apa pun.

Yang didapat dari penyambungan itu ada dua:

1. **Not baloknya bisa digambar lebih dulu.** Penonton melihat apa yang akan
   datang, bukan hanya apa yang sedang berbunyi.
2. **Bunyi dan gambar mustahil melenceng**, karena keduanya berasal dari
   daftar nada yang sama. Rantai `await` yang lama menambah sisa beberapa
   milidetik tiap baris; setelah sembilan baris, sorotan barisnya sudah
   ketinggalan dari bunyinya.

Baris mana yang sedang berbunyi tetap disorot — sekarang dihitung dari **nomor
indeks nada**, lewat tabel batas yang dibuat sekali di awal:

```js
let acc = '', prev = 0;
LINES.forEach((L, li) => {
  if (!L.play) return;
  acc += ' ' + L.play;
  const p = audio.debugParse(acc);
  BOUND.push({ line: li, from: prev, to: p.notes.length, state: p.state });
  prev = p.notes.length;
});
```

Perhatikan `acc` yang terus bertambah: tiap baris ditafsirkan bersama **semua
baris sebelumnya**, bukan sendirian. Itu satu-satunya cara mendapat keadaan
oktaf/tempo/panjang yang benar untuk baris itu — meniru persis apa yang
dilakukan interpreter GW-BASIC.

---

## 3 · Satu bug yang saya perbaiki di penafsir, bukan di program

Waktu menguji halaman ini, melodinya terdengar terlalu rendah — seperti garis
bas, bukan lagu rakyat. Penyebabnya di `_shared/audio.js`, bukan di
`GERMFOLK.BAS`.

Manual GW-BASIC menyatakan: *"Ada tujuh oktaf, 0 sampai 6. Oktaf 3 dimulai
dengan C tengah."* C tengah adalah MIDI 60, jadi:

```
MIDI = 12 × (oktafGW + 2) + semitone
```

Versi pertama saya memakai `+ 1`, dan hasilnya **satu oktaf terlalu rendah**.

Setelah diperbaiki, GERMFOLK menempati **D3 sampai E4** — melewati C tengah,
jangkauan melodi rakyat yang wajar. Sebelumnya D2–E3, wilayah bas.

Pelajarannya: kesalahan satu oktaf tidak menghasilkan galat apa pun. Ia hanya
terdengar sedikit salah, dan mudah dianggap "memang begitu". Konstanta
pemetaannya sekarang ditulis eksplisit dengan uji di komentarnya.

---

## 4 · Sebelum & sesudah

```basic
20 PLAY "o2 t200 l8"
30 PLAY "d g a b >c d4 ml e c< "
```

```js
for (let i = 1; i < LINES.length; i++) {
  highlight(i);
  await audio.play(LINES[i].play, { onNote: n => kb.hitFreq(n.freq) });
}
```

Perhatikan tidak ada `{fresh:true}` — justru itu yang membuat pewarisan keadaan
bekerja seperti aslinya.

### Kamus makro yang dipakai lagu ini

| Perintah | Arti |
|---|---|
| `o2` | oktaf 2 |
| `t200` | tempo 200 ketuk/menit |
| `l8` | panjang bawaan 1/8 |
| `d4` | not D sepanjang 1/4 |
| `d8.` | 1/8 bertitik = 1,5× |
| `p8` | istirahat 1/8 |
| `>c` `<b` | naik/turun satu oktaf, lalu mainkan not itu |
| `ml` `mn` | legato / normal — mengubah panjang bunyi tanpa mengubah ketukan |

---

## 5 · Latihan

1. **Ubah satu setelan saja.** Ganti `t200` jadi `t120` di baris 20. Berapa
   banyak baris lain yang harus ikut diubah? Itulah nilai memisahkan
   konfigurasi dari isi.

2. **Hilangkan pewarisan.** Tambahkan `{fresh:true}` pada `audio.play()` di
   `germfolk.js`, lalu dengarkan. Kenapa lagunya jadi kacau?

3. **Bandingkan dua gaya.** `DREAM.BAS` menyimpan frasa ke variabel lalu
   menyusunnya; `GERMFOLK` menulis notnya lurus. Untuk lagu tanpa banyak
   pengulangan, mana yang lebih mudah dibaca? Kapan pilihannya berbalik?

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

Berkas terkait: [mainkan](../games/germfolk/index.html) ·
[OCTAVE](octave.md) · [DREAM](dream.md) · [NOTETABL](notetabl.md) ·
[fondasi](_fondasi.md)
