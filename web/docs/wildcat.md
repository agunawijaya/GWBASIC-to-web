# WILDCAT — permainan yang petunjuknya menyesatkan

> Port web: [`web/games/wildcat/`](../games/wildcat/index.html) ·
> Sumber: [`run/WILDCAT.BAS`](../../run/WILDCAT.BAS) (296 baris) ·
> Analisis BASIC: [`reviews/WILDCAT.md`](../../reviews/WILDCAT.md)

Diperbarui terakhir **17 Juli 1982** oleh **A. Vanchura**. Anda pemilik
perusahaan pengeboran independen: pinjaman $1.000.000, sepuluh sumur, peta Boom
County 10×10.

Sekilas ini simulasi keberuntungan sederhana. Ia bukan — dan yang membuatnya
menarik adalah bahwa satu kalimat di layar petunjuknya, yang setiap katanya
benar, membujuk pemain ke arah yang salah selama empat puluh tahun.

---

## 1 · Petunjuknya mengarahkan ke pilihan terburuk

```basic
2500 "The deeper you drill a well, the less chance you have of finding
2510  oil or gas, but the chance of finding huge strikes increases.
2520  Shallow wells are more likely to produce."
```

Kalimat pertama benar. Kalimat kedua benar. Kalimat ketiga juga benar. Dan
gabungannya menyesatkan, karena yang tidak dikatakan adalah **berapa besar**.

Halaman portnya menghitung nilai harapan tiap zona langsung dari tabel `HIT`
dan `PAY` di `DATA`:

| Zona | Kedalaman | Ada tanda | E[pendapatan kotor] | Biaya khas | **E[laba tahun 1]** |
|---|---|--:|--:|--:|--:|
| dangkal | 4.000–7.000 ft | **75 %** | $263.484 | $167.244 | **$96.240** |
| sedang | 7.500–10.000 ft | 50 % | $376.151 | $307.244 | **$68.907** |
| dalam | 10.500–15.000 ft | **25 %** | $925.835 | $427.244 | **$498.591** |

Zona **dalam** kering tiga dari empat kali — dan laba harapannya tetap **lima
kali lipat** zona dangkal. Pemain yang mengikuti nasihat *"shallow wells are
more likely to produce"* memilih zona dengan nilai harapan terendah kedua.

Yang lebih tajam: **zona sedang tidak pernah masuk akal.** Ia lebih mahal
daripada dangkal *dan* laba harapannya lebih kecil — dominasi ketat, dalam arti
teknisnya. Sekitar **14 %** situs di peta adalah pilihan yang secara matematis
tidak pernah benar, dan tidak ada apa pun di layar yang memberi tahu.

> Ini jenis temuan yang hanya muncul kalau tabel `DATA`-nya benar-benar
> dihitung, bukan dibaca sekilas. Angka di tabel atas dihitung ulang oleh
> halaman portnya sendiri tiap kali dimuat, dari `wildcat-data.js` yang
> diekstraksi langsung dari berkas 1982-nya.

---

## 2 · Peluangnya tidak pernah membaca kedalaman yang Anda ketik

```basic
570 TRY=FIX(RND*40)+1
580 PAYOFF=HIT(TYPE,TRY)
590 IF PAYOFF>1 THEN 930
```

`TYPE` ditentukan situsnya (1, 2, atau 3). `TRY` acak. **Kedalaman tidak muncul
di mana pun.** Jadi "makin dalam makin kecil peluangnya" berlaku antar *jenis
zona*, tidak berlaku di dalam satu zona.

Sebaran `HIT`, dibaca dari `DATA` 2160–2180:

| Zona | 1 (kering) | 2 | 3 | 4 | 5 |
|---|--:|--:|--:|--:|--:|
| dangkal | 10 | 6 | 10 | 8 | 6 |
| sedang | 20 | 6 | 6 | 4 | 4 |
| dalam | **30** | 8 | — | — | 2 |

Empat puluh entri tiap zona. Nilai `1` berarti kering; sisanya menunjuk baris
mana di tabel `PAY` yang dipakai.

### 2b · Dan karena itu, undian gratis di baris 850

```basic
850 IF DPT>=DT THEN 880
…
920 CSF=CSF+30*(DPT-DT):DT=DPT:GOTO 510
```

Perhatikan `>=`. Mengetik kedalaman yang **sama persis** dengan kedalaman
sekarang lolos ujian, lalu baris 920 menambahkan `30 × 0 = $0` ke biaya dan
mengembalikan alur ke 510 — yang segera mengundi `TRY` baru di 570.

Undian kedua, gratis. Dan ia bekerja **justru karena** peluangnya tidak membaca
kedalaman: tidak ada satu pun aturan yang bisa membedakan "menggali 500 kaki
lebih dalam" dari "menggali nol kaki lebih dalam" selain tagihannya.

Pemain yang mengira lebih dalam berarti lebih berisiko membayar $30 per kaki
untuk sesuatu yang tidak mengubah apa pun kecuali saldo kasnya.

