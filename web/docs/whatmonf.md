# WHATMONF — empat baris, dan dua di antaranya tertukar

> Sumber: [`run/WHATMONF.BAS`](../../run/WHATMONF.BAS) (4 baris, 117 bita) ·
> Analisis BASIC: [`reviews/WHATMONF.md`](../../reviews/WHATMONF.md) ·
> Pembanding: [`docs/sub.md`](sub.md) · [`docs/draw.md`](draw.md) ·
> [`docs/xwing.md`](xwing.md)

**Program terpendek di koleksi ini**, dan satu-satunya yang tidak dijadikan
aplikasi — bukan karena ia membosankan, tapi karena tidak ada yang bisa
dimainkan. Ia tidak mencetak apa pun, tidak menunggu apa pun, dan tidak
menggambar apa pun.

Yang ia lakukan cuma satu: memberi tahu program lain di alamat memori mana
layar teks berada. Dan ia salah.

---

## 1 · Seluruh programnya

```basic
10 DEF SEG=&H0040
20 VALUE=PEEK(&H0049)
30 IF VALUE=2 OR VALUE=3 THEN SCRN=&HB000
40 IF VALUE=7 THEN SCRN=&HB800
```

Baris 10 mengarahkan pembacaan ke segmen `0040` — **BIOS Data Area**, papan
tulis kecil tempat BIOS menyimpan keadaan mesin sejak dinyalakan. Baris 20
membaca bita di offset `0049`, yaitu **mode video yang sedang aktif**.

Baris 30 dan 40 menerjemahkan mode itu jadi alamat penyangga layar.

---

## 2 · Dan terjemahannya terbalik

Nilai mode video menurut BIOS:

| mode | artinya | penyangga layar |
|---|---|---|
| 0, 1 | teks 40×25 berwarna | `B800` |
| **2, 3** | **teks 80×25 berwarna (CGA)** | **`B800`** |
| 4, 5, 6 | grafik CGA | `B800` |
| **7** | **teks 80×25 monokrom (MDA/Hercules)** | **`B000`** |

Sekarang bandingkan dengan yang ditulis programnya:

| | seharusnya | WHATMONF |
|---|---|---|
| mode 2 atau 3 (berwarna) | `B800` | **`B000`** |
| mode 7 (monokrom) | `B000` | **`B800`** |

Bukan meleset, bukan kurang lengkap: **tertukar persis**. Kartu berwarna
diberi alamat kartu monokrom, dan sebaliknya.

Yang perlu ditegaskan: **metodenya benar**. Membaca `0040:0049` adalah cara
yang sah untuk mengetahui mode video. Yang salah cuma dua penetapan di baris
30 dan 40. Ini bukan kesalahpahaman tentang cara kerja mesin — ini dua
konstanta yang dipertukarkan.

---

## 3 · Akibatnya: salah di **kedua** jenis mesin

Cacat semacam ini biasanya berarti "jalan di mesin saya, rusak di mesin
Anda". Yang ini tidak. Ia rusak di dua-duanya.

Sebuah PC berkartu CGA murni tidak punya memori apa pun di `B000`; PC
berkartu monokrom tidak punya apa pun di `B800`. Jadi kalau `SCRN` dipakai
untuk menulis huruf ke layar:

- di mesin **berwarna**, tulisannya masuk ke `B000` — alamat yang tidak
  tersambung ke apa pun. Tidak ada yang muncul.
- di mesin **monokrom**, tulisannya masuk ke `B800` — sama saja. Tidak ada
  yang muncul.

Programnya tidak akan menampilkan galat. Ia akan tampak bekerja, diam, dan
tidak menghasilkan apa-apa.

---

## 4 · Tiga belas lawan satu

Empat belas program di koleksi ini menyentuh byte video BIOS. Menariknya,
mereka tidak memakai byte yang sama:

| cara | alamat | yang memakainya |
|---|---|---|
| **byte perlengkapan** | `0040:0010` (`PEEK(1040)` / `&H410`) | **13 program** |
| byte mode video | `0040:0049` | **1 program — WHATMONF** |

Tiga belas: `15PUZZLE`, `ABM2A`, `BREAKOUT`, `DRAW`, `LANDER`, `MAZE`,
`MORTGAGE`, `PIECHART`, `SPACE`, `STATS`, `SUB`, `WILDCAT`, `XWING`.

**Yang menyendiri juga yang keliru.** Itu bukan kebetulan yang bisa
dibuktikan, tapi ia pola yang layak diperhatikan: cara yang dipakai semua
orang biasanya sudah diperiksa semua orang.

Dan pembanding terdekatnya ada **di disket yang sama**.
[`SUB.BAS`](sub.md) melakukan pekerjaan yang sama persis, enam kali, dan
benar setiap kali:

