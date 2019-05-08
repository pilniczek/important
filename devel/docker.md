# Doker

## Installation
**Wind10 Pro:** https://docs.docker.com/docker-for-windows/install/

**Wind10 Home:** https://docs.docker.com/toolbox/toolbox_install_windows/

**Ubuntu:**
* https://medium.com/@Grigorkh/how-to-install-docker-on-ubuntu-19-04-7ccfeda5935
* https://docs.docker.com/install/linux/linux-postinstall/
* **Tip:** Log out then log in after these steps.

## Win10 Home
Run Docker Toolbox
Run CMD
* `docker build -t <name> .`: packages a Dockerfile into an image
* `docker run <name>`: starts a Docker image and turns it into a container
* `docker run -p 27017:27017 -p 28017:28017 <name>`: run and expose ports
* `docker exec -it <name> /bin/bash`: acces container bash
* `docker stop <name>`: stop running container
* `docker start <name>`
* `docker container ls`: list containers
* `docker ps`: process status
* `docker rm <name>`
* `docker images`: list of available images

**Params**
* `-d` or `--detach`: run at the background to allow writing other commands
* `--name <some_name>`: name it for easy re-access

---

### Expose IP
IP not exposed to localhost?

Try 192.168.99.100!

(Taken from `docker-machine ip default` command.)

**Note:** Maybe it is only **Win10 Home - Docker Toolbox** issue. https://stackoverflow.com/questions/42866013/docker-toolbox-localhost-not-working

---

if: `docker: Error response from daemon: port is already allocated`

run: `docker container ls` (list containers) or `docker ps` (process status)

then: `docker rm -f <container-name-or-hash>`

---

Dockerfile example

```
# Build off this base image
FROM node:7

# Set up app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose the server to the host machine
EXPOSE 8080

# Run this command on startup
ENTRYPOINT ["npm", "start"]
```

---

**Future reading**

* Docker Compose
* Kubernetes
* Docker Swarm
* Apache Mesos
* Docker Networking
