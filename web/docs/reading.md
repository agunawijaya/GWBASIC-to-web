# READING + WORDS — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/READING.BAS` (39 baris) + `run/WORDS.BAS` (36 baris) |
| Penerbit | FriendlyWare |
| Hasil port | [`../games/reading/`](../games/reading/index.html) |
| Analisis BASIC | [`../../reviews/READING.md`](../../reviews/READING.md) |

**Tachistoscope** — alat latih kecepatan baca. Sebuah kata dikilatkan
sebentar, pemakai mengetik apa yang sempat terbaca. Benar, kilatannya
dipersingkat; salah, dipanjangkan.

Tiga puluh sembilan baris, dan di dalamnya satu mekanisme yang tidak muncul di
mana pun lagi dalam koleksi ini.

---

## 1 · Data yang disisipkan ke program yang sedang jalan

```basic
74 CHAIN MERGE "words", 75, ALL
75 GOSUB 1000:T1=1000:T4=100…
```

`CHAIN MERGE` memuat `WORDS.BAS` **ke dalam program yang sedang berjalan**,
menggabungkan baris-barisnya, lalu meneruskan eksekusi di baris 75. `ALL`
berarti seluruh variabel dipertahankan.

Ini bukan `RUN "words"`, yang akan **membuang** programnya. Ini
**penyisipan**: sesudah baris 74, program yang berjalan adalah `READING`
*plus* 36 baris `DATA` yang tadinya berkas terpisah.

| | |
|---|---|
| `READING.BAS` | baris 5 – 2020 |
| `WORDS.BAS` | baris **10000 – 10350** |

Jarak itu bukan gaya — ia satu-satunya cara mencegah tabrakan. **Nomor baris
adalah ruang nama, dan pemisahannya dijaga oleh kesepakatan, bukan oleh
bahasa.** Kalau `WORDS.BAS` kebetulan memakai nomor 100, ia akan menimpa
baris 100 milik induknya dan tidak ada yang memperingatkan.

Satu-satunya `CHAIN MERGE` di seluruh koleksi. Sepupunya yang lebih kasar:
`RUN "nama"` yang dipakai [INTRO](intro.md) dan [HISTORY](history.md) — itu
membuang semua variabel; yang ini tidak.

> **Pelajaran.** Memisahkan data dari kode tidak butuh sistem berkas yang
> canggih — ia butuh **kesepakatan tentang ruang nama** dan cara menggabungkan
> keduanya kembali. BASIC 1982 punya keduanya, dan tidak ada satu pun yang
> memaksa mereka dipatuhi.

---

## 2 · Menghitung isi `DATA` dengan sengaja menabraknya

```basic
1000 ON ERROR GOTO 1050
1010 RESTORE:L=0
1020 READ X$:L=L+1:GOTO 1020
1050 RETURN
```

Perulangan tanpa syarat berhenti. Ia membaca butir demi butir sampai `DATA`
habis, dan **galat "Out of DATA"-lah yang menghentikannya**. Penangan galat
langsung `RETURN`, membawa `L` berisi jumlahnya.

Kenapa begitu? Karena BASIC tidak punya cara bertanya *"ada berapa butir
`DATA`?"*. Dan menuliskan jumlahnya sebagai angka akan salah begitu ada yang
menambah satu baris ke `WORDS.BAS` — yang justru bentuk yang paling mungkin
terjadi pada berkas data.

Jadi ini bukan penyalahgunaan; ini **satu-satunya cara** membuat jumlahnya
selalu benar. Hasilnya **398 butir**, dihitung ulang tiap kali program
dijalankan.

Harganya: `ON ERROR` menyala selama perulangan itu, jadi galat apa pun yang
lain juga akan diam-diam masuk ke `RETURN`. Baris 1050 tidak pernah memeriksa
**galat apa** yang terjadi — `IF ERR<>4 THEN ...` akan menutup lubang itu
dalam satu baris, dan tidak ditulis.

> **Pelajaran.** Galat sebagai alat kendali alur bukan dosa; galat yang
> **tidak diperiksa jenisnya** iya. Bedanya satu baris.

---

## 3 · Satu dari enam pujian kosong

```basic
78  C(1)="Right":C(2)="Correct":C(3)="Absolutely"
    C(4)="You're doing OK!":C(5)="I knew you'd get that one"
…
500 COLOR 0,7:I=RND(6)*6+1:X=40-LEN(C(I))/2:LOCATE 12,X:PRINT C(I)
```

Lima pujian didefinisikan: `C(1)` sampai `C(5)`. Tapi `RND(6)*6+1`
menghasilkan nilai di rentang **[1, 7)**, dan indeks larik BASIC memotong ke
bawah — jadi `I` bisa **6**.

