# Commands

## haystack

To list available commands, either run ==haystack== or ==hs== with no parameters or execute ==haystack help==:


```
$ haystack

Usage: haystack or hs [options] [command]\

  Options:

    -h, --help  	Print usage information
    -w, --web-help	Launch the online help documentation and tutorials		
    -v, --version 	Print version information

  Commands:

    signup [options]   				Signup to HayStack
    login [options]    				Login to your HayStack account
    config [options]				Update your account configuration
   	stack [command] [options]		Start, manage and stop stacks
   	mount [command] [options]		Manage local filesystem mounts to your stacks
```


Depending on your system configuration, you may be required to preface each ==haystack== command with ==sudo==. To avoid having to use ==sudo== with the ==haystack== command, your system administrator can create a Unix group called ==haystack== and add users to it. 


---

## signup

To begin using HayStack, use the signup command. This will create your account and send you an activation code via email. 


```
$ hs signup

Usage: signup [options]

  Create a HayStack account. 


  Options:

    -e, --email  [value]     	Email
    -u, --username  [value]     Username
    -p, --password  [value]  	Password
    -h, --help              	Print usage information
```


---

## login

Login to your HayStack account. 


```
$ hs login

Usage: login [options]

  Login to your HayStack account. 


  Options:

    -e, --email  [value]     	Email address
    -p, --password  [value]  	Password
    -h, --help              	Print usage information
```


---

## config

Manage your HayStack settings. From here you can set your preferences, change your password, setup your cloud credentials, etc.

```
$ hs config

Usage: config [options]

  Configure your HayStack account. 


  Options:
    -h, --help              Print usage information

```


---

## stack start

Launch a stack in the cloud or on your local dev box.


```
$ hs start --help

  Usage: start [options]

  Launch a stack


  Options:

    -i, --identifier <name>  name of your stack. If omitted, the folder name will be used
    -x, --exclude-mount      no file system mounts to the stack will be created
    -h, --help               output usage information
```


---

## list

List all your running stacks. 


```
$ hs list --help

  Usage: list|ls

  List active stacks


  Options:

    -h, --help  output usage information
```

---

## info

```
$ hs info --help

  Usage: info [options]

  Information about stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current folder will be used
    -h, --help               output usage information
```

## stack ssh

---

SSH into one of the nodes within the stack.

```
$ hs stack ssh

Usage: stack ssh [options] 

  Open an SSH terminal into one of the stack nodes. Omitt -n to choose node from list.


  Options:
    -n, --node 					The identifier of the node you are sshing into
    -i, --identifier [value]	The stack identifier. If omitted the stack in the current directory will be used
    -h, --help 					Print usage information

```

---

## stack nodes

List the nodes in your stack

```
$ hs stack nodes

Usage: stack nodes [options] 

  List all the nodes in the stack


  Options:
    -i, --identifier [value]	The stack identifier. If omitted the stack in the current directory will be used
    -h, --help 					Print usage information

```

---

## stack log

```
$ hs stack log

Usage: log [options] 

  Fetch the stack launch logs or the node logs. Omitt -n to choose node from list.


  Options:
    -n, --node 					The identifier of the node to fetch the logs from
    -i, --identifier [value]	The stack identifier. If omitted the stack in the current directory will be used
    -h, --help 					Print usage information

```

---

## terminate


```
$ hs terminate --help

  Usage: terminate|rm [options]

  Terminate a stack


  Options:

    -i, --identifier <name>  name of stack. If omitted, the stack from the current folder will be used
    -h, --help               output usage information

```


---

## mount 

Create a local filesystem mount to a stack

```
$ hs mount 

Usage: mount [options] 

  Create a fileshystem mount to the stack nodes.


  Options:
    -d, --directory				Speicify the root directory of the mount (default is current directory)			
    -i, --identifier [value]	Create a mount for a specific stack
    -h, --help 					Print usage information

```

---

## mount rm

Remove a local file system mount from a stack

```
$ hs mount rm 

Usage: mount rm [options] 

  Remove a mount
  Note: removing a mount will leave the contents on the local file system.


  Options:			
    -i, --identifier [value]	Show just the mounts for a specific stack 
    -h, --help 					Print usage information

```

---

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

