# ASCII Studio — apa yang terjadi kalau harganya berubah

> Halaman: [`web/games/draw-studio/`](../games/draw-studio/index.html) ·
> Berasal dari: [`web/games/draw/`](../games/draw/index.html) ·
> Catatan port setianya: [`docs/draw.md`](draw.md)

**Ini bukan port.** Ia tidak ada di dalam koleksi 66 program, tidak dihitung di
statistik kemajuan, dan aturan "tiap penyimpangan wajib dijelaskan empat kolom"
tidak berlaku di sini — karena tidak ada yang disimpangi. Port setia
`DRAW.BAS` berdiri sendiri, utuh, di [`games/draw/`](../games/draw/index.html)
dan tidak disentuh sama sekali.

Yang dikerjakan halaman ini satu pertanyaan: **kalau satu kendala 1982 dicabut,
apa yang bisa dibangun di atas gagasan yang sama?**

---

## 1 · Satu kemampuan yang berasal dari temuan, bukan dari selera

[Port setianya](draw.md) §1 menemukan bahwa palet `DRAW.BAS` bukan lima puluh
benda melainkan **dua puluh lima pasang**: `A` → ╔ dan `a` → ╚, `I` → ─ dan
`i` → │, `L` → █ dan `l` → ▒.

Kalau glifnya berpasangan begitu, artinya ia **potongan yang saling
menyambung**. Dan kalau potongannya saling menyambung, komputer bisa
memilihkan potongan yang benar sendiri: untuk tiap sel cukup dilihat tetangga
mana yang juga berisi garis, lalu glifnya diambil dari tabel enam belas
kemungkinan.

```
bit 1 = utara, 2 = timur, 4 = selatan, 8 = barat

  tetangga                tunggal   ganda
  timur + barat              ─        ═
  utara + selatan            │        ║
  timur + selatan            ┌        ╔
  utara + timur + selatan    ├        ╠
  keempatnya                 ┼        ╬
```

Itulah yang membuat alat **garis**, **kotak**, dan **elips** menyambung rapi
tanpa pemakai memilih sudut satu per satu. Dua kotak yang bersinggungan berubah
sendiri jadi `├ ┬ ┼`.

**Program 1982-nya bukan lalai.** Menyapu empat tetangga tiap sel setiap kali
garis digambar terlalu mahal untuk BASIC di 4,77 MHz — dan `DRAW.BAS` bahkan
harus memanggil kode mesin hanya untuk menyalin layar. Yang berubah sekarang
bukan gagasannya, melainkan **harga menjalankannya**.

---

## 2 · Apa yang tetap, apa yang berubah

| | DRAW.BAS (1982) | ASCII Studio |
|---|---|---|
| Kanvas | 80 × 19 | 80 × 25 |
| Glif | 50, dari `DATA 2310`/`2320` | 50 yang sama, dikelompokkan |
| Masukan | papan ketik saja | tetikus + papan ketik |
| Bentuk | sel demi sel | garis, kotak, kotak isi, elips, isi-ember |
| Sudut | dipilih pemakai | **dipilih program** |
| Warna | 16 depan / 8 latar CGA | sama |
| Batal | tidak ada | 60 langkah, Ctrl+Z / Ctrl+Y |
| Keluaran | `.pic` = salinan mentah RAM layar | teks biasa + simpanan peramban |

Kanvasnya lebih tinggi bukan karena selera: aslinya 80 × 19 karena tiga baris
atas dipakai menu dan tiga baris bawah dipakai palet. Di sini keduanya bukan
lagi bagian dari layar yang sama, jadi enam baris itu kembali.

---

## 3 · Tiga cacat yang ditemukan saat membangunnya

Ketiganya jenis yang sama dengan yang berulang di sesi-sesi lain: **kode yang
jalan waktu dipanggil sendiri, tapi tidak waktu dipakai manusia**.

**Elips keluar sebagai setrip terputus.** Titik-titik elips disambung hanya
kalau lompatannya lebih dari satu sel; langkah diagonal jadi meninggalkan sel
yang tetangga tegak-lurusnya kosong, dan penyambungnya tidak punya apa-apa
untuk disambung. Sekarang titik berurutan **selalu** disambung dengan
Bresenham. Diukur: 66 sel elips, **nol terisolasi**.

**Menggambar dengan tetikus tidak berfungsi sama sekali.** Sel dicari lewat
`ev.target.closest('.p-sel')`. Itu bekerja untuk `pointerdown`, lalu berhenti
bekerja: `setPointerCapture` membuat seluruh kejadian berikutnya menyasar
elemen yang menangkap — kanvasnya — bukan sel di bawah penunjuk. `pointermove`
dan `pointerup` selalu mendapat `null`. Sekarang sel dihitung dari
**koordinat** terhadap persegi pembatas kanvas.

Yang membuat cacat kedua lolos dari pengujian saya: saya hanya menguji tombol
**Demo**, yang memanggil alatnya langsung tanpa lewat tetikus. Alat yang
dipanggil dari kode jalan; alat yang dipakai manusia tidak. Pengujian ulangnya
sekarang memakai `PointerEvent` sungguhan — pensil menyeret 11 sel, kotak ganda
menghasilkan `╔═══╗` dengan sisi `║`, isi-ember 179 sel, undo kembali ke 65.

**Kartu halamannya tidak muncul di katalog.** Saya beri `"group": "alat"`,
padahal daftar kelompok yang dikenal `index.html` tidak memuatnya — jadi
kartunya tersaring diam-diam. Diganti `"simulasi"`, kelompok yang sama dengan
`DRAW`.

---

## 4 · Kenapa ia ada di EXTRAS

`window.RETRO.EXTRAS`, bukan `CATALOG`. Statistik **61 / 66** di halaman muka
dihitung dari `CATALOG` saja; memasukkan halaman ini ke sana akan membuat angka
kemajuan proyek bohong, karena tidak ada program BASIC 1982 yang di-port
olehnya.

Aturan yang sama sudah dipakai untuk lima EXTRAS sebelumnya —
[FREEPLAY](freeplay.md), [PAC-GAL](pacgal.md), [3D TIC-TAC-TOE](3dttt.md),
[HOPPER](hopper.md), [SPACEWAR](spacewar.md).

---

[Katalog port](../index.html) · [Port setia DRAW.BAS](draw.md)
