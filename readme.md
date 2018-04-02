# Haystack CLI
A command line interface to build and deploy haystacks.

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

### Pointing your development directory to run within the `hs` command
You may have an existing installation of Haystack CLI. In this case you will want to create a symlink to this development directory instead of the default.

```
ln -s /path/to/haystack-cli/src/index.js /usr/local/bin/hs
```

## Contributing to the /docs
All docs are written in simple markdown language. We use a doc publishing tool called [mkdocs](http://www.mkdocs.org/). It allows us to make nice looking documents with a menu from markdown.

### Installing mkdocs locally

*Note: running setup.sh as described in setting up your development environment should have installed mkdocs already.*

Follow the directions here to [install mkdocs](http://www.mkdocs.org/#installation) on your local machine.

### Compiling and previewing the docs

Start the docs local server. 

```sh
$ sh scripts/docs-serve.sh
```

In serve mode, mkdocs supports realtime updates, so changing your docs should update the help docs automatically.


### publishing the docs to S3

Note: [aws cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) needs to be installed and configured. 

```sh
$ sh scripts/docs-publish.sh
```


# References

Markdown preview tool for sublime allows you to preview the markdown in realtime. 

* https://packagecontrol.io/packages/Markdown%20Preview

Examples and references for markdown with material theme

* http://squidfunk.github.io/mkdocs-material/



