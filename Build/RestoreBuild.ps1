

"Restore Nebula"
& "$PSScriptRoot\DatabaseRestore.ps1"  -iniFile "./build.ini"

"Build Nebula"
& "$PSScriptRoot\DatabaseBuild.ps1" -iniFile "./build.ini"
