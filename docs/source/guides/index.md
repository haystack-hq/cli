# Commands

## haystack

To list available commands, run `haystack` or `hs` without options:


```sh
$ hs

  Usage: hs [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    info [options]                   Information about stack
    list|ls                          List active stacks
    logs [options] <service>         Information about stack
    mount [options] [services...]    Create a filesystem mount to the stack services.
    ssh [options] <service>          SSH into a service in the stack
    start [options]                  Launch a stack
    stop [options]                   Stop a stack
    terminate|rm [options]           Terminate a stack
    unmount [options] [services...]  Unmount a filesystem mount to the stack services.
```


Depending on your system configuration, you may be required to preface each `haystack` command with `sudo`. To avoid having to use `sudo` with the `haystack` command, your system administrator can create a Unix group called `haystack` and add users to it. 


## start

Launch a stack on your local dev box.


```sh
$ hs start --help

  Usage: start [options]

  Launch a stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -x, --exclude-mount      no file system mounts to the stack will be created
    -h, --help               output usage information
```


## list

List all your running stacks. 


```sh
$ hs ls --help

  Usage: list|ls

  List active stacks


  Options:

    -h, --help  output usage information
```


## info

```sh
$ hs info --help

  Usage: info [options]

  Information about the stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -h, --help               output usage information
```


## ssh

SSH into one of the nodes within the stack.

```sh
$ hs ssh --help

  Usage: ssh [options] <service>

  SSH into a service in the stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -h, --help               output usage information

```


## logs

Display logs for a stack service

```sh
$ hs logs --help

  Usage: logs [options] <service>

  Display logs for stack service


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -h, --help               output usage information

```


## terminate

Terminate a stack

```sh
$ hs terminate --help

  Usage: terminate|rm [options]

  Terminate a stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -h, --help               output usage information

```


## mount 

Create a local filesystem mount to a stack

```sh
$ hs mount --help

  Usage: mount [options] [services...]

  Create a filesystem mount to the stack services.


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -d, --directory <path>   relative or full path to directory to mount to on the local machine
    -h, --help               output usage information

```


## unmount

Remove a local file system mount from a stack

```sh
$ hs unmount --help

  Usage: unmount [options] [services...]

  Unmount a filesystem mount to the stack services.


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current project folder will be used
    -h, --help               output usage information

```


## mount ls

List your current mounts

```
$ hs mount ls

Usage: mount ls [options] 

  List your current active mounts. By default will list the mounts of the stack in the current 
  directory. Or you may provide a specific stack identifer.


  Options:
    -a, --all 
    -i, --identifier [value]	Show just the mounts for a specific stack 
    -h, --help 					Print usage information

```



Visit our [Quick Start Guide](../quickstart/index.md) to launch your first stack.

