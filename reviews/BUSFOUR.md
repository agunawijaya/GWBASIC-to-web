# BUSFOUR.BAS — Business Simulation, bagian 4

> Berantai ke BUSFIVE.

| | |
|---|---|
| Sumber | Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Panjang | 66 baris (nomor 10–660) |
| Subrutin | 4, dipanggil dari 6 tempat |
| Percabangan | 2 `GOTO`, 6 `GOSUB`, 2 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\BUSFOUR.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

```mermaid
flowchart TD
    MAIN(["alur utama<br/>mulai baris 10"])
    S40["buang penyangga tombol<br/>40..70 (4 baris)"]
    S70["blok 70<br/>70..70 (1 baris)"]
    S370["gambar ulang layar<br/>370..450 (9 baris)"]
    S660[/"blok 660<br/>660..660"/]
    MAIN --> S660
    MAIN --> S70
    MAIN --> S370
    MAIN --> S40
    classDef ev fill:#fde,stroke:#a37
    class S660 ev
```

Kotak bersudut miring berwarna = **penangan kejadian** (`ON KEY`/`ON ERROR`), yang dipanggil oleh interupsi, bukan oleh alur utama.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `40`–`70` | 4 baris | 2× | buang penyangga tombol |
| `370`–`450` | 9 baris | 2× | gambar ulang layar |
| `70`–`70` | 1 baris | 1× | blok @70 |
| `660`–`660` | 1 baris | 1× | blok @660 *(handler)* ⚠ tanpa `RETURN` |

### Program lain yang dimuat

```mermaid
flowchart LR
    SELF["BUSFOUR"]
    SELF -->|"RUN<br/>(variabel hilang)"| NBUSFIVE["BUSFIVE"]
    SELF -->|"RUN<br/>(variabel hilang)"| NMENU["MENU"]
    style SELF fill:#def,stroke:#37a
```

### Kejadian yang dijebak

- `ON KEY(10)` → baris 660

## Bagaimana program ini disusun

Bagian keempat dari rangkaian sepuluh bagian. Arsitektur seluruh rangkaian identik,
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
gambar halaman, tunggu tombol*, lalu `RUN "BUSFIVE"`.

Ini arsitektur presentasi yang sama dengan `ANATOMY.BAS`, hanya saja di sini
tiap "halaman" cukup besar sehingga harus dipecah ke berkas terpisah.

Materinya neraca saldo. Hanya empat subrutin — rangkaian ini makin ke
belakang makin datar, karena isinya makin banyak teks dan makin sedikit
tabel yang perlu digambar.

Penjelasan lengkap soal teknik overlay ada di [BUSONE.md](BUSONE.md).

## Yang menarik dari kodenya

Bagian keempat dari tutorial sepuluh bagian Friendlyware. Kerangkanya (jebakan F1–F9, `POKE 106,0` untuk membuang tombol menumpuk, rutin tunggu-tombol di baris 40–70) identik dengan berkas lainnya — penjelasan lengkapnya ada di [BUSONE.md](BUSONE.md).

Materinya neraca saldo (Trial Balance). Baris 80–110 merakit garis tabel dengan menyambung `CHR$(201)` dan `═` di dalam loop, bukan menuliskannya utuh — cara menghemat ruang program saat karakter kotak mahal diketik.

## Yang bisa dipelajari

- Bandingkan berkas ini dengan `BUSONE.BAS` baris demi baris: bagian yang identik adalah 'kerangka', bagian yang berbeda adalah 'isi'. Memisahkan keduanya adalah latihan dasar yang bagus.

## Yang jangan ditiru

- Duplikasi kerangka. Lihat [BUSONE.md](BUSONE.md).

## Lampiran

### Perkakas bahasa yang dipakai

`POKE` — tulis memori langsung, `DEF SEG` — pindah segmen memori, `ON KEY(n) GOSUB` — jebakan tombol fungsi, `ON x GOSUB` — pemanggilan berindeks, `INKEY$` — baca tombol tanpa menunggu Enter, `RUN "nama"` — muat program lain, variabel hilang, `DEFSTR` — variabel default teks, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 660:DEFSTR J,L
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 JA=CHR$(201):FOR I=1 TO 6:JA=JA+"═":NEXT
90 JA=JA+"╦":FOR I=1 TO 30:JA=JA+"═":NEXT
100 JA=JA+"╦":FOR I=1 TO 23:JA=JA+"═":NEXT
```

### Baris terpanjang (105 kolom)

```basic
440 COLOR 11,0:LOCATE 4,30:PRINT"STEP VI. TRIAL BALANCE":PRINT;TAB(30);"----------------------":COLOR 7,0
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
