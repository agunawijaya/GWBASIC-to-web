# SERPENT.BAS — Serpent v00

> Bertanggal 6 Okt 1982, kode build USR-5-5-K.

| | |
|---|---|
| Sumber | Seri Attack / Serpent / Zap'em, 1982 |
| Tahun | 1982 |
| Panjang | 64 baris (nomor 10–970) |
| Subrutin | 1, dipanggil dari 1 tempat |
| Percabangan | 15 `GOTO`, 1 `GOSUB`, 0 target `ON…` |
| Komentar | 2% dari baris |
| Jalankan | `run\SERPENT.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Hanya ada 1 subrutin, jadi diagram tidak menambah apa pun.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `950`–`970` | 3 baris | 1× | "STRING$(9,28)" |

### Perulangan utama

`GOTO` mundur terpanjang: dari baris **930** kembali ke **500** — melingkupi 430 nomor baris.
Itulah loop utama program ini; segala sesuatu di dalam rentang tersebut
dijalankan berulang.

## Bagaimana program ini disusun

Satu subrutin untuk 64 baris — program terpendek dari trio
`ATTACK`/`SERPENT`/`ZAP'EM`, jadi tempat terbaik untuk melihat kerangka
bersamanya dalam bentuk telanjang.

Struktur tiga lapisnya khas game era ini, dan semuanya dinyatakan dengan `GOTO`
mundur:

- 530←640 (110 baris) — satu langkah ular
- 570←840 (270 baris) — satu ronde
- 500←930 (430 baris) — seluruh sesi

Tiga tingkat perulangan bersarang tanpa satu pun `WHILE`. Bandingkan dengan
`CRAZY8.BAS` yang memakai `WHILE`/`WEND` dan hanya butuh 8 `GOTO` untuk program
lima kali lebih panjang.

Layar pembukanya mengungkap asal-usul:

```basic
10 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
20 LOCATE 7,8,0:PRINT "General  utility  programs"
```

Mode layar, lebar, warna, dan posisi `LOCATE 5,19` **sama persis** dengan program
contoh IBM resmi (`MORTGAGE`, `MUSIC`, `PIECHART`, `SPACE`) yang menulis "IBM"
lalu "Personal Computer" di posisi identik. Hanya baris keduanya yang berbeda.

Membandingkan kerangka layar pembuka adalah cara yang tidak terduga efektif untuk
melacak asal-usul berkas.

## Yang menarik dari kodenya

Satu dari trio `ATTACK`/`SERPENT`/`ZAP'EM`. Layar pembukanya mengungkap sesuatu
yang penting soal asal-usulnya:

```basic
10 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
20 LOCATE 7,8,0:PRINT "General  utility  programs"
```

Baris "IBM" lalu "General utility programs" memakai **tata letak yang sama
persis** dengan program contoh IBM resmi (`MORTGAGE`, `MUSIC`, `PIECHART`,
`SPACE`) yang menulis "IBM" lalu "Personal Computer" di posisi identik. Jadi
ketiga berkas ini hampir pasti berasal dari disket bermerek IBM juga, hanya seri
yang berbeda — dan kode build seperti `USR-5-5-K` mendukung dugaan itu.

Program terpendek dari trio ini (64 baris), jadi paling mudah dibaca untuk
memahami kerangkanya.

Baris 640 memperlihatkan satu baris yang mengerjakan terlalu banyak:

```basic
640 IF S=148 THEN SC=SC+10:LOCATE 25,20-LEN(STR$(SC))/2:PRINT SC;:L=L+1:SOUND 100,1:...:IF AP<5 THEN 750 ELSE ...:IF DL=5 THEN DL=0:P=P+1:GOTO 530 ELSE 530
```

Tiga `IF` bersarang, penambahan skor, penggambaran, suara, dan kenaikan level —
semuanya dalam satu baris 207 kolom. Bagian yang layak dicontoh justru
tersembunyi di dalamnya: `20-LEN(STR$(SC))/2` menghitung posisi agar skor selalu
**rata tengah** berapa pun jumlah digitnya. Detail tampilan yang dipikirkan.

## Yang bisa dipelajari

- `kolom_tengah - LEN(teks)/2` adalah cara merata-tengahkan teks yang panjangnya berubah.
- Kalau beberapa berkas berbagi tata letak layar pembuka yang identik, itu petunjuk kuat soal asal-usul bersama.

## Dua cacat yang mengunci permainan

Ditemukan saat porting ke web (lihat [dokumennya](../web/docs/serpent.md), §6d),
dan keduanya cacat program aslinya — bukan cacat port.

