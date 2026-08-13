@echo off
REM  Hopper
REM  Runs the compiled program HOPPER.EXE inside DOSBox-X.
REM
REM  Needs dosbox-x on the PATH.  Hardware profile comes from
REM  ..\dosbox-games.conf (IBM PC / CGA / 4.77 MHz).
cd /d "%~dp0"
REM  No EXIT below on purpose: if the game refuses to start, its
REM  message stays visible.  Type EXIT to close the window.
dosbox-x -conf "..\dosbox-games.conf" -c "MOUNT C ." -c "C:" -c "HOPPER"
