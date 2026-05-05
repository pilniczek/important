---
title: Troubleshooting dev environment on Windows
tags:
  - WSL
  - Gatsby
---

## Running `gastby develop` fails

`File [path] cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.`

### Fix it via **PowerShell**

command: `Get-ExecutionPolicy -List`

returns something like:

        `Scope ExecutionPolicy`

        `----- ---------------`

`MachinePolicy       Undefined`

   `UserPolicy       Undefined`

      `Process       Undefined`

  `CurrentUser       Undefined`

 `LocalMachine       Undefined`

You should run:

`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

and accept it.

Then check the result by this command:

`Get-ExecutionPolicy -List`

Something like this should appear.

        `Scope ExecutionPolicy`

        `----- ---------------`

`MachinePolicy       Undefined`

   `UserPolicy       Undefined`

      `Process       Undefined`

  `CurrentUser    RemoteSigned` ← this item is changed

 `LocalMachine       Undefined`

**DONE**

## WSL uses too much ram

[https://www.koskila.net/how-to-solve-vmmem-consuming-ungodly-amounts-of-ram-when-running-docker-on-wsl/](https://www.koskila.net/how-to-solve-vmmem-consuming-ungodly-amounts-of-ram-when-running-docker-on-wsl/)
