# SPACEWAR.EXE — arsitektur pemrograman

Rekonstruksi arsitektur dari biner. `(C) 1985 Bill Seiler`, 22.528 byte,
8086 assembly tulis tangan, target IBM PC dengan CGA.

Dasar analisis: 99% segmen kode terdisassembly, 107 subrutin, call graph penuh.
Yang **belum** dipastikan ditandai eksplisit di bagian terakhir.

---

## 1 · Klasifikasi

Program assembly murni, bukan hasil compiler.

| Indikator | Nilai | Artinya |
|---|---|---|
| entri relokasi | 5 | hampir tak ada referensi antar-segmen — model memori tunggal |
| panggilan interupsi | 4 total | nyaris semua akses perangkat keras langsung |
| pustaka runtime | tidak ada | tak ada startup code compiler, tak ada tabel error |
| subrutin | 107 | dekomposisi manual, bukan hasil ekspansi pustaka |

Empat `INT` di seluruh program adalah angka yang luar biasa rendah. Sebagai
pembanding, tiga EXE BASIC di koleksi ini masing-masing menautkan runtime 20–30 KB.

---

## 2 · Peta memori

```
segmen  offset             isi
────────────────────────────────────────────────────────────────
        0 ..    95         string pesan ($-terminated)
      369 ..   908         blok 539 byte  (aset layar/judul)
     2480 ..  3105         empat blok kecil (tabel status/parameter)
     4640 ..  6202         blok 1.562 byte (aset grafis besar)
     6240 ..  8230         TABEL SPRITE — 16 entri, stride 128 byte
     8274 ..  8848         blok 574 byte
    10928 .. 22016         SEGMEN KODE (11.088 byte)
────────────────────────────────────────────────────────────────
    6.029 byte tak-nol dari 10.928 byte segmen data (55%)
```

Data mendahului kode — tata letak MASM biasa. Sisanya (45% nol) adalah buffer
kerja yang diisi saat runtime.

**Stack tidak punya segmen sendiri.** Header EXE mendeklarasikan `SS:SP = 0000:0000`,
dan program memindahkan stack ke `0000:0166` saat startup — **ke dalam tabel vektor
interupsi**, memakai slot vektor tak terpakai (0x59 ke bawah) sebagai RAM.

---

## 3 · Fase program

### 3.1 Startup dan deteksi perangkat keras

```
start (10928)
 ├─ simpan segmen PSP ke cs:[0xBA]        ; untuk jalan keluar nanti
 ├─ DS := 0                                ; akses langsung tabel vektor + BIOS data
 ├─ INT 10h AH=0F → simpan mode video lama ke [0x5F]
 ├─ out 3BFh, 0                            ; matikan konfigurasi Hercules
 ├─ ES := B800h
 ├─ uji tulis/baca ES:[0000/1000/2000/3000]   ← DETEKSI KARTU GRAFIS
 │    gagal → loc_2B56
 ├─ ES := 0040h ; and es:[0x3F], 0xF0      ; nolkan status motor floppy BIOS
 ├─ out 3F2h, 0Ch                          ; matikan motor floppy
 ├─ cli
 ├─ simpan SS→[0x64], SP→[0x62]
 └─ SS:SP := 0000:0166                     ; stack pindah ke tabel vektor
```

Deteksi kartu grafis itulah yang menghasilkan penolakan terkenal program ini.
Ia menulis nilai `DI` ke empat alamat berjarak 4 KB di dalam VRAM CGA lalu
membacanya kembali. Kalau memori tidak berperilaku seperti 16 KB VRAM, keluar.

### 3.2 Jalan keluar gagal

```asm
loc_2B56:
    push bx                  ; bx = offset pesan
    xor  ah, ah
    mov  al, [0x5F]          ; mode video yang tadi disimpan
    int  10h                 ; pulihkan mode
    mov  ah, 9
    int  21h                 ; cetak pesan
    ljmp cs:[0xB8]           ; lompat ke PSP:0000 = terminate
```

Pesannya: `SORRY !  You need a 640 X 200 Color Graphics card to run SPACEWAR !$`
lalu `May the farce be with you.$`.

### 3.3 Mode grafis

```asm
sub_4A0C:
    mov ax, 6
    int 10h                  ; mode 6 = CGA 640×200, 2 warna
    ret
```

Ketiga `INT 10h` dalam program: ambil mode, pulihkan mode, set mode 6. Selebihnya
tulis langsung ke `B800`.

---

## 4 · Dekomposisi modul

`sub_33AF` adalah **loop utama** — hub yang memanggil seluruh subsistem:

