---
dateCreated: 2017-01-20T00:00:00
---
简单说一下上个学期图形学课程做的一些东西，主要是实现了 Ray Tracing 以及 Monte Carlo Path Tracing 的一部分，以及实现了一篇通过神经网络训练辐射度函数的论文。这里就先谈一谈光线追踪的相关东西吧。

我在去年这个时间自己实现了一个光线追踪的 demo，只实现了几个简单的模型，并没有纹理、景深等特性，而且代码结构比较差，不是很 OOP。上个学期我拜读了一下 [ppwwyyxx](https://web.archive.org/web/20170912095913/http://ppwwyyxx.com/) 的code，从代码结构以及各种 C++11 的特性运用上，感觉自己相比于这位贵系同学在大二时的水准差的还是太多了，还是需要再学习一个。这次光线追踪程序的架构很大程度上也是参考了他的架构，但类的内部实现基本还是自己写的，在之前的基础之上增加了比如折射、纹理、景深、软阴影等等特性。效果大概是这样

![](https://raw.githubusercontent.com/nero19960329/RayTracer/master/gallery/dragon_dof20_anti20_soft49.png)

这里着重说一下景深，这个特性从视觉上理解就是在对焦平面上的物体最清晰，距对焦平面越远，物体越模糊的一种现象。所谓对焦平面即满足如下条件的平面：从成像平面上的一点向光圈追踪的所有光线在经过光圈折射后都会在对焦平面上的某一点相交。也就是说，如果想要模拟这种现象，就需要利用上述性质。首先我们需要在光圈上进行采样（我直接用的随机采样，貌似pbrt有更高级些的采样方法），得到采样点 $P_{i}$，作为跟踪光线的起点。再从光圈中点与虚拟屏幕上需要渲染的像素点位置进行连线并延长，找到其与对焦平面的交点 $Q$，则 $P_{i}Q$ 即为跟踪光线的方向。

蒙特卡洛路径追踪这一部分呢，主要还是对算法的理解以及重要性采样比较重要（对我来讲）。理解了渲染方程会对算法的实现有很大的帮助。由于我只实现了Lambertian和Phong模型，所以重要性采样也只涉及了针对这两种模型的方法。

先来看 Phong 模型的 BRDF 函数：

$f_{r}(x,\theta_{i},\theta_{o})=\frac{k_{d}}{\pi}+k_{s}\frac{n+2}{2\pi}cos^{n}(\alpha)$

其中 $\alpha$ 是镜面反射方向与出射方向所成的夹角，$n$ 是材质的 shininess。以及满足约束 $k_{d}+k_{s}\le 1$

那么可以分成两步，先根据俄罗斯轮盘赌法则确定光线接下来的采样方式（漫反射/高光反射/被吸收），之后根据不同情况进行重要性采样。对于漫反射部分，概率分布函数以及采样方法如下：

$pdf(\theta_{i})=\frac{1}{\pi}cos(\theta_{i})$

$w_{i}=(\theta,\phi)=(arccos(\sqrt{u_{1}},2\pi u_{2}))$

其中 $u_{1},u_{2}$ 为属于 $[0,1]$ 区间的随机数。对于高光反射部分，pdf 以及采样方法：

$pdf(\theta_{i})=\frac{n+1}{2\pi}cos^{n}(\alpha)$

$w_{i}=(\alpha,\phi)=(arccos(u_{1}^{\frac{1}{n+1}}),2\pi u_{2})$

MCPT的效果如下：

![](https://raw.githubusercontent.com/nero19960329/RayTracer/master/gallery/mcpt_4000_glass_balls.png)

github地址：[https://www.github.com/nero19960329/RayTracer](https://web.archive.org/web/20170912095913/https://www.github.com/nero19960329/RayTracer)