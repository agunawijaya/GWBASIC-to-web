# ZAP'EM — dari disket IBM Februari 1982 ke web

> `run/ZAP'EM.BAS` · 3 Februari 1982, kode build `MAV-5-5-K` · 137 baris
> · [pakai portnya](../games/zapem/index.html) ·
> [analisis BASIC aslinya](../../reviews/ZAP'EM.md)

Yang **paling tua** dari trio *Attack / Serpent / Zap'em*, dan satu-satunya yang
menyimpan papan skor ke disket.

| Berkas | Tanggal | Kode build |
|---|---|---|
| **ZAP'EM** | **3 Februari 1982** | `MAV-5-5-K` |
| [SERPENT](serpent.md) | 6 Oktober 1982 | `USR-5-5-K` |
| [ATTACK](attack.md) | 7 Oktober 1982 | `MOD-5-5-M` |

---

## 1 · Pemainnya mengetik sendiri benih acaknya

```basic
460 INPUT "AH....YOUR NAME PLEASE ";NME$
    :LOCATE 15,1:INPUT "YOUR LAST SCORE ";R
550 RANDOMIZE R
```

Pertanyaan *"berapa skor terakhir Anda"* tidak diverifikasi ke mana pun, tidak
dibandingkan dengan papan skor, dan tidak dipakai untuk apa pun selain satu hal:
angkanya langsung jadi **benih pengacak**.

Empat program di koleksi ini, empat jawaban untuk soal yang sama:

| Program | Cara | Benih mungkin |
|---|---|--:|
| [METEOR](meteor.md) | diaduk selama pemain berpikir | 32.003 |
| [FLYS](flys.md) | `MID$(TIME$,4,2)+RIGHT$(TIME$,2)` | 3.600 |
| [ATTACK](attack.md) | `MID$(TIME$,3,2)` — mengambil titik dua | 1.440 *(cacat)* |
| **ZAP'EM** | **ditanyakan ke pemain** | sebanyak yang mau diketik |

Yang terakhir satu-satunya yang **bisa diulang dengan sengaja** — dan
satu-satunya yang menaruh keacakan di tangan pemain, tiga puluh tahun sebelum
istilah *seeded run* ada.

**Diverifikasi.** Benih yang sama, 300 bingkai, posisi seluruh Horde
dibandingkan sebagai string:

| | |
|---|---|
| Benih 2550, dua kali | **identik**, dan sisa bahan bakarnya sama |
| Benih 3100 | berbeda |

---

## 2 · "Ghost ships" itu cacat kode — dua-duanya

Baris 1280 memperkenalkan sebuah mekanik:

```
1280 "The Horde ships are unpredictable. Some are Ghost ships. These will
      take more than one hit or will vanish upon being hit without a score
      increment."
```

Dua janji: **(a)** ada yang butuh lebih dari satu tembakan, **(b)** ada yang
lenyap tanpa memberi skor. Keduanya benar-benar terjadi — dan keduanya punya
sebab di kode yang tidak ada hubungannya dengan "kapal hantu".

### Sebab (b): salah indeks

```basic
1140 IF LL=B(Z) THEN …:A(Z)=0:B(LL)=0:SCORE=SCORE+100:GOTO 680
```

`Z` adalah **nomor kapal**, `LL` adalah **kolom**. Yang dimaksud jelas
`B(Z)=0`. Kolomnya berjalan 3–24 dan kapal aktifnya berindeks 1–6, jadi
tembakan yang mengenai sasaran di **kolom 3, 4, 5, atau 6** menghapus posisi
*kapal lain* — yang lalu lenyap tanpa memberi skor. Persis janji (b).

### Sebab (a): hanya kapal berindeks terkecil yang diuji

```basic
1070 FOR Z=1 TO T1
1080 IF X=A(Z) THEN 1120      ' berhenti di yang PERTAMA
1090 NEXT Z
1120 FOR LL=3 TO 24           ' sinarnya cuma sampai kolom 24
1140 IF LL=B(Z) THEN …kena…
```

Baris 1070–1090 berhenti di kapal **berindeks terkecil** yang sebaris, lalu
menyapu kolom 3–24. Kalau kapal itu masih di luar jangkauan — Horde lahir di
kolom **30–36** — tembakannya meleset sepenuhnya, walaupun ada kapal lain di
baris yang sama yang sudah masuk jangkauan.

Jadi kapal yang jelas-jelas dilewati sinar Anda tetap terbang, dan baru mati
kalau ditembak lagi nanti. Persis janji (a).

### Diverifikasi

Aturan yang diuji pada setiap tembakan: *kena kalau dan hanya kalau kapal
berindeks terkecil di baris pemain berada di kolom 3–24.*

| Dari 749 tembakan | |
|---|--:|
| Kena | 38 |
| Meleset biasa | 631 |
| **Terhalang kapal berindeks lebih kecil** | **80** |
| Pelanggaran aturan | **0** |

Delapan puluh tembakan — lebih dari sepersepuluh — meleset karena sebab (a).
Ia bukan kejadian langka; ia bagian dari rasa main permainan ini.

> **Pelajaran.** Cerita latar ini **membenarkan cacatnya sendiri**, dan entah
> penulisnya tahu lalu memilih menjelaskannya, atau ia melihat gejalanya lalu
> mengarang alasannya. Dua-duanya sama menariknya, dan dua-duanya menghasilkan
> hal yang sama: **cacat yang diberi nama berhenti terasa seperti cacat.**
> "Ghost ship" adalah dokumentasi yang menutup laporan bug sebelum ada yang
> menulisnya.

Dipertahankan apa adanya. Kalau sebab (b) terjadi, layarnya menyebutnya
**GHOST** — supaya pemain tahu itu bukan salah bidiknya.

---

## 3 · Papan skornya bernama METEOR.DAT, dan METEOR tidak pernah menyentuhnya

```basic
1390 OPEN "METEOR.DAT" FOR INPUT AS #1
1500 OPEN "METEOR.DAT" FOR OUTPUT AS #1
```

`METEOR.BAS` punya **nol** pernyataan `OPEN` — sudah diperiksa seluruh 80
barisnya, dan [port METEOR](meteor.md) tidak menyentuh berkas apa pun. Berkas
itu sepenuhnya milik ZAP'EM.

> [!WARNING]
> **Koreksi review.** `reviews/ZAP'EM.md` menyebut papan skornya `BS.SCO` dan
> menyimpulkan *"jadi program ini lengkap"*. Itu **keliru**: `BS.SCO` memang ada
> di `run/`, tapi **tidak ada satu pun program di koleksi yang membukanya**, dan
> isinya lima entri kosong bernilai 0 diikuti penanda EOF. Sudah dikoreksi di
> reviewnya.

Cap waktu keduanya ikut bercerita:

| Berkas | Cap waktu | Isi |
|---|---|---|
| `METEOR.DAT` | **1 Januari 1980** | sepuluh skor sungguhan |
| `BS.SCO` | 3 Januari 1986 | lima entri kosong, yatim |

1 Januari 1980 adalah tanggal bawaan PC yang tidak punya baterai jam — jadi
berkas ini ditulis di mesin yang tanggalnya tidak pernah disetel.

Sepuluh nama di dalamnya dipakai sebagai **isi awal papan skor** di port ini:

```
GAV 3100 · FRED 2900 · STEPHEN 2850 · NO 2700 · FRED 2700
GAY 2700 · FRAZ 2650 · STEPHEN 2600 · POP 2550 · SHADOW 2550
```

Bukan karangan. Itu orang yang benar-benar memainkannya.

---

## 4 · Gelungnya memasang ulang jebakan tombol tiap bingkai

```basic
620 KEY(14) ON : 630 ON KEY(14) GOSUB 970
640 KEY(11) ON : 650 ON KEY(11) GOSUB 980
660 KEY(1)  ON : 670 ON KEY(1)  GOSUB 990
…
960 GOTO 620
```

Kenapa pemasangannya ada **di dalam** gelung? Karena penangannya **tidak pernah
`RETURN`**: baris 970 dan 980 berakhir dengan `GOTO 680`, dan 990 berujung di
`GOTO 620`.

Di GW-BASIC jebakan tombol **ditangguhkan** selama penangan berjalan dan baru
pulih saat `RETURN`. Karena `RETURN`-nya tidak pernah datang, satu-satunya cara
menghidupkannya lagi adalah memasangnya ulang — tiap bingkai, selamanya.

Enam baris yang terlihat seperti penyiapan ternyata **bagian dari gelung
utamanya**. Memindahkannya ke luar seperti "seharusnya" membuat permainannya
berhenti menerima tombol sesudah satu penekanan.

---

## 5 · Angka-angka yang bisa dihitung di muka

| | Dari kodenya | |
|---|---|---|
| Horde lahir di kolom | `INT(RND*7)+30` | 30–36 |
| Jangkauan sinar | `FOR LL=3 TO 24` | 3–24 |
| Bingkai menunggu sampai masuk jangkauan | 30−24 … 36−24 | 6–12 |
| **Jendela menembak per kapal** | 24 → 3 | **22 bingkai** |
| Bahan bakar | 150, −1,2 per bingkai | habis di bingkai **125** |
| Mulai berkedip (`V=31`) | `FUEL<50` | bingkai **84** |
| Lolos di kolom &lt;3 | | −150 |
| Kena | | +100 |

Ekonominya keras: **lolos merugikan 1,5 kali lipat keuntungan kena.** Dengan
enam kapal aktif dan jendela 22 bingkai masing-masing, membiarkan satu lolos
menghapus satu setengah tembakan yang berhasil.

Dan `V=31` bukan angka sembarang: di teks CGA, warna 16–31 adalah **warna
berkedip**. Jadi peringatan bahan bakar rendah adalah pesawat yang mulai
berkedip — satu-satunya peringatan yang punya aslinya, dan ia gratis.

---

## 6 · Dua variabel yang tidak melakukan apa-apa

```basic
520 X=10 : Y=20
820 Y=Y+M
```

`M` tidak pernah diberi nilai di seluruh 137 baris — sudah dicari. Jadi ia nol,
`Y` tidak pernah berubah, dan `Y` sendiri tidak pernah dibaca sesudahnya.

Sepasang variabel yang bertahan sejak Februari 1982 tanpa pernah berpengaruh
pada apa pun. Tidak diport, tapi dicatat: ia jejak rancangan yang berubah di
tengah jalan — kemungkinan besar dulu pesawatnya bisa bergerak mendatar juga.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Benih acak | ditanyakan ke pemain (§1) | tidak ada jam berresolusi tinggi | **Dipertahankan sebagai fitur**, lengkap dengan kotak isiannya. Benih yang terpakai ditampilkan |
| "Ghost ships" | dua cacat kode (§2) | — | **Dipertahankan keduanya.** Sebab (b) diberi label `GHOST` di layar supaya terbaca sebagai kejadian, bukan salah bidik |
| Papan skor | `METEOR.DAT`, 10 entri (§3) | disket | **Isi 1980-annya jadi isi awal**, disimpan di `localStorage`. Tombol mengembalikannya ke isi asli |
| Papan angka | `LOCATE 2,3 / 2,15 / 2,24` — **di dalam layar** | — | **Digambar di baris 2**, kolom 3/14/24. Ditulis begitu sejak versi pertama — pelajaran [ATTACK §6c](attack.md) |
| Jebakan tombol | dipasang ulang tiap bingkai (§4) | penangan tak pernah `RETURN` | Tidak perlu diport; peramban tidak punya kendala itu. **Dicatat**, karena itu yang menjelaskan bentuk gelungnya |
| Kedip bahan bakar | `V=31`, warna berkedip CGA | — | **Dipertahankan** sebagai kedipan pesawat |
| Bingkai kotak ganda | `CHR$(186/205/201/…)` (580–610) | — | Digambar sebagai bingkai, termasuk pemisah baris 4 |
| Sinar laser | digambar lalu dihapus di dalam satu penekanan | tidak ada pewaktu | **Kejadian sesaat**, dibuang pada langkah berikutnya — pelajaran [ATTACK §6b](attack.md), dipakai lebih dulu di sini |
| Kecepatan | satu putaran gelung penafsir | tidak ada pewaktu | Penggeser bingkai/detik, bawaan 10 |
| Kendali | `ON KEY(11)/(14)/(1)` | — | Panah, `8`/`2`, `F1`/`Spasi`, plus tombol layar |
| `Y=Y+M` | dua variabel mati (§6) | — | **Tidak diport.** Dicatat |
| Teks petunjuk | dipotong tangan agar pas 40 kolom | tidak ada pembungkus kata | Ditulis ulang mengalir. Cacat aslinya (`try- ing` patah di tengah kata) dicatat di reviewnya |
| Keluar | `RUN "MENU"` | tiap program berkas terpisah | Tautan kembali di bilah atas |

---

## 8 · Latihan

1. **Perbaiki satu huruf.** Ganti `B(LL)=0` jadi `B(Z)=0`. Janji mana di baris
   1280 yang jadi bohong, dan janji mana yang tetap benar?

2. **Hitung ambang bertahan.** Dengan +100 per kena dan −150 per lolos, berapa
   persen kapal yang harus Anda jatuhkan supaya skornya tidak turun? Lalu:
   apakah itu mungkin dengan jendela 22 bingkai dan enam kapal aktif?

3. **Cari benih yang enak.** Benih adalah angka yang Anda ketik. Cari satu yang
   memberi permainan mudah, lalu jelaskan kenapa mencarinya tidak dianggap
   curang di 1982 tapi akan dianggap curang sekarang.

4. **Kembalikan `M`.** Andaikan dulu `M` menggerakkan pesawat mendatar. Baris
   mana saja yang harus ada supaya `Y=Y+M` berguna, dan kenapa penulisnya
   mungkin membuangnya?

---

Berkas terkait: [pakai](../games/zapem/index.html) ·
[ATTACK](attack.md) · [SERPENT](serpent.md) — dua saudaranya ·
[METEOR](meteor.md) — pemilik nama berkas skornya
