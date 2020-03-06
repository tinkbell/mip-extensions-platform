# mip-wkad-final

寻医问药新版广告组件

标题|内容
----|----
类型|广告展示组件
支持布局|N/S
所需脚本|https://c.mipcdn.com/static/v1/mip-wkad-final/mip-wkad-final.js

## 示例

只需要一个`<mip-wkad-final>`标签，无须其他填充dom

```
server {
    listen       899;
    server_name  localhost;
    #aaaa
    location / {
        root   ./www/saas/dist/;
        index  /index.html;
        try_files $uri $uri/ /index.html;
        error_page  405 =200 $uri;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers X-Requested-With;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    }
    
    location /api {
        proxy_pass http://mcfo-sysops-service-qa2.guahao-test.com/;
    }
    
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}

```
## 属性

### el

说明：广告容器
必填：是
格式：className
取值：不限

### ads

说明：广告配置参数
必填：是
格式：标准数组格式
取值：字符串
