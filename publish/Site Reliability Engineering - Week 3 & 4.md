---
title: Site Reliability Engineering - Week 3 & 4
dateCreated: 2022-09-03T16:41
dateModified: 2023-08-09T02:04
---

## Course Link

https://www.coursera.org/learn/site-reliability-engineering-slos

## References

https://sre.google/

## Developing SLI / SLO in 4 steps

1. Choose an **SLI specification** from the SLI menu
    - 确定 SLI 的大方向
1. Refine the specification into a detailed **SLI implementation**
    - 确定 SLI 的实现细节
1. Walk through the user journey and look for **coverage gaps**
    - 寻找 SLI 没有覆盖到的部分
1. Set aspirational **SLO targets** based on business needs
    - 设置理想的 SLO 目标

## 分析系统中的风险

围绕着一个 template excel 表格，来做各种分析。

https://goo.gl/bnsPj7 

https://www.coursera.org/learn/site-reliability-engineering-slos/lecture/V8Edf/analyzing-risk 这里有使用方式。还没看得太透彻，之后如果有实战机会再补心得。

大致意思就是说，先列出系统中可能出问题的风险点，评估各种指标，并通过 SLO 来确定哪些风险是我们应该重点关注的。

## 为 SLO 写文档

理由是您提供的服务无论用户还是开发者，以及上司，都需要知道服务的 SLO 是如何定义的，且如果 break 了，后果是什么。

建议包括以下三点：

1. SLO 阈值如何设定？
1. 为什么该 SLI 是可以合理度量 SLO 的？
1. 指出哪些数据是不会被 SLI 统计的（非法请求）

SLO dashboard 例子:

![](https://s3.bmp.ovh/imgs/2022/09/05/436c08bb2d661aa6.jpg)
