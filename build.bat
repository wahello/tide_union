@echo off
if not exist "node_modules" (
	call npm install
)
call npm up lds-rc --save
xcopy "node_modules_rewrite" "node_modules" /yeh
call npm run build

if exist "pack" (
	del /F /S /Q pack\*.zip
)

pause

@echo on