```
sub_33AF  (loop utama, 48 instruksi)
 │
 ├── RENDER
 │   ├─ sub_3582  526 ins  ← akses VRAM langsung   [terbesar dalam program]
 │   ├─ sub_3999  488 ins
 │   └─ sub_3D68  424 ins
 │
 ├── DISPATCH AKSI
 │   └─ sub_404A  175 ins
 │       ├─ sub_4183   8 ins ┐
 │       ├─ sub_4195   8 ins │ lima handler berukuran identik
 │       ├─ sub_41A7   8 ins │ → tabel dispatch
 │       ├─ sub_41B9   8 ins │
 │       └─ sub_41CB   8 ins ┘
 │
 ├── GEOMETRI / STATE
 │   ├─ sub_343E  60 ins → sub_4646, sub_464F, sub_4732, sub_4744
 │   ├─ sub_34F3  21 ins → sub_3529, sub_3537, sub_53A2
 │   └─ sub_34CC  14 ins → sub_4767
 │
 └── SUARA
     ├─ sub_5364   6 ins  (port 61h)
     └─ sub_53E2   9 ins  → sub_45AC, sub_5380, sub_5391
```

Tiga rutin render (526 + 488 + 424 = 1.438 instruksi) menyerap **hampir sepertiga
seluruh kode program**. Itu proporsi yang khas untuk game aksi era CGA: penggambaran
adalah biaya dominan, dan dioptimalkan dengan tangan.

> [!WARNING]
> **Dicabut 10 Agustus 2026.** Bagian ini semula berbunyi: *"Lima handler berukuran
> persis 8 instruksi di bawah `sub_404A` adalah pola tabel dispatch — sesuai lima
> aksi yang didokumentasikan dalam teks bantuan program."*
>
> Kelimanya **bukan handler aksi**, dan "8 instruksi" itu **data**: tujuh bita
> `0x0C` plus penanda nol, string sebaris untuk `sub_4732`. Kelimanya menggambar
> kotak menu di X = 200, 290, 380, 470, 560 pada Y = 192. Lihat §5b dan §9.3.
>
> Kecocokan "5 handler untuk 5 aksi" itu kebetulan — dan kebetulan yang mahal,
> karena ia terdengar terlalu masuk akal untuk diperiksa.

### Primitif terpanas

| rutin | pemanggil | ukuran | ciri |
|---|---|---|---|
| `sub_4732` | **37** | 9 ins | **cetak string sebaris** — baca alamat kembali sendiri, lihat §5b |
| `sub_53A2` | 8 | 14 ins | 1 loop |
| `sub_4671` | 5 | 14 ins | 1 loop |
| `sub_3529` | 3 | 7 ins | 2 loop |
| `sub_5380` / `sub_5391` | 3 | 7 ins | 2 loop — sepasang, jalur kembar |

`sub_4732` dipanggil dari 10 tempat termasuk ketiga rutin render besar. Ukurannya
9 instruksi dengan satu loop — kandidat kuat untuk primitif gambar/clip per-elemen.

---

## 5 · Struktur data: tabel sprite

```
@6240  ┐                                   <-- SALAH, lihat peringatan di bawah
@6368  │
@6496  │  16 entri                          (ini benar)
  ...  │  stride TEPAT 128 byte             (ini benar)
@8032  │  64 byte terpakai per entri        <-- SALAH: seluruh 128 terpakai
@8160  ┘
```

Kotak di atas dibiarkan apa adanya sebagai catatan sejarah. Angka yang benar:
basis **`@6208`** (`0x1840`), 16 entri, strid 128, **128 byte terpakai per entri**
= 32 x 32 piksel. Sumbernya rutin penggambarnya sendiri, bukan pengamatan atas
datanya — lihat peringatan berikut.

