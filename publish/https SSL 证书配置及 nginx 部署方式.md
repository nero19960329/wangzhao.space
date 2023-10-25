---
dateCreated: 2023-10-16T15:10:00
---
## 原理
### HTTPS
HTTPS（Hypertext Transfer Protocol Secure）是基于传输层安全协议（TLS）的HTTP协议的安全版本。它通过使用 SSL/TLS 协议对HTTP的通信进行加密，确保数据在传输过程中的安全性和完整性。与 HTTP 相比，HTTPS 提供了更高的安全性，可以有效地防止中间人攻击、窃听、数据篡改和其他安全威胁。
### SSL/TLS
SSL（Secure Sockets Layer）和TLS（Transport Layer Security）是加密协议，用于确保通信安全并保护数据在互联网上的传输。SSL 是 TLS 的前身，随着时间的推移，TLS 逐渐取代了 SSL 成为更安全和可靠的加密协议。它们使用了公钥加密和对称加密技术来建立安全的通信通道，并确保数据在传输过程中不会被窃听或篡改。
### 证书
在 SSL/TLS 通信中，证书用于验证通信双方的身份，并确保数据的安全性。SSL证书包含了服务器的公钥和一些基本信息，由证书颁发机构（CA）签名，用于确认服务器身份的真实性。客户端可以使用这些证书验证服务器的身份，并确保通信的安全性。证书通常包含服务器的域名、组织信息、签发机构信息以及有效期等。
## SSL 证书获取方式
### localhost 证书
要为 localhost 生成 SSL 证书，可以使用 Certbot 的自签名证书功能。但是需要注意的是，Certbot 通常用于在公共域名上生成有效的 SSL 证书。如果你只是想在本地开发环境中使用 SSL，你可以考虑使用自签名证书。以下是一个使用 OpenSSL 生成自签名证书的示例：

1. 首先，确保你的系统上已经安装了 OpenSSL。

2. 打开终端并导航到你希望保存证书的目录。

3. 运行以下命令以生成私钥：

```bash
openssl genrsa -out localhost.key 2048
```

4. 然后，使用以下命令生成证书签名请求（CSR）：

```bash
openssl req -new -key localhost.key -out localhost.csr
```

在这个过程中，你会被要求提供一些信息，包括国家、地区、组织名称等。你可以根据需要自行填写。

5. 最后，使用以下命令生成自签名证书：

```bash
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt
```

这将生成一个有效期为 365 天的自签名证书。

完成这些步骤后，你可以将生成的 `localhost.crt` 和 `localhost.key` 文件用作你的 localhost SSL 证书。

请注意，由于这是一个自签名证书，你的浏览器可能会警告你该证书不受信任。在生产环境中，你应该使用受信任的证书颁发机构（CA）签名的证书。

### Let's Encrypt 介绍
Let's Encrypt是一个由非营利组织提供的免费、自动化的证书颁发服务，旨在使网站加密变得简单易行。它提供了简单的工具和 API，使网站管理员能够轻松地获取免费的 SSL 证书，从而为其网站启用 HTTPS 连接。Let's Encrypt证书的有效期为90天，但可以通过自动续订进行更新。

下面是在 docker 运行 nginx 支持 https 的方式：

1. **安装 certbot 工具：** 首先，你需要在你的服务器上安装 certbot 工具，它是与 Let's Encrypt 一起使用的官方工具。你可以通过以下命令来安装：

   ```shell
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. 上 cloudflare 或者你托管域的网站上更新 DNS 设置。

3. **获取证书：** 一旦安装了 certbot，你可以运行以下命令来获取证书：

   ```shell
   sudo certbot certonly --standalone -d <domain>
   ```

   这将启动一个临时的 web 服务器，用于与 Let's Encrypt 进行验证并获取证书。

3. **证书文件位置：** 证书和私钥文件将会被存储在 certbot 默认的路径中，你可以根据你的需求将其拷贝到适当的位置。在一般情况下，证书文件通常会位于 `/etc/letsencrypt/live/<domain>/`。

4. **配置 Nginx：** 你需要修改你的 `nginx.conf` 文件以使用 SSL 证书，并将所有的 HTTP 请求重定向到 HTTPS。你需要添加类似下面的配置：

   ```
   server {
       listen 443 ssl;
       server_name <domain>;

       ssl_certificate /etc/letsencrypt/live/<domain>fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;

       location / {
           proxy_pass <proxy_pass>;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   请确保 Nginx 可以访问证书文件的路径。

5. **启动 Nginx 容器：** 最后，你需要启动 Nginx 容器以使新的配置生效：

   ```
   sudo docker run --name mynginx -v /etc/letsencrypt:/etc/letsencrypt -v ./nginx.conf:/etc/nginx/nginx.conf:ro -p 80:80 -p 443:443 -d --network=host nginx
   ```

这些步骤将帮助你在使用 Docker 运行的 Nginx 服务器上配置 Let's Encrypt 的 SSL 证书。通过这些步骤，你应该能够启用 HTTPS 并保护你的网站的安全性。
