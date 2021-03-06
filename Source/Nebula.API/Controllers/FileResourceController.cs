﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nebula.API.Services;
using Nebula.API.Services.Authorization;
using Nebula.EFModels.Entities;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Nebula.API.Controllers
{
    [ApiController]
    public class FileResourceController : SitkaController<FileResourceController>
    {
        public FileResourceController(NebulaDbContext dbContext, ILogger<FileResourceController> logger, KeystoneService keystoneService, IOptions<NebulaConfiguration> nebulaConfiguration) : base(dbContext, logger, keystoneService, nebulaConfiguration)
        {
        }

        [HttpPost("FileResource/CkEditorUpload")]
        [AdminFeature]
        public async Task<ActionResult<object>> CkEditorUpload()
        {
            byte[] bytes;


            using (var ms = new MemoryStream(2048))
            {
                await Request.Body.CopyToAsync(ms);
                bytes = ms.ToArray();
            }

            var userDto = UserContext.GetUserFromHttpContext(_dbContext, HttpContext);
            var queryCollection = Request.Query;

            var fileResourceMimeType = FileResourceMimeType.GetFileResourceMimeTypeByContentTypeName(_dbContext,
                queryCollection["mimeType"].ToString());

            var clientFilename = queryCollection["clientFilename"].ToString();
            var extension = clientFilename.Split('.').Last();
            var fileResourceGuid = Guid.NewGuid();
            var fileResource = new FileResource
            {
                CreateDate = DateTime.Now,
                CreateUserID = userDto.UserID,
                FileResourceData = bytes,
                FileResourceGUID = fileResourceGuid,
                FileResourceMimeTypeID = fileResourceMimeType.FileResourceMimeTypeID,
                OriginalBaseFilename = clientFilename,
                OriginalFileExtension = extension,
            };

            _dbContext.FileResource.Add(fileResource);
            _dbContext.SaveChanges();

            return Ok(new { imageUrl = $"/FileResource/{fileResourceGuid}" });
        }


        [HttpGet("FileResource/{fileResourceGuidAsString}")]
        public ActionResult DisplayResource(string fileResourceGuidAsString)
        {
            var isStringAGuid = Guid.TryParse(fileResourceGuidAsString, out var fileResourceGuid);
            if (isStringAGuid)
            {
                var fileResource = _dbContext.FileResource.Include(x => x.FileResourceMimeType).SingleOrDefault(x => x.FileResourceGUID == fileResourceGuid);

                return DisplayResourceImpl(fileResourceGuidAsString, fileResource);
            }
            // Unhappy path - return an HTTP 404
            // ---------------------------------
            var message = $"File Resource {fileResourceGuidAsString} Not Found in database. It may have been deleted.";
            _logger.LogError(message);
            return NotFound(message);
        }

        private ActionResult DisplayResourceImpl(string fileResourcePrimaryKey, FileResource fileResource)
        {
            if (fileResource == null)
            {
                var message = $"File Resource {fileResourcePrimaryKey} Not Found in database. It may have been deleted.";
                _logger.LogError(message);
                return NotFound(message);
            }

            switch (fileResource.FileResourceMimeType.FileResourceMimeTypeName)
            {
                case "X-PNG":
                case "PNG":
                case "TIFF":
                case "BMP":
                case "GIF":
                case "JPEG":
                case "PJPEG":
                    return File(fileResource.FileResourceData, fileResource.FileResourceMimeType.FileResourceMimeTypeContentTypeName);
                default:
                    throw new NotSupportedException("Only image uploads are supported at this time.");
            }
        }

    }
}
