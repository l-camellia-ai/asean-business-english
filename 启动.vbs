Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get script directory
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Start backend (hidden)
WshShell.Run "cmd /c cd /d """ & currentDir & "\deploy\server"" && node index.js", 0, False

' Wait for backend to start
WScript.Sleep 2000

' Start frontend (hidden)
WshShell.Run "cmd /c cd /d """ & currentDir & """ && pnpm dev", 0, False

' Wait for frontend to start
WScript.Sleep 5000

' Open browser
WshShell.Run "http://localhost:5173/"

Set WshShell = Nothing
