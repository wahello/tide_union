@echo off
%��װģ��%
if not exist "node_modules" (
	call npm install
)
%call npm up lds-rc --save%
%����ģ������%
xcopy "node_modules_rewrite" "node_modules" /yeh
%��������%
call npm start

pause

@echo on