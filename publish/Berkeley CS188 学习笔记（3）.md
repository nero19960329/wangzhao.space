---
dateCreated: 2017-02-10T00:00:00
---
这次的笔记包括马尔科夫决策过程以及增强学习的相关内容。

## 马尔科夫决策过程

马尔科夫决策过程（Markov Decision Processes，简称**MDP**）的定义：

- 状态集合 $s\in S$
- 动作集合 $a\in A$
- 转移函数 $T(s,a,s^{\prime})$，表示从状态 $s$ 执行动作 $a$ 后达到状态 $s^{\prime}$ 的概率
- 收益函数 $R(s,a,s^{\prime})$，表示转移对应的收益
- 初始状态
- 终止状态（不必须）

举个例子，在一个网格迷宫中，我们操纵的 agent 将会在迷宫中进行游走。

![](https://i.imgur.com/b8qBpHz.png)

区别于一般的游戏，它并不会完全按照我们给他的指令进行移动，它有 80% 的概率正确地移动，其余 20% 的概率将会向正确移动方向的左边或者右边（各 10%）进行移动，如果移动方向前方有墙，那么它待在原地不动。为了敦促 agent 尽快找到宝物，在游戏结束前，走的每一步都会略微扣一些分数，当找到宝物后，将会有较大的奖励；反之，如果不幸掉进陷阱，将会有较大惩罚。

在这个 MDP 中，我们可以对 MDP 定义中的一些抽象概念进行具体化，比如转移函数可以写成：

$T((3,1),North,(3,2))=0.8$
$T((3,1),North,(2,1))=0.1$
$T((3,1),North,(4,1))=0.1$

值得注意的是，终止状态并不是可见的，也就是说，当 agent 达到 $(4,3)$ 时，不会马上得到分数，而是需要经过一个动作 exit 后达到终止状态。

在 MDP 中，我们需要找出一个最佳**策略**（policy）$\pi^{*}:S\rightarrow A$：

- 对于每个状态，策略 $\pi$ 都会给出一个动作
- 使得效益（utilities）最大化的策略被称之为最佳策略

**收益**（reward）函数对最佳策略的影响见下图：

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l7_optimal_policies.png)

比较有趣的是，当每一步的收益亏损很大时（右下角），在陷阱附近的agent将会倾向于自杀，因为自杀也只不过扣1分，而继续活着将扣2分。

值得一提的是，马尔科夫通常代表，针对当前状态来讲，未来以及过往都是独立的。在MDP中具体来说，可以用下面这个式子来表达：

![P(S_{t+1}=s^{'}|S_{t}=s_{t},A_{t}=a_{t},S_{t-1}=s_{t-1},A_{t-1}=a_{t-1},\cdots ,S_{0}=s_{0})=P(S_{t+1}=s^{'}|S_{t}=s_{t},A_{t}=a_{t})](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_6eb59bb15d41f4f5b46ad0745bef40a5.gif)

接下来介绍**折扣**（discounting）概念。在我们最大化收益的同时，我们倾向于更早地获得收益，以及更晚地获得负收益。所以可以考虑将收益进行指数性减小，每经过一步，收益都会乘以一个因子![\gamma\in(0,1)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_0076b144c37c810860be29b8672c5054.gif)。

现在考虑对MDP的求解。首先定义几个概念：

- ![V^{*}(s)=](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_4a1c676390900dc694a77247d270f36f.gif)在状态![s](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_03c7c0ace395d80182db07ae2c30f034.gif)下开始，进行最优操作所获得的收益期望
- ![Q^{*}(s,a)=](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_a1185628172d4049b1a0915217068855.gif)从状态![s](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_03c7c0ace395d80182db07ae2c30f034.gif)进行动作![a](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_0cc175b9c0f1b6a831c399e269772661.gif)后，进行最优操作所获得的收益期望
- ![\pi^{*}(s)=](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_bc50384c0ffa3182d757c245865fa6d0.gif)状态![s](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_03c7c0ace395d80182db07ae2c30f034.gif)的最优操作

可以类比之前学过的 Expecimax Search ，通过构造出类似的搜索树，可以得到如下几个公式（**Bellman等式**）：

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l7_expectimax_search_tree.png)

