10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 540
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30  GOTO 80
40  POKE 106,0
50  IF INKEY$<>"" THEN 40
60  RESP$=INKEY$:IF RESP$="" THEN 60
70  RETURN
80  GOSUB 90:GOTO 180
90 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
100 FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J,0:PRINT "Ä":NEXT:NEXT
110 LOCATE 1,19,0:PRINT "Ú":LOCATE 1,63,0:PRINT "¿":LOCATE 3,63,0:PRINT "Ù":LOCATE 3,19,0:PRINT "À"
120 LOCATE 2,19,0:PRINT "³" SPC(43) "³"
130 COLOR 0,7
140 LOCATE 2,22,0:PRINT" B U S I N E S S   S I M U L A T I O N "
150 COLOR 11,0:LOCATE 4,28,0:PRINT"STEP XII. SIMULATION RECAP":COLOR 7,0
160 COLOR 11,0:LOCATE 5,28,0:PRINT"--------------------------":COLOR 7,0
170 RETURN
180 LOCATE 7,14:PRINT"      Now that wasn't so bad was it? We sincerely hope"
190    PRINT;TAB(14);"that you have found this simulation both enjoyable and"
200    PRINT;TAB(14);"educational.  Keep in mind that everything you saw was"
210    PRINT;TAB(14);"a scaled down version of the activity of any business."
220    PRINT;TAB(14);"      In our decision to present this demonstration we"
230    PRINT;TAB(14);"felt like there were 3 tasks we hoped to accomplish;"
240    PRINT
250    COLOR 11,0:LOCATE ,14:PRINT" A) ";:COLOR 7,0:PRINT"We wanted to demonstrate the efficiency and power"
260    LOCATE ,18:PRINT"that an automated accounting system is capable of."
270    PRINT
280    COLOR 11,0:LOCATE ,14:PRINT" B) ";:COLOR 7,0:PRINT"We tried to make it clear that while the IBM P.C."
290    LOCATE ,18:PRINT"is relatively compact and inexpensive, it is able"
300    LOCATE ,18:PRINT"to perform a variety of complex functions."
310    PRINT
320    COLOR 11,0:LOCATE ,14:PRINT" C) ";:COLOR 7,0:PRINT"We hoped to show you what we are capable of doing"
330    LOCATE ,18:PRINT"so that you will use our software in the future."
340 COLOR 11,0
350 LOCATE 25,22:PRINT"***** Strike Any Key To Continue *****";
360 COLOR 7,0
370 GOSUB 40:GOSUB 90
380 LOCATE 7,14:PRINT"      We presented this simulation to you in the hopes"
390    PRINT;TAB(14);"that you would learn a little about computers and auto-"
400    PRINT;TAB(14);"mation. The steps that we led you through are the same"
410    PRINT;TAB(14);"11 steps any major corporation must take.             "
420    PRINT;TAB(14);"      From the taking  place of the transaction itself"
430    PRINT;TAB(14);"to the Post-closing Trial Balance, we explained enough"
440    PRINT;TAB(14);"about each procedure to  allow a person with a minimal"
450    PRINT;TAB(14);"amount of accounting knowledge to follow the flow of a"
460    PRINT;TAB(14);"business."
470    PRINT;TAB(14);"      It has been a pleasure  sharing our knowledge of"
480    PRINT;TAB(14);"automated accounting with you,  and you may anticipate"
490    PRINT;TAB(14);"hearing from us in the future."
500 COLOR 11,0
510 LOCATE 25,18:PRINT"***** Strike Any Key To Return To The Menu *****";
520 COLOR 7,0
530 GOSUB 40
540 RUN"menu
