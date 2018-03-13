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
$ hs stack start

Usage: $ stack start [options]

  Launch a stack


  Options:
    -b, --background				Start stack in the background instead of holding up your terminal
    -i, --identifier [value]		Name of your stack. If omitted a name will be created 
    -l, --local						Start the stack on your local machine not in the cloud
    								Defaults can be changed in preferences
    -c, --cloud-provider			The cloud provider to use. If omitted your default cloud provider will be used
    -x, --exclude-mount				No file system mounts to the stack will be created		
    -p, --package					Specifiy a HayStack package on GitHub
    -h, --help              		Print usage information


```


---

## stack list

List all your running stacks. 


```
$ hs stack list

Usage: list|ls [options]

  List active stacks


  Options:

    -h, --help  output usage information
```

---

## stack ssh

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

## stack remove


```
$ hs stack remove

Usage: log [options] or rm [options]

  Stop and remove a stack. 

  Note: This can not be undone. No files from your mounts will be removed, you will need to remove them manually.


  Options:
    -i, --identifier [value]	The stack identifier. If omitted the stack in the current directory will be used
    -h, --help 					Print usage information

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

