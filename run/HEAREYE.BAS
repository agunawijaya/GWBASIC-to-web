10 KEY OFF
20  SCREEN 0,0,0:WIDTH 80:CLS:DEF SEG:POKE 106,0
30  ON KEY(10) GOSUB 200
40  KEY(10) ON
50  GOSUB 1080:DEF SEG:POKE 106,0:COLOR 11,0
60  LOCATE 1,19:PRINT "⁄"STRING$(42,196)"ø"
70  LOCATE 3,19:PRINT "¿"STRING$(42,196)"Ÿ"
80  LOCATE 2,19:PRINT "≥"SPC(42)"≥"
90  COLOR 0,7
100 LOCATE  2,29:PRINT CHR$(255) "F R I E N D L Y W A R E" CHR$(255)
110 LOCATE  7,28:COLOR 7,0:PRINT"   Hearing And Eye Test"
120 LOCATE 11,32:COLOR 0,7:PRINT " 1 ";:COLOR 3,0:PRINT"   Hearing Test"
130 LOCATE 13,32:COLOR 0,7:PRINT " 2 ";:COLOR 3,0:PRINT"   Eye Test"
140 LOCATE 19,13:COLOR 15,0:PRINT"*****";:COLOR 3,0:PRINT" Strike Key Corresponding To Function Desired ";:COLOR 15,0:PRINT"*****":COLOR 3,0
150 LOCATE 25,23:COLOR 0,7:PRINT " Strike <F10> To Leave This Program ";:COLOR 3,0
160 RESP$=INKEY$:IF RESP$="" THEN 160
170 IF RESP$="2" THEN GOSUB 210:GOTO 10
180 IF RESP$="1" THEN GOSUB 700:GOTO 10
190 GOTO 160
200 RUN"menu
210 REM *** BEGIN EYE CHART
220 CLS:PRINT STRING$(80,219)
230 FOR A=2 TO 22:LOCATE A,1:PRINT "€":LOCATE A,80:PRINT "€":NEXT
240 LOCATE 23,1:PRINT STRING$(80,219);
250 COLOR 15,0
260 LOCATE 3,32:PRINT "HOME VISION TEST":COLOR 3,0
270 LOCATE 5,15:PRINT "This test is not a replacement for  regular visits
280 LOCATE 6,15:PRINT "to your doctor. Only he can conduct a complete and
290 LOCATE 7,15:PRINT "thorough examination.
300 LOCATE 9,15:PRINT "To  test your vision,  stand back 20 feet from the
310 LOCATE 10,15:PRINT"screen.  Place a hand  over  one  eye and  without
320 LOCATE 11,15:PRINT"squinting, see if you can tell in which  direction
330 LOCATE 12,15:PRINT "the character arms are pointing.
340 LOCATE 14,15:PRINT"At 20 feet,  a person with normal vision should be
350 LOCATE 15,15:PRINT"able to correctly `read' the line marked 20/20.
360 LOCATE 17,15:PRINT"Repeat  the test  for your  other eye  and then on
370 LOCATE 18,15:PRINT "both eyes at once.
380 LOCATE 25,27:COLOR 15,0:PRINT "Strike Any Key To Continue";
390 A$=INKEY$:IF A$="" THEN 390
400 COLOR 0,7
410 CLS
420 PRINT
430 PRINT "            ˇﬁ€€€€€€€€€     ﬁ€€€€€€€€›     €€€€€€€€€›     €€›ﬁ€€ €€›"
440 PRINT "             ﬁ€€‹‹‹‹‹‹‹     ﬁ€€ €€ €€›     ‹‹‹‹‹‹‹€€›     €€›ﬁ€€ €€›"
450 PRINT " 20/50       ﬁ€€ﬂﬂﬂﬂﬂﬂﬂ     ﬁ€€ €€ €€›     ﬂﬂﬂﬂﬂﬂﬂ€€›     €€›ﬁ€€ €€›"
460 PRINT "             ﬁ€€€€€€€€€     ﬁ€€ €€ €€›     €€€€€€€€€›     €€€€€€€€€›"
470 PRINT
480 PRINT
490 PRINT "                €ﬂﬂﬂﬂ      ﬂﬂﬂﬂ€      € € €      €ﬂ€ﬂ€      €ﬂﬂﬂﬂ
500 PRINT " 20/40          €ﬂﬂﬂﬂ      ﬂﬂﬂﬂ€      € € €      € € €      €ﬂﬂﬂﬂ"
510 PRINT "             ˇ  ﬂﬂﬂﬂﬂ      ﬂﬂﬂﬂﬂ      ﬂﬂﬂﬂﬂ      ﬂ ﬂ ﬂ      ﬂﬂﬂﬂﬂ"
520 PRINT
530 PRINT "                   €ﬂﬂﬂ    €ﬂﬂ€    €  €    €ﬂﬂ€    ﬂﬂﬂ€    €  €"
540 PRINT " 20/30             €‹‹‹    €  €    €‹‹€    €  €    ‹‹‹€    €‹‹€"
550 PRINT
560 PRINT "                      ‹‹‹    ‹‹‹    ‹ ‹    ‹‹‹    ‹‹‹    ‹ ‹"
570 PRINT " 20/20                € €    €‹‹    €‹€    € €    ‹‹€    €‹€"
580 PRINT
590 PRINT " 20/15                ﬁ‹›  ﬁﬂ›  ﬁﬂ›  ﬁ‹›  ﬁﬂ›  ﬁ‹›  ﬁﬂ›  ﬁ‹›"
600 PRINT
610 PRINT " 20/10                  U  Ô  Ô  U  U  Ô  U  Ô  Ô  U  Ô  U  "
620 PRINT
630 PRINT " 20/5                     n u n u n n u n u u n n u u n n   "
640 PRINT
650 LOCATE 24,23 :PRINT "*** Strike Any Key To Return To Menu ***";
660 A$=INKEY$ :IF A$="" THEN 660
670 COLOR 7,0 :CLS
690 RETURN
700 CLS:PRINT STRING$(80,219)
710 FOR A=2 TO 22:LOCATE A,1:PRINT "€":LOCATE A,80:PRINT "€":NEXT
720 LOCATE 23,1:PRINT STRING$(80,219);
730 COLOR 15,0:LOCATE 3,32:PRINT "HOME HEARING TEST":COLOR 3,0
740 LOCATE 5,15:PRINT "This test is not a replacement for  regular visits
750 LOCATE 6,15:PRINT "to your doctor. Only he can conduct a complete and
760 LOCATE 7,15:PRINT "thorough examination.
770 LOCATE 9,15:PRINT "To  test your hearing, strike any key to begin the
780 LOCATE 10,15:PRINT"tone. When you can no longer hear the tone,  again
790 LOCATE 11,15:PRINT"strike any key.
800 LOCATE 13,15:PRINT"In  our testing  here at home,  we have found that
810 LOCATE 14,15:PRINT"most people will lose the tone near  15,000 cycles
820 LOCATE 15,15:PRINT"per second. The circuitry within the IBM P C  will
830 LOCATE 16,15:PRINT"handle 32,000 cycles per second, but we had no way
840 LOCATE 17,15:PRINT"to evaluate the capacity of the speaker.
850 LOCATE 25,27:COLOR 15,0:PRINT "Strike Any Key To Continue";
860 A$=INKEY$:IF A$="" THEN 860
870 CLS:PLAY "MF"
880 J=1
890 COLOR 3,0
900 LOCATE 10,25 :PRINT "This Test Is Designed For Home Use Only.";
910 COLOR 15,0 :LOCATE 12,20 :PRINT "      *** Strike Any Key To Start Test ***";
920 B$=INKEY$:IF B$="" THEN 920
930 LOCATE 12,20 :PRINT "*** Strike Any Key When Pitch Cannot Be Heard ***";
940 DEF SEG: POKE 106,0
950 FOR I=100 TO 30000 STEP 100
960 SOUND I,J
970 IF I=14000 THEN J=10
980 B$=INKEY$:IF B$<>"" THEN 1000
990 NEXT I
1000 REM STOP TEST
1010 COLOR 3,0
1020 LOCATE 12,1 :PRINT SPC(79);
1030 LOCATE 14,20,0  : PRINT "     Key Was Struck At"; I ;"Cycles Per Second     ";
1040 COLOR 15,0
1050 LOCATE 25,25 :PRINT "*** Strike Any Key To Return To Menu ***";
1060 B$=INKEY$ :IF B$="" THEN 1060
1070 RETURN
1080 ON KEY(1) GOSUB 1180
1090 ON KEY(2) GOSUB 1180
1100 ON KEY(3) GOSUB 1180
1110 ON KEY(4) GOSUB 1180
1120 ON KEY(5) GOSUB 1180
1130 ON KEY(6) GOSUB 1180
1140 ON KEY(7) GOSUB 1180
1150 ON KEY(8) GOSUB 1180
1160 ON KEY(9) GOSUB 1180
1170 FOR A=1 TO 9:KEY(A) ON:NEXT
1180 RETURN
