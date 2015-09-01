# U.S. Federal Web Design Standards

[![Build Status](https://api.travis-ci.org/18F/usfwds.svg?branch=18f-pages-staging)](https://travis-ci.org/18F/usfwds)

This is the repo for the U.S. Federal Web Design Standards project.
The structural setup of this repo is based off of the 18F pages project: 
[https://github.com/18F/pages](https://github.com/18F/pages)

## Use
Warning! This library is currently not ready for use as it is actively being developed.

The best way to currently use the library would be to follow the Setup instructions below,
copy the full `_site/assets/` directory to a relevant place in your code base, and link
`_site/assets/css/main.css` into your html. So something like this:

- `cp ./_site/assets/css/main.css /path/to/your/repo/static/dir`
- `<link rel="stylesheet" href="/path/to/your/assets/css/main.css" media="screen" />

## Setup for your local environment

### Requirements

You will need [Ruby](https://www.ruby-lang.org) ( > version 2.1.5 ). You may
consider using a Ruby version manager such as
[rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) to
help ensure that Ruby version upgrades don't mean all your
[gems](https://rubygems.org/) will need to be rebuilt.

On OS X, you can also use [Homebrew](http://brew.sh/) to install Ruby in
`/usr/local/bin`, which may require you to update your `$PATH` environment
variable. Here are the commands to follow to install via homebrew:

```shell
$ brew update
$ brew install ruby
```

### Installation

Now that you have verified that you have Ruby installed, clone and run the 
following [go](https://golang.org/) commands to initialize and serve the library locally.

```shell
$ git clone git@github.com:18F/usfwds.git
$ cd usfwds
$ ./go init
$ ./go serve
```

You should now be able to visit `http://127.0.0.1:4000/usfwds/` 
and view the web design standards locally.

Questions or need help with setup? Feel free to open an issue here [https://github.com/18F/usfwds/issues](https://github.com/18F/usfwds/issues).


### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
