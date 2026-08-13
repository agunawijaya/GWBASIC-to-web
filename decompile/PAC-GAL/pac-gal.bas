' ====================================================================
' Pac-Gal (1986) -- Al J. Jimenez
' Rekonstruksi dari PAC-GAL.EXE
'
' STATUS: BELUM BISA DIJALANKAN. Ini rendering terbaca dari
' 208 pernyataan yang dipulihkan, bukan sumber yang bisa di-RUN.
'
' Yang HILANG PERMANEN dan tidak bisa dipulihkan siapa pun:
'   - nama variabel  -> tampil sebagai Vxxxx (alamat DGROUP)
'   - nomor baris asli -> penomoran di sini dibuat baru
'   - seluruh komentar REM
' Yang SELAMAT: tipe tiap variabel (% ! # $), dari deskriptor stub.
'
' Yang BELUM selesai di berkas ini:
'   - 17 panggilan runtime masih RT#n tanpa nama
'   - 0 nama berakhiran __maybe: hanya SATU jenis bukti,
'     belum memenuhi disiplin dua-bukti. Perlakukan sebagai dugaan.
'
' Bukti tiap nama: ../name-evidence.json
' ====================================================================

1000   RT#41() : RT#42() : TRAP_INIT                                                        ' @26
1010   CLS                                                                                  ' @49
1020   PRINT_BEGIN  : PRINT "How fast (0-30000)";                                           ' @56
1030   INPUT V0A46 : RT#30(V0A46) : RT#31("< t")                                            ' @73
1040   CLS "< t"                                                                            ' @95
1050   V0934$ = ?                                                                           ' @107
1060   V0938$ = ?                                                                           ' @119
1070   V093C$ = ?                                                                           ' @131
1080   CLS                                                                                  ' @140
1090   PLAY V093C                                                                           ' @149
1100   LOCATE V000E : LOCATE                                                                ' @165
1110   PRINT_BEGIN V000E : CHR$ V0002 : PRINT V0002$; : PRINT V0AA8$;                       ' @180
1120   PLAY V093C                                                                           ' @247
1130   LOCATE V000E : LOCATE                                                                ' @263
1140   PRINT_BEGIN V000E : PRINT V0AA8$; : CHR$ V0003 : PRINT V0003$; : PRINT "   "; : CHR$ V0004 : PRINT V0004$; : CHR$ V0005 : PRINT V0005$; : CHR$ V0006 : PRINT V0006$; : PRINT "       "; : CHR$ V0002 : PRINT V0002$; ' @278
1150   TIME$  : LEFT$ V0002 : VAL V0002 : MUL#_FAC V0002 : TIME$ V0002 : MID$  : FACSTORE# V0002 : VAL V0002 : MUL#_FAC V0002 : ADD# V0002 : TIME$ V0002 : RIGHT$ V0002 : FACSTORE# V0002 : VAL V0002 : ADD# V0002 : CINT# V0002 ' @479
1160   CLS V0002                                                                            ' @582
1170   V09D8$ = ?                                                                           ' @594
1180   CHR$ V00DB : V09DC$ = V00DB$                                                         ' @603
1190   CHR$ V00BA : CONCAT$ V00BA : V09E0$ = V00BA$                                         ' @620
1200   CHR$ V00C4 : V09E4$ = V00C4$                                                         ' @645
1210   V09E8$ = ?                                                                           ' @665
1220   V09EC$ = ?                                                                           ' @677
1230   CHR$ V00F9 : CONCAT$ V00F9 : V09F0$ = V00F9$                                         ' @686
1240   CHR$ V00DB : CONCAT$ V00DB : V09F4$ = V00DB$                                         ' @711
1250   STRING$  : V09F8$ = V00DB$                                                           ' @739
1260   CHR$ V00CD : V09FC$ = V00CD$                                                         ' @756
1270   LOCATE V000F : COLOR V0000                                                           ' @773
1280   KEY_DISPLAY V0000                                                                    ' @788
1290   LOCATE V0019 : LOCATE V001C                                                          ' @797
1300   PRINT_BEGIN V001C : PRINT "    P A C - G A L ";                                      ' @811
1310   LOCATE V0007 : COLOR V0000                                                           ' @828
1320   PRINT_BEGIN V0000 : PRINT "        Al J. JimM"; : CHR$ V0082 : PRINT V0082$; : PRINT "nez, May 1982"; ' @841
1330   LOCATE V0018 : LOCATE V0001                                                          ' @879
1340   RT#48(V0B3C) : STRING$  : PRINT V0B3C$;                                              ' @896
1350   LOCATE V0001 : LOCATE V0001                                                          ' @921
1360   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$;                                         ' @932
1370   LOCATE V0002 : LOCATE V0001                                                          ' @957
1380   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @971
1390   LOCATE V0003 : LOCATE V0001                                                          ' @1206
1400   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09D8$; : CHR$ V00C9 : PRINT V00C9$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$ V00BB : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V09F4$; ' @1220
1410   LOCATE V0004 : LOCATE V0001                                                          ' @1565
1420   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @1579
1430   LOCATE V0005 : LOCATE V0001                                                          ' @1830
1440   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : CHR$ V00CA : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V00CA$; : PRINT V09F4$; ' @1844
1450   LOCATE V0006 : LOCATE V0001                                                          ' @2156
1460   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @2170
1470   LOCATE V0007 : LOCATE V0001                                                          ' @2401
1480   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09D8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : PRINT V09FC$; : CHR$ V00BB : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : CHR$  : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT ?; : CHR$  : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT ?; : CHR$  : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT ?; : PRINT V00BB$; : CHR$  : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V09F4$; ' @2415
1490   LOCATE V0008 : LOCATE V0001                                                          ' @2811
1500   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : CHR$ V00C9 : PRINT V00C9$; : PRINT V09FC$; : CHR$ V00BC : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V09F4$; ' @2825
1510   LOCATE V0009 : LOCATE V0001                                                          ' @3106
1520   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : PRINT V09FC$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : CHR$ V00BB : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : CHR$ V00C9 : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V00C9$; : PRINT V09F4$; ' @3120
1530   LOCATE V000A : LOCATE V0001                                                          ' @3437
1540   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09FC$; : CHR$ V09FC : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09F4$; ' @3451
1550   LOCATE V000B : LOCATE V0001                                                          ' @3752
1560   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$; : PRINT V09F0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : STRING$ V09D8 : PRINT V09D8$; ' @3766
1570   LOCATE V000C : LOCATE V0001                                                          ' @3986
1580   PRINT_BEGIN V0001 : PRINT V09E4$; : PRINT V09E4$; : PRINT V09E4$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : CHR$ V00C9 : PRINT V00C9$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : CHR$ V00BB : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; : PRINT V00BB$; ' @4000
1590   LOCATE V000D : LOCATE V0001                                                          ' @4323
1600   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$; : PRINT V09F0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : STRING$  : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : STRING$  : PRINT V09E0$; ' @4337
1610   LOCATE V000E : LOCATE V0001                                                          ' @4556
1620   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : STRING$  : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @4570
1630   LOCATE V000F : LOCATE V0001                                                          ' @4816
1640   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : STRING$  : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @4830
1650   LOCATE V0010 : LOCATE V0001                                                          ' @5082
1660   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : CHR$  : PRINT V09D8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : STRING$  : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : CHR$ V09F8 : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F4$; ' @5096
1670   LOCATE V0011 : LOCATE V0001                                                          ' @5419
1680   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @5433
1690   LOCATE V0012 : LOCATE V0001                                                          ' @5672
1700   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09D8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : STRING$  : PRINT V09F8$; : CHR$ V09F8 : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : CHR$ V09F8 : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F4$; ' @5686
1710   LOCATE V0013 : LOCATE V0001                                                          ' @5944
1720   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09F4$; ' @5958
1730   LOCATE V0014 : LOCATE V0001                                                          ' @6199
1740   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09D8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : PRINT V09FC$; : PRINT V09FC$; : PRINT ?; : PRINT V09FC$; : CHR$ V00CB : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V00CB$; : PRINT V09F4$; ' @6213
1750   LOCATE V0015 : LOCATE V0001                                                          ' @6525
1760   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @6539
1770   LOCATE V0016 : LOCATE V0001                                                          ' @6790
1780   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09D8$; : CHR$ V00C8 : PRINT V00C8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$  : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT ?; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : PRINT V09F8$; : CHR$ V00BC : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V00BC$; : PRINT V09F4$; ' @6804
1790   LOCATE V0017 : LOCATE V0001                                                          ' @7149
1800   PRINT_BEGIN V0001 : PRINT V09DC$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09F0$; : PRINT V09E0$; : PRINT ?; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09E0$; : PRINT V09F4$; ' @7163
1810   LOCATE V001A : COLOR V0000                                                           ' @7398
1820   LOCATE V0006 : LOCATE V0002                                                          ' @7414
1830   PRINT_BEGIN V0002 : PRINT V09F0$;                                                    ' @7428
1840   LOCATE V0006 : LOCATE V004C                                                          ' @7445
1850   PRINT_BEGIN V004C : PRINT V09F0$;                                                    ' @7459
1860   LOCATE V0013 : LOCATE V0002                                                          ' @7476
1870   PRINT_BEGIN V0002 : PRINT V09F0$;                                                    ' @7490
1880   LOCATE V0002 : LOCATE V001E                                                          ' @7507
1890   PRINT_BEGIN V001E : PRINT V09F0$;                                                    ' @7521
1900   LOCATE V0002 : LOCATE V0032                                                          ' @7538
1910   PRINT_BEGIN V0032 : PRINT V09F0$;                                                    ' @7552
1920   LOCATE V0017 : LOCATE V001E                                                          ' @7569
1930   PRINT_BEGIN V001E : PRINT V09F0$;                                                    ' @7583
1940   LOCATE V0017 : LOCATE V0032                                                          ' @7600
1950   PRINT_BEGIN V0032 : PRINT V09F0$;                                                    ' @7614
1960   LOCATE V0013 : LOCATE V004C                                                          ' @7631
1970   PRINT_BEGIN V004C : PRINT V09F0$;                                                    ' @7645
1980   LOCATE V000C : LOCATE V0012                                                          ' @7662
1990   PRINT_BEGIN V0012 : PRINT V09F0$;                                                    ' @7676
2000   LOCATE V000C : LOCATE V003C                                                          ' @7693
2010   PRINT_BEGIN V003C : PRINT V09F0$;                                                    ' @7707
2020   LOCATE V0007 : COLOR V0000                                                           ' @7724
2030   RT#49()                                                                              ' @7778
2040   LOCATE V0019 : LOCATE V0001                                                          ' @7787
2050   PRINT_BEGIN V0001 : PRINT "dots"; : PRINT ?;                                         ' @7801
2060   LOCATE V0019 : LOCATE V000F                                                          ' @7827
2070   PRINT_BEGIN V000F : STRING$  : PRINT V000F$;                                         ' @7841
2080   RT#18(V0B4A) : CINT V0B4A                                                            ' @8016
2090   RT#18(V0B4A) : CINT V0B4A                                                            ' @8065
2100   KEY_ONOFF V000B                                                                      ' @8176
2110   KEY_ONOFF V000C                                                                      ' @8185
2120   KEY_ONOFF V000D                                                                      ' @8194
2130   KEY_ONOFF V000E                                                                      ' @8203
2140   ON_KEY_GOSUB                                                                         ' @8215
2150   ON_KEY_GOSUB                                                                         ' @8227
2160   ON_KEY_GOSUB                                                                         ' @8239
2170   ON_KEY_GOSUB                                                                         ' @8251
2180   RETURN                                                                               ' @8275
2190   RETURN                                                                               ' @8295
2200   RETURN                                                                               ' @8315
2210   RETURN                                                                               ' @8335
2220   GOSUB                                                                                ' @8344
2230   GOSUB V000E                                                                          ' @8352
2240   GOSUB                                                                                ' @8408
2250   SCREEN                                                                               ' @8483
2260   SCREEN                                                                               ' @8586
2270   SCREEN                                                                               ' @8655
2280   SCREEN                                                                               ' @8758
2290   RT#36()                                                                              ' @8811
2300   RETURN V000E                                                                         ' @8817
2310   SCREEN                                                                               ' @8851
2320   PLAY V0938                                                                           ' @8868
2330   INT2SGL  : DIV!_FAC V0938 : ADD!_FAC V0938 : FACSTORE!  : INT2SGL V0938 : DIV! V0938 : CINT V0938 ' @8878
2340   LOCATE  : LOCATE                                                                     ' @8986
2350   PRINT_BEGIN V0938 : CHR$  : PRINT V0938$;                                            ' @9004
2360   LOCATE                                                                               ' @9028
2370   LOCATE                                                                               ' @9040
2380   LOCATE  : COLOR V0000                                                                ' @9050
2390   PRINT_BEGIN V0000 : CHR$  : PRINT V0000$;                                            ' @9063
2400   LOCATE V0007 : COLOR V0000                                                           ' @9086
2410   LOCATE V0019 : LOCATE V0005                                                          ' @9154
2420   PRINT_BEGIN V0005 : PRINT ?;                                                         ' @9168
2430   PLAY V0934                                                                           ' @9186
2440   RT#36()                                                                              ' @9202
2450   INT2SGL  : MUL!_FAC V0934 : CINT V0934                                               ' @9238
2460   RETURN                                                                               ' @9261
2470   SCREEN                                                                               ' @9284
2480   PLAY "mbl8t255o4fego3abcdefgo0l1g-g"                                                 ' @9301
2490   LOCATE  : LOCATE                                                                     ' @9311
2500   PRINT_BEGIN "mbl8t255o4fego3abcdefgo0l1g-g" : CHR$  : PRINT "mbl8t255o4fego3abcdefgo0l1g-g"; ' @9329
2510   LOCATE V001A : COLOR V0000                                                           ' @9352
2520   LOCATE                                                                               ' @9376
2530   LOCATE                                                                               ' @9388
2540   PRINT_BEGIN V0000 : CHR$ V00A8 : PRINT V00A8$;                                       ' @9394
2550   INT2SGL  : FCMP!_FAC V00A8                                                           ' @9445
2560   LOCATE V0007 : COLOR V0000                                                           ' @9476
2570   LOCATE V0019 : LOCATE V000F                                                          ' @9511
2580   PRINT_BEGIN V000F : STRING$  : PRINT V000F$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V0A46$, ' @9525
2590   LOCATE  : LOCATE                                                                     ' @9602
2600   PRINT_BEGIN V0A46 : CHR$  : PRINT V0A46$                                             ' @9620
2610   RETURN                                                                               ' @9824
2620   RT#27() : CONCAT$ V0A46 : CONCAT$ "l32o3x" : RT#27() : CONCAT$ "l32o3x" : CONCAT$ "l64o4x" : RT#27() : CONCAT$ "l64o4x" : PLAY "l64o4x" ' @9838
2630   LOCATE  : LOCATE                                                                     ' @9911
2640   PRINT_BEGIN "l64o4x" : CHR$  : PRINT "l64o4x";                                       ' @9929
2650   LOCATE V001A : COLOR V0000                                                           ' @9952
2660   LOCATE                                                                               ' @9976
2670   LOCATE                                                                               ' @9988
2680   PRINT_BEGIN V0000 : CHR$ V0002 : PRINT V0002$;                                       ' @9994
2690   INT2SGL  : MUL!_FAC V0002 : CINT V0002                                               ' @10045
2700   LOCATE V0007 : COLOR V0000                                                           ' @10071
2710   LOCATE V0019 : LOCATE V000F                                                          ' @10106
2720   PRINT_BEGIN V000F : STRING$  : PRINT V000F$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; : PRINT V09D8$; ' @10120
2730   LOCATE V0019 : LOCATE V0005                                                          ' @10306
2740   PRINT_BEGIN V0005 : PRINT ?;                                                         ' @10320
2750   RT#18(V0B4A) : FACSTORE!  : INT2SGL V0B4A : FCMP! V0B4A                              ' @10507
2760   SCREEN                                                                               ' @10618
2770   SCREEN                                                                               ' @10755
2780   SCREEN                                                                               ' @10849
2790   RT#18(V0B4A) : CINT V0B4A                                                            ' @10898
2800   SCREEN                                                                               ' @10989
2810   SCREEN                                                                               ' @11097
2820   SCREEN                                                                               ' @11193
2830   LOCATE  : LOCATE                                                                     ' @11333
2840   PRINT_BEGIN V0B4A : CHR$  : PRINT V0B4A$;                                            ' @11351
2850   LOCATE  : COLOR V0000                                                                ' @11417
2860   LOCATE                                                                               ' @11434
2870   LOCATE                                                                               ' @11446
2880   PRINT_BEGIN V0000 : CHR$  : PRINT V0000$;                                            ' @11452
2890   LOCATE V0007 : COLOR V0000                                                           ' @11481
2900   RETURN                                                                               ' @11557
2910   LOCATE V0019 : LOCATE V000A                                                          ' @11607
2920   LOCATE V001A : COLOR V0000                                                           ' @11624
2930   PRINT_BEGIN V0000 : PRINT "You did it!!!";                                           ' @11637
2940   LOCATE V0007 : COLOR V0000                                                           ' @11654
2950   LOCATE V0019 : LOCATE V000A                                                          ' @11712
2960   LOCATE V001A : COLOR V0000                                                           ' @11729
2970   PRINT_BEGIN V0000 : PRINT "Play again???";                                           ' @11742
2980   LOCATE V0007 : COLOR V0000                                                           ' @11759
2990   INKEY$  : V0A0C$ = V0000$                                                            ' @11786
3000   STRCMP                                                                               ' @11806
3010   STRCMP  : STRCMP V0BCE                                                               ' @11827
3020   STRCMP                                                                               ' @11872
3030   CLS                                                                                  ' @11887
3040   KEY_DISPLAY V0001                                                                    ' @11896
3050   PRINT_BEGIN V0001 : PRINT "...Hope you had a good time"                              ' @11902
3060   RT#57("...Hope you had a good time")                                                 ' @11916
3070   RETURN  : RT#58("...Hope you had a good time")                                       ' @11967