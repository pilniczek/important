`File [path] cannot be loaded because running scripts is disabled on this system.
 For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.`

PowerShell

`Get-ExecutionPolicy -List`

```
        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser       Undefined
 LocalMachine       Undefined
```

`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

`Get-ExecutionPolicy -List`

```
        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser    RemoteSigned
 LocalMachine       Undefined
```