`C(6)` tidak pernah diisi, dan larik string BASIC berisi string kosong. Jadi
**satu dari enam jawaban benar** dihargai dengan tidak ada apa-apa. Bunyi
kemenangannya tetap berbunyi; layarnya diam.

Diukur di port dengan pengacaknya sendiri, 60.000 undian:

| | |
|---|--:|
| Pujian kosong terukur | **16,40%** |
| Teori (1 dari 6) | 16,67% |

Perbaikannya satu aksara: `RND(6)*5+1`.

> **Pelajaran.** Cacatnya nyaris mustahil terlihat dari membaca, karena yang
> salah adalah **hubungan** antara baris 78 dan baris 500 — keduanya benar
> kalau dibaca sendiri-sendiri. Jumlah anggota sebuah larik dan batas
> pengacaknya adalah satu fakta yang ditulis di dua tempat, dan tidak ada apa
> pun yang menjaganya tetap satu.

---

## 4 · Satu kesalahan memperlambat kemajuan selamanya

```basic
75  T1=1000:T4=100      ' awal
520 T1=T1-T4:RETURN     ' benar  -> kilatan dipersingkat
600 PLAY "n50n25":T4=10 ' salah  -> langkahnya diperkecil
650 T1=T1+T4:RETURN     ' salah  -> kilatan dipanjangkan
```

`T4` adalah besar langkah. Ia mulai dari 100 dan **diubah jadi 10 pada
kesalahan pertama** — lalu tidak pernah dikembalikan.

| Untuk turun dari 1000 ke 500 | Jawaban benar yang dibutuhkan |
|---|--:|
| sebelum kesalahan pertama | **5** |
| sesudah kesalahan pertama | **50** |

Apakah ini disengaja? Bisa dibaca sebagai *"melangkah lebih hati-hati sesudah
gagal"* — itu masuk akal sebagai pedagogi. Yang membuatnya meragukan: tidak
ada jalan kembali, dan tidak ada komentar.

> **Pelajaran.** Sebuah keputusan pedagogis dan sebuah kelalaian terlihat
> persis sama di dalam kode. Satu baris komentar akan memisahkan keduanya
> selamanya, dan empat puluh tahun kemudian kita masih menebak.

---

## 5 · Lama kilatan diukur dalam putaran, bukan detik

```basic
140 FOR I=1 TO T1:NEXT I:CLS
```

Perulangan kosong sebanyak `T1` putaran. Bukan `SLEEP`, bukan pembacaan jam —
hanya membuang waktu prosesor.

Akibatnya, **lama kilatan ditentukan kecepatan mesin**. Pada PC 4,77 MHz,
seribu putaran `FOR/NEXT` yang ditafsirkan GW-BASIC memakan sekitar empat
persepuluh detik. Pada mesin sekarang, perulangan yang sama selesai dalam
mikrodetik — katanya tidak akan pernah terlihat sama sekali.

Karena itu port ini **tidak bisa** meniru baris 140 apa adanya. Yang ditiru
adalah *angkanya*: `T1` tetap berjalan dari 1000 dan berubah dengan aturan
yang sama, lalu dikalikan sebuah konstanta milidetik yang **bisa digeser
pemakai** — karena angka aslinya memang tidak pernah tertulis di mana pun,
dan menebaknya diam-diam akan menyamarkan bahwa ia tebakan.

Ironi kecilnya: program yang sama punya rutin tunggu yang **membaca jam**
(baris 2000–2020), dan memakainya untuk pekerjaan yang jauh lebih remeh —
jeda lima detik sebelum kata muncul. Cara yang lebih baik ada di berkas yang
sama, dan dipakai di tempat yang salah.

---

## 6 · Jam yang mengira satu jam sama dengan dua menit

```basic
2000 T$=TIME$:T3=VAL(LEFT$(T$,2))*120+VAL(MID$(T$,4,2))*60+VAL(RIGHT$(T$,2))
```

Menit dikalikan 60, detik dikalikan 1 — benar. Jam dikalikan **120**, padahal
seharusnya **3600**.

Rumus yang sama muncul **tiga kali**: baris 75 (menyemai pengacak), 2000, dan
2010. Salah ketik yang disalin bersama barisnya.

Kenapa tidak pernah ketahuan? Karena rutin itu hanya memakai **selisih** dua
pembacaan yang berjarak lima detik. Selama keduanya jatuh di jam yang sama,
komponen jam saling menghapus dan hasilnya tepat. Ia hanya salah kalau
kilatan kebetulan melintasi pergantian jam — sekali dalam 720 kesempatan, dan
akibatnya cuma menunggu sedikit lebih sebentar.

Pola yang sama persis dengan [BIO](bio.md): rumus yang salah, dipakai lewat
pengurangan sehingga salahnya lenyap.