> [!WARNING]
> **Koreksi manual, ditambahkan saat porting web (10 Agustus 2026).**
>
> Bagian ini semula berbunyi: *"Enam belas entri berjarak sama adalah tanda kuat
> tabel rotasi 16 sudut — kapal di Spacewar berputar, dan 16 arah adalah pembagian
> standar era itu (22,5° per langkah)."*
>
> **Kalimat itu dicabut.** Ia ditarik dari tata letaknya saja, tanpa pernah
> memeriksa isinya. Begitu isinya diukur:
>
> | | |
> |---|--:|
> | Strid 128 bita — autokorelasi bit | **0,932** (puncak kedua: lag 8) |
> | Bita pembuka entri 4–15 | **identik satu sama lain** |
> | Piksel menyala, entri 4–15 | 212–223 |
> | Piksel menyala, entri 0–3 | 48–95 |
> | Entri 4 pada 4 bita/baris | simetris kiri-kanan **dan** atas-bawah |
>
> **KOREKSI ATAS KOREKSI, beberapa jam kemudian.** Peringatan di atas ditulis dari
> pengukuran atas **bita yang salah**, dan sekarang dicabut. Dua kesalahan
> menumpuk: `.asm` memakai offset citra sedangkan `.EXE` punya header 512 bita di
> depannya, dan basisnya juga bukan `0x1860`.
>
> Formatnya kini **terpecahkan**, dan bukan dengan mengukur datanya melainkan
> dengan menemukan **rutin yang membacanya**: `sub_4792` di offset citra 18322.
>
> ```asm
> 18326  and  ax, 0xf        ; 16 entri
> 18333  shl  si, 7          ; strid 128
> 18335  add  si, 0x1840     ; BASIS 0x1840, bukan 0x1860
> 18361  mov  cx, 0x20       ; 32 baris
> 18374  lodsw / xchg al,ah  ; tiap pasangan bita DITUKAR
> 18377  mov  es:[di], ax    ; dua kali -> 4 bita/baris
> 18388  add  di, 0x1ffe     ; bank mode 6 berselang-seling
> ```
>
> Jadi tiap entri **32 × 32 piksel** dan **seluruh 128 bita terpakai** — angka
> "64 bita terpakai" di kotak atas juga keliru. Didekode begitu, isinya sebuah
> **lingkaran 32 × 32** dengan satu tanda kecil yang berpindah dari entri ke
> entri: enam belas bingkai benda bundar yang berputar.
>
> **Klaim asli lebih benar daripada koreksi saya.** Ia memang tabel rotasi 16
> langkah. Yang salah cuma *apa* yang berputar — bukan kapal, melainkan benda
> bundar, hampir pasti PLANET yang disebut teks bantuannya sendiri.
>
> Dekodernya: [`../tools/spritedec.py`](../tools/spritedec.py). Riwayat lengkap
> kedua salah baca: [`../NEGATIVE-RESULTS.md`](../NEGATIVE-RESULTS.md) §22.
>
> **Masih terbuka:** di mana sprite kapalnya. `sub_4792` bukan satu-satunya
> penyalin; basis lain yang dimuat di dekatnya — `0x12c0`, `0x1340`, `0x1540`,
> `0x1740`, `0x17c0`, `0x22a0` — tinggal ditelusuri dengan cara yang sama.

Blok `@4640..6202` (1.562 byte) terlalu besar untuk satu sprite; kemungkinan
medan bintang atau planet — objek yang disebut teks bantuan
(`Touching the PLANET will drain your SHIELDS`).

---

## 5b · Mesin teks: string ditulis di dalam aliran kode

Dua rutin, dan keduanya menjelaskan banyak hal yang sebelumnya tampak aneh.

### `sub_4732` — cetak string sebaris (37 situs panggilan)

```asm
18226  jmp   18232
loc_4735:
18229  call  sub_46DD          ; gambar satu glif, kodenya di BL
18232  pop   bp                ; ALAMAT KEMBALI diambil dari tumpukan
18233  mov   bl, cs:[bp]       ; bita di sana = karakter berikutnya
18237  inc   bp
18238  push  bp                ; dorong balik alamat yang sudah maju
18239  and   bl, bl
18241  jne   loc_4735          ; sampai penanda nol
18243  ret                     ; kembali ke titik SESUDAH string
```

Stringnya ditulis **langsung sesudah `call`-nya, di dalam aliran kode**, dan
rutinnya mengembalikan kendali ke titik sesudah penanda nol. Trik ini hemat: tidak
perlu register untuk pointer, dan stringnya duduk persis di tempat ia dipakai.

Yang benar-benar ada di sana, dibaca dari berkasnya:

```
13383  "V1.50"
13398  "COPYRIGHT  © 1985  B SEILER."
13742  "   G A M E    K E Y S  "
13810  "LEFT PLAYER KEYS"
13856  "RIGHT PLAYER KEYS"
14099  "\x15PHASERS\x15 CLOAK \x15PHOTONS\x15..."
```

### `sub_46DD` — gambar satu glif

```asm
18141  cmp bl, 0x0d   -> AX = 10        kembali ke kolom awal
18152  cmp bl, 0x0a   -> DX += 8        turun satu baris
18163  cmp bl, 0x1f   -> AX += 5        spasi SETENGAH
18174  cmp bl, 0x20   -> cuma maju      spasi
18181  mov bp, 0x22a0                   basis font
18184  and bx, 0x7f                     diindeks ASCII 7 bit
18190  shl bx, 4                        strid 16 bita
18196  call sub_45CA                    ch = 8 baris
18201  add ax, 0xa                      maju 10 piksel
```