- ![V^{*}(s)=\max\limits_{a} Q^{*}(s,a)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_60cd09a784d646949f4cc144d448251d.gif)
- ![Q^{*}(s,a)=\sum\limits_{s^{'}}T(s,a,s^{'})[R(s,a,s^{'})+\gamma V^{*}(s^{'})]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_85d938844d5e0c1fe732f8ee5177f523.gif)

![\Rightarrow V^{*}(s)=\max\limits_{a} \sum\limits_{s^{'}}T(s,a,s^{'})[R(s,a,s^{'})+\gamma V^{*}(s^{'})]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_18d46afcdf7d7e52d2cf2844d59775d4.gif)

但如果还用之前的搜索法来对这个问题进行求解，速度就太慢了。所以引入新的算法：**价值迭代**（value iteration）：

- ![\forall s\in S\quad V_{0}(s)=0](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_ed7651c3ebba110e797e5cadf7530f4e.gif)
- ![\forall s\in S\quad V_{k+1}(s)\leftarrow \max\limits_{a}\sum\limits_{s^{'}}T(s,a,s^{'})[R(s,a,s^{'})+\gamma V_{k}(s^{'})]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_facf02cdcc71b8d1af96545d52a234e0.gif)
- 重做第二步，直到收敛

价值迭代法每一步的时间复杂度为 ![O(S^{2}A)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_43f9fc7fa7de4acfa1978470a66c0700.gif)，而且当![\gamma\in (0,1)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_7c2d75b10d7df6964fd67d507bf2d630.gif)时，算法必然收敛。

在使用价值迭代法得到每个状态的![V^{*}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_55d5515825d642cb3a0697ca97312625.gif)值后，怎么得到某个状态下的最佳策略呢？这时我们需要在该状态下计算其所有![Q^{*}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_ea5ccb5e3dbe06fadb17a6142f115b63.gif)值，并取使![Q^{*}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_ea5ccb5e3dbe06fadb17a6142f115b63.gif)最大的动作作为在该状态下的最佳动作。

价值迭代算法存在着一些问题：

- 时间复杂度较高
- 每个状态的最佳策略往往在![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值收敛前就已经收敛了

针对上列问题，我们可以对策略进行迭代，该方法称为**策略迭代**（policy iteration）：

- 策略评估：针对固定策略![\pi](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_4f08e3dba63dc6d40b22952c7a9dac6d.gif)计算出所有状态的![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值
- 策略改进：对于每个状态，都找出当前的最优动作，更新策略
- 重复上两步，直到策略收敛

其中策略评估可以使用迭代法（利用Bellman等式，时间复杂度：![O(S^{2})](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_7c55374c0cf8e9732b15d5e57d385b55.gif)每步），也可以将Bellman等式看做一个线性系统进行求解。

策略迭代方法的运行速度比价值迭代方法快了不少，并且也会收敛到最优策略。

## 强化学习

强化学习的基本思想如下：

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l9_rl_basic_idea.png)

- 环境会以收益的形式给出反馈
- agent的效益由收益函数定义
- 学习能够最大化收益期望的策略
- 所有学习过程都基于在游戏探索得到的样本

之所以我们需要探索游戏，是因为游戏（MDP）中的![T](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_b9ece18c950afbfa6b0fdbfa4ff731d3.gif)（转移函数）和![R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_e1e1d3d40573127e9ee0480caf1283d6.gif)（收益函数）是未知的。

### 基于模型的学习

基本思想：

- 根据经验学习一个大概的模型（估计![T](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_b9ece18c950afbfa6b0fdbfa4ff731d3.gif)和![R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_e1e1d3d40573127e9ee0480caf1283d6.gif)）
- 对这个学习出的MDP进行求解

看个例子，

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l9_model_based_example.png)

根据输入的策略![\pi](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_4f08e3dba63dc6d40b22952c7a9dac6d.gif)，可以得到若干遍历结果，从而可以对![T,R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_45578fde7dd459a36369694203cc0118.gif)进行估计。

### 无模型学习

**被动强化学习**（passive reinforcement learning），类似于之前介绍的策略迭代，首先对一个输入的固定策略进行评估，之后对策略进行优化改进。那么问题就是，我们没有![T,R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_45578fde7dd459a36369694203cc0118.gif)，无法使用之前的方法直接进行策略评估，所以需要尝试新的方法。

