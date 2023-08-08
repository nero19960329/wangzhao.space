---
title: Building a FastAPI Application with Prometheus Metrics
dateCreated: 2023-04-03T14:52
dateModified: 2023-08-09T02:09
---

## Introduction

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints. It is designed to be easy to use, fast to develop with, and fast to run. Prometheus is a popular open-source monitoring system that collects metrics from various sources and stores them in a time-series database. It is used to monitor and alert on system metrics, application metrics, and business metrics.

## Requirements

Before we start, make sure that you have the following requirements installed:

- Python 3.7+
- FastAPI
- Prometheus Client
- Uvicorn

You can install these packages using pip:

```bash
pip install fastapi prometheus_client uvicorn
```

## Creating a FastAPI Application

We will start by creating a new FastAPI application. Create a new Python file called `app.py` and add the following code:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

```

This creates a new FastAPI application with a single endpoint `/` that returns a JSON response with the message `"Hello World"`.

To run the application, you can use the `uvicorn` server:

```bash
uvicorn app:app --reload
```

This will start the server on `http://localhost:8000`.

## Adding Prometheus Metrics

Now, let's add Prometheus metrics to the application. We will use the `prometheus_client` library to create and expose metrics.

First, let's create a new endpoint `/metrics` that will return the Prometheus metrics. Update `app.py` with the following code:

```python
from fastapi import FastAPI
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()

REQUESTS = Counter('requests_total', 'Total HTTP requests.')

@app.get("/")
async def root():
    REQUESTS.inc()
    return {"message": "Hello World"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

We have created a new counter `REQUESTS` that will keep track of the total number of HTTP requests. Every time the `/` endpoint is called, we increment the counter using `REQUESTS.inc()`.

We have also added a new endpoint `/metrics` that returns the Prometheus metrics. We use the `generate_latest()` function to generate the metrics in the Prometheus exposition format.

To run the application with the metrics endpoint, you can use the following command:

```bash
uvicorn app:app --reload --workers 1 --host 0.0.0.0 --port 8000
```

This will start the server on `http://localhost:8000` with a single worker.

## Adding Prometheus Histograms

In addition to counters, we can also use histograms to measure the latency of our requests. A histogram measures the distribution of values over a set of buckets. We will use the `Histogram` class from the `prometheus_client` library to create histograms.

Update `app.py` with the following code:

```python
from fastapi import FastAPI, Response, Request
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST, CollectorRegistry
import time

app = FastAPI()
registry = CollectorRegistry()

REQUESTS = Counter('requests_total', 'Total HTTP requests.', registry=registry)
EXCEPTIONS = Counter('exceptions_total', 'Total HTTP exceptions.')
LATENCY = Histogram('latency_seconds', 'HTTP request latency (seconds).')

@app.get("/")
async def root():
    REQUESTS.inc()
    return {"message": "Hello World"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(registry=registry), media_type=CONTENT_TYPE_LATEST)

@app.exception_handler(Exception)
async def exceptions_handler(request, exc):
    EXCEPTIONS.inc()
    raise exc

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    LATENCY.observe(process_time)
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

We have defined a new histogram `LATENCY` that will measure the HTTP request latency in seconds. We use the `Histogram` class to define the histogram and specify the buckets that we want to use. We have also defined a new counter `EXCEPTIONS` that will keep track of the total number of HTTP exceptions.

We have also defined a new middleware function `add_process_time_header` that will measure the HTTP request latency and add the `X-Process-Time` header to the response.

## Using CollectorRegistry

In the code above, we used `registry` variable to create our Prometheus counters and histograms.

```python
registry = CollectorRegistry()
```

The `CollectorRegistry` is a container for all the metrics that you want to expose to Prometheus. It provides a way to register metric collectors and expose them as a single endpoint using the `/metrics` endpoint.

When you create a new metric, you can specify the registry that you want to use. By default, the `prometheus_client` library uses the global registry, but you can create your own registry and use it to isolate your metrics.

In the example above, we created a new registry and passed it to the `Counter` and `Histogram` constructors:

```python
REQUESTS = Counter('requests_total', 'Total HTTP requests.', registry=registry)
LATENCY = Histogram('latency_seconds', 'HTTP request latency (seconds).')
```

We also passed the registry to the `generate_latest` function when returning the metrics:

```python
return Response(generate_latest(registry=registry), media_type=CONTENT_TYPE_LATEST)
```

This ensures that only the metrics that we defined using this registry are returned.

## Conclusion

In this tutorial, we have learned how to build a FastAPI application with Prometheus metrics. We have added counters to measure the total number of HTTP requests and histograms to measure the HTTP request latency. Prometheus metrics can be used to monitor and alert on system metrics, application metrics, and business metrics.

---

## 介绍

FastAPI 是一个现代化、高效的 Web 框架，用于基于 Python 3.7+ 构建 API，基于标准 Python 类型提示。它被设计成易于使用、开发快速、运行快速。Prometheus 是一个流行的开源监控系统，它从各种来源收集指标并将它们存储在时间序列数据库中。它用于监视和警报系统指标、应用程序指标和业务指标。

## 要求

在开始之前，请确保已安装以下要求：

- Python 3.7+
- FastAPI
- Prometheus 客户端
- Uvicorn

您可以使用 pip 安装这些软件包：

```
pip install fastapi prometheus_client uvicorn

