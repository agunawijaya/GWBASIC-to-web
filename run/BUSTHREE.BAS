1 DEFSTR J,L
10  DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1440
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30  GOTO 80
40  POKE 106,0
50  IF INKEY$<>"" THEN 40
60  RESP$=INKEY$:IF RESP$="" THEN 60
70  RETURN
80  GOSUB 820:GOSUB 890:GOSUB 980:GOSUB 300:GOSUB 40:GOSUB 820:GOSUB 930:GOSUB 1040:GOSUB 40:GOSUB 820:GOSUB 930:GOSUB 1170:GOSUB 40:GOSUB 820:GOSUB 960:GOSUB 1240:GOSUB 40:GOSUB 820:GOSUB 960:GOSUB 1360:GOSUB 40
290 RUN"BUSFOUR"
300 JA="É":FOR I=1 TO 10:JA=JA+"Í":NEXT
310 JA=JA+"Ë":FOR I=1 TO 4:JA=JA+"Í":NEXT
320 JA=JA+"Ë":FOR I=1 TO 22:JA=JA+"Í":NEXT
330 JA=JA+"Ë":FOR I=1 TO 9:JA=JA+"Í":NEXT
340 JA=JA+"Ë":FOR I=1 TO 9:JA=JA+"Í":NEXT:JA=JA+"»"
350 JB="º   DATE   ºACCTº     ACCOUNT NAME     º  DEBIT  º CREDIT  º"
360 JC="Ì":FOR I=1 TO 10:JC=JC+"Í":NEXT
370 JC=JC+"Î":FOR I=1 TO 4:JC=JC+"Í":NEXT
380 JC=JC+"Î":FOR I=1 TO 22:JC=JC+"Í":NEXT
390 JC=JC+"Î":FOR I=1 TO 9:JC=JC+"Í":NEXT
400 JC=JC+"Î":FOR I=1 TO 9:JC=JC+"Í":NEXT:JC=JC+"¹"
410 JD="º 06/03/82 º 14 º SUPPLIES             º 1500.00 º         º"
420 JE="º          º 11 º   CASH               º         º  500.00 º"
430 JF="º          º 21 º   ACCOUNTS PAYABLE   º         º 1000.00 º"
440 JG="º          º    º     PURCHASED GOODS  º         º         º"
450 JH="º          º    º                      º         º         º"
460 JI="º          º    º                      º         º         º"
470 JJ="º          º    º                      º         º         º"
480 JK="È":FOR I=1 TO 10:JK=JK+"Í":NEXT
490 JK=JK+"Ê":FOR I=1 TO 4:JK=JK+"Í":NEXT
500 JK=JK+"Ê":FOR I=1 TO 22:JK=JK+"Í":NEXT
510 JK=JK+"Ê":FOR I=1 TO 9:JK=JK+"Í":NEXT
520 JK=JK+"Ê":FOR I=1 TO 9:JK=JK+"Í":NEXT:JK=JK+"¼"
530 JM="Explanation :":JMA$=" 1) The debit to supplies will increase it."
540 JN=" 2) The credit to cash will decrease it."
550 JO=" 3) The credit to accounts payable will increase it."
560 LA="É":FOR I=1 TO 10:LA=LA+"Í":NEXT
570 LA=LA+"Ë":FOR I=1 TO 22:LA=LA+"Í":NEXT
580 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
590 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
600 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT
610 LA=LA+"Ë":FOR I=1 TO 9:LA=LA+"Í":NEXT:LA=LA+"»"
620 LB="º   DATE   º         ITEM         º  DEBIT  º CREDIT  º BAL DBT º BAL CRD º"
630 LC="Ì":FOR I=1 TO 10:LC=LC+"Í":NEXT
640 LC=LC+"Î":FOR I=1 TO 22:LC=LC+"Í":NEXT
650 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
660 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
670 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT
680 LC=LC+"Î":FOR I=1 TO 9:LC=LC+"Í":NEXT:LC=LC+"¹"
690 LD="º 06/01/82 º BALANCE              º 6700.00 º         º 6700.00 º         º"
700 LE="º 06/03/82 º PURCHASE OF GOODS    º 1500.00 º         º 8200.00 º         º"
710 LF="º 06/01/82 º BALANCE              º 8000.00 º         º 8000.00 º         º"
720 LG="º 06/03/82 º PURCHASE OF GOODS    º         º  500.00 º 7500.00 º         º"
730 LH="º 06/01/82 º BALANCE              º         º    0.00 º         º    0.00 º"
740 LI="º 06/03/82 º PURCHASE OF GOODS    º         º 1000.00 º         º 1000.00 º"
750 LK="È":FOR I=1 TO 10:LK=LK+"Í":NEXT
760 LK=LK+"Ê":FOR I=1 TO 22:LK=LK+"Í":NEXT
770 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
780 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
790 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT
800 LK=LK+"Ê":FOR I=1 TO 9:LK=LK+"Í":NEXT:LK=LK+"¼"
810 RETURN
820 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
830 FOR I=1 TO 3 STEP 2:FOR H=20 TO 62:LOCATE I,H,0:PRINT "Ä":NEXT:NEXT
840 LOCATE 1,19:PRINT "Ú":LOCATE 1,63:PRINT "¿":LOCATE 3,63:PRINT "Ù":LOCATE 3,19:PRINT "À"
850 LOCATE 2,19:PRINT "³" SPC(43) "³"
860 COLOR 0,7
870 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
880 RETURN
890 COLOR 11,0:LOCATE 5,26:PRINT"STEP III. TRANSACTIONS OCCUR"
900 PRINT;TAB(26);"----------------------------"
910 LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Journal *****":COLOR 7,0
920 RETURN
930 COLOR 11,0:LOCATE 5,26:PRINT" STEP IV. POSTING TO JOURNAL"
940 PRINT;TAB(26);" ---------------------------":COLOR 7,0
950 RETURN
960 COLOR 11,0:LOCATE 4,27:PRINT"STEP V. POSTING TO LEDGERS ":COLOR 7,0
970 RETURN
980 LOCATE 8,20:PRINT"On the 3rd day of June, Homer purchased $1500"
990 PRINT;TAB(15);"worth of hardware from his supplier.  He paid $500"
1000 PRINT;TAB(15);"of the  bill in cash and put the  remaining amount"
1010 PRINT;TAB(15);"of the bill on his account,  to be paid in full no"
1020 PRINT;TAB(15);"later than the end of the month."
1030 RETURN
1040 LOCATE 7,18:PRINT"The first thing that must be done after a business"
1050 PRINT;TAB(13);"transaction occurs is the posting to the journals. This"
1060 PRINT;TAB(13);"should be done as soon as possible. For this simulation"
1070 PRINT;TAB(13);"we will be using a double entry system. This means that"
1080 PRINT;TAB(13);"for every debit that is posted,  a credit entry must be"
1090 PRINT;TAB(13);"made.  There can be several different accounts involved"
1100 PRINT;TAB(13);"in a single transaction."
1110 PRINT;TAB(18);"The first entry in the journal for any transaction"
1120 PRINT;TAB(13);"should have the date it occured. All journal entries in"
1130 PRINT;TAB(13);"the transaction must have account number, account name,"
1140 PRINT;TAB(13);"and either debit or credit amount."
1150 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Journal *****":COLOR 7,0
1160 RETURN
1170 LOCATE 7,11:PRINT JA:PRINT;TAB(11);JB:PRINT;TAB(11);JC
1180 PRINT;TAB(11);JD:PRINT;TAB(11);JE:PRINT;TAB(11);JF
1190 PRINT;TAB(11);JG:PRINT;TAB(11);JH:PRINT;TAB(11);JI
1200 PRINT;TAB(11);JJ:PRINT;TAB(11);JK:PRINT:COLOR 11,0:PRINT;TAB(11);JM;:COLOR 7,0:PRINT JMA$
1210 PRINT;TAB(24);JN:PRINT;TAB(24);JO:PRINT;TAB(3);JP
1220 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Ledger *****":COLOR 7,0
1230 RETURN
1240 COLOR 15,0:LOCATE 5,27:PRINT"-------------------------- ":COLOR 7,0
1250 LOCATE 7,18:PRINT"After you have made your journal entries, you must"
1260 PRINT;TAB(13);"next transfer these entries, one at a time, to seperate"
1270 PRINT;TAB(13);"ledgers. The purpose of the ledgers is to summarize all"
1280 PRINT;TAB(13);"of the activity against any account for a  given period"
1290 PRINT;TAB(13);"of time. Each account that is set up will have a ledger"
1300 PRINT;TAB(13);"of its own.  This ledger will contain every transaction"
1310 PRINT;TAB(13);"concerning this account and the amount.  The balance of"
1320 PRINT;TAB(13);"the account before and after  the transaction occurs is"
1330 PRINT;TAB(13);"also recorded."
1340 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key To Post To The Ledger *****":COLOR 7,0
1350 RETURN
1360 LOCATE 5,5:PRINT LA:PRINT;TAB(5);LB:PRINT;TAB(5);LC
1370 COLOR 11,0:PRINT"Supp";:COLOR 7,0:PRINT LD:PRINT;TAB(5);LE:PRINT;TAB(5);LK
1380 LOCATE 12,5:PRINT LA:PRINT;TAB(5);LB:PRINT;TAB(5);LC
1390 COLOR 11,0:PRINT"Cash";:COLOR 7,0:PRINT LF:PRINT;TAB(5);LG:PRINT;TAB(5);LK
1400 LOCATE 19,5:PRINT LA:PRINT;TAB(5);LB:PRINT;TAB(5);LC
1410 COLOR 11,0:PRINT"Acct";:COLOR 7,0:PRINT LH:COLOR 11,0:PRINT"Pay.";:COLOR 7,0:PRINT LI:PRINT;TAB(5);LK;
1420 COLOR 11,0:LOCATE 25,16:PRINT"***** Strike Any Key For The Trial Balance *****       ";:COLOR 7,0
1430 RETURN
1440 RUN"menu