Jadi programnya membawa **fontnya sendiri**: 16 bita per glif, 8 baris, 16 piksel
lebar, maju 10 piksel — huruf-hurufnya saling menumpuk enam piksel. Kode di bawah
`0x20` dipakai sebagai glif bingkai kotak (`0x08`, `0x0B`, `0x0C`, `0x15`, `0x19`,
`0x1B`–`0x1E`).

Ini juga menjelaskan kenapa ia tidak butuh BIOS untuk teks: di mode 6 tidak ada
mode teks sama sekali, jadi setiap huruf harus digambar sendiri.

Fontnya dipanen dan dipakai untuk menulis judul di
[halaman port-nya](../../web/games/spacewar/index.html).

### Akibatnya bagi angka cakupan

`sub_4732` membuat **data dan kode berselang-seling di segmen yang sama**. Penelusur
rekursif tidak tahu itu, jadi ia membongkar stringnya sebagai instruksi — dan
menghitungnya sebagai kode yang tercakup.

Itulah asal deretan yang tampak aneh di disassembly:

| yang terbaca | sebenarnya |
|---|---|
| `adc ax, 0x2020` berulang | spasi di `"   G A M E    K E Y S  "` |
| `sbb ax, 0x1d1d` berulang | glif bingkai `0x1D` berderet |
| lima "handler 8 instruksi" | `db 0x0c ×7, 0x00` — lihat §9.3 |

Jadi **angka cakupan region kode 99% terlalu tinggi**, dan sekarang terukur berapa:

| | |
|---|--:|
| Segmen kode | 11.088 bita |
| Total bita string sebaris (37 buah) | **2.808** |
| Data yang sudah diakui `.asm` | 93 |
| **Bukan instruksi** | **2.901 = 26,2% segmen** |

Yang **tidak** bisa disimpulkan dari situ: berapa persen instruksi sebenarnya yang
berhasil dipulihkan. Untuk itu perlu pembongkaran ulang yang tahu batas tiap
string, dan tabel di §5b sudah memberi batas-batas itu.

---

## 5c · Bilah menu, dan apa yang dikendalikannya

Teks menunya satu string sebaris, dicetak dari **X = 0, Y = 192**:

```
  \x1f EXIT \x1f  \x1f PLAY \x1f  \x1fROBOT\x1fL  \x1fROBOT\x1fR  \x1fPLANET\x1f  GRAVITY   PAUSE
```

Dengan langkah maju 10 piksel per huruf dan 5 piksel untuk `\x1f`, posisi tiap
label bisa dihitung — dan kelima kotak yang digambar `sub_4183`…`sub_41CB` jatuh
**persis** di lima label yang bisa di-*toggle*:

| kotak | rutin | X | label di posisi itu | bit keadaan |
|---|---|--:|---|---|
| 1 | `sub_4183` | 200 | `ROBOT` `L` | `[0x1076]` bit 0 |
| 2 | `sub_4195` | 290 | `ROBOT` `R` | `[0x1076]` bit 1 |
| 3 | `sub_41A7` | 380 | **`PLANET`** | `[0x2040]` bit 0 |
| 4 | `sub_41B9` | 470 | **`GRAVITY`** | `[0x2040]` bit 1 |
| 5 | `sub_41CB` | 560 | `PAUSE` | `[0x170]` bit 0 |

`EXIT` (X = 25) dan `PLAY` (X = 115) **tidak berkotak** — keduanya perintah, bukan
saklar. Itu sebabnya kotaknya lima, bukan tujuh.

Tiap penangan mengerjakan dua hal: menggambar ulang kotaknya (XOR, jadi
menyala/padam) lalu membalik bitnya:

```asm
17047  call sub_41A7            ; kotak PLANET
17050  xor  byte [0x2040], 1
17082  call sub_41B9            ; kotak GRAVITY
17085  xor  byte [0x2040], 2
```

### Dan ini yang memastikan tabel `0x1840`

`[0x2040]` bit 0 — bit yang dibalik kotak **`PLANET`** — adalah gerbang yang
memutuskan apakah benda bundar 32 × 32 itu digambar:

```asm
21048  test byte [0x2040], 1     ; saklar PLANET
21053  je   ...                  ; kalau padam, lewati
21055  inc  byte [0x2041]        ; bingkai animasi berikutnya
21062  mov  bx, 0x13f            ; X = 319
21065  mov  dx, 0x63             ; Y = 99   -> TITIK TENGAH LAYAR
21068  call sub_4792
```

Tiga hal berhimpit dan tidak ada bacaan lain yang muat: digambar **tepat di titik
tengah layar**, digerbangi **saklar yang berlabel `PLANET`**, dan **berputar** 16
bingkai. Tabel `0x1840` adalah **planetnya**, dan itu bukan lagi dugaan.

