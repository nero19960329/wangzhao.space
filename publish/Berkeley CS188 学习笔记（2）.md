---
dateCreated: 2017-02-01T00:00
---
这次笔记将会总结对抗性游戏中游戏策略的决策方法。

在研究决策策略之前，我们需要对游戏的类型做一个限制。首先，这种游戏需要是确定性的，也就是说，任意一个动作都可以让玩家从某一个状态确定地转移至另一个状态。以及，这种游戏需要是一个零和游戏，即，玩家的效益是相反的。

在之前的决策搜索中，状态树一般是长成这样的：

![](https://i.imgur.com/DtTjhHL.png)

由于只有一名玩家，所以我们只需要最大化节点的值即可。但在对抗性游戏当中，至少有两位玩家，所以对抗性游戏的状态树一般是这样的：

![](https://i.imgur.com/HdBAE5Z.png)

考虑这样一种策略，当自己控制 pacman 时，总是希望选取能让自己效益最大化的那个动作；而对方控制 ghost 时，自己总是做好最坏打算（也就是对面会选取一种让自己的效益最小化的那个动作）。这种策略被称为 Minimax Search 。用数学表达式来说明每个节点的 Minimax Value ，如下：

$V(s)=$
- $\max_{s^{\prime}\in successor(s)}V(s^{\prime})$ , if under user's control
- $\min_{s^{\prime}\in successor(s)}V(s^{\prime})$ , if under opponent's control
- known value, if terminal state

只要理解了原理，实现起来也比较简单。伪代码：

![](https://i.imgur.com/8lM8R4h.png)

这就像一个彻底的 DFS，把状态树彻彻底底地搜索一遍。所以复杂度也与DFS相同。但在实际情况中，几乎不可能把整个状态树全部搜索完，所以需要考虑限制搜索深度。如果搜索一定深度后，仍然没有到达树的底部，那么就需要评估当前状态是好还是坏，这就是评估函数。评估函数好坏与否对于解决问题是很重要的。

在限制搜索深度的同时，还可以对状态树进行剪枝，被称作 Alpha-Beta 剪枝。看一个例子：

![](https://i.imgur.com/cMxICyP.png)

当我们在计算节点 $n$ 的值时，将会遍历其所有子节点，计算它们的值并从中选出一个最小的值作为$n$ 的值。这时令 $a$ 为从根节点到 $n$ 路径中所有选项中最小的那个，如果 $n$ 的某个子节点的值小于 $a$，那么我们将不再考虑 $n$ 的其他任何子节点，也即将 $n$ 剪掉。另外一种情况是对称的。根据这个原理，可以将 Alpha-Beta 剪枝的伪代码表示成如下形式：

![](https://i.imgur.com/W5HUrkd.png)

经过剪枝后的搜索算法的时间复杂度从 $O(b^{m})$ 降至 $O(b^{\frac{m}{2}})$，也就是说，可以搜索的深度相较于之前的 naive 算法多了一倍！

之前讨论的情况都是在对方也是一个出色的玩家（总是选择最大化自己的效益）下进行的。另外还有可能对方只是采取随机游走或者采取固定策略，如果是这种情况，使用 Minimax Search 就不是一个好的选择。所以考虑引入 Expectimax Search ，思路很简单，就是将 Minimax Search 算法中状态树中的最小值节点（min node）替换成概率节点（chance node），这种节点的值等于子节点值的期望。伪代码如下：

![](https://i.imgur.com/7bhFU2s.png)