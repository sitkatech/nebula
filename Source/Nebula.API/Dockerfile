FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src

COPY ./Nebula.Models ./Nebula.Models
COPY ./Nebula.EFModels ./Nebula.EFModels
COPY ./Nebula.API ./Nebula.API

RUN dotnet publish ./Nebula.API/Nebula.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app /app
RUN ls -la
EXPOSE 80
ENTRYPOINT ["dotnet", "Nebula.API.dll"]