---

## 3 · Satu larik datar yang sebenarnya tabel dua kolom

```basic
1010 HIT=FIX(FIX(RND*10)*2)+1
1020 OPD=PAY(HIT,PAYOFF,TYPE)
1030 GSP=PAY(HIT+1,PAYOFF,TYPE)*1000
```

`FIX(FIX(RND*10)*2)+1` hanya bisa menghasilkan bilangan **ganjil**: 1, 3, 5, …,
19. Jadi dua puluh angka di tiap baris `DATA` sebenarnya **sepuluh pasang** —
indeks ganjil barel minyak per hari, indeks berikutnya ribu kaki kubik gas per
hari.

```basic
2200 DATA 54,0, 13,240, 0,370, 112,0, 41,600, 0,514, 70,112, 95,0, 0,301, 62,98
```

Dibaca berpasangan, isinya masuk akal seketika: ada sumur minyak murni (54, 0),
ada sumur gas murni (0, 370), ada yang keduanya (13, 240). Dibaca sebagai dua
puluh angka lepas — yang adalah bentuk aslinya di berkas — ia tidak berarti
apa-apa.

Ini kerabat dekat temuan `LANDER.BIN` ([lander.md](lander.md) §1): **bentuk
larik yang dipaksakan bahasa menyembunyikan struktur data yang sebenarnya.**
Di LANDER, 39 array bernomor menyembunyikan satu array tiga dimensi. Di sini,
satu dimensi 20 menyembunyikan dua kolom.

---

## 4 · Sepertiga tabelnya tidak mungkin dibaca — dan itu bukan kecerobohan

`PAY(20,5,3)` berisi **300** nilai. Seratus di antaranya tidak punya jalan
masuk:

| Sebab | Nilai mati |
|---|--:|
| `PAYOFF = 1` berarti kering; baris 590 tidak pernah sampai ke tabel | 60 |
| Tabel `HIT` zona **dalam** tidak berisi angka 3 maupun 4 | 40 |
| **Jumlah** | **100 (33 %)** |

Dan **keseratus nilai itu nol**.

Itu yang membuatnya menarik: nol bukan kebetulan, ia **tanda bahwa penulisnya
sadar**. Ia butuh larik berbentuk persegi 3×5×20 supaya `READ` tiga gelung
bersarang (baris 2100–2140) berjalan lurus tanpa cabang, jadi sel yang mustahil
diisi nol sebagai ganjalan.

Bentuk larik mendikte data, bukan sebaliknya. Kalau `PAY` bisa berbentuk gerigi,
sepertiga `DATA`-nya tidak perlu ada.

---

## 5 · Enam puluh permainan, walaupun penulisnya berusaha

```basic
70 RANDOMIZE(VAL(RIGHT$(TIME$,2)))
80 RANDOMIZE(RND*30000)
```

Baris 80 adalah usaha memperlebar ruang benih: benih kedua diambil dari
bilangan acak pertama, dikali 30.000. Tapi bilangan pertama itu **sepenuhnya
ditentukan** oleh benih pertama, yang hanya punya enam puluh nilai. Enam puluh
detik masuk, enam puluh permainan keluar — hanya tersebar lebih jauh di dalam
jangkauan.

Ini keluarga yang sama dengan [LANDER](lander.md) §5 (60 medan),
[ATTACK](attack.md) §4 (benih kehilangan faktor 60), dan [BATSHIP](batship.md)
§4 (86.400 waktu → 7.152 benih). Yang membedakan WILDCAT: di sini penulisnya
**sudah menyadari masalahnya** dan obatnya tidak menambah satu bit pun entropi.

---

## 6 · Enam puluh persen peta tidak pernah dicetak

```basic
2030 FOR C=0 TO 100:IF RND<0.6 THEN MAP(C,0)=2:GOTO 2070
…
1970 IF MAP(D,0)=0 THEN LOCATE A,B:PRINT Z(A/2-1) RIGHT$(STR$(C),1)
```

Situs yang diberi `MAP(C,0)=2` **namanya tidak dicetak sama sekali** — petaknya
kosong. Jadi peta Boom County bukan sekadar latar: ia sudah laporan geologi
pertama, dan rata-rata hanya sekitar **40 dari 100** petak yang punya nama.

Sebaran lengkapnya, dari empat baris 2030–2060:

| | Peluang |
|---|--:|
| kosong (tak dicetak) | 60,0 % |
| dangkal | 16,0 % |
| sedang | 14,4 % |
| dalam | 9,6 % |

Perhatikan juga `FOR C=0 TO 100`: **101 situs dibangkitkan**, padahal `A0`–`J9`
hanya memberi indeks 0–99. Satu situs dibuat tiap permainan lalu tidak pernah
bisa dipilih siapa pun. Port ini mempertahankannya — bukan demi kesetiaan buta,
melainkan supaya urutan pemanggilan `RND` tetap sama.

---

## 7 · Lima ratus kaki gratis, tiap sumur

