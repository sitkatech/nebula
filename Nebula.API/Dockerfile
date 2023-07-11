FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /src

COPY ./Nebula.Models ./Nebula.Models
COPY ./Nebula.EFModels ./Nebula.EFModels
COPY ./Nebula.API ./Nebula.API

RUN dotnet publish ./Nebula.API/Nebula.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app /app
EXPOSE 80
ENTRYPOINT ["dotnet", "Nebula.API.dll"]