> **Pelajaran.** Ini kedua kalinya dalam koleksi ini. Rumus yang selalu
> dipakai sebagai **selisih** tidak pernah menguji nilai mutlaknya — jadi
> kesalahan di sana bisa hidup selamanya. Kalau sebuah fungsi hanya pernah
> dipanggil berpasangan, separuh perilakunya tidak pernah diperiksa siapa pun.

---

## 7 · `WORDS.BAS` — kurikulum membaca sebagai `DATA`

| | |
|---|--:|
| Baris `DATA` | 36 |
| Butir seluruhnya | 398 |
| Butir unik | 393 |
| Butir per baris | 9 – 13 |

Tiap baris adalah satu **keluarga fonik** — bunyi yang sama, bukan makna yang
sama. Baris 10000 semuanya /a/ pendek (`fat cat act can fast…`), 10010 /e/
pendek, 10070 bunyi *sh*, 10090 bunyi *th*. Sebuah kurikulum membaca yang
disimpan sebagai data.

### Satu koma yang hilang

```basic
10320 DATA better,never,after,under,coller,color,other,mother,water father
```

Seharusnya `…,water,father`. Komanya tertinggal, jadi `READ` membacanya
sebagai **satu butir** sepanjang dua belas aksara: `"water father"`. Kalau
butir itu terpilih, pemakai harus mengetik keduanya lengkap dengan spasinya.

Baris yang sama juga memuat `coller` — kemungkinan besar salah eja `collar`.
Keduanya dipertahankan.

### Lima kata kembar

`eight`, `five`, `four`, `one`, `six` masing-masing muncul dua kali —
kelimanya karena baris terakhir (`one two three … ten`) mengulang kata yang
sudah ada di keluarga fonik sebelumnya. Itu **bukan** cacat: baris terakhir
mengajarkan angka, bukan bunyi.

---

## 8 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Data kata | berkas terpisah, `CHAIN MERGE` (§1) | tidak ada berkas data | `words.js` yang menetapkan `window.RETRO.READING_WORDS` — batasan `file://` melarang `fetch()`, jadi bentuknya mirip: data yang disisipkan sebagai kode |
| Jumlah butir | dihitung dengan menabrak galat (§2) | tidak ada cara bertanya | Dihitung dari datanya, bukan ditulis sebagai angka — bentuk yang sama, tanpa galatnya |
| Pujian kosong | 1 dari 6 (§3) | `RND(6)*6+1` vs `C(1..5)` | **Dipertahankan**, dan dihitung di papan angka |
| `T4` tidak kembali | (§4) | — | **Dipertahankan**, ditandai `↓` saat berubah |
| Lama kilatan | putaran perulangan (§5) | tidak ada pewaktu | **Tidak bisa ditiru.** `T1` dipertahankan sebagai angka, dikalikan konstanta ms yang bisa digeser |
| Jam ×120 | (§6) | salah ketik yang disalin 3× | **Tidak diport** — port memakai pewaktu sungguhan. Dijelaskan sebagai temuan |
| Perbandingan jawaban | `IF R=S`, peka huruf | — | **Dipertahankan persis** |
| `INPUT R` | berhenti di koma | perilaku `INPUT` | Kolom teks biasa. Tidak ada butir berkoma, jadi tidak ada beda perilaku |
| Bunyi | `PLAY "mbc16c16c16ge8g"` / `"n50n25"` | pengeras suara PC | **Dipertahankan persis** lewat `_shared/audio.js` |
| Salah ketik `"a short phase"` | baris 40 | — | **Dipertahankan** — teks aslinya tidak diperbaiki |

---

## 9 · Latihan

1. **Hitung ambang Anda.** Mulai dari 1000 dan jangan pernah salah. Berapa
   jawaban benar sampai Anda tidak bisa lagi membacanya? Kalikan dengan
   konstanta ms Anda — itu ambang tachistoskopik Anda dalam milidetik.

2. **Perbaiki pujiannya.** Ubah `RND(6)*6+1` jadi bentuk yang benar. Sekarang
   tambahkan pujian keenam ke baris 78 — baris mana lagi yang harus ikut
   berubah, dan bagaimana pembaca berikutnya bisa tahu?

3. **Cari komanya.** Selain baris 10320, adakah baris `DATA` lain yang
   butirnya mencurigakan — terlalu panjang, atau tidak cocok dengan keluarga
   fonik barisnya?

4. **Uji `ON ERROR`-nya.** Kalau `WORDS.BAS` gagal disisipkan sama sekali,
   apa yang terjadi di baris 1020, dan apa yang dilihat pemakai?

---

Berkas terkait: [pakai](../games/reading/index.html) ·
[BIO — rumus salah yang lenyap lewat pengurangan](bio.md) ·
[INTRO — `RUN` yang membuang variabel](intro.md)
