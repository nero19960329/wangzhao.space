---
dateCreated: 2023-08-09T13:56
dateModified: 2023-08-09T13:57
---

dig 是一种强大的 DNS 查询工具，它可以在命令行中使用。以下是几个使用例：

### 查询A记录

假设我们想要查询 "[example.com](http://example.com/)" 的 A 记录，可以在命令行中输入以下命令：

```bash
dig example.com A
```

这将返回"[example.com](http://example.com/)"的IP地址。

### 查询MX记录

假设我们想要查询 "[example.com](http://example.com/)" 的 MX 记录（邮件服务器记录），可以在命令行中输入以下命令：

```bash
dig example.com MX
```

这将返回"[example.com](http://example.com/)"的 MX 记录信息，包括邮件服务器的名称和优先级。

### 查询DNS服务器详细信息

假设我们想要查询 "[example.com](http://example.com/)" 域名服务器的 IP 地址，可以在命令行中输入以下命令：

```bash
dig example.com NS
```

这将返回 "[example.com](http://example.com/)" 的域名服务器信息，包括名称和IP地址。

### 使用选项和标志

假设我们想要查询 "[example.com](http://example.com/)" 的 IP 地址，并仅返回 IP 地址，可以在命令行中输入以下命令：

```
dig example.com A +short
```

这将仅返回 "[example.com](http://example.com/)" 的IP地址，而不包括其他信息。

### 自动化脚本

假设我们需要查找多个域名的DNS信息，可以编写一个自动化脚本来执行查询。以下是一个示例脚本：

```
#!/bin/bash
for domain in example.com google.com facebook.com
do
    echo "Domain: $domain"
    dig $domain A +short
    echo ""
done
```

这将自动查询三个域名的 A 记录，并输出结果。

总的来说，dig 是一个非常有用的 DNS 查询工具，它可以帮助用户快速地查找 DNS 记录和服务器信息。无论是在命令行中使用还是通过脚本自动化，dig 都是一个非常强大和灵活的工具。