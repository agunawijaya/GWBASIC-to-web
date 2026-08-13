# DREAM — dari BASIC 1984 ke web

| | |
|---|---|
| Sumber | `run/DREAM.BAS` |
| Ukuran asli | 18 baris, **0 `GOTO`, 0 `GOSUB`, 0 percabangan** |
| Hasil port | [`../games/dream/`](../games/dream/index.html) |
| Analisis BASIC | [`../../reviews/DREAM.md`](../../reviews/DREAM.md) |

Program tanpa satu pun alur kendali. Isinya murni **data**, dan justru karena
itu ia menunjukkan satu fitur bahasa yang tidak dipakai program lain mana pun di
koleksi ini.

---

## 1 · Arsitektur asli

Lima belas baris menyimpan frasa musik ke variabel:

```basic
10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"
20 B$ = "MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A"
…
150 O$ = "MLL4E.MNL8EP8CDEDCO5MLL2C.L4C.C"
```

Tiga baris menyusunnya jadi lagu:

```basic
160 PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"
170 PLAY "XE$;XF$;XG$;XH$;XI$;XJ$;XK$;"
180 PLAY "XL$;XM$;XN$;XO$;"
```

### Perintah `X` — subrutin di dalam bahasa makro

`XA$;` berarti *"jalankan isi variabel A$"*. Bahasa mini untuk not ternyata
punya **pemakaian ulang**.

Lihat baris 160: `A B C D` lalu **`A B C` lagi**. Itu bait yang diulang. Lima
belas frasa disimpan sekali, dipakai **delapan belas kali**.

Tanpa `X`, lagu ini harus ditulis sebagai satu string raksasa dengan bait
disalin dua kali — dan mengubah satu not di bait itu berarti mengubahnya di dua
tempat.

Struktur bait–refrein sebuah lagu tercermin langsung di struktur programnya.
Prinsipnya sama dengan kompresi berbasis kamus, dan dengan cara kerja komponen
di antarmuka sekarang: **definisikan sekali, rujuk berkali-kali.**

---

## 2 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Frasa | 15 variabel `A$`..`O$` | Satu-satunya cara menyimpan potongan makro | Objek `PHRASE` — kunci yang sama (`'A$'`), isi disalin persis |
| Penyusunan | `PLAY "XA$;XB$;…"` | `X` adalah pemanggilan subrutin bawaan bahasa makro | **Perintah `X` diterapkan sungguhan** di `_shared/audio.js`, bukan disimulasikan dengan menyambung string |
| Pewarisan keadaan | otomatis antar frasa | Interpreter menyimpan oktaf/tempo | Ditiru; itu sebabnya jadwal dihitung dari gabungan, bukan dijumlahkan per frasa |
| Umpan balik | tidak ada | Program hanya berbunyi 3 menit | Papan tuts + 18 kotak urutan + frasa aktif disorot |

### `X` ditambahkan ke penafsir bersama

Sebelum sesi ini, `_shared/audio.js` belum mengenal `X`. Menambahkannya adalah
pilihan yang saya ambil daripada menyambung string di sisi permainan:

```js
audio.play('XA$;XB$;XC$;', { vars: PHRASE });
```

Alasannya: `X` bagian sah dari bahasa makro `PLAY`, dan permainan lain mungkin
memakainya. Menirunya di satu tempat lebih baik daripada menyiasatinya di
banyak tempat.

Penerapannya mengganti setiap `X<nama>;` dengan isi variabelnya, **berulang
sampai tidak ada lagi** — jadi sebuah frasa boleh memanggil frasa lain. Ada
batas kedalaman 8 supaya rujukan melingkar tidak menggantungkan halaman.

---

## 3 · Satu hal yang halus: menghitung jadwal

Untuk menyorot frasa yang sedang berbunyi, saya perlu tahu kapan tiap frasa
mulai. Yang **salah** adalah menjumlahkan durasi tiap frasa satu per satu:

```js
// SALAH — tiap frasa ditafsirkan dari keadaan bawaan
const at = phrases.map(p => audio.debugParse(p).total);
```

Karena tiap frasa **mewarisi** oktaf, tempo, dan panjang not dari frasa
sebelumnya, menafsirkannya sendiri-sendiri menghasilkan durasi yang berbeda.
Yang benar adalah menafsirkan **gabungannya**:

