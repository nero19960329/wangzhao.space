---
title: Site Reliability Engineering - Week 2
dateCreated: 2022-08-30T00:01
---

## Course Link

https://www.coursera.org/learn/site-reliability-engineering-slos

## References

https://sre.google/

## SLI 指标设计

不好的设计：直接使用系统监视图表（比如 CPU 使用率、内存使用率等），或者使用内部状态监视图表等。

理由是数据噪声大，而且通常和用户体验不呈直接影响的关系。

好的 SLI 指标应具有以下几个特点：

1. Has predictable relationship with user happiness
    - 与用户幸福感具有可预测的关系
1. Shows service is working as users expect it to
    - 能展现服务是按照用户期望的方式在运行
1. Express as: good events / valid events
    - 可以表达为 良好请求 除以 合法请求
1. Aggregated over a long time horizon
    - 在较长的时间窗口内聚合 SLI，以消除数据中的噪声

## 常用的 SLI

两个常见场景如下：

### Request / Response

请求 & 反馈场景。比如 HTTP, RPC 等。

**Availability**

可用性。该 SLI 应设计为所有合法请求中**成功**的比例。

**Latency**

延迟。该 SLI 应设计为合法请求中**响应速度快于阈值**的比例。

**Quality**

服务质量。该 SLI 应设计为所有合法请求中**保持服务质量**的比例。

### Data Processing

数据批量处理场景。

**Freshness**

新鲜度。该 SLI 应设计为所有合法数据中**生成时间快于阈值**的比例。

通常需要时间戳来进行 SLI 指标计算。

**Correctness**

正确度。该 SLI 应设计为所有合法数据中**正确**的比例。

需要注意，不能用处理数据的逻辑来判断数据是否正确。

一种方法是可以使用 golden 输入输出对来对整体数据的正确程度进行估计。

**Coverage**

覆盖程度。该 SLI 应设计为所有合法数据中**成功被处理**的比例。

类似于上一节中的可用性 SLI。

**Throughput**

吞吐量。该 SLI 应设计为一段时间内**处理速度快于阈值的时间**占比。

### 复杂场景下的建议

尽量减少 SLI 指标数，推荐 1~3 个。

太多 SLI 并不能使得每个指标都那么直观地表现系统的可靠程度。并且大量 SLI 会增加它们之间发生冲突的可能。

这并不意味着其他非 SLI 指标的监控图表也要同样被精简，它们可以帮助你来分析 SLI 低的原因。

### 同一种 SLI 在多种场景下的聚合

直接将分子之和除以分母之和可能在大部分情况下适用，但也存在一些问题，比如当某一种场景流量较小时，该场景的 SLI 可能会被平滑掉。

可以使用更复杂一些的聚合策略，比如考虑流量相关的加权。

### SLI 在多种场景下的阈值定义

以请求的 latency 举例，典型的场景划分可以是：

- 被第三方依赖的请求：因为不知道第三方的调用方式，所以我们不一定要为他们负责，所以只要确保能用即可，比如 10s
- 后台请求：较松的时间阈值，比如 5s
  - 比如非人类用户（bot）等发出的请求
- 写请求：较紧的时间阈值，比如 1.5s
  - 用户点提交按钮对反馈时间是比较宽容的
- 交互请求：最紧，比如 400ms

## 设置合理的 SLO

### Achieveable SLOs

用户期望与过去的表现密切相关。

如果你已有许多历史数据，则可以通过挖掘历史数据来设置 SLO。这种 SLO 被称之为可达到的 SLO。这种设置方式需要有一个假设，即假设用户对当前和过去的表现感到满意。

### Aspirational SLOs

没有历史数据怎么办？如果当前服务的表现并不好或者非常好，怎么设置 SLO？

根据业务需求指定的 SLO 被称之为理想 SLO。可以在服务上限之初，由产品团队来指定，之后可以动态调整。

### 持续优化

首次设定 SLO 时，您需要观察、搜罗用户感受，并与您制定的 SLO 指标对比。

记得要定时查看 SLO 是否还合适，建议每年查看一次。
