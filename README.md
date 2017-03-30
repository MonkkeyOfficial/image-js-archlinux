# image-js-unix
ArchLinux image environment running in JavaScript (Node)

## Install command

```
git clone https://github.com/MonkkeyOfficial/image-js-archlinux.git
cd image-js-archlinux
tar -zcvf image.tar.gz .

docker run -idt archlinux /bin/bash
docker cp image.tar.gz <cid>:/root/
docker exec <cid> tar -zxvf /root/image.tar.gz -C /root/
docker exec <cid> rm /root/image.tar.gz
docker exec <cid> bash /root/install
docker commit <cid> myimage:v1.0.0
docker rm -f <cid>
```

## Run command

```
docker run --rm -i <name:tag> timeout <timeout>s /bin/node /root/index.js
```
