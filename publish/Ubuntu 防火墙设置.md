---
dateCreated: 2023-08-14T23:54
---
UFW（Uncomplicated Firewall）是一个用户友好的前端界面，用于管理基于netfilter的iptables防火墙。以下是使用UFW的一些常见方式：

1. **启用和禁用UFW**：在开始配置之前，您需要启用UFW。这可以通过以下命令完成：

   启用： `sudo ufw enable`

   禁用： `sudo ufw disable`

2. **查看UFW状态**：要查看UFW的当前状态和规则列表，可以使用以下命令：

   `sudo ufw status verbose`

3. **添加规则**：您可以通过指定端口号和协议（如TCP或UDP）来添加规则。例如，如果您要允许所有传入的SSH连接，可以使用以下命令：

   `sudo ufw allow 22/tcp`

   或者，您也可以使用服务名称，如：

   `sudo ufw allow ssh`

4. **删除规则**：如果您需要删除规则，可以使用 `delete` 参数。例如，要删除上面添加的规则，可以使用以下命令：

   `sudo ufw delete allow 22/tcp`

5. **允许/阻止特定IP地址**：您可以允许或阻止来自特定IP地址的连接。例如，以下命令允许来自192.168.1.1的所有连接：

   `sudo ufw allow from 192.168.1.1`

   而以下命令阻止来自192.168.1.1的所有连接：

   `sudo ufw deny from 192.168.1.1`

6. **设置默认策略**：UFW允许您设置默认的阻止或允许策略。例如，您可以设置默认拒绝所有传入的连接，然后只允许需要的服务。以下命令设置默认策略为拒绝所有传入的连接：

   `sudo ufw default deny incoming`

   并允许所有传出的连接：

   `sudo ufw default allow outgoing`

这只是UFW的一些基本用法。UFW还提供了更高级的功能，如规则排序、日志管理等。
