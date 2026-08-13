# NOTETABL — dari BASIC 1990 ke web

| | |
|---|---|
| Sumber | `run/NOTETABL.BAS` — disket majalah *What Micro?*, direktori CARPARK |
| Ukuran asli | 26 baris, 0 `GOTO`, 0 subrutin |
| Hasil port | [`../games/notetabl/`](../games/notetabl/index.html) |
| Analisis BASIC | [`../../reviews/NOTETABL.md`](../../reviews/NOTETABL.md) |

**Satu-satunya program di seluruh koleksi yang ditulis dengan gaya modern.**
Dan satu-satunya yang mencetak ke printer, bukan ke layar.

---

## 1 · Gaya yang tidak muncul di 82 program lainnya

```basic
10 OPTION BASE 1
20 CLS
30 noteno = 1: DIM notename$(12)
40 FOR count = 1 TO 12
50	READ note$: notename$(count) = note$
60 NEXT count
```

Tiga hal:

1. **Nama variabel huruf kecil dan bermakna** — `noteno`, `notename$`, `count`,
   `oct`, `freq`, `pitch`. Bukan `N`, `A$`, `I`.
2. **Indentasi sungguhan** di dalam blok `FOR`, memakai tab.
3. **`OPTION BASE 1`** — indeks array mulai dari 1, bukan 0. Dinyatakan sekali
   di baris pertama, dan seluruh program bebas dari kebingungan kurang-satu.

`OPTION BASE 1` tersedia di GW-BASIC sejak awal. Nyaris tidak ada yang
memakainya. Satu baris deklarasi yang menghapus seluruh kelas bug.

Berkas ini bertahun 1990; sebagian besar koleksi ini 1982. Bahasanya sama
persis. **Yang berubah cuma kebiasaan orang yang menulisnya** — dan membaca
`NOTETABL.BAS` berdampingan dengan `TICTAC.BAS` adalah cara tercepat melihat
delapan tahun perubahan budaya pemrograman.

---

## 2 · Perubahan terbesar: `LPRINT`, bukan `PRINT`

```basic
 80	LPRINT : LPRINT
 90	LPRINT STRING$(79, "-");
190	LPRINT TAB(3); : LPRINT noteno;
200	LPRINT TAB(19); : LPRINT notename$(note); oct;
```

`LPRINT` mengirim langsung ke LPT1. **Tidak ada satu pun `PRINT` ke layar di
seluruh program.** Keluarannya lembaran kertas.

Kendala yang melahirkannya: tabelnya 96 baris plus judul tiap oktaf, sementara
layar hanya 25 baris. Menggulung tidak berguna kalau Anda perlu melihat dua
oktaf sekaligus sambil menulis program lain. Kertas menyelesaikan itu — dan
hasilnya ditempel di dinding sebelah komputer.

Lebar `STRING$(79, "-")` dan posisi `TAB(3)/TAB(19)/TAB(35)/TAB(57)` adalah tata
letak untuk kertas 80 kolom.

---

## 3 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Keluaran | `LPRINT` ke printer | Layar 25 baris terlalu pendek untuk tabel 96 baris | Tabel yang bisa digulung **dan diklik untuk didengar** — sesuatu yang kertas tidak bisa |
| Kolom | `TAB(3)`, `TAB(19)`, `TAB(35)`, `TAB(57)` | Tata letak kertas 80 kolom | Kolom tabel sungguhan; lebar menyesuaikan isi |
| Pemisah | `STRING$(79,"-")` | Garis dari karakter | Garis CSS; judul oktaf jadi baris berwarna |
| Indeks array | `OPTION BASE 1` | — | **Dipertahankan maknanya**: `NAMES[note-1]`, dengan `note` tetap 1..12 seperti aslinya |
| Nama nada | `DATA C,C#,D,…` dibaca `READ` | Satu-satunya cara menaruh tabel di kode | Array biasa, isi disalin persis |
| Nada tak terdengar | tidak ditandai | Printer tidak tahu apa yang bisa dibunyikan | Baris di luar jangkauan `SOUND` (37–32767 Hz) diredupkan dan diberi keterangan |

---

## 4 · Kolom "pitch number" itu untuk apa?

```basic
180 pitch = CINT(125000 / freq)
```

**Bukan untuk speaker IBM PC.** Pencacah PC memakai pembagi

```
divisor = 1.193.180 / f
```

bukan 125.000. Untuk A440, PC butuh 2712; tabel ini mencetak 284.

Angka 125.000 adalah rumus **periode nada untuk chip suara PSG dengan pembagi 16
pada denyut 2 MHz** — 2.000.000 ÷ 16 = 125.000. Itu bentuk yang sangat umum di
keluarga chip AY-3-8910/YM2149.

Jadi tabel ini kemungkinan besar melayani **dua keluarga mesin sekaligus**:
kolom Hz untuk perintah `SOUND` di PC, kolom pitch untuk mesin lain. Masuk akal
untuk majalah Inggris yang pembacanya memakai banyak merek komputer — dan
`README.CAR` di disket yang sama memang menyebut sistem Amstrad.