Situs gambar kedua di (592, 24) — sudut kanan atas, di dalam ISR yang juga menjaga
pencacah jam BIOS di `40:6C` — memakai tabel dan pencacah bingkai yang sama tapi
gerbangnya berbeda. Perannya belum dipastikan.

---

## 5d · Startup, kedua interupsi, dan jam yang dipercepat empat kali

Urutan startup-nya terbaca utuh sekarang, dan ia menutup beberapa pertanyaan lama
sekaligus.

### Kelima relokasi itu satu instruksi yang sama

| relok | CS-rel | menambal |
|---|---|---|
| 0 | `0x0007` | `mov ax, <segmen>` → `mov ds, ax` |
| 1 | `0x0060` | `mov ax, <segmen>` → `mov ss, ax` |
| 2 | `0x173B` | idem, di dalam ISR pencacah A |
| 3 | `0x1F85` | idem, di dalam handler papan ketik |
| 4 | `0x2347` | idem, di dalam ISR pencacah B |

Kelimanya memuat **segmen programnya sendiri**. Sebuah program satu segmen yang
ditulis tangan cuma perlu tahu segmennya di lima tempat: dua saat startup, tiga di
awal tiap handler interupsi — karena interupsi bisa datang dengan `DS` apa pun.

Itu penjelasan lengkap angka "5 relokasi" yang selama ini cuma dipakai sebagai
pembeda dari BASIC ter-compile.

> Satu jebakan baca yang menyertainya: di disassembly, kelimanya muncul sebagai
> `mov ax, 0`. Angkanya **0 di berkas** dan baru diisi pemuat DOS. Jadi `mov ds, ax`
> sesudahnya bukan berarti DS = 0.

### `sub_496C` — simpan vektor lama

```asm
18796  mov ax, 0 | mov es, ax        ; ES = 0, tabel vektor (ini 0 yang SUNGGUHAN)
18801  mov si, 0x20                  ; INT 8  — pencacah waktu
18804  mov ax, es:[si]   -> [0x1072]
18810  mov ax, es:[si+2] -> [0x1074]
18817  mov si, 0x24                  ; INT 9  — papan ketik
18820  mov ax, es:[si]   -> [0x106e]
```

Pola simpan-lalu-pasang yang biasa. Program mengambil alih **dua** interupsi.

### `sub_4950` — tabel alamat baris pindai

```asm
18772  mov cx, 0x64        ; 100 baris
18777  mov di, 0x1085      ; tabel tujuan
18782  stosw ; add ax, 0x2000 ; dua kali -> bank genap lalu ganjil
18790  sub ax, 0x3fb0      ; balik ke bank genap, maju 80 bita
```

Inilah tabel `[0x1085]` yang dipakai **kedua** penyalin sprite (`sub_45CA` dan
`sub_4792`) untuk mengubah Y jadi alamat. Aritmetika selang-seling mode 6 dihitung
**sekali di startup**, bukan tiap kali menggambar.

### Handler papan ketik — CS-rel `0x1F80`

```asm
19001  in  al, 0x60          ; baca port papan ketik mentah
19003  mov di, ax
19005  and di, 0x7f          ; buang bit break
19009  mov [di + 0x1232], al ; simpan keadaan tombol, diindeks kode pindai
```

Tabel `[0x1232]` itu yang membuat permainan dua pemain di satu papan ketik mungkin:
tiap tombol punya slotnya sendiri, dan isinya memberitahu apakah ia **sedang
ditahan** — hal yang `INT 16h` tidak bisa jawab.

### Jam dipercepat empat kali, dan jam DOS tetap benar

```asm
11034  mov al, 0x36 | out 0x43, al   ; PIT kanal 0, mode 3
11038  out 0x40, 6                   ; pembagi rendah
11044  out 0x40, 0x40                ; pembagi tinggi -> 0x4006 = 16.390
```

1.193.182 / 16.390 = **72,80 Hz** — tepat **empat kali** laju BIOS 18,2 Hz. Lalu di
dalam ISR-nya:

```asm
inc  byte [0x1080]
test byte [0x1080], 3         ; tiap tik KEEMPAT saja...
jne  lewati
inc  word es:[0x6c]           ; ...barulah pencacah jam BIOS dinaikkan
```

Jadi program dapat waktu empat kali lebih halus untuk dirinya sendiri **sementara
jam DOS tetap berjalan pada laju yang benar** — termasuk penanganan pergantian
tengah malam di `40:6C`/`40:6E`/`40:70`. Program yang mengambil alih INT 8 dan
tidak melakukan ini akan membuat jam sistem melenceng.

### Dua ISR pencacah, dan situs gambar planet kedua

