# Procedure of how to run this project

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