```

## 创建 FastAPI 应用程序

我们将从创建一个新的 FastAPI 应用程序开始。创建一个名为 `app.py` 的新 Python 文件，并添加以下代码：

```
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

```

这将创建一个具有单个端点 `/` 的新 FastAPI 应用程序，该端点返回一个带有消息 `"Hello World"` 的 JSON 响应。

要运行应用程序，您可以使用 `uvicorn` 服务器：

```
uvicorn app:app --reload

```

这将在 `http://localhost:8000` 上启动服务器。

## 添加 Prometheus 指标

现在，让我们为应用程序添加 Prometheus 指标。我们将使用 `prometheus_client` 库来创建和公开指标。

首先，让我们创建一个新的端点 `/metrics`，该端点将返回 Prometheus 指标。使用以下代码更新 `app.py`：

```
from fastapi import FastAPI
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()

REQUESTS = Counter('requests_total', 'Total HTTP requests.')

@app.get("/")
async def root():
    REQUESTS.inc()
    return {"message": "Hello World"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

```

我们创建了一个名为 `REQUESTS` 的新计数器，该计数器将跟踪 HTTP 请求的总数。每次调用 `/` 端点时，我们使用 `REQUESTS.inc()` 增加计数器。

我们还添加了一个新的端点 `/metrics`，该端点返回 Prometheus 指标。我们使用 `generate_latest()` 函数以 Prometheus 暴露格式生成指标。

要使用带有指标端点的应用程序运行，可以使用以下命令：

```
uvicorn app:app --reload --workers 1 --host 0.0.0.0 --port 8000

```

这将在 `http://localhost:8000` 上启动服务器，并使用单个 worker。

## 添加 Prometheus 直方图

除了计数器之外，我们还可以使用直方图来测量请求的延迟。直方图测量值在一组存储桶上的分布。我们将使用 `prometheus_client` 库中的 `Histogram` 类来创建直方图。

使用以下代码更新 `app.py`：

```
from fastapi import FastAPI, Response, Request
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST, CollectorRegistry
import time

app = FastAPI()
registry = CollectorRegistry()

REQUESTS = Counter('requests_total', 'Total HTTP requests.', registry=registry)
EXCEPTIONS = Counter('exceptions_total', 'Total HTTP exceptions.')
LATENCY = Histogram('latency_seconds', 'HTTP request latency (seconds).')

@app.get("/")
async def root():
    REQUESTS.inc()
    return {"message": "Hello World"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(registry=registry), media_type=CONTENT_TYPE_LATEST)

@app.exception_handler(Exception)
async def exceptions_handler(request, exc):
    EXCEPTIONS.inc()
    raise exc

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    LATENCY.observe(process_time)
    response.headers["X-Process-Time"] = str(process_time)
    return response

```

我们定义了一个名为 `LATENCY` 的新直方图，该直方图将以秒为单位测量 HTTP 请求延迟。我们使用 `Histogram` 类来定义直方图并指定要使用的桶。我们还定义了一个新计数器 `EXCEPTIONS`，该计数器将跟踪 HTTP 异常的总数。

我们还定义了一个新的中间件函数 `add_process_time_header`，该函数将测量 HTTP 请求延迟并将 `X-Process-Time` 标头添加到响应中。

## 使用 CollectorRegistry

在上面的代码中，我们使用 `registry` 变量来创建我们的 Prometheus 计数器和直方图。

```
registry = CollectorRegistry()

```

`CollectorRegistry` 是用于容纳要公开给 Prometheus 的所有指标的容器。它提供了一种注册度量收集器并使用 `/metrics` 端点将它们公开为单个端点的方法。

当您创建新指标时，可以指定要使用的注册表。默认情况下，`prometheus_client` 库使用全局注册表，但是您可以创建自己的注册表并使用它来隔离指标。

在上面的示例中，我们创建了一个新的注册表并将其传递给 `Counter` 和 `Histogram` 构造函数：

```
REQUESTS = Counter('requests_total', 'Total HTTP requests.', registry=registry)
LATENCY = Histogram('latency_seconds', 'HTTP request latency (seconds).')

```

我们还在返回指标时将注册表传递给 `generate_latest` 函数：

```
return Response(generate_latest(registry=registry), media_type=CONTENT_TYPE_LATEST)

```

这确保我们只返回使用此注册表定义的指标。

## 结论

在本教程中，我们学习了如何构建带有 Prometheus 指标的 FastAPI 应用程序。我们添加了计数器以测量 HTTP 请求的总数，并添加了直方图以测量 HTTP 请求的延迟。Prometheus 指标可用于监视和警报系统指标、应用程序指标和业务指标。
