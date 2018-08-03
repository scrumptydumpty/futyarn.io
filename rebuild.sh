if [ "$1" == "nocontainer" ]; then
echo "Starting new container.."
 docker build -t nginx . && docker run -d --name nginx -p 80:80 -p 443:443 --network br0 --restart=always -v /etc/letsencrypt/:/etc/letsencrypt/ -v /home/jake/docker/nginx/www:/var/www nginx
else
echo "Restarting container..!"
 docker stop nginx && docker rm nginx && docker build -t nginx . && docker run -d --name nginx -p 80:80 -p 443:443 --network br0 --restart=always -v /etc/letsencrypt/:/etc/letsencrypt/ -v /home/jake/docker/nginx/www:/var/www nginx
  7 fi
~