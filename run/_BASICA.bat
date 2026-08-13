@echo off
REM  IBM BASICA 1983 - interactive prompt
REM  Drops you straight at the BASICA Ok prompt with C: mounted on run\.
REM  Verified working under this DOSBox-X profile.
REM  Try:  FILES        list the diskette
REM        LOAD "TICTAC.BAS"
REM        LIST         read the source
REM        RUN          play it
REM        SYSTEM       back to DOS
REM
REM  Needs dosbox-x on the PATH.  Hardware profile comes from
REM  ..\dosbox-games.conf (IBM PC / CGA / 4.77 MHz).
cd /d "%~dp0"
dosbox-x -conf "..\dosbox-games.conf" -c "MOUNT C ." -c "C:" -c "BASICA"
