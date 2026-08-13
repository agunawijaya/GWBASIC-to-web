# Sisa region kode dan berkas data di sebelahnya

Iterasi loop #10.

## 1 · Berkas skor: `HOPPER.SCO` dan `BS.SCO`

Keduanya 128 byte, teks biasa yang ditulis lewat `PRINT #`.

`HOPPER.SCO`:

```
 14190 
dik
 13550 
dik
 13470 

 640 
dik
 280 

 180 
dik
 0 

```

Formatnya: skor, `CRLF`, nama, `CRLF` — sepuluh entri. Nama kosong = baris kosong.

**Spasi sebelum dan sesudah tiap angka bukan kebetulan.** Itu persis perilaku `PRINT`
angka di BASIC: satu spasi di posisi tanda, satu spasi pemisah setelahnya. Di
[`OPERAND-STUBS.md`](OPERAND-STUBS.md) saya menyimpulkan mesin `PRINT` dari cabang
`AL=2` yang memancarkan `mov al, 0x20` — **berkas ini mengonfirmasinya dari luar
biner**, tanpa disassembly sama sekali.

Itu jenis bukti yang sepenuhnya independen, dan kebetulan memperkuat kesimpulan yang
sudah ada.

Nama pemainnya `dik`, tertulis di berkas bertanggal 1991.

`BS.SCO` (SPACEWAR) memakai format sama tapi seluruh skornya nol — belum pernah terisi,
atau sudah direset. Diakhiri `0x1A` (Ctrl-Z), penanda akhir berkas DOS.

*Catatan yang belum terjelaskan:* SPACEWAR adalah assembly murni, tapi `BS.SCO` memakai
format angka bergaya `PRINT` BASIC (spasi depan-belakang). Entah SPACEWAR meniru format
itu dengan sengaja, entah berkasnya pernah ditulis program lain. Belum ditelusuri.

## 2 · Sisa PAC-GAL yang terbaca sebagai kode: AI hantu

`classify.py` menandai 108 byte dalam 3 rentang sebagai "terbaca sebagai kode tapi tak
terjangkau". Yang terbesar, 85 byte di **10538–10623**, memang kode — dan isinya
logika permainan:

```asm
10539  mov  di, [0x9CE]            ; indeks (hantu ke berapa)
10543  shl  di, 1                  ; x2 untuk array word
10545  cmp  word ptr [di+0x994], 0 ; tabel status per-hantu di 0x994
10550  je   ...

10556  mov  di, [0x9CE]
10562  mov  bx, [di+0x964]         ; tabel kedua per-hantu di 0x964
10566  cmp  bx, [0x966]
10570  jne  ...

10576  mov  bx, [0x966]            ; posisi target
10580  sub  bx, [0x9CA]            ; selisih terhadap posisi hantu
10584  and  bx, bx
10586  je   selesai                ; sudah sama -> diam
10588  mov  bx, 1
10591  jge  simpan
10593  neg  bx                     ; bx = TANDA selisih: +1 atau -1
10595  add  bx, [0x9CA]
10600  mov  [0x9CA], ax            ; melangkah SATU petak menuju target
```

> [!NOTE]
> **Ditambahkan 10 Agustus 2026.** Blok tak-terjangkau ini kini punya pasangan.
> Di `pac-gal-run.bas`, pengejaran hantu dijaga satu variabel — `I12%`, dibandingkan
> dengan `RND(2)` tiap langkah — yang **dimulai dari 0 dan tidak pernah diisi apa
> pun**; satu-satunya operasi padanya cuma dibagi dua dan dikali dua. Jadi hantunya
> tidak pernah mengejar; mereka berjalan lurus dan memantul.
>
> **Kode kejar yang tak terjangkau, dan saklar kejar yang tak pernah menyala.**
> Bukan bukti, tapi dua petunjuk ke arah yang sama dari dua jalur terpisah. Lihat
> [`PAC-GAL/ARCHITECTURE.md`](PAC-GAL/ARCHITECTURE.md) §4b.

**Itu AI kejar.** Hitung selisih posisi, ambil tandanya, melangkah satu petak. Persis
logika hantu mengejar Pac-Man, dan dua tabel per-hantu (`0x964`, `0x994`) diindeks oleh
`[0x9CE]` yang menyimpan hantu mana yang sedang diproses.

### Kenapa tak terjangkau: lima hipotesis, semuanya gagal

| hipotesis | hasil |
|---|---|
| percabangan langsung ke 10538 | tidak ada |
| fall-through dari kode sebelumnya | tidak — `jmp` di 10535 melompat ke 10798, **melewati** blok ini |
| tabel lompat `ON ... GOSUB` | PAC-GAL tidak punya satu pun (3DTTT punya; lihat README §6) |
| word inline sesudah panggilan | tidak ada, empat varian tata letak diuji |
| alamat tersimpan sebagai data | **10538 dan 10539 tidak pernah muncul sebagai word di mana pun dalam berkas** |