```basic
590 IF (PEEK(1040) AND 48)=48 THEN DEF SEG=45056 ELSE DEF SEG=47104
```

`45056` = `&HB000` (monokrom), `47104` = `&HB800` (berwarna). Bit 4–5 byte
perlengkapan bernilai `11` hanya untuk monokrom 80×25 — jadi `AND 48 = 48`
berarti monokrom, dan `SUB` memberinya `B000`. Tepat.

Dua program, satu koleksi, satu pertanyaan yang sama. Satu menjawab benar
enam kali; yang lain menjawab salah dalam dua baris.

---

## 5 · Ia tidak melakukan apa pun dengan jawabannya

Ini yang paling mudah terlewat. Sesudah baris 40, program **berhenti**.
`SCRN` sudah terisi, lalu tidak pernah dibaca. Nol `PRINT`, nol `POKE`, nol
`DEF SEG` yang memakainya.

Jadi `WHATMONF.BAS` bukan program. Ia **cuplikan** — potongan yang
diterbitkan majalah *What Micro?* untuk Anda salin ke program Anda sendiri.
Nama berkasnya sendiri sebuah pertanyaan: *what monitor?*

Itu menjelaskan kenapa ia tidak punya aplikasi di koleksi ini. Tidak ada
yang bisa diport; yang ada cuma yang bisa dibaca.

---

## 6 · Kenapa cuplikan yang salah lebih berbahaya daripada program yang salah

Program yang salah merugikan pemakainya sekali.

Cuplikan yang salah diterbitkan **supaya disalin**. Ia tidak dijalankan —
ia ditempelkan ke tengah program orang lain, di mana kegagalannya muncul
jauh dari sumbernya dan tidak terlihat seperti berasal dari empat baris yang
disalin dari majalah bulan lalu.

Dan gejalanya, seperti di bagian 3, adalah **layar yang diam**. Bukan galat,
bukan huruf sampah — tidak ada apa-apa. Orang yang menyalinnya akan mencari
kesalahan di kodenya sendiri.

Ini pola yang berulang di seluruh koleksi ini, dengan nama yang berbeda-beda:
[`STARTREK`](startrek.md) memanggil `GOSUB 4810` yang isinya cuma `RETURN`,
[`WIZARD`](wizard.md) meninggalkan satu perintah di balik tanda kutip,
[`XWING`](xwing.md) menguji tabrakan lewat warna piksel. Tidak satu pun
menimbulkan galat. Semuanya cuma **diam**.

---

## 7 · Yang benar

Dua baris ditukar, selesai:

```basic
10 DEF SEG=&H0040
20 VALUE=PEEK(&H0049)
30 IF VALUE=2 OR VALUE=3 THEN SCRN=&HB800   ' berwarna
40 IF VALUE=7 THEN SCRN=&HB000              ' monokrom
```

Ini salah satu dari dua perbaikan yang disebut keputusan (c) di
[`PLAN.md`](../PLAN.md) §9 — perbaikan hanya untuk yang jelas-jelas bug,
dan setiap perbaikan dicatat beserta buktinya. Yang satunya `RANDOMIZE`
ganda yang sia-sia di [`WILDCAT`](wildcat.md).

Bedanya: WILDCAT punya aplikasi, jadi perbaikannya hidup di kodenya.
WHATMONF tidak, jadi perbaikannya hidup di sini — di dokumen ini, dan tidak
di tempat lain.

---

## 8 · Latihan

1. Baris 30 memakai `VALUE=2 OR VALUE=3` tapi tidak menyebut mode 0 dan 1,
   yang juga berwarna. Apakah itu cacat kedua, atau keputusan? Terangkan
   dengan menyebut untuk apa cuplikan ini dipakai.
2. `SUB.BAS` membaca byte perlengkapan, WHATMONF membaca byte mode video.
   Sebutkan satu keadaan di mana keduanya memberi jawaban **berbeda** untuk
   mesin yang sama.
3. Baris `IF (PEEK(1040) AND 48)=48` di SUB muncul enam kali, disalin utuh,
   bukan dijadikan subrutin. Sebutkan satu alasan yang masuk akal untuk itu
   pada BASIC 1982 — dan satu akibat yang harus ditanggungnya.
4. Cacat ini membuat layar diam, bukan menimbulkan galat. Susun satu
   perubahan kecil pada keempat baris itu yang membuat kesalahannya
   **berisik** — terlihat seketika oleh siapa pun yang menyalinnya.
5. Tiga belas program memilih byte perlengkapan, satu memilih byte mode
   video. Terangkan kenapa byte perlengkapan lebih cocok untuk pertanyaan
   *"monitor apa yang terpasang?"* sementara byte mode video menjawab
   pertanyaan yang sedikit berbeda.
