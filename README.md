# Gravitate Health Lens Selector Example

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---
## Table of contents

- [Gravitate Health Lens Selector Example](#gravitate-health-lens-selector)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Usage](#usage)
  - [Avaible Lenses](#avaible-lenses)
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

Service will be accessible internally from the kubernetes cluster with the url `http://lens-selector-mvp2.default.svc.cluster.local:3000/focus`

---
## Avaible Lenses

The lenses are based on the following definition

![avaible lenses](./images/lenses-mvp2.png)

The lenses that are avaible in this package or in testing are detailed on this table

| LENSE     | DESCRIPTION                                                                                        |
|-----------|----------------------------------------------------------------------------------------------------|
| Pregnancy | _Hightlights the pregnancyCategory_, _breastfeedingCategory_, _contra-indication-pregancy_ classes |
| Diabetes  |                                                                                                    |
---
## Known issues and limitations


It only recognises ePIs anotated with the \<span class=" "> method and the classes mentioned in the table above.

---
## Getting help

Open an issue if any bug is detected

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
- Alejo Esteban ([@10alejopain](https://github.com/))


---
## Acknowledgments