直接评估，针对固定策略![\pi](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_4f08e3dba63dc6d40b22952c7a9dac6d.gif)，按照该策略进行游戏，并记录每一步的收益，并最终通过取平均来获得每个状态的![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值。看个例子，

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l9_direct_evaluation_exmaple.png)

比如![V(B)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_8cde6af5135e47223edbfd3967ddeddb.gif)，由于样本中从状态![B](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_9d5ed678fe57bcca610140957afab571.gif)出发，只有向东走的情况，所以![V(B)=\frac{(-1-1+10)+(-1-1+10)}{2}=8](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_73e0a7c645d6fa2e03f54b17746607ca.gif)，其余类似。这个方法很直观，也不需要![T,R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_45578fde7dd459a36369694203cc0118.gif)的任何信息，但忽略了状态间的关系，且每个状态必须分开学习，所以需要较长时间去学习。

既然这个方法不行，那么我们又想回上一节策略评估的方法：通过下式进行迭代，

![V_{k+1}^{\pi}(s)\leftarrow\sum\limits_{s^{'}}T(s,\pi (s),s^{'})[R(s,\pi (s),s^{'})+\gamma V_{k}^{\pi}(s^{'})]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_022057af0ccd144c8ecddaa893dca491.gif)

虽然没有![T,R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_45578fde7dd459a36369694203cc0118.gif)也就无法使用上式，但我们可以在游戏中进行一系列采样：

![sample_{i}=R(s,\pi (s),s_{i}^{'})+\gamma V_{k}^{\pi}(s_{i}^{'})\\ V_{k+1}^{\pi}(s)\leftarrow \frac{1}{n}\sum\limits_{i}sample_{i}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_1269ac981d5c677910f007a2cd91e91f.gif)

