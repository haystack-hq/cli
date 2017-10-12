# HayStack CLI
A command line interface do build and deploy haystacks.

## Contributing Requirements
* Create supporting docs at /docs
..* Add change history to the /docs/release-notes.md file
* Add Gherkin stories for Behavior Driven Development at /tests
* 100% code test coverage


---

## Setup your development environment

### project setup

```sh
$ sh scripts/setup.sh
```


### Pointing your develoment directory to run within the $hs command
You may have an existing installation of HayStack CLI. In this case you will want to point the cli pointer to this development directory instead of the default.

TODO



### Changing the default API endpoint
By default the HayStack CLI points to api.haystackhub.com.  You can update the cli endpoint with an environment variable.

```sh
$ export HAYSTACK_CLI_API_ENDPOINT="example-haystack-api.localhost"
```

To switch back to the default

```sh
$ unset HAYSTACK_CLI_API_ENDPOINT
```

### Switching to Debug Mode
Debug mode has three options:

* off (Default) (No debug output) 
* log (Debugging is output to a logfile)
* inline (Debugging information is displayed in the console)

To turn debug mode on:

```sh
$ export HAYSTACK_CLI_DEBUG_MODE="log"
```


To turn debug mode off:

```sh
$ export HAYSTACK_CLI_DEBUG_MODE="off"

//or

$ unset HAYSTACK_CLI_DEBUG_MODE
```

## Contributing to the /docs
All docs are written in simple markdown language. We use a doc publishing tool called [mkdocs](http://www.mkdocs.org/). It allows us to make nice looking documents with a menu from markdown.

### Installing mkdocs locally

*Note: running setup.sh as described in setting up your development environment should have installed mkdocs already.*

Follow the directions here to [install mkdocs](http://www.mkdocs.org/#installation) on your local machine.

### Copiling and previewing the docs

Start the docs compiler. 

```sh
$ cd docs
$ mkdocs serve
```

mkdocs supports realtime updates, so changing your docs should update the help docs automatically.


### publishing the docs to S3

Note: [aws cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) needs to be installed and configured. 

```
$ sh scripts/docs-publish.sh
```


# References

Markdown preview tool for sublime allows you to preview the markdown in realtime. 

* https://packagecontrol.io/packages/Markdown%20Preview

Examples and references for markdown witnh material theme

* http://squidfunk.github.io/mkdocs-material/