Baris 560 menaruh **tepat lima** apel, dan baris 640 hanya menaikkan tingkat
setelah `AP` mencapai 5. Apel yang dimakan **tidak** diganti satu per satu;
papannya baru dibangun ulang setelah kelimanya habis. Jadi kalau satu apel
lenyap tanpa dimakan, `AP` mentok di 4 **selamanya** dan pemain harus mati untuk
keluar dari ronde itu. Ada dua jalan menuju ke sana:

**1 · Musuh menghapus apel.** Pantulan musuh hanya berbalik untuk rentang
mematikan 179–218:

```basic
790 S1=SCREEN(…):S2=SCREEN(…):IF S1<219 AND S1>178 THEN PY1(PL)=-PY1(PL)
800 IF S2<219 AND S2>178 THEN PX1(PL)=-PX1(PL)
```

Apel berkode 148 — **di luar** rentang itu, jadi musuh boleh menginjaknya. Dan
langkah berikutnya menghapus sel yang ditinggalkan tanpa memeriksa isinya:

```basic
760 LOCATE PY(PL),PX(PL):PRINT " ";
```

Ini akibat langsung dari teknik yang justru jadi kekuatan program ini: kalau
layar adalah satu-satunya struktur data, maka menghapus piksel **berarti**
menghapus objek. Tidak ada tempat lain yang masih menyimpan apel itu.

**2 · Dua apel di satu sel.** Baris 560 tidak memeriksa apa pun:

```basic
560 COLOR 4:FOR R=1 TO 5:LOCATE RND*22+2,RND*39+1:PRINT "ö";:NEXT
```

Lima undian ke ~950 sel bebas: peluang tabrakan kira-kira **1 dari 95 ronde**.
Apel juga bisa mendarat tepat di atas dinding labirin dan melubanginya.

Yang pertama butuh 25 apel dulu (musuh pertama baru ada saat `P` jadi 1), jadi
kebanyakan pemain 1982 kemungkinan besar tidak pernah sampai ke sana. Yang kedua
bisa terjadi di ronde pertama.

> **Pelajarannya bukan "periksa tabrakan".** Melainkan: begitu layar dijadikan
> satu-satunya salinan keadaan, **setiap `PRINT " "` jadi penghapus objek**, dan
> tidak ada cara mengetahui apa yang barusan hilang. Harga dari 3.200 bita yang
> dihemat di [§Yang menarik](#yang-menarik-dari-kodenya) dibayar di sini.

## Yang jangan ditiru

- Satu baris yang mengerjakan skor, tampilan, suara, dan kenaikan level sekaligus. Kalau ada bug skor, Anda harus membaca semuanya.
- Pencacah kemajuan (`AP`) yang menghitung objek yang bisa lenyap tanpa dihitung. Kalau lima objek harus dimakan dan salah satunya bisa hilang, permainannya bisa masuk keadaan yang tidak punya jalan keluar.

## Lampiran

### Perkakas bahasa yang dipakai

`SOUND` — nada mentah (frekuensi, durasi), `BEEP`, `POKE` — tulis memori langsung, `DEF SEG` — pindah segmen memori, `USR`/`CALL` — panggil rutin bahasa mesin, `INKEY$` — baca tombol tanpa menunggu Enter, `STRING$` — ulang satu karakter n kali, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
20 LOCATE 7,8 ,0:PRINT "General  utility  programs"
30 COLOR 9 ,0:LOCATE 10,9,0:PRINT CHR$(213)+STRING$(21,205)+CHR$(184)
40 LOCATE 11,9,0:PRINT CHR$(179)+"       SERPENT       "+CHR$(179)
50 LOCATE 12,9,0:PRINT CHR$(179)+STRING$(21,32)+CHR$(179)
60 COLOR 9,0:LOCATE 13,9,0:PRINT CHR$(179)+"     Version  00     "+CHR$(179)
70 BEEP
80 LOCATE 14,9,0:PRINT CHR$(212)+STRING$(21,205)+CHR$(190)
90 COLOR 15,0,1:LOCATE 17,7,0:PRINT "OCTOBER 06 1982   USR-5-5-K "
100 COLOR 9,0:LOCATE 23,6,0:PRINT "Press space bar to continue..."
```

### Baris terpanjang (207 kolom)

```basic
640 IF S=148 THEN SC=SC+10:LOCATE 25,20-LEN(STR$(SC))/2:PRINT SC;:L=L+1:SOUND 100,1:SOUND 1000,0.5:AP=AP+1:IF AP<5 THEN 750 ELSE FOR R=1 TO 10:A$=INKEY$:NEXT:DL=DL+1:IF DL=5 THEN DL=0:P=P+1:GOTO 530 ELSE 530
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
