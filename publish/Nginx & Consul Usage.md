---
title: Nginx & Consul Usage
dateCreated: 2023-03-24T22:29
---

## 介绍

本文介绍了如何使用 Nginx & Consul，涉及到的方面不是很全面，只介绍了其中一部分使用方式。

### Nginx

Nginx 是一种 Web 服务器软件，它可以处理客户端请求并将其转发到后端服务。它还可以充当反向代理，将请求路由到不同的服务上。Nginx 通常用于构建高性能、高可扩展性的 Web 应用程序和 API。

### Consul

Consul 是一个服务发现和配置工具，用于管理分布式应用程序和服务。它提供了一个可靠的方式来发现和注册服务，并允许服务之间进行通信。Consul 还提供了一个 Web UI，用于查看当前注册的服务和健康状况。

## Docker 镜像准备

下载 Consul 的二进制文件：[https://developer.hashicorp.com/consul/downloads](https://developer.hashicorp.com/consul/downloads)，得到 `consul` 和 `consul-template`。

编写 `entrypoint.sh`：

```bash
#!/bin/sh

# 启动 Nginx 服务器
nginx

# 启动 Consul agent 服务器
# -server: 设置 Consul 服务器而不是客户端
# -bootstrap-expect: 开始启动集群之前期望的服务器数量
# -data-dir: 存储 Consul 数据的目录
# -bind: 绑定的 IP 地址
# -client: 绑定客户端接口的 IP 地址
# -ui: 启用 Web UI
consul agent -server -bootstrap-expect 1 -data-dir /consul -bind 0.0.0.0 -client 0.0.0.0 -ui &

# 启动 consul-template，当服务配置发生更改时重新加载 Nginx
# -consul-addr: 要使用的 Consul agent 的地址
# -template: 指定模板的源和目标文件
# : 指定模板更改时要运行的命令
consul-template -consul-addr 127.0.0.1:8500 -template /root/consul.template:/etc/nginx/conf.d/service.conf:"nginx -s reload"
```

编写 `Dockerfile`：

```docker
# 本 Dockerfile 设置 nginx-consul
# 它会复制必要的文件并运行入口脚本
# 入口脚本启动 nginx、Consul agent 和 consul-template
# 它还指定了 consul-template 命令，以便在服务配置更改时重新加载 nginx
# 请注意，此 Dockerfile 基于 nginx:stable-alpine

FROM nginx:stable-alpine

USER root

# 将 consul 和 consul-template 二进制文件复制到容器中
COPY consul /usr/bin
COPY consul-template /usr/bin

# 将 entrypoint.sh 复制到容器中
COPY entrypoint.sh /root/

# 为 Consul 数据创建目录
RUN mkdir /consul

# 将工作目录设置为 /templates
WORKDIR /templates

# 指定容器启动时要运行的入口脚本
ENTRYPOINT ["/root/entrypoint.sh"]
```

构建镜像：`docker build -f Dockerfile . -t nginx-consul`

## Consul 模板

Consul Template 是一个开源工具，用于在 Consul 中定义的键值对更改时自动更新应用程序配置文件。它允许您使用一组简单的模板语言来生成配置文件，并使用 Consul 的服务发现功能以及 Consul 配置更改通知机制来自动更新它们。这使得在使用 Consul 时更容易自动化应用程序配置管理。

下面是一个样例模板文件，名为`consul.tmpl`: 

```
{{range services}} {{$name := .Name}} {{$service := service .Name}}
upstream {{$name}} {
  zone upstream-{{$name}} 64k;
  {{range $service}}server {{.Address}}:{{.Port}} max_fails=3 fail_timeout=60 weight=1;
  {{else}}server 127.0.0.1:65535; # force a 502{{end}}
} {{end}}

server {
  listen 80 default_server;

  location / {
    root /usr/share/nginx/html/;
    index index.html;
  }

  location /stub_status {
    stub_status;
  }

{{range services}} {{$name := .Name}}
  location /{{$name}} {
    proxy_pass http://{{$name}};
  }
{{end}}
}
```

上述模板文件用于生成 Nginx 的配置文件。在 `upstream` 部分，它定义了从 Consul 中发现的服务的列表，并将它们作为一组后端服务器添加到 Nginx 的 `upstream` 块中。每个服务都有一个唯一的名字，在模板中使用 `{{$name := .Name}}` 定义。然后，使用 `service .Name` 获取该服务的详细信息，例如地址和端口号。对于每个服务，都会创建一个 `server` 行，其中包括该服务的地址和端口号。如果 Consul 中没有找到该服务，则会添加一个带有 502 错误的服务器行，例如：`server 127.0.0.1:65535; # force a 502`。

## 运行 Consul

在名为 consul-hostname 的机器上，运行如下指令：

```bash
docker run --rm --name consul \
	-p 19000:80 \  # nginx
	-p 19001:8500 \  # consul
	--volume $PWD/consul.tmpl:/root/consul.template \
	-v $PWD/data:/consul \
	nginx-consul
```

在运行完上述指令后，能够在 `http://localhost:19000` 上访问 Nginx。还可以在 `http://localhost:19001` 上访问 Consul 的 Web UI，以查看当前注册的服务和健康状况。

## 注册服务

假设我们使用 Python+FastAPI 实现了一个简单的 HTTP 服务，并在 `server-hostname` 的 7000 端口上运行。

```python
from fastapi import FastAPI

app = FastAPI()

# 简单的 HTTP 服务
@app.get("/simple_http")
def simple_http():
    return {"message": f"Hello from {app}"}

# 健康检查服务
@app.get("/health")
def health():
    return {"status": "ok"}
```

运行如下指令可以将该服务注册到 Consul 上：

```bash
curl \
	--request PUT \
	--data @register.json \
  http://<consul-hostname>:19001/v1/agent/service/register
```

其中`register.json` :

```json
{
    "Name": "simple_http",
    "ID": "simple-1",
    "Address": "<serve-hostname>",
    "Port": 7000
}
```

运行如下指令可以将该服务的健康检查注册到 Consul 上：

```bash
curl \
  --request PUT \
  --data @health.json \
  http://<consul>:19001/v1/agent/check/register
```

其中`health.json` :

```json
{
    "Name": "health check simple1",
    "ID": "check:simple1",
    "Interval": "5s",
    "HTTP": "http://<serve-hostname>:7000/health",
    "ServiceID": "simple-1",
    "DeregisterCriticalServiceAfter": "1m"
}
```

`health.json` 文件中的设置表示健康检查的详细信息。以下是各个字段的含义：

- `Name`: 健康检查的名称，用于标识检查的目的。
- `ID`: 健康检查的 ID，必须是唯一的。
- `Interval`: 指定 Consul 运行健康检查的时间间隔。在这个例子中，健康检查每 5 秒运行一次。
- `HTTP`: 指定要进行健康检查的 HTTP 端点。在这个例子中，检查 `/health` 端点。
- `ServiceID`: 指定要检查的服务的 ID。在这个例子中，它是 `simple-1`，与注册服务的 ID 相同。
- `DeregisterCriticalServiceAfter`: 指定 Consul 在服务停止响应多少时间后将其从注册表中注销。在这个例子中，Consul 将在服务停止响应 1 分钟后注销。

## 总结

本文介绍了如何使用 Nginx 和 Consul 管理分布式应用程序和服务。

使用 Nginx，我们可以处理客户端请求并将其转发到后端服务。Consul 则为我们提供了可靠的方式来发现和注册服务。

使用 Consul Template，我们可以自动更新应用程序配置文件，从而更好地管理整个系统。

通过本文介绍的实例，我们可以将一个简单的 HTTP 服务注册到 Consul 上，以实现更好的管理分布式应用程序和服务。

总的来说，使用 Nginx 和 Consul 可以提高分布式系统的可靠性和可维护性，使系统更加健壮和高效。
