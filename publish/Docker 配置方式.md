---
dateCreated: 2023-08-10T22:08
---

在这篇文章中，我将指导你如何在你的系统上配置 Docker。我们将分别介绍 Linux 和 MacOS 下的安装方式。

## Linux 系统下的安装步骤

### 1. 卸载旧版本 Docker

首先，我们需要确保系统中没有安装旧版本的 Docker。你可以通过以下命令进行卸载：

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

### 2. 更新 apt 包索引并安装依赖

接下来，让我们更新系统的 apt 包索引，并安装 Docker 所需的依赖：

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### 3. 添加 Docker 的官方 GPG 密钥

在安装 Docker 之前，我们需要添加 Docker 的官方 GPG 密钥。这是一个安全步骤，用于验证下载的包是否是原始的：

```bash
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

接下来，我们验证是否已经成功添加了带有指纹的密钥：

```bash
sudo apt-key fingerprint 0EBFCD88
```

### 4. 设置稳定版仓库

现在，我们需要设置 Docker 的稳定版仓库，以便从中下载和安装 Docker：

```bash
sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/ \
  $(lsb_release -cs) \
  stable"
```

### 5. 安装最新版本的 Docker Engine-Community 和 containerd

一切准备就绪后，我们可以安装最新版本的 Docker Engine-Community 和 containerd 了：

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### 6. 测试 Docker 是否安装成功

安装完成后，我们可以通过以下命令来测试 Docker 是否已经成功安装：

```bash
sudo docker info
```

### 7. 解决问题

如果在测试过程中遇到问题，你可以通过以下命令来查看问题出在哪里：

```bash
sudo dockerd --debug
```

如果问题与 iptable 相关，你可以参考这个 [Github issue](https://github.com/docker/for-linux/issues/1105#issuecomment-808704705)。在运行相关指令时，请确保 `net.ipv4.ip_forward=1`。

## MacOS 系统下的安装步骤

在 MacOS 上安装 Docker 过程更为简单：

### 1. 通过 Homebrew 安装 Docker

首先，我们通过 Homebrew 来安装 Docker：

```bash
brew install --cask docker
```

### 2. 启动 Docker

安装完成后，你可以在应用中找到 Docker 图标并点击运行。

## 配置 Docker 代理

无论你是在哪种操作系统下安装 Docker，如果你需要配置 Docker 代理，你可以参考这篇[文章](https://note.qidong.name/2020/05/docker-proxy/)。
