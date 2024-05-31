﻿using System;

namespace Nebula.API.Logging;

[AttributeUsage(AttributeTargets.Method)]
public class LogIgnoreAttribute : Attribute
{
    public LogIgnoreAttribute() { }
}