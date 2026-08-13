10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 660:DEFSTR J,L
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 JA=CHR$(201):FOR I=1 TO 6:JA=JA+"Í":NEXT
90 JA=JA+"Ë":FOR I=1 TO 30:JA=JA+"Í":NEXT
100 JA=JA+"Ë":FOR I=1 TO 23:JA=JA+"Í":NEXT
110 JA=JA+"»"
120 JB="º ACCT º        ACCOUNT NAME          º     TRIAL BALANCE     º"
130 JC="º      º                              º  DEBIT       CREDIT   º"
140 JD="Ì":FOR I=1 TO 6:JD=JD+"Í":NEXT
150 JD=JD+"Î":FOR I=1 TO 30:JD=JD+"Í":NEXT
160 JD=JD+"Î":FOR I=1 TO 11:JD=JD+"Í":NEXT
170 JD=JD+"Ë":FOR I=1 TO 11:JD=JD+"Í":NEXT
180 JD=JD+"¹"
190 JE="º  11  º   CASH                       º 14,240.00 º           º"
200 JF="º  12  º   ACCOUNTS RECEIVABLE        º  1,695.00 º           º"
210 JG="º  14  º   SUPPLIES                   º  5,655.00 º           º"
220 JH="º  21  º   ACCOUNTS PAYABLE           º           º  3,500.00 º"
230 JI="º  31  º   OWNER CAPITAL              º           º 14,700.00 º"
240 JJ="º  32  º   OWNER CAPITAL, WITHDRAWAL  º    860.00 º           º"
250 JK="º  41  º   SALES                      º           º 12,045.00 º"
260 JL="º  51  º   SALARY EXPENSE             º  1,750.00 º           º"
270 JM="º  52  º   SUPPLIES EXPENSE           º  6,045.00 º           º"
280 JO="º      º                              Ç"
290 FOR I=1 TO 11:JO=JO+"Ä":NEXT:JO=JO+"×"
300 FOR I=1 TO 11:JO=JO+"Ä":NEXT:JO=JO+"¶"
310 JP="º      º                              º  30245.00 º  30245.00 º"
320 JN="È":FOR I=1 TO 6:JN=JN+"Í":NEXT
330 JN=JN+"Ê":FOR I=1 TO 30:JN=JN+"Í":NEXT
340 JN=JN+"Ê":FOR I=1 TO 11:JN=JN+"Í":NEXT
350 JN=JN+"Ê":FOR I=1 TO 11:JN=JN+"Í":NEXT:JN=JN+"¼"
360 GOTO 460
370 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu"
380 COLOR 11,0
390 FOR I=1 TO 3 STEP 2:FOR H=20 TO 62:LOCATE I,H,0:PRINT "Ä":NEXT:NEXT
400 LOCATE 1,19:PRINT "Ú":LOCATE 1,63:PRINT "¿":LOCATE 3,63:PRINT "Ù":LOCATE 3,19:PRINT "À"
410 LOCATE 2,19:PRINT CHR$(179) SPC(43) CHR$(179)
420 COLOR 0,7
430 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
440 COLOR 11,0:LOCATE 4,30:PRINT"STEP VI. TRIAL BALANCE":PRINT;TAB(30);"----------------------":COLOR 7,0
450 RETURN
460 GOSUB 370
470 LOCATE 7,18:PRINT"The purpose of the trial balance is not to provide"
480 PRINT TAB(13)"complete proof of accuracy,  but instead to insure that"
490 PRINT TAB(13)"the debits and the credits are equal. An addition error"
500 PRINT TAB(13)"will show up but an error such as posting a transaction"
510 PRINT TAB(13)"twice or failing to post it all together or posting one"
520 PRINT TAB(13)"to the wrong accounts will not be detected on the Trial"
530 PRINT TAB(13)"Balance."
540 COLOR 11,0:LOCATE 23,16:PRINT"***** Strike Any Key For The Trial Balance *****":COLOR 7,0
550 GOSUB 40
560 GOSUB 370
570 LOCATE 7,8:PRINT JA:PRINT;TAB(8);JB:PRINT;TAB(8);JC
580 PRINT;TAB(8);JD:PRINT;TAB(8);JE:PRINT;TAB(8);JF
590 PRINT;TAB(8);JG:PRINT;TAB(8);JH:PRINT;TAB(8);JI
600 PRINT;TAB(8);JJ:PRINT;TAB(8);JK:PRINT;TAB(8);JL
610 PRINT;TAB(8);JM:PRINT;TAB(8);JO:PRINT;TAB(8);JP
620 PRINT;TAB(8);JN
630 COLOR 11,0:LOCATE 23,15:PRINT"***** Strike Any Key To Prepare The Worksheet *****":COLOR 7,0
640 GOSUB 40
650 RUN"BUSFIVE"
660 RUN"menu"
