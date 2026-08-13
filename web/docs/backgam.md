# BACKGAM — dari BASIC 1986 ke web

| | |
|---|---|
| Sumber | `run/BACKGAM.BAS` — "B A C K G A M M O N" |
| Tahun | 1986 |
| Ukuran asli | 161 baris (bernomor **2430**–59990), 1% komentar |
| Hasil port | [`../games/backgam/`](../games/backgam/index.html) |
| Analisis BASIC | [`../../reviews/BACKGAM.md`](../../reviews/BACKGAM.md) |

Backgammon dua pemain **lengkap** dalam 161 baris. Bukan versi sederhana:
masuk dari bar, memukul blot, mengeluarkan bidak, dobel yang memberi empat
langkah, dan penolakan giliran saat tidak ada langkah sah — semuanya ada.

Program terpendek di sesi ini, dan yang paling padat.

---

## 1 · Satu larik untuk seluruh papan

```basic
2450 DIM A(25)
2482 A(24)=2:A(19)=-5:A(17)=-3:A(13)=5:A(12)=-5:A(8)=3:A(6)=5:A(1)=-2
```

Dua puluh empat titik, ditambah dua slot di ujung, dan **tanda** yang menyimpan
pemiliknya:

| | |
|---|---|
| `A(n) > 0` | n bidak pemain 1 |
| `A(n) < 0` | \|n\| bidak pemain 2 |
| `A(n) = 0` | kosong |

Satu angka menyimpan **dua hal sekaligus** — siapa pemiliknya dan berapa
banyak. Ini penyandian yang masih dipakai mesin catur dan backgammon sampai
sekarang, dan akibatnya besar:

- membalik papan untuk giliran lawan cukup mengalikan **−1**
- menghitung pip tidak butuh satu pun `IF`
- "titik tertutup" dan "blot" jadi dua perbandingan bilangan, bukan dua cabang

Cocokkan sendiri baris 2482: 2+5+3+5 = **15** bidak positif, dan 5+3+5+2 =
**15** negatif. Susunan pembuka backgammon yang benar, dalam satu baris.

### Slot 0 dan 25

Keduanya pengecualian, dan sengaja: mereka menyimpan **jumlah** bidak di bar
sebagai bilangan positif, bukan bertanda. `A(25)` bar pemain 1, `A(0)` bar
pemain 2.

Menaruhnya di **ujung** larik menghapus kasus khusus. Pemain 1 masuk di
`25 − dadu`, pemain 2 di `0 + dadu` — dan karena arah keduanya berlawanan,
rumus yang sama melayani keduanya tanpa satu pun percabangan.

> **Pelajaran.** Slot pembatas di ujung larik menghapus kasus khusus. Sama
> dengan pagar nol di [PEGLEAP](pegleap.md) dan larik 5×5 untuk papan 3×3 di
> [TICTAC](tictac.md) — tapi di sini slotnya bukan sekadar penjaga, ia
> menyimpan data yang benar-benar dipakai.

---

## 2 · Memukul blot dalam tiga baris

```basic
2950 A(F)=A(F)-1:IF A(T)=-1 THEN A(0)=A(0)+1:A(T)=0
2960 A(T)=A(T)+1
```

Ambil satu bidak dari titik asal; kalau titik tujuan berisi **tepat satu**
bidak lawan, pindahkan ke bar dan kosongkan; lalu taruh bidak Anda.

Seluruh aturan memukul muat di situ, dan tidak butuh satu pun percabangan
tambahan — karena `A(T) = -1` **sudah berarti** "tepat satu bidak lawan",
berkat penyandian tandanya.

Pembandingnya satu baris di atas:

```basic
2910 IF A(T)<-1 THEN 2940     ' dua bidak lawan atau lebih -> tertutup
```

Dua aturan backgammon yang paling sering salah dipahami pemain baru — kapan
sebuah titik tertutup, dan kapan ia bisa dipukul — dinyatakan sebagai **dua
perbandingan bilangan**. Tidak ada yang perlu ditafsirkan.

---

## 3 · Programnya mulai di baris 2430

Bukan 10. Entah program ini dulunya bagian dari sesuatu yang lebih besar,
entah 2.400 baris di depannya sengaja disisakan untuk sesuatu yang **tidak
pernah ditulis**.

Rutin bantunya ada di **59950** (jeda) dan **59990** (tunggu tombol) — jauh di
belakang, dan tanpa satu pun daftar isi yang menyebutkannya. Trik menaruh
utilitas di nomor tinggi memang umum di BASIC; yang membuatnya mahal adalah
tidak adanya petunjuk bahwa mereka ada di sana.

---

## 4 · Parameter lewat variabel global

```basic
TIMEOUT=3:GOSUB 59950
```

`GOSUB` tidak menerima parameter, jadi nilainya dititipkan lewat variabel
global sebelum memanggil. Pola ini muncul di seluruh koleksi.

Yang membuat versi ini termasuk yang paling baik: **namanya jelas**.
`TIMEOUT`, bukan `T`. Sebuah variabel global yang dipakai sebagai parameter
setidaknya harus mengatakan ia parameter apa — dan program ini satu-satunya
yang konsisten melakukannya.

---

## 5 · Dobel memberi empat langkah, dalam satu `IF`

```basic
2560 L=INT(RND*6+1):M=INT(RND*6+1):D=2:IF L=M THEN D=4 ELSE IF L<M THEN SWAP L,M
```

`D` adalah jumlah langkah yang tersisa giliran ini. Dobel mengubahnya jadi
empat — aturan backgammon sungguhan, satu `IF`.

