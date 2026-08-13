# Penelusuran dinamis — selesai, tanpa DOSBox

**Dokumen ini menggantikan versi sebelumnya**, yang menyimpulkan penelusuran dinamis
tidak bisa diotomatiskan dan menyerahkan prosedur manual ke user. Kesimpulan itu
**salah** — bukan karena DOSBox bisa diotomatiskan, tapi karena DOSBox tidak diperlukan.

## Sumbernya

`C:\Projects\DOS-Decompiler` — toolkit dekompilasi DOS yang jauh lebih matang, ditunjuk
oleh user. Yang relevan:

**`tools/comrun.py`** bukan pembungkus DOSBox. Ia **emulator 8086 tersendiri di Python**
(1.299 baris) yang:

- memuat MZ dengan benar — header, relokasi, `CS:IP`/`SS:SP` dari header
- mengemulasi `INT 10h` (video), `INT 21h` (DOS), `INT 16h` (papan ketik), `INT 20h`
- membalas baca port supaya loop timing tetap berjalan, mencatat tulisan port
- punya `--keys` untuk mengumpankan tombol, dan `--poll-patience` untuk mengalahkan
  loop *flush* `while KeyPressed do ReadKey` yang kalau tidak akan menelan seluruh antrean

Dan yang menentukan: **`--exec-map FILE`** menulis setiap offset image yang dieksekusi,
relatif terhadap `img_bias` — koordinat yang sama persis dengan analisis statis di sini.

Tidak ada emulator yang perlu dijalankan manual. Tidak ada risiko proses menggantung.

## Yang dijalankan

```
python C:\Projects\DOS-Decompiler\tools\comrun.py <GAME>.EXE \
    --exec-map trace/<game>.map \
    --keys "1,A,L,0x1C0D,Y,X,N,..." \
    --poll-patience 3 --budget 60000000
```

Umpan tombol dipilih untuk menjawab pertanyaan pembuka tiap program — 3DTTT menanyakan
jumlah pemain, nama, `X`/`O`, dan mode kursor; tanpa jawaban ia berputar di `INT 16h`
dan jejaknya berhenti di 1.695 alamat.

| | alamat dieksekusi | di region kode |
|---|---|---|
| 3DTTT | 3.974 | 1.811 |
| HOPPER | 2.801 | 341 |
| PAC-GAL | 1.095 | 45 |

Ketiganya berhenti karena budget instruksi habis, bukan karena selesai — jadi angka ini
**lantai, bukan plafon**. Umpan tombol yang lebih panjang akan menaikkannya.

Jejak juga mengonfirmasi temuan statis: 3DTTT dan PAC-GAL meminta **`INT 03h`**
(jebakan event, lihat [`EVENT-TRAPS.md`](EVENT-TRAPS.md)), HOPPER tidak.

## Hasil: jejak sebagai benih walk statis

Alamat yang dieksekusi dipakai sebagai titik masuk baru untuk penelusuran statis, lalu
diiterasi sampai berhenti tumbuh:

| | statis saja | + jejak dinamis | ronde sampai konvergen |
|---|---|---|---|
| 3DTTT | 44% | **56%** | 3 |
| PAC-GAL | 27% | **46%** | 3 |
| HOPPER | 47% | **53%** | 2 |

3DTTT sendiri mendapat **1.087 alamat yang analisis statis tidak pernah jangkau**, dalam
22 rentang — yang terbesar 1.489 byte utuh.

## Sisa region: bukan semuanya kode yang hilang

Pelajaran dari `knowledge/11-unreached-code.md`: *"An unexplained percentage is a
question, not a measurement."* Sisa region diperiksa isinya:

| | sisa | byte printable | tafsir |
|---|---|---|---|
| 3DTTT | 11.542 B | 3.127 (27%) | sebagian besar teks/tabel di antara rutin |
| PAC-GAL | 6.655 B | 1.223 (18%) | |
| HOPPER | 3.680 B | 1.410 (38%) | |

Region kode ditentukan dengan memangkas blok data besar dari **ujung** berkas, jadi data
yang duduk di antara rutin tetap terhitung di dalamnya dan menekan persentase. Jadi
"56%" **bukan** berarti "44% kode gagal ditemukan".

## Perkakas

`tools/seeded.py` — walk statis disemai jejak, iterasi sampai konvergen, dan melaporkan
komposisi sisanya. Keluaran `coverage-seeded.json`.

Jejak mentah ada di `trace/*.map` (satu offset heksadesimal per baris).

## PAC-GAL: batas emulator, bukan batas umpan tombol

Iterasi lanjutan dengan budget 400 juta dan 251 tombol menghasilkan program yang
**berakhir bersih** (`stopped: int 0x20`) — bukan lagi budget habis. Tapi hasilnya
justru lebih buruk, dan sebabnya bukan input:

| percobaan | tombol | instruksi | berhenti karena | alamat kode |
|---|---|---|---|---|
| awal | 14 | 40.000.000 | budget habis | 45 |
| dalam | 251 | 88.834 | `int 0x20` | 73 |
| default | 1.002 | 87.093 | `int 0x20` | 59 |

Percobaan ketiga hanya membaca **satu** tombol lalu keluar — jadi umpan tombol tidak
relevan. Program membatalkan sendiri.

Alamat yang dieksekusi memperlihatkan bentuknya:

```
26 .. 241        startup + loop penggambaran labirin
12212 .. 12287   kode keluar di ujung region
```

Tidak ada apa pun di antaranya. Ia tidak mencapai pesan penutupnya sendiri
(`'...Hope you had a good time'` di offset 11902), apalagi loop permainan.

Kode di 161–241 terbaca sebagai loop bersarang penggambaran:

```asm
221  cmp  word ptr [0x9c6], 0x19   ; pencacah dalam sampai 25
226  jle  213                       ; ulangi
229  mov  ax, [0x9c4]
232  dec  ax                        ; pencacah luar turun
236  cmp  word ptr [0x9c4], 1
241  jge  161                       ; ulangi
```

**Tafsiran:** PAC-GAL menulis ke port `0x21` (mask PIC), `0x40`/`0x42`/`0x43` (PIT) dan
`0x61` — ia menyiapkan perangkat keras sungguhan. `comrun.py` menyatakan dirinya
mengemulasi *"enough DOS and BIOS to get a game to its first screen, and no more"*, dan
tidak mengemulasi timer. Dugaan paling masuk akal: program menunggu kondisi perangkat
keras yang tidak disediakan, lalu mengambil jalur keluar.

Ini **belum dibuktikan** — saya belum menelusuri instruksi mana yang memicu lompatan ke
12212. Yang pasti: menaikkan budget dan memperpanjang umpan tombol tidak menolong, jadi
penyebabnya bukan salah satu dari keduanya.

## Kalau ingin menaikkan lagi

Ketiga jejak berhenti karena budget. Yang paling berdampak:

1. **Umpan tombol lebih panjang** — lewati lebih banyak fitur. Untuk 3DTTT: F1 bantuan,
   F2 simpan, F3 muat, F4 game baru, beberapa langkah permainan, F10 keluar.
2. **`--budget` lebih besar** — ketiganya masih berputar saat dihentikan.
3. **`--call`** untuk memanggil rutin tertentu langsung, melewati jalur yang sulit dicapai.
