# savml-contract-view

savml contract viewer

## useage

```
export UNPKG_URL=//localhost:4874
export VERDACCIO_URL=//localhost:4873
export PKG_PREFIX=com.
export PORT=4875
svc

alias vscv='export UNPKG_URL=//localhost:4874 VERDACCIO_URL=//localhost:4873 PKG_PREFIX=com. PORT=4875; scv'
```

## development

touch .env.development

```
VUE_APP_UNPKG_URL = '//localhost:4874'
VUE_APP_VERDACCIO_URL = '//localhost:4873'
VUE_APP_PKG_PREFIX = 'com.'
PORT=4875
NODE_ENV=development
```
