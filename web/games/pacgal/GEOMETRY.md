# PAC-GAL — geometri labirin

> **DIHASILKAN** oleh `decompile/tools/gen-pacgal-ref.py` — jangan disunting tangan.
> Jalankan ulang skrip itu sesudah mengubah `maze.js` atau tetapan geometri di `pacgal.js`.

Berkas ini ada supaya geometri labirin **tidak perlu digali ulang dari kode**
setiap kali ada yang mau diperiksa. Ia statis; menggalinya berulang cuma
memberi kesempatan salah baca yang sama terjadi dua kali.

Dan itu bukan kekhawatiran teoretis. Gerbang kandang pernah dikira **satu** sel
padahal **dua**. Akibatnya hantu yang keluar lewat sel yang satunya tidak pernah
dianggap selesai keluar, dan tiga gejala yang kelihatannya tidak berhubungan —
hantu terjebak di kandang, hantu masuk kembali sendiri, hantu mondar-mandir di
atas kandang — semuanya lahir dari satu sel itu.

Yang lebih penting: uji otomatis waktu itu **lulus**, karena kotak "di dalam
kandang" pada ujinya dibangun dari empat posisi start hantu — asumsi yang sama
persis dengan yang bikin kodenya salah. Alat ukur yang mewarisi asumsi kode yang
diukurnya tidak akan pernah menemukan kesalahan itu. Karena itu tabel
[Pemeriksaan](#pemeriksaan) di bawah dibangun dari **petak**, bukan dari tetapan.

---

## Asal

| | |
|---|---|
| Sumber | run/PAC-GAL.EXE dijalankan lewat decompile/tools/textscreen.py |
| Verifikasi | 24/24 baris cocok sel demi sel dengan pac-gal-run.bas (refscreen.py) |
| Ukuran | 24 baris × 40 sel |
| Pelet | 468 |

Labirin ini **diukur, bukan disalin**: PAC-GAL tidak menyimpannya sebagai larik
di mana pun. Program membangunnya saat startup dari `CHR$`/`STRING$` lalu
mencetaknya baris demi baris, jadi satu-satunya tempat ia pernah berwujud utuh
adalah layar. Bukti yang memeriksa dirinya sendiri: jumlah pelet di petak ini
468, dan baris status yang dicetak programnya sendiri berbunyi `dots 468`.

---

## Sistem koordinat

Ada **dua** sistem, dan mencampurnya adalah sumber kekeliruan yang paling
mudah terjadi di berkas ini.

| | Rentang | Dipakai oleh |
|---|---|---|
| **Kolom layar** | 0–79 | `maze.js` (string mentah), `at(r, c)` |
| **Kolom sel** | 0–39 | semua logika permainan: `pemain.c`, `h.c`, semua tetapan di bawah |

Sel `c` menempati kolom layar `2c` dan `2c+1`. Ubin selalu di kolom **genap**;
kolom ganjil selalu spasi. Karena itu `at(r, c * 2)` di `pacgal.js`.

Baris tidak punya dua sistem: baris 0–23, sama di keduanya.

**Semua koordinat di dokumen ini adalah (baris, kolom-sel).**

---

## Kamus ubin

| Karakter | Kode | Jumlah | Arti | Bisa dilewati |
|---|---|---|---|---|
| `∙` | U+2219 | 468 | pelet | ya |
| `═` | U+2550 | 157 | dinding | tidak |
| `║` | U+2551 | 141 | dinding | tidak |
| `▄` | U+2584 | 50 | dinding | tidak |
| `▀` | U+2580 | 50 | dinding | tidak |
| `█` | U+2588 | 38 | dinding | tidak |
| ` ` | U+0020 | 21 | spasi | ya |
| `╔` | U+2554 | 6 | dinding | tidak |
| `╝` | U+255D | 6 | dinding | tidak |
| `╦` | U+2566 | 5 | dinding | tidak |
| `╩` | U+2569 | 5 | dinding | tidak |
| `╚` | U+255A | 5 | dinding | tidak |
| `╗` | U+2557 | 4 | dinding | tidak |
| `─` | U+2500 | 4 | terowongan | khusus |

`bolehLewat(ch)` di `pacgal.js` hanya menerima spasi dan pelet. Ubin terowongan
ditandai **khusus**: ia tidak lolos `bolehLewat`, tapi `langkah()` memeriksanya
lebih dulu dan memantulkan kolomnya — lihat [Terowongan](#terowongan).

---

## Petak lengkap

Tanda: `P` start pemain · `1`–`4` start hantu · `G` gerbang kandang ·
`O` energizer · `a`–`d` sudut sebar · `=` ubin terowongan · `#` dinding · `.` pelet

```
     0         1         2         3         
     0123456789012345678901234567890123456789
    +----------------------------------------
  0 |#b####################################a#
  1 |#O.......#.........#.........#........O#
  2 |#.#.####.#.#######.#.#######.#.#####.#.#
  3 |#.#.#..........#...#...#...........#.#.#
  4 |#.#.#.########.#.#####.#.#########.#.#.#
  5 |#.#..................................#.#
  6 |#.#.#####.####.###########.###.#####.#.#
  7 |#.#.........##.#...#...#...#.........#.#
  8 |#.#.#.#####.#....#...#...#.#.#####.#.#.#
  9 |#...#.....#.#.#.########.#.#.#.....#...#
 10 |#####.#.#...#.#..........#.#...#.#.#####
 11 |==....#.#.#.#.#.###GG###.#.#.#.#.#....==
 12 |#####.#.#.#.#...#      #...#.#.#.#.#####
 13 |#...#...#.#.#.#.#1234  #.#.#.#.#...#...#
 14 |#.#.#.#...#.#.#.#      #.#.#.#...#.#.#.#
 15 |#.#.#.###.#.#.#.########.#.#.#.###.#.#.#
 16 |#.#.......#..................#.......#.#
 17 |#.#.#######.################.#######.#.#
 18 |#.#................P.................#.#
 19 |#.#.#.########.#.#####.#.#########.#.#.#
 20 |#.#.#..........#...#...#...........#.#.#
 21 |#.#.####.#.#######.#.#######.#.#####.#.#
 22 |#O.......#.........#.........#........O#
 23 |#d####################################c#
```

---

## Kandang hantu

Bagian yang paling sering salah dibaca, jadi diperbesar:

```
           2     
     456789012345
    +------------
  9 |#.########.#
 10 |#..........#
 11 |#.###GG###.#
 12 |..#      #..
 13 |#.#1234  #.#
 14 |#.#      #.#
 15 |#.########.#
 16 |............
```

| | Nilai | Tetapan di `pacgal.js` |
|---|---|---|
| Baris gerbang | 11 | `GERBANG.r` |
| **Sel gerbang** | **(11, 19) dan (11, 20)** — dua sel, bukan satu | `adalahGerbang()` |
| Interior (baris) | 12–14 | `diKandang()` |
| Interior (kolom) | 17–22 — enam sel lebar, bukan empat | `diKandang()` |
| Baris start hantu | 13 | `KANDANG.r` |
| Kolom start hantu | 17, 18, 19, 20 | `KANDANG.cs` |

Perhatikan baris terakhir dibanding baris di atasnya: **start hantu menempati
kolom 17–20, tapi kandangnya selebar kolom 17–22.**
Menyamakan keduanya — mengira lebar kandang = jumlah hantu — adalah persis
kekeliruan yang dulu terjadi. Hantu yang berdiri di kolom 22 ada di dalam
kandang tapi tidak dikenali oleh kotak yang diturunkan dari posisi start.

### Aturan gerbang

Gerbang **satu arah**, dijaga di tiga tempat di `pacgal.js`:

1. Sasaran mode `kandang`/`keluar` adalah sel gerbang **terdekat** (`h.c >= 20 ? 20 : 19`) —
   kalau selalu ke kolom 19, hantu yang start di kolom 20 harus menyeberang dulu
   dan bisa saling menghalangi.
2. `bolehGerbang(h)` hanya benar untuk hantu yang sedang keluar, sedang di
   kandang, atau sudah dimakan dan pulang. Hantu yang sedang bermain tidak boleh
   melewatinya — tanpa aturan ini, hantu ketakutan yang bergerak acak bisa
   melangkah masuk dan terjebak.
3. Selesai keluar = `h.r < GERBANG.r`, yaitu **sudah berada di atas baris
   gerbang** — bukan menginjak satu sel tertentu. Syarat sel-tunggal adalah bug
   yang memicu perbaikan ini.

---

## Terowongan

Ubin `─` ada di baris **11** saja, di kolom 0, 1, 38, 39.

`langkah()` memeriksa ubin terowongan **sebelum** memeriksa bisa-dilewati:

```js
if (at(nr, nc * 2) === TEROWONGAN) nc = 39 - c;
```

Jadi masuk ke ubin terowongan tidak berarti berdiri di atasnya — kolomnya
langsung dicerminkan ke `39 - c`. Berlaku untuk pemain maupun hantu.

Catatan penyimpangan: Pac-Man 1980 memperlambat hantu di terowongan. Port ini
tidak. Lihat `GHOSTS.md`.

---

## Koordinat penting

| Apa | Koordinat | Tetapan |
|---|---|---|
| Start pemain | (18, 19) (menghadap kiri) | `MULAI` |
| Start hantu 1 (Pengejar) | (13, 17) | `KANDANG.cs[0]` |
| Start hantu 2 (Pembayang) | (13, 18) | `KANDANG.cs[1]` |
| Start hantu 3 (Penjepit) | (13, 19) | `KANDANG.cs[2]` |
| Start hantu 4 (Pemalu) | (13, 20) | `KANDANG.cs[3]` |
| Sudut sebar Pengejar | (0, 38) | `WATAK[0].sudut` |
| Sudut sebar Pembayang | (0, 1) | `WATAK[1].sudut` |
| Sudut sebar Penjepit | (23, 38) | `WATAK[2].sudut` |
| Sudut sebar Pemalu | (23, 1) | `WATAK[3].sudut` |
| Energizer | (1, 1) · (1, 38) · (22, 1) · (22, 38) | `ENERGIZER` |

Energizer adalah **rekonstruksi, bukan pemulihan.** Aslinya memang punya keadaan
hantu-rentan dan rumus lamanya terpulihkan utuh, tapi pemicunya tidak: ujinya
`IF SCREEN(...) > 7`, dan setiap ubin labirin — pelet 249, spasi 32, dinding 205 —
semuanya lebih dari 7. Petak hasil panen juga tidak memuat ubin khusus yang bisa
jadi energizer. Empat sel sudut ini dipilih dengan mencari pelet terdekat ke tiap
sudut petak: konvensi Pac-Man, bukan temuan.

---

## Pemeriksaan

Dibangun dari **petak**, bukan dari tetapan — supaya bisa menemukan kesalahan
yang justru ada di tetapannya.

| Hasil | Pemeriksaan | Rincian |
|---|---|---|
| LULUS | Sel terbuka di baris gerbang (r11) = sel yang dijaga adalahGerbang | petak: [19, 20] \| kode: [19, 20] |
| LULUS | Ruang tertutup kandang (diukur dengan banjir) = kotak diKandang di kode | banjir 18 sel, kode 18 sel; selisih tidak ada |
| LULUS | Keempat sel start hantu terbuka dan di dalam kotak diKandang | start: [(13, 17), (13, 18), (13, 19), (13, 20)] |
| LULUS | Sel di atas tiap gerbang terbuka (jalan keluar benar-benar ada) | [((10, 19), True), ((10, 20), True)] |
| LULUS | Sel start pemain terbuka | (18, 19) |
| LULUS | Keempat energizer di sel berpelet | [((1, 1), '∙'), ((1, 38), '∙'), ((22, 1), '∙'), ((22, 38), '∙')] |
| LULUS | Keempat sudut sebar tak terjangkau (rancangan 1980: hantu berputar di sudut) | [('Pengejar', (0, 38)), ('Pembayang', (0, 1)), ('Penjepit', (23, 38)), ('Pemalu', (23, 1))] |
| LULUS | Tiap sudut sebar punya sel terjangkau berdekatan (<= 4 petak) | Pengejar (0, 38)->(1, 38) d=1 · Pembayang (0, 1)->(1, 1) d=1 · Penjepit (23, 38)->(22, 38) d=1 · Pemalu (23, 1)->(22, 1) d=1 |
| LULUS | Keempat sudut sebar di empat penjuru berbeda | [(0, 38), (0, 1), (23, 38), (23, 1)] |
| LULUS | Semua 468 pelet terjangkau dari start pemain tanpa lewat gerbang | tak terjangkau: tidak ada |
| LULUS | Jumlah pelet petak = angka 'dots' yang dicetak program sendiri | petak 468, meta 468 |
| LULUS | Kandang tertutup rapat: satu-satunya jalan keluar adalah gerbang | kebocoran: tidak ada |
| LULUS | Lewat gerbang, hantu menjangkau seluruh petak yang dijangkau pemain | selisih: 0 sel |
| LULUS | Ubin terowongan hanya di satu baris | baris: [11] |

**Semua 14 pemeriksaan lulus.**
