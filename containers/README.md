## Setup dev env

In case of Windows, use WSL, preferrably Ubuntu 22.x

```bash
bash -x setup-dev.sh
```

### Windows shenanigans

* dev domains are defined under WSL /etc/hosts. must move the optirec line to C:\\Windows\System32\Drivers\etc\hosts

## Usage

* `rec <service>` - restart remote service (pulls latest version)
* `teler <service>` - runs local service in the cluster (must be located in the relevant root directory)
