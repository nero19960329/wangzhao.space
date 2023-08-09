---
dateCreated: 2023-08-09T13:57
dateModified: 2023-08-09T13:58
---

When using Supervisord to manage your application's processes, you may encounter issues with colored logs not being correctly displayed in the `stderr_logfile`. One possible solution is to use the `unbuffer` command, which disables buffering and allows color escape sequences to be printed to the log files.

To use `unbuffer` with Supervisord, modify your `supervisord.conf` file to include the following:

```
[program:my_program]
...
command=unbuffer python my_program.py
stdout_logfile=/var/log/my_program.log
stderr_logfile=/var/log/my_program_err.log
```

This will start your program through the `unbuffer` command, which will disable buffering and allow color escape sequences to be printed to the `stderr_logfile`.

Please note that `unbuffer` is part of the `expect` package, so you may need to install it on your system if it's not already available. On Debian-based systems (including Ubuntu), you can install `expect` by running the following command:

```
sudo apt-get install expect
```

### Enabling Color Output with `watch`

If you're using the `watch` command to monitor your log files, you may notice that the color disappears when using the command. This is because `watch` does not recognize color escape sequences by default.

To enable color output while using the `watch` command, you can use the `-c` or `--color` option. For example:

```
watch -n 1 --color "tail -n xx /var/log/xxx.log"
```

This will tell `watch` to enable color output and pass the colored output to the terminal.

We hope this solution helps you enable colored logs in your Supervisord-managed applications!

---

使用 `Supervisord` 管理应用程序时，彩色日志可能未能正确显示在 `stderr_logfile` 中。使用 `unbuffer` 命令可以解决这个问题，具体操作如下：

- 修改 `supervisord.conf` 文件，添加以下内容：
    
    ```
    [program:my_program]
    ...
    command=unbuffer python my_program.py
    stdout_logfile=/var/log/my_program.log
    stderr_logfile=/var/log/my_program_err.log
    ```
    
- 如果系统上没有安装 `expect` 软件包，需要先安装，可以使用以下命令：
    
    ```
    sudo apt-get install expect
    ```
    

如果你使用 `watch` 命令来监视日志文件，可以使用 `-c` 或 `--color` 选项启用彩色输出：

```
watch -n 1 --color "tail -n xx /var/log/xxx.log"
```

希望这篇文章可以帮助你解决彩色日志的问题！
