# EzMaster for ops

EzMaster has [requirements](DEVELOPER.md#requirements) and can be [customized with env parameters](DEVELOPER.md#environment-variables).

## Install and run for production

```shell
mkdir ./ezmaster && cd ezmaster
mkdir -p ./data/applications ./data/instances ./data/manifests
mkdir -p ./logs/ezmaster-front/ ./logs/ezmaster-rp/instances/ ./logs/ezmaster-webdav/

wget https://raw.githubusercontent.com/Inist-CNRS/ezmaster/4.3.2/docker-compose.yml
export EZMASTER_PUBLIC_IP="<Your ezmaster server IP>"
export EZMASTER_FREE_PORT_RANGE="49152-60000"
export EZMASTER_FULL_FS_PERCENT=80
export EZMASTER_PUBLIC_DOMAIN="lod-test.istex.fr"
export EZMASTER_PUBLIC_PROTOCOL="http"
export EZMASTER_USER="ezmaster"
export EZMASTER_PASSWORD="changeme"
docker-compose up -d

# then ezmaster is listening at http://<Your ezmaster server IP>:35268
# and publicly available on http://ezmaster.lod-test.istex.fr (protected by login/pwd)
# and the instances can be accessed at http://<tech-name>.lod-test.istex.fr
```

When you want to **upgrade EzMaster**, you just have to download the new EzMaster docker-compose.yml file add the (maybe) new env parameters, follow the [upgrade instructions](UPGRADE.md) and type again ``docker-compose up -d``

## FAQ

### How to save the data and config of the instances ?

If you want to save the config and the data of your instances:
- you have to recursivly save the `data/applications`, `data/manifests` and `data/instances` folders (or simply `data/`).
- you also have to save the mongodb database contained in the ezmaster_db docker container:
  
  ```
  docker exec -it ezmaster_db mongodump --quiet --archive=- > ezmaster_db_archive
  ```
  
  (ezmaster_db will be deprecated in ezmaster ⩾ v5)

### How to use ezmaster behind Apache reverse proxy ?

You should add a dedicated VirtualHost : 
```
<VirtualHost *:80>
    ServerName exemple.fr
    ServerAlias *.exemple.fr
    ProxyPreserveHost On
    ProxyPass        / http://192.168.100.10:35267/   # Replace IP with yours
    ProxyPassReverse / http://192.168.100.10:35267/   # Replace IP with yours
</VirtualHost>
``` 