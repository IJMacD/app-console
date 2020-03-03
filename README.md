App-Console
===========
Add a custom console to 

Interoperability
----------------

|Task|Bash|Cmd|PowerShell|App-Console|
|----|----|---|----------|-----------|
|echo|`echo 1 2 3` (on same line)|`echo 1 2 3` (on same line)|`echo 1 2 3` (newline between each)|`echo 1 2 3` (on same line)|
|Assign a variable|`name=value`|`SET name=value`|`set name value`|`name = value`<br>`set name value`|
|Print a variable|`echo $name`|`echo %name%`|`echo $name`|`$name`|
|Path Variable|`echo $PATH`|`echo %PATH%`|`$env:PATH`|`-`|
|List all variables|`env` (includes values)|`SET` (includes values)|`gci env:` (Environment) `gv` (local)|`$variables` (just names) `variables` (includes values)|
|Sub-expression|`$(date)`|`?`|`$(date)`|`${date}`|
|Execute command in variable|`$CC *.c`|`?`|`?`|`-`|
|Maths|`echo $((5 + 2))`|`SET /A "_result=5+2"`|`5 + 2`|`5 + 2`|