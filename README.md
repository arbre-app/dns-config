DNS configuration for `arbre.app`
=====

![Status](https://github.com/arbre-app/dns-config/actions/workflows/deploy.yml/badge.svg)

This repository holds a reproducible configuration for the DNS zone of the domain name `arbre.app`.
The configuration is managed through [`dnscontrol`](https://github.com/StackExchange/dnscontrol) and deployed by GitHub Actions upon pushes to the `master` branch.
For reproducibility reasons this repository shall be the single source of truth.

## Setup

### Installation

You must install [`dnscontrol`](https://stackexchange.github.io/dnscontrol/getting-started#1-install-the-software). You can then check that it is correctly installed:

```bash
$ dnscontrol version
dnscontrol v3.9.0-dev
```

### OVH API credentials

The domain is currently registered at OVH. Hence, the [OVH API](https://api.ovh.com/) has to be used.
To obtain a credential triplet (application key, application secret key and consumer key), head to [the following form](https://api.ovh.com/createToken/).

You will be asked to provide a title and a description; just use whatever names makes sense to you.

Ideally, set the the token to never expire (unless it is intended for temporary usage).

Then you should set the following access rules:

<details>
  <summary>Minimal rules (JSON)</summary>

  ```json
  {
    "accessRules": [
      {
        "method": "GET",
        "path": "/domain/zone"
      },
      {
        "method": "GET",
        "path": "/domain/zone/arbre.app"
      },
      {
        "method": "GET",
        "path": "/domain/zone/arbre.app/record"
      },
      {
        "method": "GET",
        "path": "/domain/zone/arbre.app/record/*"
      },
      {
        "method": "DELETE",
        "path": "/domain/zone/arbre.app/record/*"
      },
      {
        "method": "POST",
        "path": "/domain/zone/arbre.app/record"
      },
      {
        "method": "PUT",
        "path": "/domain/zone/arbre.app/record/*"
      },
      {
        "method": "POST",
        "path": "/domain/zone/arbre.app/refresh"
      },
      {
        "method": "GET",
        "path": "/domain/arbre.app/nameServer"
      },
      {
        "method": "GET",
        "path": "/domain/arbre.app/nameServer/*"
      },
      {
        "method": "PUT",
        "path": "/domain/arbre.app"
      },
      {
        "method": "POST",
        "path": "/domain/arbre.app/nameServers/update"
      }
    ]
  }
  ```
</details>

This should grant the both the minimal and sufficient rights to manage the domain `arbre.app`.

<details>
  <summary>Generic list of rules (provided for reference only)</summary>

  The above rules were derived from the [source code](https://github.com/StackExchange/dnscontrol/blob/master/providers/ovh/protocol.go).
  Note that the fields `zoneName` and `serviceName` correspond to the domain name (e.g. `arbre.app`).

  ```
  GET    /domain/zone
  GET    /domain/zone/{zoneName}
  GET    /domain/zone/{zoneName}/record
  GET    /domain/zone/{zoneName}/record/{id}
  DELETE /domain/zone/{zoneName}/record/{id}
  POST   /domain/zone/{zoneName}/record
  PUT    /domain/zone/{zoneName}/record/{id}
  POST   /domain/zone/{zoneName}/refresh
  GET    /domain/{serviceName}/nameServer
  GET    /domain/{serviceName}/nameServer/{id}
  PUT    /domain/{serviceName}
  POST   /domain/{serviceName}/nameServers/update
  ```
</details>

You don't have to enable the IP address whitelist, unless of course you know what you are doing.

Finally, enter the provided triplet in `creds.json` or as [GitHub Actions secrets](https://docs.github.com/en/actions/reference/encrypted-secrets).

You may verify locally the validity of the credentials with the following (stateless) command:

```
dnscontrol check-creds ovh OVH
```

(if you want to delete a token, check the endpoint `/me/api/application`)

## Making changes

### Updating the configuration

Everything takes places in the file `dnsconfig.js`. It is parsed as JavaScript but uses a custom DSL library.
The syntax is quite strict (e.g. no trailing commas, etc.), so make sure you perform a dry-run locally, as described below.
It is documented [here](https://stackexchange.github.io/dnscontrol/js).

**Do not** use double quotes for textual values containing spaces, they are already properly handled by the tool!

### Dry run

You can verify a configuration and safely review the expected changes (without actually modifying anything):

```
dnscontrol preview
```

### Normal run

To apply the changes, run the following command:

```
dnscontrol push
```

In practice this command is automatically run by GitHub Actions so you don't have to (and you shouldn't have to) run it.
In case you do, make sure to push the changes.
