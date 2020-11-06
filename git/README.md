# GIT

## Sign a commit

git config commit.gpgsign true 

(WIN only) git config --global gpg.program "C:\Program Files (x86)\gnupg\bin\gpg.exe"

gpg --fingerprint

git config --global user.signingkey KEY


resources:

https://stackoverflow.com/questions/45730815/how-can-i-use-git-commits-signing-in-vs-code

https://blog.mwpreston.net/2019/09/18/signed-github-commits-and-vscode/

https://dev.to/devmount/signed-git-commits-in-vs-code-36do

https://help.github.com/en/github/authenticating-to-github/signing-commits

git commit --amend --cleanup=whitespace

## Fixup

git rebase -i HEAD~"number of commits"

řádky jako

pick c5bc058 fixup! feat #7: create stateless checkbox

přepsat na

fixup c5bc058 fixup! feat #7: create stateless checkbox
