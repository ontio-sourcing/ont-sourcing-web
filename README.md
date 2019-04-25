# falian_front

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 对接说明

1. 项目方注册 ONTID，登录后得到```access_token```
2. 根据Excel存证模板填写存证
3. 读取Excel文件，解析文件，构造存证并调用批量存证接口：
```

url：/api/v1/contract/put/batch
method：POST

{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJkaWQ6b250OkFNdmpVV1o2Y25BQVVzQk43dWpBQnRMUzlHbWVoOFNQU2oiLCJpc3MiOiJkaWQ6b250OkFhdlJRcVhlOVByYVY1dFlnQnF2VjRiVXE4TFNzdmpjV1MiLCJleHAiOjE1NTU5OTMzNjAsImlhdCI6MTU1NTkwNjk2MCwianRpIjoiMTYwY2FkNjNmZTdkNGY5MTk3NGFjZjQzYWNlMzkzNmYiLCJjb250ZW50Ijp7InR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJvbnRpZCI6ImRpZDpvbnQ6QWExWFBhcEpIR0dqSFF0TjJIZHliOUFQdjdIZmlZeHRSeiJ9fQ.MDE5MzE3ODk4ODU2MGQ5NGQ3MTBmZTc2Mzg1ZWE0OWRiMmRjZjczZmU2NjAyYjU0NjI2YWE0MmJmZWYwYTFkYTE0ODI5YWVmYTJjNjNlMTA5N2Y2ZjM0YTJlMTJmOGYwNWNmYzRhZWI3NzlkOWEwMWY2NDY1Y2VjYWM1MzNjYjk5Ng",
    "user_ontid": "did:ont:Aa1XPapJHGGjHQtN2Hdyb9APv7HfiY7890",
    "filelist": [
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927777777",
            "type": "INDEX",
            "detail": [
                {
                    "name": "img1",
                    "hash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927888888",
                    "message": ""
                },
                {
                    "name": "img2",
                    "hash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927999999",
                    "message": ""
                },
                {
                    "name": "img3",
                    "hash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927000000",
                    "message": ""
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927888888",
            "type": "IMAGE",
            "detail": [
                {
                    "message": "http://...."
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927999999",
            "type": "IMAGE",
            "detail": [
                {
                    "message": "http://...."
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927000000",
            "type": "IMAGE",
            "detail": [
                {
                    "message": "http://...."
                }
            ]
        }
    ]
}

```