```basic
480 MAP(C,0)=1 : CSF=SZN*30 : DT=SZN+500
```

Anda ditagih untuk `SZN` kaki, dan mata bornya berada di `SZN+500` kaki. Lima
ratus kaki — **$15.000** — tidak pernah ditagih. Laporan geologinya bahkan
mengumumkannya terang-terangan di baris 1700: *"Target Zone Starts At SZN+500
Ft."*

Nilai harapan di §1 memakai biaya yang **sebenarnya ditagih**, bukan biaya yang
seharusnya.

---

## 8 · Saksi ketiga untuk segmen video

```basic
1810 IF (PEEK(1040) AND 48)=48 THEN DEF SEG=45056 ELSE DEF SEG=47104
```

45056 = `&HB000` (monokrom), 47104 = `&HB800` (CGA) — dan pemetaannya **benar**.
WILDCAT jadi saksi **ketiga**, sesudah [SUB](sub.md) §2 dan MAZE, bahwa
`WHATMONF.BAS` di disket yang sama memetakannya *terbalik*. Tiga berkas
independen yang sepakat mengalahkan satu berkas yang menyimpang.

Peta Boom County-nya sendiri digambar dengan `POKE` aksara garis-kotak langsung
ke memori layar (baris 1820–1930), dua belas bita per petak — enam kolom × dua
bita per aksara.

---

## 9 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Peta 10×10 dari aksara garis-kotak, di-`POKE` ke memori layar | layar teks 80×25 | Petak bernama = ada prospek | Petak SVG yang **bisa diklik**; petak kosong tetap kosong, persis seperti aslinya |
| Menara bor sebagai seni aksara di tengah layar | tidak ada grafik | Hiasan | **Penampang tegak** menggantikannya: permukaan, tiga lapisan zona berwarna, mata bor pada kedalaman sebenarnya, skala kaki. Semuanya turunan dari angka yang sudah ada — tidak ada aturan baru |
| Kedalaman diketik lewat `INKEY$` dengan penyunting sendiri (baris 760–830) | tidak ada `INPUT` yang bisa dibatalkan | — | Kotak angka biasa, dengan batas `DT`…`EZN` yang sama |
| Peluang & hasil dari `HIT`/`PAY` di `DATA` | 296 baris | — | **Dipertahankan bulat-bulat**, diekstraksi ke `wildcat-data.js` oleh skrip |
| Nilai harapan tidak pernah ditampilkan | layar penuh | — | **Ditampilkan** di panel, dihitung halaman ini dari tabelnya sendiri. Ini menambah *pengetahuan*, bukan aturan — dan tanpanya temuan §1 tidak bisa diperiksa siapa pun |
| `FOR C=0 TO 100` untuk peta 100 petak | salah batas | — | **Dipertahankan**, supaya urutan `RND` sama (§6) |
| `>=` di baris 850 | salah tanda | — | **Dipertahankan**, dan dijelaskan di panel keputusan tempat ia berlaku (§2b) |
| `CSF=SZN*30` dengan `DT=SZN+500` | salah hitung | — | **Dipertahankan** (§7) |
| Dua kali `RANDOMIZE` | tidak ada sumber acak | — | Kotak **Benih**: benih sama → peta sama. Bilangan acaknya bukan bilangan GW-BASIC |
| Laporan akhir mencetak `-1000000` kalau bangkrut, berapa pun sisa kas | penyederhanaan | — | **Dipertahankan** |

---

## 10 · Latihan

1. Bor satu situs **dalam** dan satu situs **dangkal**, lalu bandingkan biaya
   dan hasilnya. Ulangi sepuluh kali dengan benih berbeda. Tabel di panel
   memberi tahu Anda apa yang *seharusnya* terjadi; lihat berapa lama sampai
   Anda mempercayainya.
2. Di layar "go deeper", ketik **kedalaman yang sama persis** dengan yang
   sekarang. Perhatikan biaya bor di papan angka: tidak bertambah. Perhatikan
   hasilnya: diundi ulang.
3. Hitung berapa banyak petak bernama di peta Anda. Apakah dekat dengan 40?
   Ulangi dengan lima benih berbeda.
4. Cari satu permainan di mana Anda bangkrut. Laporan akhirnya mencetak
   kerugian **persis $1.000.000** — berapa pun sisa kas Anda sebenarnya.
   Kenapa penulisnya memilih begitu?
5. Buka `wildcat-data.js` dan cari `PAY[2][2]` dan `PAY[2][3]` (zona dalam,
   payoff 3 dan 4). Empat puluh nol berturut-turut. Sekarang cari angka 3 atau
   4 di `HIT[2]`. Tidak ada.
6. Zona sedang: adakah *satu pun* keadaan di mana memilihnya lebih baik daripada
   zona dangkal? (Petunjuk: bandingkan bukan hanya nilai harapannya, tapi juga
   sebaran hasilnya — dan ingat bahwa kas bisa habis di tengah jalan.)

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/WILDCAT.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
