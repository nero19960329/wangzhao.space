---
dateCreated: 2023-10-02T17:05
dateModified: 2023-10-02T17:12
---
在使用 Powershell 时，有时想绑定一些自定义的快捷键，可以使用如下两条命令：
- `Get-PSReadlineKeyHandler`
	- https://learn.microsoft.com/en-us/powershell/module/psreadline/get-psreadlinekeyhandler?view=powershell-7.3
- `Set-PSReadlineKeyHandler`
	- https://learn.microsoft.com/en-us/powershell/module/psreadline/set-psreadlinekeyhandler?view=powershell-7.3
比如，假如我希望上下键是从历史中反向、正向搜索，可以在 profile 文件中加入：
```powershell
Set-PSReadlineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadlineKeyHandler -Key DownArrow -Function HistorySearchForward
```
注，powershell profile 的位置可以使用如下命令查看：
```powershell
$PROFILE | Select-Object *
```
详见 https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7.3 