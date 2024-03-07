---
title: Site Reliability Engineering - Week 1
dateCreated: 2022-08-27T16:36
---

## Course Link

https://www.coursera.org/learn/site-reliability-engineering-slos

## References

https://sre.google/

## SLO: Service Level Objective

服务水平目标。

虽然系统的可靠性非常重要，但也不能因为保证系统可靠而不开发新 feature。

所以需要平衡需求开发和保持系统可靠性是重要且具有挑战性的。

SLO 可以用来判定可靠性和其他新 feature 的优先级。

对于保持系统可靠运行的人来说，如果经常陷入**救火->事件调查->重复性维护**循环，就会被拖住。

此时，如果我们可以明确知道**可靠性目标**是什么，就不必陷入这种被动响应的循环。

这一点就需要 SLO 来介入，它可以回答**系统的可靠性水平是多少**这个问题。从而给决策人员通过数据来判定此时此刻是应该开发新 feature 或者提高系统可靠性。

### SLO 三原则

1. Figuring out what you want to promise and to whom
    - 搞明白要承诺什么，向谁承诺
1. Figuring out the metrics you care about that make your service for reliability good
    - 找出需要关心的指标，使得服务具有良好的可靠性
1. Deciding how much reliability is good enough
    - 搞清楚上述指标达到多少就足够好了

## SLA: Service Level Agreements

服务水平协议，是提供服务者与用户之间达成的可靠性协议。如果违反了 SLA，则提供服务者应当承担后果。

一般来说，当提供服务者已经发现 SLA 被 break 时才收到警报，那么修复善后过程则非常贵。

所以需要将 SLO 作为阈值，来提前预警 SLA 被 break 的风险。

### SLA vs SLO

SLA 是存在后果的对外承诺；SLO 则是为了满足客户期望的内部承诺。

当系统的 SLO 被 break 时，就需要特别开始关注系统的可靠性与运行风险了。

## Happiness Test: 幸福测试

用来帮助设定 SLO 的值。当勉强满足 SLO 时，客户是开心的；反之，客户则是不满的。

挑战在于如何量化指标，如何衡量客户的幸福感。

比如客户可能由很多群体组成，每个群体的关注点不同。

## SLI: Service Level Indicators

服务水平指标，是对用户体验的测量指标。最好是表达所有有效时间中良好的比例，比如过去一段时间内成功请求所占所有合法请求的比例。

```
SLI = good events / valid events
```

## Error Budgets: 错误预算

用于平滑地表示 break SLO 的程度。当 error budget 达到 100% 时，意味着 SLO 已经被 break 了，需要把可靠性放在第一优先级来看。

当 error budget 还低时，就可以让新 feature 开发放在高优先的位置（可以采取更激进的发布），error budget 逐渐升高但还没超过 100% 时，就需要更保守的发布策略。

对于某种特定类型的故障来说，可以定义如下指标：
- TTD: Time to detect
  - 从用户受到影响到 SRE on-call 来解决问题的时间
- TTR: Time to repair & Time to resolution
  - 从发现问题到解决问题的时间
- TTF: Time to failure
  - 故障发生的频率
- 该故障对错误预算的预期影响 epsilon

```
epsilon = TTD * TTR * 故障影响因子% / TTF
```

减少故障对错误预算的影响，可以从以下几点出发：

- 降低 TTD
  - 添加自动机制来捕获异常，比如自动警报、监视等
- 降低 TTR
  - 通过写文档，打 log 来让错误更容易被定位与解决
  - 做一些简便的工具用来排查问题
- 降低故障影响因子
  - 限制特定更改在一段时间内可能影响的用户数量
    - 基于百分比的更新，比如新功能仅推送给 0.1% 的用户，再一点点增加
  - 服务在故障期间以降级模式运行，比如只允许读但不允许写
- 提高 TTF
  - 自动将流量引导至远离发生故障的区域

## Summary

- 做好问题定义：SLOs & SLIs
- 让系统恰好达到它应有的稳定程度，但不必做到 100% 的极致
- 错误预算是沟通的基础
- SLOs 不是永远不变的
- 组织间需要较强的合作
