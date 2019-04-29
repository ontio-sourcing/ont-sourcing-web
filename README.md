# ont-sourcing-web

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
                    "textLine": ["2d校园","文本"，2d校园","文本"，2d校园","文本"...],
                    "imageList":["56e481f7a93a924813440bee96b68f0742b014ed426b7535ad35d072984b2c0f",
                    "56e481f7a93a924813440bee96b68f0742b014ed426b7535ad35d072984b2c0f",
                    "56e481f7a93a924813440bee96b68f0742b014ed426b7535ad35d072984b2c0f"...]
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927888888",
            "type": "IMAGE",
            "detail": [
                {
                    "imgUrl": "http://...."
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927999999",
            "type": "IMAGE",
            "detail": [
                {
                    "imgUrl": "http://...."
                }
            ]
        },
        {
            "filehash": "e81475b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927000000",
            "type": "IMAGE",
            "detail": [
                {
                    "imgUrl": "http://...."
                }
            ]
        }
    ]
}

```
## 前端对接所用到的其他接口
1.本体存证首页列表调用浏览器存证历史记录接口
```
url：/api/v1/contract/explorer
method：POST

{
    "pageNum": 1,
    "pageSize": 10
}

```
2.搜索调用浏览器根据hash取证接口
```
url：/api/v1/contract/explorer/hash
method：POST

{
    "hash":"111175b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927999999"
}
```
3.存证记录根据登录获取到access_token调用 获取存证历史记录以及获取存证总条数接口
(1)获取存证总条数接口

```
url：/api/v1/contract/count
method：POST

{
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJkaWQ6b250OkFNdmpVV1o2Y25BQVVzQk43dWpBQnRMUzlHbWVoOFNQU2oiLCJpc3MiOiJkaWQ6b250OkFhdlJRcVhlOVByYVY1dFlnQnF2VjRiVXE4TFNzdmpjV1MiLCJleHAiOjE1NTUwNTU3MzksImlhdCI6MTU1NDk2OTMzOSwianRpIjoiZjQ1ZmMyMmVkMjBhNDFhMGE1YzdhMzZhYjIxZTkxNTAiLCJjb250ZW50Ijp7InR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJvbnRpZCI6ImRpZDpvbnQ6QU14clNHSHl4Z25XUzZxYzFRalROWWVFYXczWDNEdnpoZiJ9fQ.MDFiZDVhYWQ2MzRkNzlkOTU3ZjE3YWYyNDc3MDUyZGUxNzJjYjdmYjgxZWViOThmYTg2ODgyM2ZiYjM5ZjIyMjZiYWZlYTlkNGFkNjMwMzM0OWY4N2YyYzBiZDlmNzg5M2IzYjhiYjdkZTg1MjFmYzQ1MDMwOGY2NGRmM2E5ZjkwNg"
}
```
(2)获取存证历史记录接口

```
url：/api/v1/contract/history
method：POST

{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJkaWQ6b250OkFNdmpVV1o2Y25BQVVzQk43dWpBQnRMUzlHbWVoOFNQU2oiLCJpc3MiOiJkaWQ6b250OkFhdlJRcVhlOVByYVY1dFlnQnF2VjRiVXE4TFNzdmpjV1MiLCJleHAiOjE1NTU5OTMzNjAsImlhdCI6MTU1NTkwNjk2MCwianRpIjoiMTYwY2FkNjNmZTdkNGY5MTk3NGFjZjQzYWNlMzkzNmYiLCJjb250ZW50Ijp7InR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJvbnRpZCI6ImRpZDpvbnQ6QWExWFBhcEpIR0dqSFF0TjJIZHliOUFQdjdIZmlZeHRSeiJ9fQ.MDE5MzE3ODk4ODU2MGQ5NGQ3MTBmZTc2Mzg1ZWE0OWRiMmRjZjczZmU2NjAyYjU0NjI2YWE0MmJmZWYwYTFkYTE0ODI5YWVmYTJjNjNlMTA5N2Y2ZjM0YTJlMTJmOGYwNWNmYzRhZWI3NzlkOWEwMWY2NDY1Y2VjYWM1MzNjYjk5Ng",
    "pageNum": 1,//第几页
    "pageSize": 10,//每页显示的条数
    "type":"INDEX"
}
```

4.存证记录以及首页列表点击详情进入存证详情页面：通过存证编号 调用浏览器根据hash取证接口
```
url：/api/v1/contract/explorer/hash
method：POST

{
    "hash":"111175b25e49f2767522d332057c3e6bb1144c842dce47913dc8222927999999"
}
```