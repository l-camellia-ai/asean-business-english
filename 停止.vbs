Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "taskkill /f /fi ""WindowTitle eq backend*""", 0, False
WshShell.Run "taskkill /f /fi ""WindowTitle eq frontend*""", 0, False
WScript.Sleep 1000
WScript.Echo "Services stopped."
Set WshShell = Nothing