通过对采样进行平均，从而得到每个状态的![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值。

进一步，我们需要将算法调节成迭代算法，这样就不用针对每个状态单独进行估值，而是每次进行游戏都可以使路径中的状态![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值迭代逼近真正的值。这种方法被称为**时间差分学习**（temporal difference learning）。以固定策略进行游戏的情况下，每次迭代都将更新状态的![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值，公式如下：

- ![sample=R(s,\pi (s),s^{'})+\gamma V^{\pi}(s^{'})](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_0a550d648892f580612ac274189b7a43.gif)
- ![V^{\pi}(s)\leftarrow (1-\alpha)V^{\pi}(s)+\alpha sample](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_694cad218dea93c6928bc24fc36ff1b6.gif)

这个方法很好，但我们不能忘了目标，我们需要找到每个状态的最优动作，也即对于状态![s](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_03c7c0ace395d80182db07ae2c30f034.gif)，需要找到  

![\pi (s)=\operatorname*{argmax}\limits_{a} Q(s,a)=\operatorname*{argmax}\limits_{a}\sum\limits_{s^{'}}T(s,a,s^{'})[R(s,a,s^{'})+\gamma V(s^{'})]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_e57b8157ee4f0a2fbbfa9a260b8b0c21.gif)

  
由于对![T,R](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_45578fde7dd459a36369694203cc0118.gif)的缺失，导致无法从已有的![V](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_5206560a306a2e085a437fd258eb57ce.gif)值中榨取出最优动作，所以我们应该考虑对![Q](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_f09564c9ca56850d4cd6b3319e541aee.gif)值进行学习。

**主动增强学习**（active reinforcement learning），其与被动增强学习的区别在于，学习者需要自己选择策略对游戏进行探索，而不是之前的按照既定策略进行探索然后更新。

**Q-Learning**，通过自定的策略对游戏进行探索，并更新状态![s](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_03c7c0ace395d80182db07ae2c30f034.gif)及对应动作![a](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_0cc175b9c0f1b6a831c399e269772661.gif)的![Q](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_f09564c9ca56850d4cd6b3319e541aee.gif)值：

- 探索得到一个样本：![(s,a,s^{'},r)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_14923d616bb1fc42f9d9790884fa36d4.gif)
- 考虑旧的估计值 ![Q(s,a)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_963cd803370b3ba71a0f49cbad92ccee.gif)
- 考虑新样本的估计值 ![sample=R(s,a,s^{'})+\gamma\max_{a^{'}}Q(s^{'},a^{'})](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_eb39203cc7061d3d71c3d7644bd46f03.gif)
- 将新旧估计值做加权平均：![Q(s,a)\leftarrow (1-\alpha)Q(s,a)+\alpha\cdot sample](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_940a60d4385923681525f2a00b1bd737.gif)

Q-Learning将会收敛至最优策略，但也有几个附加说明：

- 需要足够多的探索
- 学习率![\alpha](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_7b7f9dbfea05c83784f8b85149852f08.gif)需要逐渐变小（比如![\frac{1}{n}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_9ba22ee6c5f55c74af52949dd103f942.gif)，但也不能减小得太快）

在Q-Learning中，比较重要的一点是在**exploration**和**exploitation**中做一个 trade-off 。

一种比较简单的做法就是设定一个阈值![\epsilon](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_92e4da341fe8f4cd46192f21b6ff3aa7.gif)，随后每次做选择时roll一个0到1之间的随机数，如果小于![\epsilon](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_92e4da341fe8f4cd46192f21b6ff3aa7.gif)，则随机选择动作（exploration）；否则，选择当前的最优决策（exploitation）。

稍微复杂些的做法是设置一个exploration function，比如：![f(u,n)=u+\frac{k}{n}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_dacddc8b9d109a6f44505fcacc2fe8a1.gif)，其中![u,n](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_96f21df067b3ff769d9b773e1b33851a.gif)分别代表估计值和探索次数，那么改良后的Q-Learning中每个样本估计值的表达式将变为：

![sample=R(s,a,s^{'})+\gamma\max_{a^{'}}f(Q(s^{'},a^{'}),N(s^{'},a^{'}))](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_ad7b74c02c0fd02f33383ca6ff76d5bc.gif)

这样一来，当agent进行探索时，也会更倾向于考虑探索次数少的动作，而且当![n](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_7b8b965ad4bca0e41ab51de7b31363a1.gif)越来越大时，![\frac{k}{n}](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_fda8af4743433ddceb8ff7765b97fd18.gif)一项对![Q](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_f09564c9ca56850d4cd6b3319e541aee.gif)的影响也越来越小，最终将不会影响最优策略的选择。

然而在实际问题中，会有很多很多的状态，当状态足够多时，我们不可能存储所有的![Q](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_f09564c9ca56850d4cd6b3319e541aee.gif)值。而且某些状态比较相近，但我们的Q-Learning方法仍然将它们视为完全不同的状态。举个例子，

![](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/uploads/2017/02/l10_simular_states.png)

前两个状态，pacman都是被两只鬼堵在角落里，实质上pacman所处的情形差不多。一、三两个状态更是几乎完全相同，只是右上角的一块食物在第三个状态中被吃掉。然而它们都被视为了完全不同的状态，这一点可以被我们用来优化算法。

这样看来，优化方法也可以比较容易想到，也即将状态用特征向量表示出来：![f_{i}(s,a),i\in [1,n]](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_19ac33073fe73662a7dfb4b03e600ba2.gif)。这里特征的设计就显得尤为重要，好的特征可以将状态空间较好地映射到特征空间。考虑将这些特征进行线性组合：

![Q(s,a)=\sum\limits_{i=1}^{n} w_{i}f_{i}(s,a)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_fb6e6c0be61a5b668aa9e61e8553c8c9.gif)

经过这样的处理，Q-Learning算法也将变为 **Approximate Q-Learning** ：  

![difference=[r+\gamma\max_{a^{'}}Q(s^{'},a^{'})]-Q(s,a)\\ w_{i}\leftarrow w_{i}+\alpha\cdot difference\cdot f_{i}(s,a)](https://web.archive.org/web/20170912123205im_/http://wangzhao.me/wp-content/plugins/latex/cache/tex_0ef1b27941b5133f0703391bd04c8fc7.gif)

至此，课程的第一部分也就结束了。由于学校这边即将开学，所以博文也要停更一段时间，之后的部分随后有时间再填坑吧。。