Ada **dua** handler INT 8 yang hampir kembar, di CS-rel `0x172D` dan `0x233D`.
Bedanya cuma pada apa yang digambar:

| | ISR A (`0x172D`) | ISR B (`0x233D`) |
|---|---|---|
| pencacah jam BIOS | ya | ya |
| saklar `PAUSE` (`[0x170]`) | tidak diperiksa | diperiksa |
| saklar `PLANET` (`[0x2040]`.0) | tidak diperiksa | diperiksa |
| gambar benda bundar di | (592, 24) sudut kanan atas | (319, 99) titik tengah |

Bacaan yang paling wajar: **A untuk layar menu, B untuk layar permainan**, dan
vektornya ditukar saat masuk-keluar permainan. Itu **simpulan**, bukan kutipan —
penulisan yang menukar vektornya belum ditemukan. Yang pasti: kedua ISR itu ada,
dan hanya B yang menghormati kedua saklar.

---

## 6 · Rendering

Mode 6 CGA: 640×200, 1 bit per piksel, 16 KB VRAM di `B800`, dengan baris genap
dan ganjil di dua bank terpisah berjarak 8 KB.

Hanya `sub_3582` yang menyentuh `B800` secara langsung di antara subrutin besar.
Dua rutin besar lainnya (`sub_3999`, `sub_3D68`) tidak — keduanya kemungkinan
menyiapkan buffer atau menghitung geometri, lalu `sub_3582` yang menuliskannya.

Tidak ditemukan sinkronisasi retrace (`port 3DAh` tidak muncul sama sekali dalam
daftar port yang dipakai). Program menulis VRAM tanpa menunggu vertical blank —
pilihan yang menukar kemungkinan robek layar dengan kecepatan.

---

## 7 · Input

```asm
    mov  ax, 0
    mov  ds, ax
    in   al, 0x60          ; scancode mentah dari kontroler papan ketik
    mov  di, ax
    and  di, 0x7f          ; buang bit break (bit 7)
```

Papan ketik dibaca **langsung dari port 60h**, melewati BIOS sepenuhnya. Ini
keputusan arsitektural, bukan optimasi gaya:

- BIOS `INT 16h` mengembalikan karakter dari buffer, satu per satu, dengan
  pengulangan otomatis. Itu tidak bisa memberitahu tombol mana yang **sedang
  ditahan**.
- Membaca port 60h dan melacak bit make/break memungkinkan mendeteksi **beberapa
  tombol ditekan bersamaan**.

Tanpa ini, permainan dua pemain di satu papan ketik mustahil. Semua permainan
dua-pemain-satu-keyboard era itu melakukan hal yang sama.

Port `201h` (game port / joystick) **tidak muncul** — program ini murni papan ketik.

---

## 8 · Suara

`sub_5270` (101 instruksi, port 42h/43h/61h) adalah mesin suaranya.

```
port 43h  → PIT control word
port 42h  → PIT kanal 2, pembagi frekuensi (nada)
port 61h  → PPI port B, bit 0-1 = gerbang speaker
```

Port 61h muncul **21 kali** di seluruh program — jauh lebih sering daripada port
lain. Itu menunjukkan speaker digerbang dan ditutup di banyak titik, bukan hanya
dari satu rutin terpusat: efek suara dipicu langsung dari tempat kejadiannya
(tembakan, tumbukan, peringatan perisai).

Teks bantuan menyebut `The WARNING sound indicates SHIELD power too low`.

---

## 9 · Yang belum dipastikan

Analisis ini statis. Yang berikut **belum dikonfirmasi** dan tidak boleh
diperlakukan sebagai fakta:

