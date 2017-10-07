# Installation

The HayStack CLI is installed through the npm package manager.

**Confirm you have npm package manager installed**

```sh
> npm -v
3.10.10
```

*If npm is not installed, please follow the [npm installation instructions](https://www.npmjs.com/get-npm)*

** Install the HayStack CLI **

```sh
> npm install haystackhub.cli
```

** Confirm the CLI is installed **

```sh
> hs -v
Version: 0.0.1
```


---


# Create Account

Create your free HayStack account.

```sh
> hs signup
username: yourusername

email: youremail@provider.com
password: *******
repeat-password: ******

confirmation code: (sent via email)
Thanks for signing up to HayStack! You are ready to launch your first stack!
```

---

# Launch Stack in Cloud

With HayStack, you may launch a stack from source code or from haystackhub.com. You may also choose to launch a stack locally or in the cloud.

To see it work, we will launch a simple hello world stack on our cloud:

```sh
> cd ~/
> hs start haystack/hello-world
```

When you run the init and pass in a stack hosted on haystackhub (haystack/hello-world), your stack will be launched in the cloud environment.


```sh
Launching stack...
Your stack is ready!

Identifier: yourusername-hello-world
Endpoints: 
  yourusername-hello-world.haystackhub.com
Mounts:
  ./yourusername-hello-world => /var/www/html
Launch Instructions
	Visit https://yourusername-hello-world.haystackhub.com
```

There is also a mount created on your local dev machine that is syncd to the remote services.

You can view and modify the code:

```sh
> cd ./yourusername-hello-world
> ls
index.html
```

Modify the HTML then refresh the enpoint to see your changes.

---

# Remove Stack

You may remove a stack that you have locally by navigating to that directory and issuing the **remove** command.

```sh
> cd ~/yourusername-hello-world
> hs remove 
Removing stack yourusername-hello-world ...
Stack removed!
```

*Note: the code syncd from the stack will remain in the directory until you delete it.*


