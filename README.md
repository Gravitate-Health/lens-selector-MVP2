# Gravitate Health Lens Selector Example

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---
## Table of contents

- [Gravitate Health Lens Selector Example](#gravitate-health-lens-selector-example)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Hackaton Considerations](#hackaton-considerations)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Usage](#usage)
  - [Known issues and limitations](#known-issues-and-limitations)
  - [Getting help](#getting-help)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authors and history](#authors-and-history)
  - [Acknowledgments](#acknowledgments)

---
## Introduction

This repository contains an example of a lens selector. A lens selector provides a list of lens names, and also provides the lenses to the focusing manager.

---
## Hackaton Considerations
This repository serves as an skeleton for a lens selector. It is written in typescript and contains sample lenses: an [example for pregnancy](./src/lenses/lens-selector-example_pregnancy.js), and a [blank lens](./src/lenses/lens-selector-example_blank.js) to serve as a lens template. The lens will receive an ePI, IPS, PersonaVector and an HTML string, which is part of the Package Leaflet of the IPS. The lens will be executed once per package leaflet, each iteration receiving a section of the leaflet.

In this example, the lenses are in the [src/lenses](./src/lenses) folder. Lenses must be compliant with the Lens Execution Environment document. Lenses name (the files) must follow this format: `lens-selector-teamN_lens-name`. It is important to follow this convention, as the focusing manager uses it to redirect each petition to the correct lens selector. E.g: Fot the team number 3, a lens could be `lens-selector-team3_immunodeficiency`.

The hackathon participants may write the lens selector in the way that best suits for them. Participants can use any programming language, framework or technology. The only thing that is mandatory is that the lens selector serves an API that is compliant with the [OpenApi Specification](./openapi.yaml) within this repository. Also, the service must listen for HTTP connections on port 3000. Note that this service will not be accessible over the internet when deployed in the Gravitate Health infrastructure, and will be an internal service that is used via the Hackathon web interface.

Participants must provide the image name of the lens selector to the Hackathon organizers and deployment is automatized.

Participants must fork this proyect into their personal github account. 

The way the lens selector is deployed in the infrascturcure is done with a Github action, which is included in the repository. The action can be found at [.github/workflows/docker-image.yml](./.github/workflows/docker-image.yml), and it builds a Docker image with the syntax `ghcr.io/GITHUB_USERNAME/REPOSITORY_NAME`, tagging the latest version of the image as `latest`, and then publishes it to ghcr.io (Github container Registry). The name of this image must be provided to the Hackaton organizers so they can deploy a service running the developed preprocessing service to be tested within the infrastructure. Participants are advised not to edit this Github Action.

Once the lens selector is deployed to the infrastructure, the name of the lenses will be presented in the Hackathon frontend as `lenses-teamN-lense-name`, being `N` the name of the team, and `lense-name` the name of the lense.


---
## Kubernetes Deployment

1. Create the following resources:
```bash
kubectl apply -f kubernetes-yaml/001_lens-selector-example-service.yaml
kubectl apply -f kubernetes-yaml/002_lens-selector-example-deployment.yaml
```

In order to be discovered by the focusing manager, the service.yaml needs to include the following selector in the `spec` field:

```yaml
metadata:
  labels:
    eu.gravitate-health.fosps.focusing: "true"
```

---
## Usage

Service will be accessible internally from the kubernetes cluster with the url `http://lens-selector-example.default.svc.cluster.local:3000/focus`

---
## Known issues and limitations

---
## Getting help

---
## Contributing

---
## License

This project is distributed under the terms of the [Apache License, Version 2.0 (AL2)](http://www.apache.org/licenses/LICENSE-2.0).  The license applies to this file and other files in the [GitHub repository](https://github.com/Gravitate-Health/Focusing-module) hosting this file.

```
Copyright 2022 Universidad Politécnica de Madrid

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
---
## Authors and history

- Guillermo Mejías ([@gmej](https://github.com/gmej))


---
## Acknowledgments
