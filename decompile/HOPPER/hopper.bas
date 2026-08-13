' ====================================================================
' Hopper (1991) -- klon Frogger
' Rekonstruksi dari HOPPER.EXE
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
'   - 45 panggilan runtime masih RT#n tanpa nama
'   - 0 nama berakhiran __maybe: hanya SATU jenis bukti,
'     belum memenuhi disiplin dua-bukti. Perlakukan sebagai dugaan.
'
' Bukti tiap nama: ../name-evidence.json
' ====================================================================

1000   RT#74() : RT#75() : CLEAR  : KEY_DISPLAY V0000 : FACLOAD! V0000                      ' @26
1010   LOAD!  : KEY_ASSIGN V0000 : ADD!                                                     ' @74
1020   FACSTORE! V0000 : ARITH!  : ASC                                                      ' @101
1030   ASC  : CHR$ V0000                                                                    ' @153
1040   DEF_SEG= V0040                                                                       ' @170
1050   INT2SGL  : MUL!_FAC V0040 : FACSTORE! V0040 : ARITH!  : DEF_SEG  : CLS V0040 : LOCATE V000E : LOCATE V0005 : PRINT_BEGIN V0005 : PRINT "Compiled HOPPER" ' @191
1060   INT2SGL  : FACSTORE! "Compiled HOPPER" : ARITH!                                      ' @283
1070   LOCATE V000F : LOCATE V0005 : PRINT_BEGIN V0005 : PRINT "Color/graphics adaptor not available" : LOCATE V0010 : LOCATE V0005 : PRINT_BEGIN V0005 : PRINT "Press any key to return to DOS'" : DEF_SEG "Press any key to return to DOS'" : INPUT$  : V096E$ = "Press any key to return to DOS'" : RT#50("Press any key to return to DOS'") ' @315
1080   LOCATE V000F : LOCATE V0005 : LOCATE V0000 : PRINT_BEGIN V0000 : PRINT "Switching to Color/Graphics Adaptor ..." ' @402
1090   DEF_SEG  : LOCATE V0AE6 : LOCATE V0AE6 : LOCATE V0AE6 : LOCATE V0007 : LOCATE V0007  ' @469
1100   V0972$ = ? : V0976$ = ? : V097A$ = ? : V097E$ = ? : V08AA$ = ? : V08AE$ = ? : DEF_SEG V0007 ' @511
1110   INT2SGL  : MUL!_FAC V0007 : FACTEST V00B2 : FACSTORE! V00B2 : DEF_SEG= V0000         ' @626
1120   INT2SGL                                                                              ' @675
1130   FACSTORE!  : INT2SGL V0000 : ADD! V0000 : ADD!_FAC  : ADD!_FAC  : FACSTORE! V0000 : LOAD! V0000 : DEF_SEG= V0000 : FACLOAD! V0000 ' @709
1140   READ! V0986 : LOAD! V0986 : LOAD!                                                    ' @778
1150   ADD!                                                                                 ' @816
1160   FACSTORE! V0986 : ARITH!  : TIME$  : RIGHT$ V0986 : VAL V0986 : TIME$ V0986 : MID$  : FACSTORE# V0986 : VAL V0986 ' @824
1170   MUL#_FAC V0986 : ADD# V0986 : CINT# V0986 : RT#86(V0986) : LOCATE V0000 : LOCATE V0001 : LOCATE V0000 : LOCATE V0000 : COLOR V0000 : KEY_DISPLAY V0000 : CLS V0000 : LOCATE V000B : PRINT_BEGIN V000B : PRINT "JOYSTICK OR KEYBOARD (J/K)"; : LET! ' @895
1180   INPUT$  : V08A6$ = "JOYSTICK OR KEYBOARD (J/K)" : V096E$ = ? : STRCMP                ' @1002
1190   STRCMP V0CFC                                                                         ' @1047
1200   STRCMP V0D02                                                                         ' @1063
1210   STRCMP V0D08                                                                         ' @1079
1220   STRCMP                                                                               ' @1102
1230   STRCMP V0D02                                                                         ' @1116
1240   LET!  : CLS V0D02 : PRINT_BEGIN V0D02 : PRINT "INITIALIZING..." : V0990$ = ? : V0994$ = ? : LOCATE V0008 : LOCATE V0001 : PRINT_BEGIN V0001 : PRINT "INSTRUCTIONS:" : PRINT_BEGIN "INSTRUCTIONS:" : PRINT "Use the cursor keys on the numeric" : PRINT_BEGIN "Use the cursor keys on the numeric" : PRINT "keypad to move your frog." : PRINT_BEGIN "keypad to move your frog." : PRINT "Press Esc to pause, <F10> to abort" : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : LET!  : OPEN_MODE V0002 : RT#46() : RT#47(V0002) : OPEN_MODE V0000 : RT#46() : LET! ' @1142
1250   RT#90(V0001)                                                                         ' @1436
1260   INPUT#_BEGIN V0001 : RT#35(V0001) : LOAD!  : STKPOP  : INPUT#_BEGIN V0001 : LOAD! V0001 : LINE_INPUT  : ADD!  : FACSTORE! V0001 : RT#47(V0001) : LET!  : LET!  : PRINT_BEGIN V0001 : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT V0A74$ : RT#48("Enter Skill Level (1-4) [#]: ") : ADD!  : PRINT V00B2!; : INPUT V0A74 : RT#35(V0A74) : STKPOP V09A0 : PRINT_BEGIN V09A0 : PRINT V0A74$ : RT#48("Enter Speed (1-500)  [####]: ") : PRINT V099C!; : INPUT V0A74 : RT#35(V0A74) : STKPOP V09A4 : SGNTEST V09A4 ' @1453
1270   ARITH!                                                                               ' @1710
1280   LET!                                                                                 ' @1736
1290   SGNTEST                                                                              ' @1747
1300   LET!                                                                                 ' @1763
1310   ARITH!                                                                               ' @1774
1320   ARITH!                                                                               ' @1788
1330   LET!                                                                                 ' @1814
1340   ADD!  : FACSTORE! V09A4                                                              ' @1828
1350   LET!  : LET!  : CLS V09A4 : GFXPT  : GFX2PT  : GOSUB V09A4 : GFXPT  : RT#57() : GFXPT  : RT#57() : GFXPT  : GFX2PT  : GFXPT  : GFX2PT  : LET!  : LET!  : LET!  : LET!  : LOCATE V0018 : PRINT_BEGIN V0018 : RT#58(V0005) : PRINT "SCORE: 0"; : RT#58(V0009) : PRINT "TIME:"; : FACLOAD! "TIME:" ' @1846
1360   MUL!  : ADD!_FAC "TIME:" : CINT "TIME:" : PSET  : DRAW V0972 : ADD!                  ' @2100
1370   FACSTORE! V0972 : ARITH!  : MUL!  : FACSTORE! V0972 : LET!  : FACLOAD! V0972         ' @2153
1380   FACLOAD!                                                                             ' @2215
1390   LET!  : GOSUB V0972 : ADD!  : FACSTORE! V0972 : ADD!                                 ' @2229
1400   FACSTORE! V0972 : ARITH!  : LET!  : GOSUB V0972 : ARITH!  : INT2SGL  : ADD!_FAC V0972 : ADD!_FAC  : FACSTORE! V0972 : GOSUB V0972 ' @2273
1410   ADD!                                                                                 ' @2368
1420   FACSTORE! V0972                                                                      ' @2376
1430   ARITH!                                                                               ' @2387
1440   LET!  : ARITH!                                                                       ' @2403
1450   ARITH!                                                                               ' @2428
1460   INT2SGL  : FACSTORE! V0972 : ARITH!  : INT2SGL  : SUB!  : SUB!_FAC V0972 : FACSTORE! V0972 : FACLOAD! V0972 ' @2447
1470   ARITH!                                                                               ' @2523
1480   ARITH!                                                                               ' @2537
1490   ARITH!                                                                               ' @2553
1500   DIV!  : FACTEST V00B2 : MUL!_FAC V00B2 : ADD!_FAC V00B2 : FACTEST V00B2 : SCALE2! V00B2 : FACSTORE!  : ARITH! ' @2579
1510   INT2SGL  : FACSTORE! V00B2 : ADD!  : MUL!_FAC V00B2 : ADD!_FAC V00B2 : FACSTORE! V00B2 : LET!  : FACLOAD! V00B2 ' @2656
1520   LOAD!  : LOAD!  : PSET V00B2 : DRAW V097A : ADD!  : CINT V097A : ADD!  : CINT V097A : RT#61() : DRAW V097E : ADD! ' @2729
1530   FACSTORE! V097E : SGNTEST V097E                                                      ' @2826
1540   ARITH!                                                                               ' @2850
1550   ARITH!                                                                               ' @2869
1560   DIV!  : FACTEST V00B2 : MUL!_FAC V00B2 : ADD!_FAC V00B2 : FACTEST V00B2 : SCALE2! V00B2 : FACSTORE!  : ARITH! ' @2888
1570   ARITH!                                                                               ' @2964
1580   INT2SGL  : FACSTORE! V00B2 : ADD!  : MUL!_FAC V00B2 : ADD!_FAC V00B2 : FACSTORE! V00B2 : LET!  : FACLOAD! V00B2 ' @2987
1590   FACLOAD!                                                                             ' @3060
1600   LOAD!  : ADD!  : CINT V00B2 : PSET V00B2 : DRAW V0976 : ADD!  : CINT V0976 : ADD!  : CINT V0976 : RT#61() : ADD! ' @3071
1610   FACSTORE! V0976 : ARITH!  : ADD!                                                     ' @3168
1620   FACSTORE! V0976 : SGNTEST V0976                                                      ' @3200
1630   ARITH!                                                                               ' @3224
1640   ARITH!                                                                               ' @3243
1650   ADD!                                                                                 ' @3259
1660   FACSTORE! V0976 : ARITH!                                                             ' @3267
1670   FACLOAD!                                                                             ' @3291
1680   RT#62(V0A70) : FACSTORE!  : MUL! V0A70 : SUB! V0A70 : MUL! V0A70 : FACTEST V00B2 : ADD!_FAC V00B2 : FACSTORE! V00B2 : MUL!  : ADD!_FAC V00B2 : CINT V00B2 : LOAD!  : PSET V00B2 : LOAD! V00B2 : RT#93() : SGNTEST_FAC V00B2 ' @3302
1690   INT2SGL  : FACSTORE! V00B2 : LET!  : FACLOAD! V00B2                                  ' @3440
1700   RT#62(V0A70) : MUL!_FAC V0A70 : FACTEST V00B2 : ADD!_FAC V00B2 : RT#94(V00B2) : RT#64(V00B2) : LOAD!  : RT#64() : DRAW V00B2 : ADD! ' @3478
1710   FACSTORE! V00B2 : ARITH!  : ADD!                                                     ' @3567
1720   FACSTORE! V00B2 : ARITH!                                                             ' @3599
1730   DEF_SEG= V0000                                                                       ' @3622
1740   FACLOAD!                                                                             ' @3655
1750   ADD!                                                                                 ' @3669
1760   FACSTORE! V0000 : ARITH!  : LOCATE V0018 : LOCATE V001D : PRINT_BEGIN V001D : PRINT V0EA0$; : LET!  : LET!  : LET! ' @3677
1770   MUL!  : ADD!_FAC V0EA0 : FACSTORE! V0EA0 : LOAD! V0EA0 : LOAD!  : GFXPT V0EA0 : ADD!  : CINT V0EA0 : ADD!  : CINT V0EA0 : GFXSTART V0EA0 : RT#67() : LOAD! V0EA0 : ADD!  : CINT V0EA0 : PSET V0EA0 : DRAW V0972 ' @3763
1780   ARITH!                                                                               ' @3905
1790   ARITH!                                                                               ' @3919
1800   FACLOAD!                                                                             ' @3942
1810   LOAD!                                                                                ' @3953
1820   ADD!                                                                                 ' @3979
1830   FACSTORE! V0972 : ARITH!                                                             ' @3987
1840   ARITH!                                                                               ' @4011
1850   LET!  : FACLOAD! V0972                                                               ' @4027
1860   LOAD!                                                                                ' @4046
1870   INT2SGL  : SUB! V0972 : FACSTORE! V0972 : ADD!                                       ' @4066
1880   FACSTORE! V0972 : ARITH!  : LET!  : FACLOAD! V0972                                   ' @4100
1890   LOAD!                                                                                ' @4143
1900   INT2SGL  : SUB! V0972 : FACSTORE! V0972 : ADD!                                       ' @4163
1910   FACSTORE! V0972 : ARITH!  : ARITH!                                                   ' @4197
1920   ARITH!                                                                               ' @4235
1930   ARITH!                                                                               ' @4261
1940   ARITH!                                                                               ' @4275
1950   ADD!  : FACSTORE! V0972 : FACLOAD! V0972                                             ' @4301
1960   ADD!                                                                                 ' @4331
1970   FACSTORE! V0972 : ARITH!                                                             ' @4339
1980   LOCATE V0018 : LOCATE V001C : PRINT_BEGIN V001C : PRINT V0A08!; : SOUND  : INKEY$ V0A08 : V0A1C$ = V0A08$ : STRCMP ' @4360
1990   LET!                                                                                 ' @4432
2000   ASC V0A1C : INT2SGL V0A1C : FACSTORE! V0A1C : SGNTEST V0A1C                          ' @4443
2010   MID$  : RT#95(V0990) : INT2SGL V0990 : FACSTORE! V0990 : NONZERO! V0990              ' @4483
2020   LOAD!  : MID$  : ASC V0990 : INT2SGL V0990 : FACSTORE! V0990                         ' @4531
2030   ARITH!                                                                               ' @4573
2040   INPUT$  : V096E$ = V0990$                                                            ' @4589
2050   ARITH!  : CLS                                                                        ' @4611
2060   LOAD!                                                                                ' @4632
2070   LET!  : RT#69(V0001) : INT2SGL V0001 : FACSTORE! V0001 : RT#69(V0001) : INT2SGL V0001 : FACSTORE! V0001 : ARITH! ' @4652
2080   ARITH!                                                                               ' @4719
2090   INT2SGL  : FACSTORE! V0001 : ARITH!                                                  ' @4732
2100   ARITH!                                                                               ' @4765
2110   INT2SGL  : FACSTORE! V0001 : LOAD! V0001 : LOAD!                                     ' @4778
2120   ARITH!                                                                               ' @4826
2130   INT2SGL  : FACSTORE! V0001                                                           ' @4844
2140   LOAD!  : LOAD!                                                                       ' @4863
2150   ARITH!                                                                               ' @4895
2160   INT2SGL  : FACSTORE! V0001                                                           ' @4915
2170   ARITH!                                                                               ' @4934
2180   ARITH!                                                                               ' @4948
2190   ARITH!                                                                               ' @4964
2200   ARITH!                                                                               ' @4980
2210   SOUND  : SOUND  : ARITH!                                                             ' @5006
2220   LET!  : GOSUB V0001                                                                  ' @5044
2230   ARITH!                                                                               ' @5065
2240   ARITH!                                                                               ' @5082
2250   LET!  : GOSUB V0001                                                                  ' @5108
2260   LET!  : FACLOAD! V0001                                                               ' @5129
2270   ADD!                                                                                 ' @5151
2280   FACSTORE! V0001 : ARITH!                                                             ' @5159
2290   LET!  : LET!  : ARITH!                                                               ' @5183
2300   ADD!  : FACSTORE! V0001                                                              ' @5221
2310   ARITH!                                                                               ' @5240
2320   ADD!  : SGNTEST_FAC V0001                                                            ' @5257
2330   ADD!  : FACSTORE! V0001                                                              ' @5288
2340   ARITH!                                                                               ' @5307
2350   ADD!  : ARITH!_FAC V0001                                                             ' @5324
2360   ADD!  : FACSTORE! V0001                                                              ' @5358
2370   ARITH!                                                                               ' @5377
2380   ARITH!                                                                               ' @5394
2390   ADD!  : FACSTORE! V0001                                                              ' @5420
2400   NONZERO! V0001                                                                       ' @5436
2410   LOAD!  : RT#38(V0001) : PUT  : LOAD! V0001 : GFXPT V0001 : ADD!  : CINT V0001 : GFXSTART V0001 : RT#67() : ADD!  : CINT V0001 : PSET  : DRAW V0972 : FACLOAD! V0972 ' @5451
2420   LOAD!                                                                                ' @5574
2430   LET!                                                                                 ' @5599
2440   ADD!                                                                                 ' @5613
2450   FACSTORE! V0972 : ARITH!                                                             ' @5621
2460   ARITH!                                                                               ' @5648
2470   LOAD!  : LOAD!  : RT#38(V0972) : PUT                                                 ' @5661
2480   LOAD!                                                                                ' @5697
2490   ARITH!                                                                               ' @5720
2500   ARITH!                                                                               ' @5734
2510   INT2SGL  : MUL! V0972 : SUB! V0972 : FACSTORE! V0972 : SGNTEST V0972                 ' @5751
2520   ARITH!                                                                               ' @5795
2530   NONZERO!                                                                             ' @5818
2540   LOAD!  : LOAD!  : RT#38(V0972) : PUT                                                 ' @5833
2550   LOAD! V0972 : DEF_SEG= V0972 : RT#98() : LET!  : LET!  : ADD!  : FACSTORE! V0972 : NONZERO! V0972 ' @5866
2560   ARITH!                                                                               ' @5949
2570   LOAD!                                                                                ' @5965
2580   LET!  : FACLOAD! V0972                                                               ' @5988
2590   LOAD!  : ADD!  : CINT V0972 : PSET V0972 : DRAW V0972 : LOAD! V0972 : LOAD!  : RT#38(V0972) : PUT  : LOAD! V0972 : SOUND V0972 : ADD! ' @6007
2600   FACSTORE! V0972 : SGNTEST V0972                                                      ' @6109
2610   ARITH!                                                                               ' @6133
2620   ARITH!                                                                               ' @6152
2630   ADD!  : FACSTORE! V0972 : NONZERO! V0972                                             ' @6168
2640   MUL!  : ADD!_FAC V0972 : CINT V0972 : GFXPT V011D : MUL!  : ADD!_FAC V011D : CINT V011D : GFX2PT ' @6201
2650   FACLOAD!                                                                             ' @6271
2660   ADD!                                                                                 ' @6285
2670   FACSTORE! V011D : ARITH!  : CLS V011D : FACLOAD! V011D                               ' @6293
2680   SOUND  : SOUND  : ADD!                                                               ' @6333
2690   FACSTORE! V011D : ARITH!  : PRINT_BEGIN V011D : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT V0A74$ : PRINT_BEGIN V0A74 : RT#99(V000C) : PRINT " G A M E   O V E R" : PRINT_BEGIN " G A M E   O V E R" : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT V0A74$ : SGNTEST V0A74 ' @6363
2700   SGNTEST                                                                              ' @6471
2710   ARITH!  : PRINT_BEGIN  : PRINT "YOUR SCORE IS IN THE TOP TEN" : PRINT_BEGIN "YOUR SCORE IS IN THE TOP TEN" : PRINT V0A74$ : DEF_SEG= V0000 ' @6497
2720   INPUT "ENTER YOUR NAME PLEASE: " : LINE_INPUT V0932 : LET!  : FACLOAD! V0932         ' @6568
2730   LET!  : ADD!                                                                         ' @6610
2740   LOAD!                                                                                ' @6632
2750   LOAD!                                                                                ' @6652
2760   ARITH!                                                                               ' @6669
2770   LET!                                                                                 ' @6685
2780   ADD!                                                                                 ' @6696
2790   FACSTORE! V0932 : ARITH!  : LOAD!                                                    ' @6704
2800   LET!  : LOAD! V0932                                                                  ' @6743
2810   V0A54$ = ? : LOAD! V0932                                                             ' @6767
2820   LOAD!  : LET!  : LOAD! V0932                                                         ' @6793
2830   LOAD!  : V0A54$ = ? : LOAD! V0932                                                    ' @6834
2840   LET!  : LOAD! V0932                                                                  ' @6873
2850   V0A54$ = V0A54$ : ADD!                                                               ' @6899
2860   FACSTORE! V0A54 : ARITH!  : PRINT_BEGIN  : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT V0A74$ ' @6918
2870   FACLOAD! V0A74                                                                       ' @6968
2880   LOAD!  : SGNTEST                                                                     ' @6979
2890   RT#48("######   ") : LOAD! "######   " : PRINT ?; : PRINT_BEGIN "######   " : LOAD! "######   " : PRINT ? : ADD! ' @7007
2900   FACSTORE! "######   " : ARITH!  : PRINT_BEGIN "######   " : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT V0A74$ : PRINT_BEGIN V0A74 : PRINT "WOULD YOU LIKE TO PLAY AGAIN (y/n)? "; : LET!  : INKEY$ "WOULD YOU LIKE TO PLAY AGAIN (y/n)? " : V096E$ = "WOULD YOU LIKE TO PLAY AGAIN (y/n)? " : STRCMP ' @7073
2910   V08A6$ = ? : V08A6$ = ? : STRCMP                                                     ' @7179
2920   STRCMP V0F90                                                                         ' @7219
2930   STRCMP V0F96                                                                         ' @7235
2940   STRCMP V0F9C                                                                         ' @7251
2950   STRCMP                                                                               ' @7274
2960   STRCMP V0F90                                                                         ' @7288
2970   RT#100(V1D11) : OPEN_MODE V0001 : RT#46() : FACLOAD! V0001                           ' @7314
2980   PRINT# V0001 : LOAD! V0001 : PRINT ? : PRINT# V0001 : LOAD! V0001 : PRINT ? : ADD!   ' @7354
2990   FACSTORE! V0001 : ARITH!  : RT#102(V0001) : RT#47(V0001) : CLS V0001 : RT#50(V0001)  ' @7423
3000   LET!  : GOSUB V0001 : ADD!  : FACSTORE! V0001 : FACLOAD! V0001                       ' @7467
3010   LOAD!  : SOUND V0001 : ADD!                                                          ' @7511
3020   FACSTORE! V0001 : ARITH!  : ARITH!                                                   ' @7538
3030   LET!  : GOSUB V0001                                                                  ' @7578
3040   RT#103("P2L8C.CL16CL8D.GL16FL8EL4C") : ARITH!  : INT2SGL  : ADD!_FAC "P2L8C.CL16CL8D.GL16FL8EL4C" : ADD!_FAC  : FACSTORE! "P2L8C.CL16CL8D.GL16FL8EL4C" : GOSUB "P2L8C.CL16CL8D.GL16FL8EL4C" ' @7593
3050   ADD!  : FACSTORE! "P2L8C.CL16CL8D.GL16FL8EL4C" : LOCATE V0018 : LOCATE V000C : PRINT_BEGIN V000C : PRINT V09A8!; : RETURN V09A8 : FACLOAD! V09A8 ' @7660
3060   LOAD!  : GFXPT V09A8 : ADD!  : CINT V09A8 : GFX2PT  : ADD!                           ' @7720
3070   FACSTORE! V09A8 : ARITH!  : GFXPT  : GFX2PT  : GFXPT  : GFX2PT  : RETURN V09A8 : RT#104() ' @7773