# OCTAVE.BAS — Demo satu oktaf

> Enam baris: memainkan satu oktaf memakai SOUND dan rumus frekuensi standar.

| | |
|---|---|
| Sumber | Disket majalah What Micro? (CARPARK) |
| Tahun | 1990 |
| Panjang | 6 baris (nomor 10–60) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 1 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\OCTAVE.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

### Perulangan utama

`GOTO` mundur terpanjang: dari baris **60** kembali ke **30** — melingkupi 30 nomor baris.
Itulah loop utama program ini; segala sesuatu di dalam rentang tersebut
dijalankan berulang.

## Bagaimana program ini disusun

Enam baris, satu loop tak berujung, dan **satu rumus yang layak dihafal**:

```basic
30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
```

Ini rumus temperamen sama. 440 Hz adalah nada A di atas C tengah; naik satu oktaf
berarti frekuensi dikali dua; satu oktaf dibagi dua belas semitone yang sama
rasionya, jadi tiap semitone adalah pengali 2^(1/12).

Dari satu baris ini Anda bisa membangkitkan frekuensi nada apa pun. Setiap
aplikasi musik, tuner, dan synthesizer memakai rumus yang sama.

Perhatikan juga bahwa rumusnya ditulis sebagai **satu ekspresi utuh**, bukan
dipecah jadi lima langkah bernama huruf. Untuk rumus matematis yang punya bentuk
baku, menuliskannya apa adanya lebih terbaca daripada memecahnya — pembaca yang
mengenali rumusnya langsung paham.

Baris 60 (`GOTO 30`) membuatnya berputar tanpa syarat berhenti. Untuk demo
pengajaran itu bisa diterima, tapi tetap contoh dari apa yang harus dihindari:
loop tanpa jalan keluar. Bahkan demo pun sebaiknya punya satu tombol untuk
berhenti.

## Yang menarik dari kodenya

Enam baris, dan salah satunya adalah rumus yang layak dihafal:

```basic
30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
```

Ini **rumus temperamen sama**. 440 Hz adalah nada A di atas C tengah. Naik satu
oktaf berarti frekuensi dikali dua, dan satu oktaf dibagi dua belas semitone
yang sama rasionya — jadi tiap semitone adalah pengali 2^(1/12).

Dari satu baris ini Anda bisa membangkitkan frekuensi nada apa pun. Semua
aplikasi musik, tuner, dan synthesizer memakai rumus yang sama.

Baris 60 (`GOTO 30`) membuatnya berputar terus tanpa henti. Tidak ada syarat
berhenti — Anda harus menekan Ctrl+Break. Untuk sebuah demo pengajaran itu
bisa diterima, tapi tetap layak dicatat sebagai contoh apa yang terjadi kalau
loop tak berujung ditulis dengan sengaja.

Perhatikan juga bahwa program ini memakai **`SOUND` dan `PLAY` bersamaan**:
`SOUND freq, length` untuk nada yang dihitung, `PLAY "c"` untuk memajukan
penunjuk not. Itu memang cara membandingkan keduanya, yang jelas maksud
pengajarannya.

## Yang bisa dipelajari

- Rumus temperamen sama: `f = 440 * 2^(oktaf + (not-10)/12)`. Satu baris yang menjelaskan seluruh sistem nada Barat.
- Menulis rumus sebagai satu ekspresi yang terbaca lebih baik daripada memecahnya jadi lima langkah bernama huruf.

## Yang jangan ditiru

- Loop tanpa syarat berhenti. Sekalipun disengaja, sediakan satu tombol keluar.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not, `SOUND` — nada mentah (frekuensi, durasi)

### Sepuluh baris pembuka

```basic
10 octave = -2: note = 1: length = 1
20 PLAY "o0 t255"
30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
40 SOUND freq, length   
50 PLAY "c"              
60 GOTO 30
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
