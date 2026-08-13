# FOOTBALL — formasi bertahan Anda memilih hasil serangan lawan

> Port web: [`web/games/football/`](../games/football/index.html) ·
> Sumber: [`run/FOOTBALL.BAS`](../../run/FOOTBALL.BAS) (345 baris) ·
> Analisis BASIC: [`reviews/FOOTBALL.md`](../../reviews/FOOTBALL.md)

*Head Coach*, Friendlyware PC Introductory Set. Baris pertamanya berbunyi
`10 '7/29/82:09:00pm` — bertanggal sampai ke jamnya, semacam nomor build.

---

## 1 · Satu tabel, dua arah

Seluruh permainan ini bersandar pada satu larik 10×5:

```basic
590  FOR I=1 TO 10:FOR J=1 TO 5:READ YRD(I,J):NEXT J,I
870  POSI=VAL(P$)          ' bertahan: nomor formasi 1..5
1340 POSI=VAL(P$)          ' menyerang: nomor permainan 1..7
1050 YDS=YDS-YRD(RW,POSI)  ' dipakai KEDUA arah
```

Tidak ada tabel kedua untuk pertahanan. Nomor formasi yang Anda tekan masuk ke
`POSI`, dan `POSI` adalah **kolom yang sama** yang dibaca ketika Anda menyerang.
Jadi memilih formasi bertahan bukan memilih cara menghadang — ia memilih dari
kolom mana hasil serangan komputer diambil.

Kolom 5 (*Long Bomb* menyerang, *Long Pass* bertahan) berisi 40, 50, dan **dua**
angka 99 dalam sepuluh baris yang terpakai. Memilihnya sebagai formasi bertahan
berarti memberi komputer 10 % peluang 40 yard dan 10 % peluang 50 yard —
ditukar dengan 20 % peluang Anda merebut bola.

Kolom 1 (*Line Plunge* / *Goal Line*) tidak punya satu pun kode khusus: aman,
kecil, membosankan. Itulah seluruh strategi permainan ini — dan aslinya tak
pernah memperlihatkan tabelnya. Port ini memperlihatkannya, lengkap dengan
rata-rata dan peluang tiap kolom yang dihitung dari tabelnya sendiri.

**Kode 98 dan 99 bertukar arti** menurut siapa yang memegang bola:

| nilai | Anda menyerang | Anda bertahan |
|---|---|---|
| 99 | `!!!! I Intercepted !!!!` | `!!! You Intercepted !!!` |
| 98 | `!!!! Sorry, You Fumbled !!!!` | `!!!! Oops , I Fumbled !!!!` |

Angka yang sama membuat Anda kehilangan bola atau merebutnya. Itu bukan
kesalahan — itu penghematan yang cerdas, dan satu-satunya tempat di berkas ini
yang benar-benar memakai simetri alih-alih menyalin kode.

---

## 2 · Indeksnya meleset di kedua ujung

```basic
1780 R=RND*10
1790 RW=FIX(R)              ' menghasilkan 0..9
590  FOR I=1 TO 10 ...      ' mengisi baris 1..10
```

`RW` bernilai **0 sampai 9**; tabelnya diisi pada **1 sampai 10**. Akibatnya
dua-duanya:

- **Baris 0 tidak pernah diisi.** Di GW-BASIC larik yang belum diisi berisi nol,
  jadi satu dari sepuluh permainan **selalu** menghasilkan nol yard — apa pun
  yang Anda pilih, di kolom mana pun. Sepuluh persen dari seluruh pertandingan
  adalah *No Gain* yang sudah ditentukan sebelum Anda menekan apa-apa.
- **Baris 10 tidak pernah dipakai.** Kelima angkanya — 2, 0, 4, 2, 0 — dibaca
  dari `DATA`, disimpan, lalu tidak pernah disentuh.

Dan kode `100` (touchdown langsung dari tabel) diperiksa di baris 1040 dan 1500,
padahal **tidak ada satu pun angka 100** di dalam kedua baris `DATA`. Halaman
port ini menyapu keduanya dan melaporkannya sendiri. Touchdown hanya bisa
terjadi lewat melewati garis gol.

Tombol **`0`** juga sah: baris 850 dan 1320 hanya menolak di luar rentang
`0`–`5` dan `0`–`7`. Menekan nol adalah permainan yang legal, dan ia membaca
kolom 0 yang juga tidak pernah diisi. Dipertahankan, dan diberi tombolnya
sendiri.

