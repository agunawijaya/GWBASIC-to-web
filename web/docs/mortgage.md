# MORTGAGE — dari BASIC 1981–86 ke web

| | |
|---|---|
| Sumber | `run/MORTGAGE.BAS` — "The IBM Personal Computer Mortgage, Version 1.00" |
| Penulis | **Glenn Stuart Dardick**; diubah **Ayodele Isaac Anise**, September 1986 |
| Penerbit | IBM Corp, 1981–82 — "Licensed Material" |
| Ukuran asli | 204 baris |
| Hasil port | [`../games/mortgage/`](../games/mortgage/index.html) |
| Analisis BASIC | [`../../reviews/MORTGAGE.md`](../../reviews/MORTGAGE.md) |

Dua mode: pembanding angsuran, dan amortisasi dua belas bulan.

---

## 1 · Satu-satunya program di koleksi dengan riwayat perubahan

```basic
965 REM Author - Glenn Stuart Dardick
970 REM Modified by Ayodele Isaac Anise; September, 1986.
```

Penulis asli, dan pengubah berikutnya **dengan tanggalnya**. Ini *changelog*
dalam dua baris, di berkas yang tidak punya kendali versi — karena kendali
versi belum ada di komputer pribadi.

**Delapan puluh tiga program lain di koleksi ini tidak punya baris seperti
itu.** Yang kita tahu tentang mereka cuma nama satu orang, kalau beruntung.

> **Pelajaran.** Satu baris, nama, tanggal. Empat tahun setelah penulis
> pertama, seseorang menyentuh berkas ini dan meninggalkan jejaknya — dan
> empat puluh tahun kemudian kita tahu. Kebiasaan yang layak dihidupkan lagi
> di berkas mana pun yang tidak terlacak git.

---

## 2 · Pembulatan yang digeser sepersejuta

```basic
1930 P = INT((P+0.005000001)*100)/100
```

Bukan `0.005`, melainkan `0.005000001`.

Itu penjaga terhadap **pecahan biner**: sebuah nilai yang secara desimal tepat
di 0,005 tidak selalu tersimpan tepat di 0,005, dan `INT` akan memotongnya ke
bawah di separuh kasus. Menggeser sepersejuta membuat "tepat setengah sen"
selalu naik.

Angka itu muncul **tiga kali** (baris 1930, 2420, 2490), selalu sama.
Seseorang menemukan masalahnya sekali, lalu memakai obat yang sama di mana pun
ia muncul — dan **tidak menuliskan alasannya sama sekali**.

Dipertahankan persis di port, termasuk digit terakhirnya. Mengubahnya jadi
`0.005` akan membuat sebagian sen bergeser satu, dan tidak ada yang akan tahu
kenapa.

---

## 3 · Satu rumus, dipanggil dari dua dunia

```basic
1480 PF = AF*(RF/(1-(1/((1+RF)^NF)))):RETURN
```

Rumus anuitas baku, tanpa satu variabel perantara pun. Yang menarik adalah
**cara ia dipakai**.

Dari mode amortisasi, ia dipanggil dengan `AF` = pokok sungguhan. Dari mode
pembanding (baris 1910), ia dipanggil dengan **`AF = 1`** — sehingga yang
kembali adalah angsuran per *satu rupiah* pokok. Lalu baris 1930 mengalikannya
dengan tiap pokok di kolomnya.

**Satu pemanggilan rumus, satu baris tabel penuh** — karena angsuran berbanding
lurus dengan pokoknya, dan penulisnya tahu itu.

### Diverifikasi terhadap kasus acuan

$100.000 pada 6% selama 30 tahun:

| | Port | Nilai baku |
|---|--:|--:|
| Angsuran bulanan | **599,55** | 599,55 |
| Bunga bulan ke-1 | **500,00** | 500,00 |
| Sisa setelah bulan 1 | **99.900,45** | 99.900,45 |
| Total bunga 360 bulan | **115.838,45** | ≈115.838 |

---

## 4 · Batas 10.000 yang bukan batas keuangan

```basic
1935 IF P>10000 THEN PRINT "PAYMENTS TOO LARGE TO DISPLAY"
1940 PRINT USING "####.##";P;
```

`"####.##"` muat empat digit dan dua desimal — maksimum **9999,99**. Jadi batas
10.000 di baris 1935 bukan aturan keuangan, melainkan **lebar kolom**.

Dua baris berdampingan, dan yang satu ada semata-mata karena yang lain. Kalau
formatnya diubah jadi `"#####.##"`, baris 1935 jadi salah — tapi tidak ada yang
menghubungkan keduanya secara tertulis.

Di port, sel yang melewati 10.000 **tetap ditampilkan** dan ditandai merah.
Batas lebar kolom tidak berlaku lagi; jejaknya iya.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Rumus angsuran | baris 1480 | — | **Dipertahankan persis** |
| Pembulatan | `+0.005000001` (§2) | Pecahan biner | Dipertahankan sampai digit terakhirnya |
| Kenaikan tabel | pokok +2000, bunga +0,25%/tahun | tertulis tetap di baris 1650/1700 | **Dipertahankan**, tetap tidak bisa diubah pemakai |
| Batas nilai | 1–35%, 1–35 tahun | baris 1690, 2390 | Dipertahankan, dengan kata-kata galat aslinya |
| Batas 10.000 | menghentikan tabel (§4) | Lebar `PRINT USING` | Sel ditandai, tabel diteruskan |
| Amortisasi | jendela 12 bulan | Layar 25 baris | Dipertahankan |
| Total bunga | **tidak ditampilkan** | — | **Ditambahkan** — satu-satunya angka yang membuat "bandingkan bunga" punya arti |
| Riwayat penulis | dua baris `REM` (§1) | Tidak ada kendali versi | Ditampilkan di bilah atas |

---

## 6 · Latihan

1. **Uji pembulatannya.** Cari angsuran yang jatuh tepat di setengah sen.
   Bandingkan hasil `+0.005` dan `+0.005000001`. Berapa sering keduanya beda?

2. **Hitung total bunga.** Untuk pokok yang sama, berapa selisih total bunga
   antara 15 tahun dan 30 tahun? Kenapa selisihnya jauh lebih besar daripada
   dugaan orang?

3. **Cari titik silang.** Pada bulan ke berapa pokok yang terbayar melampaui
   bunga? Bagaimana bulan itu bergeser saat bunganya naik?

4. **Lebarkan kolomnya.** Ubah `"####.##"` jadi `"#####.##"` di kepala Anda.
   Baris mana lagi yang harus ikut berubah, dan bagaimana pembaca berikutnya
   bisa tahu?

---

Berkas terkait: [pakai](../games/mortgage/index.html) ·
[PIECHART](piechart.md) · [SPACE](space.md) — program IBM lain di koleksi ini
