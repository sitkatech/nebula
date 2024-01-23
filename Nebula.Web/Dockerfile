FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
COPY Nebula.Web/.nvmrc                        ./Nebula.Web/.nvmrc
RUN NODE_VERSION=$(cat Nebula.Web/.nvmrc) \
    && echo "Installing Node Version: ${NODE_VERSION}" \
    && curl -SL "https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && curl -SL "https://nodejs.org/dist/${NODE_VERSION}/SHASUMS256.txt" --output SHASUMS256.txt \
    && grep "linux-x64.tar.gz" SHASUMS256.txt > sha-sum.txt \
    && NODE_DOWNLOAD_SHA=$(awk '{print $1}' sha-sum.txt) \
    && echo "${NODE_DOWNLOAD_SHA} nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz SHASUMS256.txt sha-sum.txt \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs
    
COPY Nebula.Web/                        ./Nebula.Web

RUN dotnet restore Nebula.Web/Nebula.Web.csproj

RUN dotnet build ./Nebula.Web/Nebula.Web.csproj -c Release -o /app
WORKDIR /src/Nebula.Web/

RUN npm cache clean --force
RUN npm uninstall   -g angular-cli
RUN npm install     -g @angular/cli@13.3.11
RUN npm install

ARG env
RUN npm run build-${env}

FROM build AS publish
RUN dotnet publish Nebula.Web.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Nebula.Web.dll"]
