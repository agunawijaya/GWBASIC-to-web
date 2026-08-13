# Struktur blok — alur kendali ketiga EXE

Iterasi loop #10, 2026-08-06. Prioritas (4).

## Target `GOSUB` terbaca dari word inline

Penelusuran rekursif dari entry point saja hanya menjangkau **655 byte dari 26.400** di
3DTTT. Sebabnya struktural: `GOSUB` (RT#6) tidak melompat langsung — ia meneruskan
alamat target sebagai **word inline** sesudah panggilan, dibaca runtime. Disassembler
statis tidak bisa mengikutinya.

Tapi word itu bisa dibaca langsung dari biner. Dengan menyemai penelusuran memakai
semua target `GOSUB`:

| | target `GOSUB` unik | jangkauan sebelum | sesudah |
|---|---|---|---|
| 3DTTT | **31** | 655 byte | **7.338 byte (28%)** |
| PAC-GAL | 3 | 2.211 | 3.457 (28%) |
| HOPPER | 2 | 2.241 | 2.303 (29%) |

Untuk 3DTTT lompatannya besar — 613 percabangan ditemukan, naik dari 60.

## Alur kendali

| | loop | `GOTO` mundur | `IF`/skip maju |
|---|---|---|---|
| 3DTTT | 9 | 43 | 561 |
| PAC-GAL | 10 | 11 | 174 |
| HOPPER | 22 | 19 | 204 |

**Koreksi heuristik.** Awalnya saya menghitung setiap percabangan mundur sebagai loop,
dan hasilnya mustahil: "loop" sepanjang 23.236 byte yang mencakup hampir seluruh program.
Itu bukan loop melainkan `GOTO` mundur — hal yang sangat lazim di BASIC bernomor baris.

Setelah dipisah berdasar bersyarat/tidak, ukuran loop jadi masuk akal:

```
3DTTT    loop terpanjang 126 byte   (1118..1244, 1283..1409, 1897..2023)
PAC-GAL  loop terpanjang  80 byte
HOPPER   loop terpanjang 125 byte
```

Ukuran 23–126 byte itu badan loop BASIC yang wajar.

**Kedalaman bersarang hampir seluruhnya nol** — 3DTTT 9 loop semuanya datar, HOPPER 22
loop semuanya datar, PAC-GAL 9 datar dan 1 bersarang. Itu ciri khas BASIC bernomor baris,
di mana pengulangan lebih sering dibangun dari `GOTO` daripada blok bersarang. Angka
`GOTO` mundur (43 di 3DTTT) mendukung pembacaan itu.

## Perbaikan: disassembly linier di celah antar-panggilan

Penelusuran rekursif hanya menjangkau ~28%. Tapi situs far call adalah **kebenaran
dasar** dari tabel relokasi, dan `situs+5` pasti batas instruksi. Dengan menjadikan
tiap `situs+5` sebagai jangkar disassembly linier sampai situs berikutnya:

| | rekursif | celah antar-panggilan |
|---|---|---|
| 3DTTT | 28% | **44%** |
| HOPPER | 29% | **47%** |
| PAC-GAL | 28% | 27% |

Jumlah loop-nya konsisten dengan analisis rekursif (3DTTT 10 vs 9; HOPPER 22 vs 22),
yang saling memvalidasi. Percabangan 3DTTT naik dari 613 ke 735.

PAC-GAL tidak naik — kodenya lebih padat panggilan, jadi celahnya sedikit.

Perkakas: [`tools/gaps.py`](tools/gaps.py), keluaran `blocks-gapscan.json`.

## Batas: jangkauan berhenti di 44–47%

Sesudah pemindaian celah, 3DTTT 44% dan HOPPER 47%. Sisanya belum terjangkau, dan saya
**belum tahu lewat apa** kode itu dicapai.

**Penting untuk konteks:** ini hanya memengaruhi analisis *percabangan*. Ekstraksi
*pernyataan* sudah lengkap — `statements.txt` mencakup seluruh 2.322 panggilan 3DTTT,
karena situs panggilan datang dari tabel relokasi, bukan dari penelusuran. Dugaan yang belum diuji: `ON ... GOTO` (tabel lompat terhitung),
atau mekanisme dispatch inline lain seperti yang dipakai `GOSUB`.

Ini menjadi penghambat berikutnya untuk struktur blok. Angka `GOSUB` yang timpang
(3DTTT 31, PAC-GAL 3, HOPPER 2) menunjukkan HOPPER dan PAC-GAL memakai mekanisme
percabangan lain yang dominan — bukan `GOSUB`.

Data mentah: [`blocks.json`](blocks.json), termasuk daftar rentang tiap loop.
