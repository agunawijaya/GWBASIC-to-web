' ====================================================================
' 3-D Tic-Tac-Toe (1984) -- LU's 3D Game
' Rekonstruksi dari 3DTTT.EXE
'
' STATUS: BELUM BISA DIJALANKAN. Ini rendering terbaca dari
' 1205 pernyataan yang dipulihkan, bukan sumber yang bisa di-RUN.
'
' Yang HILANG PERMANEN dan tidak bisa dipulihkan siapa pun:
'   - nama variabel  -> tampil sebagai Vxxxx (alamat DGROUP)
'   - nomor baris asli -> penomoran di sini dibuat baru
'   - seluruh komentar REM
' Yang SELAMAT: tipe tiap variabel (% ! # $), dari deskriptor stub.
'
' Yang BELUM selesai di berkas ini:
'   - 12 panggilan runtime masih RT#n tanpa nama
'   - 0 nama berakhiran __maybe: hanya SATU jenis bukti,
'     belum memenuhi disiplin dua-bukti. Perlakukan sebagai dugaan.
'
' Bukti tiap nama: ../name-evidence.json
' ====================================================================

1000   RT#68() : RT#69() : TRAP_INIT                                                        ' @26
1010   KEY_DISPLAY V0000                                                                    ' @58
1020   ARG_C V0000 : ARG_C V0000 : SCREEN_STMT V0000                                        ' @66
1030   RT#59(V0050)                                                                         ' @85
1040   CLEAR V0050                                                                          ' @91
1050   COLOR V0000 : COLOR V0007                                                            ' @99
1060   CLS V0007                                                                            ' @113
1070   LOCATE V000C : LOCATE V0023                                                          ' @122
1080   COLOR V000E : COLOR V0004                                                            ' @139
1090   PRINT_BEGIN V0004 : PRINT "Please Wait"                                              ' @153
1100   GOSUB "Please Wait"                                                                  ' @167
1110   GOSUB "Please Wait"                                                                  ' @175
1120   ARG_C V0000 : ARG_C V0000 : SCREEN_STMT V0000                                        ' @185
1130   COLOR V0000 : COLOR V0007 : COLOR V0003                                              ' @203
1140   CLS V0003                                                                            ' @225
1150   LET!                                                                                 ' @242
1160   LET!                                                                                 ' @254
1170   LET!                                                                                 ' @266
1180   LET!                                                                                 ' @278
1190   LET!                                                                                 ' @290
1200   RETURN V0003                                                                         ' @296
1210   FACLOAD!                                                                             ' @305
1220   LOAD!  : KEY_ONOFF V0003                                                             ' @317
1230   LOAD!  : ON_KEY_GOSUB V0003                                                          ' @331
1240   ADD!  : FACSTORE! V0003 : ARITH!                                                     ' @351
1250   KEY_ONOFF V0001                                                                      ' @380
1260   ON_KEY_GOSUB                                                                         ' @392
1270   KEY_ONOFF V0002                                                                      ' @401
1280   ON_KEY_GOSUB                                                                         ' @413
1290   KEY_ONOFF V0003                                                                      ' @422
1300   ON_KEY_GOSUB                                                                         ' @434
1310   KEY_ONOFF V0004                                                                      ' @443
1320   ON_KEY_GOSUB                                                                         ' @455
1330   KEY_ONOFF V000A                                                                      ' @464
1340   ON_KEY_GOSUB                                                                         ' @476
1350   LOCATE V0016 : LOCATE V0002                                                          ' @493
1360   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @507
1370   LOCATE V0016 : LOCATE V0005                                                          ' @532
1380   PRINT_BEGIN V0005 : PRINT "Please make your move:"                                   ' @546
1390   GOSUB "Please make your move:"                                                       ' @560
1400   ARITH!                                                                               ' @574
1410   LET!                                                                                 ' @591
1420   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @604
1430   LOCATE V0016 : LOCATE V0002                                                          ' @671
1440   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @685
1450   LOCATE V0016 : LOCATE V0005                                                          ' @710
1460   PRINT_BEGIN V0005 : PRINT "Please remake your move:"                                 ' @724
1470   GOSUB "Please remake your move:"                                                     ' @738
1480   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @753
1490   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @811
1500   GOSUB "Please remake your move:"                                                     ' @866
1510   LET!                                                                                 ' @882
1520   LET!                                                                                 ' @894
1530   LET!                                                                                 ' @906
1540   LET!                                                                                 ' @918
1550   LET!                                                                                 ' @930
1560   LET!                                                                                 ' @942
1570   LET!                                                                                 ' @954
1580   LET!                                                                                 ' @966
1590   GOSUB "Please remake your move:"                                                     ' @972
1600   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @983
1610   GOSUB "Please remake your move:"                                                     ' @1038
1620   LET!                                                                                 ' @1052
1630   LET!                                                                                 ' @1064
1640   LET!                                                                                 ' @1076
1650   SGNTEST                                                                              ' @1085
1660   LET!  : FACLOAD! "Please remake your move:"                                          ' @1102
1670   LOAD!  : LET!                                                                        ' @1122
1680   LOAD!  : LET!                                                                        ' @1154
1690   LOAD!  : LET!                                                                        ' @1186
1700   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @1221
1710   SGNTEST                                                                              ' @1250
1720   LET!  : FACLOAD! "Please remake your move:"                                          ' @1267
1730   LOAD!  : LET!                                                                        ' @1287
1740   LOAD!  : LET!                                                                        ' @1319
1750   LOAD!  : LET!                                                                        ' @1351
1760   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @1386
1770   SGNTEST                                                                              ' @1416
1780   LET!                                                                                 ' @1433
1790   LET!                                                                                 ' @1445
1800   LET!                                                                                 ' @1457
1810   LET!                                                                                 ' @1469
1820   LET!                                                                                 ' @1481
1830   LET!                                                                                 ' @1493
1840   LET!                                                                                 ' @1505
1850   LET!                                                                                 ' @1517
1860   LET!                                                                                 ' @1529
1870   LET!                                                                                 ' @1541
1880   LET!                                                                                 ' @1553
1890   ARITH!                                                                               ' @1565
1900   LET!                                                                                 ' @1582
1910   GOSUB "Please remake your move:"                                                     ' @1588
1920   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @1599
1930   GOSUB "Please remake your move:"                                                     ' @1654
1940   ARITH!                                                                               ' @1668
1950   LET!                                                                                 ' @1685
1960   ARITH!                                                                               ' @1701
1970   LET!                                                                                 ' @1718
1980   LET!                                                                                 ' @1730
1990   LET!                                                                                 ' @1742
2000   LET!                                                                                 ' @1754
2010   LET!                                                                                 ' @1766
2020   LET!                                                                                 ' @1778
2030   SGNTEST                                                                              ' @1787
2040   SGNTEST                                                                              ' @1805
2050   ARITH!                                                                               ' @1822
2060   LET!                                                                                 ' @1839
2070   GOSUB                                                                                ' @1849
2080   SGNTEST                                                                              ' @1864
2090   LET!  : FACLOAD! "Please remake your move:"                                          ' @1881
2100   LOAD!  : LET!                                                                        ' @1901
2110   LOAD!  : LET!                                                                        ' @1933
2120   LOAD!  : LET!                                                                        ' @1965
2130   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @2000
2140   LET!                                                                                 ' @2032
2150   LET!                                                                                 ' @2044
2160   GOSUB "Please remake your move:"                                                     ' @2050
2170   SGNTEST                                                                              ' @2061
2180   SGNTEST                                                                              ' @2075
2190   LET!                                                                                 ' @2092
2200   LET!                                                                                 ' @2104
2210   GOSUB "Please remake your move:"                                                     ' @2110
2220   SGNTEST                                                                              ' @2121
2230   ARITH!                                                                               ' @2138
2240   LET!                                                                                 ' @2155
2250   LET!                                                                                 ' @2174
2260   GOSUB "Please remake your move:"                                                     ' @2180
2270   SGNTEST                                                                              ' @2195
2280   LET!                                                                                 ' @2212
2290   LET!                                                                                 ' @2224
2300   GOSUB "Please remake your move:"                                                     ' @2230
2310   LET!                                                                                 ' @2248
2320   LET!                                                                                 ' @2260
2330   LET!                                                                                 ' @2272
2340   LET!                                                                                 ' @2288
2350   LET!                                                                                 ' @2300
2360   LET!                                                                                 ' @2312
2370   LET!                                                                                 ' @2324
2380   LET!  : FACLOAD! "Please remake your move:"                                          ' @2336
2390   LOAD!  : LET!                                                                        ' @2356
2400   LOAD!  : LET!                                                                        ' @2383
2410   LOAD!  : LET!                                                                        ' @2410
2420   LET!                                                                                 ' @2440
2430   LET!                                                                                 ' @2452
2440   LET!                                                                                 ' @2464
2450   LET!                                                                                 ' @2476
2460   LET!                                                                                 ' @2488
2470   GOSUB "Please remake your move:"                                                     ' @2494
2480   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @2505
2490   GOSUB "Please remake your move:"                                                     ' @2560
2500   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @2571
2510   ARITH!                                                                               ' @2632
2520   LET!                                                                                 ' @2649
2530   LET!                                                                                 ' @2661
2540   ARITH!                                                                               ' @2673
2550   LET!                                                                                 ' @2690
2560   LET!                                                                                 ' @2702
2570   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @2714
2580   SGNTEST                                                                              ' @2746
2590   LET!                                                                                 ' @2763
2600   LET!                                                                                 ' @2778
2610   RETURN "Please remake your move:"                                                    ' @2784
2620   LET!                                                                                 ' @2796
2630   LET!                                                                                 ' @2808
2640   LET!  : FACLOAD! "Please remake your move:"                                          ' @2820
2650   ARITH!  : ARITH!                                                                     ' @2843
2660   LOAD!  : LET!                                                                        ' @2881
2670   LOAD!  : LET!                                                                        ' @2908
2680   LOAD!  : LET!                                                                        ' @2935
2690   ARITH!                                                                               ' @2965
2700   LET!                                                                                 ' @2982
2710   LET!                                                                                 ' @2997
2720   LOAD!  : LET!                                                                        ' @3010
2730   LOAD!  : LET!                                                                        ' @3037
2740   LOAD!  : LET!                                                                        ' @3064
2750   LET!                                                                                 ' @3094
2760   LET!                                                                                 ' @3106
2770   LET!                                                                                 ' @3118
2780   LET!                                                                                 ' @3130
2790   LET!                                                                                 ' @3142
2800   GOSUB "Please remake your move:"                                                     ' @3148
2810   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @3159
2820   GOSUB "Please remake your move:"                                                     ' @3214
2830   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @3225
2840   ARITH!                                                                               ' @3286
2850   LET!                                                                                 ' @3303
2860   ARITH!                                                                               ' @3319
2870   LET!                                                                                 ' @3336
2880   LET!                                                                                 ' @3348
2890   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @3360
2900   ARITH!                                                                               ' @3395
2910   LET!                                                                                 ' @3412
2920   RETURN "Please remake your move:"                                                    ' @3418
2930   FACLOAD!                                                                             ' @3428
2940   FACLOAD!                                                                             ' @3440
2950   FACLOAD!                                                                             ' @3452
2960   LOAD!  : ON_GOSUB "Please remake your move:"                                         ' @3464
2970   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @3485
2980   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @3552
2990   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @3619
3000   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @3685
3010   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @3720
3020   ADD!  : FACSTORE! "Please remake your move:" : ARITH!                                ' @3755
3030   RETURN                                                                               ' @3784
3040   LOAD!  : LET!                                                                        ' @3793
3050   LOAD!  : LET!                                                                        ' @3820
3060   LOAD!  : LET!                                                                        ' @3847
3070   LET!                                                                                 ' @3881
3080   LET!                                                                                 ' @3893
3090   LET!                                                                                 ' @3905
3100   LOAD!  : LET!                                                                        ' @3918
3110   LOAD!  : LET!                                                                        ' @3945
3120   LOAD!  : LET!                                                                        ' @3972
3130   LOAD!  : LET!                                                                        ' @4003
3140   LOAD!  : LET!                                                                        ' @4030
3150   LOAD!  : LET!                                                                        ' @4057
3160   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @4084
3170   LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @4142
3180   GOSUB "Please remake your move:"                                                     ' @4197
3190   LET!                                                                                 ' @4211
3200   LET!                                                                                 ' @4223
3210   LET!                                                                                 ' @4240
3220   LET!                                                                                 ' @4252
3230   LET!                                                                                 ' @4264
3240   LET!                                                                                 ' @4276
3250   LET!                                                                                 ' @4292
3260   LET!                                                                                 ' @4304
3270   LET!                                                                                 ' @4316
3280   LET!                                                                                 ' @4328
3290   SCALE2!  : FACSTORE!  : SCALE2! "Please remake your move:" : ADD! "Please remake your move:" : ADD!  : FACSTORE! "Please remake your move:" ' @4337
3300   COLOR V000F : COLOR V0000                                                            ' @4384
3310   ARITH!                                                                               ' @4403
3320   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @4417
3330   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @4488
3340   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @4559
3350   SCALE2!  : ADD!  : CINT V0000 : LOCATE V0000 : LOAD! V0000 : LOCATE V0000            ' @4630
3360   COLOR V000F : COLOR V0001                                                            ' @4671
3370   PRINT_BEGIN V0001 : PRINT V6150$                                                     ' @4685
3380   SCALE2!  : ADD!  : CINT V6150 : LOCATE V6150 : LOAD! V6150 : LOCATE V6150            ' @4706
3390   COLOR V000F : COLOR V0001                                                            ' @4747
3400   PRINT_BEGIN V0001 : PRINT V6156$                                                     ' @4761
3410   COLOR V000D : COLOR V0005                                                            ' @4778
3420   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @4795
3430   LOCATE V0015 : LOCATE V0032                                                          ' @4862
3440   PRINT_BEGIN V0032 : PRINT V5F9A$; : LEN V5F9A : STRING$  : PRINT V5F9A$              ' @4876
3450   ARITH!                                                                               ' @4919
3460   LOCATE V0016 : LOCATE V0002                                                          ' @4933
3470   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$; : PRINT V615C$; : STRING$ V0020 : PRINT V0020$ ' @4947
3480   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @4993
3490   LOCATE V0015 : LOCATE V0032                                                          ' @5060
3500   PRINT_BEGIN V0032 : PRINT V5F9E$; : LEN V5F9E : STRING$  : PRINT V5F9E$              ' @5074
3510   LOCATE V0015 : LOCATE V000F                                                          ' @5114
3520   PRINT_BEGIN V000F : PRINT V5EE2!; : PRINT V6170$; : PRINT V5EE6!; : PRINT V5EE6$; : PRINT V5EEA! ' @5128
3530   ARITH!                                                                               ' @5181
3540   LET!                                                                                 ' @5198
3550   RETURN V5EEA                                                                         ' @5204
3560   LET!                                                                                 ' @5217
3570   LET!                                                                                 ' @5229
3580   LET!                                                                                 ' @5241
3590   LET!                                                                                 ' @5253
3600   LET!                                                                                 ' @5265
3610   LOAD!  : LOAD!  : ARITH!                                                             ' @5274
3620   LET!                                                                                 ' @5334
3630   LET!                                                                                 ' @5346
3640   LET!                                                                                 ' @5358
3650   LET!                                                                                 ' @5370
3660   FACLOAD!                                                                             ' @5379
3670   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @5391
3680   ADD!  : FACSTORE! V5EEA                                                              ' @5461
3690   LOAD!  : LET!                                                                        ' @5477
3700   LOAD!  : LET!                                                                        ' @5504
3710   LOAD!  : LET!                                                                        ' @5531
3720   ADD!  : FACSTORE! V5EEA                                                              ' @5565
3730   LOAD!  : LET!                                                                        ' @5581
3740   LOAD!  : LET!                                                                        ' @5608
3750   LOAD!  : LET!                                                                        ' @5635
3760   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @5665
3770   GOSUB                                                                                ' @5694
3780   LOAD!  : LOAD!  : ARITH!                                                             ' @5705
3790   LET!                                                                                 ' @5765
3800   LET!                                                                                 ' @5777
3810   LET!                                                                                 ' @5789
3820   LET!                                                                                 ' @5801
3830   FACLOAD!                                                                             ' @5810
3840   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @5822
3850   ADD!  : FACSTORE! V5EEA                                                              ' @5892
3860   LOAD!  : LET!                                                                        ' @5908
3870   LOAD!  : LET!                                                                        ' @5935
3880   LOAD!  : LET!                                                                        ' @5962
3890   ADD!  : FACSTORE! V5EEA                                                              ' @5996
3900   LOAD!  : LET!                                                                        ' @6012
3910   LOAD!  : LET!                                                                        ' @6039
3920   LOAD!  : LET!                                                                        ' @6066
3930   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @6096
3940   GOSUB                                                                                ' @6125
3950   LOAD!  : LOAD!  : ARITH!                                                             ' @6136
3960   LET!                                                                                 ' @6187
3970   LET!                                                                                 ' @6199
3980   LET!                                                                                 ' @6211
3990   LET!                                                                                 ' @6223
4000   FACLOAD!                                                                             ' @6232
4010   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @6244
4020   ADD!  : FACSTORE! V5EEA                                                              ' @6314
4030   LOAD!  : LET!                                                                        ' @6330
4040   LOAD!  : LET!                                                                        ' @6357
4050   LOAD!  : LET!                                                                        ' @6384
4060   ADD!  : FACSTORE! V5EEA                                                              ' @6418
4070   LOAD!  : LET!                                                                        ' @6434
4080   LOAD!  : LET!                                                                        ' @6461
4090   LOAD!  : LET!                                                                        ' @6488
4100   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @6518
4110   GOSUB                                                                                ' @6547
4120   ARITH!  : ARITH!  : ARITH!  : ARITH!                                                 ' @6561
4130   LET!                                                                                 ' @6639
4140   LET!                                                                                 ' @6651
4150   ARITH!  : ARITH!  : ARITH!  : ARITH!                                                 ' @6667
4160   LET!                                                                                 ' @6749
4170   LET!                                                                                 ' @6761
4180   ARITH!  : ARITH!  : ARITH!  : ARITH!                                                 ' @6777
4190   LET!                                                                                 ' @6855
4200   LET!                                                                                 ' @6867
4210   ARITH!  : ARITH!  : ARITH!  : ARITH!                                                 ' @6883
4220   LET!                                                                                 ' @6965
4230   LET!                                                                                 ' @6977
4240   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @6994
4250   LET!                                                                                 ' @7070
4260   LET!                                                                                 ' @7082
4270   LET!                                                                                 ' @7094
4280   LET!                                                                                 ' @7106
4290   FACLOAD!                                                                             ' @7115
4300   ARITH!                                                                               ' @7130
4310   LET!                                                                                 ' @7147
4320   SUB!  : FACSTORE! V5EEA                                                              ' @7162
4330   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @7179
4340   ADD!  : FACSTORE! V5EEA                                                              ' @7249
4350   LOAD!  : LET!                                                                        ' @7265
4360   LOAD!  : LET!                                                                        ' @7292
4370   LOAD!  : LET!                                                                        ' @7319
4380   ADD!  : FACSTORE! V5EEA                                                              ' @7353
4390   LOAD!  : LET!                                                                        ' @7369
4400   LOAD!  : LET!                                                                        ' @7396
4410   LOAD!  : LET!                                                                        ' @7423
4420   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @7453
4430   GOSUB                                                                                ' @7482
4440   LET!                                                                                 ' @7496
4450   LET!                                                                                 ' @7508
4460   LOAD!  : ON_GOSUB V5EEA                                                              ' @7517
4470   ARITH!  : ARITH!  : ARITH!                                                           ' @7543
4480   ARITH!  : ARITH!  : ARITH!                                                           ' @7602
4490   ARITH!                                                                               ' @7665
4500   LET!                                                                                 ' @7682
4510   ARITH!                                                                               ' @7698
4520   ARITH!  : ARITH!  : ARITH!                                                           ' @7715
4530   LET!                                                                                 ' @7783
4540   ARITH!  : ARITH!  : ARITH!                                                           ' @7799
4550   ARITH!  : ARITH!  : ARITH!                                                           ' @7871
4560   ARITH!  : ARITH!  : ARITH!                                                           ' @7930
4570   LET!                                                                                 ' @7993
4580   ARITH!                                                                               ' @8005
4590   ARITH!  : ARITH!  : ARITH!                                                           ' @8022
4600   LET!                                                                                 ' @8090
4610   LET!                                                                                 ' @8102
4620   ARITH!  : ARITH!  : ARITH!                                                           ' @8118
4630   LET!                                                                                 ' @8186
4640   ARITH!  : ARITH!  : ARITH!                                                           ' @8202
4650   LET!                                                                                 ' @8264
4660   LET!                                                                                 ' @8276
4670   ARITH!  : ARITH!  : ARITH!                                                           ' @8292
4680   LET!                                                                                 ' @8354
4690   ARITH!  : ARITH!  : ARITH!                                                           ' @8370
4700   LET!                                                                                 ' @8438
4710   LET!                                                                                 ' @8450
4720   ARITH!  : ARITH!  : ARITH!                                                           ' @8466
4730   LET!                                                                                 ' @8534
4740   ARITH!  : ARITH!  : ARITH!                                                           ' @8550
4750   LET!                                                                                 ' @8612
4760   LET!                                                                                 ' @8624
4770   ARITH!  : ARITH!  : ARITH!                                                           ' @8640
4780   LET!                                                                                 ' @8702
4790   LET!                                                                                 ' @8718
4800   ARITH!                                                                               ' @8730
4810   ARITH!                                                                               ' @8747
4820   ARITH!                                                                               ' @8764
4830   LET!                                                                                 ' @8781
4840   LET!                                                                                 ' @8793
4850   GOSUB V5EEA                                                                          ' @8799
4860   LET!                                                                                 ' @8813
4870   LET!                                                                                 ' @8825
4880   GOSUB V5EEA                                                                          ' @8831
4890   LET!                                                                                 ' @8845
4900   LET!                                                                                 ' @8857
4910   LET!                                                                                 ' @8873
4920   LET!                                                                                 ' @8885
4930   GOSUB V5EEA                                                                          ' @8891
4940   LET!                                                                                 ' @8905
4950   GOSUB V5EEA                                                                          ' @8911
4960   LET!                                                                                 ' @8925
4970   LET!                                                                                 ' @8937
4980   ARITH!                                                                               ' @8953
4990   LET!                                                                                 ' @8970
5000   LET!                                                                                 ' @8982
5010   GOSUB V5EEA                                                                          ' @8988
5020   LET!                                                                                 ' @9002
5030   GOSUB V5EEA                                                                          ' @9008
5040   LET!                                                                                 ' @9022
5050   LET!                                                                                 ' @9034
5060   LET!                                                                                 ' @9050
5070   GOSUB V5EEA                                                                          ' @9056
5080   LET!                                                                                 ' @9070
5090   GOSUB V5EEA                                                                          ' @9076
5100   LET!                                                                                 ' @9090
5110   LET!                                                                                 ' @9102
5120   ARITH!                                                                               ' @9118
5130   ARITH!                                                                               ' @9135
5140   LET!                                                                                 ' @9152
5150   GOSUB V5EEA                                                                          ' @9158
5160   LET!                                                                                 ' @9172
5170   GOSUB V5EEA                                                                          ' @9178
5180   LET!                                                                                 ' @9192
5190   LET!                                                                                 ' @9204
5200   LET!                                                                                 ' @9220
5210   LET!                                                                                 ' @9232
5220   GOSUB V5EEA                                                                          ' @9238
5230   LET!                                                                                 ' @9252
5240   GOSUB V5EEA                                                                          ' @9258
5250   LET!                                                                                 ' @9272
5260   LET!                                                                                 ' @9284
5270   ARITH!                                                                               ' @9300
5280   LET!                                                                                 ' @9317
5290   LET!                                                                                 ' @9329
5300   GOSUB V5EEA                                                                          ' @9335
5310   LET!                                                                                 ' @9349
5320   GOSUB V5EEA                                                                          ' @9355
5330   LET!                                                                                 ' @9369
5340   LET!                                                                                 ' @9381
5350   LET!                                                                                 ' @9397
5360   LET!                                                                                 ' @9409
5370   GOSUB V5EEA                                                                          ' @9415
5380   LET!                                                                                 ' @9429
5390   LET!                                                                                 ' @9441
5400   GOSUB V5EEA                                                                          ' @9447
5410   LET!                                                                                 ' @9461
5420   LET!                                                                                 ' @9473
5430   LET!                                                                                 ' @9489
5440   ARITH!                                                                               ' @9501
5450   LET!                                                                                 ' @9518
5460   ARITH!                                                                               ' @9530
5470   LET!                                                                                 ' @9547
5480   ARITH!                                                                               ' @9563
5490   LET!                                                                                 ' @9580
5500   ARITH!                                                                               ' @9592
5510   LET!                                                                                 ' @9609
5520   LET!                                                                                 ' @9625
5530   LET!                                                                                 ' @9637
5540   LET!                                                                                 ' @9649
5550   ARITH!                                                                               ' @9661
5560   ARITH!                                                                               ' @9678
5570   LET!                                                                                 ' @9695
5580   ARITH!                                                                               ' @9707
5590   LET!                                                                                 ' @9724
5600   GOSUB V5EEA                                                                          ' @9730
5610   LET!                                                                                 ' @9744
5620   ARITH!                                                                               ' @9756
5630   LET!                                                                                 ' @9773
5640   GOSUB V5EEA                                                                          ' @9779
5650   LET!                                                                                 ' @9797
5660   ARITH!                                                                               ' @9809
5670   LET!                                                                                 ' @9826
5680   GOSUB V5EEA                                                                          ' @9832
5690   ARITH!                                                                               ' @9846
5700   LET!                                                                                 ' @9863
5710   GOSUB V5EEA                                                                          ' @9869
5720   ARITH!                                                                               ' @9887
5730   ARITH!                                                                               ' @9904
5740   LET!                                                                                 ' @9921
5750   GOSUB V5EEA                                                                          ' @9927
5760   LET!                                                                                 ' @9941
5770   ARITH!                                                                               ' @9953
5780   LET!                                                                                 ' @9970
5790   GOSUB V5EEA                                                                          ' @9976
5800   ARITH!                                                                               ' @9994
5810   LET!                                                                                 ' @10011
5820   GOSUB V5EEA                                                                          ' @10017
5830   ARITH!                                                                               ' @10031
5840   LET!                                                                                 ' @10048
5850   GOSUB V5EEA                                                                          ' @10054
5860   ARITH!                                                                               ' @10072
5870   SUB!  : FACSTORE! V5EEA                                                              ' @10089
5880   LOAD!  : LOAD!  : ARITH!                                                             ' @10103
5890   LET!                                                                                 ' @10154
5900   LET!                                                                                 ' @10166
5910   LET!                                                                                 ' @10178
5920   LET!                                                                                 ' @10190
5930   FACLOAD!                                                                             ' @10199
5940   ARITH!                                                                               ' @10214
5950   LET!                                                                                 ' @10231
5960   SUB!  : FACSTORE! V5EEA                                                              ' @10246
5970   ARITH!                                                                               ' @10266
5980   SUB!  : FACSTORE! V5EEA                                                              ' @10283
5990   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @10297
6000   ADD!  : FACSTORE! V5EEA                                                              ' @10367
6010   LOAD!  : LET!                                                                        ' @10383
6020   LOAD!  : LET!                                                                        ' @10410
6030   LOAD!  : LET!                                                                        ' @10437
6040   ADD!  : FACSTORE! V5EEA                                                              ' @10471
6050   LOAD!  : LET!                                                                        ' @10487
6060   LOAD!  : LET!                                                                        ' @10514
6070   LOAD!  : LET!                                                                        ' @10541
6080   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @10571
6090   GOSUB                                                                                ' @10600
6100   LET!                                                                                 ' @10614
6110   LET!                                                                                 ' @10626
6120   LET!                                                                                 ' @10638
6130   ARITH!                                                                               ' @10650
6140   RETURN                                                                               ' @10661
6150   ARITH!                                                                               ' @10677
6160   SUB!  : FACSTORE! V5EEA                                                              ' @10694
6170   LOAD!  : LOAD!  : ARITH!                                                             ' @10708
6180   LET!                                                                                 ' @10759
6190   LET!                                                                                 ' @10771
6200   LET!                                                                                 ' @10783
6210   LET!                                                                                 ' @10795
6220   FACLOAD!                                                                             ' @10804
6230   ARITH!                                                                               ' @10819
6240   LET!                                                                                 ' @10836
6250   SUB!  : FACSTORE! V5EEA                                                              ' @10851
6260   ARITH!                                                                               ' @10871
6270   SUB!  : FACSTORE! V5EEA                                                              ' @10888
6280   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @10902
6290   ADD!  : FACSTORE! V5EEA                                                              ' @10972
6300   LOAD!  : LET!                                                                        ' @10988
6310   LOAD!  : LET!                                                                        ' @11015
6320   LOAD!  : LET!                                                                        ' @11042
6330   ADD!  : FACSTORE! V5EEA                                                              ' @11076
6340   LOAD!  : LET!                                                                        ' @11092
6350   LOAD!  : LET!                                                                        ' @11119
6360   LOAD!  : LET!                                                                        ' @11146
6370   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @11176
6380   GOSUB                                                                                ' @11205
6390   LET!                                                                                 ' @11219
6400   LET!                                                                                 ' @11231
6410   LET!                                                                                 ' @11243
6420   ARITH!                                                                               ' @11255
6430   RETURN                                                                               ' @11266
6440   LOAD!  : LOAD!  : ARITH!                                                             ' @11279
6450   LET!                                                                                 ' @11330
6460   LET!                                                                                 ' @11342
6470   LET!                                                                                 ' @11354
6480   LET!                                                                                 ' @11366
6490   FACLOAD!                                                                             ' @11375
6500   ARITH!                                                                               ' @11390
6510   SUB!  : FACSTORE! V5EEA                                                              ' @11407
6520   LET!                                                                                 ' @11430
6530   ARITH!                                                                               ' @11442
6540   SUB!  : FACSTORE! V5EEA                                                              ' @11459
6550   LET!                                                                                 ' @11482
6560   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @11491
6570   ADD!  : FACSTORE! V5EEA                                                              ' @11561
6580   LOAD!  : LET!                                                                        ' @11577
6590   LOAD!  : LET!                                                                        ' @11604
6600   LOAD!  : LET!                                                                        ' @11631
6610   ADD!  : FACSTORE! V5EEA                                                              ' @11665
6620   LOAD!  : LET!                                                                        ' @11681
6630   LOAD!  : LET!                                                                        ' @11708
6640   LOAD!  : LET!                                                                        ' @11735
6650   ADD!  : FACSTORE! V5EEA : ARITH!                                                     ' @11765
6660   GOSUB                                                                                ' @11794
6670   ADD!  : FACSTORE! V5EEA                                                              ' @11812
6680   SUB!  : ARITH!_FAC V5EEA                                                             ' @11831
6690   LET!                                                                                 ' @11856
6700   LET!                                                                                 ' @11868
6710   LET!                                                                                 ' @11880
6720   LET!                                                                                 ' @11892
6730   SUB!  : SGNTEST_FAC V5EEA                                                            ' @11908
6740   SUB!  : ARITH!_FAC V5EEA                                                             ' @11930
6750   ADD!  : FACSTORE! V5EEA                                                              ' @11955
6760   LOAD!  : LOAD!  : LET!                                                               ' @11971
6770   LOAD!  : LOAD!  : LET!                                                               ' @12013
6780   LOAD!  : LOAD!  : LET!                                                               ' @12055
6790   LET!                                                                                 ' @12100
6800   SUB!  : ARITH!_FAC V5EEA                                                             ' @12116
6810   LET!                                                                                 ' @12141
6820   SGNTEST                                                                              ' @12150
6830   LOAD!  : LOAD!  : LOAD!  : LOAD!  : LOAD!  : LET!                                    ' @12164
6840   LOAD!  : LOAD!  : LOAD!  : LOAD!  : LOAD!  : SUB!  : CINT V5EEA : ARITH!             ' @12263
6850   LOAD!  : LOAD!  : LOAD!  : LOAD!  : LET!                                             ' @12396
6860   ADD!  : FACSTORE! V5EEA                                                              ' @12473
6870   ARITH!                                                                               ' @12492
6880   LET!                                                                                 ' @12509
6890   RETURN V5EEA                                                                         ' @12515
6900   RETURN V5EEA                                                                         ' @12521
6910   CLS V5EEA                                                                            ' @12527
6920   V5F9E$ = ?                                                                           ' @12539
6930   LOCATE V000C : LOCATE V0001                                                          ' @12548
6940   INPUT "Please enter your name? " : STKPUSH "Please enter your name? " : STKREAD V5FF2 ' @12565
6950   LEN V5FF2                                                                            ' @12590
6960   LEN V5FF2                                                                            ' @12606
6970   LEFT$  : V5F9E$ = V5FF2$                                                             ' @12628
6980   LEN V5FF2 : INT2SGL V5FF2 : FACSTORE! V5FF2 : FACLOAD! V5FF2                         ' @12644
6990   LOAD!  : MID$  : ASC V5FF2 : INT2SGL V5FF2 : FACSTORE! V5FF2                         ' @12677
7000   ARITH!  : ARITH!                                                                     ' @12720
7010   ADD!  : CINT V5FF2 : CHR$ V5FF2 : CONCAT$ V5FF2 : V5F9E$ = V5FF2$                    ' @12761
7020   LOAD!  : CHR$ V5FF2 : CONCAT$ V5FF2 : V5F9E$ = V5FF2$                                ' @12798
7030   ADD!  : FACSTORE! V5FF2 : ARITH!                                                     ' @12829
7040   V5FFE$ = ?                                                                           ' @12868
7050   CLS V5FF2                                                                            ' @12874
7060   V5F9A$ = ?                                                                           ' @12886
7070   LOCATE V0008 : LOCATE V0001                                                          ' @12895
7080   PRINT_BEGIN V0001 : PRINT V5F9A$; : PRINT " would you like to move first? (Y/N)"     ' @12909
7090   INKEY$ " would you like to move first? (Y/N)" : V6002$ = " would you like to move first? (Y/N)" ' @12931
7100   STRCMP  : STRCMP V61E4                                                               ' @12951
7110   LET!                                                                                 ' @12992
7120   STRCMP  : STRCMP V61F0                                                               ' @13008
7130   LET!                                                                                 ' @13049
7140   LOCATE V000A : LOCATE V0001                                                          ' @13066
7150   PRINT_BEGIN V0001 : PRINT V5F9A$; : PRINT " would you like to use 'X' or 'O'? (X/O)" ' @13080
7160   INKEY$ " would you like to use 'X' or 'O'? (X/O)" : V6002$ = " would you like to use 'X' or 'O'? (X/O)" ' @13102
7170   STRCMP  : STRCMP V6150                                                               ' @13122
7180   LET!                                                                                 ' @13163
7190   STRCMP  : STRCMP V6156                                                               ' @13179
7200   LET!                                                                                 ' @13220
7210   LOCATE V000C : LOCATE V0001                                                          ' @13237
7220   PRINT_BEGIN V0001 : PRINT V622E$                                                     ' @13251
7230   INKEY$ V622E : V6002$ = V622E$                                                       ' @13265
7240   STRCMP  : STRCMP V61E4                                                               ' @13285
7250   LET!                                                                                 ' @13326
7260   STRCMP  : STRCMP V61F0                                                               ' @13342
7270   LET!                                                                                 ' @13383
7280   GOSUB                                                                                ' @13397
7290   ARITH!                                                                               ' @13411
7300   LET!                                                                                 ' @13428
7310   LET!                                                                                 ' @13440
7320   LET!                                                                                 ' @13452
7330   ARG_C V0000 : ARG_C V0000 : SCREEN_STMT V0000                                        ' @13469
7340   COLOR V0000 : COLOR V0001 : COLOR V0007                                              ' @13487
7350   RT#59(V0050)                                                                         ' @13512
7360   CLS V0050                                                                            ' @13518
7370   LOCATE V0019 : LOCATE V0001                                                          ' @13527
7380   COLOR V0003 : COLOR V0000                                                            ' @13544
7390   PRINT_BEGIN V0000 : PRINT V6256$;                                                    ' @13557
7400   COLOR V000B : COLOR V0006                                                            ' @13574
7410   PRINT_BEGIN V0006 : PRINT V625C$;                                                    ' @13588
7420   COLOR V0003 : COLOR V0000                                                            ' @13605
7430   PRINT_BEGIN V0000 : PRINT V6266$;                                                    ' @13618
7440   COLOR V000B : COLOR V0006                                                            ' @13635
7450   PRINT_BEGIN V0006 : PRINT V626C$;                                                    ' @13649
7460   COLOR V0003 : COLOR V0000                                                            ' @13666
7470   PRINT_BEGIN V0000 : PRINT V6276$;                                                    ' @13679
7480   COLOR V000B : COLOR V0006                                                            ' @13696
7490   PRINT_BEGIN V0006 : PRINT "LOAD ";                                                   ' @13710
7500   COLOR V0003 : COLOR V0000                                                            ' @13727
7510   PRINT_BEGIN V0000 : PRINT "  4";                                                     ' @13740
7520   COLOR V000B : COLOR V0006                                                            ' @13757
7530   PRINT_BEGIN V0006 : PRINT "NEW GAME ";                                               ' @13771
7540   COLOR V0003 : COLOR V0000                                                            ' @13788
7550   PRINT_BEGIN V0000 : PRINT V60F4$; : CHR$ V0018 : PRINT V0018$;                       ' @13801
7560   COLOR V000B : COLOR V0006                                                            ' @13831
7570   PRINT_BEGIN V0006 : PRINT "UP ";                                                     ' @13845
7580   COLOR V0003 : COLOR V0000                                                            ' @13862
7590   PRINT_BEGIN V0000 : PRINT V60F4$; : CHR$ V0019 : PRINT V0019$;                       ' @13875
7600   COLOR V000B : COLOR V0006                                                            ' @13905
7610   PRINT_BEGIN V0006 : PRINT "DOWN ";                                                   ' @13919
7620   COLOR V0003 : COLOR V0000                                                            ' @13936
7630   PRINT_BEGIN V0000 : PRINT V60F4$; : CHR$ V001B : PRINT V001B$;                       ' @13949
7640   COLOR V000B : COLOR V0006                                                            ' @13979
7650   PRINT_BEGIN V0006 : PRINT "LEFT ";                                                   ' @13993
7660   COLOR V0003 : COLOR V0000                                                            ' @14010
7670   PRINT_BEGIN V0000 : PRINT V60F4$; : CHR$ V001A : PRINT V001A$;                       ' @14023
7680   COLOR V000B : COLOR V0006                                                            ' @14053
7690   PRINT_BEGIN V0006 : PRINT "RIGHT ";                                                  ' @14067
7700   COLOR V0003 : COLOR V0000                                                            ' @14084
7710   PRINT_BEGIN V0000 : PRINT "  "; : CHR$ V0011 : PRINT V0011$; : CHR$ V00D9 : PRINT V00D9$; ' @14097
7720   COLOR V000B : COLOR V0006                                                            ' @14140
7730   PRINT_BEGIN V0006 : PRINT "ENTER ";                                                  ' @14154
7740   COLOR V0003 : COLOR V0000                                                            ' @14171
7750   PRINT_BEGIN V0000 : PRINT "  10";                                                    ' @14184
7760   COLOR V000B : COLOR V0006                                                            ' @14201
7770   PRINT_BEGIN V0006 : PRINT "END ";                                                    ' @14215
7780   COLOR V0007 : COLOR V0000                                                            ' @14232
7790   PRINT_BEGIN V0000 : PRINT V60F4$;                                                    ' @14245
7800   RT#61(VB800)                                                                         ' @14262
7810   COLOR V000F : COLOR V0004                                                            ' @14301
7820   LOCATE V0001 : LOCATE V0001                                                          ' @14318
7830   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$; : PRINT "LU's   3D   Game"; : STRING$ "LU's   3D   Game" : PRINT "LU's   3D   Game" ' @14329
7840   COLOR V000E : COLOR V0003                                                            ' @14376
7850   LOCATE V0002 : LOCATE V0001                                                          ' @14393
7860   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$                                          ' @14407
7870   LOCATE V0003 : LOCATE V0001                                                          ' @14432
7880   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$; : PRINT V62F6$; : STRING$  : PRINT V62F6$; : PRINT V62FC$; : STRING$ V62FC : PRINT V62FC$; : PRINT V6302$; : STRING$ V6302 : PRINT V6302$; : PRINT V6308$; : STRING$ V6308 : PRINT V6308$ ' @14446
7890   LOCATE V0004 : LOCATE V0001                                                          ' @14554
7900   PRINT_BEGIN V0001 : STRING$  : PRINT V0001$                                          ' @14568
7910   GOSUB V0001                                                                          ' @14590
7920   COLOR V000E : COLOR V0001                                                            ' @14601
7930   FACLOAD!                                                                             ' @14618
7940   LET!                                                                                 ' @14633
7950   LET!                                                                                 ' @14645
7960   SCALE2!  : ADD!  : FACSTORE! V0001                                                   ' @14654
7970   GOSUB V0001                                                                          ' @14677
7980   LET!                                                                                 ' @14691
7990   GOSUB V0001                                                                          ' @14697
8000   ADD!  : FACSTORE! V0001 : ARITH!                                                     ' @14711
8010   FACLOAD!                                                                             ' @14744
8020   ADD!  : CINT V0001 : LOCATE V0001 : LOAD! V0001 : LOCATE V0001                       ' @14759
8030   COLOR V0007 : COLOR V0001                                                            ' @14791
8040   PRINT_BEGIN V0001 : PRINT V62F6$;                                                    ' @14805
8050   COLOR V000E : COLOR V0001                                                            ' @14822
8060   PRINT_BEGIN V0001 : LOAD! V0001 : CHR$ V0001 : PRINT V0001$;                         ' @14836
8070   COLOR V0007 : COLOR V0001                                                            ' @14863
8080   PRINT_BEGIN V0001 : PRINT V62FC$;                                                    ' @14877
8090   COLOR V000E : COLOR V0001                                                            ' @14894
8100   PRINT_BEGIN V0001 : LOAD! V0001 : CHR$ V0001 : PRINT V0001$;                         ' @14908
8110   COLOR V0007 : COLOR V0001                                                            ' @14935
8120   PRINT_BEGIN V0001 : PRINT V6302$;                                                    ' @14949
8130   COLOR V000E : COLOR V0001                                                            ' @14966
8140   PRINT_BEGIN V0001 : LOAD! V0001 : CHR$ V0001 : PRINT V0001$;                         ' @14980
8150   COLOR V0007 : COLOR V0001                                                            ' @15007
8160   PRINT_BEGIN V0001 : PRINT V6308$                                                     ' @15021
8170   ADD!  : FACSTORE! V6308 : ARITH!                                                     ' @15041
8180   RETURN                                                                               ' @15070
8190   COLOR V000E : COLOR V0001                                                            ' @15079
8200   FACLOAD!                                                                             ' @15096
8210   ADD!  : CINT V0001 : LOCATE V0001 : LOAD! V0001 : LOCATE V0001                       ' @15111
8220   PRINT_BEGIN V0001 : LOAD! V0001 : CHR$ V0001 : PRINT V0001$; : LOAD! V0001 : CHR$ V0001 : PRINT V0001$; : CHR$ V0001 : PRINT V0001$; : CHR$ V0001 : PRINT V0001$; : CHR$ V0001 : PRINT V0001$; : CHR$ V0001 : PRINT V0001$; : CHR$ V0001 : PRINT V0001$ ' @15140
8230   ADD!  : FACSTORE! V0001 : ARITH!                                                     ' @15252
8240   RETURN                                                                               ' @15281
8250   LOCATE V0002 : LOCATE V0001                                                          ' @15290
8260   PRINT_BEGIN V0001 : CHR$ V00D5 : PRINT V00D5$                                        ' @15304
8270   LOCATE V0003 : LOCATE V0001                                                          ' @15326
8280   PRINT_BEGIN V0001 : CHR$ V00B3 : PRINT V00B3$                                        ' @15340
8290   LOCATE V0002 : LOCATE V0050                                                          ' @15362
8300   PRINT_BEGIN V0050 : CHR$ V00B8 : PRINT V00B8$                                        ' @15376
8310   LOCATE V0003 : LOCATE V0050                                                          ' @15398
8320   PRINT_BEGIN V0050 : CHR$ V00B3 : PRINT V00B3$                                        ' @15412
8330   LOCATE V0004 : LOCATE V0050                                                          ' @15434
8340   PRINT_BEGIN V0050 : CHR$ V00D9 : PRINT V00D9$                                        ' @15448
8350   LOCATE V0004 : LOCATE V0001                                                          ' @15470
8360   PRINT_BEGIN V0001 : CHR$ V00B3 : PRINT V00B3$; : PRINT V6322$; : CHR$ V00DA : PRINT V00DA$ ' @15484
8370   FACLOAD!                                                                             ' @15527
8380   LOAD!  : LOCATE V00DA : LOCATE V0001                                                 ' @15539
8390   PRINT_BEGIN V0001 : CHR$  : PRINT V0001$; : PRINT V6322$; : CHR$ V6322 : PRINT V6322$ ' @15558
8400   ADD!  : FACSTORE! V6322 : ARITH!                                                     ' @15605
8410   LOCATE V000D : LOCATE V0001                                                          ' @15634
8420   PRINT_BEGIN V0001 : CHR$ V00C0 : PRINT V00C0$; : STRING$  : PRINT V00C0$; : CHR$ V00D9 : PRINT V00D9$ ' @15648
8430   FACLOAD!                                                                             ' @15699
8440   SCALE2!  : ADD!  : CINT V00D9 : LOCATE V00D9 : LOCATE V0002                          ' @15711
8450   PRINT_BEGIN V0002 : PRINT V5ECE!                                                     ' @15744
8460   ADD!  : FACSTORE! V5ECE : ARITH!                                                     ' @15764
8470   RETURN V5ECE                                                                         ' @15790
8480   FACLOAD!                                                                             ' @15799
8490   FACLOAD!                                                                             ' @15811
8500   SCALE2!  : FACSTORE!  : SCALE2! V5ECE : ADD! V5ECE : CINT V5ECE : LOCATE V5ECE : SCALE2! V5ECE : ADD!  : CINT V5ECE : LOCATE V5ECE ' @15823
8510   PRINT_BEGIN V5ECE : PRINT V5F86!                                                     ' @15891
8520   ADD!  : FACSTORE! V5F86 : ARITH!                                                     ' @15911
8530   ADD!  : FACSTORE! V5F86 : ARITH!                                                     ' @15943
8540   COLOR V000F : COLOR V0005                                                            ' @15975
8550   LOCATE V0014 : LOCATE V0001                                                          ' @15992
8560   PRINT_BEGIN V0001 : CHR$ V00C9 : PRINT V00C9$; : STRING$  : PRINT V00C9$; : CHR$ V00BB : PRINT V00BB$ ' @16006
8570   FACLOAD!                                                                             ' @16057
8580   ADD!  : CINT V00BB : LOCATE V00BB : LOCATE V0001                                     ' @16072
8590   PRINT_BEGIN V0001 : CHR$  : PRINT V0001$; : STRING$  : PRINT V0001$; : CHR$ V0001 : PRINT V0001$ ' @16096
8600   ADD!  : FACSTORE! V0001 : ARITH!                                                     ' @16153
8610   LOCATE V0017 : LOCATE V0001                                                          ' @16182
8620   PRINT_BEGIN V0001 : CHR$ V00C8 : PRINT V00C8$; : STRING$  : PRINT V00C8$;            ' @16196
8630   RT#61(VB800)                                                                         ' @16234
8640   COLOR V000D : COLOR V0005                                                            ' @16273
8650   LOCATE V0015 : LOCATE V0002                                                          ' @16290
8660   PRINT_BEGIN V0002 : PRINT V6336$; : STRING$  : PRINT V6336$                          ' @16304
8670   LOCATE V0015 : LOCATE V0028                                                          ' @16337
8680   PRINT_BEGIN V0028 : PRINT V6346$; : STRING$  : PRINT V6346$                          ' @16351
8690   RETURN V6346                                                                         ' @16381
8700   ARITH!                                                                               ' @16393
8710   LEN V5F9E : INT2SGL  : MUL!_FAC V5F9E : ADD! V5F9E : FACSTORE! V5F9E                 ' @16407
8720   COLOR V001F : COLOR V0004                                                            ' @16455
8730   LOCATE V0015 : LOCATE V0002                                                          ' @16472
8740   PRINT_BEGIN V0002 : LOAD!  : STRING$  : PRINT V0002$; : PRINT V635A$; : PRINT V5F9E$; : PRINT V6364$; : ADD!  : CINT V6364 : STRING$ V6364 : PRINT V6364$ ' @16486
8750   GOSUB V6364                                                                          ' @16566
8760   LEN V5F9A : INT2SGL  : MUL!_FAC V5F9A : ADD! V5F9A : FACSTORE! V5F9A                 ' @16581
8770   COLOR V001F : COLOR V0004                                                            ' @16629
8780   LOCATE V0015 : LOCATE V0002                                                          ' @16646
8790   PRINT_BEGIN V0002 : LOAD!  : STRING$  : PRINT V0002$; : PRINT V635A$; : PRINT V5F9A$; : PRINT V6364$; : ADD!  : CINT V6364 : STRING$ V6364 : PRINT V6364$ ' @16660
8800   GOSUB V6364                                                                          ' @16740
8810   COLOR V001F : COLOR V0004                                                            ' @16755
8820   LOCATE V0015 : LOCATE V0002                                                          ' @16772
8830   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$; : PRINT V6374$; : STRING$ V6374 : PRINT V6374$ ' @16786
8840   COLOR V000D : COLOR V0005                                                            ' @16833
8850   LOCATE V0016 : LOCATE V0002                                                          ' @16850
8860   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$; : PRINT "Would you like to play again? (Y/N)"; : STRING$ "Would you like to play again? (Y/N)" : PRINT "Would you like to play again? (Y/N)"; ' @16864
8870   INKEY$ "Would you like to play again? (Y/N)" : V6002$ = "Would you like to play again? (Y/N)" ' @16908
8880   STRCMP  : STRCMP V61E4                                                               ' @16928
8890   STRCMP  : STRCMP V61F0                                                               ' @16969
8900   COLOR V001F : COLOR V0004                                                            ' @17011
8910   FACLOAD!                                                                             ' @17028
8920   LOAD!  : LET!                                                                        ' @17040
8930   LOAD!  : LET!                                                                        ' @17067
8940   LOAD!  : LET!                                                                        ' @17094
8950   SCALE2!  : FACSTORE!  : SCALE2! V0004 : ADD! V0004 : ADD!  : FACSTORE! V0004         ' @17121
8960   ARITH!                                                                               ' @17171
8970   ARITH!                                                                               ' @17188
8980   ARITH!                                                                               ' @17205
8990   ARITH!                                                                               ' @17222
9000   SCALE2!  : ADD!  : CINT V0004 : LOCATE V0004 : LOAD! V0004 : LOCATE V0004            ' @17236
9010   PRINT_BEGIN V0004 : PRINT V6150$                                                     ' @17274
9020   SCALE2!  : ADD!  : CINT V6150 : LOCATE V6150 : LOAD! V6150 : LOCATE V6150            ' @17295
9030   PRINT_BEGIN V6150 : PRINT V6156$                                                     ' @17333
9040   ADD!  : FACSTORE! V6156 : ARITH!                                                     ' @17353
9050   COLOR V0007 : COLOR V0000                                                            ' @17385
9060   RETURN V0000                                                                         ' @17398
9070   CLS V0000                                                                            ' @17404
9080   LOCATE V000C : LOCATE V0001                                                          ' @17413
9090   PRINT_BEGIN V0001 : PRINT "Please enter how many players? (0-2)";                    ' @17427
9100   INKEY$ "Please enter how many players? (0-2)" : V6002$ = "Please enter how many players? (0-2)" ' @17441
9110   CONCAT$  : V6002$ = "Please enter how many players? (0-2)"                           ' @17461
9120   ASC  : ASC                                                                           ' @17478
9130   LEFT$  : VAL "Please enter how many players? (0-2)" : FACNORM "Please enter how many players? (0-2)" : FACSTORE! "Please enter how many players? (0-2)" ' @17528
9140   ADD!  : CINT "Please enter how many players? (0-2)" : ON_GOSUB "Please enter how many players? (0-2)" ' @17558
9150   CLS                                                                                  ' @17581
9160   LET!                                                                                 ' @17593
9170   LOCATE V000A : LOCATE V0001                                                          ' @17602
9180   INPUT "Please enter name of first player? " : STKPUSH "Please enter name of first player? " : STKREAD V601A ' @17619
9190   LOCATE V000C : LOCATE V0001                                                          ' @17644
9200   INPUT "Please enter name of second player? *" : STKPUSH "Please enter name of second player? *" : STKREAD V601E ' @17661
9210   FACLOAD!                                                                             ' @17686
9220   LOAD!  : LEN                                                                         ' @17698
9230   LOAD!  : LEN                                                                         ' @17727
9240   LOAD!  : LEFT$  : V0001$ = V601E$                                                    ' @17757
9250   LOAD!  : LEN  : INT2SGL V601E : FACSTORE! V601E : FACLOAD! V601E                     ' @17791
9260   LOAD!  : LOAD!  : MID$  : ASC V601E : INT2SGL V601E : FACSTORE! V601E                ' @17837
9270   ARITH!  : ARITH!                                                                     ' @17893
9280   LOAD!  : ADD!  : CINT V601E : CHR$ V601E : CONCAT$ V601E : V0001$ = V601E$           ' @17931
9290   LOAD!  : LOAD!  : CHR$ V601E : CONCAT$ V601E : V0001$ = V601E$                       ' @17987
9300   ADD!  : FACSTORE! V601E : ARITH!                                                     ' @18034
9310   LOAD!  : V0001$ = ?                                                                  ' @18070
9320   ADD!  : FACSTORE! V601E : ARITH!                                                     ' @18103
9330   CLS                                                                                  ' @18132
9340   LOCATE V000A : LOCATE V0001                                                          ' @18141
9350   PRINT_BEGIN V0001 : PRINT V5F9A$; : PRINT " would you like to use 'X' or 'O'? (X/O)"; ' @18155
9360   INKEY$ " would you like to use 'X' or 'O'? (X/O)" : V6002$ = " would you like to use 'X' or 'O'? (X/O)" ' @18177
9370   STRCMP  : STRCMP V6150                                                               ' @18197
9380   LET!                                                                                 ' @18238
9390   STRCMP  : STRCMP V6156                                                               ' @18254
9400   LET!                                                                                 ' @18295
9410   LOCATE V000C : LOCATE V0001                                                          ' @18312
9420   PRINT_BEGIN V0001 : PRINT V642E$;                                                    ' @18326
9430   INKEY$ V642E : V6002$ = V642E$                                                       ' @18340
9440   STRCMP  : STRCMP V61E4                                                               ' @18360
9450   LET!                                                                                 ' @18401
9460   STRCMP  : STRCMP V61F0                                                               ' @18417
9470   LET!                                                                                 ' @18458
9480   GOSUB                                                                                ' @18472
9490   LOCATE V0016 : LOCATE V0002                                                          ' @18483
9500   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @18497
9510   LOCATE V0016 : LOCATE V0005                                                          ' @18522
9520   PRINT_BEGIN V0005 : PRINT "Please make your move:"                                   ' @18536
9530   GOSUB "Please make your move:"                                                       ' @18550
9540   ARITH!                                                                               ' @18564
9550   LET!                                                                                 ' @18581
9560   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @18594
9570   LOCATE V0016 : LOCATE V0002                                                          ' @18661
9580   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @18675
9590   LOCATE V0016 : LOCATE V0005                                                          ' @18700
9600   PRINT_BEGIN V0005 : PRINT "Please remake your move:"                                 ' @18714
9610   GOSUB "Please remake your move:"                                                     ' @18728
9620   ARITH!                                                                               ' @18746
9630   GOSUB                                                                                ' @18757
9640   GOSUB                                                                                ' @18768
9650   LET!                                                                                 ' @18782
9660   LET!                                                                                 ' @18794
9670   LET!                                                                                 ' @18806
9680   ARITH!  : ARITH!  : ARITH!  : ARITH!  : ARITH!  : ARITH!                             ' @18818
9690   LET!                                                                                 ' @18929
9700   RETURN "Please remake your move:"                                                    ' @18935
9710   GOSUB "Please remake your move:"                                                     ' @18941
9720   LOCATE V0016 : LOCATE V0005                                                          ' @18952
9730   PRINT_BEGIN V0005 : PRINT "Please make your move:"                                   ' @18966
9740   GOSUB "Please make your move:"                                                       ' @18980
9750   ARITH!                                                                               ' @18994
9760   LET!                                                                                 ' @19011
9770   LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @19024
9780   LOCATE V0016 : LOCATE V0002                                                          ' @19091
9790   PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @19105
9800   LOCATE V0016 : LOCATE V0005                                                          ' @19130
9810   PRINT_BEGIN V0005 : PRINT "Please remake your move:"                                 ' @19144
9820   GOSUB "Please remake your move:"                                                     ' @19158
9830   ARITH!                                                                               ' @19176
9840   GOSUB                                                                                ' @19187
9850   GOSUB                                                                                ' @19198
9860   LET!                                                                                 ' @19212
9870   LET!                                                                                 ' @19224
9880   LET!                                                                                 ' @19236
9890   ARITH!  : ARITH!  : ARITH!  : ARITH!  : ARITH!  : ARITH!                             ' @19248
9900   LET!                                                                                 ' @19359
9910   RETURN "Please remake your move:"                                                    ' @19365
9920   GOSUB "Please remake your move:"                                                     ' @19371
9930   V5F9A$ = ?                                                                           ' @19389
9940   V5F9E$ = ?                                                                           ' @19401
9950   LET!                                                                                 ' @19413
9960   LET!                                                                                 ' @19425
9970   GOSUB "Please remake your move:"                                                     ' @19431
9980   READ! V5EDE : READ! V5EDA : READ! V5ED6                                              ' @19442
9990   LOCATE V0016 : LOCATE V0005                                                          ' @19467
10000  PRINT_BEGIN V0005 : PRINT "Please make your move:";                                  ' @19481
10010  FACLOAD!                                                                             ' @19498
10020  FACLOAD!                                                                             ' @19510
10030  ADD!  : FACSTORE! "Please make your move:" : ARITH!                                  ' @19525
10040  LOAD!  : ON_GOSUB "Please make your move:"                                           ' @19554
10050  PRINT_BEGIN  : PRINT V5EDE!;                                                         ' @19572
10060  PRINT_BEGIN  : PRINT V6170$; : PRINT V5EDA!;                                         ' @19590
10070  PRINT_BEGIN  : PRINT V6170$; : PRINT V5ED6!                                          ' @19616
10080  ADD!  : FACSTORE! V5ED6 : ARITH!                                                     ' @19644
10090  GOSUB                                                                                ' @19673
10100  READ! V5F22 : READ! V5F26 : READ! V5F2A                                              ' @19684
10110  GOSUB V5F2A                                                                          ' @19706
10120  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @19721
10130  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @19779
10140  GOSUB V5F2A                                                                          ' @19834
10150  LET!                                                                                 ' @19848
10160  LET!                                                                                 ' @19860
10170  LET!                                                                                 ' @19872
10180  LET!                                                                                 ' @19884
10190  LET!                                                                                 ' @19896
10200  LET!                                                                                 ' @19908
10210  LET!                                                                                 ' @19920
10220  LET!                                                                                 ' @19932
10230  GOSUB V5F2A                                                                          ' @19938
10240  LOCATE V0016 : LOCATE V0002                                                          ' @19949
10250  PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @19963
10260  GOSUB V0002                                                                          ' @19985
10270  RETURN V0002                                                                         ' @19993
10280  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @20002
10290  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @20060
10300  GOSUB V0002                                                                          ' @20115
10310  LET!                                                                                 ' @20129
10320  LET!                                                                                 ' @20141
10330  LET!                                                                                 ' @20153
10340  LET!                                                                                 ' @20165
10350  LET!                                                                                 ' @20177
10360  LET!                                                                                 ' @20189
10370  LET!                                                                                 ' @20201
10380  LET!                                                                                 ' @20213
10390  GOSUB V0002                                                                          ' @20219
10400  LOCATE V0016 : LOCATE V0002                                                          ' @20230
10410  PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @20244
10420  GOSUB V0002                                                                          ' @20266
10430  RETURN V0002                                                                         ' @20274
10440  COLOR V000D : COLOR V0004                                                            ' @20285
10450  LET!                                                                                 ' @20305
10460  LET!                                                                                 ' @20317
10470  LET!                                                                                 ' @20329
10480  LET!                                                                                 ' @20341
10490  LET!                                                                                 ' @20353
10500  GOSUB V0004                                                                          ' @20359
10510  LET!                                                                                 ' @20373
10520  GOSUB V0004                                                                          ' @20379
10530  LET!                                                                                 ' @20393
10540  LET!                                                                                 ' @20405
10550  LET!                                                                                 ' @20417
10560  LET!                                                                                 ' @20429
10570  LET!                                                                                 ' @20441
10580  LET!                                                                                 ' @20453
10590  INKEY$ V0004 : V6002$ = V0004$                                                       ' @20459
10600  CONCAT$  : ASC V0004                                                                 ' @20479
10610  LEN V6002                                                                            ' @20501
10620  RIGHT$  : STRCMP V646E                                                               ' @20521
10630  GOSUB                                                                                ' @20541
10640  RIGHT$  : STRCMP V6474                                                               ' @20559
10650  GOSUB                                                                                ' @20579
10660  RIGHT$  : STRCMP V647A                                                               ' @20597
10670  GOSUB                                                                                ' @20617
10680  GOSUB                                                                                ' @20629
10690  ADD!  : FACSTORE! V647A                                                              ' @20651
10700  ADD!  : FACSTORE! V647A                                                              ' @20674
10710  LET!                                                                                 ' @20697
10720  ADD!  : FACSTORE! V647A                                                              ' @20709
10730  LET!                                                                                 ' @20732
10740  ADD!  : FACSTORE! V647A                                                              ' @20744
10750  ARITH!  : ARITH!                                                                     ' @20763
10760  SUB!  : FACSTORE! V647A                                                              ' @20804
10770  ARITH!  : ARITH!                                                                     ' @20828
10780  SUB!  : FACSTORE! V647A                                                              ' @20869
10790  ARITH!  : ARITH!  : ARITH!                                                           ' @20893
10800  ADD!  : FACSTORE! V647A                                                              ' @20950
10810  ARITH!  : ARITH!  : ARITH!                                                           ' @20973
10820  ADD!  : FACSTORE! V647A                                                              ' @21030
10830  GOSUB V647A                                                                          ' @21043
10840  COLOR V0007 : COLOR V0001                                                            ' @21054
10850  LET!                                                                                 ' @21074
10860  LET!                                                                                 ' @21086
10870  LET!                                                                                 ' @21098
10880  LET!                                                                                 ' @21110
10890  LET!                                                                                 ' @21122
10900  LET!                                                                                 ' @21134
10910  GOSUB V0001                                                                          ' @21140
10920  GOSUB V0001                                                                          ' @21148
10930  COLOR V000D : COLOR V0004                                                            ' @21159
10940  LET!                                                                                 ' @21179
10950  LET!                                                                                 ' @21191
10960  LET!                                                                                 ' @21203
10970  LET!                                                                                 ' @21215
10980  LET!                                                                                 ' @21227
10990  GOSUB V0004                                                                          ' @21233
11000  LET!                                                                                 ' @21247
11010  GOSUB V0004                                                                          ' @21253
11020  RETURN V0004                                                                         ' @21261
11030  ARITH!                                                                               ' @21273
11040  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @21287
11050  LET!                                                                                 ' @21357
11060  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @21370
11070  LET!                                                                                 ' @21440
11080  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @21457
11090  LET!                                                                                 ' @21527
11100  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @21540
11110  LET!                                                                                 ' @21610
11120  ADD!  : FACSTORE! V0004                                                              ' @21626
11130  RETURN V0004                                                                         ' @21640
11140  ARITH!  : ARITH!                                                                     ' @21652
11150  LET!                                                                                 ' @21693
11160  ARITH!  : ARITH!                                                                     ' @21709
11170  LET!                                                                                 ' @21750
11180  ARITH!  : ARITH!                                                                     ' @21766
11190  LET!                                                                                 ' @21807
11200  ARITH!  : ARITH!                                                                     ' @21823
11210  LET!                                                                                 ' @21864
11220  MUL!  : ADD! V0004 : FACSTORE! V0004                                                 ' @21876
11230  SCALE2!  : ADD!  : MUL!_FAC V0004 : ADD! V0004 : FACSTORE! V0004                     ' @21901
11240  RETURN V0004                                                                         ' @21940
11250  GOSUB V0004                                                                          ' @21946
11260  RETURN V0004                                                                         ' @21954
11270  LOAD!  : ON_GOSUB V0004                                                              ' @21963
11280  COLOR V000F                                                                          ' @21990
11290  LOAD!  : LOCATE V000F : LOAD! V000F : LOCATE V000F                                   ' @21999
11300  PRINT_BEGIN V000F : PRINT V6150$                                                     ' @22023
11310  COLOR V000F                                                                          ' @22044
11320  LOAD!  : LOCATE V000F : LOAD! V000F : LOCATE V000F                                   ' @22053
11330  PRINT_BEGIN V000F : PRINT V6156$                                                     ' @22077
11340  LOAD!  : LOCATE V6156 : LOAD! V6156 : LOCATE V6156                                   ' @22098
11350  PRINT_BEGIN V6156 : PRINT V62F6$                                                     ' @22122
11360  LOAD!  : LOCATE V62F6 : LOAD! V62F6 : LOCATE V62F6                                   ' @22143
11370  PRINT_BEGIN V62F6 : PRINT V62FC$                                                     ' @22167
11380  LOAD!  : LOCATE V62FC : LOAD! V62FC : LOCATE V62FC                                   ' @22188
11390  PRINT_BEGIN V62FC : PRINT V6302$                                                     ' @22212
11400  LOAD!  : LOCATE V6302 : LOAD! V6302 : LOCATE V6302                                   ' @22233
11410  PRINT_BEGIN V6302 : PRINT V6308$                                                     ' @22257
11420  RETURN V6308                                                                         ' @22271
11430  SGNTEST                                                                              ' @22280
11440  LOCATE V0016 : LOCATE V0002                                                          ' @22294
11450  PRINT_BEGIN V0002 : STRING$  : PRINT V0002$                                          ' @22308
11460  LOCATE V0016 : LOCATE V0005                                                          ' @22333
11470  INPUT "Please enter file name:" : STKPUSH "Please enter file name:" : STKREAD V607A  ' @22350
11480  LOCATE V0016 : LOCATE V0005                                                          ' @22375
11490  INPUT "Target disk drive: (A,B,C,D)" : STKPUSH "Target disk drive: (A,B,C,D)" : STKREAD V607E ' @22392
11500  CONCAT$  : CONCAT$  : V60F4$ = V607E$                                                ' @22420
11510  OPEN_MODE$ V6156 : RT#63()                                                           ' @22445
11520  PRINT# V0001 : PRINT V6012!, : PRINT V5F2E!, : PRINT V5F92!, : PRINT V5F8A!, : PRINT V5EDE!, : PRINT V5EDA!, : PRINT V5ED6!, : PRINT V5F22!, : PRINT V5F26!, : PRINT V5F2A! ' @22467
11530  PRINT# V0001 : PRINT V5F9A$                                                          ' @22556
11540  PRINT# V0001 : PRINT V5F9E$                                                          ' @22573
11550  FACLOAD!                                                                             ' @22590
11560  FACLOAD!                                                                             ' @22602
11570  FACLOAD!                                                                             ' @22614
11580  FACLOAD!                                                                             ' @22626
11590  FACLOAD!                                                                             ' @22638
11600  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @22650
11610  PRINT# V0001 : PRINT V000A%, : PRINT V5ECE!, : PRINT V5F86!, : PRINT V5F82!          ' @22717
11620  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @22758
11630  PRINT# V0001 : PRINT V000B%, : PRINT V5ECE!, : PRINT V5F86!, : PRINT V5F82!          ' @22825
11640  LOAD!  : LOAD!  : LOAD!  : LOAD!  : LOAD!  : ARITH!                                  ' @22866
11650  PRINT# V0001 : PRINT V6086!, : PRINT V6082!, : PRINT V5ECE!, : PRINT V5F86!, : PRINT V5F82! ' @22967
11660  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @23019
11670  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @23054
11680  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @23089
11690  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @23124
11700  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @23159
11710  PRINT# V0001 : PRINT V0064%                                                          ' @23191
11720  RT#65(V0064)                                                                         ' @23205
11730  CLEAR                                                                                ' @23215
11740  GOSUB V0064                                                                          ' @23221
11750  CLS V0064                                                                            ' @23229
11760  LOCATE V0008 : LOCATE V0001                                                          ' @23238
11770  INPUT "Please enter file name:" : STKPUSH "Please enter file name:" : STKREAD V607A  ' @23255
11780  LOCATE V000A : LOCATE V0001                                                          ' @23280
11790  INPUT "Target disk drive: (a,b,c,d)" : STKPUSH "Target disk drive: (a,b,c,d)" : STKREAD V607E ' @23297
11800  CONCAT$  : CONCAT$  : V60F4$ = V607E$                                                ' @23325
11810  OPEN_MODE$ V651E : RT#63()                                                           ' @23350
11820  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V6012 : STKREAD V5F2E : STKREAD V5F92 : STKREAD V608A : STKREAD V608E : STKREAD V6092 : STKREAD V6096 : STKREAD V609A : STKREAD V609E : STKREAD V60A2 ' @23372
11830  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V5F9A                                   ' @23477
11840  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V5F9E                                   ' @23501
11850  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V5F0E                                   ' @23525
11860  ARITH!                                                                               ' @23552
11870  ARITH!                                                                               ' @23569
11880  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V5ECE : STKREAD V5F86 : STKREAD V5F82   ' @23583
11890  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @23625
11900  ARITH!                                                                               ' @23690
11910  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V5ECE : STKREAD V5F86 : STKREAD V5F82   ' @23704
11920  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @23746
11930  INPUT#_BEGIN V0001 : STKPUSH V0001 : STKREAD V6082 : STKREAD V5ECE : STKREAD V5F86 : STKREAD V5F82 ' @23808
11940  LOAD!  : LOAD!  : LOAD!  : LOAD!  : LOAD!  : LET!                                    ' @23859
11950  RT#65()                                                                              ' @23952
11960  GOSUB V5F82                                                                          ' @23958
11970  FACLOAD!                                                                             ' @23969
11980  FACLOAD!                                                                             ' @23981
11990  FACLOAD!                                                                             ' @23993
12000  LOAD!  : LOAD!  : LOAD!  : ARITH!  : ARITH!                                          ' @24005
12010  LOAD!  : LOAD!  : LOAD!  : LET!                                                      ' @24101
12020  LOAD!  : LOAD!  : LOAD!  : ARITH!                                                    ' @24166
12030  LET!                                                                                 ' @24236
12040  LET!                                                                                 ' @24248
12050  LET!                                                                                 ' @24260
12060  GOSUB V5F82                                                                          ' @24266
12070  LET!                                                                                 ' @24284
12080  LET!                                                                                 ' @24296
12090  LET!                                                                                 ' @24308
12100  GOSUB V5F82                                                                          ' @24314
12110  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @24328
12120  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @24363
12130  ADD!  : FACSTORE! V5F82 : ARITH!                                                     ' @24398
12140  SGNTEST                                                                              ' @24430
12150  LET!                                                                                 ' @24447
12160  LET!                                                                                 ' @24459
12170  LET!                                                                                 ' @24471
12180  GOSUB V5F82                                                                          ' @24477
12190  LOAD!  : ON_GOSUB V5F82                                                              ' @24488
12200  LET!                                                                                 ' @24510
12210  LET!                                                                                 ' @24522
12220  LET!                                                                                 ' @24534
12230  GOSUB V5F82                                                                          ' @24540
12240  LOAD!  : ON_GOSUB V5F82                                                              ' @24551
12250  LET!                                                                                 ' @24573
12260  SGNTEST                                                                              ' @24586
12270  LOAD!  : ON_GOSUB V5F82                                                              ' @24600
12280  LOAD!  : ON_GOSUB V5F82                                                              ' @24619
12290  LET!                                                                                 ' @24641
12300  CLS                                                                                  ' @24651
12310  RT#76(V5F82)                                                                         ' @24657
12320  V60A6$ = ?                                                                           ' @24669
12330  LOCATE V0016 : LOCATE V001E                                                          ' @24678
12340  PRINT_BEGIN V001E : CHR$ V005F : PRINT V005F$;                                       ' @24692
12350  POS V0000 : INT2SGL V0000 : FACSTORE! V0000                                          ' @24713
12360  INKEY$ V0000 : V6002$ = V0000$                                                       ' @24733
12370  STRCMP                                                                               ' @24753
12380  LEN V6002                                                                            ' @24767
12390  RIGHT$  : STRCMP V6474                                                               ' @24787
12400  GOSUB                                                                                ' @24807
12410  RIGHT$  : STRCMP V647A                                                               ' @24825
12420  GOSUB                                                                                ' @24845
12430  CONCAT$  : ASC V647A                                                                 ' @24867
12440  POS  : POS                                                                           ' @24890
12450  CONCAT$  : ASC V647A                                                                 ' @24936
12460  ADD!  : FACSTORE! V647A                                                              ' @24961
12470  LEN V60A6                                                                            ' @24981
12480  POS V0000 : INT2SGL V0000 : FACSTORE! V0000                                          ' @24997
12490  CONCAT$  : V0001$ = V0000$                                                           ' @25022
12500  CSRLIN V0000 : LOCATE V0000 : ADD!  : CINT V0000 : LOCATE V0000                      ' @25034
12510  PRINT_BEGIN V0000 : PRINT V6002$;                                                    ' @25066
12520  CSRLIN V6002 : LOCATE V6002 : POS V0000 : LOCATE V0000                               ' @25080
12530  PRINT_BEGIN V0000 : CHR$ V005F : PRINT V005F$;                                       ' @25103
12540  LET!                                                                                 ' @25132
12550  LET!                                                                                 ' @25148
12560  POS V0000 : INT2SGL V0000 : FACSTORE! V0000                                          ' @25156
12570  ADD!  : FACSTORE! V0000                                                              ' @25181
12580  ARITH!  : ARITH!                                                                     ' @25201
12590  ADD!  : FACSTORE! V0000                                                              ' @25242
12600  LEN V60A6 : INT2SGL V60A6 : FACSTORE! V60A6                                          ' @25263
12610  SGNTEST                                                                              ' @25286
12620  LOAD!  : LEFT$  : V0001$ = V60A6$                                                    ' @25300
12630  CSRLIN V60A6 : LOCATE V60A6 : ADD!  : CINT V60A6 : LOCATE V60A6                      ' @25325
12640  PRINT_BEGIN V60A6 : PRINT V60F4$;                                                    ' @25357
12650  CSRLIN V60F4 : INT2SGL V60F4 : ADD! V60F4 : CINT V60F4 : LOCATE V60F4 : LOAD! V60F4 : LOCATE V60F4 ' @25371
12660  PRINT_BEGIN V60F4 : CHR$ V005F : PRINT V005F$;                                       ' @25413
12670  RETURN V005F                                                                         ' @25432
12680  CSRLIN V005F : LOCATE V005F : LOAD! V005F : LOCATE V005F                             ' @25438
12690  PRINT_BEGIN V005F : PRINT V60F4$                                                     ' @25462
12700  LEN V60A6                                                                            ' @25479
12710  LET!                                                                                 ' @25499
12720  LEFT$  : VAL V60A6 : FACNORM V60A6 : FACSTORE! V60A6                                 ' @25515
12730  MID$  : VAL V60A6 : FACNORM V60A6 : FACSTORE! V60A6                                  ' @25548
12740  RIGHT$  : VAL V60A6 : FACNORM V60A6 : FACSTORE! V60A6                                ' @25578
12750  RETURN V60A6                                                                         ' @25602
12760  ARG_C V0000 : ARG_C V0000 : ARG_C V0001 : SCREEN_STMT V0001                          ' @25610
12770  COLOR V000B : COLOR V0001 : COLOR V0007                                              ' @25641
12780  CLS V0007                                                                            ' @25663
12790  LOCATE V0019 : LOCATE V001E                                                          ' @25672
12800  PRINT_BEGIN V001E : PRINT V6542$;                                                    ' @25686
12810  COLOR V0002 : COLOR V0007                                                            ' @25703
12820  PRINT_BEGIN V0007 : PRINT V654A$;                                                    ' @25717
12830  LOCATE V0001 : LOCATE V0023                                                          ' @25734
12840  COLOR V000F : COLOR V0001                                                            ' @25751
12850  PRINT_BEGIN V0001 : PRINT V6562$                                                     ' @25765
12860  COLOR V000E : COLOR V0006                                                            ' @25782
12870  PRINT_BEGIN V0006 : PRINT V652C$                                                     ' @25796
12880  PRINT_BEGIN V652C : PRINT V652C$                                                     ' @25810
12890  PRINT_BEGIN V652C : PRINT V6572$                                                     ' @25824
12900  PRINT_BEGIN V6572 : PRINT "that this one is a 3D-game (4X4).  And it is much fun to play with.  To win you" ' @25838
12910  PRINT_BEGIN "that this one is a 3D-game (4X4).  And it is much fun to play with.  To win you" : PRINT "have to lie 4 'X' or 'O' on a vertical, hoirzontal,  or diagonal line. Everyone" ' @25852
12920  PRINT_BEGIN "have to lie 4 'X' or 'O' on a vertical, hoirzontal,  or diagonal line. Everyone" : PRINT V666E$ ' @25866
12930  PRINT_BEGIN V666E : PRINT "Remember that if you try, you can win.O"                  ' @25880
12940  PRINT_BEGIN "Remember that if you try, you can win.O" : PRINT V652C$                 ' @25894
12950  PRINT_BEGIN V652C : PRINT "In mid of a game,  you can save it for later use,  by using function key  (F2)." ' @25908
12960  PRINT_BEGIN "In mid of a game,  you can save it for later use,  by using function key  (F2)." : PRINT V6740$ ' @25922
12970  PRINT_BEGIN V6740 : PRINT "instructions,  (F4) is for start a new game, and (F10) is to end the game." ' @25936
12980  RETURN "instructions,  (F4) is for start a new game, and (F10) is to end the game."  ' @25950
12990  ARG_C V0000 : ARG_C V0000 : SCREEN_STMT V0001                                        ' @25958
13000  INKEY$ V0001 : V6002$ = V0001$                                                       ' @25977
13010  CONCAT$  : ASC V0001                                                                 ' @25997
13020  ARG_C V0000 : ARG_C V0000 : SCREEN_STMT V0000                                        ' @26018
13030  RETURN V0000                                                                         ' @26034
13040  RT#77() : SND_TIMER_OFF                                                              ' @26043