---

## 3 · Lima puluh angka disalin untuk mengubah satu — lalu tidak dipakai

```basic
3020 DATA 0,2,14,10,0,2,98,0,8,40, ...     ' 50 angka
3030 DATA 0,2,14,10,0,2,98,6,8,40, ...     ' 50 angka
```

Baris 590 membaca tepat 50 angka, dan baris 3020 sudah menyediakan 50. Baris
**3030 tidak pernah tersentuh** — dan `RESTORE` di baris 2990 mengembalikan
pembacaan ke awal, jadi ia tetap tidak terpakai pada pertandingan kedua, ketiga,
seterusnya.

Bedanya dengan 3020 **tepat satu angka**: yang ke-8, yaitu baris 2 kolom 3
(*Screen Pass* / *Long Run*), `0` menjadi `6`. Port ini membandingkan keduanya
angka demi angka dan menuliskan hasilnya di layar.

Hampir pasti ini tabel varian yang sedang dicoba penulisnya — mungkin
"pertahanan lari yang lebih lemah" — lalu tidak pernah disambungkan.

---

## 4 · Duplikasi yang melahirkan bug, persis seperti diramalkan

[Analisis BASIC-nya](../../reviews/FOOTBALL.md) sudah menandai bentuknya: empat
blok kejadian ditulis dua kali, satu untuk pemain dan satu untuk komputer,
karena tidak ada parameter "siapa yang mencetak angka". Konsekuensi yang
diramalkan muncul persis — dua kali, dan keduanya tanda perbandingan yang lupa
dibalik saat menyalin:

```basic
2520 IF NPS<25 AND RW<9 THEN ... Good
2530 IF NPS<30 AND RW<7 THEN ... Good
2540 IF NPS>35 AND RW<5 THEN ... Good      <-- seharusnya <
2550 IF NPS<38 AND RW<4 THEN ... Good

2690 IF NPS>55 AND RW<9 THEN ... Good
2700 IF NPS>50 AND RW<7 THEN ... Good
2710 IF NPS<45 AND RW<5 THEN ... Good      <-- seharusnya >
```

Keduanya berada di dalam cabang untuk quarter 2/4, tempat arah serangan
terbalik. Efeknya: sebuah field goal kadang berhasil dari jarak yang seharusnya
mustahil.

**Keduanya dipertahankan**, dan kalau sebuah field goal lolos *justru* lewat
baris yang tandanya terbalik, catatan pertandingan menyebut nomor barisnya.

Perhatikan juga jumlah tingkatnya: field goal **Anda** punya empat tingkat
(25/30/35/38), field goal **komputer** hanya tiga (25/30/35). Bukan
penyeimbangan yang disengaja — satu blok memang lebih pendek dari yang lain.

---

## 5 · Hasil tiap permainan ditentukan detik jam

```basic
1750 S$=RIGHT$(TIME$,2)
1760 N=VAL(S$)
1770 RANDOMIZE(N)
1780 R=RND*10
1790 RW=FIX(R)
```

Ini dipanggil **sebelum setiap permainan**, bukan sekali di awal. `RANDOMIZE(N)`
menyetel benih dari detik jam dinding, lalu satu `RND` diambil. Jadi `RW` adalah
fungsi murni dari detik — hanya **60 masukan yang mungkin**, dan dua permainan
yang jatuh di detik yang sama memberi hasil yang **sama persis**.

Di mesin secepat sekarang, satu putaran penundaan baris 1470 selesai dalam
sepersekian detik. Anda bisa menekan beberapa permainan di dalam satu detik yang
sama dan mendapat hasil identik berturut-turut.

Bandingkan dengan tiga saudaranya di koleksi ini: [WILDCAT](wildcat.md) mencoba
melebarkan benihnya dengan `RANDOMIZE(RND*30000)` yang tidak menambah satu bit
pun; [GOLF](golf.md) menyemai ulang selagi menunggu tombol, sehingga pemainlah
yang memilih benihnya — obat yang bekerja; dan [METEOR](meteor.md) mengaduknya
dengan `(R+511) MOD 32003`. Empat berkas, empat cara, satu kesalahpahaman yang
sama tentang apa yang dilakukan `RANDOMIZE`.

