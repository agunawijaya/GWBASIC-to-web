' ===================================================================
' 3DTTT.EXE  --  rekonstruksi blok legenda tombol
' sumber: user-code.asm offset 13532 .. 14262
'
' STATUS: REKONSTRUKSI PARSIAL. Bukan sumber asli.
'   - nama variabel hilang permanen (jadi alamat DGROUP)
'   - nomor baris asli hilang; penomoran di sini dibuat baru
'   - komentar REM asli hilang seluruhnya
'   - COLOR: lihat catatan [1] di bawah
'
' Dipetakan dari entry point runtime BASCOM:
'   RT#12 + RT#13 -> akumulator argumen, helper 0x6E8B, buffer DGROUP 0x6A,
'                    batas 3 slot, argumen byte, sensitif mode layar [0x50]
'                    => COLOR depan, belakang[, batas]   [1]
'   RT#4          -> pembuka pernyataan PRINT (menolkan [82C],[616],[82D])
'   RT#5          -> stub PRINT '03 01' = item STRING, pemisah ';'
'   RT#14         -> CHR$(kode)   (nilai 24,25,27,26 = panah CP437)
'   0xCC          -> INT 3, titik pemeriksaan jebakan event (batas pernyataan)
' ===================================================================

1000 COLOR 3, 0  : PRINT " 1";
1010 COLOR 11, 6 : PRINT "HELP ";
1020 COLOR 3, 0  : PRINT " 2";
1030 COLOR 11, 6 : PRINT "SAVE ";
1040 COLOR 3, 0  : PRINT " 3";
1050 COLOR 11, 6 : PRINT "LOAD ";
1060 COLOR 3, 0  : PRINT "  4";
1070 COLOR 11, 6 : PRINT "NEW GAME ";

' --- legenda tombol kursor: CHR$ panah CP437 ---
1080 COLOR 3, 0  : PRINT S1$; CHR$(24);          ' 24 = panah atas
1090 COLOR 11, 6 : PRINT "UP ";
1100 COLOR 3, 0  : PRINT S1$; CHR$(25);          ' 25 = panah bawah
1110 COLOR 11, 6 : PRINT "DOWN ";
1120 COLOR 3, 0  : PRINT S1$; CHR$(27);          ' 27 = panah kiri
1130 COLOR 11, 6 : PRINT "LEFT ";
1140 COLOR 3, 0  : PRINT S1$; CHR$(26);          ' 26 = panah kanan
1150 COLOR 11, 6 : PRINT "RIGHT ";

' --- simbol tombol Enter: CHR$(17) CHR$(217) = tanda balik ---
1160 COLOR 3, 0  : PRINT S2$; CHR$(17); CHR$(217);
1170 COLOR 11, 6 : PRINT "ENTER ";
1180 COLOR 3, 0  : PRINT "  10";
1190 COLOR 11, 6 : PRINT "END ";
1200 COLOR 3, 0  : PRINT S1$;

' --- judul ---
1210 COLOR 15    : PRINT SPACE$(32); "LU's   3D   Game";

' ===================================================================
' TAMPILAN YANG DIHASILKAN
'
'    1   HELP
'    2   SAVE
'    3   LOAD
'     4  NEW GAME
'     ^  UP
'     v  DOWN
'     <  LEFT
'     >  RIGHT
'    <-' ENTER
'    10  END
'
' Cocok dengan teks bantuan yang tertanam di biner:
'   "(F1) is for instructions, (F2) save, (F3) load, (F4) start a new
'    game, and (F10) is to end the game"
' dan "Would you like to use cursor? (Y/N)"
' ===================================================================
'
' CATATAN
'
' [1] COLOR: DIPULIHKAN dan DIKONFIRMASI di iterasi #7.
'     Keberatan iterasi #4 ("kalau COLOR, siapa yang memindahkan kursor?")
'     terjawab: yang memindahkan kursor adalah LOCATE = RT#8/RT#9, yaitu
'     akumulator argumen KEDUA yang waktu itu belum dikenali.
'     Pembedanya jumlah argumen: COLOR menerima 1-3 (teramati 2 arg x52,
'     3 arg x3); LOCATE selalu tepat 2 (x77). Nilai yang keluar di tempat
'     lain mengonfirmasi: LOCATE 22,2 / LOCATE 22,5 / COLOR 15,0.
'     Lihat ../RUNTIME-MAP.md.
'
' [2] S1$ dan S2$ adalah literal di image offset 24820 dan 25282 yang
'     belum tertaut ke teksnya (di luar 62 yang berhasil). Dari konteks,
'     keduanya spasi pengatur jarak.
'
' [3] Titik koma: TERBUKTI di iterasi #4.
'     RT#5 adalah stub '03 01' = STRING + AH=1, dan cabang AH=1 di helper
'     langsung 'ret' tanpa memancarkan apa pun. Itu definisi ';'.
'     (AH=0 membagi kolom dengan 14 = zona PRINT = ','; AH=2 = ganti baris.)
'     Lihat ../PRINT-SEPARATORS.md.
'
'     Catatan iterasi #2 yang menyebut ini "tidak terbukti" sudah usang;
'     0xCC memang INT 3 (batas pernyataan, lihat ../EVENT-TRAPS.md), tapi
'     pemisah PRINT ternyata tersandi di deskriptor stub, bukan di 0xCC.
