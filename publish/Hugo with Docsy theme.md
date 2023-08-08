---
title: Hugo with Docsy theme
dateCreated: 2022-05-19T00:28
dateModified: 2023-08-09T01:48
---

## Install Hugo

### macOS

```bash
brew install hugo   # install hugo-extended
```

### Windows

Download binary at release page of Hugo: https://github.com/gohugoio/hugo/releases .

For example, press `Show all xx assets` first, then download `hugo_extended_x.xxx.x_windows-amd64.zip`, then unzip it, and add the path of `hugo.exe` to `PATH` environment variable.

## Install Docsy theme

### Preparation

Install NodeJS first. Then install packages below:

- autoprefixer
- postcss-cli
- postcss

For convenience, I construct a `package.json` at the root dir of my repo:

```json
{
  "devDependencies": {
    "autoprefixer": "^10.4.7",
    "postcss-cli": "^9.1.0",
    "postcss": "^8.4.0"
  }
}
```

For example, at MacOS:

```bash
brew install node   # install nodejs
npm install     # install depdendencies
```

### Clone Docsy theme

Add [Docsy](https://github.com/google/docsy) as submodule to your repo:

```bash
git submodule add https://github.com/google/docsy.git themes/docsy
git submodule update --init --recursive # init submodules inside Docsy
```

## Deploy using Github Action

New a yaml file at `.github/workflows/gh-pages.yml`, contents as below:

```yaml
name: GitHub Pages

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }} # cancel same job if a newer commit's job is running
    steps:
    - uses: actions/checkout@v3
      with:
        submodules: recursive # recursively checkout submodules
        fetch-depth: 0
    - name: Setup Node  
      uses: actions/setup-node@v2
      with:
        node-version: 14.x
    - name: Prepare for Docsy
      run: npm install
    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: "latest"
        extended: true    # use hugo-extended
    - name: Build
      run: hugo --minify
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      if: ${{ github.ref == 'refs/heads/main' }}  # triggered only at main branch
      with:
        github_token: ${{ secrets.GH_TOKEN }} # needs to set actions secret variable first, https://docs.github.com/cn/actions/security-guides/automatic-token-authentication
        publish_dir: ./public
```

Then you need to change your source branch to `gh-pages` at `Settings > Code and automation > Pages > Source`.

## Example repo

https://github.com/nero19960329/nero19960329.github.io
