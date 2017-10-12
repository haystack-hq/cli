# Quick Start


==Please visit the [installation](/install/index.md) page if you have not yet installed and created an account.==


## Launch a Stack in Cloud

With HayStack, you may launch a stack from source code or from haystackhub.com. You may also choose to launch a stack locally or in the cloud.

To see it work, we will launch a simple hello world stack on our cloud:

```
$ cd ~/
$ hs start haystack/hello-world
```

When you run the init and pass in a stack hosted on haystackhub (haystack/hello-world), your stack will be launched in the cloud environment.


```
Launching stack...
Your stack is ready!

Identifier: hello-world
Endpoints: 
  hello-world.haystackhub.com
Mounts:
  ./hello-world =$ /var/www/html
Launch Instructions
	Visit https://hello-world.haystackhub.com
```

There is also a mount created on your local dev machine that is syncd to the remote services.

You can view and modify the code:

```
$ cd ./hello-world
$ ls

index.html
```

Modify the HTML then refresh the enpoint to see your changes.

---

## Remove a Stack

You may remove a stack that you have locally by navigating to that directory and issuing the **remove** command.


```
$ cd ~/hello-world
$ hs remove 

Removing stack hello-world ...
Stack removed!
```

*Note: the code syncd from the stack will remain in the directory until you delete it.*




---

Visit our [CLI docs](../guides/index.md) for more information on each command.