1. ~~**Tata letak piksel sprite.**~~ **TERPECAHKAN 10 Agustus 2026.** Enam tabel
   ketemu, dan parameternya dibaca dari kedua penyalinnya, bukan ditebak dari
   datanya:

   | tabel | basis | n | strid | ukuran | penyalin |
   |---|--:|--:|--:|---|---|
   | kapal pemain kiri | `0x1340` | 16 | 32 | 16 × 16 | `sub_45CA` |
   | kapal pemain kanan | `0x1540` | 16 | 32 | 16 × 16 | `sub_45CA` |
   | kecil, kiri | `0x1740` | 8 | 16 | 16 × 8 | `sub_45CA` |
   | kecil, kanan | `0x17C0` | 8 | 16 | 16 × 8 | `sub_45CA` |
   | font angka | `0x22A0` | 12 | 16 | 16 × 8 | `sub_45CA` |
   | bundar (planet?) | `0x1840` | 16 | 128 | 32 × 32 | `sub_4792` |

   `sub_45CA` menggambar dengan **XOR** dan **menggeser saat menggambar**
   (`and cl,7` lalu `shr ax,cl`) — jadi **tidak pernah ada varian *pre-shifted***
   di berkas ini; dugaan lama soal itu batal dengan sendirinya. Bendera per-pemain
   di `0xcbc`/`0xccc` yang di-`xor ...,1` adalah pembukuan gambar-lalu-hapus milik
   XOR.

   Keadaan pemain ikut terbaca dari pemanggilnya, strid `0x10` antar-pemain:
   **X di `0xd5c`, Y di `0xd7c`, sudut di `0xe7c`**.

   Sudut kapal dipetakan `add bl,8 | and bx,0xf0 | shl bx,1` — dibulatkan ke
   perenambelasan terdekat. **Jadi 16 sudut memang benar**, hanya saja buktinya
   ada di kode pemetaan sudutnya, bukan di jumlah entri tabel yang lain.

   Dekoder: [`../tools/spritedec.py`](../tools/spritedec.py). Kapal keenam belas
   sudutnya ditampilkan di
   [halaman port-nya](../../web/games/spacewar/index.html).

   Butir asli, dibiarkan sebagai catatan sejarah: Struktur tabelnya pasti (16 × stride 128, 64 byte
   terpakai). Tapi render percobaan pada 32×16 dan 16×32 tidak menghasilkan bentuk
   kapal yang terbaca. Formatnya kemungkinan pre-shifted atau memperhitungkan
   interleave scanline CGA — belum dipecahkan.
2. ~~**Peran persis tiga rutin render besar.**~~ **TERJAWAB 10 Agustus 2026 — dan
   premisnya yang salah: keduanya bukan rutin render, dan bukan "besar".**

   Ukuran keduanya nyaris seluruhnya **string sebaris** yang terbongkar jadi
   instruksi:

   | rutin | rentang | string sebaris | sisa instruksi sejati |
   |---|--:|--:|--:|
   | `sub_3582` | 1.047 bita | 18 buah, **844 bita (81%)** | ~203 bita |
   | `sub_3999` | 1.713 bita | 5 buah, **1.666 bita (97%)** | ~47 bita |

   `sub_3582` memanggil `sub_4732` **delapan belas kali**, dan rentangnya menutupi
   persis string layar `GAME KEYS` (`   G A M E    K E Y S  `,
   `LEFT PLAYER KEYS`, `RIGHT PLAYER KEYS`, `PHASERS`, `CLOAK`, …). Ia **penggambar
   layar bantuan tombol**, bukan renderer permainan.

   `sub_3999` menutupi blok `GAME INSTRUCTIONS` (814 bita) dan pemberitahuan
   `USER-SUPPORTED` (728 bita). Empat puluh tujuh bita instruksi sejati untuk
   mencetak 1,7 KB teks — persis yang diharapkan dari rutin yang cuma memanggil
   pencetak string beberapa kali.

   Jadi "tiga rutin render besar, sepertiga kode program" itu **artefak**. Yang
   sesungguhnya menggambar permainan adalah `sub_4350`/`sub_47DF` yang mengapit
   loop utama (§9.4), dan penyalin sprite `sub_45CA`/`sub_4792` (§5).

3. ~~**Pemetaan lima handler dispatch ke lima aksi**~~ **BATAL — pertanyaannya
   sendiri yang salah, 10 Agustus 2026.** Kelimanya bukan handler aksi, dan
   "berukuran tepat 8 instruksi" itu bukan kebetulan yang bermakna: **delapan
   instruksi itu data**.

   Isi kelimanya identik kecuali satu angka:

   ```asm
   mov  ax, 0xc8        ; lalu 0x122, 0x17c, 0x1d6, 0x230
   mov  dx, 0xc0        ; Y = 192 di kelimanya
   call sub_4732
   db   0x0c,0x0c,0x0c,0x0c,0x0c,0x0c,0x0c,0x00   <- inilah "8 instruksi" itu
   ret
   ```

   X-nya 200, 290, 380, 470, 560 — **berjarak tepat 90 piksel di Y = 192**, dasar
   layar. Itu **bilah menu**: lima kotak selebar tujuh glif, cocok dengan lima
   pilihan yang stringnya memang ada di biner (`EXIT`, `PLAY`, `ROBOT`, `ROBOT`,
   `PLANET`/`GRAVITY`/`PAUSE`).

   Sebabnya terbaca sebagai instruksi dijelaskan di §5b.

   Butir asli: *"Jumlahnya cocok (5 dan 5) dan ukurannya identik, tapi belum
   ditelusuri satu per satu."* Kecocokan 5-dan-5 itu **kebetulan**.
