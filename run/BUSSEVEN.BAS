10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1020
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT:DEFSTR A-E,J,L
30 GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 GOSUB 670
90 GOSUB 760
100 GOSUB 190
110 GOSUB 40
120 GOSUB 670
130 GOSUB 890
140 GOSUB 40
150 GOSUB 670
160 GOSUB 960
170 GOSUB 40
180 RUN"BUSEIGHT"
190 JA="É":FOR I=1 TO 10:JA=JA+"Í":NEXT
200 JA=JA+"Ë":FOR I=1 TO 4:JA=JA+"Í":NEXT
210 JA=JA+"Ë":FOR I=1 TO 22:JA=JA+"Í":NEXT
220 JA=JA+"Ë":FOR I=1 TO 9:JA=JA+"Í":NEXT
230 JA=JA+"Ë":FOR I=1 TO 9:JA=JA+"Í":NEXT:JA=JA+"»"
240 JB="º   DATE   ºACCTº     ACCOUNT NAME     º  DEBIT  º CREDIT  º"
250 JC="Ì":FOR I=1 TO 10:JC=JC+"Í":NEXT
260 JC=JC+"Î":FOR I=1 TO 4:JC=JC+"Í":NEXT
270 JC=JC+"Î":FOR I=1 TO 22:JC=JC+"Í":NEXT
280 JC=JC+"Î":FOR I=1 TO 9:JC=JC+"Í":NEXT
290 JC=JC+"Î":FOR I=1 TO 9:JC=JC+"Í":NEXT:JC=JC+"¹"
300 JD="º 06/30/82 º 51 º SALARY EXPENSE       º 1750.00 º         º"
310 JE="º          º 11 º   CASH               º         º 1750.00 º"
320 JG="º          º    º     PAID EMPLOYEES   º         º         º"
330 JH="º          º    º                      º         º         º"
340 JI="º          º    º                      º         º         º"
350 JJ="º          º    º                      º         º         º"
360 JK="È":FOR I=1 TO 10:JK=JK+"Í":NEXT
370 JK=JK+"Ê":FOR I=1 TO 4:JK=JK+"Í":NEXT
380 JK=JK+"Ê":FOR I=1 TO 22:JK=JK+"Í":NEXT
390 JK=JK+"Ê":FOR I=1 TO 9:JK=JK+"Í":NEXT
400 JK=JK+"Ê":FOR I=1 TO 9:JK=JK+"Í":NEXT:JK=JK+"¼"
410 JM="Explanation :":JMA=" 1) The debit to salary expense will increase it.
420 LN=" 2) The credit to cash will decrease it."
430 LA="É":FOR I=1 TO 10:LA=LA+"Í":NEXT
440 LA=LA+"Ë":FOR I=1 TO 22:LA=LA+"Í":NEXT
450 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
460 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
470 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
480 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT:LA=LA+"»"
490 LB="º   DATE   º         ITEM         º  DEBIT  º CREDIT  º BAL DBT º BAL CRD º"
500 LC="Ì":FOR I=1 TO 10:LC=LC+"Í":NEXT
510 LC=LC+"Î":FOR I=1 TO 22:LC=LC+"Í":NEXT
520 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
530 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
540 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
550 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT:LC=LC+"¹"
560 LD="º 06/30/82 º BALANCE              º         º         º 1750.00 º         º"
570 LE="º 06/30/82 º PAYROLL ADJUSTMENT   º 1750.00 º         º 3500.00 º         º"
580 LF="º 06/30/82 º BALANCE              º         º         º14240.00 º         º"
590 LG="º 06/30/82 º PAYROLL ADJUSTMENT   º         º 1750.00 º12490.00 º         º"
600 LK="È":FOR I=1 TO 10:LK=LK+"Í":NEXT
610 LK=LK+"Ê":FOR I=1 TO 22:LK=LK+"Í":NEXT
620 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
630 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
640 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
650 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT:LK=LK+"¼"
660 RETURN
670 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
680 FOR I=1 TO 3 STEP 2:FOR H=20 TO 62:LOCATE I,H,0:PRINT "Ä":NEXT:NEXT
690 LOCATE 1,19,0:PRINT "Ú":LOCATE 1,63,0:PRINT "¿":LOCATE 3,63,0:PRINT "Ù":LOCATE 3,19,0:PRINT "À"
700 LOCATE 2,19,0:PRINT "³" SPC(43) "³"
710 COLOR 0,7
720 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
730 COLOR 11,0:LOCATE 5,27:PRINT"STEP IX. ADJUSTING ENTRIES"
740 PRINT;TAB(27);"--------------------------":COLOR 7,0
750 RETURN
760 LOCATE 7,19:PRINT"At the end of the accounting period the adjusting"
770 PRINT;TAB(14);"entries appearing in the worksheet are recorded in the"
780 PRINT;TAB(14);"journal and posted to the ledger,  bringing the ledger"
790 PRINT;TAB(14);"into agreement with the data reported on the financial"
800 PRINT;TAB(14);"statements.  The adjusting entries are dated as of the"
810 PRINT;TAB(14);"last day of the accounting cycle, even though they are"
820 PRINT;TAB(14);"usually recorded at a later date."
830 PRINT;TAB(19);"In this simulation our adjusting entry dealt with"
840 PRINT;TAB(14);"the salary expense and cash accounts.  This was due to"
850 PRINT;TAB(14);"a mistake in payroll which went undetected until after"
860 PRINT;TAB(14);"the cutoff date for closing the books."
870 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Journal *****":COLOR 7,0
880 RETURN
890 LOCATE 7,11:PRINT JA:PRINT;TAB(11);JB:PRINT;TAB(11);JC
900 PRINT;TAB(11);JD:PRINT;TAB(11);JE
910 PRINT;TAB(11);JG:PRINT;TAB(11);JH:PRINT;TAB(11);JI
920 PRINT;TAB(11);JJ:PRINT;TAB(11);JK:PRINT:COLOR 11,0:PRINT;TAB(10);JM;:COLOR 7,0:PRINT JMA
930 PRINT;TAB(23);LN:PRINT;TAB(3);JP
940 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Ledger *****":COLOR 7,0
950 RETURN
960 LOCATE 7,5:PRINT LA:PRINT;TAB(5);LB:PRINT;TAB(5);LC
970 COLOR 11,0:PRINT"Sal.";:COLOR 7,0:PRINT LD:PRINT;TAB(5);LE:PRINT;TAB(5);LK
980 LOCATE 15,5:PRINT LA:PRINT;TAB(5);LB:PRINT;TAB(5);LC
990 COLOR 11,0:PRINT"Cash";:COLOR 7,0:PRINT LF:PRINT;TAB(5);LG:PRINT;TAB(5);LK
1000 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Closing Entries *****       ";:COLOR 7,0
1010 RETURN
1020 RUN"menu"
