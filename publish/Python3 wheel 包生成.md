---
title: Python3 wheel 包生成
dateCreated: 2023-08-27T17:42
dateModified: 2023-10-05T01:45
---

## 使用场景

当我们开发了一个 python 库时，希望能够生成一个安装包，使得用户可以快速安装、使用该库。

此帖涉及的安装包是 `.whl`，实质上就是一个 `.zip` 压缩包，里面存储了安装该库所必须的文件，比如 source code, scripts 等。

直接在本地安装 `.whl` 可以 `pip3 install xxx.whl --user`

更常见的方式是将 `.whl` 传到 `PyPI` 上，再让用户通过在线方式 `pip3 install <package_name> --user` 来完成安装。

## Quick Start

![](https://s1.ax1x.com/2023/03/27/ppyFnq1.png)

### 环境配置

```bash
pip3 install setuptools wheel --user --upgrade
```

### setuptools.setup - 安装脚本编写

假设目前有项目 `example_gamma`，在该项目的根路径创建 `setup.py`，树状图：

```
example_gamma
├── example_gamma
│   └── __init__.py
├── requirements.txt
└── setup.py
```

一个简单的 `setup.py`：

```python
from setuptools import setup, find_packages

setup(
    # metadata
    name="example_gamma",
    version="0.0.1",
    description="Example library for python package tutorial.",
    author="wangzhao",
    author_email="wangzhao@megvii.com",
    # options
    packages=find_packages(),  # 自动寻找路径下的所有包
    python_requires=">=3.6",  # 需要的 python 版本限制
    # 读取 requirements.txt 里的所有行，以列表形式呈现
    install_requires=open("requirements.txt").read().splitlines(),
)
```

上述 setup 函数参数定义了该库的名称、版本、简介、作者、作者 email，以及设置了安装依赖、python 依赖。

### [setup.py](http://setup.py/) - 生成 wheel 包

在项目根目录下运行

`python3 setup.py sdist bdist_wheel`

即可在根目录下生成一个名为 `dist` 的路径，进去之后就能发现打好的 whl 包 `example_gamma-0.0.1-py3-none-any.whl` 。

## Further Discussion

### `setuptools` vs `distutils`

`distutils` 是 python 原生库，而 `setuptools` 是第三方库，是 `distutils` 的增强版。官方文档也对 `setuptools` 有所提及。

[https://docs.python.org/zh-cn/3/library/distutils.html](https://docs.python.org/zh-cn/3/library/distutils.html)

### 更多的 setup 参数

[官方文档](https://setuptools.pypa.io/en/latest/deprecated/distutils/apiref.html?highlight=setuptools.setup#distutils.core.setup)也没有完全说明所有参数的意义，需要自己拼凑和寻找。

> This document is being retained solely until the setuptools documentation at https://setuptools.pypa.io/en/latest/setuptools.html independently covers all of the relevant information currently included here.
> 

stackoverflow 上有人把所有参数都找出来列了个表，可以用来参考。

[https://stackoverflow.com/questions/58533084/what-keyword-arguments-does-setuptools-setup-accept](https://stackoverflow.com/questions/58533084/what-keyword-arguments-does-setuptools-setup-accept)

这里挑几个参数进行介绍。示例可见: [https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_beta/setup.py](https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_beta/setup.py)

#### packages

可以用 `setuptools.find_packages` 来指定根目录下哪些模块需要被安装，哪些不需要。

典型用法：

```python
setup(
    ...
    packages=find_packages(
        include=("example*"),  # 想安装 example 开头的所有模块
        exclude=("test", "test*"),  # 不想安装 test 开头的任何模块
    )
    ....
)
```

`exclude` 会冲掉 `include` 的 pattern。

#### scripts

需要被安装的独立脚本列表。

以 `pip3 install xxx --user` 为例，这些脚本会被 copy 到 `~/.local/bin` 下，并添加权限，使得这些脚本可以直接被执行。

比如：`remote_board` 的 `run_joint.py`, `run_neu.py`, ...

#### entry_points

用于自动生成脚本，安装后自动生成 `~/.local/bin` 下的可执行文件（假如通过 `pip3 install xxx --user` 安装）。

`<name> = [<package>.[<subpackage>.]]<module>[:<object>.<object>]`

典型的用法：

```python
setup(
    ...
    entry_points={
        # super_beta 指向 example_beta/__init__.py 的 test 函数
        "console_scripts": ["super_beta = example_beta:test"]
    }
    ...
)
```

#### classifiers

说明包的分类信息，所有支持的列表见 [https://pypi.org/classifiers/](https://pypi.org/classifiers/)

典型的用法\[2\]

```python
setup(
    ...
    classifiers = [
        # 发展时期，常见的如下
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 3 - Alpha',

        # 开发的目标用户
        'Intended Audience :: Developers',

        # 属于什么类型
        'Topic :: Software Development :: Build Tools',

        # 许可证信息
        'License :: OSI Approved :: MIT License',

        # 目标 Python 版本
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ]
    ...
)
```

#### package_data

- 需要额外加进包里的文件，比如文档、静态图片、配置文件等

典型用法：

```python
setup(
    ...
    package_data={
        # `example_beta` 模块中满足 'resources/data/*.dat' 的文件都会被包含在包里
        'example_beta': ['resources/data/*.dat'],
    },
    ...
```

### 更多的 [setup.py](http://setup.py/) 功能

#### sdist / bdist / bdist_egg / bdist_wheel / ...

- **sdist**
    - 生成 `source distribution`，即包括一个所有源代码与额外数据的压缩包，可以在任意平台来重新编译。
- **bdist**
    - 生成 `built distribution`，一般得到在指定平台上的包，安装时无需再重新编译\[8\]。
        - bdist_wheel: *.whl
        - bdist_rpm: *.rpm
        - bdist_wininst: *.exe
        - bdist_egg: *.egg
        - ...

#### install

通过 `python3 setup.py install` 直接在本地安装库，一般使用场景是从源代码 repo 直接安装，或者 pip install 在某些情况下也是帮用户执行了这条指令。

### PyPI & devpi

- **PyPI**
    - Python Package Index
    - python 的正式第三方软件包的存储库
    - ws2 用的是 brainpp 的私有 PyPI
- **devpi**
    - devpi-server: PyPI 服务器
    - devpi-client: 打包/测试/发布工具

### setup.cfg & pyproject.toml

#### Quick Start

`setuptools` 官方文档快速上手目前以该方式为首选：

[https://setuptools.pypa.io/en/latest/userguide/quickstart.html](https://setuptools.pypa.io/en/latest/userguide/quickstart.html)

典型的使用方式：

```
pip3 install build --user  # install `PyPA build`
python3 -m build --wheel   # python3 setup.py bdist_wheel

```

对比：

setup.cfg: [https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_alpha/setup.cfg](https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_alpha/setup.cfg)

[setup.py](http://setup.py/): [https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_beta/setup.py](https://git-pd.megvii-inc.com/tidbit/dev-lecture/-/blob/master/package-python/example_beta/setup.py)

#### 为什么要使用这种方式来进行打包

#### 安装环境隔离

pip 在安装包时大多数使用如下方式：

1. 寻找包
2. 下载、解压包
3. 运行 `python setup.py install` 进行安装

问题是 pip 调用了本机的 `python` 的解释器及本机的各种 `python` 第三方库比如 `setuptools`。一旦某个包用到了 `setuptools` 的最新特性，就必须要用户手动去更新本机的第三方库，有时还会安装其他库的依赖有冲突\[7\]。

此时就需要一个配置文件来隔离“安装包所需要的依赖”和“用户本机上其他第三方库运行时所需的依赖”。这就是 PEP-518\[5\] 标准中提到的 `pyproject.toml` 。

在 PEP-518 标准下，一次包的安装则会在 virtual env 下进行，从而达到安装与运行时依赖隔离的效果。

#### 声明式安装

虽然目前大部分 `setup.py` 都被写成一个声明式的程序，但只要程序员尝试使用命令式的方式来编写脚本，就有可能会导致各种各样的程序 bug 。

所以基于配置的安装方式被 PEP-517\[4\] 标准提出，各种安装框架比如 `setuptools` 就建议使用 `setup.cfg` 来配置各种参数。当然还有比如 `filt` 等其他框架，也支持各种不同的方式。

## References

- \[1\] [https://setuptools.pypa.io/en/latest/userguide/index.html](https://setuptools.pypa.io/en/latest/userguide/index.html)
- \[2\] [https://zhuanlan.zhihu.com/p/276461821](https://zhuanlan.zhihu.com/p/276461821)
- \[3\] [https://www.python.org/dev/peps/pep-0527/](https://www.python.org/dev/peps/pep-0527/)
- \[4\] [https://www.python.org/dev/peps/pep-0517/](https://www.python.org/dev/peps/pep-0517/)
- \[5\] [https://www.python.org/dev/peps/pep-0518/](https://www.python.org/dev/peps/pep-0518/)
- \[6\] [https://python.freelycode.com/contribution/detail/1910](https://python.freelycode.com/contribution/detail/1910)
- \[7\] [https://bernat.tech/posts/pep-517-518/](https://bernat.tech/posts/pep-517-518/)
- \[8\] [https://stackoverflow.com/questions/24008112/python-is-there-a-performance-difference-between-dist-and-sdist](https://stackoverflow.com/questions/24008112/python-is-there-a-performance-difference-between-dist-and-sdist)
