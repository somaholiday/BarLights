FROM resin/rpi-raspbian
MAINTAINER abresas@resin.io

# Let's start with some basic stuff.
RUN apt-get update -qq && apt-get install -qqy \
    apt-transport-https \
    ca-certificates \
    curl \
    lxc \
    iptables
    
# Install Docker from Docker Inc. repositories.
COPY ./docker /usr/bin/docker
CHMOD u+x /usr/bin/docker

# Install the magic wrapper.
ADD ./wrapdocker /usr/local/bin/wrapdocker
RUN chmod +x /usr/local/bin/wrapdocker

RUN curl -L https://github.com/hypriot/compose/releases/download/1.1.0-raspbian/docker-compose-Linux-armv7l > /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

RUN echo "#!/bin/bash\nDOCKER_HOST=unix:///var/run/rce.sock /usr/local/bin/docker-compose $@" > /usr/bin/docker-compose
RUN chmod +x /usr/bin/docker-compose

RUN mkdir /docker_root
COPY ./app /docker_root/app
COPY ./server /docker_root/server
COPY ./docker-compose.yml /docker_root/docker-compose.yml
WORKDIR /docker_root

# Define additional metadata for our image.
VOLUME /var/lib/rce
CMD ["wrapdocker"]
