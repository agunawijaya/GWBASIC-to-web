10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1290
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 DEFSTR J,L:GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 GOSUB 820
90 GOSUB 920
100 GOSUB 230
110 GOSUB 40
120 GOSUB 820
130 GOSUB 1030
140 GOSUB 40
150 GOSUB 820
160 GOSUB 1100
170 GOSUB 40
180 NO$="N"
190 GOSUB 820
200 GOSUB 1180
210 GOSUB 40
220 RUN"BUSNINE"
230 JA="É"+STRING$(10,"Í")+"Ë"+STRING$(4,"Í")+"Ë"+STRING$(22,"Í")+"Ë"+STRING$(9,"Í")+"Ë"+STRING$(9,"Í")+"»"
280 JB="º   DATE   ºACCTº     ACCOUNT NAME     º  DEBIT  º CREDIT  º"
290 JC="Ì"+STRING$(10,"Í")+"Î"+STRING$(4,"Í")+"Î"+STRING$(22,"Í")+"Î"+STRING$(9,"Í")+"Î"+STRING$(9,"Í")+"¹"
340 JD="º 06/30/82 º 41 º SALES                º 12045.00º         º"
350 JE="º          º 31 º    OWNER CAPITAL     º         º 12045.00º"
360 JF="º          º    º                      º         º         º"
370 JG="º          º 31 º OWNER CAPITAL        º  9545.00º         º"
380 JH="º          º 51 º    SALARY EXPENSE    º         º  3500.00º"
390 JI="º          º 52 º    SUPPLIES EXPENSE  º         º  6045.00º"
400 JJ="º          º    º                      º         º         º"
410 JK="º          º 31 º OWNER CAPITAL        º   860.00º         º"
420 JL="º          º 32 º    OWNER WITHDRAWAL  º         º   860.00º"
430 JN="º          º    º                      º         º         º"
440 JO="º          º    º                      º         º         º"
450 JM="È"+STRING$(10,"Í")+"Ê"+STRING$(4,"Í")+"Ê"+STRING$(22,"Í")+"Ê"+STRING$(9,"Í")+"Ê"+STRING$(9,"Í")+"¼"
500 LA="É"+STRING$(10,"Í")+"Ë"+STRING$(22,"Í")+"Ë"+STRING$(9,"Í")+"Ë"+STRING$(9,"Í")+"Ë"+STRING$(9,"Í")+"Ë"+STRING$(9,"Í")+"»"
560 LB="º   DATE   º         ITEM         º  DEBIT  º CREDIT  º BAL DBT º BAL CRD º"
570 LC="Ì"+STRING$(10,"Í")+"Î"+STRING$(22,"Í")+"Î"+STRING$(9,"Í")+"Î"+STRING$(9,"Í")+"Î"+STRING$(9,"Í")+"Î"+STRING$(9,"Í")+"¹"
630 LD="º 06/30/82 º BALANCE              º         º         º         º 14700.00º"
640 LE="º 06/30/82 º CLOSE OUT SALES      º         º 12045.00º         º 26745.00º"
650 LF="º 06/30/82 º CLOSE OUT EXPENSES   º  9545.00º         º         º 17200.00º"
660 LG="º 06/30/82 º CLOSE OUT WITHDRAWAL º   860.00º         º         º 16340.00º"
670 LH="º 06/30/82 º BALANCE              º         º         º         º 12045.00º"
680 LI="º 06/30/82 º CLOSE OUT ACCOUNT    º 12045.00º         º         º     0.00º"
690 LJ="º 06/30/82 º BALANCE              º         º         º  3500.00º         º"
700 LK="º 06/30/82 º CLOSE OUT ACCOUNT    º         º  3500.00º     0.00º         º"
710 LL="º 06/30/82 º BALANCE              º         º         º  6045.00º         º"
720 LM="º 06/30/82 º CLOSE OUT ACCOUNT    º         º  6045.00º     0.00º         º"
730 LN="º 06/30/82 º BALANCE              º         º         º   860.00º         º"
740 LO="º 06/30/82 º CLOSE OUT ACCOUNT    º         º   860.00º     0.00º         º"
750 LZ="È"+STRING$(10,"Í")+"Ê"+STRING$(22,"Í")+"Ê"+STRING$(9,"Í")+"Ê"+STRING$(9,"Í")+"Ê"+STRING$(9,"Í")+"Ê"+STRING$(9,"Í")+"¼"
810 RETURN
820 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
830 FOR I=1 TO 3 STEP 2:FOR H=20 TO 62:LOCATE I,H,0:PRINT"Ä":NEXT:NEXT
840 LOCATE 1,19:PRINT"Ú":LOCATE 1,63:PRINT"¿":LOCATE 3,63:PRINT"Ù":LOCATE 3,19:PRINT"À"
850 LOCATE 2,19:PRINT"³"SPC(43)"³"
860 COLOR 0,7
870 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
880 COLOR 11,0:LOCATE 4,29:PRINT"STEP X. CLOSING ENTRIES":COLOR 7,0
890 IF NO$="N" THEN 910
900 COLOR 11,0:PRINT TAB(29)"-----------------------":COLOR 7,0
910 RETURN
920 LOCATE 7,18:PRINT"The revenue, expense and drawing accounts are only"
930 PRINT TAB(14)"temporary accounts which are used to classify and sum-"
940 PRINT TAB(14)"marize changes in capital during the accounting period."
950 PRINT TAB(14)"At the end of the period the net effect of the balance"
960 PRINT TAB(14)"in these  accounts is recorded in a permanent account."
970 PRINT TAB(14)"The balances must also be removed so that they will be"
980 PRINT TAB(14)"ready for use in the  accumulation of data in the next"
990 PRINT TAB(14)"accounting period. This is accomplished by a series of"
1000 PRINT TAB(14)"entries called CLOSING ENTRIES."
1010 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Journal *****":COLOR 7,0
1020 RETURN
1030 LOCATE 7,11:PRINT JA:PRINT TAB(11)JB:PRINT TAB(11)JC
1040 PRINT TAB(11)JD:PRINT TAB(11)JE:PRINT TAB(11)JF
1050 PRINT TAB(11)JG:PRINT TAB(11)JH:PRINT TAB(11)JI
1060 PRINT TAB(11)JJ:PRINT TAB(11)JK:PRINT TAB(11)JL
1070 PRINT TAB(11)JN:PRINT TAB(11)JO:PRINT TAB(11)JM
1080 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Ledger *****":COLOR 7,0
1090 RETURN
1100 LOCATE 7,5:PRINT LA:PRINT TAB(5)LB:PRINT TAB(5)LC
1110 COLOR 11,0:PRINT"Own.";:COLOR 7,0:PRINT LD
1120 COLOR 11,0:PRINT"Cap.";:COLOR 7,0:PRINT LE
1130 PRINT TAB(5)LF:PRINT TAB(5)LG:PRINT TAB(5)LZ
1140 LOCATE 17,5:PRINT LA:PRINT TAB(5)LB:PRINT TAB(5)LC
1150 COLOR 11,0:PRINT"Sale";:COLOR 7,0:PRINT LH:PRINT TAB(5)LI:PRINT TAB(5)LZ
1160 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key To Continue Posting *****       ";:COLOR 7,0
1170 RETURN
1180 LOCATE 5,5,0:PRINT LA:PRINT TAB(5)LB:PRINT TAB(5)LC
1190 COLOR 11,0:PRINT"Sal.";:COLOR 7,0:PRINT LJ
1200 COLOR 11,0:PRINT"Exp.";:COLOR 7,0:PRINT LK:PRINT TAB(5)LZ
1210 LOCATE 12,5:PRINT LA:PRINT TAB(5)LB:PRINT TAB(5)LC
1220 COLOR 11,0:PRINT"Sup.";:COLOR 7,0:PRINT LL
1230 COLOR 11,0:PRINT"Exp.";:COLOR 7,0:PRINT LM:PRINT TAB(5)LZ
1240 LOCATE 19,5:PRINT LA:PRINT TAB(5)LB:PRINT TAB(5)LC
1250 COLOR 11,0:PRINT"With";:COLOR 7,0:PRINT LN
1260 COLOR 11,0:PRINT"draw";:COLOR 7,0:PRINT LO:PRINT TAB(5)LZ;
1270 COLOR 11,0:LOCATE 25,16:PRINT"***** Strike Any Key For Post-closing Trial BALANCE *****       ";:COLOR 7,0
1280 RETURN
1290 RUN"menu"