```js
let joined = '';
for (const name of SEQUENCE) {
  at.push(audio.debugParse(joined).total);   // waktu mulai frasa ini
  joined += PHRASE[name];
}
```

Ini contoh kecil dari masalah yang umum: **keadaan yang mengalir antar bagian
membuat bagian-bagian itu tidak bisa dihitung terpisah.** Sama seperti `GOSUB`
di BASIC yang tidak punya variabel lokal.

---

## 4 · Sebelum & sesudah

```basic
160 PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"
```

```js
const whole = COMPOSE.map(c => c.macro).join('');
await audio.play(whole, { fresh: true, vars: PHRASE, onNote: … });
```

String makro-nya **tidak diubah sama sekali** — yang dikerjakan JavaScript hanya
menyediakan kamus variabelnya, persis seperti GW-BASIC menyediakan `A$`..`O$`.

---

## 5 · Latihan

1. **Ubah bait sekali, dengar dua kali.** Ganti satu not di `A$`, lalu
   mainkan. Berapa tempat di lagu yang ikut berubah? Bandingkan dengan kalau
   lagunya ditulis sebagai satu string panjang.

2. **Frasa memanggil frasa.** Buat frasa baru `P$ = "XA$;XB$;"` dan pakai
   `XP$;` di baris penyusun. Apakah berjalan? Kenapa perlu ada batas kedalaman?

3. **Buktikan soal pewarisan.** Ubah `schedule()` agar menjumlahkan durasi tiap
   frasa terpisah (cara yang salah di bagian 3). Sorotan frasanya akan makin
   meleset seiring lagu berjalan — berapa jauh di akhir?

---

## Gambar dan bunyi dari satu penafsiran

Lagu tiga menit ini digambar **seluruhnya** di not balok sebelum nada pertama
berbunyi. Yang menarik bukan bahwa itu mungkin, melainkan bahwa itu **gratis**:

```js
const WHOLE = COMPOSE.map(c => c.macro).join('');
const ALL = audio.debugParse(WHOLE, PHRASE);        // ← perhatikan PHRASE
sheet.setNotes(ALL.notes.map(n => ({
  midi: audio.noteName(n.freq).midi, t: n.at, dur: n.dur
})));
```

Perhatikan argumen kedua, `PHRASE`. Penafsir menjalankan perintah `X` yang
**sama persis** seperti saat membunyikan — `XA$;` benar-benar dijabarkan jadi
isi `A$`. Gambar dan bunyi lahir dari satu jalur kode.

Kalau not baloknya ditulis terpisah — misalnya dengan menjumlahkan durasi tiap
frasa sendiri-sendiri — cepat atau lambat keduanya pasti melenceng, karena tiap
frasa **mewarisi** oktaf/tempo/panjang dari frasa sebelumnya. Menghitung ulang
di dua tempat berarti dua kesempatan untuk salah.

> **Pelajaran.** Kalau dua bagian program harus setuju tentang sesuatu, jangan
> buat keduanya menghitung sendiri lalu diperiksa. Buat satu yang menghitung,
> dan yang lain membaca hasilnya.

### Jam dan not balok dari satu putaran

Penunjuk waktu (`0:47 / 3:12`) dan penggulung not balok dulu berjalan di dua
mekanisme berbeda: `setInterval` untuk jam, dan tidak ada apa-apa untuk not
balok karena belum ada. Sekarang keduanya di satu `requestAnimationFrame`:

```js
const t0 = performance.now() + 30;
(function tick(now) {
  if (my !== token) return;
  const t = Math.max(0, ((now || performance.now()) - t0) / 1000);
  sheet.setTime(t);
  const sec = Math.floor(Math.min(PLAN.total, t));
  if (sec !== shown) { shown = sec; $('clock').textContent = …; }
  raf = requestAnimationFrame(tick);
})();
```

Penjagaan `if (sec !== shown)` penting: `textContent` disentuh paling banyak
sekali per detik, bukan enam puluh kali. Menulis nilai yang sama berulang kali
ke DOM adalah pemborosan yang mudah tidak terlihat karena tidak pernah salah.

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

Berkas terkait: [mainkan](../games/dream/index.html) ·
[GERMFOLK — gaya sebaliknya](germfolk.md) · [fondasi](_fondasi.md)
