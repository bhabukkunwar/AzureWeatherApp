# To run the application without docker make sure you have npm and node installed, then follow the following steps.

i. npm install

ii. node app.js

# Setup env file

create a .env file in the root directory with the variables in .example.env file. To generate the API key for your app sign up for [Open Weather Map API](https://openweathermap.org/api) and request one.

# Build docker image locally

docker build -t azure-web-app .

# Deploy the image locally
docker run -p 3000:3000 azure-web-app

# Test locally

curl http://localhost:3000 or open http://localhost:3000 in your browser


# Azure Container Registry (ACR) and Azure Container Instances (ACI) Setup

## ACR

1. Login to Azure:
    ```sh
    az login
    ```

2. Create a resource group:
    ```sh
    az group create --name RG-Az204 --location eastus
    ```

3. Create an Azure Container Registry (ACR):
    ```sh
    az acr create --resource-group RG-Az204 --name azurewebappregistry --sku Basic
    ```

4. Login to the ACR:
    ```sh
    az acr login --name azurewebappregistry
    ```

5. Tag your Docker image:
    ```sh
    docker tag azure-web-app azurewebappregistry.azurecr.io/azure-web-app:latest
    ```

6. Push your Docker image to the ACR:
    ```sh
    docker push azurewebappregistry.azurecr.io/azure-web-app:latest
    ```

### Service Principal

- **Secret ID:** `<sp-secret-id>`
- **Secret Value:** `<sp-secret-value>`
- **Client ID:** `<sp-client-id>`

## ACI

1. Show the ACR login server:
    ```sh
    az acr show --name azurewebappregistry --query loginServer
    ```

2. Create an Azure Container Instance (ACI):
    ```sh
    az container create --resource-group RG-Az204 --name aci-web-app --image azurewebappregistry.azurecr.io/azure-web-app:latest --cpu 1 --memory 1 --registry-login-server azurewebappregistry.azurecr.io --registry-username <sp-client-id> --registry-password <sp-secret-value> --ip-address Public --dns-name-label azurewebappcontainer --ports 3000 --environment-variables PORT=3000
    ```

3. Check the state of the container instance:
    ```sh
    az container show --resource-group RG-Az204 --name aci-web-app --query instanceView.state
    ```

4. Get the fully qualified domain name (FQDN) of the container instance:
    ```sh
    az container show --resource-group RG-Az204 --name aci-web-app --query ipAddress.fqdn
    ```

5. View the logs of the container instance:
    ```sh
    az container logs --resource-group RG-Az204 --name aci-web-app
    ```

Note: Make sure to replace `<sp-secret-id>`, `<sp-secret-value>`, and `<sp-client-id>` with the actual values from your Azure Service Principal.

**Deployment URL**: Get the FQDN from step 4 and access 3000 port in your browser to access the web deployed app i.e `<FQDN>`:3000
