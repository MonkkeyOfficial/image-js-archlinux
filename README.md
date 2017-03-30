# image-js-unix
ArchLinux image environment running in JavaScript (Node)

## Install command

```
docker run -idt archlinux /bin/bash
docker cp image.tar.gz ...:/root/
docker attach ...
tar -zxvf image.tar.gz
rm image.tar.gz
bash install
Ctrl+P , Ctrl+Q
docker commit ... myImage:v1.0.0
docker rm -f ...
```

## Run command

```
docker run --rm -i ... timeout ...s /bin/node /root/index.js
```
