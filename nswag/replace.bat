@echo off
setlocal enabledelayedexpansion

set "search=.fromJS(resultData200);"
set "replace=.fromJS(resultData200.result);"
set "inputfile=../src/services/services_autogen.ts"
set "tempfile=tempfile.txt"

powershell -Command "(Get-Content !inputfile! | ForEach-Object {$_ -replace [regex]::Escape('!search!'), '!replace!'}) | Set-Content !tempfile!"

move /y "!tempfile!" "!inputfile!"