---

## 5b · Dua regu, karena angka saja tidak mengajari apa pun

Aslinya tidak punya gerak sama sekali: baris 1470 hanya mengedipkan tulisan
`PLAY IN PROGRESS` sebanyak `DELAY` kali, lalu mencetak hasilnya sebagai satu
kalimat. Port ini menambahkan **tampilan dari pinggir lapangan** — dua regu
sebelas lawan sebelas, snap, serah terima atau lemparan, pembawa bola berlari,
bertahan menutup, dan hasilnya sebagai papan besar.

Kecepatannya dikarang, jadi dikarang dari angka yang benar:

| gerak | kecepatan | asalnya |
|---|--:|---|
| lari | 8,0 yard/detik | pelari NFL menempuh 40 yard dalam ~4,5 detik |
| mundur QB | 6,0 yard/detik | — |
| bola melambung | 18 yard/detik | operan menengah |
| penjegal | 7,2 yard/detik | sedikit lebih lambat dari pembawa bola |

Tinggi lambungan operan ikut jaraknya — operan pendek datar, *long bomb*
tinggi. Itu satu-satunya isyarat visual yang membedakan kolom 3, 4, dan 5 tanpa
membaca tabel.

**Yang mengikat gambar pada aturan:** angka di label bola selalu sama dengan
angka di catatan permainan. Diukur pada enam belas permainan berturut-turut
dengan segala jenis hasil (gain, loss, sack, incomplete, fumble, intersep,
punt, field goal): **nol ketidakcocokan**.

Tiga cacat ditemukan dan diperbaiki dalam pemeriksaan itu, dan ketiganya jenis
yang sama — gambar yang tidak sampai ke angkanya sendiri:

1. **Easing pelari tidak pernah mencapai 1.** Rumus `t<0,85 ? t : 0,85+(t-0,85)×0,4`
   berhenti di 0,91, jadi pelarinya mati sembilan persen sebelum sasaran dan
   labelnya menuliskan −1 yard untuk permainan yang hasilnya 0.
2. **Label operan memakai jarak tempuh bola dari QB**, yang sudah mundur lima
   yard — jadi operan 8 yard tertulis "16 yd". Benar untuk bolanya, salah untuk
   permainannya.
3. **Yard negatif pada operan diterbangkan sebagai operan**, padahal baris 2850
   menyebutnya *Quarterback Sacked*: bolanya tidak pernah lepas. Sekarang
   QB-nya yang dijatuhkan.

Dan sebuah audit terpisah terhadap **aturan football sungguhan** — bukan
terhadap BASIC-nya — menemukan empat hal lagi:

5. **Sack digambar berlari maju.** QB dimundurkan lima yard dulu (ke −8,2 dari
   garis) baru dipindahkan ke titik jegal. Untuk sack 2 yard itu berarti ia
   berlari **maju enam yard** ke arah pertahanan lalu dinyatakan *sacked*. Di
   football, titik jegal itulah akhir mundurnya — sekarang satu gerakan mundur
   langsung ke sana.
6. **Operan tidak lengkap jatuh di garis scrimmage.** Bola yang dilempar tetap
   melayang ke arah penerima lalu jatuh di sana; ia tidak mati di kaki
   quarterback. Sekarang dilempar 9–15 yard ke hilir dan berlabel `PASS`
   sepanjang terbang, supaya tidak terbaca sebagai perolehan.
7. **Intersep mendarat di rumput kosong.** Bola jatuh, lalu papan berbunyi
   *INTERCEPTED* — kejadian tanpa gambar, persis pelanggaran aturan yang sudah
   ditulis untuk [TRUCKER](trucker.md). Sekarang seorang *cornerback* atau
   *safety* menunggu di titik tangkap.
8. **Tidak ada garis gol.** Touchdown di layar hanyalah lari panjang yang
   tiba-tiba diberi papan besar. Sekarang jaraknya dihitung permainan dari
   `OPS` (kolom 64 dan 16, satu kolom dua yard) dan endzone-nya digambar, jadi
   sebab dari skornya terlihat.

Empat-empatnya jenis yang sama dengan tiga cacat sebelumnya: bukan salah kode,
tapi gambar yang menceritakan hal yang tidak terjadi.

