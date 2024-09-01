# To run the application without docker make sure you have npm and node installed, then follow the following steps.

i. npm install

ii. node app.js

# Setup env file

create a .env file in the root directory with the variables in .example.env file. To generate the API key for your app sign up for [Open Weather Map API](https://openweathermap.org/api) and request one.

# Build docker image locally

docker build -t azure-web-app .

# Deploy the image locally
docker run -p 80:80 azure-web-app

# Test locally

curl http://localhost or open http://localhost in your browser


# Azure Container Registry (ACR) and Azure Container Instances (ACI) Setup

### Service Principal

- **Client Secret Value:** `<sp-secret-value>`
- **Client ID:** `<sp-client-id>`

## ACR

1. Login to Azure:
    ```sh
    az login
    ```

2. Create a resource group:
    ```sh
    az group create --name rg-az-weather-app --location eastus
    ```

3. Create an Azure Container Registry (ACR):
    ```sh
    az acr create --resource-group rg-az-weather-app  --name azureweatherappregistry --sku Basic
    ```

4. Login to the ACR:
    ```sh
    az acr login --name azureweatherappregistry
    ```
    
5. Show the ACR login server:
    ```sh
    az acr show --name azurewebappregistry --query loginServer
    ```
    
6. Login ACR with docker:
    ```sh
    docker login azureweatherappregistry.azurecr.io --username <sp-client-id> --password <sp-client-id>
    ```

7. Tag your Docker image:
    ```sh
    docker tag azure-weather-app azureweatherappregistry.azurecr.io/azure-weather-app:latest
    ```

8. Push your Docker image to the ACR:
    ```sh
    docker push azureweatherappregistry.azurecr.io/azure-weather-app:latest
    ```


## ACI



2. Create an Azure Container Instance (ACI):
    ```sh
    az container create --resource-group rg-az-weather-app --name aci-weather-app --image azureweatherappregistry.azurecr.io/azure-weather-app:latest --cpu 1 --memory 1 --registry-login-server azureweatherappregistry.azurecr.io --registry-username <sp-client-id> --registry-password <sp-secret-value> --ip-address Public --dns-name-label azurewebappcontainer --ports 80
    ```

3. Check the state of the container instance:
    ```sh
    az container show --resource-group rg-az-weather-app --name aci-weather-app --query instanceView.state
    ```

4. Get the fully qualified domain name (FQDN) of the container instance:
    ```sh
    az container show --resource-group rg-az-weather-app --name aci-weather-app --query ipAddress.fqdn
    ```

5. View the logs of the container instance:
    ```sh
    az container logs --resource-group rg-az-weather-app --name aci-weather-app
    ```

Note: Make sure to replace `<sp-secret-id>`, `<sp-secret-value>`, and `<sp-client-id>` with the actual values from your Azure Service Principal.

**Deployment URL**: Get the FQDN from step 4 and access 80 port in your browser to access the web deployed app i.e https://<FQDN>