Yang terakhir itu yang paling menentukan. Kalau alamatnya tidak ada di berkas sama
sekali, tidak ada mekanisme statis mana pun yang bisa melompat ke sana.

**Kesimpulan yang tersisa: ini kode mati** — blok yang dipancarkan compiler tapi tak
bisa dicapai. Di BASIC itu terjadi bila sebuah baris hanya bisa dicapai lewat `GOTO`
yang belakangan dihapus, atau cabang `IF` yang kondisinya konstan saat compile.

Ini **belum dibuktikan positif** — membuktikan sesuatu tak terjangkau menuntut
memeriksa seluruh jalur, dan itu tidak saya lakukan. Tapi lima jalur masuk yang mungkin
sudah ditutup satu per satu.

*Ironinya: rutin AI hantunya sendiri utuh dan berfungsi. Kalau ini memang kode mati,
Pac-Gal mengandung logika kejar yang lengkap tapi tak pernah dijalankan.*

**Ini membalik tafsiran "sisa".** Untuk PAC-GAL, 85 dari 195 byte sisa bukan padding
atau tabel, melainkan rutin permainan yang utuh.

## 3 · Sisa 3DTTT: pernyataan biasa yang tak tersambung

105 byte dalam 12 rentang, terbesar 14 byte. Semuanya sudah dibaca, dan **tidak ada yang
eksotis** — setiap rentang adalah pernyataan BASIC biasa:

```
 7864..7876   int3 | mov di, 0x60E8 | mov si, 0x5EE6 | lcall 0x1ACC
19382..19394  int3 | mov bx, 0x6460 | mov dx, 0x5F9A | lcall 0x0BC8
22040..22049  int3 | mov bx, 0x0F   | lcall 0x081C
```

`int3` (batas pernyataan) diikuti setup argumen dan satu `lcall` — bentuk yang sama
persis dengan 1.205 pernyataan lain di program ini.

Dua pengamatan:

**Lima lengan identik berjarak 45 byte — dan cara masuknya belum ditemukan.**

Di 22050, 22094, 22139, 22184, 22229 ada **lima blok identik**, masing-masing 45 byte:

```asm
int3
mov  si, 0x604A        ; variabel yang sama di kelima lengan
lcall 0x1BE5
lcall 0x0C63
mov  si, 0x6046        ; sama juga
lcall 0x1BE5
lcall 0x0C7D
int3
lcall PRINT_BEGIN
mov  bx, <BERBEDA>     ; 0x6156, 0x62F6, 0x62FC, 0x6302, 0x6308
lcall PRINT
int3
jmp  22270             ; kelimanya bergabung di titik yang SAMA
```

Yang berbeda hanya penunjuk string, dan empat terakhir berjarak 6 byte — elemen array
berurutan. Bentuknya persis tangga percabangan banyak-arah: pilih satu lengan, cetak
pesan yang sesuai, lalu gabung kembali.

**Lengan pertama (22050) terjangkau; empat sisanya tidak.** Empat hipotesis diuji untuk
menjelaskan cara masuknya, dan **semuanya gagal**:

| hipotesis | hasil |
|---|---|
| percabangan langsung ke alamat lengan | tidak ada satu pun |
| tabel lompat berisi alamat lengan | tidak ditemukan |
| lompatan terhitung (`jmp ax`) | seluruh region kode 3DTTT hanya punya **satu** lompatan tak-langsung, yaitu `lcall [6]` untuk inisialisasi runtime |
| konstanta stride 45 di kode | tidak ada |

Jadi strukturnya jelas tapi mekanisme masuknya tidak. Dua kemungkinan tersisa yang belum
diuji: dicapai lewat rutin runtime yang menerima target (seperti `GOSUB` menerima word
inline), atau memang **kode mati** — lengan `IF...THEN` yang dipancarkan compiler tapi
tak pernah dicapai.

**Yang terbesar berada setelah akhir rutin.** Rentang 26100–26114 dimulai `ret | retf`,
jadi ia duduk sesudah sebuah rutin berakhir.

**Kenapa tak terjangkau:** tak ada percabangan yang menunjuk ke sana, dan pernyataan
sebelumnya berakhir dengan transfer tak-bersyarat (`ret`, `retf`, `jmp`) sehingga tidak
ada jangkar `situs+5` yang jatuh di situ. Di BASIC aslinya ini baris-baris yang hanya
bisa dicapai lewat `GOTO` dari tempat yang belum tersambung — atau memang kode mati.

Berbeda tajam dari PAC-GAL, di mana 85 byte sisanya adalah rutin AI utuh.

## Yang bisa dibawa

Sisa region kode **tidak seragam**. Di PAC-GAL sebagian besarnya kode permainan sungguhan;
di 3DTTT potongan-potongan kecil. Melaporkannya sebagai satu angka persentase menutupi
perbedaan itu — yang persis peringatan `knowledge/11-unreached-code.md` di proyek
DOS-Decompiler.
