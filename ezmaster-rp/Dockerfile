FROM nginx:1.13.3

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl

COPY ./entrypoint.sh /
COPY ./nginx.conf    /etc/nginx/nginx.conf
COPY ./index.html    /app/public/

# nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY ./ezmaster-instance-nginx.conf.tpl /etc/nginx/
COPY ./ezmaster-front-nginx.conf.tpl    /etc/nginx/
COPY ./ezmaster-webdav-nginx.conf.tpl   /etc/nginx/

# nginx logs
RUN mkdir -p /var/log/nginx/ezmaster-rp/instances/
RUN chmod go+rwX -R /var /run

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 35267
