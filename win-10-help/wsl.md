# WSL

## MANUAL

### 11

https://techcommunity.microsoft.com/t5/windows-11/how-to-install-the-linux-windows-subsystem-in-windows-11/m-p/2701207

### 10

https://docs.microsoft.com/en-us/windows/wsl/install-win10

`dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`

`dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

windows store - find linux (ubuntu 20.04)

`wsl --set-default-version 2`

## Access from explorer

explorer -> ctrl+l -> `\\wsl$\`

## Code

Run `code` in unix terminal

## Fix PATH

https://hackmd.io/@badging/wsl2#Troubleshooting-PATH

## SSH keys

### Copy

`C:\Users\[user]\.ssh` -> `\\wsl$\[distro]\home\[user]\.ssh`

### Change ssh key permission

- folder: chmod 700 .ssh
- public: chmod 644 .ssh/id_rsa.pub
- private: chmod 600 .ssh/id_rsa

https://community.perforce.com/s/article/6210

## Hacks

VSCode does not update panels

https://github.com/shayne/wsl2-hacks

`sysctl -w fs.inotify.max_user_watches=524288` - does not help

You need to clone project inside `\\wsl$\[somewhere]`

## TIPS

https://github.com/microsoft/WSL/issues/1890#issuecomment-423692567

## JAVA

https://phoenixnap.com/kb/how-to-install-java-ubuntu

## ERRORS & FIXES

`gyp ERR! stack Error: not found: make`

https://stackoverflow.com/questions/14772508/npm-failed-to-install-time-with-make-not-found-error

`Ubuntu 22.04 SSH`

add `config` file intu `.ssh` folder.

```
Host ssh.dev.azure.com
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
  HostkeyAlgorithms +ssh-rsa
  PubkeyAcceptedAlgorithms +ssh-rsa
```

## Port Forwarding

https://medium.com/@Dylan.Wang/how-to-port-forwarding-from-windows-host-to-wsl2-6889a5a3631c

https://jwstanly.com/blog/article/Port+Forwarding+WSL+2+to+Your+LAN/
