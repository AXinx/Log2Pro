### Introduction

This project is to integrate workflow provenance data and system logs. Filese include:

buile.sh: build the prise service and push it to docker respository. 

- PRovenanceIntegratorSErvic: build Prise service.

- docker_workflow: includes workflow file(.t2flow) and provenance file(.ttl). 
  
  Also, after running docker-compose_prometheus.yml, can open wf service, and monior service like prometheus, grafana, cadvisor.
  
- docker: after running docker-compose.yml, can open prise service, and rabbit, influxdb service. 

So, next is how to use these files.

### Procedure of how to run this project

1. In docke_workflow, run docker-compose_prometheus.yml

```
sudo docker stack deploy demo -c docker-compose_prometheus.yml
```

2. Open Taverna, run one workflow and save values 

3. Run the build.sh

   Pay attention to the docker repository, you can change it your own repository. 

   But if so, remember to change the image name in docker/docker-compose.yml 
   
4. Open browser to URL http://localhost:9081/index3.html

   The port of cAdvisor is 8082.
   
   The port of Prometheus is 9090. 
   
   The port of Taverna service is 8089.
