10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1020
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 GOSUB 150:GOSUB 280:GOSUB 40
90 GOSUB 150:GOSUB 230:GOSUB 370:GOSUB 40
100 GOSUB 150:GOSUB 510:GOSUB 40
110 GOSUB 150:GOSUB 230:GOSUB 610:GOSUB 40
120 GOSUB 150:GOSUB 740:GOSUB 40
130 GOSUB 150:GOSUB 230:GOSUB 830:GOSUB 40
140 RUN"BUSSEVEN"
150 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
160 FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J,0:PRINT "Ä":NEXT:NEXT
170 LOCATE 1,19:PRINT "Ú":LOCATE 1,63:PRINT "¿":LOCATE 3,63:PRINT "Ù":LOCATE 3,19:PRINT "À"
180 LOCATE 2,19:PRINT "³" SPC(43) "³"
190 COLOR 0,7
200 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
210 COLOR 11,0:LOCATE 4,26:PRINT"STEP VIII. FINANCIAL STATEMENTS":COLOR 7,0
220 RETURN
230 LOCATE 5,6:PRINT "É";:FOR I=7 TO 74:PRINT "Í";:NEXT
240 LOCATE 5,75:PRINT "»":FOR I=6 TO 23:LOCATE I,75:PRINT "º";:NEXT
250 LOCATE 24,75:PRINT "¼";:FOR I=74 TO 7 STEP -1:LOCATE 24,I:PRINT "Í";:NEXT
260 LOCATE 24,6:PRINT "È";:FOR I=23 TO 6 STEP -1:LOCATE I,6:PRINT "º":NEXT
270 RETURN
280 COLOR 11,0:LOCATE 5,26,0:PRINT"-------------------------------":COLOR 7,0
290 LOCATE 7,19:PRINT"The purpose of an Income Statement is to reflect"
300 PRINT;TAB(15);"the net income amount for a given accounting period."
310 PRINT;TAB(15);"This is done by simply subtracting the total revenue"
320 PRINT;TAB(15);"for the period from the sum of all expenses incurred."
330 PRINT;TAB(15);"The net income determined on the Income Statement is"
340 PRINT;TAB(15);"carried over to the Capital Statement."
350 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Income Statement *****";:COLOR 7,0
360 RETURN
370 COLOR 11,0:LOCATE 6,35:PRINT"ABC Hardware":LOCATE 7,33:PRINT"Income Statement"
380 LOCATE 8,26:PRINT"For Month Ended June 30 , 1982":COLOR 7,0
390 LOCATE 9,6:PRINT "Ç";:FOR I=7 TO 74:PRINT "Ä";:NEXT:PRINT "¶"
400 LOCATE 10,8:PRINT"Sales . . . . . . . . . . . . . . . . . . . .           $12,045.00"
410 LOCATE 12,8:PRINT"Operating expenses :
420 LOCATE 13,10:PRINT"Salary expense  . . . . . . . . . . . . . .  $3,500.00"
430 LOCATE 14,10:PRINT"Supplies expense  . . . . . . . . . . . . .  $6,045.00
440 LOCATE 15,54:FOR I=1 TO 10:PRINT "Ä";:NEXT
450 LOCATE 16,12:PRINT"Total operating expenses  . . . . . . . .            $9,545.00"
460 LOCATE 17,64:FOR I=1 TO 10:PRINT "Ä";:NEXT
470 LOCATE 19,8:PRINT"Net income  . . . . . . . . . . . . . . . . .            $2,500.00"
480 LOCATE 20,64:FOR I=1 TO 10:PRINT "Í";:NEXT
490 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Capital Statement *****";:COLOR 7,0
500 RETURN
510 COLOR 11,0:LOCATE 5,26,0:PRINT"-------------------------------":COLOR 7,0
520 LOCATE 7,19:PRINT"The purpose of a Capital Statement is to reflect"
530 PRINT;TAB(14);"the changes in capital of a business entity that have"
540 PRINT;TAB(14);"occured during any accounting period. This is done by"
550 PRINT;TAB(14);"taking the Beginning Capital,  adding the net income,"
560 PRINT;TAB(14);"and subtracting out any withdrawals that have occured"
570 PRINT;TAB(14);"resulting in an Ending Capital amount. This amount is"
580 PRINT;TAB(14);"carried over to the Balance Sheet."
590 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Capital Statement *****";:COLOR 7,0
600 RETURN
610 COLOR 11,0:LOCATE 6,35:PRINT"ABC Hardware":LOCATE 7,33:PRINT"Capital Statement"
620 LOCATE 8,26:PRINT"For Month Ended June 30 , 1982":COLOR 7,0
630 LOCATE 9,6:PRINT "Ç";:FOR I=7 TO 74:PRINT "Ä";:NEXT:PRINT "¶"
640 LOCATE 10,8:PRINT"Capital , June 1, 1982  . . . . . . . . . . .           $14,700.00"
650 LOCATE 11,8:PRINT"Net income for the month. . . . . . . . . . .  $2,500.00"
660 LOCATE 12,8:PRINT"Less withdrawals  . . . . . . . . . . . . . .    $860.00"
670 LOCATE 13,7:PRINT SPC(50):LOCATE 13,54:FOR I=1 TO 10:PRINT "Ä";:NEXT
680 LOCATE 14,8:PRINT"Increase in capital . . . . . . . . . . . . .            $1,640.00"
690 LOCATE 15,7:PRINT SPC(60):LOCATE 15,64:FOR I=1 TO 10:PRINT "Ä";:NEXT
700 LOCATE 16,8:PRINT"Capital , June 30, 1982 . . . . . . . . . . .           $16,340.00"
710 LOCATE 17,7:PRINT SPC(60):LOCATE 17,64:FOR I=1 TO 10:PRINT "Í";:NEXT
720 COLOR 11,0:LOCATE 25,18:PRINT"***** Strike Any Key For Balance Sheet *****";:COLOR 7,0
730 RETURN
740 COLOR 11,0:LOCATE 5,26,0:PRINT"-------------------------------":COLOR 7,0
750 LOCATE 7,19:PRINT"The purpose of a Balance Sheet is to give a list"
760 PRINT;TAB(15);"of assets , liabilities , and capital for a business"
770 PRINT;TAB(15);"entity as of a specific date,  usually at the end of"
780 PRINT;TAB(15);"the month. This document will also serve the purpose"
790 PRINT;TAB(15);"of insuring that the sum of all liabilities plus the
800 PRINT;TAB(15);"owners capital is equal the sum of all assets."
810 COLOR 11,0:LOCATE 25,18:PRINT"***** Strike Any Key For Balance Sheet *****";:COLOR 7,0
820 RETURN
830 COLOR 11,0:LOCATE 6,35:PRINT"ABC Hardware":LOCATE 7,35:PRINT"Balance Sheet"
840 LOCATE 8,26:PRINT"For Month Ended June 30 , 1982":COLOR 7,0
850 LOCATE 9,6:PRINT "Ç";:FOR I=7 TO 74:PRINT "Ä";:NEXT:PRINT "¶"
860 LOCATE 10,20:PRINT"Assets"
870 LOCATE 11,8:PRINT"Current assets:"
880 LOCATE 12,10:PRINT"Cash  . . . . . . . . . . . . . . . . . . . $12,490.00"
890 LOCATE 13,10:PRINT"Accounts receivable . . . . . . . . . . . .  $1,695.00"
900 LOCATE 14,10:PRINT"Supplies  . . . . . . . . . . . . . . . . .  $5,655.00"
910 LOCATE 15,8:PRINT"Total assets":LOCATE 15,54:FOR I= 1 TO 10:PRINT "Ä";:NEXT:LOCATE 15,64:PRINT"$19,840.00"
920 LOCATE 16,64:FOR I=1 TO 10:PRINT "Í";:NEXT
930 LOCATE 17,20:PRINT"Liabilities"
940 LOCATE 18,8:PRINT"Accounts payable  . . . . . . . . . . . . . .  $3,500.00"
950 LOCATE 19,8:PRINT"Total liabilities":LOCATE 19,54:FOR I= 1 TO 10:PRINT "Ä";:NEXT:LOCATE 19,64:PRINT" $3,500.00"
960 LOCATE 20,20:PRINT"Capital"
970 LOCATE 21,8:PRINT"Homer Jones, capital  . . . . . . . . . . . .           $16,340.00"
980 LOCATE 22,64:FOR I=1 TO 10:PRINT "Ä";:NEXT
990 LOCATE 23,8:PRINT"Total liabilities and capital . . . . . . . .           $19,840.00"
1000 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Adjusting Entries *****";:COLOR 7,0
1010 RETURN
1020 RUN"menu"