Satu penyederhanaan yang **disengaja** dan disebut di sini supaya tidak dikira
cacat: tampilan samping selalu menghadap ke arah serangan, jadi penyerang selalu
bergerak ke kanan meskipun quarter 2 dan 4 menukar sisi. Pertukaran sisinya
tetap terjadi dan terlihat di peta atas; kameranya yang tidak ikut berputar.

Dan satu cacat alur yang muncul karena lapisan gambar membuat `jalankan()`
menjadi `async`: **kuncinya dipasang sesudah cabang animasi**, jadi ketika
animasi dimatikan ada celah tanpa kunci antara satu klik dan kelanjutannya —
klik kedua masuk ke permainan yang belum selesai dan hasilnya tertelan. Terlihat
sebagai pertandingan 123 permainan yang berakhir 0–0. Kuncinya dipindah ke atas
cabang.

Aliran acak hiasan (pemilihan penerima operan) terpisah dari aliran permainan.
Buktinya: pertandingan penuh dengan animasi mati tetap berakhir **123 permainan,
28–20, 125 baris catatan** — sama persis dengan sebelum lapisan gambar ada.

---

## 6 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Lapangan sebagai kolom teks 15–65, bola satu karakter `CHR$(16)`/`CHR$(17)` | layar teks 80×25 | Satu kolom = dua yard, dan itu ada rumusnya di baris 2780 | **Lapangan dari atas** dengan garis gol tepat di kolom 16 dan 64, garis tiap 5 yard, dan angka yard yang dihitung dari `YLN=(NPS-15)*2` — bukan dibagi rata |
| Tabel hasil tidak pernah ditampilkan | tidak ada tempat di layar | Pemain menebak selama empat quarter | **Ditampilkan seluruhnya**, dengan baris 0 dan 10 dicoret sebagai baris mati, plus rata-rata dan peluang tiap kolom. Ini menambah pengetahuan, bukan aturan — dan tanpanya §1 tidak bisa diperiksa |
| Nomor permainan diketik lewat `INKEY$` | — | — | Tombol bernama, termasuk tombol **0** yang aslinya juga sah |
| `RANDOMIZE VAL(RIGHT$(TIME$,2))` per permainan | tidak ada sumber acak | Hasil ditentukan jam, bukan pemain | Kotak **Benih**. Sifatnya dipertahankan — satu angka 0–59 memilih seluruh hasil, dan angka itu **dicetak di catatan tiap permainan** — tapi pertandingannya jadi bisa diulang |
| Penundaan `FOR HOLD=1 TO DELAY` sambil mengedipkan "PLAY IN PROGRESS" | tidak ada jam | Waktu diukur dengan menghitung pekerjaan | Dibuang. Di mesin sekarang ia nol detik; menirunya berarti meniru bug, bukan permainan |
| Dua bug tanda di field goal (2540, 2710) | penyalinan blok tanpa parameter | — | **Dipertahankan**, dan disebut di catatan kalau benar-benar terpakai |
| Musik `PLAY` panjang di akhir babak (3190–3310) | pengeras suara satu pencacah | — | Diterjemahkan ke potongan pendek lewat penafsir bersama |
| Skor seri tidak dicetak apa pun (2940 dan 2950 keduanya `>`) | — | — | **Dipertahankan**, dan dijelaskan di panel akhir |

---

## 7 · Latihan

1. Mainkan satu quarter dengan **selalu memilih formasi 1** (*Goal Line*).
   Bandingkan dengan satu quarter yang **selalu memilih formasi 5**. Tabel di
   panel sudah memberi tahu Anda hasilnya sebelum Anda mencoba.
2. Perhatikan angka `[detik n → baris r, kolom k]` di tiap baris catatan. Cari
   dua permainan dengan detik yang sama; barisnya pasti sama juga.
3. Hitung berapa kali `No Gain` muncul dalam satu pertandingan penuh. Sepuluh
   persen di antaranya bukan kebetulan — itu baris 0 yang tidak pernah diisi.
4. Lihat baris 2 kolom 3 di tabel: `0`. Baris `DATA` yang mati akan
   membuatnya `6`. Seberapa besar bedanya bagi *Screen Pass*?
5. Ganti benih dan mainkan urutan tombol yang sama. Hasilnya identik — di
   aslinya tidak akan, karena benihnya jam dinding.

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/FOOTBALL.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