Saya tidak bisa memastikan mesin mana persisnya. Yang bisa dipastikan: **kolom
itu tidak berguna untuk PC**, dan itu sudah cukup menarik — sebuah tabel di
disket PC yang separuh isinya untuk komputer lain.

---

## 5 · Sebelum & sesudah

```basic
160	FOR note = 1 TO 12
170		freq = 440 * (2 ^ (oct + (note - 10) / 12))
180		pitch = CINT(125000 / freq)
230		noteno = noteno + 1
240	NEXT note
```

```js
for (let note = 1; note <= 12; note++) {
  const freq = freqOf(oct, note);
  const pitch = Math.round(125000 / freq);
  …
  noteno++;
}
```

Nyaris identik — dan itu memang tujuannya. Program yang sudah ditulis rapi tidak
butuh banyak diterjemahkan.

Bandingkan baris 170 dengan [`OCTAVE.BAS`](octave.md) baris 30: **rumusnya sama
persis**. Bedanya cuma satu, dan menentukan segalanya:

```basic
OCTAVE.BAS :  60 GOTO 30              ' note tidak pernah berubah
NOTETABL   : 160 FOR note = 1 TO 12   ' note berjalan
```

---

## 6 · Latihan

1. **Hitung sendiri.** Pada `oct = 0`, nada mana yang menghasilkan tepat
   440 Hz? Kenapa rumusnya memakai `(note − 10)` dan bukan `(note − 1)`?

2. **Kolom yang hilang.** Tambahkan kolom "divisor PC" berisi
   `1193180 / freq`. Bandingkan dengan kolom pitch. Untuk nada apa keduanya
   kebetulan berdekatan?

3. **`OPTION BASE 1`.** Hapus baris 10 dari program aslinya di angan-angan
   Anda. Baris mana saja yang jadi salah, dan kenapa `DIM notename$(12)` tetap
   berjalan tapi menyisakan satu slot terbuang?

4. **Kertas vs layar.** Program ini dirancang untuk dicetak. Apa yang hilang
   ketika dipindah ke layar, dan apa yang didapat? Daftar keduanya.

---

## Satu daftar, dua tampilan

Tabel 96 baris dan not baloknya bukan dua fitur yang harus dijaga agar sinkron.
Keduanya digambar dari **satu daftar yang sama**:

```js
const PLAY = rows.filter(r => r.freq >= 37 && r.freq <= 32767);
PLAY.forEach((r, i) => { r.t = i * STEP; });
sheet.setNotes(PLAY.map(r => ({ midi: r.midi, t: r.t, dur: STEP * 0.8 })));
```

Akibatnya langsung terasa di antarmuka: **mengklik sebuah baris tabel juga
memindahkan not baloknya** ke posisi nada itu. Itu bukan fitur yang ditambahkan
— ia keluar sendiri dari cara datanya disusun.

```js
const pick = () => {
  if (rec.t !== undefined) sheet.setTime(rec.t);
  hit(rec, 420);
};
```

Saringan `freq >= 37 && freq <= 32767` juga bukan hiasan: itu jangkauan yang
diterima `SOUND` di GW-BASIC. Nada di luar itu ditolak interpreter aslinya, jadi
di sini ia tidak masuk not balok sama sekali dan barisnya diredupkan di tabel.
Batasan mesin 1990 tetap jadi batasan portnya.

### Menyapu: dijadwalkan, bukan dirantai

Sapuan seluruh tabel dulu ditulis sebagai `for … await wait(140)`. Dengan 90-an
nada, sisa beberapa milidetik tiap putaran menumpuk sampai not baloknya jelas
tertinggal. Sekarang setiap nada dijadwalkan sekali dari satu titik nol —
alasan yang sama, dan penjelasan lengkapnya, ada di
[OCTAVE §4](octave.md).

### Kotak pandang yang menyesuaikan diri

NOTETABL merentang dari **C1 sampai C7** — jauh di luar paranada besar, yang
hanya nyaman menampung sekitar G2–F5. Daripada memotong not yang tidak muat,
`staff.js` melebarkan kotak pandangnya seperlunya:

```js
function fit(steps) {
  let top = 0, bot = H;
  steps.forEach(s => {
    const y = yOf(s);
    if (y - 34 < top) top = y - 34;
    if (y + 34 > bot) bot = y + 34;
  });
  svg.setAttribute('viewBox', '0 ' + top + ' ' + W + ' ' + (bot - top));
}
```

`top` dan `bot` sengaja dimulai dari kotak bawaan, bukan dari not pertama —
supaya paranadanya **selalu** terlihat utuh walau semua notnya kebetulan
berkumpul di satu ujung.

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

Berkas terkait: [mainkan](../games/notetabl/index.html) ·
[OCTAVE — rumus yang sama, tapi macet](octave.md) ·
[GERMFOLK](germfolk.md) · [DREAM](dream.md) · [fondasi](_fondasi.md)
