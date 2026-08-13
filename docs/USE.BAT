Echo off
cls
echo.
echo.
echo   IF YOU FIND THAT YOU HAVE A USE FOR ANY OF THE PROGRAMMES ON THIS DISK
ECHO   A DONATION AS SUGGESTED BY THE INDIVIDUAL AUTHORS SHOULD BE FORWARDED
ECHO   TO THE AUTHOR.	
ECHO.
ECHO   THIS WILL ASSIST THOSE AUTHORS TO KEEP ON SUPPLYING IMPROVEMENTS AND NEW
ECHO   PROGRAMMES TO ALL COMPUTER USERS.
ECHO.
echo.
echo.
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
ECHO.
echo.              
echo.
echo.
echo.
pause
cls
ECHO                          DOS COMMANDS
ECHO.
ECHO         AT PROMPT               FUNCTION
ECHO    -----------------------------------------------------
ECHO    DIR                        SHOWS DIRECTORY LISTING
ECHO    DIR/W                      SHOWS DIRECTORY SIDEWAYS
ECHO    DIR/P                      SHOWS DIRECTORY ONE SCREEN AT A TIME
ECHO    DIR A:                       "      "      OF "A" DRIVE 
ECHO    DIR A:/P                     "      "      "   "    "   WITH PAUSE
ECHO    DIR *.BAS                    "   ONLY .BAS FILES (BASIC PROGRAMMES)
ECHO    DIR *.BAT                    "     "  .BAT FILES (BATCH FILES)
ECHO    DIR *.EXE                    "     "  .EXE FILES (EXECUTABLE FILES)
ECHO    DIR *.COM                    "     "  .COM FILES
ECHO    C:                         CHANGES DRIVE TO "C"
ECHO    A:                           "      "    " "A"
ECHO    CD\                          "    TO ROOT DIRECTORY OF CURRENT DRIVE
ECHO.
ECHO    IF NOT IN ROOT DIRECTORY THEN
ECHO    CD\DOS                         CHANGES TO DOS SUB-DIRECTORY
ECHO.
ECHO    IF IN ROOT DIRECTORY THEN
ECHO    CD DOS                         CHANGES TO DOS SUB-DIRECTORY
ECHO.
PAUSE
CLS
ECHO.
ECHO.
ECHO.
ECHO                 TYPE AUTOEXEC.BAT              LISTS CONTENTS ON SCREEN
ECHO.
ECHO.
ECHO ON 
REM....  TYPE AUTOEXEC.BAT > LPT1      PRINTS CONTENTS ON PRINTER
ECHO OFF
ECHO.
ECHO.
ECHO    CLS                            CLEARS SCREEN
ECHO    MD CASHBOOK                    MAKES SUB-DIRECTORY CASHBOOK
ECHO    RD CASHBOOK                    DELETES SUB-DIRECTORY CASHBOOK
ECHO    REN FILE1.COM FILE2.COM        RENAMES FILE1.COM TO FILE2.COM
ECHO    DEL FILE2.COM                  DELETES FILE2.COM
ECHO    DEL *.BAK                      DELETES ALL FILES WITH .BAK EXTENTION
ECHO    DEL FILE*.*                    DELETES ALL FILES STARTING WITH FILE
ECHO    DEL *.*                        DELETES ALL FILES IN DIRECTORY
ECHO.
ECHO    USE DEL WITH EXTREME CARE
ECHO.
ECHO.
ECHO.
PAUSE
CLS
ECHO.
ECHO	TO CREATE A NEW FILE
ECHO.
ECHO		AT DOS PROMPT TYPE
ECHO.
ECHO			COPY CON:FILE3.BAT       [ENTER]
ECHO			CLS                      [ENTER]
ECHO			CD\GWBASIC               [ENTER]
ECHO			GWBASIC MINILIST         [ENTER]
ECHO			CD\                      [ENTER]
ECHO			^Z   (or F6)             [ENTER]
ECHO.
ECHO	THIS WILL CREATE A FILE NAMED FILE3.BAT WHICH WILL LOAD GWBASIC
ECHO	AND RUN THE PROGRAMME MINILIST
ECHO	AT END OF PROGRAMME, CONTROL WILL BE PASSED BACK TO THE ROOT DIRECTORY
ECHO.
ECHO	TO EXIT FROM GWBASIC, TYPE SYSTEM [ENTER]
ECHO.
ECHO.                      
ECHO.
ECHO.
PAUSE
CLS				        
ECHO.
ECHO	                     BASIC COMMANDS   
ECHO.
ECHO 	Files that have a bas extention ie sample.bas have to have either
ECHO 	GWbasic (if a clone) or Basica invoked before they can be used
ECHO.
echo	To do this if no hard disk
echo	Insert disk that contains GWbasic in drive and type gwbasic [Enter]
echo	You can now remove that disk and insert this disk
echo.
echo	If basic is on hard disk, then change to that directory and type
echo	gwbasic [Enter]
echo	If files to be used are on hard disk and in current directory then
echo	type files [enter]   If files are on floppy in "A:" then type
echo	files "a:"     Select filename then press [F3] and type a:minilist" [enter]	
echo	To run programme press [F2] [enter]
ECHo	Function keys are listed at bottom of screen
echo.
echo	If no hard disk, type files [enter] which will list all files on floppy
echo	Select file to run by pressing [F3] and then type the filename and [enter]  
echo	To run programme press [F2] and [enter]
echo.
echo	To exit from basic, type SYSTEM [enter]   
pause
cls
echo.
echo	To learn more about Basic commands and basic programming
echo.	
echo	"The Basic Professor" is the programme to start on and is a complete
echo	programme on one disk (No B1) 	