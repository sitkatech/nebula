FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src

COPY ./Nebula.Models ./Nebula.Models
COPY ./Nebula.EFModels ./Nebula.EFModels
COPY ./Nebula.API ./Nebula.API

RUN dotnet publish ./Nebula.API/Nebula.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS final
WORKDIR /app
COPY --from=build /app /app
RUN ls -la
EXPOSE 80
ENTRYPOINT ["dotnet", "Nebula.API.dll"]
