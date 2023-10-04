---
title: pyenv instruction
dateCreated: 2023-09-29T11:33:00
dateModified: 2023-10-05T02:02
---

## What is pyenv?

[pyenv](https://github.com/pyenv/pyenv) is a Python version manager which is a tool to manage multiple Python versions.

[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) is a tool to create isolated Python environments.

It allows `pyenv` and `virtualenv` to work together.

(`pyenv-virtualenv` 是一个可以将 `pyenv` 和 `virtualenv` 无缝连接起来的插件)\[1\]

## Why use pyenv?

When you develop multiple python projects, and these projects depends on different versions of Python or different Python libraries, you need this `pyenv` tool to manage Python versions or `pyenv-virtualenv` to manage different isolated environments with `pyenv`.

(当你在开发多个 Python 项目，且这些项目依赖了不同版本的 Python 或者不同库时，就会需要 `pyenv` 来管理 Python 版本或者使用 `pyenv-virtualenv` 来管理不同独立的 Python 环境)

## How it works?

Sample from https://github.com/pyenv/pyenv#how-it-works .

```mermaid
graph LR
cmd[Python-related command<br/>Like python, pip, ...] --> Shims
Shims --> pyenv
```

Simply to say, any Python-related command (like pip, python, pydoc...) will be executed by `~/.pyenv/shims/<command>` first, then a proper Python version will be selected and the command will be executed

(简单来说，所有与 Python 相关的指令(比如 pip, python, pydoc...)都会被 `~/.pyenv/shims/<command>` 执行，然后 `pyenv` 会选中一个合适的 Python 版本与环境来执行该指令).

### Order of Python version selection

1. check `PYENV_VERSION` environment variable (could be set by `pyenv shell`). If it is set, use it. Otherwise, go to step 2.
2. check `.python-version` file in the current directory (could be set by `pyenv local`). If it is set, use it. Otherwise, go to step 3.
3. check `.python-version` file in all of the parent directories. If it is found, use it. Otherwise, go to step 4(找当前目录的所有父目录，看是否有 `.python-version` 文件。如果找到则使用，否则，转进到第 4 步).
4. check `$(pyenv root)/version` file. If it is set, use it. Otherwise, use the default version defined by system.

## Installation

Sample from https://github.com/pyenv/pyenv#installation and https://github.com/pyenv/pyenv-virtualenv#installation .

### For Linux/macOS

End-to-end installation commands at my environments:

ENV-LAPTOP: Homebrew at macOS with zsh:

```bash
brew update
brew install pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc   # install `pyenv` into your shell as a shell function, enable shims and autocompletion
brew install pyenv-virtualenv
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
```

ENV-WORK: Ubuntu 20.04 with zsh:

```bash
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc   # install `pyenv` into your shell as a shell function, enable shims and autocompletion
git clone https://github.com/pyenv/pyenv-virtualenv.git .pyenv/plugins/pyenv-virtualenv
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
```

### For Windows

`pyenv` does not support Windows yet. So I use [pyenv-win](https://github.com/pyenv-win/pyenv-win) instead.

Because `pyenv` is not supported at Windows, then `pyenv-virtualenv` is unavailable at Windows too. So I use `virtualenv` instead.

End-to-end installation commands at my environment:

ENV-PC: Windows 10 with PowerShell 7.2.1\[4\]:

```powershell
git clone https://github.com/pyenv-win/pyenv-win.git "$HOME/.pyenv"
[System.Environment]::SetEnvironmentVariable('PYENV',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('path', $env:USERPROFILE + "\.pyenv\pyenv-win\bin;" + $env:USERPROFILE + "\.pyenv\pyenv-win\shims;" + [System.Environment]::GetEnvironmentVariable('path', "User"),"User")

pyenv install <version>
pyenv global <version>
python -m pip install --user virtualenv
```

## Usage

### pyenv/pyenv-win

```bash
# check all installable Python versions
pyenv install --list
# install a specific Python version
pyenv install <version>
# use a specific Python version globally
pyenv global <version>
# use a specific Python version in current directory or in all of its subdirectories
pyenv local <version>
# use a specific Python version in the current shell
pyenv shell <version>
```

### pyenv-virtualenv

```bash
pyenv virtualenv <version> <env_name>
pyenv activate <env_name>
pyenv deactivate
# delete venv
pyenv virtualenv-delete <env_name>
```

### virtualenv

```bash
python -m venv <env_name>
source <env_name>/bin/activate  # for unix-like systems
.\<env_name>\Scripts\activate  # for Windows
deactivate
# delete venv
rm -rf <env_name>
```

## Q & A

### Q: Error occurred: `ERROR: The Python ssl extension was not compiled. Missing the OpenSSL lib?`

Run commands below\[2\]:

```bash
sudo apt-get update
sudo apt-get install make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```

### Q: Error occurred: `ImportError: libpython3.8.so.1.0: cannot open shared object file: No such file or directory`

Run commands below\[3\]:

```bash
env PYTHON_CONFIGURE_OPTS="--enable-shared" pyenv install x.x.x
ls ~/.pyenv/version/x.x.x/lib
```

## Q: Erorr occurred: `ModuleNotFoundError: No module named '_lzma'`

Run commands below:

```sh
brew install xz
pyenv uninstall <your_python_version>
pyenv install <your_python_version>
```
## References

- \[1\] https://stackoverflow.com/questions/29950300/what-is-the-relationship-between-virtualenv-and-pyenv
- \[2\] https://github.com/pyenv/pyenv/wiki#suggested-build-environment
- \[3\] https://github.com/pyenv/pyenv/issues/1504#issuecomment-703248521
- \[4\] https://rkadezone.wordpress.com/2020/09/14/pyenv-win-virtualenv-windows/