Dan `SWAP L,M` di ujungnya memastikan `L ≥ M`, sehingga seluruh kode sesudahnya
boleh menganggap dadu pertama yang lebih besar. **Satu penukaran menghapus
setengah kasus.**

---

## 6 · Mengeluarkan bidak, dan aturan "kelebihan"

```basic
2800 J=25:IF A(J)<1 THEN J=J-1:GOTO 2800    ' titik terjauh yang masih terisi
...
3020 IF J>6 THEN 2940                       ' belum semua di rumah -> tolak
3030 IF F=M OR M>J AND F=J THEN M=L:GOTO 3060
3040 IF F=L OR L>J AND F=J THEN L=M:GOTO 3060
```

Dua syarat, dan keduanya benar menurut aturan backgammon:

1. **Semua bidak harus sudah di rumah** — dinyatakan sebagai `J > 6`, yaitu
   "titik terjauh yang masih terisi ada di luar rumah".
2. Dadunya **tepat** (`F = M`), **atau** dadunya lebih besar daripada titik
   terjauh yang terisi dan bidak itu memang yang terjauh (`M > J AND F = J`).

Syarat kedua itu aturan "kelebihan" yang sering dilupakan implementasi
amatir: kalau bidak terjauh Anda di titik 4 dan Anda melempar 6, bidak itu
boleh keluar. Program 1986 ini menanganinya, dalam setengah baris.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan | `A(25)` bertanda (§1) | Memori; dan penyandian yang memang benar | **Dipertahankan persis**, termasuk slot 0 dan 25 |
| Aturan | lengkap: bar, pukul, keluar, dobel, lewat | — | **Dipertahankan seluruhnya** |
| Arah pemain | P1 24→1, P2 1→24 | — | Dipertahankan; perbedaannya dinyatakan sekali di satu tabel `SISI` |
| Tata letak papan | 24→13 di atas, 1→12 di bawah (baris 2630) | Layar teks 80×25 | Dipertahankan persis |
| Letak bar | **di kiri papan** (`LOCATE 11,5`) | Membelah papan jadi dua memakan kolom yang tidak ada | **Dipertahankan** — papan sungguhan menaruhnya di tengah, tapi ini keputusan aslinya |
| Membedakan pemain | rupa, bukan warna: `███` lawan `█ █` | Layar teks tidak bisa diandalkan berwarna | Dibedakan **dua kali**: warna *dan* isian, supaya tetap terbaca kalau warnanya tidak terlihat |
| Memilih langkah | ketik `FROM--` lalu `TO--`, `99` untuk keluar | Tidak ada tetikus | Klik titik asal lalu tujuan; tujuan sah menyala hijau |
| Bidak di bar | wajib masuk dulu (baris 2850) | — | Dipertahankan, **dan dibuat terlihat**: kotak bar jadi merah |
| Dadu | `PRINT L; M;` | Layar teks | `_shared/dice.js` — pengguna ketiga sesudah YAHTZEE dan CRAPS |
| Siapa mulai | lemparan koin (baris 2500) | — | Dipertahankan |
| Nama pemain | diketik, maksimum 15 huruf | — | `PLAYER 1` / `PLAYER 2` |
| Lawan komputer | **tidak ada** | — | Tetap tidak ada — ini memang permainan dua orang |

### Kenapa tujuan yang sah ditandai

Aslinya meminta `FROM--` dan `TO--` sebagai angka, lalu menolak dengan
`INVALID MOVE` kalau salah. Pemain 1986 harus menghitung sendiri titik
tujuannya dari dadunya, dan mencoba lagi kalau keliru.

Port ini menandai tujuan yang sah dengan hijau **setelah** bidak dipilih.
Ini penyimpangan, dan alasannya bukan "supaya lebih mudah": aritmetikanya
(`titik − dadu`) bukan bagian yang menarik dari backgammon. Yang menarik
adalah **memilih di antara langkah-langkah yang sah** — dan itu justru jadi
lebih terlihat kalau semuanya ditampilkan sekaligus.

Yang **tidak** dilakukan: menyarankan langkah mana yang terbaik. Batasnya di
situ.

---

## 8 · Latihan

1. **Balik papannya.** Dengan penyandian tanda, mengubah sudut pandang pemain
   cukup mengalikan −1 dan membalik indeksnya (`n → 25−n`). Tulis fungsinya,
   lalu buktikan bahwa aturan langkah untuk kedua pemain jadi identik.

2. **Hitung pip tanpa `IF`.** Tulis penghitung pip untuk kedua pemain dalam
   satu perulangan, tanpa satu pun percabangan. Berapa baris?

3. **Cari 2.400 baris yang hilang.** Program ini mulai di 2430 dan rutin
   bantunya di 59950. Apa yang paling mungkin ada di antaranya? Bandingkan
   dengan program lain di koleksi yang memakai `CHAIN` atau `RUN "MENU"`.

4. **Patahkan aturan kelebihan.** Hapus bagian `M>J AND F=J` di baris 3030.
   Susun posisi di mana pemain jadi tidak bisa menyelesaikan permainannya.

5. **Bandingkan tiga slot pembatas.** [PEGLEAP](pegleap.md) memakai kolom
   kosong, [TICTAC](tictac.md) memakai nilai penjaga, BACKGAM memakai slot
   ujung yang menyimpan data. Mana yang paling sulit dirusak pembaca
   berikutnya, dan kenapa?

---

Berkas terkait: [mainkan](../games/backgam/index.html) ·
[YAHTZEE — pilot `dice.js`](yahtzee.md) · [CRAPS](craps.md) ·
[PEGLEAP — pagar tersirat](pegleap.md) ·
[TICTAC — pagar tersurat](tictac.md)
