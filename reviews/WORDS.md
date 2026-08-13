# WORDS.BAS — Words

> Utilitas daftar kata kecil.

| | |
|---|---|
| Sumber | Public domain / listing majalah lain-lain |
| Tahun | 1990 |
| Panjang | 36 baris (nomor 10000–10350) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\WORDS.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

## Bagaimana program ini disusun

**Nol subrutin, nol percabangan, nol kode** — 36 baris yang seluruhnya `DATA`,
dimulai dari nomor baris 10000.

```basic
10000 DATA fat,cat,act,can,fast,hat,hand,last,man,ran,have
10010 DATA red,hen,let,get,help,next,pet,men,went,bed,said
10020 DATA big,pig,fir,did,swim,six,dig,win,sit,hit,been
```

Berkas ini bukan program berdiri sendiri. Ia **modul data** yang disuntikkan ke
`READING.BAS` lewat `CHAIN MERGE "words", 75, ALL`.

Nomor baris 10000 ke atas dipilih supaya tidak bertabrakan dengan `READING.BAS`
yang memakai baris 5–75. Itu **kontrak antarmodul** — dan satu-satunya yang
mencegah keduanya saling menimpa saat digabung. Tidak tertulis di berkas mana
pun.

Yang paling menarik: daftar katanya **tidak acak**. Tiap baris adalah satu pola
fonetik — 10000 vokal 'a' pendek, 10010 'e', 10020 'i', 10030 'u', 10040 'o',
lalu 10050 akhiran ganda (ll, ss, ff), 10060 '-sk'/'-ck', 10070 'sh',
10080 'ch'/'-tch'.

Jadi ini bukan sekadar daftar kata — ini **kurikulum membaca yang tersusun**,
dari sederhana ke kompleks. **Data bisa membawa struktur**, dan struktur itu
hanya terbaca kalau Anda memperhatikan urutannya.

Karena datanya terpisah dari programnya, seorang guru bisa menyunting kurikulumnya
tanpa menyentuh satu baris kode.

## Yang menarik dari kodenya

Tiga puluh enam baris yang **seluruhnya `DATA`**, dimulai dari nomor baris
10000:

```basic
10000 DATA fat,cat,act,can,fast,hat,hand,last,man,ran,have
10010 DATA red,hen,let,get,help,next,pet,men,went,bed,said
10020 DATA big,pig,fir,did,swim,six,dig,win,sit,hit,been
```

Berkas ini bukan program berdiri sendiri — ia **modul data** yang disuntikkan ke
`READING.BAS` lewat `CHAIN MERGE "words", 75, ALL`. Lihat [READING.md](READING.md)
untuk mekanismenya.

Nomor baris 10000 ke atas dipilih supaya tidak bertabrakan dengan `READING.BAS`
yang memakai baris 5–75. Itu **kontrak antarmodul**, dan satu-satunya yang
mencegah keduanya saling menimpa saat digabung.

Perhatikan bahwa daftar katanya tidak acak — tiap baris adalah satu **pola
fonetik**: baris 10000 vokal 'a' pendek, 10010 vokal 'e', 10020 vokal 'i',
10030 'u', 10040 'o'. Lalu 10050 akhiran ganda (ll, ss, ff), 10060 akhiran
'-sk'/'-ck', 10070 'sh', 10080 'ch'/'-tch'.

Jadi ini bukan sekadar daftar kata — ini **kurikulum membaca yang tersusun**,
dari yang paling sederhana ke yang lebih kompleks. Datanya membawa struktur
pedagogis, dan itu terbaca hanya kalau Anda memperhatikan urutannya.

## Yang bisa dipelajari

- Data bisa membawa struktur. Urutan baris di sini adalah kurikulum, bukan kebetulan.
- Berkas data murni yang dipisahkan dari programnya bisa disunting oleh orang yang bukan pemrogram — misalnya guru.

## Yang jangan ditiru

- Berkas berekstensi `.BAS` yang bukan program. Namanya menyesatkan, dan tidak ada satu pun komentar di dalamnya yang menjelaskan ia milik siapa.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not, `SOUND` — nada mentah (frekuensi, durasi), `DRAW` — bahasa makro menggambar garis, `PAINT` — mengisi area tertutup, `USR`/`CALL` — panggil rutin bahasa mesin, `WHILE`/`WEND` — perulangan berkondisi, `COLOR` — warna teks

### Sepuluh baris pembuka

```basic
10000 DATA fat,cat,act,can,fast,hat,hand,last,man,ran,have
10010 DATA red,hen,let,get,help,next,pet,men,went,bed,said
10020 DATA big,pig,fir,did,swim,six,dig,win,sit,hit,been
10030 DATA rug,bug,jump,hunt,fun,must,cup,bus,cut,run,of,from
10040 DATA hot,pond,got,hop,not,dog,log,lost,soft,on,was,want
10050 DATA glass,grass,bell,dress,will,still,off,cross,fuss,stuff,roll
10060 DATA milk,truck,ask,back,mask,neck,desk,sick,silk,rock
10070 DATA fish,dish,brush,splash,wish,ship,shop,shed,shut,shelf,wash
10080 DATA rich,witch,lunch,catch,ranch,pitch,such,match,much,stretch,watch
10090 DATA that,this,them,than,then,thin,bath,thick,with,cloth,both
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
