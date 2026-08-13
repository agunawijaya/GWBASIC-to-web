# BUSNINE.BAS — Business Simulation, bagian 9

> Berantai ke BUSTEN.

| | |
|---|---|
| Sumber | Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Panjang | 53 baris (nomor 10–530) |
| Subrutin | 7, dipanggil dari 9 tempat |
| Percabangan | 1 `GOTO`, 9 `GOSUB`, 2 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\BUSNINE.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

```mermaid
flowchart TD
    MAIN(["alur utama<br/>mulai baris 10"])
    S40["buang penyangga tombol<br/>40..70 (4 baris)"]
    S70["blok 70<br/>70..70 (1 baris)"]
    S110["'To Menu'<br/>110..190 (9 baris)"]
    S200["locate+print+for 200<br/>200..240 (5 baris)"]
    S250["locate+print+color 250<br/>250..320 (8 baris)"]
    S330["'ABC Hardware Company'<br/>330..520 (20 baris)"]
    S530[/"blok 530<br/>530..530"/]
    MAIN --> S530
    MAIN --> S70
    MAIN --> S110
    MAIN --> S250
    MAIN --> S40
    MAIN --> S200
    MAIN --> S330
    classDef ev fill:#fde,stroke:#a37
    class S530 ev
```

Kotak bersudut miring berwarna = **penangan kejadian** (`ON KEY`/`ON ERROR`), yang dipanggil oleh interupsi, bukan oleh alur utama.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `40`–`70` | 4 baris | 2× | buang penyangga tombol |
| `110`–`190` | 9 baris | 2× | "To Menu" |
| `70`–`70` | 1 baris | 1× | blok @70 |
| `200`–`240` | 5 baris | 1× | locate+print+for @200 |
| `250`–`320` | 8 baris | 1× | locate+print+color @250 |
| `330`–`520` | 20 baris | 1× | "ABC Hardware Company" |
| `530`–`530` | 1 baris | 1× | blok @530 *(handler)* ⚠ tanpa `RETURN` |

### Program lain yang dimuat

```mermaid
flowchart LR
    SELF["BUSNINE"]
    SELF -->|"RUN<br/>(variabel hilang)"| NBUSTEN["BUSTEN"]
    SELF -->|"RUN<br/>(variabel hilang)"| NMENU["MENU"]
    style SELF fill:#def,stroke:#37a
```

### Kejadian yang dijebak

- `ON KEY(10)` → baris 530

## Bagaimana program ini disusun

Bagian kesembilan dari rangkaian sepuluh bagian. Arsitektur seluruh rangkaian identik,
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
gambar halaman, tunggu tombol*, lalu `RUN "BUSTEN"`.

Ini arsitektur presentasi yang sama dengan `ANATOMY.BAS`, hanya saja di sini
tiap "halaman" cukup besar sehingga harus dipecah ke berkas terpisah.

Materinya neraca saldo setelah penutupan. 53 baris — terpendek di
rangkaian.

Penjelasan lengkap soal teknik overlay ada di [BUSONE.md](BUSONE.md).

## Yang menarik dari kodenya

Bagian kesembilan dari tutorial sepuluh bagian Friendlyware. Kerangkanya (jebakan F1–F9, `POKE 106,0` untuk membuang tombol menumpuk, rutin tunggu-tombol di baris 40–70) identik dengan berkas lainnya — penjelasan lengkapnya ada di [BUSONE.md](BUSONE.md).

Materinya neraca saldo setelah penutupan. Berkas terpendek di rangkaian (53 baris).

## Yang bisa dipelajari

- Bandingkan berkas ini dengan `BUSONE.BAS` baris demi baris: bagian yang identik adalah 'kerangka', bagian yang berbeda adalah 'isi'. Memisahkan keduanya adalah latihan dasar yang bagus.

## Yang jangan ditiru

- Duplikasi kerangka. Lihat [BUSONE.md](BUSONE.md).

## Lampiran

### Perkakas bahasa yang dipakai

`POKE` — tulis memori langsung, `DEF SEG` — pindah segmen memori, `ON KEY(n) GOSUB` — jebakan tombol fungsi, `ON x GOSUB` — pemanggilan berindeks, `INKEY$` — baca tombol tanpa menunggu Enter, `RUN "nama"` — muat program lain, variabel hilang, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 530
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30  GOTO 80
40  POKE 106,0
50  IF INKEY$<>"" THEN 40
60  RESP$=INKEY$:IF RESP$="" THEN 60
70  RETURN
80 CLS:GOSUB 110:GOSUB 250:GOSUB 40
90 CLS:GOSUB 110:GOSUB 200:GOSUB 330:GOSUB 40
100 RUN"BUSTEN"
```

### Baris terpanjang (103 kolom)

```basic
310 COLOR 11,0:LOCATE 25,12:PRINT"***** Strike Any Key For Post-closing Trial Balance *****";:COLOR 7,0
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
