---
title: "DNS and how it works? - Backend Developer Roadmap #4"
dateCreated: 2023-04-18T17:08
---

Roadmap: [https://roadmap.sh/backend](https://roadmap.sh/backend)

本文隶属于 Roadmap 中的 `Internet --> DNS and how it works?`。

原文：[https://www.cloudflare.com/en-gb/learning/dns/what-is-dns/](https://www.cloudflare.com/en-gb/learning/dns/what-is-dns/)

## 什么是 DNS？

DNS 是互联网的电话簿。人们通过域名来在线获取信息。Web浏览器通过 IP 地址进行交互。DNS 将域名翻译成 IP 地址，以便浏览器加载互联网资源。

每个连接到互联网的设备都有一个唯一的 IP 地址，其他设备使用该地址来查找该设备。DNS 服务器消除了人们记忆 IP 地址的需求。

## DNS 如何工作？

为了了解 DNS 解析背后的过程，需要学习 DNS 查询必须经过的不同硬件组件。对于 Web 浏览器，DNS 查询在“幕后”进行，除了初始请求外，不需要用户计算机的任何交互。

加载页面时用到的 4 个 DNS 服务器：

- **DNS recursor** - 可以被视为图书馆员，被要求在图书馆中找到一本特定的书。 DNS recursor 是一个服务器，旨在通过应用程序（例如 Web 浏览器）从客户机接收查询。通常，递归器负责发出其他请求，以满足客户端的 DNS 查询。
- **Root nameserver** - 将人类可读的主机名转换（解析）为 IP 地址的第一步。 它可以被视为指向不同书架的索引 - 通常作为指向其他更具体位置的参考。
- **TLD(Top Level Domain) nameserver** - 可以将其视为图书馆中特定的书架。 这个名称服务器是寻找特定 IP 地址的下一步，它托管主机名的最后一部分（在 [example.com](http://example.com/) 中，TLD 服务器是“com”）。
- **Authoritative nameserver** - 最终的名称服务器可以被视为书架上的字典，其中特定名称可以被翻译为其定义。 授权名称服务器是名称服务器查询的最后一站。 如果授权名称服务器可以访问所请求的记录，则会将所请求主机名的 IP 地址返回给进行初始请求的 DNS Recursor（图书馆员）。

## Authoritative DNS server 和 Recursive DNS resolver 之间的区别

在 DNS 基础设施中，这两个概念都涉及到服务器（服务器组），但每个服务器都有不同的角色，并且位于 DNS 查询管道的不同位置。可以将递归 DNS 解析器视为 DNS 查询的开始，而权威名称服务器位于其末尾。

### Recursive DNS resolver

递归解析器是响应客户端递归请求并花费时间查找 DNS 记录的计算机。它通过进行一系列请求来查找所请求记录的权威 DNS 名称服务器（如果找不到记录，则超时或返回错误）。

幸运的是，递归 DNS 解析器可以利用缓存来快速返回结果。

![](https://i.imgur.com/k70xMhp.png)