4. ~~**`sub_4350`, `sub_47DF`, `sub_5270` tidak punya pemanggil langsung.**~~
   **SALAH — dicabut 10 Agustus 2026.** Ketiganya punya pemanggil, masing-masing
   tepat satu:

   ```asm
   11365  call sub_4350
   11368  call sub_33AF     ; loop utama
   11371  call sub_47DF
   ...
   20522  call sub_5270     ; sesudah pencacah durasi bunyi diturunkan
   ```

   `sub_4350` dan `sub_47DF` **mengapit loop utama** — susunan yang wajar untuk
   program yang menggambar dengan XOR: hapus, hitung, gambar. `sub_5270` dipanggil
   dari penjadwal bunyi.

   Dugaan "handler interupsi lewat penulisan vektor manual" juga bisa disingkirkan:
   alamat ketiganya **tidak pernah dimuat sebagai nilai** di mana pun, jadi ia tidak
   pernah dipasang ke tabel vektor.

   Butir asli dibiarkan sebagai catatan sejarah. Kenapa ia sempat ditulis belum
   ditelusuri; yang jelas ketiga panggilan itu ada di berkas yang sama.
5. **Penamaan 107 subrutin masih generik.** Berkurang 10 Agustus 2026 — sepuluh
   bernama dari perilakunya, bukan dari tebakan:

   | rutin | perannya |
   |---|---|
   | `sub_4732` | cetak string sebaris, baca alamat kembali sendiri (§5b) |
   | `sub_46DD` | gambar satu glif dari font `0x22A0` (§5b) |
   | `sub_45CA` | penyalin sprite umum, XOR + geser saat gambar |
   | `sub_4792` | penyalin 32 × 32 tak-tergeser |
   | `sub_496C` | simpan vektor INT 8 dan INT 9 lama (§5d) |
   | `sub_4950` | bangun tabel 100 alamat baris pindai di `0x1085` (§5d) |
   | `sub_4350` | separuh pertama bingkai, sebelum loop utama (§9.4) |
   | `sub_47DF` | separuh kedua bingkai, sesudah loop utama (§9.4) |
   | `sub_5270` | mesin bunyi, dipanggil penjadwal durasi |
   | CS-rel `0x1F80` | handler INT 9, port 60h, tabel tombol `0x1232` (§5d) |

   Sisanya masih generik.

> [!NOTE]
> **Kalimat penutup lama dicabut, 10 Agustus 2026.** Ia berbunyi: *"Menyelesaikan
> (1) dan (4) butuh penelusuran dinamis. Sisanya bisa diselesaikan statis dengan
> pembacaan per-rutin."*
>
> Terbalik di kedua sisinya. **(1) dan (4) justru yang selesai secara statis** —
> dan keduanya selesai lewat cara yang sama, yang tidak dipakai selama 18 iterasi:
> berhenti menatap datanya, cari **rutin yang membacanya**.
>
> Yang tersisa di daftar ini — butir (2) — bukan soal statis atau dinamis melainkan
> soal belum dikerjakan. Satu-satunya yang benar-benar butuh menjalankan program
> adalah **menyetirnya masuk ke permainan**, dan itu bukan salah satu butir di sini.

**Cara yang berhasil, dicatat supaya bisa diulang.** Untuk tiap daerah data yang
tidak dikenali:

1. Cari instruksi yang memuat alamatnya sebagai *immediate* (`mov bp, 0x1340`).
2. Baca rutin yang memakainya — ia menyebutkan tinggi, strid, dan urutan bita
   secara harfiah.
3. Baca **pemanggil** rutin itu — ia menyebutkan dari keadaan mana indeksnya
   datang, dan sering sekaligus memberi nama benda itu.

Ketiga langkahnya murah. Enam percobaan pertama menebak dari bentuk datanya, dan
keenamnya gagal; langkah pertama saja menyelesaikannya.

---

## 10 · Ringkasan karakter program

Program ini ditulis oleh orang yang tahu persis perangkat kerasnya dan tidak
mempercayai satu pun lapisan abstraksi di atasnya. Ia melewati BIOS untuk papan
ketik, melewati BIOS untuk grafis, mematikan motor floppy sendiri, dan meletakkan
stack di dalam tabel vektor interupsi karena tahu slot mana yang tidak akan dipakai.

Sepertiga kodenya adalah penggambaran. Empat panggilan interupsi di seluruh
22 KB. Deteksi perangkat kerasnya dilakukan dengan menguji perilaku memori, bukan
menanyakan BIOS.

Ini juga perangkat lunak *user-supported* — teks di dalamnya meminta kontribusi
$20 untuk menyelesaikan `SPACE MINEZ` dan mencantumkan alamat pos di Scotts Valley,
California.
