# BUSEIGHT.BAS — Business Simulation, bagian 8

> Berantai ke BUSNINE.

| | |
|---|---|
| Sumber | Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Panjang | 102 baris (nomor 10–1290) |
| Subrutin | 9, dipanggil dari 15 tempat |
| Percabangan | 1 `GOTO`, 15 `GOSUB`, 2 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\BUSEIGHT.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

```mermaid
flowchart TD
    MAIN(["alur utama<br/>mulai baris 10"])
    S40["buang penyangga tombol<br/>40..70 (4 baris)"]
    S70["blok 70<br/>70..70 (1 baris)"]
    S230["gambar bingkai layar<br/>230..810 (32 baris)"]
    S820["gambar ulang layar<br/>820..910 (10 baris)"]
    S920["locate+print+for 920<br/>920..1020 (11 baris)"]
    S1030["locate+print+color 1030<br/>1030..1090 (7 baris)"]
    S1100["locate+print+color 1100<br/>1100..1170 (8 baris)"]
    S1180["gambar grafis<br/>1180..1280 (11 baris)"]
    S1290[/"blok 1290<br/>1290..1290"/]
    MAIN --> S1290
    MAIN --> S70
    MAIN --> S820
    MAIN --> S920
    MAIN --> S230
    MAIN --> S40
    MAIN --> S1030
    MAIN --> S1100
    MAIN --> S1180
    classDef ev fill:#fde,stroke:#a37
    class S1290 ev
```

Kotak bersudut miring berwarna = **penangan kejadian** (`ON KEY`/`ON ERROR`), yang dipanggil oleh interupsi, bukan oleh alur utama.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `40`–`70` | 4 baris | 4× | buang penyangga tombol |
| `820`–`910` | 10 baris | 4× | gambar ulang layar |
| `70`–`70` | 1 baris | 1× | blok @70 |
| `230`–`810` | 32 baris | 1× | gambar bingkai layar |
| `920`–`1020` | 11 baris | 1× | locate+print+for @920 |
| `1030`–`1090` | 7 baris | 1× | locate+print+color @1030 |
| `1100`–`1170` | 8 baris | 1× | locate+print+color @1100 |
| `1180`–`1280` | 11 baris | 1× | gambar grafis |
| `1290`–`1290` | 1 baris | 1× | blok @1290 *(handler)* ⚠ tanpa `RETURN` |

### Program lain yang dimuat

```mermaid
flowchart LR
    SELF["BUSEIGHT"]
    SELF -->|"RUN<br/>(variabel hilang)"| NBUSNINE["BUSNINE"]
    SELF -->|"RUN<br/>(variabel hilang)"| NMENU["MENU"]
    style SELF fill:#def,stroke:#37a
```

### Kejadian yang dijebak

- `ON KEY(10)` → baris 1290

## Bagaimana program ini disusun

Bagian kedelapan dari rangkaian sepuluh bagian. Arsitektur seluruh rangkaian identik,
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
gambar halaman, tunggu tombol*, lalu `RUN "BUSNINE"`.

Ini arsitektur presentasi yang sama dengan `ANATOMY.BAS`, hanya saja di sini
tiap "halaman" cukup besar sehingga harus dipecah ke berkas terpisah.

Satu-satunya di rangkaian yang memakai `DRAW`. Rutin bingkai di 820
dipanggil empat kali.

Penjelasan lengkap soal teknik overlay ada di [BUSONE.md](BUSONE.md).

## Yang menarik dari kodenya

Bagian kedelapan dari tutorial sepuluh bagian Friendlyware. Kerangkanya (jebakan F1–F9, `POKE 106,0` untuk membuang tombol menumpuk, rutin tunggu-tombol di baris 40–70) identik dengan berkas lainnya — penjelasan lengkapnya ada di [BUSONE.md](BUSONE.md).

Satu-satunya di rangkaian ini yang memakai `DRAW`. Baris 500 merakit garis tabel enam kolom dalam satu ekspresi `STRING$` bersambung — contoh paling padat dari teknik itu di seluruh koleksi.

## Yang bisa dipelajari

- Bandingkan berkas ini dengan `BUSONE.BAS` baris demi baris: bagian yang identik adalah 'kerangka', bagian yang berbeda adalah 'isi'. Memisahkan keduanya adalah latihan dasar yang bagus.

## Yang jangan ditiru

- Duplikasi kerangka. Lihat [BUSONE.md](BUSONE.md).

## Lampiran

### Perkakas bahasa yang dipakai

`DRAW` — bahasa makro menggambar garis, `POKE` — tulis memori langsung, `DEF SEG` — pindah segmen memori, `ON KEY(n) GOSUB` — jebakan tombol fungsi, `ON x GOSUB` — pemanggilan berindeks, `INKEY$` — baca tombol tanpa menunggu Enter, `RUN "nama"` — muat program lain, variabel hilang, `DEFSTR` — variabel default teks, `STRING$` — ulang satu karakter n kali, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1290
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 DEFSTR J,L:GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 GOSUB 820
90 GOSUB 920
100 GOSUB 230
```

### Baris terpanjang (126 kolom)

```basic
500 LA="╔"+STRING$(10,"═")+"╦"+STRING$(22,"═")+"╦"+STRING$(9,"═")+"╦"+STRING$(9,"═")+"╦"+STRING$(9,"═")+"╦"+STRING$(9,"═")+"╗"
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
