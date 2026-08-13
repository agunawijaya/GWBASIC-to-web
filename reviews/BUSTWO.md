# BUSTWO.BAS — Business Simulation, bagian 2

> Kas dan utang usaha. Berantai ke BUSTHREE.

| | |
|---|---|
| Sumber | Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Panjang | 59 baris (nomor 10–590) |
| Subrutin | 4, dipanggil dari 6 tempat |
| Percabangan | 1 `GOTO`, 6 `GOSUB`, 2 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\BUSTWO.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

```mermaid
flowchart TD
    MAIN(["alur utama<br/>mulai baris 10"])
    S50["buang penyangga tombol<br/>50..80 (4 baris)"]
    S80["blok 80<br/>80..80 (1 baris)"]
    S490["gambar ulang layar<br/>490..580 (10 baris)"]
    S590[/"blok 590<br/>590..590"/]
    MAIN --> S80
    MAIN --> S590
    MAIN --> S490
    MAIN --> S50
    classDef ev fill:#fde,stroke:#a37
    class S590 ev
```

Kotak bersudut miring berwarna = **penangan kejadian** (`ON KEY`/`ON ERROR`), yang dipanggil oleh interupsi, bukan oleh alur utama.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `50`–`80` | 4 baris | 2× | buang penyangga tombol |
| `490`–`580` | 10 baris | 2× | gambar ulang layar |
| `80`–`80` | 1 baris | 1× | blok @80 |
| `590`–`590` | 1 baris | 1× | blok @590 *(handler)* ⚠ tanpa `RETURN` |

### Program lain yang dimuat

```mermaid
flowchart LR
    SELF["BUSTWO"]
    SELF -->|"RUN<br/>(variabel hilang)"| NBUSTHREE["BUSTHREE"]
    SELF -->|"RUN<br/>(variabel hilang)"| NMENU["MENU"]
    style SELF fill:#def,stroke:#37a
```

### Kejadian yang dijebak

- `ON KEY(10)` → baris 590

## Bagaimana program ini disusun

Bagian kedua dari rangkaian sepuluh bagian. Arsitektur seluruh rangkaian identik,
dan sengaja: **kerangka yang disalin ke sepuluh berkas**.

Kerangka itu terdiri dari tiga bagian tetap:

```basic
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT   ' matikan F1-F9
40 POKE 106,0                                        ' buang tombol menumpuk
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60                  ' tunggu satu tombol
70 RETURN
```

Rutin 40–70 itulah yang dipanggil paling sering di tiap berkas — ia adalah
"tombol Lanjut" yang memisahkan satu halaman pelajaran dari berikutnya. Alur
utamanya kemudian cuma berupa selang-seling: *gambar halaman, tunggu tombol,
gambar halaman, tunggu tombol*, lalu `RUN "BUSTHREE"`.

Ini arsitektur presentasi yang sama dengan `ANATOMY.BAS`, hanya saja di sini
tiap "halaman" cukup besar sehingga harus dipecah ke berkas terpisah.

Materinya kas dan utang usaha. Hanya 4 subrutin — paling ringan di rangkaian.

Penjelasan lengkap soal teknik overlay ada di [BUSONE.md](BUSONE.md).

## Yang menarik dari kodenya

Bagian kedua dari tutorial sepuluh bagian Friendlyware. Kerangkanya (jebakan F1–F9, `POKE 106,0` untuk membuang tombol menumpuk, rutin tunggu-tombol di baris 40–70) identik dengan berkas lainnya — penjelasan lengkapnya ada di [BUSONE.md](BUSONE.md).

Materinya kas dan utang usaha. Berkas terpendek kedua di rangkaian ini (59 baris) — hampir seluruhnya teks pelajaran, bukan logika.

## Yang bisa dipelajari

- Bandingkan berkas ini dengan `BUSONE.BAS` baris demi baris: bagian yang identik adalah 'kerangka', bagian yang berbeda adalah 'isi'. Memisahkan keduanya adalah latihan dasar yang bagus.

## Yang jangan ditiru

- Duplikasi kerangka. Lihat [BUSONE.md](BUSONE.md).

## Lampiran

### Perkakas bahasa yang dipakai

`POKE` — tulis memori langsung, `ON KEY(n) GOSUB` — jebakan tombol fungsi, `ON x GOTO` — percabangan berindeks, `ON x GOSUB` — pemanggilan berindeks, `INKEY$` — baca tombol tanpa menunggu Enter, `RUN "nama"` — muat program lain, variabel hilang, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10 KEY(10) ON
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 80:NEXT
30 ON KEY(10) GOSUB 590
40 GOTO 90
50 POKE 106,0
60 IF INKEY$<>"" THEN 50
70 RESP$=INKEY$:IF RESP$="" THEN 70
80 RETURN
90 GOSUB 490
100 PRINT TAB(17)"The first thing that must be done in automating your"
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
