10 SCREEN 0,0,0:WIDTH 80:CLS:DEFSTR Z:KEY OFF:COLOR 3,0
20 ON KEY(10) GOSUB 3410:ON ERROR GOTO 3510
30 ON KEY(1) GOSUB 3490
40 CLS:XLIN=1:XPOS=1:GOSUB 3460
50 LOCATE 3,2:PRINT STRING$(78,219)
60 FOR A=4 TO 22:LOCATE A,2:PRINT "ÛÛ":LOCATE A,78:PRINT "ÛÛ":NEXT
70 LOCATE 23,2:PRINT STRING$(78,219);
80 LOCATE 1,25:COLOR 15,0:PRINT"THE EVOLUTION OF COMPUTER SIZE"
90 COLOR 0,7:LOCATE 15,15:PRINT "          "
100 LOCATE 16,15:PRINT "   IBM    "
110 LOCATE 17,15:PRINT "   360    "
120 LOCATE 18,15:PRINT "          ":COLOR 3,0
130 LOCATE 18,55:COLOR 0,7:PRINT " PC ":COLOR 3,0
140 LOCATE 7,4:PRINT "<"STRING$(17,"-")
150 LOCATE 7,57:PRINT STRING$(20,"-")">"
160 LOCATE 6,22:PRINT "The border that  surrounds this text"
170 LOCATE 7,22:PRINT "represents  ENIAC, the first totally"
180 LOCATE 8,22:PRINT "electronic digital computer. It took"
190 LOCATE 9,22:PRINT "up 1500 square feet of  floor space,"
200 LOCATE 10,22:PRINT "weighed over  30 tons, and contained"
210 LOCATE 11,22:PRINT "over 18,000 vacuum tubes that failed"
220 LOCATE 12,22:PRINT "at the rate of  1  every  7  minutes."
230 LOCATE 13,22:PRINT "It first went into service  in  1946.
240 LOCATE 20,18:PRINT "1964"
250 LOCATE 21,17:PRINT "IBM 360"
260 LOCATE 20,55:PRINT "1981"
270 LOCATE 21,54:PRINT "IBM PC"
280 LOCATE 7,4:PRINT "<---"
290 LOCATE 8,6:PRINT "E"
300 LOCATE 9,6:PRINT "N"
310 LOCATE 10,6:PRINT "I"
320 LOCATE 11,6:PRINT "A"
330 LOCATE 12,6:PRINT "C"
340 LOCATE 13,4:PRINT "<---"
350 GOSUB 3380
360 IF BACKFLAG THEN RUN"intro
370 LOCATE 6,10:PRINT "            Computers got smaller when the VACUUM          "
380 LOCATE 7,4:PRINT "<---              TUBE  was replaced by the  TRANSISTOR,                  "
390 LOCATE 8,4:PRINT "  E               and soon thereafter, by SILICON CHIPS.                  "
400 LOCATE 9,4:PRINT "  N                                                                 "
410 LOCATE 10,4:PRINT "  I               The development of  LARGE SCALE INTE-             "
420 LOCATE 11,4:PRINT "  A               GRATION (putting huge amounts of data             "
430 LOCATE 12,4:PRINT "  C               in microscopic spaces)  also aided in             "
440 LOCATE 13,4:PRINT "<---              the reduction of computer size.                    "
450 GOSUB 3380
460 IF BACKFLAG THEN 40
470 LOCATE 6,4:PRINT "          As computers  became  SMALLER, they also became FASTER.
480 LOCATE 7,4:PRINT "<---                                                                      "
490 LOCATE 8,4:PRINT "  E       In the early days,  processing  time would be measured  "
500 LOCATE 9,4:PRINT "  N       in SECONDS and MILLISECONDS  (thousandths of a second).
510 LOCATE 10,4:PRINT "  I       Today,  processing  time is measured  in  MICROSECONDS
520 LOCATE 11,4:PRINT "  A       (millionths of a second)  and NANOSECONDS  (billionths
530 LOCATE 12,4:PRINT "  C       of a second). The  C P U  (central processing unit) in
540 LOCATE 13,4:PRINT "<---      in the IBM P C is  FOUR  times faster than the 360 !!!
550 GOSUB 3380
560 IF BACKFLAG THEN 370
570 '****** CPU ******
580 CLS
590 COLOR 3,0
600 GOSUB 3460
610 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
620 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
630 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
640 LOCATE 6,23:PRINT STRING$(33,219)
650 FOR A=7 TO 9:LOCATE A,23:PRINT "ÛÛ":LOCATE A,54:PRINT "ÛÛ":NEXT
660 LOCATE 10,23:PRINT STRING$(33,219)
670 LOCATE 13,11:PRINT STRING$(18,219)
680 FOR A=14 TO 16:LOCATE A,11:PRINT "ÛÛ":LOCATE A,27:PRINT "ÛÛ":NEXT
690 LOCATE 17,11:PRINT STRING$(18,219)
700 LOCATE 13,46:PRINT STRING$(31,219)
710 FOR A=14 TO 16:LOCATE A,46:PRINT "ÛÛ":LOCATE A,75:PRINT "ÛÛ":NEXT
720 LOCATE 17,46:PRINT STRING$(31,219)
730 LOCATE 4,20:PRINT "The Central Processing Unit Has 2 Parts
740 LOCATE 8,26:PRINT "THE CENTRAL PROCESSING UNIT
750 LOCATE 15,14:PRINT "CONTROL UNIT
760 LOCATE 15,51:PRINT "ARITHMETIC/LOGIC UNIT
770 LOCATE 20,13:PRINT "THE COMPUTER'S
780 LOCATE 21,16:PRINT CHR$(34)"BRAIN"CHR$(34)
790 LOCATE 20,49:PRINT "THE COMPUTER'S CALCULATOR
800 LOCATE 21,47:PRINT "(For handling binary numbers)
810 LOCATE 15,29:PRINT STRING$(17,196)
820 GOSUB 3380
830 IF BACKFLAG THEN 40
840 CLS
850 COLOR 3,0
860 GOSUB 3460
870 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
880 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
890 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
900 LOCATE 4,31:PRINT STRING$(18,219)
910 FOR A=5 TO 7:LOCATE A,31:PRINT "ÛÛ":LOCATE A,47:PRINT "ÛÛ":NEXT
920 LOCATE 8,31:PRINT STRING$(18,219)
930 LOCATE 6,34:PRINT "CONTROL UNIT
940 LOCATE 11,25:PRINT"- Fetches instructions
950 LOCATE 13,25:PRINT"- Interprets instructions
960 LOCATE 15,25:PRINT"- Executes the instructions
970 LOCATE 17,25:PRINT"- Controls ARITH/LOGIC UNIT
980 LOCATE 19,25:PRINT"- Controls Peripherals
990 LOCATE 21,25:PRINT"- Manipulates data throughout system
1000 GOSUB 3380
1010 IF BACKFLAG THEN 580
1020 CLS
1030 COLOR 3,0
1040 GOSUB 3460
1050 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
1060 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
1070 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
1080 LOCATE 3,27:PRINT STRING$(26,219)
1090 FOR A=3 TO 7:LOCATE A,27:PRINT "ÛÛ":LOCATE A,52:PRINT "ÛÛ";:NEXT
1100 LOCATE 7,27:PRINT STRING$(25,219);
1110 LOCATE 11,7:PRINT STRING$(16,219):LOCATE 11,35:PRINT STRING$(11,219):LOCATE 11,58:PRINT STRING$(14,219)
1120 FOR A=11 TO 15:LOCATE A,7:PRINT "ÛÛ":LOCATE A,22:PRINT "ÛÛ";:NEXT
1130 FOR A=11 TO 15:LOCATE A,35:PRINT "ÛÛ":LOCATE A,45:PRINT "ÛÛ";:NEXT
1140 FOR A=11 TO 15:LOCATE A,58:PRINT "ÛÛ":LOCATE A,71:PRINT "ÛÛ";:NEXT
1150 LOCATE 8,40:PRINT CHR$(179)
1160 LOCATE 9,40:PRINT CHR$(179)
1170 LOCATE 10,15:PRINT CHR$(218)
1180 LOCATE 10,16:PRINT STRING$(24,196)
1190 LOCATE 10,40:PRINT CHR$(197)
1200 LOCATE 10,41:PRINT STRING$(24,196)
1210 LOCATE 10,65:PRINT CHR$(191)
1220 LOCATE 15,7:PRINT STRING$(16,219):LOCATE 15,35:PRINT STRING$(11,219):LOCATE 15,58:PRINT STRING$(14,219)
1230 LOCATE 5,30:PRINT "ARITHMETIC/LOGIC UNIT"
1240 LOCATE 13,10:PRINT "ACCUMULATOR"
1250 LOCATE 13,38:PRINT "ADDERS"
1260 LOCATE 13,61:PRINT "REGISTERS"
1270 LOCATE 17,4:PRINT "  Retains partial comp-        Monitors  and         Temporarily  stores"
1280 LOCATE 18,6:PRINT "utations  until used.        adds incoming         data from main mem-"
1290 LOCATE 19,6:PRINT "Combines   main  and         and  outgoing         ory, and returns it"
1300 LOCATE 20,6:PRINT "learned   memory  as         data  (binary         as it is no  longer"
1310 LOCATE 21,6:PRINT "needed.                      numbers).             needed.            "
1320 GOSUB 3380
1330 IF BACKFLAG THEN 580
1340 CLS
1350 COLOR 3,0
1360 GOSUB 3460
1370 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
1380 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
1390 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
1400 COLOR 15,0:LOCATE 3,21:PRINT "THE COMPUTER'S INTERNAL TRANSIT SYSTEM
1410 COLOR 3,0:LOCATE 5,15:PRINT  "All information that goes in and out of a  computer
1420 LOCATE 6,15:PRINT "passes through an input/output port (I/O Port).
1430 LOCATE 8,15:PRINT  "Early computers had only SERIAL PORTS that received
1440 LOCATE 9,15:PRINT "and returned data serially,  or, one bit at a time.
1450 LOCATE 11,15:PRINT "Processing  time in computers  was vastly  improved
1460 LOCATE 12,15:PRINT "by the development of  PARALLEL PORTS  which handle
1470 LOCATE 13,15:PRINT "and move large amounts of data simultaneously.
1480 LOCATE 15,15:PRINT "The process utilizes electrical conductors (printed
1490 LOCATE 16,15:PRINT "circuit boards) that will carry multiple electrical
1500 LOCATE 17,15:PRINT "impulses around the innards of the computer.
1510 LOCATE 19,15:PRINT "These multiple impulse carriers are known as BUSSES,
1520 LOCATE 20,15:PRINT "and when several are used together, they are called
1530 LOCATE 21,15:PRINT "BUS SYSTEMS.
1540 GOSUB 3380
1550 IF BACKFLAG THEN 580
1560 '****** memory ******
1570 CLS
1580 COLOR 3,0
1590 GOSUB 3460
1600 LOCATE 2,25:COLOR 15,0:PRINT "PUTTING MEMORY IN HUMAN TERMS":COLOR 3,0:
1610 LOCATE 4,12:PRINT "Humans and computers think of  MEMORY in different ways."
1620 LOCATE 5,12:PRINT "We think of it in terms of letters and pages. Computers"
1630 LOCATE 6,12:PRINT "(and computer people) deal with memory in terms of BITS,"
1640 LOCATE 7,12:PRINT "BYTES,  K's, and  MEGS.   The  comparison  chart  below
1650 LOCATE 8,12:PRINT "should  make  it  all  a  little  easier to  understand."
1660 LOCATE 10,1:PRINT STRING$(80,219)
1670 FOR A=11 TO 22:LOCATE A,1:PRINT "ÛÛ":LOCATE A,79:PRINT "ÛÛ";:NEXT
1680 LOCATE 23,1:PRINT STRING$(80,219);
1690 COLOR 1,0:LOCATE 12,15:PRINT "COMPUTERS"
1700 LOCATE 12,53:PRINT "HUMANS"
1710 COLOR 3,0
1720 LOCATE 14,4:PRINT "8 BITS = 1 BYTE"
1730 LOCATE 14,40:PRINT "Nothing comparable to BITS.
1740 LOCATE 16,4:PRINT "1 BYTE = 1 CHARACTER"
1750 LOCATE 16,40:PRINT "Any LETTER, NUMBER, SYMBOL, OR SPACE.
1760 LOCATE 18,4:PRINT "1 K = 1024 BYTES"
1770 LOCATE 18,40:PRINT "1 PAGE = 3072 BYTES or 3 K.
1780 LOCATE 20,4:PRINT "1 MEGABYTE = 1 Million BYTES"
1790 LOCATE 20,40:PRINT "1 MEG = approx. 333 PAGES.
1800 GOSUB 3380
1810 IF BACKFLAG THEN 840
1820 CLS:GOSUB 3460:LOCATE 4,1:PRINT STRING$(80,219)
1830 FOR A=4 TO 22:LOCATE A,1:PRINT "ÛÛ":LOCATE A,79:PRINT "ÛÛ";:NEXT
1840 LOCATE 23,1:PRINT STRING$(80,219);
1850 LOCATE 2,21:COLOR 15,0:PRINT "THERE ARE THREE TYPES OF COMPUTER MEMORY":COLOR 3,0:
1860 LOCATE 5,3:PRINT STRING$(76,32);
1870 LOCATE 6,3:PRINT STRING$(76,32);
1880 LOCATE 7,12:PRINT " <1>  PERMANENT  MEMORY is the computers main, work-
1890 LOCATE 8,12:PRINT "      ing memory. It is also  known  as  ADDRESSABLE
1900 LOCATE 9,12:PRINT "      MEMORY.
1910 LOCATE 10,3:PRINT STRING$(76,32);
1920 LOCATE 11,3:PRINT STRING$(76,32);
1930 LOCATE 12,12:PRINT " <2>  LONG  TERM  MEMORY is simply STORAGE.  This is
1940 LOCATE 13,12:PRINT "      memory that may be stored outside the computer
1950 LOCATE 14,4:PRINT "              on tapes, floppy diskettes, or hard disks.
1960 LOCATE 15,3:PRINT STRING$(76,32);
1970 LOCATE 16,3:PRINT STRING$(76,32);
1980 LOCATE 17,12:PRINT " <3>  LEARNED  MEMORY  is  SOFTWARE.  This is memory
1990 LOCATE 18,4:PRINT "              that  the  computer  uses  temporarily to per-
2000 LOCATE 19,4:PRINT "              form a specific task.  The  computer  will not
2010 LOCATE 20,4:PRINT "              retain this data,  but  must `RELEARN' it each
2020 LOCATE 21,4:PRINT "              time you wish to use it.
2030 GOSUB 3380
2040 IF BACKFLAG THEN 1560
2050 LOCATE 2,21:COLOR 15,0:PRINT "      FILES, RECORDS, AND FIELDS        ":COLOR 3,0:
2060 LOCATE 7,12:PRINT "      In order to understand how your PC handles and
2070 LOCATE 8,12:PRINT "      stores data and information,  you will need to
2080 LOCATE 9,12:PRINT "      understand  FILES, RECORDS, and FIELDS.
2090 LOCATE 11,12:PRINT "      Each diskette contains up to  64  FILES. A FILE
2100 LOCATE 12,12:PRINT "      is a collection of related  RECORDS arranged in
2110 LOCATE 13,12:PRINT "      FIELDS of data. Each FILE may have thousands of
2120 LOCATE 14,12:PRINT "      RECORDS.  RECORDS  may have thousands of FIELDS.
2130 LOCATE 16,7:PRINT "     FILES------>contain------>RECORDS----->contain------->FIELDS     "
2140 LOCATE 17,7:PRINT "XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX"
2150 LOCATE 18,7:PRINT "X    The      X            X   Lambert   X            X     Age     X"
2160 LOCATE 19,7:PRINT "X Pittsburgh  X            X    Swann    X            X    Height   X"
2170 LOCATE 20,7:PRINT "X  Steelers   X            X   Bradshaw  X            X    Weight   X"
2180 LOCATE 21,7:PRINT "XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX"
2190 GOSUB 3380
2200 IF BACKFLAG THEN 1820
2210 '***** OPERATING SYSYEMS ******
2220 CLS:GOSUB 3460
2230 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
2240 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
2250 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
2260 LOCATE 3,30:COLOR 15,0:PRINT "DOS OPERATING SYSTEM":COLOR 3,0:
2270 LOCATE 5,20:PRINT "The Disk Operating System is responsible"
2280 LOCATE 6,20:PRINT "for the  overall  operation of  your  PC."
2290 LOCATE 7,20:PRINT "DOS has  3  main  operational  functions:"
2300 LOCATE 9,39:PRINT "DOS"
2310 LOCATE 10,40:PRINT "³"
2320 LOCATE 11,40:PRINT "³"
2330 LOCATE 11,15:PRINT "ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿"
2340 LOCATE 12,15:PRINT "³                        ³                         ³"
2350 LOCATE 13,11:PRINT "INTERPRET"
2360 LOCATE 14,10:PRINT "AND EXECUTE"
2370 LOCATE 15,9:PRINT  "YOUR COMMANDS"
2380 LOCATE 13,37:PRINT "MANAGE"
2390 LOCATE 14,34:PRINT "AND  PROCESS"
2400 LOCATE 15,35:PRINT  "DISK FILES"
2410 LOCATE 13,62:PRINT "OVERSEE"
2420 LOCATE 14,58:PRINT "AND  COMMUNICATE"
2430 LOCATE 15,58:PRINT  "WITH PERIPHERALS"
2440 GOSUB 3380
2450 IF BACKFLAG THEN 1820
2460 CLS:GOSUB 3460
2470 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
2480 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
2490 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
2500 LOCATE 3,35:COLOR 15,0:PRINT "LANGUAGES":COLOR 3,0
2510 LOCATE 5,15:PRINT "MACHINE LANGUAGE
2520 LOCATE 7,15:PRINT "All computers operate in MACHINE  LANGUAGE, which is
2530 LOCATE 8,15:PRINT "a language without words.
2540 LOCATE 10,15:PRINT "Machine  language is composed  completely of  BINARY
2550 LOCATE 11,15:PRINT "NUMBERS,  which are simply strings of zeros and ones
2560 LOCATE 12,15:PRINT "(the binary equivalent  of 14 is 1110).
2570 LOCATE 14,15:PRINT "ASSEMBLY LANGUAGE
2580 LOCATE 16,15:PRINT "Because programming  with binary numbers was so time
2590 LOCATE 17,15:PRINT "consuming and intricate, man soon developed a better
2600 LOCATE 18,15:PRINT "way.  ASSEMBLY  LANGUAGE allows programs and data to
2610 LOCATE 19,15:PRINT "be  entered in words and letters.  Assembly language
2620 LOCATE 20,15:PRINT "is  translated  into  machine language  by a program
2630 LOCATE 21,15:PRINT "called an ASSEMBLER.
2640 GOSUB 3380
2650 IF BACKFLAG THEN 2210
2660 CLS:GOSUB 3460
2670 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
2680 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
2690 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
2700 LOCATE 3,35:COLOR 15,0:PRINT "LANGUAGES":COLOR 3,0
2710 LOCATE 5,15:PRINT "HIGH-LEVEL LANGUAGES
2720 LOCATE 7,15:PRINT "The invention of a  program called a  COMPILER,  which
2730 LOCATE 8,15:PRINT "is very much like an  assembler,  enabled  man to dev-
2740 LOCATE 9,15:PRINT "elop languages that were very close to  plain  english.
2750 LOCATE 10,15:PRINT "There are probably hundreds of these  HIGH LEVEL LAN-
2760 LOCATE 11,15:PRINT "GUAGES. A few, however, dominate the industry.
2770 LOCATE 13,15:PRINT "BASIC
2780 LOCATE 15,15:PRINT "BASIC is, without doubt,the most widely known language
2790 LOCATE 16,15:PRINT "in the world today.  BASIC stands for  Beginner's  All
2800 LOCATE 17,15:PRINT "Purpose Symbolic Instruction Code. BASIC was developed
2810 LOCATE 18,15:PRINT "in the mid-60's at Dartmouth University.
2820 LOCATE 20,15:PRINT "There are 3 levels of BASIC available on your PC: DISK
2830 LOCATE 21,15:PRINT "BASIC, CASSETTE BASIC, and ADVANCED BASIC.
2840 GOSUB 3380
2850 IF BACKFLAG THEN 2460
2860 CLS:GOSUB 3460
2870 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
2880 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
2890 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
2900 LOCATE 3,35:COLOR 15,0:PRINT "LANGUAGES":COLOR 3,0
2910 LOCATE 4,15:PRINT "FORTRAN
2920 LOCATE 6,15:PRINT "FORTRAN stands for FORmula TRANslator. It was one
2930 LOCATE 7,15:PRINT "of the first high level languages developed (1957)
2940 LOCATE 8,15:PRINT "and it is still the second most dominant language
2950 LOCATE 9,15:PRINT "in use today. FORTRAN is used primarily for tech-
2960 LOCATE 10,15:PRINT "nical and scientific applications.
2970 LOCATE 12,15:PRINT "COBOL
2980 LOCATE 14,15:PRINT "COBOL is used extensively in business and account-
2990 LOCATE 15,15:PRINT "ing. In fact, COBOL means COMMON BUSINESS ORIENTED
3000 LOCATE 16,15:PRINT "LANGUAGE.
3010 LOCATE 18,15:PRINT "OTHER HIGH LEVEL LANGUAGES
3020 LOCATE 20,15:PRINT "Some other languages you may see are: PASCAL, PL/1,
3030 LOCATE 21,15:PRINT "SNOBOL, LISP, STRESS, LOGO, JOVIAL, and ALGOL.
3040 GOSUB 3380
3050 IF BACKFLAG THEN 2660
3060 CLS:GOSUB 3460
3070 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
3080 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
3090 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
3100 LOCATE 4,22:COLOR 15,0:PRINT "THE 15 COMMANDMENTS OF DISKETTE CARE
3110 COLOR 3,0
3120 LOCATE 6,15:PRINT "#1  Always, Always, Always make a back-up copy.
3130 LOCATE 8,15:PRINT "#2  Use the backup. Store the Master.
3140 LOCATE 10,15:PRINT "#3  Identify and label immediately.
3150 LOCATE 12,15:PRINT "#4  Use only soft-tipped pens to write on diskettes.
3160 LOCATE 14,15:PRINT "#5  Insert with label up - under your thumb.
3170 LOCATE 16,15:PRINT "#6  Never turn computer on or off with diskette in drive.
3180 LOCATE 18,15:PRINT "#7  Keep away from magnetic fields (Monitor, Phone, TV, etc.)
3190 LOCATE 20,15:PRINT "#8  Keep away from food or drink.
3200 GOSUB 3380
3210 IF BACKFLAG THEN 2860
3220 CLS:GOSUB 3460
3230 LOCATE 1,1:PRINT "É"STRING$(78,"Í")"»"
3240 FOR A=2 TO 22:LOCATE A,1:PRINT "º":LOCATE A,80:PRINT "º";:NEXT
3250 LOCATE 23,1:PRINT "È"STRING$(78,"Í")"¼";
3260 LOCATE 4,22:COLOR 15,0:PRINT "THE 15 COMMANDMENTS OF DISKETTE CARE
3270 COLOR 3,0
3280 LOCATE 6,15:PRINT "#9  Keep away from excessive dust or heat.
3290 LOCATE 8,15:PRINT "#10 Touch only the jacket, not the diskette.
3300 LOCATE 10,15:PRINT "#11 Return all diskettes to envelopes after use.
3310 LOCATE 12,15:PRINT "#12 Store diskettes horizontally or vertically ONLY.
3320 LOCATE 14,15:PRINT "#13 Spring for a plastic diskette holder.
3330 LOCATE 16,15:PRINT "#14 Clean disk drive head frequently.
3340 LOCATE 18,15:PRINT "#15 Treat diskettes like record albums, not frisbees.
3350 GOSUB 3380
3360 IF BACKFLAG THEN 3060
3370 RUN"intro
3380 KEY(1) ON:BACKFLAG=0:LOCATE 24,12:COLOR 15,0:PRINT "Strike Any Key To Continue   Strike <F1> For Previous Page";:COLOR 3,0
3390 DEF SEG:POKE 106,0:IF INKEY$<>"" THEN 3390
3400 Z=INKEY$:IF Z="" THEN 3400 ELSE RETURN
3410 KEY(10) OFF:XLIN=CSRLIN:XPOS=POS(0):LOCATE 25,1:PRINT SPC(79);
3420 LOCATE 25,21:COLOR 15,0:PRINT "Do You Wish To Leave This Program? <Y/N>";:COLOR 3,0
3430 Z=INKEY$:IF Z="" THEN 3430
3440 IF Z="y" OR Z="Y" THEN RUN"INTRO
3450 IF Z<>"n" AND Z<>"N" THEN 3430
3460 LOCATE 25,1:PRINT SPC(79);:LOCATE 25,23:COLOR 0,7
3470 PRINT " Strike <F10> To Leave This Program ";:COLOR 3,0:LOCATE XLIN,XPOS,0
3480 KEY(10) ON:RETURN
3490 KEY(1) OFF:BACKFLAG=1:RETURN 3500
3500 RETURN
3510 RUN"menu
